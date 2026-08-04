import type { Story } from "@ladle/react";
import { HStack, Stack, VStack } from "./stack";

const meta = {
  title: "Layout / Stack",
};

export default meta;

const swatch = (label: string) => (
  <div
    key={label}
    className="flex h-12 w-12 items-center justify-center rounded-sm bg-fill-secondary text-footnote text-label-secondary"
  >
    {label}
  </div>
);

/**
 * `gap` defaults to the "row" semantic token (--padding-row-y, SS4.2) since
 * Stack is most commonly used to lay out adjacent list-like items.
 */
export const Default: Story = () => <HStack>{["A", "B", "C"].map(swatch)}</HStack>;

export const HorizontalAndVertical: Story = () => (
  <VStack gap="section">
    <HStack gap="2">{["A", "B", "C"].map(swatch)}</HStack>
    <VStack gap="2">{["A", "B", "C"].map(swatch)}</VStack>
  </VStack>
);

/**
 * `Stack` with a dynamic `direction` prop -- useful when the axis flips
 * conditionally (e.g. compact vs regular) without branching JSX.
 */
export const DynamicDirection: Story = () => (
  <Stack direction="horizontal" gap="4">
    {["A", "B", "C"].map(swatch)}
  </Stack>
);
