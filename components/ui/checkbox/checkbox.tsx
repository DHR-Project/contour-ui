"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Icon } from "@/components/icon";

/**
 * Checkbox — a tri-state control (checked / unchecked / indeterminate),
 * built on Radix Checkbox. A bare control with no built-in label, matching
 * Switch: consumers compose their own Label around it, e.g.
 * <Label><HStack>...<Checkbox/></HStack></Label>.
 */
const checkboxVariants = cva(
  [
    "peer inline-flex shrink-0 cursor-pointer items-center justify-center rounded-xs border",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-40",
    "data-[state=unchecked]:border-separator-opaque data-[state=unchecked]:bg-transparent",
    "data-[state=checked]:border-tint data-[state=checked]:bg-tint",
    "data-[state=indeterminate]:border-tint data-[state=indeterminate]:bg-tint",
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

const iconSize = { sm: 10, md: 13 } as const;

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>, "asChild">,
    VariantProps<typeof checkboxVariants> {}

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = "md", checked, defaultChecked, onCheckedChange, ...props }, ref) => {
  const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked ?? false);
  const isChecked = checked ?? uncontrolledChecked;

  const handleCheckedChange = (value: CheckboxPrimitive.CheckedState) => {
    if (checked === undefined) setUncontrolledChecked(value);
    onCheckedChange?.(value);
  };

  return (
    <CheckboxPrimitive.Root
      ref={ref}
      checked={isChecked}
      onCheckedChange={handleCheckedChange}
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        forceMount
        className={cn(
          "flex items-center justify-center text-white",
          "transition-[opacity,transform] duration-150",
          isChecked === false ? "scale-50 opacity-0" : "scale-100 opacity-100",
        )}
      >
        <Icon name={isChecked === "indeterminate" ? "minus" : "check"} size={iconSize[size ?? "md"]} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});
Checkbox.displayName = "Checkbox";
