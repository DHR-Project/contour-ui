import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

const usageCode = `import { Text } from "@/components/ui/text";

export function Example() {
  return <Text variant="title2">Section title</Text>;
}`;

const variants = [
  "largeTitle",
  "title1",
  "title2",
  "title3",
  "headline",
  "body",
  "callout",
  "subheadline",
  "footnote",
  "caption1",
  "caption2",
] as const;

const colors = [
  "primary",
  "secondary",
  "tertiary",
  "quaternary",
  "tint",
  "destructive",
  "success",
  "warning",
] as const;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "scale", title: "Scale" },
  { id: "color", title: "Color" },
];

export default function TextDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Text</Text>
          <Text variant="body" color="secondary">
            Renders the type scale defined in the design tokens. Each variant maps to a
            semantic HTML element by default and can be overridden with the as prop.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="scale" gap="3" className="scroll-mt-6">
          <Text variant="title3">Scale</Text>
          <VStack gap="3" className="rounded-lg border border-separator p-6">
            {variants.map((variant) => (
              <HStack key={variant} align="baseline" gap="4">
                <Text
                  as="span"
                  variant="footnote"
                  color="tertiary"
                  className="w-24 shrink-0 font-mono"
                >
                  {variant}
                </Text>
                <Text variant={variant}>The quick brown fox jumps over the lazy dog</Text>
              </HStack>
            ))}
          </VStack>
        </VStack>

        <VStack id="color" gap="3" className="scroll-mt-6">
          <Text variant="title3">Color</Text>
          <ComponentPreview>
            {colors.map((color) => (
              <Text key={color} variant="headline" color={color}>
                {color}
              </Text>
            ))}
          </ComponentPreview>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
