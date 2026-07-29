"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";
import { springs } from "@/lib/motion";

/**
 * Button — the first component anatomy in Contour.
 * Demonstrates the full token system: color (semantic + tint), typography
 * (Headline), spacing (padding-control), radius (radius-md/full), motion
 * (press feedback scale via springs.snappy).
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "font-semibold text-headline",
    "whitespace-nowrap select-none",
    "transition-colors duration-200",
    "disabled:pointer-events-none disabled:opacity-40",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tint focus-visible:ring-offset-2",
  ],
  {
    variants: {
      variant: {
        filled: "bg-tint text-white hover:brightness-105 active:brightness-95",
        tinted: "bg-tint/15 text-tint hover:bg-tint/22",
        gray: "bg-fill-secondary text-label-primary hover:bg-fill-primary",
        plain: "bg-transparent text-tint hover:opacity-70",
        destructive: "bg-destructive text-white hover:brightness-105",
      },
      size: {
        sm: "h-8 px-3 rounded-sm text-subheadline",
        md: "h-10 px-4 rounded-md",
        lg: "h-12 px-5 rounded-lg text-body",
      },
      shape: {
        default: "",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "md",
      shape: "default",
    },
  },
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "size">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, ...props }, ref) => {
    if (asChild) {
      // Slot does not support motion props — strip them before rendering as child.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { onDrag, onDragStart, onDragEnd, onAnimationStart, ...slotProps } =
        props as ButtonProps & Record<string, unknown>;
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size, shape }), className)}
          {...(slotProps as React.ComponentPropsWithoutRef<"button">)}
        />
      );
    }

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96 }}
        transition={springs.snappy}
        className={cn(buttonVariants({ variant, size, shape }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
