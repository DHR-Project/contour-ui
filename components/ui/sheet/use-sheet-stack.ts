"use client";

import { useId, useSyncExternalStore } from "react";
// SSR-safe layout effect (plain useEffect on the server, useLayoutEffect on
// the client) -- registering synchronously before paint means a nested
// Sheet's z-index is correct on its very first frame instead of flashing
// the un-nested value for one tick.
import { useIsomorphicLayoutEffect } from "framer-motion";

// Mirrors --z-sheet (styles/tokens.css SS6.9, 310) -- same precedent as
// Alert's static z-390 class for --z-alert. Kept in sync manually; there's
// no synchronous way to read a CSS custom property at module-eval time
// without a client-only getComputedStyle call, which would either require
// deferring every consumer to an effect (visible z-index pop-in on mount)
// or risk a hydration mismatch if read during render.
const SHEET_BASE_Z = 310;
const SHEET_DEPTH_STEP = 20;
// contour-spec-sheet-v2.md SS3 / design-tokens-summary-v2.md SS6.9: warn
// once nesting reaches 3 concurrently open Sheets (0-indexed depth 2).
const NEST_WARNING_DEPTH = 2;

// Sheets stack by *open order*, not JSX/React-tree nesting -- a "child"
// Sheet is almost always a JSX sibling (triggered from a button inside the
// parent's content, state lifted to a shared ancestor), not a literal
// React descendant of the parent Sheet. So depth has to be assigned by
// when a Sheet actually opens, not where it sits in the tree.
//
// This module state is mutated only from effects, never during render:
// render also runs during SSR, and effects don't, so a shared module-level
// array here never leaks across concurrent server requests -- each
// browser tab gets its own JS module instance where effects are the only
// thing touching it.
let openOrder: string[] = [];
const listeners = new Set<() => void>();

function notify() {
  openOrder = [...openOrder];
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return openOrder;
}

function getServerSnapshot() {
  return openOrder; // always [] -- nothing registers during SSR render.
}

function registerOpen(id: string) {
  if (openOrder.includes(id)) return;
  openOrder = [...openOrder, id];
  notify();
  const depth = openOrder.indexOf(id);
  if (depth >= NEST_WARNING_DEPTH) {
    console.warn(
      `Sheet: nesting reached ${depth + 1} levels deep. Consider push navigation ` +
        "or SplitView instead of stacking this many Sheets (contour-spec-sheet-v2.md SS3).",
    );
  }
}

function unregisterOpen(id: string) {
  if (!openOrder.includes(id)) return;
  openOrder = openOrder.filter((openId) => openId !== id);
  notify();
}

export interface SheetZIndex {
  /** Stacking position among currently open Sheets (0 = opened first). -1 when this Sheet isn't open. */
  depth: number;
  /** z-index for this Sheet's own surface. */
  z: number;
  /** z-index for this Sheet's own backdrop -- always one below its surface (SS3). */
  backdropZ: number;
  /** True while a Sheet opened after this one is still open on top of it (SS7, receding-card state). */
  isReceded: boolean;
}

// contour-spec-sheet-v2.md SS3 (z-index) / SS7 (receding nested Sheet).
export function useSheetZIndex(open: boolean): SheetZIndex {
  const id = useId();

  useIsomorphicLayoutEffect(() => {
    if (!open) return;
    registerOpen(id);
    return () => unregisterOpen(id);
  }, [open, id]);

  const order = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const depth = order.indexOf(id);
  const activeDepth = order.length - 1;
  const z = SHEET_BASE_Z + Math.max(depth, 0) * SHEET_DEPTH_STEP;

  return {
    depth,
    z,
    backdropZ: z - 1,
    isReceded: depth !== -1 && depth < activeDepth,
  };
}
