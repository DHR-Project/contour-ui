"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils/cn";
import { useScrollVelocityFactor } from "@/lib/hooks/use-scroll-velocity";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

export type ProgressiveBlurPosition = "top" | "bottom";

export interface ProgressiveBlurProps {
  /** Which edge of the bar is the "outer" edge (strongest blur) -- top for
   * NavBar/top Toolbar, bottom for TabBar/bottom Toolbar. */
  position: ProgressiveBlurPosition;
  /** 0-1 overall multiplier on top of velocity adaptation -- e.g. NavBar's
   * Large Title scroll-linked fade-in. Default 1 (always full). */
  intensity?: number;
  className?: string;
}

// SS2.10 --progressive-blur-max. A single blurred layer, not N stacked
// ones: CSS can't vary blur radius across a gradient, so this relies on the
// mask's alpha fade to read as "progressive" instead of banding discrete
// blur amounts together (see tokens.css for the accessibility overrides).
const MAX_BLUR_PX = "var(--progressive-blur-max, 4px)";
// Solid for the inner half of the band, fading over the outer half -- mirrors
// the reference recipe (mask-image: linear-gradient(color 50%, transparent)).
const FADE_STOP = "50%";

export function ProgressiveBlur({
  position,
  intensity = 1,
  className,
}: ProgressiveBlurProps) {
  // Used to find this bar's own nearest scrollable ancestor for velocity
  // measurement, instead of assuming `window` is always what's scrolling.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const velocityFactor = useScrollVelocityFactor(wrapperRef);
  const clampedIntensity = Math.min(1, Math.max(0, intensity));

  // Reduced motion bypasses velocity adaptation entirely -- static full
  // blur regardless of scroll speed (SS2.10, "Velocity-adaptive blur").
  const appliedIntensity =
    clampedIntensity * (reducedMotion ? 1 : velocityFactor);
  // Opaque toward the bar's own screen edge, fading toward the content side.
  const gradientDirection = position === "top" ? "to bottom" : "to top";
  const blur = `blur(${MAX_BLUR_PX})`;
  const mask = `linear-gradient(${gradientDirection}, black ${FADE_STOP}, transparent)`;
  // Rides the same fade as the mask -- the masked blur alone reads as too
  // see-through right where it's weakest, since the mask only fades the
  // blur's visibility, not its own transparency. --progressive-blur-tint-alpha
  // is what Increase Contrast (tokens.css) turns up, without touching this file.
  const tint = `linear-gradient(${gradientDirection}, rgb(var(--bg-primary) / var(--progressive-blur-tint-alpha, 0.5)) ${FADE_STOP}, transparent)`;

  return (
    // Positioning (absolute inset-0, filling the bar) lives on this outer
    // wrapper, kept separate from the `.progressive-blur-container` class
    // below. We keep this wrapper rendered at all times so `wrapperRef` remains stable.
    <div
      ref={wrapperRef}
      aria-hidden
      className={cn(
        "progressive-blur-container pointer-events-none absolute inset-0",
        className,
      )}
    >
      {/* Performance optimization: If intensity drops to 0 (e.g., fast scroll),
          skip rendering the backdrop-filter layer entirely. */}
      {appliedIntensity > 0 && (
        <div
          className="progressive-blur-layer"
          style={
            {
              backdropFilter: blur,
              WebkitBackdropFilter: blur,
              opacity: appliedIntensity,
              maskImage: mask,
              WebkitMaskImage: mask,
              background: tint,
            } as CSSProperties
          }
        />
      )}
    </div>
  );
}
