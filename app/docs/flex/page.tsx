import type { ReactNode } from "react";

import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { ResizablePreview } from "@/components/docs/resizable-preview";

function Box({ children }: { children: ReactNode }) {
  return <div className="rounded-md bg-tint/15 px-4 py-3 text-tint">{children}</div>;
}

const usageCode = `import { Flex } from "@/components/ui/flex";

export function Example() {
  return (
    <Flex direction="row" gap="3" align="center">
      <Item />
      <Item />
    </Flex>
  );
}`;

const responsiveCode = `<Flex direction={{ base: "column", regular: "row" }} gap="3">
  <Item />
  <Item />
</Flex>`;

const containerCode = `<Flex direction={{ base: "column", containerMd: "row" }} gap="3">
  <Item />
  <Item />
</Flex>`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "direction", title: "Direction" },
  { id: "align-justify", title: "Align & justify" },
  { id: "wrap", title: "Wrap" },
  { id: "responsive", title: "Responsive" },
  { id: "container-queries", title: "Container queries" },
];

export default function FlexDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Flex</Text>
          <Text variant="body" color="secondary">
            The low-level flexbox primitive. Unopinionated — no default gap, and exposes the
            reverse directions. Stack, HStack, and VStack are built on top of it.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="direction" gap="3" className="scroll-mt-6">
          <Text variant="title3">Direction</Text>
          <ComponentPreview>
            <Flex direction="row" gap="2">
              <Box>1</Box>
              <Box>2</Box>
              <Box>3</Box>
            </Flex>
          </ComponentPreview>
          <ComponentPreview>
            <Flex direction="column" gap="2">
              <Box>1</Box>
              <Box>2</Box>
              <Box>3</Box>
            </Flex>
          </ComponentPreview>
        </VStack>

        <VStack id="align-justify" gap="3" className="scroll-mt-6">
          <Text variant="title3">Align & justify</Text>
          <Text variant="footnote" color="tertiary">
            align controls the cross axis, justify controls the main axis — same mapping as
            CSS align-items / justify-content.
          </Text>
          <ComponentPreview>
            <Flex direction="row" justify="between" className="w-full">
              <Box>Start</Box>
              <Box>End</Box>
            </Flex>
          </ComponentPreview>
        </VStack>

        <VStack id="wrap" gap="3" className="scroll-mt-6">
          <Text variant="title3">Wrap</Text>
          <ComponentPreview>
            <Flex direction="row" wrap gap="2" className="w-48">
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i}>{i + 1}</Box>
              ))}
            </Flex>
          </ComponentPreview>
        </VStack>

        <VStack id="responsive" gap="3" className="scroll-mt-6">
          <Text variant="title3">Responsive</Text>
          <Text variant="footnote" color="tertiary">
            Every prop (direction, align, justify, gap, wrap) accepts a plain value or an
            object keyed by viewport breakpoint: base (compact, mobile-first), regular (≥768px),
            regularLg (≥1024px), regularXl (≥1280px) - matching the size-class names in
            styles/tokens.css. Resize the window to see this row switch from stacked to
            side-by-side at the regular breakpoint.
          </Text>
          <ComponentPreview>
            <Flex direction={{ base: "column", regular: "row" }} gap="2">
              <Box>1</Box>
              <Box>2</Box>
              <Box>3</Box>
            </Flex>
          </ComponentPreview>
          <CodeBlock code={responsiveCode} />
        </VStack>

        <VStack id="container-queries" gap="3" className="scroll-mt-6">
          <Text variant="title3">Container queries</Text>
          <Text variant="footnote" color="tertiary">
            Pass container to make an element a query context (Tailwind&apos;s @container).
            Descendants can then use containerSm/containerMd/containerLg/containerXl instead of
            the viewport keys, sizing against that ancestor&apos;s width - useful inside a
            sidebar, card, or any panel that doesn&apos;t span the full viewport. Drag the slider
            below to see it respond - unlike the Responsive section above, this reacts to the
            frame&apos;s width, not the browser window.
          </Text>
          <ResizablePreview>
            <Flex direction={{ base: "column", containerMd: "row" }} gap="2" className="w-full">
              <Box>1</Box>
              <Box>2</Box>
              <Box>3</Box>
            </Flex>
          </ResizablePreview>
          <CodeBlock code={containerCode} />
        </VStack>
      </VStack>
    </DocsPage>
  );
}
