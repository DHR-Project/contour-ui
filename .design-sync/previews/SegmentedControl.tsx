import { useState } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";

export function Default() {
  const [value, setValue] = useState("day");
  return (
    <div className="w-full max-w-80">
      <SegmentedControl
        value={value}
        onValueChange={setValue}
        options={[
          { value: "day", label: "Day" },
          { value: "week", label: "Week" },
          { value: "month", label: "Month" },
        ]}
      />
    </div>
  );
}

export function IconOnly() {
  const [theme, setTheme] = useState("system");
  return (
    <div className="w-full max-w-56">
      <SegmentedControl
        value={theme}
        onValueChange={setTheme}
        size="small"
        iconOnly
        options={[
          { value: "light", label: "Light", icon: "sun" },
          { value: "dark", label: "Dark", icon: "moon" },
          { value: "system", label: "System", icon: "monitor" },
        ]}
      />
    </div>
  );
}
