"use client";

import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const usageCode = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Example() {
  return (
    <Select defaultValue="apple">
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </SelectContent>
    </Select>
  );
}`;

const groupsCode = `<Select defaultValue="apple">
  <SelectTrigger className="w-56">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruit</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Vegetable</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="potato">Potato</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`;

const controlledCode = `import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Example() {
  const [value, setValue] = useState("apple");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "groups", title: "Groups" },
  { id: "controlled", title: "Controlled" },
  { id: "disabled", title: "Disabled" },
  { id: "reference", title: "Reference" },
];

function ControlledDemo() {
  const [value, setValue] = useState("apple");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default function SelectDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Select</Text>
          <Text variant="body" color="secondary">
            A listbox-style single-choice control built on Radix Select. Root, Trigger, Content,
            and Item map directly onto the Radix primitive - this wrapper only adds styling.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Select defaultValue="apple">
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Pick a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="cherry">Cherry</SelectItem>
              </SelectContent>
            </Select>
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <Select defaultValue="a">
              <SelectTrigger size="sm" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Small</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="a">
              <SelectTrigger size="md" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Medium</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="a">
              <SelectTrigger size="lg" className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a">Large</SelectItem>
              </SelectContent>
            </Select>
          </ComponentPreview>
        </VStack>

        <VStack id="groups" gap="3" className="scroll-mt-6">
          <Text variant="title3">Groups</Text>
          <ComponentPreview>
            <Select defaultValue="apple">
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Fruit</SelectLabel>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="banana">Banana</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Vegetable</SelectLabel>
                  <SelectItem value="carrot">Carrot</SelectItem>
                  <SelectItem value="potato">Potato</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </ComponentPreview>
          <CodeBlock code={groupsCode} />
        </VStack>

        <VStack id="controlled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Controlled</Text>
          <Text variant="footnote" color="tertiary">
            Pass value and onValueChange to drive the selection from your own state - same as
            Radix Select.
          </Text>
          <ComponentPreview>
            <ControlledDemo />
          </ComponentPreview>
          <CodeBlock code={controlledCode} />
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <Select disabled defaultValue="apple">
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
              </SelectContent>
            </Select>
          </ComponentPreview>
        </VStack>

        <DocsReference
          library="Radix Select"
          links={[
            { label: "Radix Select API reference", href: "https://www.radix-ui.com/primitives/docs/components/select" },
          ]}
        />
      </VStack>
    </DocsPage>
  );
}
