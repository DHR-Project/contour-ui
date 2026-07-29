"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center font-medium whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        filled: "",
        tinted: "",
        outline: "border",
      },
      color: {
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        destructive: "",
        info: "",
      },
      size: {
        sm: "h-4 px-1 text-caption-2 min-w-4",
        md: "h-5 px-1.5 text-caption-1 min-w-5",
        lg: "h-6 px-2 text-footnote min-w-6",
      },
      shape: {
        default: "rounded-xs",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      // Primary (tint)
      {
        variant: "filled",
        color: "primary",
        class: "bg-tint text-white border-transparent",
      },
      {
        variant: "tinted",
        color: "primary",
        class: "bg-tint/15 text-tint border-transparent",
      },
      {
        variant: "outline",
        color: "primary",
        class: "border-tint/35 text-tint",
      },

      // Secondary (neutral gray)
      {
        variant: "filled",
        color: "secondary",
        class: "bg-fill-secondary text-label-primary border-transparent",
      },
      {
        variant: "tinted",
        color: "secondary",
        class: "bg-fill-tertiary text-label-secondary border-transparent",
      },
      {
        variant: "outline",
        color: "secondary",
        class: "border-separator text-label-secondary",
      },

      // Success
      {
        variant: "filled",
        color: "success",
        class: "bg-success text-white border-transparent",
      },
      {
        variant: "tinted",
        color: "success",
        class: "bg-success/15 text-success border-transparent",
      },
      {
        variant: "outline",
        color: "success",
        class: "border-success/35 text-success",
      },

      // Warning
      {
        variant: "filled",
        color: "warning",
        class: "bg-warning text-white border-transparent",
      },
      {
        variant: "tinted",
        color: "warning",
        class: "bg-warning/15 text-warning border-transparent",
      },
      {
        variant: "outline",
        color: "warning",
        class: "border-warning/35 text-warning",
      },

      // Destructive
      {
        variant: "filled",
        color: "destructive",
        class: "bg-destructive text-white border-transparent",
      },
      {
        variant: "tinted",
        color: "destructive",
        class: "bg-destructive/15 text-destructive border-transparent",
      },
      {
        variant: "outline",
        color: "destructive",
        class: "border-destructive/35 text-destructive",
      },

      // Info
      {
        variant: "filled",
        color: "info",
        class: "bg-info text-white border-transparent",
      },
      {
        variant: "tinted",
        color: "info",
        class: "bg-info/15 text-info border-transparent",
      },
      {
        variant: "outline",
        color: "info",
        class: "border-info/35 text-info",
      },
    ],
    defaultVariants: {
      variant: "filled",
      color: "primary",
      size: "md",
      shape: "default",
    },
  }
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, color, size, shape, asChild = false, children, ...props }, ref) => {
    const Component = asChild ? Slot : "span";
    const isDot = children === undefined || children === null || children === "";

    return (
      <Component
        ref={ref}
        className={cn(
          badgeVariants({ variant, color, size, shape }),
          isDot && {
            "h-1.5 w-1.5 min-w-1.5 p-0 px-0 rounded-full": size === "sm",
            "h-2 w-2 min-w-2 p-0 px-0 rounded-full": size === "md" || !size,
            "h-2.5 w-2.5 min-w-2.5 p-0 px-0 rounded-full": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Badge.displayName = "Badge";
