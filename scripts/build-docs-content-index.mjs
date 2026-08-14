// Generates lib/docs/content-index.generated.ts from the prose docs pages
// (app/docs/**/page.tsx, excluding the dynamic component-detail route --
// that page is rendered straight from lib/docs/component-specs.ts, which is
// already structured data and gets indexed directly by lib/docs/search-index.ts
// with no parsing needed).
//
// Docs pages are plain JSX, not MDX, so there is no ready-made text layer to
// search. This walks each page's TypeScript AST and pulls out reader-visible
// text -- JSXText nodes, string-literal JSX expression children (`{"..."}`),
// and string literals reachable through non-technical JSX attributes (e.g.
// DocsTable's `rows`/`columns`, or a page's own module-level data arrays) --
// while skipping technical attributes (className, event handlers, variant
// props, etc.) that would otherwise pollute the index with styling noise.
//
// Text is grouped by the nearest enclosing DocsSection/DocsSubsection (see
// components/docs/docs-ui.tsx), so each index entry can link straight to the
// heading it came from via its `id`/`${id}-heading` anchor.
//
// Run with: pnpm docs:index
// Re-run whenever a docs page's prose content changes -- there is no build
// hook wiring this in automatically, so the generated file can drift if a
// page edit isn't followed by a regeneration.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const PAGES = [
  { file: "app/docs/page.tsx", href: "/docs", pageTitle: "Overview" },
  { file: "app/docs/guidelines/page.tsx", href: "/docs/guidelines", pageTitle: "Guidelines" },
  { file: "app/docs/tokens/page.tsx", href: "/docs/tokens", pageTitle: "Tokens" },
  { file: "app/docs/scroll-mask/page.tsx", href: "/docs/scroll-mask", pageTitle: "Scroll Mask" },
  { file: "app/docs/contributing/page.tsx", href: "/docs/contributing", pageTitle: "Contributing" },
  { file: "app/docs/settings/page.tsx", href: "/docs/settings", pageTitle: "Settings" },
];

const SECTION_TAGS = new Set(["DocsSection", "DocsSubsection"]);

// JSX attributes whose values are configuration, not reader content --
// skipped entirely so e.g. `variant="plain"` or `className="flex gap-2"`
// never end up as searchable text.
const ATTRIBUTE_DENYLIST = new Set([
  "className", "style", "id", "key", "href", "onClick", "onChange",
  "onValueChange", "onSelect", "role", "variant", "size", "leadingIcon",
  "trailingIcon", "status", "kind", "category", "slug", "importPath",
  "type", "width", "elevation", "padding", "direction", "align", "justify",
  "gap", "wrap", "container", "as", "value", "defaultValue", "placeholder",
  "weight", "textStyle", "color", "position", "badge", "level", "aria-hidden",
]);

// TypeScript's JsxText.text is raw source, unlike React's own JSX runtime --
// it does not decode named HTML entities, so do it here or search snippets
// would show literal "&apos;" etc.
const HTML_ENTITIES = {
  apos: "'",
  quot: '"',
  amp: "&",
  lt: "<",
  gt: ">",
  ge: "≥",
  ldquo: "“",
  rdquo: "”",
  lsquo: "‘",
  rsquo: "’",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  nbsp: " ",
};

function decodeEntities(text) {
  return text.replace(/&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z]+);/g, (match, code) => {
    if (code[0] === "#") {
      const codePoint = code[1] === "x" || code[1] === "X" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return HTML_ENTITIES[code] ?? match;
  });
}

function tagNameOf(node) {
  const tagNode = ts.isJsxElement(node) ? node.openingElement.tagName : node.tagName;
  return tagNode.getText();
}

function getStringAttr(openingElement, name) {
  for (const attr of openingElement.attributes.properties) {
    if (!ts.isJsxAttribute(attr) || attr.name.getText() !== name) continue;
    if (!attr.initializer) return undefined;
    if (ts.isStringLiteral(attr.initializer)) return attr.initializer.text;
    if (
      ts.isJsxExpression(attr.initializer) &&
      attr.initializer.expression &&
      ts.isStringLiteralLike(attr.initializer.expression)
    ) {
      return attr.initializer.expression.text;
    }
  }
  return undefined;
}

function extractPage({ file, href, pageTitle }) {
  const filePath = path.join(repoRoot, file);
  const source = fs.readFileSync(filePath, "utf8");
  const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const entries = [];
  function newEntry(heading, anchor) {
    const entry = { href: anchor ? `${href}#${anchor}` : href, pageTitle, heading, text: "" };
    entries.push(entry);
    return entry;
  }
  const stack = [newEntry(undefined, undefined)];

  function append(raw) {
    const text = decodeEntities(raw).replace(/\s+/g, " ").trim();
    if (!text) return;
    const top = stack[stack.length - 1];
    top.text = top.text ? `${top.text} ${text}` : text;
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isImportEqualsDeclaration(node)) return;

    if (ts.isJsxText(node)) {
      append(node.text);
      return;
    }

    if (ts.isJsxExpression(node)) {
      if (node.expression && ts.isStringLiteralLike(node.expression)) {
        append(node.expression.text);
      } else if (node.expression) {
        visit(node.expression);
      }
      return;
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      append(node.text);
      return;
    }

    if (ts.isJsxElement(node) && SECTION_TAGS.has(tagNameOf(node))) {
      const opening = node.openingElement;
      const idAttr = getStringAttr(opening, "id");
      const titleAttr = getStringAttr(opening, "title");
      stack.push(newEntry(titleAttr, idAttr));
      node.children.forEach(visit);
      stack.pop();
      return;
    }

    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText();
      if (ATTRIBUTE_DENYLIST.has(name)) return;
      if (node.initializer) visit(node.initializer);
      return;
    }

    // Object-literal props feeding DocsTable's `columns`/`rows` (e.g.
    // `{ key: "name", width: "140px", label: "Token" }`) aren't JSX
    // attributes, so the denylist above doesn't reach them -- same names,
    // same reasoning, applied to plain property assignments too.
    if (ts.isPropertyAssignment(node) && ts.isIdentifier(node.name) && ATTRIBUTE_DENYLIST.has(node.name.text)) {
      return;
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return entries
    .map((entry) => ({ ...entry, text: entry.text.trim() }))
    .filter((entry) => entry.text.length > 0);
}

const allEntries = PAGES.flatMap(extractPage);

const banner = `// GENERATED FILE -- do not edit by hand.
// Produced by scripts/build-docs-content-index.mjs from the prose docs pages
// (app/docs/**/page.tsx). Re-run \`pnpm docs:index\` after editing any of
// their content so this file stays in sync.

export interface DocsContentEntry {
  /** Page path, with a "#<section-id>" anchor when the text came from a
   * specific DocsSection/DocsSubsection rather than the page as a whole. */
  href: string;
  /** Docs page this entry belongs to, e.g. "Guidelines". */
  pageTitle: string;
  /** Nearest enclosing section/subsection title, if any. */
  heading?: string;
  /** Flattened, whitespace-collapsed text content of that section. */
  text: string;
}

export const DOCS_CONTENT_INDEX: DocsContentEntry[] = `;

const output = `${banner}${JSON.stringify(allEntries, null, 2)};\n`;

const outPath = path.join(repoRoot, "lib/docs/content-index.generated.ts");
fs.writeFileSync(outPath, output);

console.log(`Wrote ${allEntries.length} entries to ${path.relative(repoRoot, outPath)}`);
