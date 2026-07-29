import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { Flex, type FlexProps } from "./flex";

function Box({ children }: { children: ReactNode }) {
  return (
    <div style={{ background: "rgb(0 122 255 / 0.15)", padding: 12, borderRadius: 8 }}>
      {children}
    </div>
  );
}

export const Direction: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <Flex direction="row" gap="2">
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Flex>
    <Flex direction="column" gap="2">
      <Box>1</Box>
      <Box>2</Box>
      <Box>3</Box>
    </Flex>
  </div>
);

export const Wrap: Story = () => (
  <Flex direction="row" wrap gap="2" style={{ width: 200 }}>
    {Array.from({ length: 8 }).map((_, i) => (
      <Box key={i}>{i + 1}</Box>
    ))}
  </Flex>
);

export const Playground: Story<FlexProps> = (props) => (
  <Flex {...props}>
    <Box>1</Box>
    <Box>2</Box>
    <Box>3</Box>
  </Flex>
);
Playground.args = {
  direction: "row",
  gap: "2",
  wrap: false,
};
Playground.argTypes = {
  direction: {
    options: ["row", "column", "row-reverse", "column-reverse"],
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
