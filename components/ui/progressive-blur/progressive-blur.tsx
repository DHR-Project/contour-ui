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

// SS2.10 --progressive-blur-layers / --progressive-blur-max.
const LAYER_COUNT = 4;
const MAX_BLUR_PX = 20;

export function ProgressiveBlur({ position, intensity = 1, className }: ProgressiveBlurProps) {
  // Used to find this bar's own nearest scrollable ancestor for velocity
  // measurement, instead of assuming `window` is always what's scrolling.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const velocityFactor = useScrollVelocityFactor(wrapperRef);
  const clampedIntensity = Math.min(1, Math.max(0, intensity));

  // Reduced motion bypasses velocity adaptation entirely -- static full
  // blur regardless of scroll speed (SS2.10, "Velocity-adaptive blur").
  const appliedIntensity = clampedIntensity * (reducedMotion ? 1 : velocityFactor);
  const gradientDirection = position === "top" ? "to bottom" : "to top";

  return (
    // Positioning (absolute inset-0, filling the bar) lives on this outer
    // wrapper, kept separate from the `.progressive-blur-container` class
    // below. We keep this wrapper rendered at all times so `wrapperRef` remains stable.
    <div ref={wrapperRef} aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>

      {/* Performance optimization: If intensity drops to 0 (e.g., fast scroll),
          skip rendering the expensive backdrop-filter layers entirely. */}
      {appliedIntensity > 0 && (
        <div className="progressive-blur-container h-full w-full">
          {Array.from({ length: LAYER_COUNT }, (_, i) => {
            const layerIndex = i + 1;
            const blurPx = (MAX_BLUR_PX / LAYER_COUNT) * layerIndex;
            const blur = `blur(calc(${blurPx}px * ${appliedIntensity}))`;

            // --- FIXED CUMULATIVE STACKING LOGIC ---
            // Divide the space into (LAYER_COUNT + 1) segments.
            // Purpose: Ensures the outermost layer (strongest blur) retains a portion
            // of 100% solid mask intensity before it starts fading out, preventing a hard cut.
            const segments = LAYER_COUNT + 1;
            const bandWidth = 100 / segments;

            // 'k' represents the layer's position from the outer edge:
            // outermost layer (strongest blur) has k = 1, innermost has k = LAYER_COUNT.
            const k = LAYER_COUNT - layerIndex + 1;

            // The solid portion extends from 0% to fadeStart
            const fadeStart = k * bandWidth;
            // The fade-out portion extends from fadeStart to fadeEnd
            const fadeEnd = fadeStart + bandWidth;

            const transparent = "rgba(0, 0, 0, 0)";
            const stops = `black 0%, black ${fadeStart}%, ${transparent} ${fadeEnd}%, ${transparent} 100%`;
            const mask = `linear-gradient(${gradientDirection}, ${stops})`;

            return (
              <div
                key={layerIndex}
                className="progressive-blur-layer"
                style={
                  {
                    "--layer-index": layerIndex,
                    backdropFilter: blur,
                    WebkitBackdropFilter: blur,
                    opacity: appliedIntensity,
                    maskImage: mask,
                    WebkitMaskImage: mask,
                  } as CSSProperties
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
