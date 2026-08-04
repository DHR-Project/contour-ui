import { forwardRef } from "react";
import { Flex } from "@/components/ui/flex";
import type { FlexProps } from "@/components/ui/flex";

export type StackDirection = "horizontal" | "vertical";

export interface StackProps extends Omit<FlexProps, "direction" | "gap"> {
  direction: StackDirection;
  gap?: FlexProps["gap"];
}

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction, gap = "row", ...rest },
  ref,
) {
  return <Flex ref={ref} direction={direction === "horizontal" ? "row" : "column"} gap={gap} {...rest} />;
});

export type HStackProps = Omit<StackProps, "direction">;

export const HStack = forwardRef<HTMLElement, HStackProps>(function HStack(props, ref) {
  return <Stack ref={ref} direction="horizontal" {...props} />;
});

export type VStackProps = Omit<StackProps, "direction">;

export const VStack = forwardRef<HTMLElement, VStackProps>(function VStack(props, ref) {
  return <Stack ref={ref} direction="vertical" {...props} />;
});
