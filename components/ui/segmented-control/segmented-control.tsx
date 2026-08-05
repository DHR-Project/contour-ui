"use client";

import { forwardRef, useEffect, useId, useRef } from "react";
import { ToggleGroup as RadixToggleGroup } from "radix-ui";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { mergeRefs } from "@/lib/utils/merge-refs";
import { springs } from "@/lib/motion";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useDragSelectGroup } from "@/lib/hooks/use-drag-select-group";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: IconName;
}

export type SegmentedControlSize = "default" | "small";

export interface SegmentedControlProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedControlOption[];
  /** default true */
  fullWidth?: boolean;
  /** "small" is for compact chrome (toolbars, inline toggles) -- still clears the 24px hard floor (rule 5.5), just opts out of the 44px recommendation. default "default" */
  size?: SegmentedControlSize;
  /** Hides segment text visually (kept for screen readers via sr-only), showing only `icon` -- every option must supply one. default false */
  iconOnly?: boolean;
  className?: string;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl(
    { value, onValueChange, options, fullWidth = true, size = "default", iconOnly = false, className },
    ref,
  ) {
    // Scopes the shared-element layoutId to this instance -- a hardcoded
    // literal would morph the pill between two unrelated SegmentedControls
    // rendered on the same page.
    const pillLayoutId = `segmented-pill-${useId()}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const isCoarsePointer = useIsCoarsePointer();
    const reducedMotion = useReducedMotion();
    // Reduced motion: the pill jumps to its new position instantly instead
    // of sliding via springs.smooth (guideline rule 5.3 -- write the
    // no-preference animation first, reduced motion as the fallback branch).
    const pillTransition = reducedMotion ? { duration: 0 } : springs.smooth;

    // contour-spec-dropdown-v2.md SSA.5 -- drag-select applies here too:
    // press one segment, drag across, release commits whichever is under
    // the finger. The pill's own layoutId animation already makes it follow
    // live once `value` updates, so this fires onValueChange continuously
    // during the drag rather than only on release.
    const dragTargets = options.map((option) => ({ onSelect: () => onValueChange(option.value) }));
    const { highlightedIndex, containerDragProps } = useDragSelectGroup({
      enabled: isCoarsePointer,
      targets: dragTargets,
      containerRef,
    });

    useEffect(() => {
      if (highlightedIndex === null) return;
      const option = options[highlightedIndex];
      if (option) onValueChange(option.value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [highlightedIndex]);

    return (
      <RadixToggleGroup.Root
        ref={mergeRefs(ref, containerRef)}
        type="single"
        value={value}
        onValueChange={(next) => {
          // Radix emits "" when the active segment is clicked again (toggle
          // off) -- a Segmented Control always keeps exactly one selection.
          if (next) onValueChange(next);
        }}
        className={cn(
          "inline-flex gap-0.5 rounded-md bg-fill-secondary p-0.5",
          fullWidth && "flex w-full",
          className,
        )}
        {...containerDragProps}
      >
        {options.map((option, index) => {
          const active = option.value === value;
          return (
            <RadixToggleGroup.Item
              key={option.value}
              value={option.value}
              data-drag-select-index={index}
              className={cn(
                "relative inline-flex items-center justify-center rounded-md focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]",
                size === "small"
                  ? cn("min-h-8 gap-1", iconOnly ? "px-(--space-2)" : "px-(--space-3)")
                  : "min-h-11 gap-(--gap-icon-text) px-(--space-3)",
                fullWidth && "flex-1",
              )}
            >
              {active && (
                <motion.div
                  layoutId={pillLayoutId}
                  transition={pillTransition}
                  // SS10.2 -- dedicated token, not --bg-primary: that would
                  // resolve to solid black in dark mode instead of the
                  // correct semi-transparent white pill.
                  className="absolute inset-0 rounded-md bg-[rgb(var(--segmented-control-selected-bg))] shadow-xs"
                />
              )}
              <span
                className={cn(
                  "relative z-10 inline-flex items-center",
                  size === "small" ? "gap-1" : "gap-(--gap-icon-text)",
                )}
              >
                {option.icon && <Icon name={option.icon} size={size === "small" ? "xs" : "sm"} />}
                <Text
                  as="span"
                  textStyle="footnote"
                  weight="semibold"
                  color={active ? "primary" : "secondary"}
                  // Icon-only still exposes the label as the button's
                  // accessible name via normal text content -- no aria-label
                  // needed on the (decorative, aria-hidden) icon itself.
                  className={iconOnly ? "sr-only" : undefined}
                >
                  {option.label}
                </Text>
              </span>
            </RadixToggleGroup.Item>
          );
        })}
      </RadixToggleGroup.Root>
    );
  },
);
