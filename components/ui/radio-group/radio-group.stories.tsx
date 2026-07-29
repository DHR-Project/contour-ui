import { useState } from "react";
import type { Story } from "@ladle/react";
import { RadioGroup, RadioGroupItem } from "./radio-group";

export const Sizes: Story = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <RadioGroup defaultValue="a">
      <RadioGroupItem size="sm" value="a" />
    </RadioGroup>
    <RadioGroup defaultValue="a">
      <RadioGroupItem size="md" value="a" />
    </RadioGroup>
  </div>
);

export const Basic: Story = () => (
  <RadioGroup defaultValue="b">
    <RadioGroupItem value="a" />
    <RadioGroupItem value="b" />
    <RadioGroupItem value="c" />
  </RadioGroup>
);

export const Disabled: Story = () => (
  <RadioGroup defaultValue="a">
    <RadioGroupItem value="a" />
    <RadioGroupItem value="b" disabled />
  </RadioGroup>
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("a");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <RadioGroupItem value="a" />
      <RadioGroupItem value="b" />
      <RadioGroupItem value="c" />
    </RadioGroup>
  );
};

export const Playground: Story<{ size: "sm" | "md" }> = ({ size }) => (
  <RadioGroup defaultValue="a">
    <RadioGroupItem size={size} value="a" />
    <RadioGroupItem size={size} value="b" />
  </RadioGroup>
);
Playground.args = {
  size: "md",
};
Playground.argTypes = {
  size: {
    options: ["sm", "md"],
    control: { type: "select" },
  },
};
