// DragHighlight is the highlight shown behind a menu row while the pointer
// drag-selects across it (contour-spec-dropdown-v2.md SSA.5) -- an internal
// helper local to the dropdown menu implementation (components/ui/dropdown/
// menu-core.tsx, used by compact-menu.tsx), not a standalone public
// component. Reproduced here as a static Dropdown-style row list with one
// row "caught" mid-drag to show what the highlight looks like in place.
import { DragHighlight } from "@/components/ui/dropdown/menu-core";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

export function HighlightedRow() {
  return (
    <VStack gap="0" className="w-64 rounded-(--radius-card) border border-separator bg-bg-primary p-(--space-1)">
      <div className="relative flex items-center gap-(--gap-icon-text) rounded-(--radius-sm) px-(--space-3) py-(--space-2)">
        <Icon name="copy" size="sm" decorative />
        <Text textStyle="body">Duplicate</Text>
      </div>
      <div className="relative flex items-center gap-(--gap-icon-text) rounded-(--radius-sm) px-(--space-3) py-(--space-2)">
        <DragHighlight layoutId="drag-highlight-preview" />
        <Icon name="share" size="sm" decorative className="relative z-10" />
        <Text textStyle="body" className="relative z-10">
          Share
        </Text>
      </div>
      <div className="relative flex items-center gap-(--gap-icon-text) rounded-(--radius-sm) px-(--space-3) py-(--space-2)">
        <Icon name="trash" size="sm" decorative />
        <Text textStyle="body">Delete</Text>
      </div>
    </VStack>
  );
}
