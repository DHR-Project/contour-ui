import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Divider — a thin separator line, horizontal or vertical. With children,
 * renders as a labeled divider (two line segments with content between
 * them, e.g. "Or continue with") instead of a plain <hr> - text content
 * only makes sense on the horizontal axis, so children are ignored for
 * the vertical orientation.
 *
 * Vertical dividers need an explicit height from their parent (e.g. an
 * HStack with align="stretch", or an explicit height class) since a line
 * with no content has no intrinsic height on its own.
 */
export type DividerOrientation = "horizontal" | "vertical";

export interface DividerProps extends React.HTMLAttributes<HTMLElement> {
  orientation?: DividerOrientation;
  /** Optional label rendered between two line segments. Horizontal only. */
  children?: React.ReactNode;
}

export const Divider = React.forwardRef<HTMLElement, DividerProps>(
  ({ orientation = "horizontal", children, className, ...props }, ref) => {
    if (children) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="separator"
          aria-orientation="horizontal"
          className={cn(
            "flex items-center gap-3 text-footnote text-label-tertiary",
            className,
          )}
          {...props}
        >
          <span aria-hidden className="h-px flex-1 bg-separator" />
          {children}
          <span aria-hidden className="h-px flex-1 bg-separator" />
        </div>
      );
    }

    return (
      <hr
        ref={ref as React.Ref<HTMLHRElement>}
        aria-orientation={orientation}
        className={cn(
          "m-0 shrink-0 border-0 bg-separator",
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className,
        )}
        {...props}
      />
    );
  },
);
Divider.displayName = "Divider";
