"use client";

import { forwardRef, useEffect, useRef } from "react";
import { RadioGroup as RadixRadioGroup } from "radix-ui";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { mergeRefs } from "@/lib/utils/merge-refs";
import { springs } from "@/lib/motion";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useDragSelectGroup } from "@/lib/hooks/use-drag-select-group";
import { HStack, VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export type RadioGroupSize = "sm" | "md";
export type RadioGroupDirection = "horizontal" | "vertical";

export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: RadioGroupOption[];
  size?: RadioGroupSize;
  /** default "vertical" -- composes Stack internally, no need to wrap it yourself. */
  direction?: RadioGroupDirection;
  disabled?: boolean;
  className?: string;
}

const CIRCLE_SIZE_CLASS: Record<RadioGroupSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
};

// Dot is 60% of the circle (contour-spec-radio.md SS "Visual").
const DOT_SIZE_CLASS: Record<RadioGroupSize, string> = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
};

// Not exported individually -- a lone Radio has no UX meaning outside a
// RadioGroup (contour-spec-radio.md SS "API").
function RadioItem({
  option,
  checked,
  size,
  groupDisabled,
  dragIndex,
}: {
  option: RadioGroupOption;
  checked: boolean;
  size: RadioGroupSize;
  groupDisabled: boolean;
  dragIndex: number;
}) {
  const disabled = groupDisabled || option.disabled;

  return (
    <label
      data-drag-select-index={dragIndex}
      className={cn(
        // min-h-11 gives the combined control+label unit a 44px hit area
        // (rule 5.5a) -- clicking anywhere in the label forwards to the
        // nested Radix button natively, so this only needs to fix height.
        "inline-flex min-h-11 items-center gap-(--gap-icon-text)",
        disabled && "opacity-40",
      )}
    >
      <RadixRadioGroup.Item
        value={option.value}
        disabled={disabled}
        className={cn(
          // `before:` is the 44px hit-area expansion (rule 5.5a), same
          // technique as Checkbox/Switch -- kept as a no-label fallback;
          // the label wrapper above covers the combined hit area here.
          "relative inline-flex shrink-0 items-center justify-center rounded-full border border-separator-opaque transition-colors duration-(--duration-fast) before:absolute before:left-1/2 before:top-1/2 before:h-11 before:w-11 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))] data-[state=checked]:border-tint",
          CIRCLE_SIZE_CLASS[size],
        )}
      >
        <RadixRadioGroup.Indicator forceMount className="flex items-center justify-center">
          <motion.span
            initial={false}
            animate={{ scale: checked ? 1 : 0 }}
            transition={springs.snappy}
            className={cn("rounded-full bg-tint", DOT_SIZE_CLASS[size])}
          />
        </RadixRadioGroup.Indicator>
      </RadixRadioGroup.Item>
      <Text as="span" textStyle="body">
        {option.label}
      </Text>
    </label>
  );
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value, onValueChange, options, size = "md", direction = "vertical", disabled = false, className },
  ref,
) {
  const Stack = direction === "horizontal" ? HStack : VStack;
  const containerRef = useRef<HTMLDivElement>(null);
  const isCoarsePointer = useIsCoarsePointer();

  // contour-spec-dropdown-v2.md SSA.5 -- same drag-select mechanism as
  // Dropdown/SegmentedControl: press one option, drag across, release
  // commits whichever is under the finger. Disabled options are a no-op.
  const dragTargets = options.map((option) => ({
    onSelect: () => {
      if (!disabled && !option.disabled) onValueChange(option.value);
    },
  }));
  const { highlightedIndex, containerDragProps } = useDragSelectGroup({
    enabled: isCoarsePointer && !disabled,
    targets: dragTargets,
    containerRef,
  });

  useEffect(() => {
    if (highlightedIndex === null) return;
    const option = options[highlightedIndex];
    if (option && !disabled && !option.disabled) onValueChange(option.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex]);

  return (
    <RadixRadioGroup.Root
      ref={mergeRefs(ref, containerRef)}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      className={className}
      {...containerDragProps}
    >
      {/* Vertical: each label is already min-h-11 (rule 5.5a) so its own
          height provides the row's breathing room -- an extra "row" gap on
          top of that stacked up to a visibly oversized space between
          options. Horizontal still needs a real gap since there's no
          per-item height to lean on. */}
      <Stack gap={direction === "horizontal" ? "row" : "0"} container={false}>
        {options.map((option, index) => (
          <RadioItem
            key={option.value}
            option={option}
            checked={option.value === value}
            size={size}
            groupDisabled={disabled}
            dragIndex={index}
          />
        ))}
      </Stack>
    </RadixRadioGroup.Root>
  );
});
