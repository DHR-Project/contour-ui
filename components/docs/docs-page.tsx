import type { ReactNode } from "react";

import { DocsToc, type DocsTocItem } from "./toc";

export interface DocsPageProps {
  toc?: DocsTocItem[];
  children: ReactNode;
}

/**
 * Shared shell for a doc page: main content on the left, an in-page
 * table of contents pinned on the right at wide viewports.
 */
export function DocsPage({ toc = [], children }: DocsPageProps) {
  return (
    <div className="flex items-start gap-8">
      <div className="min-w-0 flex-1">{children}</div>
      {toc.length > 0 ? (
        <aside className="sticky top-10 hidden w-48 shrink-0 xl:block">
          <DocsToc items={toc} />
        </aside>
      ) : null}
    </div>
  );
}
