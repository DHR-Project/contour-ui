import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { DocsPage } from "@/components/docs/docs-page";

const toc = [
  { id: "getting-started", title: "Getting started" },
  { id: "components", title: "Components" },
];

export default function DocsIndexPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Contour</Text>
          <Text variant="body" color="secondary">
            A design token driven UI kit for adaptive web layouts. Every component consumes
            semantic color, typography, spacing, radius, and motion tokens from styles/tokens.css.
          </Text>
        </VStack>

        <VStack id="getting-started" gap="3" className="scroll-mt-6">
          <Text variant="title2">Getting started</Text>
          <Text variant="body" color="secondary">
            Components live under components/ui as source files you copy into your project,
            not an npm package. Import what you need directly and adjust freely.
          </Text>
        </VStack>

        <VStack id="components" gap="3" className="scroll-mt-6">
          <Text variant="title2">Components</Text>
          <Text variant="body" color="secondary">
            Use the navigation on the left to browse each component: variants, sizes, and
            usage examples. The Tokens page documents the full color and semantic scale.
          </Text>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
