"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { SizeClass } from "@/lib/types/size-class.types";
import { SIZE_CLASS_MIN_WIDTH } from "@/lib/types/size-class.types";

function resolveSizeClass(width: number): SizeClass {
  if (width >= SIZE_CLASS_MIN_WIDTH["regular-xl"]) return "regular-xl";
  if (width >= SIZE_CLASS_MIN_WIDTH["regular-lg"]) return "regular-lg";
  if (width >= SIZE_CLASS_MIN_WIDTH.regular) return "regular";
  return "compact";
}

// Lets a subtree pin useSizeClass() to a fixed value regardless of the real
// viewport width -- used by docs previews to show compact/regular behavior
// without resizing the window.
const SizeClassOverrideContext = createContext<SizeClass | null>(null);

export function SizeClassOverrideProvider({
  value,
  children,
}: {
  value: SizeClass;
  children: ReactNode;
}) {
  return (
    <SizeClassOverrideContext.Provider value={value}>{children}</SizeClassOverrideContext.Provider>
  );
}

// Mirrors ListItem's useIsCoarsePointer pattern: matchMedia + change
// listener per breakpoint, so updates only fire at actual tier crossings.
//
// The initial state always starts at "compact" -- matching what the server
// renders -- rather than reading window.innerWidth here. Computing the real
// width during the client's first render produces a value that mismatches
// the server output whenever the viewport isn't compact-sized, and once
// hydration logs that mismatch, some consumers (e.g. Radix's Toast.Viewport,
// a Portal-adjacent primitive) never actually pick up the corrected DOM
// attributes on the following state-driven re-renders. Deferring the real
// measurement to the mount effect avoids the mismatch entirely.
export function useSizeClass(): SizeClass {
  const override = useContext(SizeClassOverrideContext);
  const [sizeClass, setSizeClass] = useState<SizeClass>("compact");

  useEffect(() => {
    if (override) return;
    const update = () => setSizeClass(resolveSizeClass(window.innerWidth));
    update();

    const queries = (
      Object.keys(SIZE_CLASS_MIN_WIDTH) as Array<keyof typeof SIZE_CLASS_MIN_WIDTH>
    ).map((tier) => window.matchMedia(`(min-width: ${SIZE_CLASS_MIN_WIDTH[tier]}px)`));
    queries.forEach((query) => query.addEventListener("change", update));
    return () => queries.forEach((query) => query.removeEventListener("change", update));
  }, [override]);

  return override ?? sizeClass;
}
