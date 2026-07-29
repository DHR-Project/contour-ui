import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { resolveResponsive, type ResponsiveValue } from "@/lib/ui/responsive";
import { gapClass, type SpacingStep } from "@/lib/ui/spacing";

/**
 * Flex — the low-level flexbox primitive every other layout component
 * (Stack, HStack, VStack) builds on. Unopinionated: no default gap, and
 * exposes the reverse directions. Reach for Stack when you just want to
 * lay a few things out with consistent spacing.
 *
 * Every prop below accepts a plain value or a ResponsiveObject to vary it
 * by viewport or container breakpoint - see lib/ui/responsive.ts.
 */
export type FlexDirection = "row" | "column" | "row-reverse" | "column-reverse";
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type FlexJustify = "start" | "center" | "end" | "between" | "around" | "evenly";
export type FlexWrap = "wrap" | "nowrap";

const directionClass: Record<FlexDirection, string> = {
  row: "flex-row",
  column: "flex-col",
  "row-reverse": "flex-row-reverse",
  "column-reverse": "flex-col-reverse",
};

const alignClass: Record<FlexAlign, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClass: Record<FlexJustify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const wrapClass: Record<FlexWrap, string> = {
  wrap: "flex-wrap",
  nowrap: "flex-nowrap",
};

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: ResponsiveValue<FlexDirection>;
  align?: ResponsiveValue<FlexAlign>;
  justify?: ResponsiveValue<FlexJustify>;
  gap?: ResponsiveValue<SpacingStep>;
  /** Also accepts a plain boolean as shorthand for "wrap" / "nowrap". */
  wrap?: ResponsiveValue<FlexWrap> | boolean;
  /**
   * Establishes a container query context (Tailwind's `@container`) on
   * this element, so descendant layout components can size themselves
   * against it - via their own containerSm/Md/Lg/Xl responsive keys -
   * instead of the viewport.
   */
  container?: boolean;
  /** Render as a different element, e.g. "section" or "ul". */
  as?: React.ElementType;
  /** Render props onto the immediate child instead of a new element. */
  asChild?: boolean;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      className,
      direction = "row",
      align,
      justify,
      gap,
      wrap,
      container,
      as,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Component: React.ElementType = asChild ? Slot : (as ?? "div");
    const resolvedWrap: ResponsiveValue<FlexWrap> | undefined =
      typeof wrap === "boolean" ? (wrap ? "wrap" : "nowrap") : wrap;

    return (
      <Component
        ref={ref}
        className={cn(
          "flex",
          container && "@container",
          resolveResponsive(direction, directionClass),
          resolveResponsive(align, alignClass),
          resolveResponsive(justify, justifyClass),
          resolveResponsive(gap, gapClass),
          resolveResponsive(resolvedWrap, wrapClass),
          className,
        )}
        {...props}
      />
    );
  },
);
Flex.displayName = "Flex";
