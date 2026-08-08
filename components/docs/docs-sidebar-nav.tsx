"use client";

import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import type { SidebarGroup } from "@/components/ui/sidebar";
import { TOP_LINKS, CONTRIBUTOR_LINKS } from "@/lib/docs/nav-links";
import type { IconName } from "@/components/icon";

// One icon per TOP_LINKS/CONTRIBUTOR_LINKS entry -- kept here (not on the
// shared nav-links.ts data) since icon choice is a sidebar-presentation
// concern, not something docs-search.tsx's flat index also needs.
const ICONS: Record<string, IconName> = {
  "/docs": "home",
  "/docs/components": "layout-grid",
  "/docs/guidelines": "compass",
  "/docs/tokens": "sliders-horizontal",
  "/docs/scroll-mask": "layers",
  "/docs/settings": "settings",
  "/docs/contributing": "user",
};

// Groups mirror Apple Notes: an unlabelled leading group for the
// reader-facing pages, then a labelled group for contributor-only content
// -- same split docs-sidebar.tsx used to draw with a plain divider (see
// CLAUDE.local.md dogfooding + content-separation rule), now expressed as
// Sidebar's own SidebarGroup[] instead of a bespoke <div> layout. The
// per-component deep links this replaced live on /docs/components (a full
// browse grid) and in the search overlay instead of the persistent rail --
// a flat list of 30+ icon-less rows doesn't fit Sidebar's one-icon-per-row
// contract.
const GROUPS: SidebarGroup[] = [
  {
    items: TOP_LINKS.map((link) => ({
      value: link.href,
      icon: ICONS[link.href],
      label: link.label,
    })),
  },
  {
    label: "Contributing",
    items: CONTRIBUTOR_LINKS.map((link) => ({
      value: link.href,
      icon: ICONS[link.href],
      label: link.label,
    })),
  },
];

const ALL_HREFS = [...TOP_LINKS, ...CONTRIBUTOR_LINKS].map((link) => link.href);

// Longest-prefix match against every known href -- so /docs/components/badge
// (no sidebar row of its own) still highlights the "Components" row it was
// reached from, the same way the old DocsSidebar highlighted parent links
// via pathname comparison.
function activeHref(pathname: string): string {
  let best = "/docs";
  for (const href of ALL_HREFS) {
    if ((pathname === href || pathname.startsWith(`${href}/`)) && href.length > best.length) {
      best = href;
    }
  }
  return best;
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
