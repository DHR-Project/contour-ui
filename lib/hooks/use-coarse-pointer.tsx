"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Lets a subtree pin useIsCoarsePointer() to a fixed value regardless of
// the real device -- used by docs/story previews to show touch-vs-mouse
// behavior without device emulation. Mirrors useSizeClass's
// SizeClassOverrideProvider.
const CoarsePointerOverrideContext = createContext<boolean | null>(null);

export function CoarsePointerOverrideProvider({
  value,
  children,
}: {
  value: boolean;
  children: ReactNode;
}) {
  return (
    <CoarsePointerOverrideContext.Provider value={value}>{children}</CoarsePointerOverrideContext.Provider>
  );
}

// Shared by any component whose gesture set forks on input modality (rule
// 4.1) -- ListItem's swipe reveal, Dropdown/SegmentedControl/RadioGroup's
// drag-select (contour-spec-dropdown-v2.md SSA.5). `pointer: coarse` is the
// deciding trait, not size-class -- a touch-capable regular+ tablet is
// still coarse.
//
// The initial state always starts at `false` -- matching what the server
// renders -- rather than reading matchMedia here. Computing the real value
// during the client's first render produces a value that mismatches the
// server output whenever the pointer is actually coarse, and once hydration
// logs that mismatch, some consumers (Portal-adjacent primitives) never
// actually pick up the corrected DOM on the following state-driven
// re-renders. Deferring the real measurement to the mount effect avoids the
// mismatch entirely (see useSizeClass, which mirrors this pattern).
export function useIsCoarsePointer(): boolean {
  const override = useContext(CoarsePointerOverrideContext);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    if (override !== null) return;
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [override]);

  return override ?? coarse;
}
