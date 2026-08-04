import { useState } from "react";
import type { Story } from "@ladle/react";
import { Switch } from "./switch";
import { HStack, VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Switch",
};

export default meta;

export const States: Story = () => (
  <HStack gap="4" align="center">
    <Switch checked={false} onCheckedChange={() => {}} />
    <Switch checked={true} onCheckedChange={() => {}} />
  </HStack>
);

export const WithLabel: Story = () => {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onCheckedChange={setChecked} label="Notifications" />;
};

export const Disabled: Story = () => (
  <VStack gap="2">
    <Switch disabled checked={false} onCheckedChange={() => {}} label="Off, disabled" />
    <Switch disabled checked={true} onCheckedChange={() => {}} label="On, disabled" />
  </VStack>
);
