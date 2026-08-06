"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { COMPONENTS, CATEGORIES } from "@/lib/docs/component-registry";
import { cn } from "@/lib/utils/cn";
import { Flex } from "@/components/ui/flex";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { SearchField } from "@/components/ui/search-field";
import type { SearchFieldResult } from "@/components/ui/search-field";

const TOP_LINKS = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/guidelines", label: "Guidelines" },
  { href: "/docs/tokens", label: "Tokens" },
  { href: "/docs/scroll-mask", label: "Scroll Mask" },
  { href: "/docs/settings", label: "Settings" },
];

// Separate from TOP_LINKS -- contributor/process content, kept visually
// distinct from the reader-facing docs links above it (see /docs/contributing).
const CONTRIBUTOR_LINKS = [{ href: "/docs/contributing", label: "Contributing" }];

// Flat index across every link the sidebar renders -- pages plus the full
// component registry -- so the search box at the top can jump to any of
// them, not just components.
const SEARCH_INDEX: { href: string; label: string; subtitle: string }[] = [
  ...TOP_LINKS.map((link) => ({ href: link.href, label: link.label, subtitle: "Page" })),
  ...CONTRIBUTOR_LINKS.map((link) => ({ href: link.href, label: link.label, subtitle: "Page" })),
  ...COMPONENTS.map((c) => ({
    href: `/docs/components/${c.slug}`,
    label: c.name,
    subtitle: "Component",
  })),
];

export interface DocsSidebarProps {
  className?: string;
  /** Called after a link is activated -- lets embedding contexts (e.g. the compact-nav Sheet) close themselves on navigation. */
  onNavigate?: () => void;
}

export function DocsSidebar({ className, onNavigate }: DocsSidebarProps = {}) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  // undefined => popover stays closed (SearchField contract); only switch to
  // a real (possibly empty) array once there's something to search for.
  const results: SearchFieldResult[] | undefined = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return undefined;
    return SEARCH_INDEX.filter((entry) => entry.label.toLowerCase().includes(normalized)).map((entry) => ({
      id: entry.href,
      label: entry.label,
      subtitle: entry.subtitle,
    }));
  }, [query]);

  function handleResultSelect(href: string) {
    setQuery("");
    router.push(href);
    onNavigate?.();
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search -- kept outside the scrolling/masked <nav> below: its results
          popover is a descendant, and an ancestor with mask-image (from
          scroll-mask-y) isolates a new backdrop root, breaking the popover's
          own backdrop-blur (it can no longer sample real page content). */}
      <div className="shrink-0 px-(--space-4) pt-(--space-6) pb-(--space-4)">
        <SearchField
          value={query}
          onValueChange={setQuery}
          results={results}
          onResultSelect={handleResultSelect}
          placeholder="Search docs"
          aria-label="Search documentation"
        />
      </div>

      <nav
        aria-label="Documentation navigation"
        className="scroll-mask-y flex-1 min-h-0 overflow-y-auto no-scrollbar px-(--space-4) pb-(--space-6)"
      >
        {/* Top-level links */}
        <Flex as="ul" direction="column" gap="1" className="mb-(--space-6)">
          {TOP_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "block px-(--space-3) py-(--space-2) rounded-md text-subheadline font-medium transition-colors duration-(--duration-fast)",
                    isActive
                      ? "bg-fill-secondary text-label-primary"
                      : "text-label-secondary hover-fine:bg-fill-tertiary hover-fine:text-label-primary",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </Flex>

        {/* Divider */}
        <div
          className="h-px bg-separator mb-(--space-6)"
          role="separator"
          aria-hidden="true"
        />

        {/* Components section */}
        <VStack gap="5">
          <Text
            as="span"
            textStyle="caption-1"
            weight="semibold"
            color="secondary"
            className="px-(--space-3) uppercase tracking-wide"
          >
            Components
          </Text>

          {CATEGORIES.map((cat) => {
            const items = COMPONENTS.filter((c) => c.category === cat.id);
            if (items.length === 0) return null;
            return (
              <div key={cat.id}>
                <Text
                  as="span"
                  textStyle="caption-2"
                  weight="semibold"
                  color="tertiary"
                  className="block px-(--space-3) mb-(--space-1) uppercase tracking-wide"
                >
                  {cat.label}
                </Text>
                <Flex as="ul" direction="column" gap="1">
                  {items.map((comp) => {
                    const href = `/docs/components/${comp.slug}`;
                    const isActive = pathname === href;
                    return (
                      <li key={comp.slug}>
                        <Link
                          href={href}
                          onClick={onNavigate}
                          className={cn(
                            "flex items-center justify-between gap-(--space-2) px-(--space-3) py-(--space-1) rounded-md text-footnote transition-colors duration-(--duration-fast)",
                            isActive
                              ? "bg-fill-secondary text-label-primary font-medium"
                              : "text-label-secondary hover-fine:bg-fill-tertiary hover-fine:text-label-primary",
                          )}
                        >
                          <span>{comp.name}</span>
                          {comp.status === "spec-only" && (
                            <span
                              aria-label="Spec only, no code yet"
                              className="shrink-0 inline-block w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-orange))]"
                            />
                          )}
                          {comp.status === "deferred" && (
                            <span
                              aria-label="Deferred"
                              className="shrink-0 inline-block w-1.5 h-1.5 rounded-full bg-[rgb(var(--color-gray-3))]"
                            />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </Flex>
              </div>
            );
          })}
        </VStack>

        {/* Divider */}
        <div
          className="h-px bg-separator my-(--space-6)"
          role="separator"
          aria-hidden="true"
        />

        {/* Contributor-only links -- deliberately separated from the reader-facing
          links above (see CLAUDE.local.md dogfooding + content-separation rule). */}
        <Flex as="ul" direction="column" gap="1">
          {CONTRIBUTOR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "block px-(--space-3) py-(--space-2) rounded-md text-caption-1 font-medium transition-colors duration-(--duration-fast)",
                    isActive
                      ? "bg-fill-secondary text-label-primary"
                      : "text-label-tertiary hover-fine:bg-fill-tertiary hover-fine:text-label-secondary",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </Flex>
      </nav>
    </div>
  );
}
