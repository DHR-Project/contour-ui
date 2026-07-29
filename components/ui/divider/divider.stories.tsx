import type { Story } from "@ladle/react";
import { Divider } from "./divider";

export const Horizontal: Story = () => (
  <div style={{ width: 280 }}>
    <p>Above</p>
    <Divider />
    <p>Below</p>
  </div>
);

export const Vertical: Story = () => (
  <div style={{ display: "flex", alignItems: "stretch", gap: 12, height: 24 }}>
    <span>Left</span>
    <Divider orientation="vertical" />
    <span>Right</span>
  </div>
);

export const Labeled: Story = () => (
  <div style={{ width: 280 }}>
    <Divider>Or continue with</Divider>
  </div>
);
