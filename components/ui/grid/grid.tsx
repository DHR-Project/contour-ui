import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/lib/utils";
import { resolveResponsive, type ResponsiveValue } from "@/lib/ui/responsive";
import { gapClass, type SpacingStep } from "@/lib/ui/spacing";

/**
 * Grid — CSS grid layout primitive with a fixed column count. For anything
 * more dynamic (auto-fit tracks, spanning cells), drop to raw Tailwind grid
 * classes via className instead of extending this component's API.
 *
 * columns and gap accept a responsive value - see lib/ui/responsive.ts -
 * so e.g. `columns={{ base: "1", regular: "2", regularLg: "3" }}` grows
 * the grid at each breakpoint.
 */
export type GridColumns = "1" | "2" | "3" | "4" | "5" | "6" | "12";

const columnsClass: Record<GridColumns, string> = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
  "5": "grid-cols-5",
  "6": "grid-cols-6",
  "12": "grid-cols-12",
};

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: ResponsiveValue<GridColumns>;
  gap?: ResponsiveValue<SpacingStep>;
  /**
   * Establishes a container query context (Tailwind's `@container`) on
   * this element, so descendant layout components can size themselves
   * against it instead of the viewport.
   */
  container?: boolean;
  /** Render as a different element, e.g. "ul". */
  as?: React.ElementType;
  /** Render props onto the immediate child instead of a new element. */
  asChild?: boolean;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (
    { className, columns = "2", gap = "4", container, as, asChild = false, ...props },
    ref,
  ) => {
    const Component: React.ElementType = asChild ? Slot : (as ?? "div");

    return (
      <Component
        ref={ref}
        className={cn(
          "grid",
          container && "@container",
          resolveResponsive(columns, columnsClass),
          resolveResponsive(gap, gapClass),
          className,
        )}
        {...props}
      />
    );
  },
);
Grid.displayName = "Grid";
