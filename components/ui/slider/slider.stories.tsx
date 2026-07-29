import { useState } from "react";
import type { Story } from "@ladle/react";
import { Slider, type SliderProps } from "./slider";

export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 240 }}>
    <Slider size="sm" defaultValue={30} />
    <Slider size="md" defaultValue={60} />
  </div>
);

export const Disabled: Story = () => <Slider disabled defaultValue={40} style={{ width: 240 }} />;

export const Controlled: Story = () => {
  const [value, setValue] = useState(50);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
      <Slider value={value} onValueChange={(next) => setValue(next as number)} />
      <span style={{ fontFamily: "monospace", fontSize: 12 }}>{value}</span>
    </div>
  );
};

export const Range: Story = () => {
  const [range, setRange] = useState<number[]>([25, 75]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 240 }}>
      <Slider
        value={range}
        onValueChange={(next) => setRange(next as number[])}
        thumbLabel={["Minimum", "Maximum"]}
      />
      <span style={{ fontFamily: "monospace", fontSize: 12 }}>{range.join(" - ")}</span>
    </div>
  );
};

export const Playground: Story<SliderProps> = (props) => (
  <Slider {...props} style={{ width: 240 }} />
);
Playground.args = {
  defaultValue: 50,
  min: 0,
  max: 100,
  step: 1,
  size: "md",
};
Playground.argTypes = {
  size: {
    options: ["sm", "md"],
    control: { type: "select" },
  },
};
