// Repo-specific staging step run as part of cfg.buildCmd (after `pnpm build`),
// before the design-sync converter. Three jobs, all producing gitignored
// output under .design-sync/.cache/ that the converter's config points at:
//
// 0. cfg.srcDir must be a single directory so the converter's no-.d.ts synth
//    path can content-scan it for every PascalCase component export. The
//    real components live in two sibling dirs -- components/ui (the 33
//    primitives) and components/icon (Icon, kept separate in-repo so
//    non-icon code doesn't import the generated icon registry). Union them
//    here into one staged dir. (Note: cfg.componentSrcMap additions look
//    like the obvious alternative, but in synth-entry mode ANY non-empty
//    componentSrcMap short-circuits the derive-from-src fallback entirely --
//    the full content scan never runs and every component but the pinned
//    one disappears. Unioning the source dirs sidesteps that.)
//
// 1. Tailwind v4 has no static dist/ stylesheet -- utilities are generated
//    at build time from actual usage. `next build` (Turbopack) writes the
//    real compiled CSS to a content-hashed file under .next/static/chunks/.
//    Copy it to a stable path (cfg.cssEntry) so re-syncs don't need to
//    discover a new hash each time. The referenced @font-face files live in
//    a sibling `../media/` dir relative to the css -- copied alongside so
//    those relative url()s keep resolving.
//
// 2. Per-component design docs. The authoritative source is
//    lib/docs/component-specs.ts (English, structured, already vetted for
//    the public /docs/components/[slug] pages -- cross-referenced with
//    lib/docs/component-registry.ts for each component's category). NOT
//    local-docs/contour-spec-*.md: those are internal planning notes, partly
//    in Vietnamese, that compare against a named commercial platform by
//    name -- fine as an internal reference, wrong to ship into a design
//    agent's prompt (see CLAUDE.md's own neutral-wording rule). Render each
//    ComponentSpec to a plainly-named markdown file (with a `category`
//    frontmatter so the converter groups cards the same way the docs site
//    does) so cfg.docsDir discovery binds them with zero cfg.docsMap entries.
//
// 3. Design guidelines (cfg.guidelinesGlob): same problem as #2 -- the only
//    local-docs source (contour-design-guidelines-v2.md) is Vietnamese and
//    names a commercial platform throughout. The public /docs/guidelines
//    page is the clean English, brand-neutral equivalent, but it's JSX, not
//    markdown. Extract its rendered text (DocsSection/DocsSubsection titles
//    become headings, DocsCode spans become inline code, other JSX
//    expressions/tags stripped) into a plain .md file. (/docs/tokens is
//    deliberately NOT extracted here -- it's mostly a big literal color-value
//    table, and the actual token values already ship live in cfg.cssEntry as
//    real `var(--*)` custom properties, which is more useful to a design
//    agent than a prose restatement.)

import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

// ── 0. Union components/ui + components/icon into one staged srcDir ───────
const SRC_STAGE = join(ROOT, '.design-sync/.cache/srcDir');
rmSync(SRC_STAGE, { recursive: true, force: true });
mkdirSync(SRC_STAGE, { recursive: true });
cpSync(join(ROOT, 'components/ui'), join(SRC_STAGE, 'ui'), { recursive: true });
cpSync(join(ROOT, 'components/icon'), join(SRC_STAGE, 'icon'), { recursive: true });
console.error('[stage-assets] srcDir: components/ui + components/icon -> .design-sync/.cache/srcDir');

// ── 1. Compiled Tailwind CSS + fonts ───────────────────────────────────────
const CHUNKS_DIR = join(ROOT, '.next/static/chunks');
const CSS_OUT_DIR = join(ROOT, '.design-sync/.cache/tailwind-build');
const cssFiles = existsSync(CHUNKS_DIR) ? readdirSync(CHUNKS_DIR).filter((f) => f.endsWith('.css')) : [];
if (cssFiles.length !== 1) {
  console.error(`[stage-assets] expected exactly 1 compiled css chunk under .next/static/chunks, found ${cssFiles.length}: ${cssFiles.join(', ')}`);
  process.exit(1);
}
rmSync(CSS_OUT_DIR, { recursive: true, force: true });
mkdirSync(join(CSS_OUT_DIR, 'chunks'), { recursive: true });
copyFileSync(join(CHUNKS_DIR, cssFiles[0]), join(CSS_OUT_DIR, 'chunks/compiled.css'));
cpSync(join(ROOT, '.next/static/media'), join(CSS_OUT_DIR, 'media'), { recursive: true });
console.error(`[stage-assets] compiled css: ${cssFiles[0]} -> .design-sync/.cache/tailwind-build/chunks/compiled.css`);

// ── 2. Per-component docs, rendered from component-specs.ts + registry ────
const DOCS_OUT_DIR = join(ROOT, '.design-sync/.cache/docs');
const { COMPONENT_SPECS } = await import(join(ROOT, 'lib/docs/component-specs.ts'));
const { COMPONENTS, CATEGORIES } = await import(join(ROOT, 'lib/docs/component-registry.ts'));

const categoryLabel = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));
const registryBySlug = Object.fromEntries(COMPONENTS.map((c) => [c.slug, c]));

function mdTable(headers, rows) {
  // Prop types are unions ("filled" | "tinted") -- the raw `|` would
  // otherwise be read as a cell delimiter and shift every column.
  const esc = (c) => String(c).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  const line = (cells) => `| ${cells.map(esc).join(' | ')} |`;
  return [
    line(headers),
    line(headers.map(() => '---')),
    ...rows.map(line),
  ].join('\n');
}

function renderSpec(spec) {
  const meta = registryBySlug[spec.slug];
  const category = meta ? categoryLabel[meta.category] : undefined;
  const parts = [];
  if (category) parts.push(`---\ncategory: ${category}\n---\n`);
  parts.push(`# ${spec.name}\n`);
  parts.push(`${spec.description}\n`);
  if (spec.anatomy?.length) {
    parts.push('## Anatomy\n');
    // Anatomy names sometimes embed a literal tag, e.g. "Container (<button>)" --
    // backtick it so a markdown renderer never mistakes it for real HTML.
    const name = (n) => (n.includes('<') ? n.replace(/<[^>]+>/g, (t) => `\`${t}\``) : `**${n}**`);
    parts.push(spec.anatomy.map((a) => `- ${name(a.name)}: ${a.description}`).join('\n') + '\n');
  }
  if (spec.props?.length) {
    parts.push('## Props\n');
    parts.push(mdTable(
      ['Prop', 'Type', 'Default', 'Description'],
      spec.props.map((p) => [`\`${p.name}\``, `\`${p.type}\``, p.default ?? '—', p.description]),
    ) + '\n');
  }
  if (spec.states?.length) {
    parts.push('## States\n');
    parts.push(spec.states.map((s) => `- **${s.state}**: ${s.description}`).join('\n') + '\n');
  }
  if (spec.doDont?.length) {
    parts.push('## Do / Don\'t\n');
    parts.push(spec.doDont.map((d) => `- Do: ${d.do}\n  Don't: ${d.dont}`).join('\n') + '\n');
  }
  if (spec.tokens?.length) {
    parts.push('## Tokens\n');
    parts.push(spec.tokens.map((t) => `- \`${t.name}\`${t.section ? ` (${t.section})` : ''}${t.description ? `: ${t.description}` : ''}`).join('\n') + '\n');
  }
  if (spec.notes) {
    parts.push('## Notes\n');
    parts.push(`${spec.notes}\n`);
  }
  return parts.join('\n');
}

rmSync(DOCS_OUT_DIR, { recursive: true, force: true });
mkdirSync(DOCS_OUT_DIR, { recursive: true });
for (const spec of COMPONENT_SPECS) {
  writeFileSync(join(DOCS_OUT_DIR, `${spec.slug}.md`), renderSpec(spec));
}
const missing = COMPONENTS.filter((c) => !COMPONENT_SPECS.some((s) => s.slug === c.slug)).map((c) => c.slug);
console.error(`[stage-assets] docs: rendered ${COMPONENT_SPECS.length}/${COMPONENTS.length} component specs -> .design-sync/.cache/docs/${missing.length ? ` (no spec yet: ${missing.join(', ')})` : ''}`);

// ── 3. Design guidelines, extracted from the public /docs/guidelines page ─
function stripBalancedBraces(s) {
  // {"literal"} -> literal (JSX whitespace fillers, e.g. {" "}); any other
  // {...} (map() calls, table row arrays, callout titles) is JS, not prose --
  // drop it as a unit rather than leaking half-rendered code into the doc.
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== '{') { out += s[i]; continue; }
    let depth = 1, j = i + 1;
    while (j < s.length && depth > 0) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}') depth--;
      j++;
    }
    const inner = s.slice(i + 1, j - 1).trim();
    const strLit = inner.match(/^["'`](.*)["'`]$/s);
    out += strLit ? strLit[1] : ' ';
    i = j - 1;
  }
  return out;
}

function extractDocsPageText(filePath) {
  const src = readFileSync(filePath, 'utf8');
  const retIdx = src.indexOf('return (');
  let jsx = retIdx >= 0 ? src.slice(retIdx + 'return ('.length) : src;
  jsx = jsx.replace(/<DocsSection\s+id="[^"]*"\s+title="([^"]*)">/g, '\n\n## $1\n\n');
  jsx = jsx.replace(/<DocsSubsection\s+id="[^"]*"\s+title="([^"]*)">/g, '\n\n### $1\n\n');
  jsx = jsx.replace(/<\/?DocsSection>/g, '\n');
  jsx = jsx.replace(/<\/?DocsSubsection>/g, '\n');
  jsx = jsx.replace(/<DocsCode>([\s\S]*?)<\/DocsCode>/g, (_, c) => '`' + c.replace(/<[^>]+>/g, '').trim() + '`');
  jsx = jsx.replace(/\{\/\*[\s\S]*?\*\/\}/g, ''); // JSX comments
  jsx = stripBalancedBraces(jsx);
  jsx = jsx.replace(/<[^>]+>/g, ' ');
  jsx = jsx
    .replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&')
    .replace(/&ldquo;|&rdquo;/g, '"').replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&nbsp;/g, ' ');
  jsx = jsx.replace(/[ \t]+/g, ' ');
  jsx = jsx.split('\n').map((l) => l.trim()).join('\n');
  return jsx.replace(/\n{3,}/g, '\n\n').trim();
}

const GUIDELINES_OUT_DIR = join(ROOT, '.design-sync/.cache/guidelines');
rmSync(GUIDELINES_OUT_DIR, { recursive: true, force: true });
mkdirSync(GUIDELINES_OUT_DIR, { recursive: true });
writeFileSync(
  join(GUIDELINES_OUT_DIR, 'design-guidelines.md'),
  extractDocsPageText(join(ROOT, 'app/docs/guidelines/page.tsx')),
);
console.error('[stage-assets] guidelines: extracted app/docs/guidelines/page.tsx -> .design-sync/.cache/guidelines/design-guidelines.md');
