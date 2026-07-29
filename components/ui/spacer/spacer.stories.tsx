import type { Story } from "@ladle/react";
import { HStack } from "@/components/ui/stack";
import { Spacer } from "./spacer";

function Box() {
  return (
    <div
      style={{ background: "rgb(0 122 255 / 0.15)", padding: 12, borderRadius: 8, width: 40 }}
    />
  );
}

export const Flexible: Story = () => (
  <HStack style={{ width: 240, border: "1px solid #ddd", padding: 8 }}>
    <Box />
    <Spacer />
    <Box />
  </HStack>
);

export const Fixed: Story = () => (
  <HStack>
    <Box />
    <Spacer size={32} />
    <Box />
  </HStack>
);
