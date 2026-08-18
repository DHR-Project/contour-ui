import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

export function Scale() {
  return (
    <VStack gap="2">
      <Text textStyle="large-title">Large Title</Text>
      <Text textStyle="title-1">Title 1</Text>
      <Text textStyle="title-2">Title 2</Text>
      <Text textStyle="title-3">Title 3</Text>
      <Text textStyle="headline">Headline</Text>
      <Text textStyle="body">Body</Text>
      <Text textStyle="callout">Callout</Text>
      <Text textStyle="subheadline">Subheadline</Text>
      <Text textStyle="footnote">Footnote</Text>
      <Text textStyle="caption-1">Caption 1</Text>
      <Text textStyle="caption-2">Caption 2</Text>
    </VStack>
  );
}

export function WeightAndColor() {
  return (
    <VStack gap="2">
      <Text textStyle="body" color="secondary">
        Body text in secondary color.
      </Text>
      <Text textStyle="footnote" color="tertiary">
        Footnote in tertiary color.
      </Text>
      <Text textStyle="caption-1" color="quaternary">
        Caption 1 in quaternary color.
      </Text>
      <Text textStyle="body" weight="bold" color="tint">
        Body text with a bold weight and tint color override.
      </Text>
    </VStack>
  );
}

export function Truncate() {
  return (
    <Text textStyle="body" truncate className="max-w-40">
      This line truncates with an ellipsis once it overflows its container width.
    </Text>
  );
}
