import { forwardRef, useId } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { gapValue } from "@/lib/ui/spacing";
import type { GapToken } from "@/lib/types/spacing.types";
import { SIZE_CLASS_MIN_WIDTH } from "@/lib/types/size-class.types";
import type { SizeClass } from "@/lib/types/size-class.types";

export type { SizeClass };
export type MinItemWidth = "xs" | "sm" | "md" | "lg" | "xl";
export type GridElement = "div" | "section" | "ul" | "ol";

const BREAKPOINT_MIN_WIDTH: Record<Exclude<SizeClass, "compact">, string> = {
  regular: `${SIZE_CLASS_MIN_WIDTH.regular}px`,
  "regular-lg": `${SIZE_CLASS_MIN_WIDTH["regular-lg"]}px`,
  "regular-xl": `${SIZE_CLASS_MIN_WIDTH["regular-xl"]}px`,
};

const MIN_ITEM_VALUE: Record<MinItemWidth, string> = {
  xs: "var(--grid-min-item-xs)",
  sm: "var(--grid-min-item-sm)",
  md: "var(--grid-min-item-md)",
  lg: "var(--grid-min-item-lg)",
  xl: "var(--grid-min-item-xl)",
};

interface GridBaseProps extends Omit<HTMLAttributes<HTMLElement>, "className"> {
  gap?: GapToken;
  gapX?: GapToken;
  gapY?: GapToken;
  /** Marks this element as a container-query root (`container-type: inline-size`). Default true. */
  container?: boolean;
  as?: GridElement;
  className?: string;
  children?: ReactNode;
}

export type GridProps = GridBaseProps &
  (
    | {
        /** Fixed column count, or per size-class counts (compact-first: unset tiers inherit the nearest smaller one). Default 1. */
        columns?: number | Partial<Record<SizeClass, number>>;
        minItemWidth?: never;
      }
    | {
        columns: "auto-fit" | "auto-fill";
        /** Required when columns is "auto-fit" | "auto-fill". */
        minItemWidth: MinItemWidth;
      }
  );

function sanitizeId(id: string) {
  return id.replace(/[^a-zA-Z0-9-]/g, "");
}

export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(
  {
    columns = 1,
    minItemWidth,
    gap,
    gapX,
    gapY,
    container = true,
    as: Component = "div",
    className,
    style,
    children,
    ...rest
  },
  ref,
) {
  const rawId = useId();
  const scopeClass = `contour-grid-${sanitizeId(rawId)}`;

  const isResponsive = typeof columns === "object";

  const mergedStyle: CSSProperties = { ...style };
  if (gap !== undefined) mergedStyle.gap = gapValue(gap);
  if (gapX !== undefined) mergedStyle.columnGap = gapValue(gapX);
  if (gapY !== undefined) mergedStyle.rowGap = gapValue(gapY);

  let responsiveStyleTag: ReactNode = null;

  if (columns === "auto-fit" || columns === "auto-fill") {
    // minItemWidth is guaranteed by GridProps' discriminated union whenever
    // columns is "auto-fit" | "auto-fill" -- TS just can't correlate it
    // through the destructured parameter, hence the cast.
    const minWidth = MIN_ITEM_VALUE[minItemWidth as MinItemWidth];
    mergedStyle.gridTemplateColumns = `repeat(${columns}, minmax(${minWidth}, 1fr))`;
  } else if (isResponsive) {
    const tiers = columns as Partial<Record<SizeClass, number>>;
    const base = tiers.compact ?? 1;
    const rules = [`.${scopeClass}{grid-template-columns:repeat(${base},1fr);}`];
    (Object.keys(BREAKPOINT_MIN_WIDTH) as Array<Exclude<SizeClass, "compact">>).forEach((tier) => {
      const count = tiers[tier];
      if (count !== undefined) {
        rules.push(
          `@media (min-width:${BREAKPOINT_MIN_WIDTH[tier]}){.${scopeClass}{grid-template-columns:repeat(${count},1fr);}}`,
        );
      }
    });
    responsiveStyleTag = <style>{rules.join("\n")}</style>;
  } else {
    mergedStyle.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  }

  return (
    <>
      {responsiveStyleTag}
      <Component
        ref={ref as never}
        className={cn("grid", isResponsive && scopeClass, container && "@container", className)}
        style={mergedStyle}
        {...rest}
      >
        {children}
      </Component>
    </>
  );
});
