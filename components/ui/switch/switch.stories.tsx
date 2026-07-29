import { useState } from "react";
import type { Story } from "@ladle/react";
import { Switch, type SwitchProps } from "./switch";

export const Sizes: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Switch size="sm" defaultChecked />
    <Switch size="md" defaultChecked />
  </div>
);

export const Uncontrolled: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Switch defaultChecked={false} />
    <Switch defaultChecked />
  </div>
);

export const Controlled: Story = () => {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onCheckedChange={setChecked} />;
};

export const Disabled: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Switch disabled />
    <Switch disabled defaultChecked />
  </div>
);

export const Playground: Story<SwitchProps> = (props) => <Switch {...props} />;
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
