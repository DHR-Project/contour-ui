"use client";

import { forwardRef, useEffect, useId, useRef } from "react";
import { ToggleGroup as RadixToggleGroup } from "radix-ui";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { mergeRefs } from "@/lib/utils/merge-refs";
import { springs } from "@/lib/motion";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useDragSelectGroup } from "@/lib/hooks/use-drag-select-group";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";

export interface SegmentedControlOption {
  value: string;
  label: string;
  icon?: IconName;
}

export interface SegmentedControlProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SegmentedControlOption[];
  /** default true */
  fullWidth?: boolean;
  className?: string;
}

export const SegmentedControl = forwardRef<HTMLDivElement, SegmentedControlProps>(
  function SegmentedControl({ value, onValueChange, options, fullWidth = true, className }, ref) {
    // Scopes the shared-element layoutId to this instance -- a hardcoded
    // literal would morph the pill between two unrelated SegmentedControls
    // rendered on the same page.
    const pillLayoutId = `segmented-pill-${useId()}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const isCoarsePointer = useIsCoarsePointer();

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
                "relative inline-flex min-h-11 items-center justify-center gap-(--gap-icon-text) rounded-md px-(--space-3) focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]",
                fullWidth && "flex-1",
              )}
            >
              {active && (
                <motion.div
                  layoutId={pillLayoutId}
                  transition={springs.smooth}
                  // SS10.2 -- dedicated token, not --bg-primary: that would
                  // resolve to solid black in dark mode instead of the
                  // correct semi-transparent white pill.
                  className="absolute inset-0 rounded-md bg-[rgb(var(--segmented-control-selected-bg))] shadow-xs"
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-(--gap-icon-text)">
                {option.icon && <Icon name={option.icon} size="sm" />}
                <Text
                  as="span"
                  textStyle="footnote"
                  weight="semibold"
                  color={active ? "primary" : "secondary"}
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
