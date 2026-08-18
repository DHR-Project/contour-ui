import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { HStack } from "@/components/ui/stack";

export function States() {
  const [checked, setChecked] = useState(false);
  return (
    <HStack gap="4" align="center" wrap="wrap">
      <Checkbox label="Remember me" checked={checked} onCheckedChange={setChecked} />
      <Checkbox checked="indeterminate" label="Indeterminate" />
      <Checkbox disabled label="Disabled" />
      <Checkbox disabled checked label="Disabled, checked" />
    </HStack>
  );
}

export function SizeAndAccessible() {
  return (
    <HStack gap="4" align="center">
      <Checkbox size="sm" checked label="Small" />
      <Checkbox aria-label="Unlabeled checkbox" checked />
    </HStack>
  );
}
