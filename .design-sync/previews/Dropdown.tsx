// Dropdown has no open/defaultOpen prop -- it's fully self-managed internal
// state (opens on trigger click), so these exports render the closed
// trigger only. See .design-sync/learnings/nav-overlay-batch-c.md.
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import type { DropdownItemDef } from "@/components/ui/dropdown";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/stack";

export function Actions() {
  return (
    <Dropdown
      trigger={
        <Button variant="plain" trailingIcon="chevron-down">
          Actions
        </Button>
      }
      items={[
        { type: "action", icon: "copy", label: "Duplicate", onSelect: () => {} },
        { type: "action", icon: "share", label: "Share", onSelect: () => {} },
        { type: "separator" },
        { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: () => {} },
      ]}
    />
  );
}

export function CheckboxRadioSubmenu() {
  const [showGrid, setShowGrid] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const items: DropdownItemDef[] = [
    { type: "checkbox", label: "Show grid", checked: showGrid, onCheckedChange: setShowGrid },
    { type: "separator" },
    { type: "label", text: "Sort by" },
    {
      type: "radio-group",
      value: sortBy,
      onValueChange: setSortBy,
      options: [
        { value: "name", label: "Name" },
        { value: "date", label: "Date" },
      ],
    },
    { type: "separator" },
    {
      type: "submenu",
      icon: "download",
      label: "Export",
      items: [
        { type: "action", label: "PDF", onSelect: () => {} },
        { type: "action", label: "CSV", onSelect: () => {} },
      ],
    },
  ];
  return (
    <Dropdown
      trigger={
        <Button variant="plain" trailingIcon="chevron-down">
          View options
        </Button>
      }
      items={items}
    />
  );
}

export function MultipleTriggers() {
  return (
    <HStack gap="3" wrap="wrap">
      <Dropdown
        trigger={<Button variant="tinted">Left aligned</Button>}
        align="start"
        items={[{ type: "action", label: "Option A", onSelect: () => {} }]}
      />
      <Dropdown
        trigger={<Button variant="tinted">Right aligned</Button>}
        align="end"
        items={[{ type: "action", label: "Option B", onSelect: () => {} }]}
      />
    </HStack>
  );
}
