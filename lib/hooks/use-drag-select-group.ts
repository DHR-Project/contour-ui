"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, RefObject } from "react";

// Shared by SegmentedControl and RadioGroup (contour-spec-dropdown-v2.md
// SSA.5 -- drag-select is scoped to Dropdown/ContextMenu/SegmentedControl/
// RadioGroup only). Unlike Dropdown's own use-drag-select.ts, there's no
// menu to open and no long scrollable list to auto-scroll -- this is just
// "drag across already-visible options, highlight, commit on release."
export interface DragSelectGroupTarget {
  onSelect: () => void;
}

interface UseDragSelectGroupOptions {
  /** Gate on `pointer: coarse` (rule 4.1) -- desktop mouse never drives this. */
  enabled: boolean;
  targets: DragSelectGroupTarget[];
  containerRef: RefObject<HTMLElement | null>;
}

export function useDragSelectGroup({ enabled, targets, containerRef }: UseDragSelectGroupOptions) {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const draggingRef = useRef(false);
  // Written from an effect (not inline during render) per react-hooks/refs.
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

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (!enabled || event.pointerType !== "touch") return;
      draggingRef.current = true;
      setHighlightedIndex(hitTest(event.clientX, event.clientY));
    },
    [enabled, hitTest],
  );

  useEffect(() => {
    if (!enabled) return;

    function handlePointerMove(event: PointerEvent) {
      if (!draggingRef.current) return;
      setHighlightedIndex(hitTest(event.clientX, event.clientY));
    }

    function handlePointerUp(event: PointerEvent) {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      const index = hitTest(event.clientX, event.clientY);
      setHighlightedIndex(null);
      if (index !== null) targetsRef.current[index]?.onSelect();
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [enabled, hitTest]);

  return { highlightedIndex, containerDragProps: { onPointerDown: handlePointerDown } };
}
