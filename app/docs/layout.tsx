import type { ReactNode } from "react";

import { DocsNav } from "@/components/docs/docs-nav";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-(--page-margin) py-10 md:flex-row">
      <aside className="shrink-0 md:w-48">
        <DocsNav />
      </aside>
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
