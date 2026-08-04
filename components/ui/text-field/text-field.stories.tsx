import { useState } from "react";
import type { Story } from "@ladle/react";
import { TextField } from "./text-field";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / TextField",
};

export default meta;

export const Basic: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-72">
      <TextField value={value} onValueChange={setValue} placeholder="Email" type="email" />
    </div>
  );
};

export const Sizes: Story = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  return (
    <VStack gap="4" className="w-72">
      <TextField value={a} onValueChange={setA} placeholder="Small" size="sm" />
      <TextField value={b} onValueChange={setB} placeholder="Medium" size="md" />
    </VStack>
  );
};

export const WithIcons: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-72">
      <TextField value={value} onValueChange={setValue} placeholder="Search" leadingIcon="search" />
    </div>
  );
};

/**
 * A clickable trailing icon (clear button) needs its own accessible name
 * (rule 6.3) -- `onTrailingIconClick` + `trailingIconLabel` wire that up;
 * without a handler, `trailingIcon` alone stays purely decorative.
 */
export const ClearableInput: Story = () => {
  const [value, setValue] = useState("Hello");
  return (
    <div className="w-72">
      <TextField
        value={value}
        onValueChange={setValue}
        trailingIcon="close"
        onTrailingIconClick={() => setValue("")}
        trailingIconLabel="Clear"
      />
    </div>
  );
};

export const PasswordVisibilityToggle: Story = () => {
  const [value, setValue] = useState("hunter2");
  const [visible, setVisible] = useState(false);
  return (
    <div className="w-72">
      <TextField
        value={value}
        onValueChange={setValue}
        type={visible ? "text" : "password"}
        trailingIcon={visible ? "eye-off" : "eye"}
        onTrailingIconClick={() => setVisible((v) => !v)}
        trailingIconLabel={visible ? "Hide password" : "Show password"}
      />
    </div>
  );
};

export const ErrorState: Story = () => {
  const [value, setValue] = useState("not-an-email");
  return (
    <div className="w-72">
      <TextField
        value={value}
        onValueChange={setValue}
        type="email"
        error="Enter a valid email address"
      />
    </div>
  );
};

export const Disabled: Story = () => (
  <div className="w-72">
    <TextField value="Read-only value" onValueChange={() => {}} disabled />
  </div>
);
