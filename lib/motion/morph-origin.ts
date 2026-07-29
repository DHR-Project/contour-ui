"use client";

import * as React from "react";

/**
 * A trigger's on-screen size and border-radius, captured as a morph
 * animation's starting point, plus how far the content's resting box sits
 * from the trigger's (dx/dy, in px) so content can be offset to sit exactly
 * over the trigger instead of just matching its size wherever it actually
 * ends up positioned.
 */
export interface MorphOrigin {
  width: number;
  height: number;
  radius: string;
  dx: number;
  dy: number;
}

/**
 * Drives a "grows out of the trigger" open/close animation shared by Select
 * and Dropdown: capture the trigger's box on toggle and feed it straight to
 * content as a plain `initial`/`animate` value (not framer-motion's `layout`
 * prop) - deliberately, since content here typically remounts fresh on
 * every open (e.g. Radix's Select swaps its Content between a lightweight
 * hidden fragment and the real implementation via internal Presence, a real
 * unmount/mount, not just a prop change). `layout` needs the *same*
 * component instance to persist across a change so it can diff "before" vs
 * "after"; a fresh mount has no "before" frame to diff against and just
 * snaps to its final size. `initial` doesn't have that requirement - it's
 * evaluated fresh on every mount, so this keeps working across remounts.
 *
 * The content's resting position generally isn't known synchronously on
 * open (whatever positions it - floating-ui, or Popper's own resolution -
 * runs async, at least one paint after mount), so this caches the last
 * dx/dy *measured on close* (when content's resting box is already known,
 * no waiting required) and reuses it as a best-effort guess for the next
 * open. Only the very first open of a page load has no prior measurement to
 * draw on, so it falls back to 0/0 (matching size only); every open after
 * an actual close is exact, since the trigger rarely moves between the two.
 */
export function useMorphOrigin(
  triggerRef: React.RefObject<HTMLElement | null>,
  contentRef: React.RefObject<HTMLElement | null>,
) {
  const [origin, setOrigin] = React.useState<MorphOrigin | null>(null);
  const lastDeltaRef = React.useRef({ dx: 0, dy: 0 });

  // Call this from the same handler that actually opens/closes - not from
  // an effect - so the trigger's box is captured at the exact moment of the
  // interaction, with no extra render-cycle lag, and (on open) is available
  // in the very same render pass content mounts in, since both state
  // updates land in one batch.
  const capture = React.useCallback(
    (next: boolean) => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const radius = getComputedStyle(trigger).borderRadius;
      if (next) {
        setOrigin({ width: rect.width, height: rect.height, radius, ...lastDeltaRef.current });
      } else {
        const content = contentRef.current;
        const contentRect = content?.getBoundingClientRect();
        const dx = contentRect ? rect.left - contentRect.left : 0;
        const dy = contentRect ? rect.top - contentRect.top : 0;
        lastDeltaRef.current = { dx, dy };
        setOrigin({ width: rect.width, height: rect.height, radius, dx, dy });
      }
    },
    [triggerRef, contentRef],
  );

  return { origin, capture };
}
