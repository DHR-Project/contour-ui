"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { scroll } from "framer-motion";
import { findScrollParent } from "@/lib/utils/scroll";

// 0-1 progress through [0, range] of whichever container actually scrolls
// -- used to drive NavBar's Large Title collapse (contour-spec-navbar-
// tabbar-toolbar.md SS A.3): 0 at the top, 1 once scrolled past `range` px.
// Finds `elementRef`'s nearest scrollable ancestor rather than assuming
// `window`, since the bar may live inside its own scrollable section
// instead of the page body. Listening itself is delegated to framer-motion's
// `scroll()`, which already frame-batches scroll/resize measurement rather
// than reading position straight off every raw event.
export function useScrollProgress(
  range: number,
  enabled: boolean,
  elementRef: RefObject<Element | null>,
): number {
  // Derived at return time (rather than reset via setState inside the
  // effect) so the disabled case doesn't need its own synchronous setState
  // call in the effect body.
  const [rawProgress, setRawProgress] = useState(0);

  useEffect(() => {
    if (!enabled || typeof window === "undefined" || range <= 0) return;

    // Deferred a frame rather than looked up synchronously here: an
    // ancestor's scrollability can depend on state that resolves in a
    // LATER mount effect than this one (e.g. useSizeClass always starts at
    // "compact" and corrects itself in its own effect once the real
    // viewport width is known -- see its doc comment). Effects fire
    // child-before-parent, so a synchronous lookup here can see a still-stale
    // ancestor and lock onto the wrong scroll target for the component's
    // whole lifetime, since findScrollParent never re-runs after this. rAF
    // fires after the browser's next paint, i.e. after every effect (and
    // any cascading re-render they trigger) from this commit has settled.
    let cleanup: (() => void) | undefined;
    const rafId = requestAnimationFrame(() => {
      const scrollParent = findScrollParent(elementRef.current);
      cleanup = scroll(
        (_progress, { y }) => setRawProgress(Math.min(1, Math.max(0, y.current / range))),
        { container: scrollParent ?? undefined, axis: "y" },
      );
    });

    return () => {
      cancelAnimationFrame(rafId);
      cleanup?.();
    };
  }, [range, enabled, elementRef]);

  return enabled ? rawProgress : 0;
}
