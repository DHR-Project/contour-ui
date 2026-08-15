"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

// contour-spec-dropdown-v2.md SSA.5 -- 24px edge threshold, driven by
// requestAnimationFrame rather than a scroll listener (same measurement
// technique as the velocity-adaptive Progressive Blur, SS2.10).
const AUTO_SCROLL_EDGE_PX = 24;
const AUTO_SCROLL_SPEED_PX = 10;
// "open" activation only (see below) -- mirrors ListItem's own long-press
// move tolerance (LONG_PRESS_MOVE_TOLERANCE_PX), a separate constant since
// it gates a different gesture phase.
const DRAG_MOVE_TOLERANCE_PX = 10;

export interface DragSelectTarget {
  /** Called when the drag is released while this row is under the finger. */
  onSelect: () => void;
}

interface UseDragSelectCommonOptions {
  /** Gate on `pointer: coarse` (rule 4.1) -- desktop mouse never drives this. */
  enabled: boolean;
  open: boolean;
  /** Rows currently rendered inside `containerRef`, in DOM order (only the
   *  active screen -- see dropdown.tsx's scope note on nested flyouts). */
  targets: DragSelectTarget[];
  containerRef: RefObject<HTMLElement | null>;
}

type UseDragSelectOptions =
  | (UseDragSelectCommonOptions & {
      /** Dropdown (SSA.5): touchstart on the trigger opens the menu and
       *  starts the drag session in the same gesture -- call `onOpenRequest`
       *  and spread `triggerDragProps` onto the trigger. Default. */
      activation?: "trigger";
      onOpenRequest: () => void;
    })
  | (UseDragSelectCommonOptions & {
      /** ContextMenu (SS3): the menu's open event is a synthetic long-press
       *  dispatch the *consumer* fires while the finger is still down, so
       *  there's no separate "trigger pointerdown" moment to hook -- the
       *  drag session starts on its own as soon as `open` flips true.
       *  Commits only once the finger has actually moved past
       *  DRAG_MOVE_TOLERANCE_PX, so a stationary release right after the
       *  long press -- which lands on whatever row Radix happened to
       *  position at the press point -- doesn't silently select it; only a
       *  deliberate drag onto a row does. */
      activation: "open";
    });

/**
 * touchmove hit-tests the finger against each row (marked with
 * `data-drag-select-index`) and highlights whichever one it's over;
 * touchend commits that row's `onSelect`, or closes with no selection if the
 * finger isn't over a row. See `activation` above for how the drag session
 * itself begins -- that's the one thing that differs between Dropdown and
 * ContextMenu.
 */
export function useDragSelect(options: UseDragSelectOptions) {
  const { enabled, open, targets, containerRef } = options;
  const activation = options.activation ?? "trigger";
  const onOpenRequest = options.activation === "open" ? undefined : options.onOpenRequest;
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const draggingRef = useRef(false);
  const scrollDirectionRef = useRef<0 | 1 | -1>(0);
  const rafHandleRef = useRef<number | null>(null);
  // "open" activation only -- tracks whether the finger has moved past
  // DRAG_MOVE_TOLERANCE_PX yet, and the point it's measured from.
  const hasMovedRef = useRef(false);
  const originRef = useRef<{ x: number; y: number } | null>(null);
  // Read inside the pointerup handler without retriggering the effect that
  // attaches it -- `targets` is rebuilt fresh every render. Written from an
  // effect (not inline during render) per react-hooks/refs.
  const targetsRef = useRef(targets);
  useEffect(() => {
    targetsRef.current = targets;
  });

  const hitTest = useCallback(
    (clientX: number, clientY: number): number | null => {
      const container = containerRef.current;
      if (!container) return null;
      const rows = container.querySelectorAll<HTMLElement>("[data-drag-select-index]");
      for (const row of rows) {
        const rect = row.getBoundingClientRect();
        if (clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom) {
          return Number(row.dataset.dragSelectIndex);
        }
      }
      return null;
    },
    [containerRef],
  );

  const handleTriggerPointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (activation !== "trigger" || !enabled || event.pointerType !== "touch") return;
      draggingRef.current = true;
      onOpenRequest?.();
    },
    [activation, enabled, onOpenRequest],
  );

  // Runs once the menu is actually open. For "trigger" activation, that's
  // right after onOpenRequest above; for "open" activation, that's as soon
  // as the consumer's own long-press flips `open` true. Attaches
  // document-level listeners since the finger travels far outside the
  // trigger's own bounds during the drag. `runAutoScroll` is a plain hoisted
  // function declaration (not useCallback) so it can recurse via
  // requestAnimationFrame without a self-reference-before-declaration issue.
  useEffect(() => {
    if (!enabled || !open) return;
    if (activation === "trigger") {
      if (!draggingRef.current) return;
    } else {
      draggingRef.current = true;
      hasMovedRef.current = false;
      originRef.current = null;
    }

    function runAutoScroll() {
      const container = containerRef.current;
      if (!container || scrollDirectionRef.current === 0) {
        rafHandleRef.current = null;
        return;
      }
      container.scrollTop += scrollDirectionRef.current * AUTO_SCROLL_SPEED_PX;
      rafHandleRef.current = requestAnimationFrame(runAutoScroll);
    }

    function stopAutoScroll() {
      scrollDirectionRef.current = 0;
      if (rafHandleRef.current !== null) {
        cancelAnimationFrame(rafHandleRef.current);
        rafHandleRef.current = null;
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (activation === "open" && !hasMovedRef.current) {
        if (!originRef.current) {
          originRef.current = { x: event.clientX, y: event.clientY };
          return;
        }
        const dx = Math.abs(event.clientX - originRef.current.x);
        const dy = Math.abs(event.clientY - originRef.current.y);
        if (dx <= DRAG_MOVE_TOLERANCE_PX && dy <= DRAG_MOVE_TOLERANCE_PX) return;
        hasMovedRef.current = true;
      }

      setHighlightedIndex(hitTest(event.clientX, event.clientY));

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (event.clientY - rect.top <= AUTO_SCROLL_EDGE_PX) {
        scrollDirectionRef.current = -1;
      } else if (rect.bottom - event.clientY <= AUTO_SCROLL_EDGE_PX) {
        scrollDirectionRef.current = 1;
      } else {
        scrollDirectionRef.current = 0;
      }
      if (scrollDirectionRef.current !== 0 && rafHandleRef.current === null) {
        rafHandleRef.current = requestAnimationFrame(runAutoScroll);
      }
    }

    function handlePointerUp(event: PointerEvent) {
      draggingRef.current = false;
      stopAutoScroll();
      const shouldCommit = activation === "trigger" || hasMovedRef.current;
      const index = shouldCommit ? hitTest(event.clientX, event.clientY) : null;
      setHighlightedIndex(null);
      if (index !== null) targetsRef.current[index]?.onSelect();
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      stopAutoScroll();
    };
  }, [open, enabled, activation, hitTest, containerRef]);

  return {
    highlightedIndex,
    triggerDragProps: activation === "trigger" ? { onPointerDown: handleTriggerPointerDown } : {},
  };
}
