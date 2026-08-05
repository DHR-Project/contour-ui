import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, CATEGORIES } from "@/lib/docs/component-registry";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Grid } from "@/components/ui/grid";
import { VStack } from "@/components/ui/stack";
import { ComponentPictogram } from "@/components/docs/component-pictograms";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${COMPONENTS.length} Contour components with live demos (where code exists) and full spec documentation.`,
};

export default function ComponentsIndexPage() {
  const totalComplete = COMPONENTS.filter((c) => c.status === "complete").length;
  const totalSpecOnly = COMPONENTS.filter((c) => c.status === "spec-only").length;
  const totalDeferred = COMPONENTS.filter((c) => c.status === "deferred").length;

  return (
    <div className="flex flex-col gap-(--gap-section)">
      {/* Header */}
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Components
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          {COMPONENTS.length} components across {CATEGORIES.length} categories. Live demos are
          shown for components that have real code. Spec-only components display their spec
          without a demo.
        </Text>

        {/* Legend */}
        <div className="flex flex-wrap gap-(--space-4) pt-(--space-1)">
          <div className="flex items-center gap-(--space-2)">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--color-green))]" aria-hidden="true" />
            <Text textStyle="footnote" color="secondary">
              {totalComplete} with live code
            </Text>
          </div>
          <div className="flex items-center gap-(--space-2)">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--color-orange))]" aria-hidden="true" />
            <Text textStyle="footnote" color="secondary">
              {totalSpecOnly} spec-only
            </Text>
          </div>
          <div className="flex items-center gap-(--space-2)">
            <span className="w-2.5 h-2.5 rounded-full bg-[rgb(var(--color-gray-3))]" aria-hidden="true" />
            <Text textStyle="footnote" color="secondary">
              {totalDeferred} deferred
            </Text>
          </div>
        </div>
      </header>

      {/* Categories */}
      {CATEGORIES.map((cat) => {
        const items = COMPONENTS.filter((c) => c.category === cat.id);
        if (items.length === 0) return null;

        return (
          <section key={cat.id} aria-labelledby={`cat-${cat.id}`}>
            <Text as="h2" id={`cat-${cat.id}`} textStyle="title-3" weight="semibold" className="mb-(--space-4)">
              {cat.label}
            </Text>

            <Grid columns={{ compact: 1, regular: 2 }} gap="3">
              {items.map((comp) => (
                <Link key={comp.slug} href={`/docs/components/${comp.slug}`} className="block h-full">
                  <Card
                    elevation="flat"
                    corner="squircle"
                    className="h-full hover-fine:bg-fill-quaternary transition-colors duration-(--duration-fast)"
                  >
                    <VStack gap="2">
                      {/* Header row */}
                      <div className="flex items-start justify-between gap-(--space-2)">
                        <div className="flex items-center gap-(--space-3) min-w-0">
                          <span
                            className="flex items-center justify-center w-8 h-8 rounded-lg bg-fill-secondary text-label-secondary shrink-0"
                            aria-hidden="true"
                          >
                            <ComponentPictogram slug={comp.slug} size="md" />
                          </span>
                          <Text textStyle="body" weight="semibold" className="truncate">
                            {comp.name}
                          </Text>
                        </div>

                        {comp.status === "spec-only" && (
                          <span className="shrink-0 mt-0.5 text-caption-2 font-semibold text-[rgb(var(--color-orange))] bg-[rgb(var(--color-orange)/0.12)] px-(--space-2) py-px rounded-full">
                            Spec
                          </span>
                        )}
                        {comp.status === "deferred" && (
                          <span className="shrink-0 mt-0.5 text-caption-2 font-semibold text-label-tertiary bg-fill-secondary px-(--space-2) py-px rounded-full border border-separator">
                            Deferred
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <Text textStyle="footnote" color="secondary">
                        {comp.description}
                      </Text>
                    </VStack>
                  </Card>
                </Link>
              ))}
            </Grid>
          </section>
        );
      })}
    </div>
  );
}
