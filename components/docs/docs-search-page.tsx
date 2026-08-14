"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { searchDocs } from "@/lib/docs/search-index";
import { SearchField } from "@/components/ui/search-field";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

const URL_SYNC_DEBOUNCE_MS = 300;

// Standalone-page counterpart to the DocsSearch modal (docs-search.tsx),
// used instead of it on compact (see DocsSearch's isCompact branch): results
// render inline in page flow rather than in SearchField's popover
// (results/onResultSelect are intentionally left unset below, which keeps
// the popover closed per SearchField's own contract), and the query lives
// in the URL's ?q= so the search is linkable/shareable/back-button-able
// instead of living only in local component state.
export function DocsSearchPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Debounced so every keystroke doesn't push a fresh URL; replace (not
  // push) since each keystroke edits the same search rather than starting a
  // new navigable page -- the back button should leave /docs/search
  // entirely, not step through query history one character at a time.
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query.trim()) params.set("q", query);
      else params.delete("q");
      const queryString = params.toString();
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    }, URL_SYNC_DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
    // Only the query itself should re-trigger the URL sync -- searchParams
    // changes as a side effect of this same effect, and re-running on it
    // too would create a feedback loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const results = useMemo(() => searchDocs(query), [query]);
  const trimmedQuery = query.trim();

  return (
    <div className="flex flex-col gap-(--gap-section)">
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Search
        </Text>
        <SearchField
          value={query}
          onValueChange={setQuery}
          showCancel={false}
          placeholder="Search docs"
          aria-label="Search documentation"
          autoFocus
        />
      </header>

      {trimmedQuery && (
        <VStack gap="1" container={false}>
          {results.length === 0 ? (
            <Text textStyle="body" color="secondary">
              No results for &ldquo;{trimmedQuery}&rdquo;.
            </Text>
          ) : (
            results.map((result) => (
              <Link
                key={result.id}
                href={result.href}
                className="flex flex-col gap-(--space-1) rounded-md px-(--space-3) py-(--space-3) transition-colors duration-(--duration-fast) hover-fine:bg-fill-quaternary"
              >
                <div className="flex flex-wrap items-baseline gap-(--space-2)">
                  <Text textStyle="body" weight="medium">
                    {result.title}
                  </Text>
                  <Text textStyle="caption-1" color="tertiary">
                    {result.subtitle}
                  </Text>
                </div>
                {result.snippet && (
                  <Text textStyle="footnote" color="secondary" truncate={2}>
                    {result.snippet}
                  </Text>
                )}
              </Link>
            ))
          )}
        </VStack>
      )}
    </div>
  );
}
