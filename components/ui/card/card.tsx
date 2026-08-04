import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { gapValue } from "@/lib/ui/spacing";
import type { SpaceToken } from "@/lib/types/spacing.types";

export type CardElevation = "flat" | "raised";
export type CardPadding = SpaceToken | "default";
export type CardCorner = "standard" | "squircle";
export type CardElement = "div" | "article" | "section";

// --radius-lg is designated for Card/Sheet content (styles/tokens.css SS5.1).
const cardStyles = cva("bg-bg-grouped-secondary", {
  variants: {
    elevation: {
      flat: "border border-separator",
      raised: "shadow-sm",
    },
    corner: {
      standard: "rounded-lg",
      // True continuous-corner squircle isn't implemented yet (see Button) --
      // falls back to a larger standard radius.
      squircle: "rounded-2xl",
    },
  },
  defaultVariants: {
    elevation: "flat",
    corner: "standard",
  },
});

export interface CardProps extends HTMLAttributes<HTMLElement> {
  elevation?: CardElevation;
  /** "default" uses the shared responsive block padding (--inset-grouped-margin-x); a raw SpaceToken is fixed, not responsive. */
  padding?: CardPadding;
  corner?: CardCorner;
  as?: CardElement;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    elevation = "flat",
    padding = "default",
    corner = "standard",
    as: Component = "div",
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const paddingValue = padding === "default" ? "var(--inset-grouped-margin-x)" : gapValue(padding);

  return (
    <Component
      ref={ref as never}
      className={cn(cardStyles({ elevation, corner }), className)}
      style={{ ...style, padding: paddingValue }}
      {...rest}
    >
      {children}
    </Component>
  );
});
