import { useState } from "react";
import type { Story } from "@ladle/react";
import { Sidebar } from "./sidebar";
import type { SidebarGroup, SidebarItem } from "./sidebar";

const meta = {
  title: "Components / Sidebar",
};

export default meta;

const ITEMS: SidebarItem[] = [
  { value: "home", icon: "home", label: "Home" },
  { value: "search", icon: "search", label: "Search" },
  { value: "alerts", icon: "bell", label: "Alerts", badge: 3 },
  { value: "profile", icon: "user", label: "Profile" },
];

export const Default: Story = () => {
  const [value, setValue] = useState("home");
  return (
    <div className="h-96 w-64 overflow-hidden rounded-md border border-separator">
      <Sidebar items={ITEMS} value={value} onValueChange={setValue} />
    </div>
  );
};

// Standard native sidebar: an unlabelled leading group ("Pinned") followed by
// labelled folder groups -- exercises SidebarGroup[] instead of a flat
// SidebarItem[].
const GROUPS: SidebarGroup[] = [
  {
    items: [
      { value: "all-notes", icon: "layers", label: "All Notes" },
      { value: "starred", icon: "star", label: "Starred", badge: 2 },
    ],
  },
  {
    label: "iCloud",
    items: [
      { value: "notes", icon: "layout-grid", label: "Notes" },
      { value: "recipes", icon: "heart", label: "Recipes" },
    ],
  },
  {
    label: "On My Mac",
    items: [{ value: "scratch", icon: "image", label: "Scratch" }],
  },
];

export const Grouped: Story = () => {
  const [value, setValue] = useState("all-notes");
  return (
    <div className="h-96 w-64 overflow-hidden rounded-md border border-separator">
      <Sidebar items={GROUPS} value={value} onValueChange={setValue} />
    </div>
  );
};

// Collapsible folders + icon-less leaves -- a long content list (a
// component registry, a file tree) rather than a handful of app-shell
// destinations. Categories start collapsed; the one holding the active
// item opens itself.
const COLLAPSIBLE_GROUPS: SidebarGroup[] = [
  {
    label: "Layout",
    collapsible: true,
    defaultOpen: false,
    items: [
      { value: "flex", label: "Flex" },
      { value: "grid", label: "Grid" },
      { value: "stack", label: "Stack" },
      { value: "container", label: "Container" },
    ],
  },
  {
    label: "Controls",
    collapsible: true,
    defaultOpen: false,
    items: [
      { value: "button", label: "Button" },
      { value: "switch", label: "Switch" },
      { value: "checkbox", label: "Checkbox" },
    ],
  },
  {
    label: "Feedback",
    collapsible: true,
    defaultOpen: false,
    items: [
      { value: "alert", label: "Alert" },
      { value: "toast", label: "Toast" },
    ],
  },
];

export const CollapsibleGroups: Story = () => {
  const [value, setValue] = useState("switch");
  return (
    <div className="h-96 w-64 overflow-hidden rounded-md border border-separator">
      <Sidebar items={COLLAPSIBLE_GROUPS} value={value} onValueChange={setValue} />
    </div>
  );
};
