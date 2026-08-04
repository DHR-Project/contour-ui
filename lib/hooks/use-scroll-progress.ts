"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { findScrollParent, getScrollEventTarget, getScrollTop } from "@/lib/utils/scroll";

// 0-1 progress through [0, range] of whichever container actually scrolls
// -- used to drive NavBar's Large Title collapse (contour-spec-navbar-
// tabbar-toolbar.md SS A.3): 0 at the top, 1 once scrolled past `range` px.
// Finds `elementRef`'s nearest scrollable ancestor rather than assuming
// `window`, since the bar may live inside its own scrollable section
// instead of the page body. rAF-throttled (only one pending measurement at
// a time) rather than reading scroll position straight off every event.
export function useScrollProgress(
  range: number,
  enabled: boolean,
  elementRef: RefObject<Element | null>,
): number {
  // Derived at return time (rather than reset via setState inside the
  // effect) so the disabled case doesn't need its own synchronous setState
  // call in the effect body.
  const [rawProgress, setRawProgress] = useState(0);
  const rafId = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || range <= 0) return;

    const scrollParent = findScrollParent(elementRef.current);

    const measure = () => {
      setRawProgress(Math.min(1, Math.max(0, getScrollTop(scrollParent) / range)));
      rafId.current = undefined;
    };
    const onScroll = () => {
      if (rafId.current === undefined) rafId.current = requestAnimationFrame(measure);
    };

    measure();
    const target = getScrollEventTarget(scrollParent);
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      if (rafId.current !== undefined) cancelAnimationFrame(rafId.current);
    };
  }, [range, enabled, elementRef]);

  return enabled ? rawProgress : 0;
}
