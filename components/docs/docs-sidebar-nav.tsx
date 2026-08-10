"use client";

import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import type { SidebarGroup } from "@/components/ui/sidebar";
import { TOP_LINKS, CONTRIBUTOR_LINKS } from "@/lib/docs/nav-links";
import { COMPONENTS, CATEGORIES } from "@/lib/docs/component-registry";
import type { IconName } from "@/components/icon";

// One icon per TOP_LINKS/CONTRIBUTOR_LINKS entry -- kept here (not on the
// shared nav-links.ts data) since icon choice is a sidebar-presentation
// concern, not something docs-search.tsx's flat index also needs. The 30+
// individual component rows below deliberately have no icon: Sidebar's
// `icon` is optional exactly for this case, a long content list where a
// meaningful per-row icon doesn't exist (what glyph means "Badge" vs
// "Divider"?) -- they indent instead of pretending to have one.
const ICONS: Record<string, IconName> = {
  "/docs": "home",
  "/docs/guidelines": "compass",
  "/docs/tokens": "sliders-horizontal",
  "/docs/scroll-mask": "layers",
  "/docs/settings": "settings",
  "/docs/contributing": "user",
};

function componentHref(slug: string): string {
  return `/docs/components/${slug}`;
}

// Groups mirror standard native patterns: an unlabelled leading group for the
// reader-facing pages, then one collapsible folder per component category
// (collapsed by default -- Sidebar auto-opens whichever one holds the
// active page), then a labelled group for contributor-only content (see
// CLAUDE.local.md dogfooding + content-separation rule).
const GROUPS: SidebarGroup[] = [
  {
    items: TOP_LINKS.map((link) => ({
      value: link.href,
      icon: ICONS[link.href],
      label: link.label,
    })),
  },
  ...CATEGORIES.map(
    (category): SidebarGroup => ({
      label: category.label,
      collapsible: true,
      defaultOpen: false,
      items: COMPONENTS.filter((c) => c.category === category.id).map((c) => ({
        value: componentHref(c.slug),
        label: c.name,
      })),
    }),
  ).filter((group) => group.items.length > 0),
  {
    label: "Contributing",
    items: CONTRIBUTOR_LINKS.map((link) => ({
      value: link.href,
      icon: ICONS[link.href],
      label: link.label,
    })),
  },
];

const ALL_HREFS = new Set([
  ...TOP_LINKS.map((link) => link.href),
  ...CONTRIBUTOR_LINKS.map((link) => link.href),
  ...COMPONENTS.map((c) => componentHref(c.slug)),
]);

// Every real docs route now has its own sidebar row (component detail
// pages included), so this is a plain membership check -- no more
// longest-prefix guessing needed for pages that don't have a row of their
// own.
function activeHref(pathname: string): string {
  return ALL_HREFS.has(pathname) ? pathname : "";
}

export interface DocsSidebarNavProps {
  /** Called after a row navigates -- lets embedding contexts (e.g. the compact-nav Sheet) close themselves. */
  onNavigate?: () => void;
  className?: string;
}

export function DocsSidebarNav({ onNavigate, className }: DocsSidebarNavProps = {}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Sidebar
      items={GROUPS}
      value={activeHref(pathname)}
      onValueChange={(href) => {
        router.push(href);
        onNavigate?.();
      }}
      className={className}
    />
  );
}
