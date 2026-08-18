// CompactMenuTransition is an internal helper with no dedicated docs page --
// it's the compact-size-class screen-stack wrapper Dropdown and ContextMenu
// mount inside their own Content (see components/ui/dropdown/compact-menu.tsx
// and its real usage in context-menu.tsx). Composed standalone here as plain
// rows rather than via its sibling helpers (createBackRow/
// createCompactSubmenuRenderer), since those need Radix's real Menu Item
// context (DropdownMenu/ContextMenu Root+Content) to not throw -- reducedMotion
// is set so the static screenshot shows settled content, not a mid-animation
// frame.
import { CompactMenuTransition } from "@/components/ui/dropdown/compact-menu";
import { ListItemContent } from "@/components/ui/list";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

export function PushedSubmenuScreen() {
  return (
    <CompactMenuTransition stackKey={1} direction="push" reducedMotion>
      <VStack gap="1" className="w-72 rounded-lg border border-separator bg-bg-primary p-(--space-2)">
        <div className="flex items-center gap-(--gap-icon-text) px-(--space-3) py-(--space-2)">
          <Icon name="chevron-left" size="sm" color="tint" />
          <Text textStyle="footnote" weight="semibold" color="tint">
            Export
          </Text>
        </div>
        <ListItemContent title="PDF" />
        <ListItemContent title="CSV" />
      </VStack>
    </CompactMenuTransition>
  );
}
