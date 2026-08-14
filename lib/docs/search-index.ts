// Shared search index for the docs site -- backs both the sidebar/compact
// search modal (components/docs/docs-search.tsx) and the full inline search
// page (app/docs/search). Combines three sources into one flat list:
//
//   1. Nav links (TOP_LINKS / CONTRIBUTOR_LINKS) -- page titles only.
//   2. The component registry + specs -- name/description plus each spec
//      section (anatomy, props, states, do/dont, tokens, notes), anchored
//      to the same section ids [slug]/page.tsx actually renders.
//   3. content-index.generated.ts -- prose pulled out of the static docs
//      pages (guidelines, tokens, etc.) by scripts/build-docs-content-index.mjs.
//
// This is the "search page content, not just component names" half of docs
// search -- (1) and (2)'s name/description already existed; everything else
// here is new surface area a query can match against.
import { COMPONENTS } from "./component-registry";
import { COMPONENT_SPECS, type ComponentSpec } from "./component-specs";
import { TOP_LINKS, CONTRIBUTOR_LINKS } from "./nav-links";
import { DOCS_CONTENT_INDEX } from "./content-index.generated";

export type DocsSearchEntryKind = "page" | "component" | "content";

interface DocsSearchEntry {
  href: string;
  title: string;
  subtitle: string;
  kind: DocsSearchEntryKind;
  text: string;
}

export interface DocsSearchResult {
  id: string;
  href: string;
  title: string;
  subtitle: string;
  kind: DocsSearchEntryKind;
  /** Excerpt of `text` around the match -- only set for kind "content". */
  snippet?: string;
}

const PAGE_ENTRIES: DocsSearchEntry[] = [...TOP_LINKS, ...CONTRIBUTOR_LINKS].map((link) => ({
  href: link.href,
  title: link.label,
  subtitle: "Page",
  kind: "page",
  text: link.label,
}));

const COMPONENT_ENTRIES: DocsSearchEntry[] = COMPONENTS.map((c) => ({
  href: `/docs/components/${c.slug}`,
  title: c.name,
  subtitle: "Component",
  kind: "component",
  text: `${c.name} ${c.description}`,
}));

// Mirrors the section ids app/docs/components/[slug]/page.tsx actually
// renders (id="anatomy", id="props", ...) so a content match can deep-link
// straight to the right part of the page.
function specContentEntries(spec: ComponentSpec): DocsSearchEntry[] {
  const entries: DocsSearchEntry[] = [];
  const push = (anchor: string, heading: string, text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    entries.push({
      href: `/docs/components/${spec.slug}#${anchor}`,
      title: spec.name,
      subtitle: heading,
      kind: "content",
      text: `${heading} ${trimmed}`,
    });
  };

  if (spec.anatomy?.length) {
    push("anatomy", "Anatomy", spec.anatomy.map((a) => `${a.name}: ${a.description}`).join(" "));
  }
  if (spec.props?.length) {
    push("props", "Props", spec.props.map((p) => `${p.name}: ${p.description}`).join(" "));
  }
  if (spec.states?.length) {
    push("states", "States", spec.states.map((s) => `${s.state}: ${s.description}`).join(" "));
  }
  if (spec.doDont?.length) {
    push(
      "do-dont",
      "Do / Don't",
      spec.doDont.map((pair) => `Do: ${pair.do} Don't: ${pair.dont}`).join(" "),
    );
  }
  if (spec.tokens?.length) {
    push("tokens", "Design Tokens", spec.tokens.map((t) => `${t.name}: ${t.description ?? ""}`).join(" "));
  }
  if (spec.notes) {
    push("notes", "Notes", spec.notes);
  }

  return entries;
}

const COMPONENT_CONTENT_ENTRIES: DocsSearchEntry[] = COMPONENT_SPECS.flatMap(specContentEntries);

// Generated entries with no heading are page-level prose (the copy above the
// first DocsSection) -- folded into the matching nav-link entry's own `text`
// instead of becoming a second row for the same href. Entries with a heading
// become their own anchored content rows.
const pageEntryByHref = new Map(PAGE_ENTRIES.map((entry) => [entry.href, entry]));
const STATIC_CONTENT_ENTRIES: DocsSearchEntry[] = [];
for (const entry of DOCS_CONTENT_INDEX) {
  if (!entry.heading) {
    const page = pageEntryByHref.get(entry.href);
    if (page) page.text += ` ${entry.text}`;
    continue;
  }
  STATIC_CONTENT_ENTRIES.push({
    href: entry.href,
    title: entry.heading,
    subtitle: entry.pageTitle,
    kind: "content",
    text: `${entry.heading} ${entry.text}`,
  });
}

const DOCS_SEARCH_INDEX: DocsSearchEntry[] = [
  ...PAGE_ENTRIES,
  ...COMPONENT_ENTRIES,
  ...COMPONENT_CONTENT_ENTRIES,
  ...STATIC_CONTENT_ENTRIES,
];

function buildSnippet(text: string, normalizedQuery: string, radius = 70): string {
  const index = text.toLowerCase().indexOf(normalizedQuery);
  if (index === -1) return text.length > radius * 2 ? `${text.slice(0, radius * 2).trim()}…` : text;
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + normalizedQuery.length + radius);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < text.length ? "…" : "";
  return `${prefix}${text.slice(start, end).trim()}${suffix}`;
}

/** Case-insensitive substring search across page/component/content entries. */
export function searchDocs(query: string, limit = 30): DocsSearchResult[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  const matches = DOCS_SEARCH_INDEX.reduce<{ entry: DocsSearchEntry; score: number }[]>(
    (acc, entry) => {
      const title = entry.title.toLowerCase();
      const titleMatch = title.includes(normalized);
      const textMatch = entry.text.toLowerCase().includes(normalized);
      if (!titleMatch && !textMatch) return acc;

      let score = entry.kind === "content" ? 0 : 30;
      if (title === normalized) score += 100;
      else if (title.startsWith(normalized)) score += 50;
      else if (titleMatch) score += 20;
      if (textMatch) score += 5;

      acc.push({ entry, score });
      return acc;
    },
    [],
  );

  matches.sort((a, b) => b.score - a.score);

  return matches.slice(0, limit).map(({ entry }) => ({
    id: entry.href,
    href: entry.href,
    title: entry.title,
    subtitle: entry.subtitle,
    kind: entry.kind,
    snippet: entry.kind === "content" ? buildSnippet(entry.text, normalized) : undefined,
  }));
}
