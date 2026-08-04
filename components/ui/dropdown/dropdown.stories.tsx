import { useState } from "react";
import type { Story } from "@ladle/react";
import { Dropdown } from "./dropdown";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components / Dropdown",
};

export default meta;

/**
 * Builds on Radix DropdownMenu (keyboard nav, focus trap, click-outside,
 * collision detection built in) -- items render through ListItemContent,
 * shared with List (contour-spec-dropdown.md SSA.2).
 */
export const Actions: Story = () => (
  <Dropdown
    trigger={<Button variant="plain" trailingIcon="chevron-down">Actions</Button>}
    items={[
      { type: "action", icon: "copy", label: "Duplicate", onSelect: () => {} },
      { type: "action", icon: "share", label: "Share", onSelect: () => {} },
      { type: "separator" },
      { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: () => {} },
    ]}
  />
);

export const WithLabelsAndSeparators: Story = () => (
  <Dropdown
    trigger={<Button variant="tinted" leadingIcon="settings" aria-label="Options" />}
    items={[
      { type: "label", text: "Account" },
      { type: "action", icon: "user", label: "Profile", onSelect: () => {} },
      { type: "separator" },
      { type: "label", text: "Danger zone" },
      { type: "action", icon: "trash", label: "Delete account", role: "destructive", onSelect: () => {} },
    ]}
  />
);

/**
 * Checkbox/radio items don't close the menu on select (SSA.5) so multiple
 * choices can be toggled in one open/close cycle.
 */
export const CheckboxAndRadio: Story = () => {
  const [wifi, setWifi] = useState(true);
  const [sort, setSort] = useState("newest");
  return (
    <Dropdown
      trigger={
        <Button variant="plain" trailingIcon="chevron-down">
          View options
        </Button>
      }
      items={[
        { type: "checkbox", label: "Wi-Fi only", checked: wifi, onCheckedChange: setWifi },
        { type: "separator" },
        {
          type: "radio-group",
          value: sort,
          onValueChange: setSort,
          options: [
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "az", label: "A to Z" },
          ],
        },
      ]}
    />
  );
};

export const Submenu: Story = () => (
  <Dropdown
    trigger={<Button variant="plain" trailingIcon="chevron-down">File</Button>}
    items={[
      { type: "action", icon: "download", label: "Download", onSelect: () => {} },
      {
        type: "submenu",
        icon: "share",
        label: "Share via",
        items: [
          { type: "action", label: "Email", onSelect: () => {} },
          { type: "action", label: "Copy link", onSelect: () => {} },
        ],
      },
    ]}
  />
);

export const Placement: Story = () => (
  <div className="flex justify-center gap-16 pt-32">
    <Dropdown
      trigger={<Button variant="plain">top / start</Button>}
      side="top"
      align="start"
      items={[{ type: "action", label: "Item", onSelect: () => {} }]}
    />
    <Dropdown
      trigger={<Button variant="plain">right / center</Button>}
      side="right"
      align="center"
      items={[{ type: "action", label: "Item", onSelect: () => {} }]}
    />
  </div>
);
