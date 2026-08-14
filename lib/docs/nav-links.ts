// Shared between docs-sidebar.tsx (renders these as nav links) and
// lib/docs/search-index.ts (indexes them for search) -- kept in its own
// module so neither component has to import the other, which would form a
// cycle.
export const TOP_LINKS = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/guidelines", label: "Guidelines" },
  { href: "/docs/tokens", label: "Tokens" },
  { href: "/docs/scroll-mask", label: "Scroll Mask" },
  { href: "/docs/settings", label: "Settings" },
];

// Separate from TOP_LINKS -- contributor/process content, kept visually
// distinct from the reader-facing docs links above it (see /docs/contributing).
export const CONTRIBUTOR_LINKS = [{ href: "/docs/contributing", label: "Contributing" }];
