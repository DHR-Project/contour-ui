"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

// contour-spec-dropdown-v2.md SSA.5 -- 24px edge threshold, driven by
// requestAnimationFrame rather than a scroll listener (same measurement
// technique as the velocity-adaptive Progressive Blur, SS2.10).
const AUTO_SCROLL_EDGE_PX = 24;
const AUTO_SCROLL_SPEED_PX = 10;

export interface DragSelectTarget {
  /** Called when the drag is released while this row is under the finger. */
  onSelect: () => void;
}

interface UseDragSelectOptions {
  /** Gate on `pointer: coarse` (rule 4.1) -- desktop mouse never drives this. */
  enabled: boolean;
  open: boolean;
  onOpenRequest: () => void;
  /** Rows currently rendered inside `containerRef`, in DOM order (only the
   *  active screen -- see dropdown.tsx's scope note on nested flyouts). */
  targets: DragSelectTarget[];
  containerRef: RefObject<HTMLElement | null>;
}

/**
 * touchstart on the trigger opens the menu immediately; touchmove hit-tests
 * the finger against each row (marked with `data-drag-select-index`) and
 * highlights whichever one it's over; touchend commits that row's
 * `onSelect`, or closes with no selection if the finger isn't over a row.
 */
export function useDragSelect({ enabled, open, onOpenRequest, targets, containerRef }: UseDragSelectOptions) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const draggingRef = useRef(false);
  const scrollDirectionRef = useRef<0 | 1 | -1>(0);
  const rafHandleRef = useRef<number | null>(null);
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
      if (!enabled || event.pointerType !== "touch") return;
      draggingRef.current = true;
      onOpenRequest();
    },
    [enabled, onOpenRequest],
  );

  // Runs once the menu is actually open (right after onOpenRequest above) --
  // attaches document-level listeners since the finger travels far outside
  // the trigger's own bounds during the drag. `runAutoScroll` is a plain
  // hoisted function declaration (not useCallback) so it can recurse via
  // requestAnimationFrame without a self-reference-before-declaration issue.
  useEffect(() => {
    if (!open || !draggingRef.current) return;

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
      const index = hitTest(event.clientX, event.clientY);
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
  }, [open, hitTest, containerRef]);

  return { highlightedIndex, triggerDragProps: { onPointerDown: handleTriggerPointerDown } };
}
