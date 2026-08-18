import { useState } from "react";
import { TabBar } from "@/components/ui/tab-bar";
import type { TabBarItem } from "@/components/ui/tab-bar";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

const ITEMS: TabBarItem[] = [
  { icon: "home", label: "Home" },
  { icon: "search", label: "Search" },
  { icon: "bell", label: "Alerts", badge: 3 },
  { icon: "user", label: "Profile" },
];

export function WithBadge() {
  const [value, setValue] = useState("Home");
  return (
    <div className="overflow-hidden rounded-lg border border-separator">
      <VStack gap="2" className="p-(--space-4)">
        <Text textStyle="footnote" color="secondary">
          Compact width renders the bottom tab bar; regular width renders a top pill or sidebar
          layout, per the user's saved preference.
        </Text>
      </VStack>
      <TabBar items={ITEMS} value={value} onValueChange={setValue} />
    </div>
  );
}

export function ProfileSelected() {
  const [value, setValue] = useState("Profile");
  return (
    <div className="overflow-hidden rounded-lg border border-separator">
      <VStack gap="2" className="p-(--space-4)">
        <Text textStyle="footnote" color="secondary">Active tab drives icon color and label weight.</Text>
      </VStack>
      <TabBar items={ITEMS} value={value} onValueChange={setValue} />
    </div>
  );
}
