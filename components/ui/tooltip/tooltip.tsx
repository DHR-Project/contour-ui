"use client";

import { Tooltip as RadixTooltip } from "radix-ui";
import type { ReactElement } from "react";

export interface TooltipProps {
  content: string;
  children: ReactElement;
  /** Default 700ms (contour-spec-dropdown.md SSB.1). */
  openDelay?: number;
}

// No dedicated "tooltip surface" token exists yet -- reuses --label-primary
// as the surface and --bg-primary as the text color, which gives an
// automatically-inverted-from-page tooltip in both light and dark without
// a new token (light: black bg/white text, dark: white bg/black text).
const contentClassName =
  "z-[var(--z-tooltip)] max-w-64 rounded-sm bg-[rgb(var(--label-primary))] px-[var(--space-2)] py-[var(--space-1)] text-caption-1 text-[rgb(var(--bg-primary))] " +
  "data-[state=delayed-open]:animate-[contour-fade-in_var(--duration-fast)_var(--ease-standard)] " +
  "data-[state=instant-open]:animate-[contour-fade-in_var(--duration-fast)_var(--ease-standard)] " +
  "data-[state=closed]:animate-[contour-fade-out_var(--duration-fast)_var(--ease-standard)]";

export function Tooltip({ content, children, openDelay = 700 }: TooltipProps) {
  return (
    <RadixTooltip.Provider delayDuration={openDelay}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content className={contentClassName} sideOffset={6}>
            {content}
            <RadixTooltip.Arrow className="fill-label-primary" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}
