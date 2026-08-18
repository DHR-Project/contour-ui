import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function Single() {
  const [value, setValue] = useState<number>(40);
  return (
    <div className="w-full max-w-72">
      <Slider value={value} onValueChange={(v) => setValue(v as number)} thumbLabel="Volume" />
    </div>
  );
}

export function Range() {
  const [range, setRange] = useState<number[]>([20, 70]);
  return (
    <div className="w-full max-w-72">
      <Slider
        value={range}
        onValueChange={(v) => setRange(v as number[])}
        thumbLabel={["Min price", "Max price"]}
      />
    </div>
  );
}

export function Disabled() {
  return (
    <div className="w-full max-w-72">
      <Slider value={60} onValueChange={() => {}} disabled thumbLabel="Disabled" />
    </div>
  );
}
