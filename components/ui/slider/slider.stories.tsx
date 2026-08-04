import { useState } from "react";
import type { Story } from "@ladle/react";
import { Slider } from "./slider";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Slider",
};

export default meta;

export const Basic: Story = () => {
  const [value, setValue] = useState(40);
  return (
    <div className="w-80">
      <Slider value={value} onValueChange={(v) => setValue(v as number)} thumbLabel="Volume" />
    </div>
  );
};

export const Stepped: Story = () => {
  const [value, setValue] = useState(20);
  return (
    <div className="w-80">
      <Slider
        value={value}
        onValueChange={(v) => setValue(v as number)}
        min={0}
        max={100}
        step={10}
        thumbLabel="Brightness"
      />
    </div>
  );
};

/**
 * Range selection -- passing an array of numbers instead of a single number
 * opts into Radix Slider's multi-thumb support (CLAUDE.local.md: don't
 * narrow a wrapped primitive's real capability to today's single-thumb use
 * case).
 */
export const Range: Story = () => {
  const [value, setValue] = useState<number[]>([20, 70]);
  return (
    <div className="w-80">
      <Slider
        value={value}
        onValueChange={(v) => setValue(v as number[])}
        thumbLabel={["Range start", "Range end"]}
      />
    </div>
  );
};

export const Disabled: Story = () => (
  <VStack gap="4">
    <div className="w-80">
      <Slider value={30} onValueChange={() => {}} disabled thumbLabel="Volume" />
    </div>
  </VStack>
);
