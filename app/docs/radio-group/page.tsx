"use client";

import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const usageCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export function Example() {
  return (
    <RadioGroup defaultValue="a">
      <Label>
        <HStack gap="2" align="center">
          <RadioGroupItem value="a" />
          <Text as="span">Option A</Text>
        </HStack>
      </Label>
      <Label>
        <HStack gap="2" align="center">
          <RadioGroupItem value="b" />
          <Text as="span">Option B</Text>
        </HStack>
      </Label>
    </RadioGroup>
  );
}`;

const controlledCode = `import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Example() {
  const [value, setValue] = useState("a");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <RadioGroupItem value="a" />
      <RadioGroupItem value="b" />
    </RadioGroup>
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "controlled", title: "Controlled" },
  { id: "disabled", title: "Disabled" },
  { id: "reference", title: "Reference" },
];

function ControlledDemo() {
  const [value, setValue] = useState("a");
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <RadioGroupItem value="a" />
      <RadioGroupItem value="b" />
      <RadioGroupItem value="c" />
    </RadioGroup>
  );
}

export default function RadioGroupDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Radio Group</Text>
          <Text variant="body" color="secondary">
            A single-choice control built on Radix Radio Group. Items are bare controls with no
            built-in label - same as Checkbox/Switch - compose your own Label around each one.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <RadioGroup defaultValue="a">
              <Label>
                <HStack gap="2" align="center">
                  <RadioGroupItem value="a" />
                  <Text as="span">Option A</Text>
                </HStack>
              </Label>
              <Label>
                <HStack gap="2" align="center">
                  <RadioGroupItem value="b" />
                  <Text as="span">Option B</Text>
                </HStack>
              </Label>
            </RadioGroup>
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <RadioGroup defaultValue="a">
              <RadioGroupItem size="sm" value="a" />
            </RadioGroup>
            <RadioGroup defaultValue="a">
              <RadioGroupItem size="md" value="a" />
            </RadioGroup>
          </ComponentPreview>
        </VStack>

        <VStack id="controlled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Controlled</Text>
          <Text variant="footnote" color="tertiary">
            Pass value and onValueChange to drive the selection from your own state - same as
            Radix Radio Group.
          </Text>
          <ComponentPreview>
            <ControlledDemo />
          </ComponentPreview>
          <CodeBlock code={controlledCode} />
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <RadioGroup defaultValue="a">
              <RadioGroupItem value="a" />
              <RadioGroupItem value="b" disabled />
            </RadioGroup>
          </ComponentPreview>
        </VStack>

        <DocsReference
          library="Radix Radio Group"
          links={[
            {
              label: "Radix Radio Group API reference",
              href: "https://www.radix-ui.com/primitives/docs/components/radio-group",
            },
          ]}
        />
      </VStack>
    </DocsPage>
  );
}
