"use client";

import { useSizeClass } from "@/lib/hooks/use-size-class";
import { DocsSidebar } from "./docs-sidebar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

// SplitView's `sidebar` prop for the docs shell (app/docs/layout.tsx).
// Renders nothing on compact -- SplitView's own compact treatment bottom-
// docks whatever it's given, which fits a handful of TabBar-style icons,
// not this sidebar's long scrolling link list. Compact navigation stays
// DocsMobileNav's separate hamburger + drawer instead; this component just
// needs to stay out of its way there.
export function DocsSidebarRail() {
  const sizeClass = useSizeClass();
  if (sizeClass === "compact") return null;

  return (
    <div className="flex h-full flex-col border-r border-separator bg-bg-primary">
      <VStack gap="1" className="px-(--space-5) pt-(--space-6) pb-(--space-3)">
        <Text textStyle="headline" weight="semibold">
          Contour
        </Text>
        <Text textStyle="footnote" color="secondary">
          Component Library
        </Text>
      </VStack>
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <DocsSidebar />
      </div>
    </div>
  );
}
