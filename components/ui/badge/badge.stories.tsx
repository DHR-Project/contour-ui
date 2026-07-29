import type { Story } from "@ladle/react";
import { Badge, type BadgeProps } from "./badge";

export const Variants: Story = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Badge variant="filled">Filled</Badge>
    <Badge variant="tinted">Tinted</Badge>
    <Badge variant="outline">Outline</Badge>
  </div>
);

export const Colors: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Filled</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge variant="filled" color="primary">Primary</Badge>
        <Badge variant="filled" color="secondary">Secondary</Badge>
        <Badge variant="filled" color="success">Success</Badge>
        <Badge variant="filled" color="warning">Warning</Badge>
        <Badge variant="filled" color="destructive">Destructive</Badge>
        <Badge variant="filled" color="info">Info</Badge>
      </div>
    </div>
    <div>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Tinted</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge variant="tinted" color="primary">Primary</Badge>
        <Badge variant="tinted" color="secondary">Secondary</Badge>
        <Badge variant="tinted" color="success">Success</Badge>
        <Badge variant="tinted" color="warning">Warning</Badge>
        <Badge variant="tinted" color="destructive">Destructive</Badge>
        <Badge variant="tinted" color="info">Info</Badge>
      </div>
    </div>
    <div>
      <h4 style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>Outline</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <Badge variant="outline" color="primary">Primary</Badge>
        <Badge variant="outline" color="secondary">Secondary</Badge>
        <Badge variant="outline" color="success">Success</Badge>
        <Badge variant="outline" color="warning">Warning</Badge>
        <Badge variant="outline" color="destructive">Destructive</Badge>
        <Badge variant="outline" color="info">Info</Badge>
      </div>
    </div>
  </div>
);

export const Sizes: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Badge size="sm">Small</Badge>
    <Badge size="md">Medium</Badge>
    <Badge size="lg">Large</Badge>
  </div>
);

export const Shapes: Story = () => (
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    <Badge shape="default">Default</Badge>
    <Badge shape="pill">Pill</Badge>
  </div>
);

export const StatusDots: Story = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Badge size="sm" color="success" />
    <Badge size="md" color="warning" />
    <Badge size="lg" color="destructive" />
    <Badge size="md" color="primary" />
    <Badge size="md" color="info" />
    <Badge size="md" color="secondary" />
  </div>
);

export const Playground: Story<BadgeProps> = (props) => <Badge {...props}>Badge</Badge>;
Playground.args = {
  variant: "filled",
  color: "primary",
  size: "md",
  shape: "default",
};
Playground.argTypes = {
  variant: {
    options: ["filled", "tinted", "outline"],
    control: { type: "select" },
  },
  color: {
    options: ["primary", "secondary", "success", "warning", "destructive", "info"],
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
