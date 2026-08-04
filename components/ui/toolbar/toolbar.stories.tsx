import type { Story } from "@ladle/react";
import { Toolbar } from "./toolbar";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Toolbar",
};

export default meta;

function ScrollableFiller() {
  return (
    <VStack gap="4" className="p-(--space-4)">
      {Array.from({ length: 30 }, (_, i) => (
        <Text key={i} textStyle="body">
          Scroll to see the toolbar&apos;s progressive blur over this content -- line {i + 1}.
        </Text>
      ))}
    </VStack>
  );
}

export const Bottom: Story = () => (
  <div>
    <ScrollableFiller />
    <Toolbar
      actions={[
        { icon: "share", label: "Share", onClick: () => {} },
        { icon: "star", label: "Favorite", onClick: () => {} },
        { icon: "trash", label: "Delete", onClick: () => {} },
      ]}
    />
  </div>
);

export const Top: Story = () => (
  <div>
    <Toolbar
      position="top"
      actions={[
        { icon: "arrow-left", label: "Back", onClick: () => {} },
        { icon: "share", label: "Share", onClick: () => {} },
      ]}
    />
    <ScrollableFiller />
  </div>
);

export const IconOnly: Story = () => (
  <div>
    <ScrollableFiller />
    <Toolbar
      actions={[
        { icon: "share", onClick: () => {} },
        { icon: "star", onClick: () => {} },
        { icon: "trash", onClick: () => {} },
      ]}
    />
  </div>
);

export const NoProgressiveBlur: Story = () => (
  <div>
    <ScrollableFiller />
    <Toolbar
      progressiveBlur={false}
      actions={[
        { icon: "share", label: "Share", onClick: () => {} },
        { icon: "trash", label: "Delete", onClick: () => {} },
      ]}
    />
  </div>
);
