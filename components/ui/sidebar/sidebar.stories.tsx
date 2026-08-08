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

// Apple Notes' sidebar: an unlabelled leading group ("Pinned") followed by
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
