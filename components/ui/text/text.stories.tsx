import type { Story } from "@ladle/react";
import { Text } from "./text";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Foundation / Text",
};

export default meta;

const STYLES = [
  "large-title",
  "title-1",
  "title-2",
  "title-3",
  "headline",
  "body",
  "callout",
  "subheadline",
  "footnote",
  "caption-1",
  "caption-2",
] as const;

/**
 * Full Text Style scale (SS3.1). Font size, line height and letter spacing
 * come from `--text-{style}-size/-leading/-letter-spacing` tokens, recomputed
 * for the whole scale at once when `sizeMode` changes (SS3.6, Dynamic Type).
 */
export const Scale: Story = () => (
  <VStack gap="2">
    {STYLES.map((style) => (
      <Text key={style} textStyle={style}>
        {style} — The quick brown fox
      </Text>
    ))}
  </VStack>
);

export const Weight: Story = () => (
  <VStack gap="2">
    <Text weight="regular">Regular weight</Text>
    <Text weight="medium">Medium weight</Text>
    <Text weight="semibold">Semibold weight</Text>
    <Text weight="bold">Bold weight</Text>
  </VStack>
);

export const Color: Story = () => (
  <VStack gap="2">
    <Text color="primary">Primary label</Text>
    <Text color="secondary">Secondary label</Text>
    <Text color="tertiary">Tertiary label</Text>
    <Text color="quaternary">Quaternary label</Text>
    <Text color="destructive">Destructive (error message)</Text>
  </VStack>
);

/**
 * `density` only changes leading (line-height) -- size and letter-spacing
 * stay put (SS3.7).
 */
export const Density: Story = () => (
  <VStack gap="4" className="w-80">
    <Text textStyle="body" density="tight">
      Tight density: a longer sentence wraps across a couple of lines so the
      tighter line-height is visible.
    </Text>
    <Text textStyle="body" density="default">
      Default density: a longer sentence wraps across a couple of lines so
      the default line-height is visible.
    </Text>
    <Text textStyle="body" density="loose">
      Loose density: a longer sentence wraps across a couple of lines so the
      looser line-height is visible.
    </Text>
  </VStack>
);

export const Truncate: Story = () => (
  <VStack gap="4" className="w-64">
    <Text truncate>
      Single-line truncation with a very long sentence that will not fit in this box
    </Text>
    <Text truncate={2}>
      Multi-line clamp with a very long sentence that will not fit on two lines and gets cut off
      with an ellipsis after the second line.
    </Text>
  </VStack>
);

/**
 * Do: pick the style by content role (`headline` for a list row title).
 * Don't: pick a style because it "looks right" -- e.g. using `title-1` for
 * a body paragraph just because it looks bolder (guideline rule 6.4).
 */
export const DoAndDont: Story = () => (
  <VStack gap="section">
    <div>
      <Text textStyle="footnote" color="secondary">
        Do
      </Text>
      <Text textStyle="headline">List row title</Text>
      <Text textStyle="subheadline" color="secondary">
        List row subtitle
      </Text>
    </div>
    <div>
      <Text textStyle="footnote" color="secondary">
        Don&apos;t (Title style for a subtitle, just because it&apos;s bold)
      </Text>
      <Text textStyle="title-3">List row title</Text>
      <Text textStyle="title-3">List row subtitle</Text>
    </div>
  </VStack>
);
