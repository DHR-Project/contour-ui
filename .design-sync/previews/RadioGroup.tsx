import { useState } from "react";
import { RadioGroup } from "@/components/ui/radio";

export function Horizontal() {
  const [value, setValue] = useState("day");
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      direction="horizontal"
      options={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  );
}

export function VerticalSmall() {
  const [value, setValue] = useState("email");
  return (
    <RadioGroup
      value={value}
      onValueChange={setValue}
      size="sm"
      options={[
        { value: "email", label: "Email" },
        { value: "sms", label: "SMS" },
        { value: "push", label: "Push (disabled)", disabled: true },
      ]}
    />
  );
}
