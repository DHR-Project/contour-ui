"use client";

import { useEffect, useState } from "react";

// True if either the OS preference is on, or ContourProvider's manual
// "Reduce Motion" toggle has been switched on -- the manual toggle only
// ever adds the effect, it never turns off a real OS-level preference.
// Reads localStorage directly (same source ContourProvider itself reads)
// rather than the .reduce-motion class it sets on <html>, since that class
// is applied from a useEffect and wouldn't be up to date yet when this
// hook's "contour-preference-change" listener runs synchronously within
// the same dispatchEvent call that triggered the change.
function readReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.localStorage.getItem("contour-reduce-motion") === "1"
  );
}

// Mirrors ListItem's useIsCoarsePointer pattern (matchMedia + change listener).
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(readReducedMotion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(readReducedMotion());
    query.addEventListener("change", update);
    // ContourProvider dispatches this on every preference change, including
    // the manual reduceMotion toggle -- see components/contour-provider.tsx.
    window.addEventListener("contour-preference-change", update);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("contour-preference-change", update);
    };
  }, []);

  return reduced;
}
