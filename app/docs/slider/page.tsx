"use client";

import { useState } from "react";

import { Slider } from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const usageCode = `import { Slider } from "@/components/ui/slider";

export function Example() {
  return <Slider defaultValue={50} />;
}`;

const controlledCode = `import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function Example() {
  const [value, setValue] = useState(50);
  return <Slider value={value} onValueChange={(next) => setValue(next as number)} />;
}`;

const rangeCode = `import { useState } from "react";
import { Slider } from "@/components/ui/slider";

export function Example() {
  const [range, setRange] = useState([25, 75]);
  return (
    <Slider
      value={range}
      onValueChange={(next) => setRange(next as number[])}
      thumbLabel={["Minimum", "Maximum"]}
    />
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "controlled", title: "Controlled" },
  { id: "range", title: "Range (multi-thumb)" },
  { id: "disabled", title: "Disabled" },
  { id: "reference", title: "Reference" },
];

function ControlledDemo() {
  const [value, setValue] = useState(50);
  return (
    <VStack gap="3" className="w-full max-w-64">
      <Slider value={value} onValueChange={(next) => setValue(next as number)} />
      <Text as="span" variant="caption1" color="tertiary" className="font-mono">
        {value}
      </Text>
    </VStack>
  );
}

function RangeDemo() {
  const [range, setRange] = useState<number[]>([25, 75]);
  return (
    <VStack gap="3" className="w-full max-w-64">
      <Slider
        value={range}
        onValueChange={(next) => setRange(next as number[])}
        thumbLabel={["Minimum", "Maximum"]}
      />
      <Text as="span" variant="caption1" color="tertiary" className="font-mono">
        {range.join(" - ")}
      </Text>
    </VStack>
  );
}

export default function SliderDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Slider</Text>
          <Text variant="body" color="secondary">
            A range control built on Radix Slider. value/defaultValue as a plain number renders
            a single thumb; as an array, one thumb per entry - for a min/max range slider.
            onValueChange always mirrors whichever shape was passed in.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Slider defaultValue={50} className="w-full max-w-64" />
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <VStack gap="6" className="w-full max-w-64">
              <Slider size="sm" defaultValue={30} />
              <Slider size="md" defaultValue={60} />
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

        <VStack id="range" gap="3" className="scroll-mt-6">
          <Text variant="title3">Range (multi-thumb)</Text>
          <Text variant="footnote" color="tertiary">
            Pass an array to value/defaultValue to get one thumb per entry - the fill spans
            between the outer thumbs. Use thumbLabel with a matching array to label each thumb.
          </Text>
          <ComponentPreview>
            <RangeDemo />
          </ComponentPreview>
          <CodeBlock code={rangeCode} />
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <Slider disabled defaultValue={40} className="w-full max-w-64" />
          </ComponentPreview>
        </VStack>

        <DocsReference
          library="Radix Slider"
          links={[{ label: "Radix Slider API reference", href: "https://www.radix-ui.com/primitives/docs/components/slider" }]}
        />
      </VStack>
    </DocsPage>
  );
}
