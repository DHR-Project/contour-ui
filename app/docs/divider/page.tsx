import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

const usageCode = `import { Divider } from "@/components/ui/divider";

export function Example() {
  return (
    <>
      <p>Above</p>
      <Divider />
      <p>Below</p>
    </>
  );
}`;

const verticalCode = `<HStack align="stretch" gap="3">
  <span>Left</span>
  <Divider orientation="vertical" />
  <span>Right</span>
</HStack>`;

const labeledCode = `<Divider>Or continue with</Divider>`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "vertical", title: "Vertical" },
  { id: "labeled", title: "Labeled" },
];

export default function DividerDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Divider</Text>
          <Text variant="body" color="secondary">
            A thin separator line, horizontal or vertical, or a labeled divider (two line
            segments with content between them) when given children.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <VStack gap="3" className="w-full max-w-64">
              <Text variant="body">Above</Text>
              <Divider />
              <Text variant="body">Below</Text>
            </VStack>
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="vertical" gap="3" className="scroll-mt-6">
          <Text variant="title3">Vertical</Text>
          <Text variant="footnote" color="tertiary">
            Needs an explicit height from its parent - a line with no content has no intrinsic
            height on its own. Pairing with HStack align=&quot;stretch&quot; is the common case.
          </Text>
          <ComponentPreview>
            <HStack align="stretch" gap="3" className="h-6">
              <Text variant="body">Left</Text>
              <Divider orientation="vertical" />
              <Text variant="body">Right</Text>
            </HStack>
          </ComponentPreview>
          <CodeBlock code={verticalCode} />
        </VStack>

        <VStack id="labeled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Labeled</Text>
          <Text variant="footnote" color="tertiary">
            Pass children for a divider with content in the middle - text content only makes
            sense on the horizontal axis, so children are ignored for orientation=&quot;vertical&quot;.
          </Text>
          <ComponentPreview>
            <Divider className="w-full max-w-64">Or continue with</Divider>
          </ComponentPreview>
          <CodeBlock code={labeledCode} />
        </VStack>
      </VStack>
    </DocsPage>
  );
}
