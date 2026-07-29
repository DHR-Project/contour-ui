import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Text - renders the type scale defined in styles/tokens.css.
 * Each variant maps to a sensible default HTML element; override with `as`.
 */
const textVariants = cva("", {
  variants: {
    variant: {
      largeTitle: "text-large-title font-normal",
      title1: "text-title-1 font-normal",
      title2: "text-title-2 font-normal",
      title3: "text-title-3 font-normal",
      headline: "text-headline font-semibold",
      body: "text-body font-normal",
      callout: "text-callout font-normal",
      subheadline: "text-subheadline font-normal",
      footnote: "text-footnote font-normal",
      caption1: "text-caption-1 font-normal",
      caption2: "text-caption-2 font-normal",
    },
    color: {
      primary: "text-label-primary",
      secondary: "text-label-secondary",
      tertiary: "text-label-tertiary",
      quaternary: "text-label-quaternary",
      tint: "text-tint",
      destructive: "text-destructive",
      success: "text-success",
      warning: "text-warning",
    },
    weight: {
      regular: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    variant: "body",
    color: "primary",
  },
});

type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;

const defaultElement: Record<TextVariant, React.ElementType> = {
  largeTitle: "h1",
  title1: "h1",
  title2: "h2",
  title3: "h3",
  headline: "p",
  body: "p",
  callout: "p",
  subheadline: "p",
  footnote: "p",
  caption1: "span",
  caption2: "span",
};

export interface TextProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  /** Override the default HTML element for this variant. */
  as?: React.ElementType;
  /** Render props onto the immediate child instead of a new element. */
  asChild?: boolean;
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, variant = "body", color, weight, truncate, as, asChild = false, ...props }, ref) => {
    const Component: React.ElementType = asChild
      ? Slot
      : (as ?? defaultElement[variant as TextVariant]);

    return (
      <Component
        ref={ref}
        className={cn(textVariants({ variant, color, weight, truncate }), className)}
        {...props}
      />
    );
  },
);
Text.displayName = "Text";
