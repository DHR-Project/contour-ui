"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useWindowFocus } from "@/lib/hooks/use-window-focus";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { ListItemContent } from "@/components/ui/list";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";

export interface SidebarItem {
  /** Matches a route segment -- supplied by SplitView, not internal state. */
  value: string;
  /** Optional -- a flat app-shell list (Mail's Home/Search/Alerts) reads better with one icon per row, but a long content list (e.g. a component registry) rarely has a meaningful icon per leaf and just indents instead. */
  icon?: IconName;
  label: string;
  badge?: number;
}

// A labelled run of items -- Apple Notes' "iCloud" / "On My Mac" folder
// groups. `label` is optional so a leading, unlabelled group (Notes' pinned
// block) is expressible too.
export interface SidebarGroup {
  label?: string;
  items: SidebarItem[];
  /** Adds a disclosure toggle to the group header so its items can collapse -- Apple Notes' expandable folders. Ignored (no-op) when `label` is omitted, since there'd be nothing to click. */
  collapsible?: boolean;
  /** Initial expanded state for a collapsible group. Default true. Ignored if the group contains the active `value` at mount -- that group always starts open so the current page's row is never hidden. */
  defaultOpen?: boolean;
}

function isGroupedItems(items: SidebarItem[] | SidebarGroup[]): items is SidebarGroup[] {
  return items.length > 0 && "items" in items[0];
}

function groupKey(group: SidebarGroup, index: number): string {
  return group.label ?? `group-${index}`;
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

// Presentational, fully controlled for selection -- no router calls
// (contour-spec-sidebar.md SS1). Which *groups* are expanded is the one bit
// of state this component does own (SS1a): it's pure disclosure UI, not
// navigation, so lifting it to the caller would just be ceremony.
export function Sidebar({ items, value, onValueChange, className }: SidebarProps) {
  // Scopes the shared-element layoutId to this instance, same reasoning
  // as SegmentedControl's pill -- a literal id would morph the selection
  // background between unrelated Sidebars on the same page.
  const selectionLayoutId = `sidebar-selection-${useId()}`;
  const reducedMotion = useReducedMotion();
  const windowFocused = useWindowFocus();
  const selectionTransition = reducedMotion ? { duration: 0 } : springs.smooth;
  const collapseTransition = reducedMotion ? { duration: 0 } : springs.smooth;

  // Ungrouped input becomes a single unlabelled group -- same tree shape as
  // the grouped case below, just with its header suppressed, so there's one
  // rendering path instead of two.
  const groups: SidebarGroup[] = isGroupedItems(items) ? items : [{ items }];

  function initialOpenGroups(): Set<string> {
    const open = new Set<string>();
    groups.forEach((group, index) => {
      if (!group.collapsible) return;
      const containsActive = group.items.some((item) => item.value === value);
      if (containsActive || (group.defaultOpen ?? true)) open.add(groupKey(group, index));
    });
    return open;
  }

  const [openGroups, setOpenGroups] = useState<Set<string>>(initialOpenGroups);

  // Reveals a collapsed group's active row when `value` changes to one of
  // its items -- e.g. search or a direct link lands somewhere its group was
  // never expanded for. Adjusting state during render (not a useEffect,
  // which would set state a frame late and re-render twice) per React's own
  // "you might not need an effect" guidance: comparing against a mirrored
  // previous value, guarded so it only fires once per actual `value`
  // change. Only ever adds a key, so a group the reader deliberately
  // collapsed stays collapsed across renders that don't change `value`.
  const [trackedValue, setTrackedValue] = useState(value);
  if (value !== trackedValue) {
    setTrackedValue(value);
    const owner = groups.find((group) => group.items.some((item) => item.value === value));
    if (owner?.collapsible) {
      const key = groupKey(owner, groups.indexOf(owner));
      setOpenGroups((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
    }
  }

  function toggleGroup(key: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

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
        {groups.map((group, groupIndex) => {
          const key = groupKey(group, groupIndex);
          const isOpen = !group.collapsible || openGroups.has(key);

          return (
            <div key={key} className="flex flex-col gap-(--space-1)">
              {group.label &&
                (group.collapsible ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-(--space-2) rounded-md px-(--padding-row-x) pt-(--space-2) pb-(--space-1) text-left hover:bg-fill-quaternary focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:-outline-offset-(--focus-ring-width) focus-visible:outline-[rgb(var(--focus-ring-color))]"
                  >
                    <Text
                      as="span"
                      textStyle="caption-1"
                      weight="semibold"
                      color="tertiary"
                      className="uppercase tracking-wide"
                    >
                      {group.label}
                    </Text>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={collapseTransition}
                      className="shrink-0 text-label-tertiary"
                      aria-hidden
                    >
                      <Icon name="chevron-right" size="xs" />
                    </motion.span>
                  </button>
                ) : (
                  <Text
                    as="span"
                    textStyle="caption-1"
                    weight="semibold"
                    color="tertiary"
                    className="px-(--padding-row-x) pt-(--space-2) pb-(--space-1) uppercase tracking-wide"
                  >
                    {group.label}
                  </Text>
                ))}

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="items"
                    initial={group.collapsible ? { height: 0, opacity: 0 } : false}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={collapseTransition}
                    className="flex flex-col gap-(--space-1) overflow-hidden"
                  >
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
                                windowFocused
                                  ? "bg-[rgb(var(--sidebar-bg-active))]"
                                  : "bg-[rgb(var(--sidebar-bg-inactive))]",
                              )}
                            />
                          )}
                          <div className={cn("relative z-10", !item.icon && "pl-(--space-1)")}>
                            <ListItemContent
                              leadingIcon={item.icon}
                              title={item.label}
                              trailing={item.badge ? <Badge count={item.badge} /> : undefined}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
