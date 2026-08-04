import type { Story } from "@ladle/react";
import { Flex } from "./flex";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Layout / Flex",
};

export default meta;

const swatch = (label: string) => (
  <div
    key={label}
    className="flex h-12 w-12 items-center justify-center rounded-sm bg-fill-secondary text-footnote text-label-secondary"
  >
    {label}
  </div>
);

/**
 * Default row layout. Uses `--space-*` tokens (SS4.1) via the `gap` prop --
 * design principle: Predictable adaptivity (guideline 1.4).
 */
export const Default: Story = () => (
  <Flex gap="4">{["A", "B", "C"].map(swatch)}</Flex>
);

export const Direction: Story = () => (
  <Flex direction="column" gap="2">
    {["A", "B", "C"].map(swatch)}
  </Flex>
);

export const JustifyAndAlign: Story = () => (
  <Flex justify="between" align="center" gap="2" className="h-24 bg-fill-quaternary">
    {["A", "B"].map(swatch)}
  </Flex>
);

/**
 * `gap` prefers semantic tokens (icon-text/row/section) over raw SpaceToken
 * values -- see design-tokens-summary.md SS4.2a and guideline rule 2.4.
 */
export const SemanticGap: Story = () => (
  <Flex gap="section" direction="column">
    <Flex gap="icon-text" align="center">
      {["icon", "text"].map(swatch)}
    </Flex>
    <Flex gap="row" align="center">
      {["row", "row"].map(swatch)}
    </Flex>
  </Flex>
);

/**
 * `container` defaults to true (SS3 spec), which sets `container-type:
 * inline-size` -- this makes the element a CSS size-containment root, so
 * its own width/height stop depending on its content (shrink-to-fit
 * breaks). Fine for a page-level wrapper other components query against,
 * but wrong for a Flex meant to hug its own content (e.g. Button's icon+
 * label row) -- pass `container={false}` there instead.
 */
export const ContainerGotcha: Story = () => (
  <VStack gap="section">
    <div>
      <p className="mb-2 text-footnote text-label-secondary">
        Do: container=false when the Flex should shrink to fit its content
      </p>
      <Flex container={false} gap="icon-text" className="inline-flex w-fit rounded-sm bg-fill-secondary px-3 py-2">
        {swatch("icon")}
        {swatch("label")}
      </Flex>
    </div>
    <div>
      <p className="mb-2 text-footnote text-label-secondary">
        Don&apos;t: default container=true on a shrink-to-fit wrapper -- it
        collapses instead of sizing to its children
      </p>
      <Flex gap="icon-text" className="inline-flex w-fit rounded-sm bg-fill-secondary px-3 py-2">
        {swatch("icon")}
        {swatch("label")}
      </Flex>
    </div>
  </VStack>
);

export const Wrap: Story = () => (
  <Flex wrap="wrap" gap="2" className="w-40">
    {Array.from({ length: 6 }, (_, i) => swatch(String(i)))}
  </Flex>
);

/**
 * Do: use `gap` tokens for spacing between Flex children.
 * Don't: apply ad-hoc margin on children to fake spacing -- breaks if a
 * child is reordered or removed, and skips the responsive group 2 tokens.
 */
export const DoAndDont: Story = () => (
  <Flex direction="column" gap="section">
    <div>
      <p className="mb-2 text-footnote text-label-secondary">Do</p>
      <Flex gap="2">{["A", "B", "C"].map(swatch)}</Flex>
    </div>
    <div>
      <p className="mb-2 text-footnote text-label-secondary">
        Don&apos;t (ad-hoc margin instead of gap)
      </p>
      <div className="flex">
        {["A", "B", "C"].map((l) => (
          <div key={l} className="mr-3">
            {swatch(l)}
          </div>
        ))}
      </div>
    </div>
  </Flex>
);
