import { NavBar } from "@/components/ui/nav-bar";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

export function Compact() {
  return (
    <div className="overflow-hidden rounded-lg border border-separator">
      <NavBar
        title="Inbox"
        largeTitleMode={false}
        leadingAction={{ icon: "chevron-left", label: "Back", onClick: () => {} }}
        trailingActions={[
          { icon: "search", label: "Search", onClick: () => {} },
          { icon: "settings", label: "Settings", onClick: () => {} },
        ]}
      />
      <VStack gap="2" className="p-(--space-4)">
        <Text textStyle="footnote" color="secondary">
          A compact NavBar stays a single fixed-height row.
        </Text>
      </VStack>
    </div>
  );
}

export function LargeTitle() {
  return (
    <div className="overflow-hidden rounded-lg border border-separator">
      <NavBar title="Inbox" largeTitleMode />
      <VStack gap="2" className="p-(--space-4)">
        <Text textStyle="footnote" color="secondary">
          The large title collapses to compact once content scrolls under it.
        </Text>
      </VStack>
    </div>
  );
}

export function Default() {
  return (
    <div className="overflow-hidden rounded-lg border border-separator">
      <NavBar title="Settings" />
      <VStack gap="2" className="p-(--space-4)">
        <Text textStyle="footnote" color="secondary">
          No leading/trailing actions -- title only.
        </Text>
      </VStack>
    </div>
  );
}
