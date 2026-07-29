"use client";

import { useState } from "react";

import { TextField } from "@/components/ui/text-field";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

const usageCode = `import { TextField } from "@/components/ui/text-field";

export function Example() {
  return <TextField label="Email" placeholder="you@example.com" />;
}`;

const iconCode = `<TextField label="Search" leadingIcon="search" placeholder="Search..." />`;

const clearableCode = `import { useState } from "react";
import { TextField } from "@/components/ui/text-field";

export function Example() {
  const [value, setValue] = useState("Contour");
  return (
    <TextField
      label="Project name"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
    />
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "icons", title: "Icons" },
  { id: "clearable", title: "Clearable" },
  { id: "helper-error", title: "Helper & error" },
  { id: "disabled", title: "Disabled" },
];

function ClearableDemo() {
  const [value, setValue] = useState("Contour");
  return (
    <TextField
      label="Project name"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
      className="w-64"
    />
  );
}

export default function TextFieldDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">TextField</Text>
          <Text variant="body" color="secondary">
            A labeled text input with optional helper/error text and leading/trailing icons.
            One composed component - no separate bare Input - since this library is meant to be
            copied file by file into a project rather than imported from a package.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <TextField label="Email" placeholder="you@example.com" className="w-64" />
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <VStack gap="4">
              <TextField size="sm" label="Small" placeholder="Placeholder" className="w-64" />
              <TextField size="md" label="Medium" placeholder="Placeholder" className="w-64" />
              <TextField size="lg" label="Large" placeholder="Placeholder" className="w-64" />
            </VStack>
          </ComponentPreview>
        </VStack>

        <VStack id="icons" gap="3" className="scroll-mt-6">
          <Text variant="title3">Icons</Text>
          <Text variant="footnote" color="tertiary">
            leadingIcon / trailingIcon accept any name from the Icon registry.
          </Text>
          <ComponentPreview>
            <TextField label="Search" leadingIcon="search" placeholder="Search..." className="w-64" />
          </ComponentPreview>
          <CodeBlock code={iconCode} />
        </VStack>

        <VStack id="clearable" gap="3" className="scroll-mt-6">
          <Text variant="title3">Clearable</Text>
          <Text variant="footnote" color="tertiary">
            Pass onClear to show an x button once there is a value - it takes precedence over
            trailingIcon while visible.
          </Text>
          <ComponentPreview>
            <ClearableDemo />
          </ComponentPreview>
          <CodeBlock code={clearableCode} />
        </VStack>

        <VStack id="helper-error" gap="3" className="scroll-mt-6">
          <Text variant="title3">Helper & error</Text>
          <Text variant="footnote" color="tertiary">
            errorText replaces helperText and switches the field to its invalid state
            (aria-invalid, destructive ring and message color).
          </Text>
          <ComponentPreview>
            <VStack gap="4">
              <TextField label="Username" helperText="Visible to other members." className="w-64" />
              <TextField
                label="Username"
                defaultValue="a"
                errorText="Must be at least 3 characters."
                className="w-64"
              />
            </VStack>
          </ComponentPreview>
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <TextField label="Disabled" defaultValue="Can't touch this" disabled className="w-64" />
          </ComponentPreview>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
