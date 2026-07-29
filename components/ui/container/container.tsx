import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Container — centers content and caps its width, with horizontal padding
 * that tracks the responsive --page-margin token (the same one the docs
 * shell uses) so page-level content stays aligned across breakpoints.
 *
 * Also establishes a container query context by default (Tailwind's
 * `@container`), since a page-width cap is the natural place to opt into
 * container queries - descendant Flex/Stack/Grid components can then size
 * themselves against it via their containerSm/Md/Lg/Xl responsive keys
 * instead of the viewport. Set `container={false}` to opt out.
 */
const containerVariants = cva("mx-auto w-full px-(--page-margin)", {
  variants: {
    size: {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  /** Establish a container query context for descendants. Default true. */
  container?: boolean;
  /** Render as a different element, e.g. "section" or "main". */
  as?: React.ElementType;
  /** Render props onto the immediate child instead of a new element. */
  asChild?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, container = true, as, asChild = false, ...props }, ref) => {
    const Component: React.ElementType = asChild ? Slot : (as ?? "div");

    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size }), container && "@container", className)}
        {...props}
      />
    );
  },
);
Container.displayName = "Container";
