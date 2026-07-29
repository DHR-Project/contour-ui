import type { ReactNode } from "react";

import { Container } from "@/components/ui/container";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { ResizablePreview } from "@/components/docs/resizable-preview";

function Box({ children }: { children: ReactNode }) {
  return <div className="rounded-md bg-tint/15 px-4 py-3 text-tint">{children}</div>;
}

const usageCode = `import { Container } from "@/components/ui/container";

export function Example() {
  return (
    <Container size="lg">
      <PageContent />
    </Container>
  );
}`;

const containerQueryCode = `<Container size="lg">
  {/* containerSm/Md/Lg/Xl below size against this Container, not the viewport */}
  <Flex direction={{ base: "column", containerMd: "row" }} gap="4">
    <Sidebar />
    <Content />
  </Flex>
</Container>`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "container-queries", title: "Container queries" },
];

export default function ContainerDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Container</Text>
          <Text variant="body" color="secondary">
            Centers content and caps its width, with horizontal padding that tracks the
            responsive --page-margin token — the same one this docs shell uses.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <Text variant="footnote" color="tertiary">
            sm (42rem), md (56rem), lg (72rem, default), xl (80rem), full (no cap).
          </Text>
          <div className="rounded-lg border border-separator py-6">
            <Container size="sm">
              <div className="rounded-md bg-tint/15 px-4 py-3 text-center text-tint">
                Container size=&quot;sm&quot;
              </div>
            </Container>
          </div>
        </VStack>

        <VStack id="container-queries" gap="3" className="scroll-mt-6">
          <Text variant="title3">Container queries</Text>
          <Text variant="footnote" color="tertiary">
            Container sets Tailwind&apos;s @container by default, making it a query context.
            Any descendant Flex, Stack, or Grid can then use the containerSm/Md/Lg/Xl keys in
            its responsive props to size against this Container&apos;s width instead of the
            viewport - pass container={"{false}"} to opt out. Drag the slider below; the frame
            itself is not a query context (ResizablePreview container={"{false}"}) so what you
            see reacts to the Container&apos;s own width, not the frame&apos;s.
          </Text>
          <ResizablePreview container={false}>
            <Container size="full" className="rounded-md border border-separator p-4">
              <Flex direction={{ base: "column", containerMd: "row" }} gap="3">
                <Box>Sidebar</Box>
                <Box>Content</Box>
              </Flex>
            </Container>
          </ResizablePreview>
          <CodeBlock code={containerQueryCode} />
        </VStack>
      </VStack>
    </DocsPage>
  );
}
