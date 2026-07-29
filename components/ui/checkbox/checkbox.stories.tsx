import { useState } from "react";
import type { Story } from "@ladle/react";
import { Checkbox, type CheckboxProps } from "./checkbox";

export const Sizes: Story = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Checkbox size="sm" defaultChecked />
    <Checkbox size="md" defaultChecked />
  </div>
);

export const States: Story = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Checkbox />
    <Checkbox defaultChecked />
    <Checkbox checked="indeterminate" />
  </div>
);

export const Disabled: Story = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Checkbox disabled />
    <Checkbox disabled defaultChecked />
  </div>
);

export const Controlled: Story = () => {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
};

export const Playground: Story<CheckboxProps> = (props) => <Checkbox {...props} />;
Playground.args = {
  size: "md",
  defaultChecked: false,
};
Playground.argTypes = {
  size: {
    options: ["sm", "md"],
    control: { type: "select" },
  },
};
