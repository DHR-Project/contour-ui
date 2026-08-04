"use client";

import { useEffect, useState } from "react";
import type { SizeClass } from "@/lib/types/size-class.types";
import { SIZE_CLASS_MIN_WIDTH } from "@/lib/types/size-class.types";

function resolveSizeClass(width: number): SizeClass {
  if (width >= SIZE_CLASS_MIN_WIDTH["regular-xl"]) return "regular-xl";
  if (width >= SIZE_CLASS_MIN_WIDTH["regular-lg"]) return "regular-lg";
  if (width >= SIZE_CLASS_MIN_WIDTH.regular) return "regular";
  return "compact";
}

// Mirrors ListItem's useIsCoarsePointer pattern: matchMedia + change
// listener per breakpoint, so updates only fire at actual tier crossings.
export function useSizeClass(): SizeClass {
  const [sizeClass, setSizeClass] = useState<SizeClass>(() =>
    typeof window === "undefined" ? "compact" : resolveSizeClass(window.innerWidth),
  );

  useEffect(() => {
    const update = () => setSizeClass(resolveSizeClass(window.innerWidth));
    update();

    const queries = (
      Object.keys(SIZE_CLASS_MIN_WIDTH) as Array<keyof typeof SIZE_CLASS_MIN_WIDTH>
    ).map((tier) => window.matchMedia(`(min-width: ${SIZE_CLASS_MIN_WIDTH[tier]}px)`));
    queries.forEach((query) => query.addEventListener("change", update));
    return () => queries.forEach((query) => query.removeEventListener("change", update));
  }, []);

  return sizeClass;
}
