import { Toolbar } from "@/components/ui/toolbar";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function Bottom() {
  return (
    <div className="overflow-hidden rounded-lg border border-separator">
      <VStack gap="2" className="p-(--space-4)">
        <Text textStyle="footnote" color="secondary">
          Bottom toolbars sit under content, blurring what scrolls beneath them.
        </Text>
      </VStack>
      <Toolbar
        actions={[
          { icon: "share", label: "Share", onClick: () => {} },
          { icon: "star", label: "Favorite", onClick: () => {} },
          { icon: "trash", label: "Delete", onClick: () => {} },
        ]}
      />
    </div>
  );
}

export function TopIconOnly() {
  return (
    <div className="overflow-hidden rounded-lg border border-separator">
      <Toolbar
        position="top"
        actions={[
          { icon: "search", onClick: () => {} },
          { icon: "settings", onClick: () => {} },
        ]}
      />
      <VStack gap="2" className="p-(--space-4)">
        <Text textStyle="footnote" color="secondary">
          Icon-only actions omit the label, keeping the row compact.
        </Text>
      </VStack>
    </div>
  );
}
