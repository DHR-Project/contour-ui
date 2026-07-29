import type { Story } from "@ladle/react";
import { Textarea, type TextareaProps } from "./textarea";

export const Basic: Story = () => (
  <div style={{ width: 320 }}>
    <Textarea label="Bio" placeholder="Tell us about yourself" />
  </div>
);

export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
    <Textarea size="sm" label="Small" placeholder="Placeholder" rows={2} />
    <Textarea size="md" label="Medium" placeholder="Placeholder" rows={3} />
    <Textarea size="lg" label="Large" placeholder="Placeholder" rows={4} />
  </div>
);

export const HelperAndError: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
    <Textarea label="Notes" helperText="Optional, visible to your team only." />
    <Textarea label="Notes" errorText="Notes can't be empty." />
  </div>
);

export const Disabled: Story = () => (
  <div style={{ width: 320 }}>
    <Textarea label="Disabled" defaultValue="Can't touch this" disabled />
  </div>
);

export const Playground: Story<TextareaProps> = (props) => (
  <div style={{ width: 320 }}>
    <Textarea {...props} />
  </div>
);
Playground.args = {
  label: "Label",
  placeholder: "Placeholder",
  size: "md",
  rows: 4,
};
Playground.argTypes = {
  size: {
    options: ["sm", "md", "lg"],
    control: { type: "select" },
  },
};
