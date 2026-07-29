"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const usageCode = `import { Label } from "@/components/ui/label";

export function Example() {
  return <Label htmlFor="email">Email</Label>;
}`;

const requiredCode = `<Label htmlFor="email" required>
  Email
</Label>`;

const wrappingCode = `import { Checkbox } from "@/components/ui/checkbox";
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

const toc = [
  { id: "usage", title: "Usage" },
  { id: "required", title: "Required" },
  { id: "wrapping-control", title: "Wrapping a control" },
  { id: "reference", title: "Reference" },
];

export default function LabelDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Label</Text>
          <Text variant="body" color="secondary">
            Built on Radix Label - functionally almost identical to a native &lt;label&gt;, plus
            it prevents accidental text selection on double-click. Deliberately unstyled beyond a
            pointer cursor, so it fits both as a small field caption and as a full-row wrapper
            around a control.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Label htmlFor="email-example">Email</Label>
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="required" gap="3" className="scroll-mt-6">
          <Text variant="title3">Required</Text>
          <Text variant="footnote" color="tertiary">
            Pass required to append a destructive &quot;*&quot; - the same marker TextField and
            Textarea use internally for their own label.
          </Text>
          <ComponentPreview>
            <Label htmlFor="email-required" required>
              Email
            </Label>
          </ComponentPreview>
          <CodeBlock code={requiredCode} />
        </VStack>

        <VStack id="wrapping-control" gap="3" className="scroll-mt-6">
          <Text variant="title3">Wrapping a control</Text>
          <Text variant="footnote" color="tertiary">
            The same pattern Checkbox, Switch, and RadioGroupItem use: wrap the control and its
            description in a Label instead of a raw &lt;label&gt;.
          </Text>
          <ComponentPreview>
            <Label>
              <HStack gap="2" align="center">
                <Checkbox defaultChecked />
                <Text as="span">Accept terms</Text>
              </HStack>
            </Label>
          </ComponentPreview>
          <CodeBlock code={wrappingCode} />
        </VStack>

        <DocsReference
          library="Radix Label"
          links={[{ label: "Radix Label API reference", href: "https://www.radix-ui.com/primitives/docs/components/label" }]}
        />
      </VStack>
    </DocsPage>
  );
}
