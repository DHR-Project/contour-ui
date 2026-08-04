import { useState } from "react";
import type { Story } from "@ladle/react";
import { TabBar } from "./tab-bar";
import type { TabBarItem } from "./tab-bar";

const meta = {
  title: "Components / TabBar",
};

export default meta;

const ITEMS: TabBarItem[] = [
  { icon: "home", label: "Home" },
  { icon: "search", label: "Search" },
  { icon: "bell", label: "Alerts", badge: 3 },
  { icon: "user", label: "Profile" },
];

/**
 * Position is decided automatically (compact -> bottom, regular+ -> top or
 * the user's saved sidebar preference) -- resize the browser window across
 * the 768px breakpoint to see it switch, rather than a prop.
 */
export const Default: Story = () => {
  const [value, setValue] = useState("Home");
  return (
    <div className="flex min-h-[400px] flex-col justify-between">
      <p className="p-4 text-footnote text-label-secondary">
        Resize the browser window across 768px to switch bottom (compact) vs
        top (regular+).
      </p>
      <TabBar items={ITEMS} value={value} onValueChange={setValue} />
    </div>
  );
};

export const WithBadge: Story = () => {
  const [value, setValue] = useState("Alerts");
  return (
    <div className="min-h-[200px]">
      <TabBar items={ITEMS} value={value} onValueChange={setValue} />
    </div>
  );
};
