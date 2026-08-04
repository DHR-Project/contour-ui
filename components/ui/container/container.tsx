import { forwardRef } from "react";
import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type ContainerVariant = "page" | "content";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  variant?: ContainerVariant;
  children?: ReactNode;
}

// Page-edge padding: max(page margin, safe area) so notches/cutouts never
// eat into the margin instead of adding to it (design-tokens-summary.md SS4.4).
const EDGE_PADDING =
  "pl-[max(var(--page-margin),var(--safe-area-left))] pr-[max(var(--page-margin),var(--safe-area-right))]";

export const Container = forwardRef<HTMLDivElement, ContainerProps>(function Container(
  { variant = "page", className, children, ...rest },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        EDGE_PADDING,
        variant === "content" && "max-w-[var(--container-max-width)] mx-auto",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
});
