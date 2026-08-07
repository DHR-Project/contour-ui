"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPONENTS, CATEGORIES } from "@/lib/docs/component-registry";
import { TOP_LINKS, CONTRIBUTOR_LINKS } from "@/lib/docs/nav-links";
import { cn } from "@/lib/utils/cn";
import { Flex } from "@/components/ui/flex";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { DocsSearch } from "./docs-search";

export interface DocsSidebarProps {
  className?: string;
  /** Called after a link is activated -- lets embedding contexts (e.g. the compact-nav Sheet) close themselves on navigation. */
  onNavigate?: () => void;
}

export function DocsSidebar({ className, onNavigate }: DocsSidebarProps = {}) {
  const pathname = usePathname();

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Search -- opens a centered overlay (docs-search.tsx) instead of an
          inline popover, so it's free to float above the whole page rather
          than being confined to the sidebar's own width and scroll bounds.
          Hidden below `md`: compact gets its own icon trigger in the top bar
          (docs-mobile-nav.tsx) instead, reachable without opening this
          drawer first. */}
      <div className="hidden md:block shrink-0 px-(--space-4) pt-(--space-6) pb-(--space-4)">
        <DocsSearch onNavigate={onNavigate} />
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
