import { useState } from "react";
import type { Story } from "@ladle/react";
import { Dropdown, DropdownContent, DropdownTrigger } from "./dropdown";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";

const triggerClass =
  "flex h-11 w-11 items-center justify-center rounded-full bg-tint text-white shadow-lg";

export const Basic: Story = () => (
  <Dropdown>
    <DropdownTrigger className={triggerClass} aria-label="Open menu">
      <Icon name="plus" size={20} />
    </DropdownTrigger>
    <DropdownContent className="w-64 p-4">
      <Text variant="subheadline">A dropdown panel</Text>
      <Text variant="footnote" color="tertiary">
        Any content goes here - form, list, whatever the trigger needs to reveal.
      </Text>
    </DropdownContent>
  </Dropdown>
);

export const Sides: Story = () => (
  <div style={{ display: "flex", gap: 48 }}>
    <Dropdown>
      <DropdownTrigger className={triggerClass} aria-label="Open above">
        <Icon name="plus" size={20} />
      </DropdownTrigger>
      <DropdownContent side="top" className="w-56 p-4">
        <Text variant="footnote">Opens above the trigger</Text>
      </DropdownContent>
    </Dropdown>
    <Dropdown>
      <DropdownTrigger className={triggerClass} aria-label="Open right">
        <Icon name="plus" size={20} />
      </DropdownTrigger>
      <DropdownContent side="right" className="w-56 p-4">
        <Text variant="footnote">Opens to the right</Text>
      </DropdownContent>
    </Dropdown>
  </div>
);

export const Controlled: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger className={triggerClass} aria-label="Toggle">
        <Icon name={open ? "close" : "plus"} size={20} />
      </DropdownTrigger>
      <DropdownContent className="w-56 p-4">
        <Text variant="footnote">open = {String(open)}</Text>
      </DropdownContent>
    </Dropdown>
  );
};

export const AsChild: Story = () => (
  <Dropdown>
    <DropdownTrigger asChild>
      <button className={triggerClass} aria-label="Open menu">
        <Icon name="settings" size={20} />
      </button>
    </DropdownTrigger>
    <DropdownContent className="w-56 p-4">
      <Text variant="footnote">Triggered off a plain &lt;button&gt; via asChild</Text>
    </DropdownContent>
  </Dropdown>
);
