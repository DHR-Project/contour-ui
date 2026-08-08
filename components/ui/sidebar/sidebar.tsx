"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useWindowFocus } from "@/lib/hooks/use-window-focus";
import type { IconName } from "@/components/icon";
import { ListItemContent } from "@/components/ui/list";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

export interface SidebarItem {
  /** Matches a route segment -- supplied by SplitView, not internal state. */
  value: string;
  icon: IconName;
  label: string;
  badge?: number;
}

// A labelled run of items -- Apple Notes' "iCloud" / "On My Mac" folder
// groups. `label` is optional so a leading, unlabelled group (Notes' pinned
// block) is expressible too.
export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  /** A flat list for a single-level sidebar, or an array of labelled groups for a sectioned one (contour-spec-sidebar.md SS1a). Both share one selection pill and one keyboard/tab sequence. */
  items: SidebarItem[] | SidebarGroup[];
  /** Currently active segment -- controlled, comes from SplitView. */
  value: string;
  /** Navigation itself (router.push) happens at the SplitView level, not here. */
  onValueChange: (value: string) => void;
  className?: string;
}

function isGroupedItems(items: SidebarItem[] | SidebarGroup[]): items is SidebarGroup[] {
  return items.length > 0 && "items" in items[0];
}

// Presentational, fully controlled -- no internal active state, no
// router calls (contour-spec-sidebar.md SS1). Canonical content for
// SplitView's `sidebar` slot, which owns the fixed positioning and
// column width (SS5); this component only renders what goes inside it.
export function Sidebar({ items, value, onValueChange, className }: SidebarProps) {
  // Scopes the shared-element layoutId to this instance, same reasoning
  // as SegmentedControl's pill -- a literal id would morph the selection
  // background between unrelated Sidebars on the same page.
  const selectionLayoutId = `sidebar-selection-${useId()}`;
  const reducedMotion = useReducedMotion();
  const windowFocused = useWindowFocus();
  const selectionTransition = reducedMotion ? { duration: 0 } : springs.smooth;

  // Ungrouped input becomes a single unlabelled group -- same tree shape as
  // the grouped case below, just with its header suppressed, so there's one
  // rendering path instead of two.
  const groups: SidebarGroup[] = isGroupedItems(items) ? items : [{ items }];

  return (
    <nav
      aria-label="Sidebar"
      // Uniform material (SS2.3) rather than ProgressiveBlur: SS2.10 lists
      // Sidebar in scope, but that mechanism adapts blur to *vertical*
      // scroll velocity of the nearest scrollable ancestor -- the wrong
      // axis here, since content passing under Sidebar would scroll
      // horizontally (contour-spec-splitview-v2.md SS2a's full-bleed
      // content). Revisit once a real horizontal-scroll consumer
      // (Carousel, not yet in the roadmap) exists to adapt to.
      className={cn("flex h-full flex-col overflow-y-auto no-scrollbar bg-(--material-thick)", className)}
    >
      <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-(--space-4) p-(--space-2)">
        {groups.map((group, groupIndex) => (
          <div key={group.label ?? groupIndex} className="flex flex-col gap-(--space-1)">
            {group.label && (
              <Text
                as="span"
                textStyle="caption-1"
                weight="semibold"
                color="tertiary"
                className="px-(--padding-row-x) pt-(--space-2) pb-(--space-1) uppercase tracking-wide"
              >
                {group.label}
              </Text>
            )}
            {group.items.map((item) => {
              const selected = item.value === value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  data-selected={selected}
                  onClick={() => onValueChange(item.value)}
                  className={cn(
                    "relative w-full rounded-md px-(--padding-row-x) py-(--padding-row-y) text-left",
                    "focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:-outline-offset-(--focus-ring-width) focus-visible:outline-[rgb(var(--focus-ring-color))]",
                    !selected && "hover:bg-fill-quaternary",
                  )}
                >
                  {selected && (
                    <motion.div
                      layoutId={selectionLayoutId}
                      transition={selectionTransition}
                      aria-hidden
                      // Row-selection state (contour-spec-sidebar.md SS3,
                      // phuong an A): active background dims when the
                      // window/tab loses focus, macOS Mail/Finder convention.
                      className={cn(
                        "absolute inset-0 rounded-md",
                        windowFocused ? "bg-[rgb(var(--sidebar-bg-active))]" : "bg-[rgb(var(--sidebar-bg-inactive))]",
                      )}
                    />
                  )}
                  <div className="relative z-10">
                    <ListItemContent
                      leadingIcon={item.icon}
                      title={item.label}
                      trailing={item.badge ? <Badge count={item.badge} /> : undefined}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </nav>
  );
}
