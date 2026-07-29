import * as React from "react";

import { Flex, type FlexProps } from "@/components/ui/flex";
import type { ResponsiveValue } from "@/lib/ui/responsive";

/**
 * Stack — the opinionated layout primitive for laying a run of things out
 * with consistent spacing. Built on Flex, but only exposes the two
 * order-preserving directions (no reverse) and defaults to a 16px gap
 * instead of Flex's unopinionated gap-0. direction (like every other
 * Flex prop it forwards) accepts a responsive value - see
 * lib/ui/responsive.ts.
 */
export type StackDirection = "row" | "column";

export interface StackProps extends Omit<FlexProps, "direction"> {
  direction?: ResponsiveValue<StackDirection>;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ direction = "column", gap = "4", ...props }, ref) => (
    <Flex ref={ref} direction={direction} gap={gap} {...props} />
  ),
);
Stack.displayName = "Stack";

export type HStackProps = Omit<StackProps, "direction">;

/** Stack with direction locked to "row". */
export const HStack = React.forwardRef<HTMLDivElement, HStackProps>((props, ref) => (
  <Stack ref={ref} direction="row" {...props} />
));
HStack.displayName = "HStack";

export type VStackProps = Omit<StackProps, "direction">;

/** Stack with direction locked to "column". */
export const VStack = React.forwardRef<HTMLDivElement, VStackProps>((props, ref) => (
  <Stack ref={ref} direction="column" {...props} />
));
VStack.displayName = "VStack";
