import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

const usageCode = `import { Button } from "@/components/ui/button";

export function Example() {
  return <Button variant="filled">Continue</Button>;
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "variant", title: "Variant" },
  { id: "size", title: "Size" },
  { id: "shape", title: "Shape" },
  { id: "disabled", title: "Disabled" },
];

export default function ButtonDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Button</Text>
          <Text variant="body" color="secondary">
            A pressable control with five color variants, three sizes, and an optional pill
            shape. Press feedback uses the snappy spring token.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="variant" gap="3" className="scroll-mt-6">
          <Text variant="title3">Variant</Text>
          <ComponentPreview>
            <Button variant="filled">Filled</Button>
            <Button variant="tinted">Tinted</Button>
            <Button variant="gray">Gray</Button>
            <Button variant="plain">Plain</Button>
            <Button variant="destructive">Destructive</Button>
          </ComponentPreview>
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </ComponentPreview>
        </VStack>

        <VStack id="shape" gap="3" className="scroll-mt-6">
          <Text variant="title3">Shape</Text>
          <ComponentPreview>
            <Button shape="default">Default</Button>
            <Button shape="pill">Pill</Button>
          </ComponentPreview>
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <Button disabled>Disabled</Button>
          </ComponentPreview>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
