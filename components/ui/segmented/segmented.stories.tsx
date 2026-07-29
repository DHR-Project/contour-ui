import { useState } from "react";
import type { Story } from "@ladle/react";
import { Segmented, type SegmentedProps } from "./segmented";

const dayOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start" }}>
    <Segmented size="sm" options={dayOptions} defaultValue="week" aria-label="Range (small)" />
    <Segmented size="md" options={dayOptions} defaultValue="week" aria-label="Range (medium)" />
  </div>
);

export const Disabled: Story = () => (
  <Segmented disabled options={dayOptions} defaultValue="week" aria-label="Range" />
);

export const DisabledOption: Story = () => (
  <Segmented
    options={[
      { value: "day", label: "Day" },
      { value: "week", label: "Week", disabled: true },
      { value: "month", label: "Month" },
    ]}
    defaultValue="day"
    aria-label="Range"
  />
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("week");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <Segmented options={dayOptions} value={value} onValueChange={setValue} aria-label="Range" />
      <span style={{ fontFamily: "monospace", fontSize: 12 }}>{value}</span>
    </div>
  );
};

export const Playground: Story<SegmentedProps> = (props) => <Segmented {...props} />;
Playground.args = {
  options: dayOptions,
  defaultValue: "week",
  size: "md",
  "aria-label": "Range",
};
Playground.argTypes = {
  size: {
    options: ["sm", "md"],
    control: { type: "select" },
  },
};
