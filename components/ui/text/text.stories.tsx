import type { Story } from "@ladle/react";
import { Text } from "./text";

export const Scale: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
    <Text variant="largeTitle">Large Title</Text>
    <Text variant="title1">Title 1</Text>
    <Text variant="title2">Title 2</Text>
    <Text variant="title3">Title 3</Text>
    <Text variant="headline">Headline</Text>
    <Text variant="body">Body</Text>
    <Text variant="callout">Callout</Text>
    <Text variant="subheadline">Subheadline</Text>
    <Text variant="footnote">Footnote</Text>
    <Text variant="caption1">Caption 1</Text>
    <Text variant="caption2">Caption 2</Text>
  </div>
);

export const Colors: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <Text color="primary">Primary</Text>
    <Text color="secondary">Secondary</Text>
    <Text color="tertiary">Tertiary</Text>
    <Text color="quaternary">Quaternary</Text>
    <Text color="tint">Tint</Text>
    <Text color="destructive">Destructive</Text>
    <Text color="success">Success</Text>
    <Text color="warning">Warning</Text>
  </div>
);

export const Weight: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <Text weight="regular">Regular</Text>
    <Text weight="medium">Medium</Text>
    <Text weight="semibold">Semibold</Text>
    <Text weight="bold">Bold</Text>
  </div>
);

export const AsProp: Story = () => (
  <Text variant="title2" as="h1">
    Rendered as h1 via the as prop
  </Text>
);

export const Truncate: Story = () => (
  <div style={{ width: 160 }}>
    <Text truncate>This is a long line of text that should be truncated with an ellipsis</Text>
  </div>
);
