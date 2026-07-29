import { Textarea } from "@/components/ui/textarea";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

const usageCode = `import { Textarea } from "@/components/ui/textarea";

export function Example() {
  return <Textarea label="Bio" placeholder="Tell us about yourself" />;
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "size", title: "Size" },
  { id: "helper-error", title: "Helper & error" },
  { id: "disabled", title: "Disabled" },
];

export default function TextareaDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Textarea</Text>
          <Text variant="body" color="secondary">
            A labeled multi-line text input with optional helper/error text - same label/helper
            structure as TextField, kept as a separate self-contained file rather than shared
            code between the two.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Textarea label="Bio" placeholder="Tell us about yourself" className="w-72" />
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="size" gap="3" className="scroll-mt-6">
          <Text variant="title3">Size</Text>
          <ComponentPreview>
            <VStack gap="4">
              <Textarea size="sm" label="Small" placeholder="Placeholder" rows={2} className="w-72" />
              <Textarea size="md" label="Medium" placeholder="Placeholder" rows={3} className="w-72" />
              <Textarea size="lg" label="Large" placeholder="Placeholder" rows={4} className="w-72" />
            </VStack>
          </ComponentPreview>
        </VStack>

        <VStack id="helper-error" gap="3" className="scroll-mt-6">
          <Text variant="title3">Helper & error</Text>
          <ComponentPreview>
            <VStack gap="4">
              <Textarea
                label="Notes"
                helperText="Optional, visible to your team only."
                className="w-72"
              />
              <Textarea label="Notes" errorText="Notes can't be empty." className="w-72" />
            </VStack>
          </ComponentPreview>
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <ComponentPreview>
            <Textarea label="Disabled" defaultValue="Can't touch this" disabled className="w-72" />
          </ComponentPreview>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
