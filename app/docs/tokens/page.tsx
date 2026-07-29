import Link from "next/link";

import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { Grid } from "@/components/ui/grid";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { MotionDemo } from "@/components/docs/motion-demo";
import { Button } from "@/components/ui/button";

const usageCode = `<div className="rounded-lg border border-separator bg-bg-secondary p-4">
  <p className="text-label-primary text-headline">Title</p>
  <p className="text-label-secondary text-footnote">Supporting text</p>
  <button className="bg-tint text-body mt-3 rounded-md px-4 py-2 text-white">
    Action
  </button>
</div>`;

const spacingScale = [
  { name: "space-1", utility: "p-1 / gap-1", px: 4 },
  { name: "space-2", utility: "p-2 / gap-2", px: 8 },
  { name: "space-3", utility: "p-3 / gap-3", px: 12 },
  { name: "space-4", utility: "p-4 / gap-4", px: 16 },
  { name: "space-5", utility: "p-5 / gap-5", px: 20 },
  { name: "space-6", utility: "p-6 / gap-6", px: 24 },
  { name: "space-7", utility: "p-7 / gap-7", px: 28 },
  { name: "space-8", utility: "p-8 / gap-8", px: 32 },
  { name: "space-10", utility: "p-10 / gap-10", px: 40 },
  { name: "space-12", utility: "p-12 / gap-12", px: 48 },
  { name: "space-16", utility: "p-16 / gap-16", px: 64 },
  { name: "space-20", utility: "p-20 / gap-20", px: 80 },
];

const radiusScale = [
  { className: "rounded-xs", px: "4px" },
  { className: "rounded-sm", px: "8px" },
  { className: "rounded-md", px: "10px" },
  { className: "rounded-lg", px: "14px" },
  { className: "rounded-xl", px: "20px" },
  { className: "rounded-2xl", px: "28px" },
  { className: "rounded-full", px: "9999px" },
];

const toc = [
  { id: "usage", title: "Usage" },
  { id: "spacing", title: "Spacing" },
  { id: "radius", title: "Radius" },
  { id: "motion", title: "Motion" },
];

export default function TokensDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="10">
        <VStack gap="2">
          <Text variant="largeTitle">Tokens</Text>
          <Text variant="body" color="secondary">
            The design tokens defined in styles/tokens.css, exposed as ready-to-use Tailwind
            utility classes. Color tokens (base palette, shade scale, semantic colors) have their
            own page - see{" "}
            <Link href="/docs/color" className="text-tint underline underline-offset-2">
              Color
            </Link>
            .
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <Text variant="footnote" color="tertiary">
            Semantic tokens compose like any other Tailwind class. This card uses bg-bg-secondary,
            text-label-primary, text-label-secondary, border-separator, and bg-tint together.
          </Text>
          <div className="rounded-lg border border-separator bg-bg-secondary p-4">
            <p className="text-headline text-label-primary">Title</p>
            <p className="text-footnote text-label-secondary">Supporting text</p>
            <Button>Action</Button>
          </div>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="spacing" gap="3" className="scroll-mt-6">
          <Text variant="title2">Spacing</Text>
          <Text variant="footnote" color="tertiary">
            A 4pt grid. Values line up with the default Tailwind spacing scale, so use the native
            utility directly instead of a CSS variable.
          </Text>
          <VStack gap="2" className="rounded-lg border border-separator p-6">
            {spacingScale.map((step) => (
              <HStack key={step.name} align="center" gap="4">
                <Text as="span" variant="caption1" color="tertiary" className="w-20 shrink-0 font-mono">
                  {step.name}
                </Text>
                <div className="h-3 rounded-full bg-tint" style={{ width: step.px }} />
                <Text as="span" variant="caption2" color="tertiary" className="w-28 shrink-0 font-mono">
                  {step.utility}
                </Text>
                <Text as="span" variant="caption2" color="tertiary" className="font-mono">
                  {step.px}px
                </Text>
              </HStack>
            ))}
          </VStack>
        </VStack>

        <VStack id="radius" gap="3" className="scroll-mt-6">
          <Text variant="title2">Radius</Text>
          <Grid columns={{ base: "3", regular: "4" }} gap="4">
            {radiusScale.map((step) => (
              <VStack key={step.className} align="center" gap="2">
                <div
                  className={cn("h-16 w-16 border border-separator bg-fill-secondary", step.className)}
                />
                <Text as="span" variant="caption2" className="font-mono">
                  {step.className}
                </Text>
                <Text as="span" variant="caption2" color="tertiary" className="-mt-2 font-mono">
                  {step.px}
                </Text>
              </VStack>
            ))}
          </Grid>
        </VStack>

        <VStack id="motion" gap="3" className="scroll-mt-6">
          <Text variant="title2">Motion</Text>
          <Text variant="footnote" color="tertiary">
            Duration tokens are for plain CSS transitions. Spring tokens are for Framer Motion -
            import from lib/motion and pass to the transition prop.
          </Text>
          <MotionDemo />
        </VStack>
      </VStack>
    </DocsPage>
  );
}
