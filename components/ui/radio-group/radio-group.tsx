"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * RadioGroup / RadioGroupItem — a single-choice control built on Radix
 * Radio Group. Bare controls with no built-in label, matching
 * Checkbox/Switch: consumers compose their own Label around each item.
 */
export type RadioGroupProps = React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    ref={ref}
    className={cn("flex flex-col gap-3", className)}
    {...props}
  />
));
RadioGroup.displayName = "RadioGroup";

const itemVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "data-[state=unchecked]:border-separator-opaque data-[state=unchecked]:bg-transparent",
    "data-[state=checked]:border-tint",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dotSize = { sm: 8, md: 10 } as const;

export interface RadioGroupItemProps
  extends Omit<React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>, "asChild">,
    VariantProps<typeof itemVariants> {}

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, size = "md", ...props }, ref) => (
  <RadioGroupPrimitive.Item ref={ref} className={cn(itemVariants({ size }), className)} {...props}>
    <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
      <span
        className="rounded-full bg-tint"
        style={{ width: dotSize[size ?? "md"], height: dotSize[size ?? "md"] }}
      />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));
RadioGroupItem.displayName = "RadioGroupItem";
