import { useState } from "react";
import type { Story } from "@ladle/react";
import { RadioGroup } from "./radio";

const meta = {
  title: "Components / Radio",
};

export default meta;

const OPTIONS = [
  { value: "list", label: "List" },
  { value: "grid", label: "Grid" },
  { value: "compact", label: "Compact" },
];

export const Vertical: Story = () => {
  const [value, setValue] = useState("list");
  return <RadioGroup value={value} onValueChange={setValue} options={OPTIONS} />;
};

export const Horizontal: Story = () => {
  const [value, setValue] = useState("list");
  return (
    <RadioGroup value={value} onValueChange={setValue} options={OPTIONS} direction="horizontal" />
  );
};

export const Sizes: Story = () => {
  const [value, setValue] = useState("list");
  return (
    <div className="flex flex-col gap-6">
      <RadioGroup value={value} onValueChange={setValue} options={OPTIONS} size="sm" direction="horizontal" />
      <RadioGroup value={value} onValueChange={setValue} options={OPTIONS} size="md" direction="horizontal" />
    </div>
  );
};

export const WithDisabledOption: Story = () => {
  const [value, setValue] = useState("list");
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      options={[...OPTIONS, { value: "map", label: "Map (unavailable)", disabled: true }]}
    />
  );
};

export const DisabledGroup: Story = () => (
  <RadioGroup value="list" onValueChange={() => {}} options={OPTIONS} disabled />
);
