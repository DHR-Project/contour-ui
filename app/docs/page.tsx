import type { Metadata } from "next";
import Link from "next/link";
import { COMPONENTS, CATEGORIES } from "@/lib/docs/component-registry";
import { DocsSection } from "@/components/docs/docs-ui";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Grid } from "@/components/ui/grid";
import { VStack } from "@/components/ui/stack";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { ComponentPictogram } from "@/components/docs/component-pictograms";

// One glyph per category -- a small, restrained stand-in for a full
// illustration (guideline 6.1: all icon usage goes through the Icon
// abstraction, never lucide-react directly).
const CATEGORY_ICONS: Record<string, IconName> = {
  layout: "layout-grid",
  navigation: "compass",
  controls: "sliders-horizontal",
  display: "image",
  feedback: "message-circle",
  overlay: "layers",
};

export const metadata: Metadata = {
  title: {
    template: "%s — Contour Docs",
    default: "Contour Docs",
  },
  description:
    "Contour component library documentation — design guidelines, tokens, and component reference.",
};

const PRINCIPLES = [
  {
    id: "continuity",
    title: "Continuity",
    description:
      "No abrupt corners — in geometry or motion. Every transition should feel like a physical object moving continuously, never snapping between states. Spring physics (Framer Motion) instead of static easings.",
  },
  {
    id: "depth",
    title: "Depth through material",
    description:
      "Spatial hierarchy via frosted glass and semantic background layers — not heavy shadows. Elevated surfaces use denser material, not darker shadows.",
  },
  {
    id: "content-first",
    title: "Content-first restraint",
    description:
      "Components never shout louder than their content. Tint is reserved for meaningful actions and states; everything else uses neutral label and fill tokens.",
  },
  {
    id: "adaptivity",
    title: "Predictable adaptivity",
    description:
      "Layout changes across size-classes follow one consistent system-wide logic — compact defaults, regular+ expansions. Components evolve naturally, they don't become different things.",
  },
];

const TOP_LINKS = [
  {
    href: "/docs/guidelines",
    title: "Guidelines",
    description:
      "Design principles, token usage, responsive behavior, interaction, accessibility, and iconography rules.",
  },
  {
    href: "/docs/tokens",
    title: "Tokens",
    description:
      "All CSS custom properties: colors, typography, spacing, radius, motion, and z-index.",
  },
  {
    // In-page anchor, not a route -- the full component list already
    // lives further down this same page (id="components-overview"), so
    // there's no separate /docs/components browse page to link to.
    href: "#components-overview",
    title: "Components",
    description: `${COMPONENTS.length} components across ${CATEGORIES.length} categories. Live demos for components with code; spec sheets for those still in progress.`,
  },
  {
    href: "/docs/hooks",
    title: "Hooks",
    description:
      "Shared React hooks for responsive size-class, input modality, accessibility preferences, and scroll tracking.",
  },
  {
    href: "/docs/providers",
    title: "Providers",
    description:
      "ContourProvider and useContourPreferences — theme, tint, size mode, and accessibility state shared across the tree.",
  },
];

export default function DocsOverviewPage() {
  const totalComplete = COMPONENTS.filter(
    (c) => c.status === "complete",
  ).length;
  const totalSpecOnly = COMPONENTS.filter(
    (c) => c.status === "spec-only",
  ).length;
  const totalDeferred = COMPONENTS.filter(
    (c) => c.status === "deferred",
  ).length;

  return (
    <div className="flex flex-col gap-(--gap-section)">
      {/* Hero */}
      <header className="flex flex-col gap-(--space-4)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Contour
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          A component library built on native-feeling design principles —
          adaptive, accessible, and composable. Tailwind v4 + Next.js App Router
          + TypeScript, with a design token system grounded in real CSS custom
          properties.
        </Text>

        {/* Status summary chips */}
        <div
          className="flex flex-wrap gap-(--space-3)"
          aria-label="Component status summary"
        >
          <span className="inline-flex items-center gap-(--space-1) px-(--space-3) py-(--space-1) rounded-full bg-[rgb(var(--color-green)/0.12)] text-[rgb(var(--color-green))] text-footnote font-medium">
            <span
              className="w-2 h-2 rounded-full bg-[rgb(var(--color-green))]"
              aria-hidden="true"
            />
            {totalComplete} components with live code
          </span>
          <span className="inline-flex items-center gap-(--space-1) px-(--space-3) py-(--space-1) rounded-full bg-[rgb(var(--color-orange)/0.12)] text-[rgb(var(--color-orange))] text-footnote font-medium">
            <span
              className="w-2 h-2 rounded-full bg-[rgb(var(--color-orange))]"
              aria-hidden="true"
            />
            {totalSpecOnly} spec-only
          </span>
          <span className="inline-flex items-center gap-(--space-1) px-(--space-3) py-(--space-1) rounded-full bg-fill-secondary text-label-secondary text-footnote font-medium border border-separator">
            <span
              className="w-2 h-2 rounded-full bg-[rgb(var(--color-gray-3))]"
              aria-hidden="true"
            />
            {totalDeferred} deferred
          </span>
        </div>
      </header>

      {/* Top-level navigation cards */}
      <DocsSection title="Start here" id="start-here">
        <nav aria-label="Main documentation sections">
          <Grid columns={{ compact: 1, regular: 3 }} gap="4">
            {TOP_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="block h-full">
                <Card
                  elevation="flat"
                  className="h-full hover-fine:bg-fill-quaternary transition-colors duration-(--duration-fast)"
                >
                  <VStack gap="2">
                    <Text textStyle="headline" weight="semibold">
                      {link.title}
                    </Text>
                    <Text textStyle="footnote" color="secondary">
                      {link.description}
                    </Text>
                  </VStack>
                </Card>
              </Link>
            ))}
          </Grid>
        </nav>
      </DocsSection>

      {/* Design Principles */}
      <DocsSection title="Design Principles" id="principles">
        <Grid columns={{ compact: 1, regular: 2 }} gap="4">
          {PRINCIPLES.map((p) => (
            <Card key={p.id} elevation="flat" className="bg-bg-secondary">
              <VStack gap="2">
                <Text as="h3" textStyle="headline" weight="semibold">
                  {p.title}
                </Text>
                <Text textStyle="footnote" color="secondary">
                  {p.description}
                </Text>
              </VStack>
            </Card>
          ))}
        </Grid>
      </DocsSection>

      {/* Component overview by category */}
      <DocsSection title="Components" id="components-overview">
        {/* Category illustration -- a glyph tile per category, doubling as a
            visual index for the detailed lists below. */}
        <Grid columns={{ compact: 2, regular: 6 }} gap="3">
          {CATEGORIES.map((cat) => {
            const count = COMPONENTS.filter(
              (c) => c.category === cat.id,
            ).length;
            if (count === 0) return null;
            return (
              <Card
                key={cat.id}
                elevation="flat"
                padding="4"
                className="bg-bg-secondary"
              >
                <VStack gap="2" align="center" className="text-center">
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-fill-secondary"
                    aria-hidden="true"
                  >
                    <Icon
                      name={CATEGORY_ICONS[cat.id]}
                      size="lg"
                      className="text-label-secondary"
                    />
                  </span>
                  <Text textStyle="footnote" weight="semibold">
                    {cat.label}
                  </Text>
                  <Text textStyle="caption-1" color="secondary">
                    {count} component{count === 1 ? "" : "s"}
                  </Text>
                </VStack>
              </Card>
            );
          })}
        </Grid>

        <VStack gap="6">
          {CATEGORIES.map((cat) => {
            const items = COMPONENTS.filter((c) => c.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id}>
                <div
                  id={cat.label}
                  aria-labelledby={
                    cat.label ? `${cat.label}-heading` : undefined
                  }
                  className="flex items-center gap-(--space-2) mb-(--space-3)"
                >
                  <Icon
                    name={CATEGORY_ICONS[cat.id]}
                    size="sm"
                    className="text-label-tertiary"
                  />
                  <Text
                    as="h3"
                    textStyle="subheadline"
                    weight="semibold"
                    color="secondary"
                    className="uppercase tracking-wide"
                    id={cat.label ? `${cat.label}-heading` : undefined}
                  >
                    {cat.label}
                  </Text>
                </div>
                <Grid columns={{ compact: 1, regular: 2 }} gap="2">
                  {items.map((comp) => (
                    <Link
                      key={comp.slug}
                      href={`/docs/components/${comp.slug}`}
                      className="flex items-center gap-(--space-3) px-(--space-4) py-(--space-3) rounded-lg border border-separator bg-bg-primary hover-fine:bg-fill-quaternary transition-colors duration-(--duration-fast)"
                    >
                      <span
                        className="flex items-center justify-center w-7 h-7 rounded-md bg-fill-quaternary text-label-tertiary shrink-0"
                        aria-hidden="true"
                      >
                        <ComponentPictogram slug={comp.slug} size="sm" />
                      </span>
                      <VStack gap="1" className="flex-1 min-w-0">
                        <Text textStyle="footnote" weight="medium">
                          {comp.name}
                        </Text>
                        <Text textStyle="caption-1" color="secondary">
                          {comp.description}
                        </Text>
                      </VStack>
                      {comp.status === "spec-only" && (
                        <span className="shrink-0 text-caption-2 font-medium text-[rgb(var(--color-orange))] bg-[rgb(var(--color-orange)/0.12)] px-(--space-2) py-px rounded-full">
                          Spec
                        </span>
                      )}
                      {comp.status === "deferred" && (
                        <span className="shrink-0 text-caption-2 font-medium text-label-tertiary bg-fill-secondary px-(--space-2) py-px rounded-full">
                          Deferred
                        </span>
                      )}
                    </Link>
                  ))}
                </Grid>
              </div>
            );
          })}
        </VStack>
      </DocsSection>
    </div>
  );
}
