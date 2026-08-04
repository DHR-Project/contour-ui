import { forwardRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { gapValue } from "@/lib/ui/spacing";
import type { GapToken } from "@/lib/types/spacing.types";

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexJustify = "start" | "end" | "center" | "between" | "around" | "evenly";
export type FlexAlign = "start" | "end" | "center" | "stretch" | "baseline";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type FlexElement =
  | "div"
  | "section"
  | "article"
  | "header"
  | "footer"
  | "nav"
  | "ul"
  | "li"
  | "form";

const DIRECTION_CLASS: Record<FlexDirection, string> = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  column: "flex-col",
  "column-reverse": "flex-col-reverse",
};

const JUSTIFY_CLASS: Record<FlexJustify, string> = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const ALIGN_CLASS: Record<FlexAlign, string> = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const WRAP_CLASS: Record<FlexWrap, string> = {
  nowrap: "flex-nowrap",
  wrap: "flex-wrap",
  "wrap-reverse": "flex-wrap-reverse",
};

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  direction?: FlexDirection;
  justify?: FlexJustify;
  align?: FlexAlign;
  wrap?: FlexWrap;
  gap?: GapToken;
  /** Marks this element as a container-query root (`container-type: inline-size`). Default true. */
  container?: boolean;
  as?: FlexElement;
  children?: ReactNode;
}

export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(
  {
    direction = "row",
    justify = "start",
    align = "stretch",
    wrap = "nowrap",
    gap,
    container = true,
    as: Component = "div",
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const mergedStyle: CSSProperties | undefined =
    gap !== undefined ? { ...style, gap: gapValue(gap) } : style;

  return (
    <Component
      ref={ref as never}
      className={cn(
        "flex",
        DIRECTION_CLASS[direction],
        JUSTIFY_CLASS[justify],
        ALIGN_CLASS[align],
        WRAP_CLASS[wrap],
        container && "@container",
        className,
      )}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </Component>
  );
});
