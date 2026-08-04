"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { useReducedMotion } from "./use-reduced-motion";
import { findScrollParent, getScrollEventTarget, getScrollTop } from "@/lib/utils/scroll";

// Velocity-adaptive blur thresholds (design-tokens-summary.md SS2.10):
// under ~900px/s (15px/frame) blur stays full, above ~40px/frame it's
// zeroed out entirely, linear falloff in between.
const FULL_BLUR_MAX_VELOCITY = 15; // px/frame
const ZERO_BLUR_VELOCITY = 40; // px/frame
// How long to keep measuring after the last scroll event before settling
// back to full blur and stopping the rAF loop entirely -- matches the
// spec's own "short transition (~150-200ms)" note for the settle-back.
const IDLE_STOP_MS = 180;

// Returns a 0-1 multiplier for progressive-blur intensity based on how fast
// the page is currently scrolling. Finds `elementRef`'s nearest scrollable
// ancestor rather than assuming `window`, since the bar may live inside its
// own scrollable section instead of the page body. Always 1 (full blur, no
// adaptation) when the user prefers reduced motion, since this is itself a
// scroll-linked dynamic behavior.
export function useScrollVelocityFactor(elementRef: RefObject<Element | null>): number {
  const reducedMotion = useReducedMotion();
  // Derived at return time (rather than reset via setState inside the
  // effect) so the reduced-motion case doesn't need its own synchronous
  // setState call in the effect body.
  const [rawFactor, setRawFactor] = useState(1);
  const lastScrollTop = useRef(0);
  const rafId = useRef<number | undefined>(undefined);
  const idleTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;

    const scrollParent = findScrollParent(elementRef.current);
    const target = getScrollEventTarget(scrollParent);

    // The rAF loop only runs while scroll events are actually arriving --
    // letting it re-arm itself unconditionally forever (this hook's first
    // draft) reruns and re-renders every frame for as long as the bar is
    // mounted, even at rest, which is exactly the kind of continuous
    // main-thread work that shows up as scroll/scrollbar jank.
    const stopLoop = () => {
      if (rafId.current !== undefined) {
        cancelAnimationFrame(rafId.current);
        rafId.current = undefined;
      }
    };

    const measure = () => {
      const currentTop = getScrollTop(scrollParent);
      const velocity = Math.abs(currentTop - lastScrollTop.current);
      lastScrollTop.current = currentTop;

      let next: number;
      if (velocity < FULL_BLUR_MAX_VELOCITY) {
        next = 1;
      } else if (velocity > ZERO_BLUR_VELOCITY) {
        next = 0;
      } else {
        next = 1 - (velocity - FULL_BLUR_MAX_VELOCITY) / (ZERO_BLUR_VELOCITY - FULL_BLUR_MAX_VELOCITY);
      }
      setRawFactor(next);
      rafId.current = requestAnimationFrame(measure);
    };

    const onScroll = () => {
      if (rafId.current === undefined) {
        lastScrollTop.current = getScrollTop(scrollParent);
        rafId.current = requestAnimationFrame(measure);
      }
      if (idleTimeout.current !== undefined) clearTimeout(idleTimeout.current);
      idleTimeout.current = setTimeout(() => {
        stopLoop();
        setRawFactor(1);
      }, IDLE_STOP_MS);
    };

    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      stopLoop();
      if (idleTimeout.current !== undefined) clearTimeout(idleTimeout.current);
    };
  }, [reducedMotion, elementRef]);

  return reducedMotion ? 1 : rawFactor;
}
