"use client";

import { useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { durations } from "@/lib/motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { ListItemContent } from "@/components/ui/list";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

export type TabBarPosition = "bottom" | "top" | "sidebar";

export interface TabBarItem {
  icon: IconName;
  label: string;
  badge?: number;
  /** Defaults to `label` when omitted -- only needed if two items share a label. */
  value?: string;
}

export interface TabBarProps {
  items: TabBarItem[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

// Component-intrinsic, not a global token -- same treatment as NavBar's
// COLLAPSED_HEIGHT (contour-spec-navbar-tabbar-toolbar-v2.md SSA.2). Used
// for both the pill's own height and the blur band's height calc (SSB.2a).
const TOP_ROW_HEIGHT = 44;

const STORAGE_KEY = "contour-tabbar-layout";
// Native "storage" events only fire in OTHER tabs/windows, not the one that
// made the change -- this custom event covers same-tab updates so
// useSyncExternalStore re-reads right after toggleLayout writes.
const LAYOUT_CHANGE_EVENT = "contour-tabbar-layout-change";

function readStoredLayout(): "top" | "sidebar" {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "top" || stored === "sidebar" ? stored : "top";
}

function subscribeToStoredLayout(onChange: () => void) {
  window.addEventListener(LAYOUT_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(LAYOUT_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// "top" during SSR and the first client render (there's no localStorage on
// the server) -- useSyncExternalStore reconciles to the real client value
// right after hydration without a hand-rolled effect+setState.
function getServerLayoutSnapshot(): "top" | "sidebar" {
  return "top";
}

function itemValue(item: TabBarItem): string {
  return item.value ?? item.label;
}

// `overlay` (default) pins to the corner of a `position: relative` icon
// wrapper (bottom/top). `inline` renders as a plain pill instead -- used in
// the sidebar row's trailing slot, which has no icon to overlay and no
// `relative` wrapper (ListItemContent's trailing slot is a plain shrink-0
// div), so the absolute-positioned variant there was resolving against a
// distant ancestor and effectively vanishing.
function TabBadge({ count, variant = "overlay" }: { count: number; variant?: "overlay" | "inline" }) {
  return (
    <span
      className={cn(
        "flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white",
        variant === "overlay" && "absolute -right-1.5 -top-1.5",
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function TabBar({ items, value, onValueChange, className }: TabBarProps) {
  const sizeClass = useSizeClass();
  const reducedMotion = useReducedMotion();
  const isCompact = sizeClass === "compact";

  // "top" during SSR and the first client render (getServerLayoutSnapshot),
  // reconciling to the real localStorage value right after hydration --
  // same trade-off as dark mode's FOUC script (SS2.5) but without one
  // here, so a brief top->sidebar flash on load is accepted.
  const regularLayout = useSyncExternalStore(
    subscribeToStoredLayout,
    readStoredLayout,
    getServerLayoutSnapshot,
  );

  const position: TabBarPosition = isCompact ? "bottom" : regularLayout;

  const toggleLayout = () => {
    const next = regularLayout === "top" ? "sidebar" : "top";
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(LAYOUT_CHANGE_EVENT));
  };

  const fadeTransition = { duration: reducedMotion ? 0 : durations.normal };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {position === "bottom" && (
        <motion.nav
          key="bottom"
          aria-label="Tab Bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeTransition}
          // No overflow-hidden here: ProgressiveBlur is `absolute inset-0`
          // (backdrop-filter naturally clips to its own box, doesn't need
          // help) and this bar isn't rounded -- clipping was cutting off
          // each icon's corner-overlay badge instead.
          className={cn("relative pb-(--safe-area-bottom)", className)}
        >
          <ProgressiveBlur position="bottom" />
          <div role="tablist" className="relative z-10 flex items-stretch">
            {items.map((item) => {
              const active = itemValue(item) === value;
              return (
                <button
                  key={itemValue(item)}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onValueChange(itemValue(item))}
                  className="relative flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 py-(--space-1) focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]"
                >
                  <span className="relative">
                    <Icon
                      name={item.icon}
                      size="md"
                      style={active ? { color: "rgb(var(--tabbar-selection))" } : undefined}
                    />
                    {item.badge ? <TabBadge count={item.badge} /> : null}
                  </span>
                  <Text
                    as="span"
                    textStyle="caption-2"
                    weight={active ? "semibold" : "regular"}
                    color="secondary"
                    style={active ? { color: "rgb(var(--tabbar-selection))" } : undefined}
                  >
                    {item.label}
                  </Text>
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}

      {position === "top" && (
        // 2-layer floating pill (contour-spec-navbar-tabbar-toolbar-v2.md
        // SSB.2a): a full-width blur band underneath, independent of the
        // pill's own margin -- if the blur were clipped to the pill's
        // bounds, content scrolling through the margin gaps on either side
        // would stay perfectly sharp while content under the pill blurs, a
        // visibly "patched" look. `--material-thick` on the pill (denser
        // than the band's own blur) is what keeps it legible as a shape
        // rather than blending into the band.
        <motion.div
          key="top"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeTransition}
          className="sticky top-0 z-40 overflow-hidden"
          style={{ height: `calc(${TOP_ROW_HEIGHT}px + var(--space-4) * 2)` }}
        >
          <ProgressiveBlur position="top" />
          <nav
            aria-label="Tab Bar"
            className={cn(
              "relative m-(--space-4) flex items-center gap-(--space-1) rounded-full bg-(--material-thick) px-(--padding-control-x) shadow-md",
              className,
            )}
            style={{ height: TOP_ROW_HEIGHT }}
          >
            {/* min-w-0 is load-bearing: without it a flex child won't
                shrink below its content size, so overflowing items would
                grow the pill itself (and shove the toggle button out)
                instead of scrolling. Regular+ is pointer-driven, so items
                drop the 44px touch-target minimum here (same relaxation
                Button already applies via its own `md:min-h-0`). */}
            <div
              role="tablist"
              className="scroll-mask-x flex min-w-0 flex-1 items-center gap-(--space-1) overflow-x-auto"
            >
              {items.map((item) => {
                const active = itemValue(item) === value;
                return (
                  <button
                    key={itemValue(item)}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => onValueChange(itemValue(item))}
                    className="relative flex shrink-0 items-center gap-(--gap-icon-text) rounded-full px-(--space-3) py-(--space-2) focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]"
                  >
                    <span className="relative">
                      <Icon
                        name={item.icon}
                        size="sm"
                        style={active ? { color: "rgb(var(--tabbar-selection))" } : undefined}
                      />
                      {item.badge ? <TabBadge count={item.badge} /> : null}
                    </span>
                    <Text
                      as="span"
                      textStyle="footnote"
                      weight={active ? "semibold" : "regular"}
                      color="secondary"
                      style={active ? { color: "rgb(var(--tabbar-selection))" } : undefined}
                    >
                      {item.label}
                    </Text>
                  </button>
                );
              })}
            </div>
            <Button
              variant="plain"
              leadingIcon="sidebar"
              aria-label="Switch to sidebar"
              onClick={toggleLayout}
              className="shrink-0"
            />
          </nav>
        </motion.div>
      )}

      {position === "sidebar" && (
        <motion.nav
          key="sidebar"
          aria-label="Tab Bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fadeTransition}
          className={cn("flex flex-col", className)}
        >
          <div className="flex justify-end px-(--space-2) py-(--space-1)">
            <Button
              variant="plain"
              leadingIcon="sidebar"
              aria-label="Switch to top bar"
              onClick={toggleLayout}
            />
          </div>
          <div role="tablist" aria-orientation="vertical" className="flex flex-col">
            {items.map((item) => {
              const active = itemValue(item) === value;
              return (
                <button
                  key={itemValue(item)}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onValueChange(itemValue(item))}
                  className={cn(
                    "w-full px-(--padding-row-x) py-(--padding-row-y) text-left focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:-outline-offset-(--focus-ring-width) focus-visible:outline-[rgb(var(--focus-ring-color))]",
                    active && "bg-fill-tertiary",
                  )}
                >
                  <ListItemContent
                    leadingIcon={item.icon}
                    title={item.label}
                    trailing={item.badge ? <TabBadge count={item.badge} variant="inline" /> : undefined}
                  />
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
