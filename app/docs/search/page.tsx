import type { Metadata } from "next";
import { Suspense } from "react";
import { DocsSearchPage } from "@/components/docs/docs-search-page";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Contour's documentation pages and component reference.",
};

// DocsSearchPage reads/writes the ?q= search param via useSearchParams,
// which requires a Suspense boundary around it (see Next's docs on
// useSearchParams prerendering) so the rest of the route can still be
// prerendered instead of the whole page bailing out to client-only
// rendering.
export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <DocsSearchPage />
    </Suspense>
  );
}
