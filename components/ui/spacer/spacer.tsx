import * as React from "react";

import { cn } from "@/lib/utils";

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Fixed size in pixels. Omit to get a flexible spacer that grows to fill
   * the remaining space in a flex container (the common case: pushing one
   * item to the end of a Stack/Flex).
   */
  size?: number;
  /** Which axis the fixed size applies to. Ignored when size is omitted. */
  axis?: "horizontal" | "vertical";
}

/**
 * Spacer — an empty, non-interactive layout node. With no size, it's a
 * flex-1 filler that pushes surrounding items apart. With a size, it's a
 * fixed gap on one axis, for spacing that a Stack/Flex `gap` can't express
 * (e.g. one larger gap between two groups inside the same row).
 */
export const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ size, axis = "horizontal", className, style, ...props }, ref) => {
    if (size === undefined) {
      return (
        <div
          ref={ref}
          aria-hidden
          className={cn("flex-1", className)}
          style={style}
          {...props}
        />
      );
    }

    const sizeStyle = axis === "horizontal" ? { width: size } : { height: size };

    return (
      <div
        ref={ref}
        aria-hidden
        className={cn("shrink-0", className)}
        style={{ ...sizeStyle, ...style }}
        {...props}
      />
    );
  },
);
Spacer.displayName = "Spacer";
