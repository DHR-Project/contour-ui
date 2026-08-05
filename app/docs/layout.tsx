import type { Metadata } from "next";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { DocsToc } from "@/components/docs/docs-toc";
import { Container } from "@/components/ui/container";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

export const metadata: Metadata = {
  title: {
    template: "%s — Contour Docs",
    default: "Contour Docs",
  },
  description: "Contour component library documentation — design guidelines, tokens, and component reference.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar — fixed on desktop, hidden on mobile (mobile uses top-nav only).
          TODO(docs): replace this hand-rolled <aside> + DocsSidebar nav with
          the real Sidebar component once it ships (currently deferred,
          pending SplitView / RouteTransition -- see /docs/components/sidebar). */}
      <aside
        aria-label="Documentation navigation"
        className="hidden md:flex flex-col w-[240px] shrink-0 border-r border-separator bg-bg-primary sticky top-0 h-screen"
      >
        <VStack gap="1" className="px-(--space-5) pt-(--space-6) pb-(--space-3)">
          <Text textStyle="headline" weight="semibold">
            Contour
          </Text>
          <Text textStyle="footnote" color="secondary">
            Component Library
          </Text>
        </VStack>
        <div className="flex-1 overflow-y-auto">
          <DocsSidebar />
        </div>
      </aside>

      {/* Mobile breadcrumb bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-(--z-sticky) bg-(--material-regular) backdrop-blur-lg border-b border-separator px-(--page-margin) py-(--space-3)">
        <Text textStyle="headline" weight="semibold">
          Contour Docs
        </Text>
      </div>

      {/* Main content */}
      <main id="docs-main" className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="py-(--space-10)">
          <Container variant="content">{children}</Container>
        </div>
      </main>

      {/* Table of contents -- regular-lg+: sticky rail (3rd flex column);
          compact/regular: fixed floating dash strip, positioned via its own
          `fixed` styles regardless of where it sits in the DOM. */}
      <DocsToc />
    </div>
  );
}
