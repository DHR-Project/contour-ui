import { DocsSidebar } from "./docs-sidebar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

// SplitView's `sidebar` prop for the docs shell (app/docs/layout.tsx).
// SplitView itself never renders this on compact, so this component only
// ever mounts on regular+ -- compact navigation stays DocsMobileNav's
// separate hamburger + drawer instead.
export function DocsSidebarRail() {
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
