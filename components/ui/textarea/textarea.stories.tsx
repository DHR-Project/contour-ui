import { useState } from "react";
import type { Story } from "@ladle/react";
import { Textarea } from "./textarea";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Textarea",
};

export default meta;

export const Basic: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Write a message…"
      />
    </div>
  );
};

export const WithCounter: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Bio (max 200 characters)"
        maxLength={200}
      />
    </div>
  );
};

/**
 * Type enough characters to cross the 90% threshold (default counterThreshold)
 * and watch the counter turn red.
 */
export const CounterWarning: Story = () => {
  const [value, setValue] = useState("a".repeat(92));
  return (
    <div className="w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Short bio"
        maxLength={100}
      />
    </div>
  );
};

export const WithError: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Description"
        error="This field is required"
      />
    </div>
  );
};

export const AutoResizeOff: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-80">
      <Textarea
        value={value}
        onValueChange={setValue}
        placeholder="Fixed height (autoResize=false, rows=5)"
        autoResize={false}
        rows={5}
      />
    </div>
  );
};

export const Disabled: Story = () => (
  <div className="w-80">
    <Textarea
      value="Cannot edit this content."
      onValueChange={() => {}}
      disabled
    />
  </div>
);

export const AllVariants: Story = () => {
  const [a, setA] = useState("");
  const [b, setB] = useState("a".repeat(92));
  const [c, setC] = useState("");
  return (
    <VStack gap="6" className="w-80">
      <Textarea value={a} onValueChange={setA} placeholder="Default" />
      <Textarea
        value={a}
        onValueChange={setA}
        placeholder="With counter"
        maxLength={200}
      />
      <Textarea
        value={b}
        onValueChange={setB}
        maxLength={100}
        placeholder="Warning counter"
      />
      <Textarea
        value={c}
        onValueChange={setC}
        placeholder="Error state"
        error="Required"
      />
      <Textarea
        value="Disabled content."
        onValueChange={() => {}}
        disabled
      />
    </VStack>
  );
};
