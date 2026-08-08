import { useState } from "react";
import type { Story } from "@ladle/react";
import { Sidebar } from "./sidebar";
import type { SidebarItem } from "./sidebar";

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
