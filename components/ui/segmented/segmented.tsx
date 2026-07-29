"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion";

/**
 * Segmented — a single-choice control rendered as a row of segments with
 * a sliding active indicator (springs.snappy, the same token Switch uses
 * for its thumb). No Radix primitive: this is the ARIA "radio group"
 * pattern (role="radiogroup" / role="radio", roving tabindex, arrow-key
 * navigation) implemented directly, since it picks one value rather than
 * switching visible panels - the case Radix Tabs is for.
 */
const trackVariants = cva("relative inline-flex items-center gap-0.5 rounded-lg bg-fill-secondary p-0.5", {
  variants: {
    size: {
      sm: "h-8",
      md: "h-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const segmentVariants = cva(
  [
    "relative flex flex-1 items-center justify-center rounded-md px-3 whitespace-nowrap",
    "text-subheadline font-medium transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      size: {
        sm: "h-7",
        md: "h-9",
      },
      selected: {
        true: "text-label-primary",
        false: "text-label-secondary hover:text-label-primary",
      },
    },
    defaultVariants: {
      size: "md",
      selected: false,
    },
  },
);

export interface SegmentedOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof trackVariants> {
  options: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}

export const Segmented = React.forwardRef<HTMLDivElement, SegmentedProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      disabled,
      size = "md",
      className,
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = React.useState(
      defaultValue ?? options[0]?.value,
    );
    const selected = value ?? uncontrolledValue;
    const indicatorId = React.useId();
    const segmentRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const selectValue = (next: string) => {
      if (value === undefined) setUncontrolledValue(next);
      onValueChange?.(next);
    };

    const enabledIndexes = options
      .map((option, index) => (option.disabled || disabled ? -1 : index))
      .filter((index) => index !== -1);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (enabledIndexes.length === 0) return;
      const currentPos = enabledIndexes.indexOf(index);
      let nextPos: number | null = null;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        nextPos = (currentPos + 1) % enabledIndexes.length;
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        nextPos = (currentPos - 1 + enabledIndexes.length) % enabledIndexes.length;
      } else if (event.key === "Home") {
        nextPos = 0;
      } else if (event.key === "End") {
        nextPos = enabledIndexes.length - 1;
      }

      if (nextPos !== null) {
        event.preventDefault();
        const nextIndex = enabledIndexes[nextPos];
        selectValue(options[nextIndex].value);
        segmentRefs.current[nextIndex]?.focus();
      }
    };

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={ariaLabel}
        aria-disabled={disabled}
        className={cn(trackVariants({ size }), disabled && "opacity-40", className)}
        {...props}
      >
        {options.map((option, index) => {
          const isSelected = option.value === selected;
          const isDisabled = disabled || option.disabled;

          return (
            <button
              key={option.value}
              ref={(el) => {
                segmentRefs.current[index] = el;
              }}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectValue(option.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={segmentVariants({ size, selected: isSelected })}
            >
              {isSelected ? (
                <motion.span
                  layoutId={`${indicatorId}-indicator`}
                  className="absolute inset-0 rounded-md bg-bg-primary shadow-sm"
                  transition={springs.snappy}
                />
              ) : null}
              <span className="relative z-10">{option.label}</span>
            </button>
          );
        })}
      </div>
    );
  },
);
Segmented.displayName = "Segmented";
