"use client";

import { useState } from "react";

import { Segmented } from "@/components/ui/segmented";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

const dayOptions = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

const usageCode = `import { Segmented } from "@/components/ui/segmented";

const options = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

export function Example() {
  return <Segmented options={options} defaultValue="week" aria-label="Range" />;
}`;

const controlledCode = `import { useState } from "react";
import { Segmented } from "@/components/ui/segmented";

export function Example() {
  const [value, setValue] = useState("week");
  return <Segmented options={options} value={value} onValueChange={setValue} aria-label="Range" />;
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "controlled", title: "Controlled" },
  { id: "disabled", title: "Disabled" },
  { id: "keyboard", title: "Keyboard" },
];

function ControlledDemo() {
  const [value, setValue] = useState("week");
  return (
    <VStack gap="3" align="center">
      <Segmented options={dayOptions} value={value} onValueChange={setValue} aria-label="Range" />
      <Text as="span" variant="caption1" color="tertiary" className="font-mono">
        {value}
      </Text>
    </VStack>
  );
}

export default function SegmentedDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Segmented</Text>
          <Text variant="body" color="secondary">
            A single-choice control rendered as a row of segments with a sliding active
            indicator (springs.snappy - the same motion token Switch uses for its thumb). No
            underlying primitive: implemented directly as an ARIA radio group, since it picks
            one value rather than switching visible panels - the case Tabs is for.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Segmented options={dayOptions} defaultValue="week" aria-label="Range" />
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <VStack gap="4" align="center">
              <Segmented size="sm" options={dayOptions} defaultValue="week" aria-label="Range (small)" />
              <Segmented size="md" options={dayOptions} defaultValue="week" aria-label="Range (medium)" />
            </VStack>
          </ComponentPreview>
        </VStack>

        <VStack id="controlled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Controlled</Text>
          <Text variant="footnote" color="tertiary">
            Pass value and onValueChange to drive it from your own state.
          </Text>
          <ComponentPreview>
            <ControlledDemo />
          </ComponentPreview>
          <CodeBlock code={controlledCode} />
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <VStack gap="4" align="center">
              <Segmented disabled options={dayOptions} defaultValue="week" aria-label="Range" />
              <Segmented
                options={[
                  { value: "day", label: "Day" },
                  { value: "week", label: "Week", disabled: true },
                  { value: "month", label: "Month" },
                ]}
                defaultValue="day"
                aria-label="Range with a disabled option"
              />
            </VStack>
          </ComponentPreview>
        </VStack>

        <VStack id="keyboard" gap="3" className="scroll-mt-6">
          <Text variant="title3">Keyboard</Text>
          <Text variant="footnote" color="tertiary">
            Follows the ARIA radio group pattern: only the selected segment is tab-stoppable;
            Arrow Left/Right (or Up/Down) move selection between segments, Home/End jump to the
            first/last enabled one - disabled segments are skipped.
          </Text>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
