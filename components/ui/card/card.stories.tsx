import type { Story } from "@ladle/react";
import { Card } from "./card";
import { HStack, VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";

const meta = {
  title: "Components / Card",
};

export default meta;

/**
 * `flat` (default) uses a border, not a shadow -- Depth through material,
 * not shadow (guideline rule 1.2). `raised` adds --shadow-sm for cases with
 * complex content behind it (contour-spec-card.md SS1).
 */
export const Elevation: Story = () => (
  <HStack gap="4">
    <Card elevation="flat" className="w-48">
      <Text textStyle="headline">Flat</Text>
      <Text textStyle="footnote" color="secondary">
        Border, no shadow
      </Text>
    </Card>
    <Card elevation="raised" className="w-48">
      <Text textStyle="headline">Raised</Text>
      <Text textStyle="footnote" color="secondary">
        Adds shadow-sm
      </Text>
    </Card>
  </HStack>
);

/**
 * Card doesn't compose Stack internally -- it's a wrapper only (contour-
 * spec-card.md SS3), same responsibility split as Container.
 */
export const ComposedContent: Story = () => (
  <Card className="w-64">
    <VStack gap="row">
      <Text textStyle="headline">Card title</Text>
      <Text textStyle="subheadline" color="secondary">
        Supporting description text goes here.
      </Text>
    </VStack>
  </Card>
);

/**
 * `padding="default"` (--inset-grouped-margin-x) is responsive; a raw
 * SpaceToken like `padding="4"` stays fixed regardless of size-class --
 * useful inside a Grid where padding shouldn't skew the layout.
 */
export const Padding: Story = () => (
  <HStack gap="4">
    <Card padding="default" className="w-48">
      <Text textStyle="footnote">padding=&quot;default&quot;</Text>
    </Card>
    <Card padding="2" className="w-48">
      <Text textStyle="footnote">padding=&quot;2&quot; (fixed)</Text>
    </Card>
  </HStack>
);

export const Corner: Story = () => (
  <HStack gap="4">
    <Card corner="standard" className="w-48">
      <Text textStyle="footnote">standard</Text>
    </Card>
    <Card corner="squircle" className="w-48">
      <Text textStyle="footnote">squircle (fallback)</Text>
    </Card>
  </HStack>
);
