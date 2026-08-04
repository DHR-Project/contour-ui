import type { Story } from "@ladle/react";
import { Container } from "./container";
import { VStack } from "@/components/ui/stack";

const meta = {
  title: "Layout / Container",
};

export default meta;

const block = (
  <div className="rounded-sm bg-fill-secondary p-4 text-footnote text-label-secondary">
    Content block
  </div>
);

/**
 * `variant="page"` applies only the responsive page margin + safe-area
 * padding (SS4.3/SS4.4) -- no max-width. Use for the outermost app shell.
 * Do: compose Stack/Flex inside for arrangement -- Container has no
 * `justify`/`align`/`gap` itself (contour-spec-container.md SS4).
 */
export const Page: Story = () => (
  <Container variant="page" className="bg-fill-quaternary">
    <VStack gap="section">{block}</VStack>
  </Container>
);

/**
 * `variant="content"` adds `max-width: var(--container-max-width)` (720px)
 * and centers -- for text-heavy content that shouldn't stretch full width
 * on regular-xl+.
 */
export const Content: Story = () => (
  <Container variant="content" className="bg-fill-quaternary">
    <VStack gap="section">{block}</VStack>
  </Container>
);
