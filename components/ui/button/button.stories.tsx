import type { Story } from "@ladle/react";
import { Button, type ButtonProps } from "./button";

export const Variants: Story = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
    <Button variant="filled">Filled</Button>
    <Button variant="tinted">Tinted</Button>
    <Button variant="gray">Gray</Button>
    <Button variant="plain">Plain</Button>
    <Button variant="destructive">Destructive</Button>
  </div>
);

export const Sizes: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </div>
);

export const Shapes: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Button shape="default">Default</Button>
    <Button shape="pill">Pill</Button>
  </div>
);

export const Disabled: Story = () => <Button disabled>Disabled</Button>;

export const Playground: Story<ButtonProps> = (props) => <Button {...props}>Button</Button>;
Playground.args = {
  variant: "filled",
  size: "md",
  shape: "default",
};
Playground.argTypes = {
  variant: {
    options: ["filled", "tinted", "gray", "plain", "destructive"],
    control: { type: "select" },
  },
  size: {
    options: ["sm", "md", "lg"],
    control: { type: "select" },
  },
  shape: {
    options: ["default", "pill"],
    control: { type: "select" },
  },
};
