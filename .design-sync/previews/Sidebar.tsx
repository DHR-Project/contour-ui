import { useState } from "react";
import { Sidebar } from "@/components/ui/sidebar";
import type { SidebarItem, SidebarGroup } from "@/components/ui/sidebar";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/stack";
import { Avatar } from "@/components/ui/avatar";

const FLAT_ITEMS: SidebarItem[] = [
  { value: "home", icon: "home", label: "Home" },
  { value: "search", icon: "search", label: "Search" },
  { value: "alerts", icon: "bell", label: "Alerts", badge: 3 },
  { value: "profile", icon: "user", label: "Profile" },
];

export function Flat() {
  const [value, setValue] = useState("home");
  return (
    <div className="h-80 w-64 overflow-hidden rounded-lg border border-separator">
      <Sidebar items={FLAT_ITEMS} value={value} onValueChange={setValue} />
    </div>
  );
}

const GROUPED_ITEMS: SidebarGroup[] = [
  {
    items: [
      { value: "inbox", icon: "bell", label: "Inbox", badge: 12 },
      { value: "starred", icon: "star", label: "Starred" },
    ],
  },
  {
    label: "Folders",
    collapsible: true,
    items: [
      { value: "work", icon: "layers", label: "Work" },
      { value: "personal", icon: "layers", label: "Personal" },
    ],
  },
];

export function Grouped() {
  const [value, setValue] = useState("inbox");
  return (
    <div className="h-80 w-64 overflow-hidden rounded-lg border border-separator">
      <Sidebar
        header={
          <Text textStyle="headline" weight="semibold" className="px-(--space-2)">
            Mail
          </Text>
        }
        items={GROUPED_ITEMS}
        value={value}
        onValueChange={setValue}
        footer={
          <HStack gap="2" align="center" className="px-(--space-2)">
            <Avatar name="Alice Johnson" size="sm" />
            <Text textStyle="footnote" color="secondary">
              Alice Johnson
            </Text>
          </HStack>
        }
      />
    </div>
  );
}
