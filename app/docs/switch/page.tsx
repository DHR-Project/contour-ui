import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const usageCode = `import { Switch } from "@/components/ui/switch";

export function Example() {
  return <Switch defaultChecked />;
}`;

const controlledCode = `import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export function Example() {
  const [checked, setChecked] = useState(false);
  return <Switch checked={checked} onCheckedChange={setChecked} />;
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "controlled", title: "Controlled" },
  { id: "disabled", title: "Disabled" },
  { id: "reference", title: "Reference" },
];

export default function SwitchDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Switch</Text>
          <Text variant="body" color="secondary">
            A binary on/off control built on Radix Switch. The thumb slides with springs.snappy -
            the same motion token Button uses for press feedback.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Switch defaultChecked />
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <Switch size="sm" defaultChecked />
            <Switch size="md" defaultChecked />
          </ComponentPreview>
        </VStack>

        <VStack id="controlled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Controlled</Text>
          <Text variant="footnote" color="tertiary">
            Pass checked and onCheckedChange to drive the value from your own state - same as
            Radix Switch.
          </Text>
          <CodeBlock code={controlledCode} />
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <Switch disabled />
            <Switch disabled defaultChecked />
          </ComponentPreview>
        </VStack>

        <DocsReference
          library="Radix Switch"
          links={[{ label: "Radix Switch API reference", href: "https://www.radix-ui.com/primitives/docs/components/switch" }]}
        />
      </VStack>
    </DocsPage>
  );
}
