"use client";

import { useEffect, useState } from "react";

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
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setCoarse(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return coarse;
}
