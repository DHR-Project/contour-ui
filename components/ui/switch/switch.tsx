"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion";

/**
 * Switch — a binary on/off control. Demonstrates state-driven motion: the
 * thumb slides with springs.snappy (the same token Button uses for press
 * feedback) instead of a plain CSS transition, so the two controls feel
 * consistent when used side by side.
 */
const switchTrackVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent p-0.5",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "data-[state=unchecked]:bg-fill-tertiary data-[state=checked]:bg-tint",
  ],
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-7 w-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// Thumb diameter and the exact travel distance (track width - thumb size -
// 2x the track's own padding) for each size, so the thumb always lands
// flush against the track edge instead of relying on a CSS translate guess.
const thumbGeometry = {
  sm: { diameter: 16, travel: 16 },
  md: { diameter: 24, travel: 20 },
} as const;

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>, "asChild">,
    VariantProps<typeof switchTrackVariants> {}

export const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, SwitchProps>(
  ({ className, size = "md", checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked ?? false);
    const isChecked = checked ?? uncontrolledChecked;
    const geometry = thumbGeometry[size ?? "md"];

    const handleCheckedChange = (value: boolean) => {
      if (checked === undefined) setUncontrolledChecked(value);
      onCheckedChange?.(value);
    };

    return (
      <SwitchPrimitive.Root
        ref={ref}
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className={cn(switchTrackVariants({ size }), className)}
        {...props}
      >
        <SwitchPrimitive.Thumb asChild>
          <motion.span
            className="block rounded-full bg-white shadow-sm"
            style={{ width: geometry.diameter, height: geometry.diameter }}
            animate={{ x: isChecked ? geometry.travel : 0 }}
            transition={springs.snappy}
          />
        </SwitchPrimitive.Thumb>
      </SwitchPrimitive.Root>
    );
  },
);
Switch.displayName = "Switch";
