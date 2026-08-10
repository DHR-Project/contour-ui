import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";

// ---------------------------------------------------------------------------
// DocsSection — titled section wrapper
// ---------------------------------------------------------------------------
interface DocsSectionProps {
  id?: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export function DocsSection({ id, title, children, className }: DocsSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-heading` : undefined}
      // scroll-mt clears the sticky compact top bar (docs-mobile-nav.tsx) so
      // TOC/deep-link jumps -- both native #hash and DocsToc's
      // scrollIntoView -- don't land the heading underneath it.
      className={cn("flex flex-col gap-(--space-4) scroll-mt-20", className)}
    >
      <Text as="h2" id={id ? `${id}-heading` : undefined} textStyle="title-3" weight="semibold">
        {title}
      </Text>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// DocsSubsection — rule-level heading inside a section
// ---------------------------------------------------------------------------
interface DocsSubsectionProps {
  id?: string;
  title: string;
  badge?: "recommended" | "hard-floor" | "required";
  children: ReactNode;
  className?: string;
}

export function DocsSubsection({ id, title, badge, children, className }: DocsSubsectionProps) {
  return (
    <div id={id} className={cn("flex flex-col gap-(--space-3) scroll-mt-20", className)}>
      <div className="flex items-center gap-(--space-2)">
        <Text as="h3" id={id ? `${id}-heading` : undefined} textStyle="headline" weight="semibold">
          {title}
        </Text>
        {badge && <DocsBadgeLevel level={badge} />}
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DocsBadgeLevel — "Recommended" vs "Hard floor" distinction per guideline
// TODO(docs): replace this hand-rolled pill with the Badge component
// (variant="status") once Badge has a real implementation -- it is
// currently spec-only, see /docs/components/badge.
// ---------------------------------------------------------------------------
interface DocsBadgeLevelProps {
  level: "recommended" | "hard-floor" | "required";
}

export function DocsBadgeLevel({ level }: DocsBadgeLevelProps) {
  const map = {
    recommended: {
      label: "Recommended",
      className: "bg-[rgb(var(--color-blue)/0.12)] text-[rgb(var(--color-blue))]",
    },
    "hard-floor": {
      label: "Hard floor",
      className: "bg-[rgb(var(--color-red)/0.12)] text-[rgb(var(--color-red))]",
    },
    required: {
      label: "Required",
      className: "bg-[rgb(var(--color-orange)/0.12)] text-[rgb(var(--color-orange))]",
    },
  };
  const { label, className } = map[level];
  return (
    <span
      className={cn(
        "inline-flex items-center px-(--space-2) py-0.5 rounded-full text-caption-1 font-semibold",
        className,
      )}
    >
      {label}
    </span>
  );
}

// ---------------------------------------------------------------------------
// DocsCallout — paragraph with left accent bar (note / warning)
// ---------------------------------------------------------------------------
interface DocsCalloutProps {
  kind?: "note" | "warning" | "tip";
  children: ReactNode;
}

export function DocsCallout({ kind = "note", children }: DocsCalloutProps) {
  const colorMap = {
    note: "border-[rgb(var(--color-blue))] bg-[rgb(var(--color-blue)/0.06)]",
    warning: "border-[rgb(var(--color-orange))] bg-[rgb(var(--color-orange)/0.06)]",
    tip: "border-[rgb(var(--color-green))] bg-[rgb(var(--color-green)/0.06)]",
  };
  return (
    <div
      role="note"
      className={cn(
        "border-l-2 px-(--space-4) py-(--space-3) rounded-r-md text-body text-label-secondary",
        colorMap[kind],
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DocsTable — prop/token table
// ---------------------------------------------------------------------------
interface DocsTableColumn {
  key: string;
  label: string;
  width?: string;
}

interface DocsTableProps {
  columns: DocsTableColumn[];
  rows: Record<string, ReactNode>[];
  caption?: string;
}

export function DocsTable({ columns, rows, caption }: DocsTableProps) {
  return (
    <div className="w-full overflow-x-auto rounded-md border border-separator">
      <table className="w-full text-footnote">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        <thead>
          <tr className="border-b border-separator bg-fill-quaternary">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="px-(--space-3) py-(--space-2) text-left text-caption-1 font-semibold text-label-secondary uppercase tracking-wide"
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-separator last:border-0 hover-fine:bg-fill-quaternary transition-colors duration-(--duration-fast)"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-(--space-3) py-(--space-2) text-label-primary align-top"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DocsCode — inline code
// ---------------------------------------------------------------------------
export function DocsCode({ children }: { children: ReactNode }) {
  return (
    <code className="px-(--space-1) py-px rounded bg-fill-secondary text-caption-1 font-mono text-[rgb(var(--color-pink))]">
      {children}
    </code>
  );
}

// ---------------------------------------------------------------------------
// DocsCodeBlock — block code (for CSS variables, snippets). Needs client-side
// state for the optional copy button, so it lives in its own "use client"
// file; re-exported here so existing import sites don't need to change.
// ---------------------------------------------------------------------------
export { DocsCodeBlock } from "./docs-code-block";
export type { DocsCodeBlockProps } from "./docs-code-block";

// ---------------------------------------------------------------------------
// DoDontPair — side-by-side Do / Don't examples (guideline §7.4)
// ---------------------------------------------------------------------------
interface DoDontPairProps {
  do: ReactNode;
  dont: ReactNode;
  doLabel?: string;
  dontLabel?: string;
}

export function DoDontPair({
  do: doContent,
  dont: dontContent,
  doLabel = "Do",
  dontLabel = "Don't",
}: DoDontPairProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-(--space-4)">
      {/* Do */}
      <div className="flex flex-col gap-(--space-2)">
        <div className="flex items-center gap-(--space-2)">
          <div className="w-3 h-3 rounded-full bg-[rgb(var(--color-green))]" aria-hidden="true" />
          <span className="text-caption-1 font-semibold text-[rgb(var(--color-green))] uppercase tracking-wide">
            {doLabel}
          </span>
        </div>
        <Card
          elevation="flat"
          padding="4"
          className="border-2 border-[rgb(var(--color-green)/0.4)] bg-[rgb(var(--color-green)/0.04)]"
        >
          {doContent}
        </Card>
      </div>

      {/* Don't */}
      <div className="flex flex-col gap-(--space-2)">
        <div className="flex items-center gap-(--space-2)">
          <div className="w-3 h-3 rounded-full bg-[rgb(var(--color-red))]" aria-hidden="true" />
          <span className="text-caption-1 font-semibold text-[rgb(var(--color-red))] uppercase tracking-wide">
            {dontLabel}
          </span>
        </div>
        <Card
          elevation="flat"
          padding="4"
          className="border-2 border-[rgb(var(--color-red)/0.4)] bg-[rgb(var(--color-red)/0.04)]"
        >
          {dontContent}
        </Card>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ComponentBadge — status badge for component pages
// TODO(docs): replace these hand-rolled pills with the Badge component
// (variant="status") once Badge has a real implementation -- it is
// currently spec-only, see /docs/components/badge.
// ---------------------------------------------------------------------------
interface ComponentBadgeProps {
  status: "complete" | "spec-only" | "deferred";
  deferredReason?: string;
}

export function ComponentStatusBadge({ status, deferredReason }: ComponentBadgeProps) {
  if (status === "complete") return null; // Complete components need no badge

  if (status === "deferred") {
    return (
      <span
        role="note"
        className="inline-flex items-center gap-(--space-1) px-(--space-3) py-(--space-1) rounded-full text-footnote font-medium bg-fill-secondary text-label-secondary border border-separator"
      >
        <span
          className="w-2 h-2 rounded-full bg-[rgb(var(--color-gray-3))]"
          aria-hidden="true"
        />
        {deferredReason ?? "Deferred"}
      </span>
    );
  }

  // spec-only
  return (
    <span
      role="note"
      className="inline-flex items-center gap-(--space-1) px-(--space-3) py-(--space-1) rounded-full text-footnote font-medium bg-[rgb(var(--color-orange)/0.12)] text-[rgb(var(--color-orange))] border border-[rgb(var(--color-orange)/0.3)]"
    >
      <span
        className="w-2 h-2 rounded-full bg-[rgb(var(--color-orange))]"
        aria-hidden="true"
      />
      Spec-only — no code yet
    </span>
  );
}

// ---------------------------------------------------------------------------
// TokenSwatch — small visual preview for color tokens
// ---------------------------------------------------------------------------
export function TokenSwatch({ value, name }: { value: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-(--space-2)">
      <span
        className="inline-block w-4 h-4 rounded border border-separator"
        style={{ background: value }}
        aria-hidden="true"
      />
      <code className="text-caption-1 font-mono text-label-secondary">{name}</code>
    </span>
  );
}
