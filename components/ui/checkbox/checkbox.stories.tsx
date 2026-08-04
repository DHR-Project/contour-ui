import { useState } from "react";
import type { Story } from "@ladle/react";
import { Checkbox } from "./checkbox";
import { HStack, VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Checkbox",
};

export default meta;

export const States: Story = () => (
  <HStack gap="4" align="center">
    <Checkbox defaultChecked={false} />
    <Checkbox defaultChecked={true} />
    <Checkbox checked="indeterminate" />
  </HStack>
);

export const Sizes: Story = () => (
  <HStack gap="4" align="center">
    <Checkbox size="sm" defaultChecked />
    <Checkbox size="md" defaultChecked />
  </HStack>
);

export const WithLabel: Story = () => {
  const [checked, setChecked] = useState(false);
  return <Checkbox label="Remember me" checked={checked} onCheckedChange={setChecked} />;
};

export const Disabled: Story = () => (
  <VStack gap="2">
    <Checkbox disabled defaultChecked={false} label="Unchecked, disabled" />
    <Checkbox disabled defaultChecked={true} label="Checked, disabled" />
  </VStack>
);
