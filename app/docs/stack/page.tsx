import type { ReactNode } from "react";

import { Stack, HStack, VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

function Box({ children }: { children: ReactNode }) {
  return <div className="rounded-md bg-tint/15 px-4 py-3 text-tint">{children}</div>;
}

const usageCode = `import { VStack, HStack } from "@/components/ui/stack";

export function Example() {
  return (
    <VStack gap="3">
      <HStack gap="2">
        <Avatar />
        <Text>Name</Text>
      </HStack>
      <Text color="secondary">Subtitle</Text>
    </VStack>
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "vstack", title: "VStack" },
  { id: "hstack", title: "HStack" },
  { id: "gap", title: "Gap" },
  { id: "responsive", title: "Responsive" },
];

export default function StackDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Stack</Text>
          <Text variant="body" color="secondary">
            The everyday layout primitive for arranging a run of items with consistent spacing.
            Built on Flex, with a 16px default gap. HStack and VStack are Stack with the
            direction locked.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="vstack" gap="3" className="scroll-mt-6">
          <Text variant="title3">VStack</Text>
          <ComponentPreview>
            <VStack gap="2">
              <Box>1</Box>
              <Box>2</Box>
              <Box>3</Box>
            </VStack>
          </ComponentPreview>
        </VStack>

        <VStack id="hstack" gap="3" className="scroll-mt-6">
          <Text variant="title3">HStack</Text>
          <ComponentPreview>
            <HStack gap="2">
              <Box>1</Box>
              <Box>2</Box>
              <Box>3</Box>
            </HStack>
          </ComponentPreview>
        </VStack>

        <VStack id="gap" gap="3" className="scroll-mt-6">
          <Text variant="title3">Gap</Text>
          <Text variant="footnote" color="tertiary">
            gap accepts the same scale as the design tokens&apos; spacing steps (0, 1, 2, 3, 4, 5,
            6, 7, 8, 10, 12, 16, 20 — matching space-1 through space-20).
          </Text>
          <ComponentPreview>
            <Stack direction="row" gap="1">
              <Box>1</Box>
              <Box>2</Box>
            </Stack>
          </ComponentPreview>
          <ComponentPreview>
            <Stack direction="row" gap="8">
              <Box>1</Box>
              <Box>2</Box>
            </Stack>
          </ComponentPreview>
        </VStack>

        <VStack id="responsive" gap="3" className="scroll-mt-6">
          <Text variant="title3">Responsive</Text>
          <Text variant="footnote" color="tertiary">
            direction and gap accept the same responsive/container-breakpoint objects as Flex
            (Stack is built on it) - e.g. direction=
            {"{{ base: \"column\", regular: \"row\" }}"} switches VStack-like to HStack-like at the
            regular breakpoint. See the Flex docs for the full breakpoint reference.
          </Text>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
