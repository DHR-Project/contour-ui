import { Grid } from "@/components/ui/grid";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { ResizablePreview } from "@/components/docs/resizable-preview";

function Box({ index }: { index: number }) {
  return (
    <div className="rounded-md bg-tint/15 px-4 py-3 text-center text-tint">{index + 1}</div>
  );
}

const usageCode = `import { Grid } from "@/components/ui/grid";

export function Example() {
  return (
    <Grid columns="3" gap="4">
      <Card />
      <Card />
      <Card />
    </Grid>
  );
}`;

const responsiveCode = `<Grid columns={{ base: "1", regular: "2", regularLg: "3" }} gap="4">
  <Card />
  <Card />
  <Card />
</Grid>`;

const containerCode = `<Grid columns={{ base: "1", containerSm: "2", containerLg: "3" }} gap="4">
  <Card />
  <Card />
  <Card />
</Grid>`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "columns", title: "Columns" },
  { id: "responsive", title: "Responsive" },
  { id: "container-queries", title: "Container queries" },
];

export default function GridDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Grid</Text>
          <Text variant="body" color="secondary">
            A fixed-column CSS grid. For anything more dynamic — auto-fit tracks, spanning
            cells — reach for raw Tailwind grid classes on a div instead.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="columns" gap="3" className="scroll-mt-6">
          <Text variant="title3">Columns</Text>
          <ComponentPreview>
            <Grid columns="3" gap="3" className="w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} index={i} />
              ))}
            </Grid>
          </ComponentPreview>
        </VStack>

        <VStack id="responsive" gap="3" className="scroll-mt-6">
          <Text variant="title3">Responsive</Text>
          <Text variant="footnote" color="tertiary">
            columns and gap accept an object keyed by viewport breakpoint (base, regular,
            regularLg, regularXl) or container breakpoint (containerSm/Md/Lg/Xl, when this
            Grid or an ancestor has container set) - see the Flex docs for the full breakpoint
            reference, shared across every layout component.
          </Text>
          <ComponentPreview>
            <Grid columns={{ base: "1", regular: "2", regularLg: "3" }} gap="3" className="w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} index={i} />
              ))}
            </Grid>
          </ComponentPreview>
          <CodeBlock code={responsiveCode} />
        </VStack>

        <VStack id="container-queries" gap="3" className="scroll-mt-6">
          <Text variant="title3">Container queries</Text>
          <Text variant="footnote" color="tertiary">
            Drag to resize the frame below - columns switches based on the frame&apos;s own
            width via containerSm/containerLg, not the browser window.
          </Text>
          <ResizablePreview>
            <Grid columns={{ base: "1", containerSm: "2", containerLg: "3" }} gap="3" className="w-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <Box key={i} index={i} />
              ))}
            </Grid>
          </ResizablePreview>
          <CodeBlock code={containerCode} />
        </VStack>
      </VStack>
    </DocsPage>
  );
}
