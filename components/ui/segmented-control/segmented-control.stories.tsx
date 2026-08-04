import { useState } from "react";
import type { Story } from "@ladle/react";
import { SegmentedControl } from "./segmented-control";

const meta = {
  title: "Components / SegmentedControl",
};

export default meta;

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export const FullWidth: Story = () => {
  const [value, setValue] = useState("day");
  return (
    <div className="w-96">
      <SegmentedControl value={value} onValueChange={setValue} options={OPTIONS} />
    </div>
  );
};

export const Compact: Story = () => {
  const [value, setValue] = useState("day");
  return <SegmentedControl value={value} onValueChange={setValue} options={OPTIONS} fullWidth={false} />;
};

export const WithIcons: Story = () => {
  const [value, setValue] = useState("list");
  return (
    <div className="w-96">
      <SegmentedControl
        value={value}
        onValueChange={setValue}
        options={[
          { value: "list", label: "List", icon: "settings" },
          { value: "grid", label: "Grid", icon: "star" },
        ]}
      />
    </div>
  );
};
