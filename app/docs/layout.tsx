import type { Metadata } from "next";
import { DocsSidebarRail } from "@/components/docs/docs-sidebar-rail";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import { DocsToc } from "@/components/docs/docs-toc";
import { Container } from "@/components/ui/container";
import { SplitView } from "@/components/ui/split-view";
import { RouteTransition } from "@/components/ui/route-transition";
import { ContourProvider } from "@/components/contour-provider";

export const metadata: Metadata = {
  title: {
    template: "%s — Contour Docs",
    default: "Contour Docs",
  },
  description:
    "Contour component library documentation — design guidelines, tokens, and component reference.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContourProvider>
      <SplitView sidebar={<DocsSidebarRail />}>
        {/* Compact top bar -- hamburger opens the sidebar nav in a Sheet, since
          DocsSidebarRail (SplitView's sidebar) renders nothing on compact. */}
        <DocsMobileNav />

        <div className="flex min-h-screen">
          {/* Main content -- RouteTransition wraps only the page content here
            (not the sidebar/mobile-nav/TOC around it), so navigating between
            docs pages only animates the part that's actually new. Invoked
            directly rather than via a docs/template.tsx file: a template.tsx
            at this level would remount on every navigation (Next's own
            per-segment key), tearing down this exact wrapper along with it
            and losing AnimatePresence's coordinated exit/enter -- calling it
            here instead, inside the stable DocsLayout, keeps one persistent
            RouteTransition instance across every /docs/* navigation. */}
          <main id="docs-main" className="flex-1 min-w-0">
            <div className="py-(--space-10)">
              <RouteTransition>
                <Container variant="content">{children}</Container>
              </RouteTransition>
            </div>
          </main>

          {/* Table of contents -- regular-lg+: sticky rail (2nd flex column
            here); compact/regular: fixed floating dash strip, positioned via
            its own `fixed` styles regardless of where it sits in the DOM. */}
          <DocsToc />
        </div>
      </SplitView>
    </ContourProvider>
  );
}
