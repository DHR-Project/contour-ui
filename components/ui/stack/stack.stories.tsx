import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { Stack, HStack, VStack, type StackProps } from "./stack";

function Box({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "rgb(0 122 255 / 0.15)", padding: 12, borderRadius: 8 }}>
      {children}
    </div>
  );
}

export const VStackDemo: Story = () => (
  <VStack gap="2">
    <Box>1</Box>
    <Box>2</Box>
    <Box>3</Box>
  </VStack>
);

export const HStackDemo: Story = () => (
  <HStack gap="2">
    <Box>1</Box>
    <Box>2</Box>
    <Box>3</Box>
  </HStack>
);

export const Playground: Story<StackProps> = (props) => (
  <Stack {...props}>
    <Box>1</Box>
    <Box>2</Box>
    <Box>3</Box>
  </Stack>
);
Playground.args = {
  direction: "column",
  gap: "4",
};
Playground.argTypes = {
  direction: {
    options: ["row", "column"],
    control: { type: "select" },
  },
  align: {
    options: ["start", "center", "end", "stretch", "baseline"],
    control: { type: "select" },
  },
  justify: {
    options: ["start", "center", "end", "between", "around", "evenly"],
    control: { type: "select" },
  },
  gap: {
    options: ["0", "1", "2", "3", "4", "5", "6", "8", "12", "16", "20"],
    control: { type: "select" },
  },
};
