"use client";

import { useEffect, useState } from "react";

// Shared by any component whose gesture set forks on input modality (rule
// 4.1) -- ListItem's swipe reveal, Dropdown/SegmentedControl/RadioGroup's
// drag-select (contour-spec-dropdown-v2.md SSA.5). `pointer: coarse` is the
// deciding trait, not size-class -- a touch-capable regular+ tablet is
// still coarse.
export function useIsCoarsePointer(): boolean {
  const [coarse, setCoarse] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia("(pointer: coarse)").matches,
  );
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const listener = (event: MediaQueryListEvent) => setCoarse(event.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);
  return coarse;
}
