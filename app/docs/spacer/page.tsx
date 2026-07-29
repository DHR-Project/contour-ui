import { HStack, VStack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";
import { Text } from "@/components/ui/text";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

function Box() {
  return <div className="h-10 w-10 rounded-md bg-tint/15" />;
}

const usageCode = `import { HStack } from "@/components/ui/stack";
import { Spacer } from "@/components/ui/spacer";

export function Example() {
  return (
    <HStack>
      <Logo />
      <Spacer />
      <Actions />
    </HStack>
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "flexible", title: "Flexible" },
  { id: "fixed", title: "Fixed size" },
];

export default function SpacerDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Spacer</Text>
          <Text variant="body" color="secondary">
            An empty, non-interactive layout node. Without a size it fills the remaining space
            in a flex container; with a size it&apos;s a fixed gap on one axis.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="flexible" gap="3" className="scroll-mt-6">
          <Text variant="title3">Flexible</Text>
          <Text variant="footnote" color="tertiary">
            The common case — push one item to the end of a row.
          </Text>
          <ComponentPreview>
            <HStack className="w-full">
              <Box />
              <Spacer />
              <Box />
            </HStack>
          </ComponentPreview>
        </VStack>

        <VStack id="fixed" gap="3" className="scroll-mt-6">
          <Text variant="title3">Fixed size</Text>
          <Text variant="footnote" color="tertiary">
            For a gap that a Stack&apos;s gap prop can&apos;t express, e.g. one larger gap between two
            groups in the same row.
          </Text>
          <ComponentPreview>
            <HStack>
              <Box />
              <Spacer size={32} />
              <Box />
            </HStack>
          </ComponentPreview>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
