"use client";

import { useEffect, useState } from "react";

// True if either the OS preference is on, or ContourProvider's manual
// "Reduce Transparency" toggle has been switched on -- the manual toggle
// only ever adds the effect, it never turns off a real OS-level preference.
// Reads localStorage directly (same source ContourProvider itself reads)
// rather than the .reduce-transparency class it sets on <html>, since that
// class is applied from a useEffect and wouldn't be up to date yet when
// this hook's "contour-preference-change" listener runs synchronously
// within the same dispatchEvent call that triggered the change.
function readReduceTransparency(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(prefers-reduced-transparency: reduce)").matches ||
    window.localStorage.getItem("contour-reduce-transparency") === "1"
  );
}

// Mirrors useReducedMotion's pattern (matchMedia + change listener).
export function useReduceTransparency(): boolean {
  const [reduced, setReduced] = useState(readReduceTransparency);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-transparency: reduce)");
    const update = () => setReduced(readReduceTransparency());
    query.addEventListener("change", update);
    // ContourProvider dispatches this on every preference change, including
    // the manual reduceTransparency toggle -- see components/contour-provider.tsx.
    window.addEventListener("contour-preference-change", update);
    return () => {
      query.removeEventListener("change", update);
      window.removeEventListener("contour-preference-change", update);
    };
  }, []);

  return reduced;
}
