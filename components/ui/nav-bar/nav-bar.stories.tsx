import type { Story } from "@ladle/react";
import { NavBar } from "./nav-bar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / NavBar",
};

export default meta;

function ScrollableFiller() {
  return (
    <VStack gap="4" className="p-(--space-4)">
      {Array.from({ length: 30 }, (_, i) => (
        <Text key={i} textStyle="body">
          Scroll to collapse the Large Title -- line {i + 1}.
        </Text>
      ))}
    </VStack>
  );
}

/** Scroll this story's iframe to see the Large Title collapse into the
 * compact title, with progressive blur fading in in sync. */
export const LargeTitle: Story = () => (
  <div>
    <NavBar title="Inbox" largeTitleMode />
    <ScrollableFiller />
  </div>
);

export const Compact: Story = () => (
  <div>
    <NavBar title="Settings" largeTitleMode={false} />
    <ScrollableFiller />
  </div>
);

/**
 * With both a Large Title AND a leading action: the Large Title scales
 * down and fades away on its own first, then the compact centered title
 * and the leading action fade in together -- avoids the leading button
 * overlapping the (left-aligned) Large Title mid-collapse.
 */
export const LargeTitleWithLeadingAction: Story = () => (
  <div>
    <NavBar
      title="Inbox"
      largeTitleMode
      leadingAction={{ icon: "arrow-left", label: "Back", onClick: () => {} }}
    />
    <ScrollableFiller />
  </div>
);

export const WithActions: Story = () => (
  <div>
    <NavBar
      title="Message"
      largeTitleMode={false}
      leadingAction={{ icon: "arrow-left", label: "Back", onClick: () => {} }}
      trailingActions={[
        { icon: "share", label: "Share", onClick: () => {} },
        { icon: "trash", label: "Delete", onClick: () => {} },
      ]}
    />
    <ScrollableFiller />
  </div>
);

export const NoProgressiveBlur: Story = () => (
  <div>
    <NavBar title="Settings" largeTitleMode={false} progressiveBlur={false} />
    <ScrollableFiller />
  </div>
);
