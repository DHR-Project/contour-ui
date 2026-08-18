import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { HStack } from "@/components/ui/stack";

export function OnOff() {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);
  return (
    <HStack gap="4" align="center" wrap="wrap">
      <Switch label="Wi-Fi" checked={checked} onCheckedChange={setChecked} />
      <Switch label="Bluetooth" checked={checked2} onCheckedChange={setChecked2} />
    </HStack>
  );
}

export function Disabled() {
  return (
    <HStack gap="4" align="center" wrap="wrap">
      <Switch label="Disabled, off" checked={false} disabled onCheckedChange={() => {}} />
      <Switch aria-label="Unlabeled switch" checked disabled onCheckedChange={() => {}} />
    </HStack>
  );
}
