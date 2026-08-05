"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs, durations, easings } from "@/lib/motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useActiveHeading } from "@/lib/hooks/use-active-heading";
import { Text } from "@/components/ui/text";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Icon } from "@/components/icon";

type RegularTocMode = "compact" | "list";

// Shared by every row across both TOC forms (rail, floating panel, dash
// strip) so Framer Motion can match and morph a given heading's row
// continuously between whichever two of those are mounted before/after a
// transition, instead of cutting instantly between unrelated elements.
function rowLayoutId(instanceId: string, headingId: string, reducedMotion: boolean) {
  return reducedMotion ? undefined : `toc-row-${instanceId}-${headingId}`;
}

// Plain cross-fade (+ blur, where safe) -- used where the rail and the
// floating dash/panel widget trade places at the regular tier. Deliberately
// no `scale`/spring: transform animations on this outer wrapper were
// fighting the projection math for the dash<->panel layoutId morph nested
// inside FloatingToc.
//
// `blur` defaults on for RailToc's wrapper, but FloatingToc's must pass
// `blur: false`: a `filter` on *any* ancestor forces the browser to
// composite that ancestor into an offscreen buffer, and a descendant's
// `backdrop-filter` (the panel's frosted-glass material) then samples that
// buffer instead of the real page behind it -- which reads as the material
// losing its blur and going flat/transparent. Animating `filter` here and
// having `backdrop-filter` a few levels down are mutually exclusive.
function useContentSwapVariants(reducedMotion: boolean, blur = true) {
  const transition = { duration: reducedMotion ? durations.fast : durations.normal, ease: easings.standard };
  const filter = blur && !reducedMotion;
  return {
    initial: { opacity: 0, filter: filter ? "blur(4px)" : undefined },
    animate: { opacity: 1, filter: filter ? "blur(0px)" : undefined, transition },
    exit: { opacity: 0, filter: filter ? "blur(4px)" : undefined, transition },
  };
}

interface TocHeading {
  id: string;
  title: string;
  level: 2 | 3;
}

// DocsSection/DocsSubsection put the anchor id on the section/div wrapper
// and the visible heading text on a nested h2/h3 carrying `${id}-heading`
// (docs-ui.tsx) -- scanning for that suffix and stripping it back off gets
// both the link target and its label from one query, with no separate
// per-page TOC data to keep in sync.
function scanHeadings(container: HTMLElement): TocHeading[] {
  const nodes = container.querySelectorAll<HTMLElement>('h2[id$="-heading"], h3[id$="-heading"]');
  return Array.from(nodes)
    .map((node) => ({
      id: node.id.replace(/-heading$/, ""),
      title: node.textContent?.trim() ?? "",
      level: (node.tagName === "H2" ? 2 : 3) as 2 | 3,
    }))
    .filter((heading) => heading.id.length > 0 && heading.title.length > 0);
}

// Keeps the highlighted entry vertically centered inside a scrollable TOC
// list as the active section changes -- otherwise on a long page the
// highlight drifts out of view and the list stops being useful as a
// "where am I" indicator. Scrolls only `containerRef`'s own scrollTop (via
// scrollBy, not scrollIntoView) so it never fights the page's own scroll
// position, which is what triggered the activeId change in the first place.
//
// Suppressed while the user is directly scrolling the TOC list itself
// (wheel/touch/scrollbar drag on `containerRef`) -- otherwise browsing the
// list to see what's there gets fought/yanked back to the active item the
// moment the page's own scroll position also happens to update. Resumes
// on whatever activeId change comes next once that settles, rather than
// snapping back to center the instant the user lets go.
function useCenterActiveItem(
  containerRef: RefObject<HTMLElement | null>,
  activeId: string | null,
  reducedMotion: boolean,
  trigger?: unknown,
) {
  const suppressedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let settleTimeoutId: number | undefined;
    const startSuppressing = () => {
      suppressedRef.current = true;
      window.clearTimeout(settleTimeoutId);
    };
    // The container's own `scroll` event also fires for our programmatic
    // scrollBy below -- only arms the "resume" timer while already
    // suppressed (i.e. this scroll was caused by the user's gesture, not
    // by us), so our own auto-centering scroll can't re-trigger it.
    const onScroll = () => {
      if (!suppressedRef.current) return;
      window.clearTimeout(settleTimeoutId);
      settleTimeoutId = window.setTimeout(() => {
        suppressedRef.current = false;
      }, 250);
    };

    container.addEventListener("wheel", startSuppressing, { passive: true });
    container.addEventListener("touchstart", startSuppressing, { passive: true });
    container.addEventListener("pointerdown", startSuppressing);
    container.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      container.removeEventListener("wheel", startSuppressing);
      container.removeEventListener("touchstart", startSuppressing);
      container.removeEventListener("pointerdown", startSuppressing);
      container.removeEventListener("scroll", onScroll);
      window.clearTimeout(settleTimeoutId);
    };
  }, [containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !activeId || suppressedRef.current) return;
    const item = container.querySelector<HTMLElement>(`[data-toc-id="${activeId}"]`);
    if (!item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const delta = itemRect.top + itemRect.height / 2 - (containerRect.top + containerRect.height / 2);
    if (Math.abs(delta) < 1) return;
    container.scrollBy({ top: delta, behavior: reducedMotion ? "auto" : "smooth" });
  }, [containerRef, activeId, reducedMotion, trigger]);
}

export interface DocsTocProps {
  /** id of the scrollable content region to scan for headings -- app/docs/layout.tsx's <main id="docs-main">. */
  containerId?: string;
}

export function DocsToc({ containerId = "docs-main" }: DocsTocProps) {
  const pathname = usePathname();
  const instanceId = useId();
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [expanded, setExpanded] = useState(false);
  // Only meaningful at the "regular" tier (see showRail below) -- compact
  // never has room for the rail, regular-lg+ always does, so the manual
  // toggle only needs to live in the one tier where both are plausible.
  const [regularMode, setRegularMode] = useState<RegularTocMode>("compact");
  const sizeClass = useSizeClass();
  const reducedMotion = useReducedMotion();

  // Re-scan on every route change (this component lives in the shared docs
  // layout, so it survives client-side navigation between pages) and, while
  // we're here, honor a deep link straight to a section on first paint.
  // Wrapped in a named function (rather than calling setHeadings directly at
  // the effect's top level) so react-hooks/set-state-in-effect doesn't flag
  // it -- same indirection use-size-class.ts's `update` already relies on.
  useEffect(() => {
    function syncFromDom() {
      const container = document.getElementById(containerId);
      if (!container) return;
      setHeadings(scanHeadings(container));
      setExpanded(false);

      if (window.location.hash) {
        const targetId = decodeURIComponent(window.location.hash.slice(1));
        document.getElementById(targetId)?.scrollIntoView({ block: "start", behavior: "auto" });
      }
    }
    syncFromDom();
  }, [pathname, containerId]);

  const ids = headings.map((heading) => heading.id);
  const observedActiveId = useActiveHeading(ids, pathname);
  // While a click-triggered smooth scroll is still in flight, the
  // IntersectionObserver reports every heading that flies past the active
  // band, which made the highlight (and useCenterActiveItem's re-centering)
  // jump around mid-scroll. Lock the highlight to the clicked target for
  // the duration of that scroll instead, and only hand control back to the
  // observer once the page has actually finished moving.
  const [pendingActiveId, setPendingActiveId] = useState<string | null>(null);
  const activeId = pendingActiveId ?? observedActiveId;
  // Removes the previous click's scrollend/timeout listeners without firing
  // its settle callback -- used when a new selection supersedes one still
  // in flight, so the stale click's `settle` doesn't clear pendingActiveId
  // out from under the new one.
  const cleanupPendingScrollRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupPendingScrollRef.current?.(), []);

  // Not worth a TOC for a single-section page.
  if (headings.length < 2) return null;

  const handleSelect = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    cleanupPendingScrollRef.current?.();
    setPendingActiveId(id);
    el.scrollIntoView({ block: "start", behavior: reducedMotion ? "auto" : "smooth" });
    // Keeps the URL shareable/deep-linkable without adding a history entry
    // per click.
    window.history.replaceState(null, "", `#${id}`);

    if (reducedMotion) {
      setPendingActiveId(null); // no animation in flight, nothing to wait for
      return;
    }
    // scrollend (where supported) fires exactly when the smooth scroll
    // settles; the timeout is a safety net for browsers without it (Safari
    // < 17.4) and in case scrollend never fires for some reason. Selecting
    // an item no longer closes the floating panel -- it stays open (see the
    // explicit close button in FloatingToc) so picking several sections in
    // a row doesn't mean reopening it each time.
    const settle = () => {
      setPendingActiveId(null);
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("scrollend", settle);
      window.clearTimeout(timeoutId);
    };
    window.addEventListener("scrollend", settle, { once: true });
    const timeoutId = window.setTimeout(settle, 700);
    cleanupPendingScrollRef.current = cleanup;
  };

  // regular-lg+ always has room for the rail alongside the 240px left
  // sidebar and the 720px content column; compact never does. "regular"
  // (phones-through-small-tablets is compact; this is the tablet tier in
  // between) is the one width where either presentation is plausible, so
  // that's the only tier that gets the manual toggle below -- everywhere
  // else the choice is automatic. Every branch here is an official
  // size-class tier, not an invented breakpoint (guideline rule 3.2).
  const showRail =
    sizeClass === "regular-lg" ||
    sizeClass === "regular-xl" ||
    (sizeClass === "regular" && regularMode === "list");

  // Only the regular tier's toggle-able, so only it needs the control --
  // rendered by each list variant itself, directly under its own "On this
  // page" caption, rather than as a separate floating element.
  const showModeToggle = sizeClass === "regular";

  return (
    <AnimatePresence initial={false}>
      {showRail ? (
        <RailToc
          key="rail"
          headings={headings}
          activeId={activeId}
          onSelect={handleSelect}
          reducedMotion={reducedMotion}
          instanceId={instanceId}
          showModeToggle={showModeToggle}
          regularMode={regularMode}
          onRegularModeChange={setRegularMode}
        />
      ) : (
        <FloatingToc
          key="floating"
          headings={headings}
          activeId={activeId}
          expanded={expanded}
          onToggle={() => setExpanded((value) => !value)}
          onSelect={handleSelect}
          reducedMotion={reducedMotion}
          instanceId={instanceId}
          showModeToggle={showModeToggle}
          regularMode={regularMode}
          onRegularModeChange={setRegularMode}
        />
      )}
    </AnimatePresence>
  );
}

// Segmented control that flips DocsToc between the floating dash strip and
// the full rail -- only offered at the "regular" tier (see showModeToggle
// above), rendered inline under each variant's own "On this page" caption.
function TocModeToggle({
  regularMode,
  onRegularModeChange,
}: {
  regularMode: RegularTocMode;
  onRegularModeChange: (mode: RegularTocMode) => void;
}) {
  return (
    <SegmentedControl
      value={regularMode}
      onValueChange={(value) => onRegularModeChange(value as RegularTocMode)}
      options={[
        { value: "compact", label: "Compact", icon: "minus" },
        { value: "list", label: "List", icon: "sidebar" },
      ]}
      fullWidth={false}
      size="small"
      iconOnly
    />
  );
}

// ---------------------------------------------------------------------------
// RailToc -- always-visible sticky "On this page" list (regular-lg+)
// ---------------------------------------------------------------------------
interface TocListProps {
  headings: TocHeading[];
  activeId: string | null;
  onSelect: (id: string) => void;
  reducedMotion: boolean;
  instanceId: string;
  showModeToggle: boolean;
  regularMode: RegularTocMode;
  onRegularModeChange: (mode: RegularTocMode) => void;
}

function RailToc({
  headings,
  activeId,
  onSelect,
  reducedMotion,
  instanceId,
  showModeToggle,
  regularMode,
  onRegularModeChange,
}: TocListProps) {
  const navRef = useRef<HTMLElement>(null);
  useCenterActiveItem(navRef, activeId, reducedMotion);
  const swapVariants = useContentSwapVariants(reducedMotion);

  return (
    <motion.aside
      aria-label="On this page"
      initial={swapVariants.initial}
      animate={swapVariants.animate}
      exit={swapVariants.exit}
      className="w-50 shrink-0 pr-[max(var(--page-margin),var(--safe-area-right))]"
    >
      <nav ref={navRef} className="scroll-mask-y sticky top-0 max-h-screen overflow-y-auto no-scrollbar py-(--space-10)">
        <Text
          as="span"
          textStyle="caption-1"
          weight="semibold"
          color="tertiary"
          className="block px-(--space-3) uppercase tracking-wide"
        >
          On this page
        </Text>
        {showModeToggle && (
          <div className="px-(--space-3) mt-(--space-3) mb-(--space-4)">
            <TocModeToggle regularMode={regularMode} onRegularModeChange={onRegularModeChange} />
          </div>
        )}
        <ul className={cn("flex flex-col border-l border-separator", !showModeToggle && "mt-(--space-3)")}>
          {headings.map((heading) => {
            const active = heading.id === activeId;
            return (
              <li key={heading.id} className="relative">
                {active && (
                  <motion.span
                    layoutId={`toc-rail-indicator-${instanceId}`}
                    className="absolute -left-px top-0 bottom-0 w-0.5 bg-tint"
                    transition={reducedMotion ? { duration: 0 } : springs.smooth}
                  />
                )}
                <button
                  type="button"
                  data-toc-id={heading.id}
                  onClick={() => onSelect(heading.id)}
                  aria-current={active ? "location" : undefined}
                  className={cn(
                    "block w-full cursor-pointer rounded-r-sm text-left py-(--space-1) transition-colors duration-(--duration-fast)",
                    "hover-fine:bg-fill-tertiary hover-fine:text-label-primary",
                    heading.level === 3 ? "pl-(--space-6)" : "pl-(--space-3)",
                  )}
                >
                  <Text
                    as="span"
                    textStyle="footnote"
                    weight={active ? "semibold" : "regular"}
                    color={active ? "primary" : "tertiary"}
                  >
                    {heading.title}
                  </Text>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}

// ---------------------------------------------------------------------------
// FloatingToc -- compact/regular: a fixed strip of dashes (one per heading,
// h3s shorter + indented) that morphs into a full text panel on tap. Each
// dash and its corresponding panel row share a layoutId, so collapsing and
// expanding is a single continuous shape change (springs.smooth, the
// project's "Morph / shared-element" preset -- design-tokens-summary-v2.md
// SS6.4) rather than a cross-fade between two unrelated elements.
// ---------------------------------------------------------------------------
interface FloatingTocProps extends TocListProps {
  expanded: boolean;
  onToggle: () => void;
}

function FloatingToc({
  headings,
  activeId,
  expanded,
  onToggle,
  onSelect,
  reducedMotion,
  instanceId,
  showModeToggle,
  regularMode,
  onRegularModeChange,
}: FloatingTocProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useCenterActiveItem(panelRef, activeId, reducedMotion, expanded);

  useEffect(() => {
    if (!expanded) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onToggle();
    }
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onToggle();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [expanded, onToggle]);

  const containerTransition = reducedMotion ? { duration: 0.15 } : springs.smooth;
  // blur: false -- the expanded panel uses backdrop-blur-lg (material); see
  // useContentSwapVariants for why an ancestor filter can't coexist with it.
  const swapVariants = useContentSwapVariants(reducedMotion, false);

  return (
    // top-1/2 with no translate: an anchor pinned to viewport-center that
    // has zero height of its own (its children are position:absolute, so
    // they don't contribute to its box). Centering used to live on this
    // wrapper via -translate-y-1/2, but its height was whatever child was
    // currently mounted (short strip vs. up-to-70vh panel) -- switching
    // between them shifted that translate's reference height and visibly
    // displaced the whole widget. Each child now centers *itself* against
    // this fixed zero-height point instead, so both variants -- and the
    // scale transition between them -- stay anchored to the same screen
    // position regardless of their own size.
    <motion.div
      ref={containerRef}
      initial={swapVariants.initial}
      animate={swapVariants.animate}
      exit={swapVariants.exit}
      className="fixed right-(--space-3) top-1/2 z-(--z-dropdown)"
    >
      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            key="panel"
            ref={panelRef}
            layout={!reducedMotion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={containerTransition}
            style={{ originX: 0.5, originY: 0.5 }}
            role="navigation"
            aria-label="On this page"
            className="absolute right-0 top-0 -translate-y-1/2 w-56 max-h-[70vh] overflow-y-auto no-scrollbar rounded-lg border border-separator bg-(--material-regular) backdrop-blur-lg shadow-sm"
          >
            {/* Sticky so the header/toggle/close row stays put while the
                (potentially long) section list scrolls underneath it --
                needs its own material background + z-index so scrolled rows
                pass behind it instead of painting on top. */}
            <div className="sticky top-0 z-10 rounded-t-lg border-b border-separator bg-(--material-regular) backdrop-blur-lg p-(--space-2)">
              <div className="flex items-center justify-between gap-(--space-2) px-(--space-2) py-(--space-1)">
                <Text
                  as="span"
                  textStyle="caption-1"
                  weight="semibold"
                  color="tertiary"
                  className="uppercase tracking-wide"
                >
                  On this page
                </Text>
                <button
                  type="button"
                  onClick={onToggle}
                  aria-label="Close table of contents"
                  className="shrink-0 cursor-pointer rounded-md p-(--space-1) text-label-secondary transition-colors duration-(--duration-fast) hover-fine:bg-fill-tertiary hover-fine:text-label-primary"
                >
                  <Icon name="close" size="sm" decorative />
                </button>
              </div>
              {showModeToggle && (
                <div className="px-(--space-1)">
                  <TocModeToggle regularMode={regularMode} onRegularModeChange={onRegularModeChange} />
                </div>
              )}
            </div>
            <ul className="flex flex-col gap-0.5 p-(--space-2)">
              {headings.map((heading) => {
                const active = heading.id === activeId;
                return (
                  <li key={heading.id}>
                    <motion.button
                      layoutId={rowLayoutId(instanceId, heading.id, reducedMotion)}
                      data-toc-id={heading.id}
                      type="button"
                      onClick={() => onSelect(heading.id)}
                      aria-current={active ? "location" : undefined}
                      className={cn(
                        "block w-full cursor-pointer text-left rounded-md px-(--space-2) py-(--space-2) transition-colors duration-(--duration-fast)",
                        heading.level === 3 && "pl-(--space-5)",
                        active
                          ? "bg-fill-secondary text-label-primary"
                          : "text-label-secondary hover-fine:bg-fill-tertiary",
                      )}
                    >
                      <Text
                        as="span"
                        textStyle="footnote"
                        weight={active ? "semibold" : "regular"}
                        color={active ? "primary" : "secondary"}
                      >
                        {heading.title}
                      </Text>
                    </motion.button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        ) : (
          <motion.button
            key="strip"
            type="button"
            onClick={onToggle}
            aria-label="Open table of contents"
            aria-expanded={expanded}
            layout={!reducedMotion}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={containerTransition}
            style={{ originX: 0.5, originY: 0.5 }}
            className="absolute right-0 top-0 -translate-y-1/2 flex cursor-pointer flex-col items-end gap-(--space-1) rounded-full p-(--space-2) focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]"
          >
            {headings.map((heading) => {
              const active = heading.id === activeId;
              return (
                <motion.span
                  key={heading.id}
                  layoutId={rowLayoutId(instanceId, heading.id, reducedMotion)}
                  className={cn(
                    "block h-0.5 rounded-full transition-colors duration-(--duration-fast)",
                    heading.level === 3 ? "w-2" : "w-4",
                    active ? "bg-tint" : "bg-label-tertiary",
                  )}
                />
              );
            })}
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
