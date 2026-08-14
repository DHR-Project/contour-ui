import type { ReactNode } from "react";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Wraps every case-insensitive occurrence of `query` in `text` with a tinted
// <mark> so a search result visibly shows *why* it matched -- used by both
// the docs search page and the sidebar/compact search modal (they share the
// same lib/docs/search-index.ts results). Returns the plain string
// unchanged when there's nothing to highlight (empty query, or no match --
// e.g. a title match doesn't necessarily also appear in its own snippet).
export function highlightMatch(text: string, query: string): ReactNode {
  const normalized = query.trim();
  if (!normalized) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(normalized)})`, "gi"));
  if (parts.length === 1) return text;

  return parts.map((part, i) =>
    part.toLowerCase() === normalized.toLowerCase() ? (
      <mark key={i} className="rounded-xs bg-tint-fill text-tint">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
