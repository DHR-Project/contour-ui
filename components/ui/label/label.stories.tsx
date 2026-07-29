import type { Story } from "@ladle/react";
import { Label } from "./label";
import { Checkbox } from "@/components/ui/checkbox";
import { TextField } from "@/components/ui/text-field";

export const Basic: Story = () => <Label htmlFor="basic-input">Email</Label>;

export const Required: Story = () => (
  <Label htmlFor="required-input" required>
    Email
  </Label>
);

export const WrappingControl: Story = () => (
  <Label>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Checkbox defaultChecked />
      <span>Accept terms</span>
    </div>
  </Label>
);

export const FieldCaption: Story = () => <TextField label="Email" placeholder="you@example.com" />;
