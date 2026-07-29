"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const usageCode = `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function Example() {
  return (
    <Label>
      <HStack gap="2" align="center">
        <Checkbox defaultChecked />
        <Text as="span">Accept terms</Text>
      </HStack>
    </Label>
  );
}`;

const controlledCode = `import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function Example() {
  const [checked, setChecked] = useState(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "indeterminate", title: "Indeterminate" },
  { id: "controlled", title: "Controlled" },
  { id: "disabled", title: "Disabled" },
  { id: "reference", title: "Reference" },
];

function ControlledDemo() {
  const [checked, setChecked] = useState<boolean | "indeterminate">(false);
  return <Checkbox checked={checked} onCheckedChange={setChecked} />;
}

export default function CheckboxDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Checkbox</Text>
          <Text variant="body" color="secondary">
            A tri-state control (checked / unchecked / indeterminate) built on Radix Checkbox.
            A bare control with no built-in label - same as Switch - compose your own label
            around it.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Label>
              <HStack gap="2" align="center">
                <Checkbox defaultChecked />
                <Text as="span">Accept terms</Text>
              </HStack>
            </Label>
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <Checkbox size="sm" defaultChecked />
            <Checkbox size="md" defaultChecked />
          </ComponentPreview>
        </VStack>

        <VStack id="indeterminate" gap="3" className="scroll-mt-6">
          <Text variant="title3">Indeterminate</Text>
          <Text variant="footnote" color="tertiary">
            The common &quot;select all&quot; case: pass checked=&quot;indeterminate&quot; when
            some but not all items in a group are checked.
          </Text>
          <ComponentPreview>
            <Checkbox checked="indeterminate" />
          </ComponentPreview>
        </VStack>

        <VStack id="controlled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Controlled</Text>
          <Text variant="footnote" color="tertiary">
            Pass checked and onCheckedChange to drive the value from your own state - same as
            Radix Checkbox.
          </Text>
          <ComponentPreview>
            <ControlledDemo />
          </ComponentPreview>
          <CodeBlock code={controlledCode} />
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <Checkbox disabled />
            <Checkbox disabled defaultChecked />
          </ComponentPreview>
        </VStack>

        <DocsReference
          library="Radix Checkbox"
          links={[{ label: "Radix Checkbox API reference", href: "https://www.radix-ui.com/primitives/docs/components/checkbox" }]}
        />
      </VStack>
    </DocsPage>
  );
}
