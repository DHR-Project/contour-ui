"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Slider — a range control built on Radix Slider. Supports both a single
 * thumb (value/defaultValue as a plain number) and a multi-thumb range
 * slider (value/defaultValue as an array, one thumb per entry) - this is
 * a component library, so the full capability of the underlying primitive
 * stays exposed rather than being narrowed to the single-thumb case.
 * onValueChange mirrors whichever shape was passed in.
 */
const trackVariants = cva("relative w-full grow rounded-full bg-fill-tertiary", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-1.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const thumbVariants = cva(
  [
    "block shrink-0 rounded-full bg-white shadow-sm ring-1 ring-black/5",
    "transition-shadow duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
  ],
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5",
        md: "h-[18px] w-[18px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Root has no natural height of its own (Track is a few px tall, and the
// Thumb is taken out of flow via position: absolute so it doesn't
// contribute to flex sizing) - give it one explicitly, matching the
// thumb diameter, instead of relying on the thumb visually overflowing
// an implicitly-sized box. Matches Radix's own recommended recipe.
const rootHeight = { sm: 14, md: 18 } as const;

function toArray(value: number | number[] | undefined): number[] | undefined {
  if (value === undefined) return undefined;
  return Array.isArray(value) ? value : [value];
}

export interface SliderProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
      "value" | "defaultValue" | "onValueChange"
    >,
    VariantProps<typeof trackVariants> {
  /** A plain number renders one thumb; an array renders one thumb per entry (range slider). */
  value?: number | number[];
  defaultValue?: number | number[];
  /** Mirrors the shape passed in - a single number in gives a single number back out. */
  onValueChange?: (value: number | number[]) => void;
  /**
   * aria-label for the thumb(s). A single string labels every thumb; pass
   * an array to label each thumb individually on a multi-thumb slider.
   */
  thumbLabel?: string | string[];
}

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      style,
      size = "md",
      value,
      defaultValue,
      onValueChange,
      disabled,
      min = 0,
      thumbLabel,
      ...props
    },
    ref,
  ) => {
    const arrayValue = toArray(value);
    const arrayDefaultValue = toArray(defaultValue) ?? [min];
    // Whichever shape the caller used (number vs. number[]) decides the
    // shape onValueChange reports back - a plain number in should never
    // surprise the caller with an array out, and vice versa.
    const isMultiThumb = Array.isArray(value ?? defaultValue);
    const thumbCount = (arrayValue ?? arrayDefaultValue).length;

    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        disabled={disabled}
        value={arrayValue}
        defaultValue={arrayDefaultValue}
        onValueChange={(next) => onValueChange?.(isMultiThumb ? next : next[0])}
        style={{ height: rootHeight[size ?? "md"], ...style }}
        className={cn(
          "relative flex w-full touch-none items-center select-none",
          disabled && "opacity-40",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className={trackVariants({ size })}>
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-tint" />
        </SliderPrimitive.Track>
        {Array.from({ length: thumbCount }).map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            aria-label={Array.isArray(thumbLabel) ? thumbLabel[index] : thumbLabel}
            className={thumbVariants({ size })}
          />
        ))}
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = "Slider";
