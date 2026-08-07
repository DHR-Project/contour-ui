import type { Metadata } from "next";
import { DocsSidebarRail } from "@/components/docs/docs-sidebar-rail";
import { DocsMobileNav } from "@/components/docs/docs-mobile-nav";
import { DocsToc } from "@/components/docs/docs-toc";
import { Container } from "@/components/ui/container";
import { SplitView } from "@/components/ui/split-view";

export const metadata: Metadata = {
  title: {
    template: "%s — Contour Docs",
    default: "Contour Docs",
  },
  description: "Contour component library documentation — design guidelines, tokens, and component reference.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <SplitView sidebar={<DocsSidebarRail />}>
      {/* Compact top bar -- hamburger opens the sidebar nav in a Sheet, since
          DocsSidebarRail (SplitView's sidebar) renders nothing on compact. */}
      <DocsMobileNav />

      <div className="flex min-h-screen">
        {/* Main content */}
        <main id="docs-main" className="flex-1 min-w-0 pt-14 md:pt-0">
          <div className="py-(--space-10)">
            <Container variant="content">{children}</Container>
          </div>
        </main>

        {/* Table of contents -- regular-lg+: sticky rail (2nd flex column
            here); compact/regular: fixed floating dash strip, positioned via
            its own `fixed` styles regardless of where it sits in the DOM. */}
        <DocsToc />
      </div>
    </SplitView>
  );
}
