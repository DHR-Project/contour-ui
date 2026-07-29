"use client";

import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

const usageCode = `import { Badge } from "@/components/ui/badge";

export function Example() {
  return (
    <div className="flex gap-2">
      <Badge color="primary">New</Badge>
      <Badge color="success" variant="tinted">Completed</Badge>
      <Badge color="destructive" variant="outline">Alert</Badge>
    </div>
  );
}`;

const dotsCode = `import { Badge } from "@/components/ui/badge";

export function Example() {
  return (
    <div className="flex gap-2 items-center">
      <Badge color="success" /> {/* Active dot */}
      <Badge color="warning" /> {/* Pending dot */}
      <Badge color="destructive" /> {/* Error dot */}
    </div>
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "variant", title: "Variant" },
  { id: "color", title: "Color" },
  { id: "size", title: "Size" },
  { id: "shape", title: "Shape" },
  { id: "status-dots", title: "Status Dots" },
];

export default function BadgeDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Badge</Text>
          <Text variant="body" color="secondary">
            A small visual label for status, counts, or categories. Supports filled, tinted,
            and outline variants across semantic colors, and automatically formats as a status dot when empty.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <div className="flex gap-3">
              <Badge color="primary">New</Badge>
              <Badge color="success" variant="tinted">Completed</Badge>
              <Badge color="destructive" variant="outline">Alert</Badge>
            </div>
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="variant" gap="3" className="scroll-mt-6">
          <Text variant="title3">Variant</Text>
          <Text variant="footnote" color="tertiary">
            Filled badges are prominent, tinted badges offer a softer appearance, and outline badges are light and clean.
          </Text>
          <ComponentPreview>
            <Badge variant="filled">Filled</Badge>
            <Badge variant="tinted">Tinted</Badge>
            <Badge variant="outline">Outline</Badge>
          </ComponentPreview>
        </VStack>

        <VStack id="color" gap="3" className="scroll-mt-6">
          <Text variant="title3">Color</Text>
          <Text variant="footnote" color="tertiary">
            Matches standard semantic system colors: primary (tint), secondary (neutral gray), success, warning, destructive, and info.
          </Text>
          <ComponentPreview>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex gap-2">
                <Badge variant="filled" color="primary">Primary</Badge>
                <Badge variant="filled" color="secondary">Secondary</Badge>
                <Badge variant="filled" color="success">Success</Badge>
                <Badge variant="filled" color="warning">Warning</Badge>
                <Badge variant="filled" color="destructive">Destructive</Badge>
                <Badge variant="filled" color="info">Info</Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant="tinted" color="primary">Primary</Badge>
                <Badge variant="tinted" color="secondary">Secondary</Badge>
                <Badge variant="tinted" color="success">Success</Badge>
                <Badge variant="tinted" color="warning">Warning</Badge>
                <Badge variant="tinted" color="destructive">Destructive</Badge>
                <Badge variant="tinted" color="info">Info</Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" color="primary">Primary</Badge>
                <Badge variant="outline" color="secondary">Secondary</Badge>
                <Badge variant="outline" color="success">Success</Badge>
                <Badge variant="outline" color="warning">Warning</Badge>
                <Badge variant="outline" color="destructive">Destructive</Badge>
                <Badge variant="outline" color="info">Info</Badge>
              </div>
            </div>
          </ComponentPreview>
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </ComponentPreview>
        </VStack>

        <VStack id="shape" gap="3" className="scroll-mt-6">
          <Text variant="title3">Shape</Text>
          <Text variant="footnote" color="tertiary">
            The default shape uses the standard XS radius, while the pill shape is fully rounded.
          </Text>
          <ComponentPreview>
            <Badge shape="default">Default</Badge>
            <Badge shape="pill">Pill</Badge>
          </ComponentPreview>
        </VStack>

        <VStack id="status-dots" gap="3" className="scroll-mt-6">
          <Text variant="title3">Status Dots</Text>
          <Text variant="footnote" color="tertiary">
            Passing no children automatically renders the badge as a status indicator dot.
          </Text>
          <ComponentPreview>
            <div className="flex gap-4 items-center">
              <Badge size="sm" color="success" />
              <Badge size="md" color="warning" />
              <Badge size="lg" color="destructive" />
              <Badge size="md" color="primary" />
              <Badge size="md" color="info" />
              <Badge size="md" color="secondary" />
            </div>
          </ComponentPreview>
          <CodeBlock code={dotsCode} />
        </VStack>
      </VStack>
    </DocsPage>
  );
}
