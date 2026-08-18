// SplitView's sidebar is `position: fixed` to the true page edge by design
// (an app-shell layout primitive, not something meant to be boxed) -- so
// it's rendered directly rather than wrapped in a bordered/height-clamped
// card, which wouldn't actually contain it and would misrepresent its real
// behavior. Size-class and pointer are pinned via the same override
// providers the component's own tests use, so the sidebar/drag-handle show
// deterministically regardless of the capture viewport.
import { useState } from "react";
import { SplitView } from "@/components/ui/split-view";
import { Sidebar } from "@/components/ui/sidebar";
import type { SidebarItem } from "@/components/ui/sidebar";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { SizeClassOverrideProvider } from "@/lib/hooks/use-size-class";
import { CoarsePointerOverrideProvider } from "@/lib/hooks/use-coarse-pointer";

const SIDEBAR_ITEMS: SidebarItem[] = [
  { value: "home", icon: "home", label: "Home" },
  { value: "search", icon: "search", label: "Search" },
  { value: "alerts", icon: "bell", label: "Alerts", badge: 3 },
  { value: "profile", icon: "user", label: "Profile" },
];

function DemoSidebar() {
  const [value, setValue] = useState("home");
  return <Sidebar items={SIDEBAR_ITEMS} value={value} onValueChange={setValue} />;
}

export function WithSidebar() {
  return (
    <SizeClassOverrideProvider value="regular-lg">
      <CoarsePointerOverrideProvider value={false}>
        <SplitView sidebar={<DemoSidebar />}>
          <VStack gap="2" className="p-(--space-6)">
            <Text textStyle="title-3">Inbox</Text>
            <Text textStyle="footnote" color="secondary">
              Sidebar is fixed to the left edge on regular+; drag its right edge to resize.
            </Text>
          </VStack>
        </SplitView>
      </CoarsePointerOverrideProvider>
    </SizeClassOverrideProvider>
  );
}

export function CompactHidesSidebar() {
  return (
    <SizeClassOverrideProvider value="compact">
      <SplitView sidebar={<DemoSidebar />}>
        <VStack gap="2" className="p-(--space-6)">
          <Text textStyle="title-3">Inbox</Text>
          <Text textStyle="footnote" color="secondary">
            On compact, the sidebar renders nothing -- callers own their own compact navigation
            (a full-width list screen, a drawer, etc).
          </Text>
        </VStack>
      </SplitView>
    </SizeClassOverrideProvider>
  );
}
