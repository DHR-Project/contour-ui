"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog as RadixDialog, VisuallyHidden } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { COMPONENTS } from "@/lib/docs/component-registry";
import { TOP_LINKS, CONTRIBUTOR_LINKS } from "@/lib/docs/nav-links";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { SearchField } from "@/components/ui/search-field";
import type { SearchFieldResult } from "@/components/ui/search-field";
import { ProgressiveBlur } from "../ui/progressive-blur";

// Flat index across every link the sidebar renders -- pages plus the full
// component registry -- so the search modal can jump to any of them, not
// just components.
const SEARCH_INDEX: { href: string; label: string; subtitle: string }[] = [
  ...TOP_LINKS.map((link) => ({
    href: link.href,
    label: link.label,
    subtitle: "Page",
  })),
  ...CONTRIBUTOR_LINKS.map((link) => ({
    href: link.href,
    label: link.label,
    subtitle: "Page",
  })),
  ...COMPONENTS.map((c) => ({
    href: `/docs/components/${c.slug}`,
    label: c.name,
    subtitle: "Component",
  })),
];

export interface DocsSearchProps {
  className?: string;
  /** "field" (default) is the full idle-state SearchField look-alike used in the desktop sidebar. "icon" is a compact icon-only trigger for the compact top bar (docs-mobile-nav.tsx), which has no room for the full pill + placeholder text. Ignored when `open` is passed -- see below. */
  variant?: "field" | "icon";
  /** Called after a result is selected -- lets embedding contexts (e.g. the compact-nav Sheet's DocsSidebarNav) close themselves on navigation. */
  onNavigate?: () => void;
  /** Controlled open state -- omit to let the component render its own trigger and manage `open` itself (default). Pass both when the trigger lives elsewhere, e.g. NavBar's trailingActions in docs-mobile-nav.tsx: this component then renders only the overlay, driven by the caller's own button. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Opens a centered overlay search field rather than docking inline -- the
// fixed-position card floats above the whole page so its results popover
// has room to grow without being clipped by a scroll container. Regular+
// floats it in the upper third of the viewport (contour-spec-search-
// field.md SS2's pill shape, just elevated); compact docks it to the
// bottom edge instead (reachable one-handed, and matches the mobile
// address-bar-at-the-bottom convention) with results opening upward.
export function DocsSearch({
  className,
  variant = "field",
  onNavigate,
  open: controlledOpen,
  onOpenChange,
}: DocsSearchProps = {}) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const isCompact = useSizeClass() === "compact";
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? (next: boolean) => onOpenChange?.(next) : setInternalOpen;
  const [query, setQuery] = useState("");

  // undefined => popover stays closed (SearchField contract); only switch to
  // a real (possibly empty) array once there's something to search for.
  const results: SearchFieldResult[] | undefined = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return undefined;
    return SEARCH_INDEX.filter((entry) =>
      entry.label.toLowerCase().includes(normalized),
    ).map((entry) => ({
      id: entry.href,
      label: entry.label,
      subtitle: entry.subtitle,
    }));
  }, [query]);

  function handleClose() {
    setOpen(false);
    setQuery("");
  }

  function handleResultSelect(href: string) {
    handleClose();
    router.push(href);
    onNavigate?.();
  }

  return (
    <>
      {isControlled ? null : variant === "icon" ? (
        <Button
          variant="plain"
          size="sm"
          leadingIcon="search"
          aria-label="Search documentation"
          onClick={() => setOpen(true)}
          className={className}
        />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Search documentation"
          className={cn(
            "flex w-full items-center gap-(--gap-icon-text) rounded-full border border-separator bg-bg-primary px-(--padding-control-x) py-(--padding-control-y) text-left transition-colors duration-(--duration-fast) hover-fine:border-tint",
            className,
          )}
        >
          <Icon
            name="search"
            size="sm"
            className="shrink-0 text-label-secondary"
          />
          <Text
            as="span"
            textStyle="body"
            color="tertiary"
            className="flex-1 truncate"
          >
            Search docs
          </Text>
        </button>
      )}

      <RadixDialog.Root
        open={open}
        onOpenChange={(next) => (next ? setOpen(true) : handleClose())}
      >
        <AnimatePresence>
          {open && (
            <RadixDialog.Portal forceMount>
              <RadixDialog.Overlay asChild forceMount>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.15 : 0.2 }}
                  className="fixed inset-0 z-(--z-overlay) bg-overlay-default"
                />
              </RadixDialog.Overlay>

              <motion.div
                aria-hidden
                className={cn(
                  "pointer-events-none fixed inset-x-0 z-(--z-overlay) h-[20vh]",
                  isCompact ? "bottom-0" : "top-0",
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reducedMotion ? 0.15 : 0.2,
                  delay: reducedMotion ? 0 : 0.1,
                }}
              >
                <ProgressiveBlur position={isCompact ? "bottom" : "top"} />
              </motion.div>

              <RadixDialog.Content
                asChild
                forceMount
                aria-describedby={undefined}
              >
                <motion.div
                  initial={
                    isCompact
                      ? { opacity: 0, y: 24 }
                      : { opacity: 0, scale: 0.96, y: -8 }
                  }
                  animate={
                    isCompact
                      ? { opacity: 1, y: 0 }
                      : { opacity: 1, scale: 1, y: 0 }
                  }
                  exit={
                    isCompact
                      ? { opacity: 0, y: 24 }
                      : { opacity: 0, scale: 0.96, y: -8 }
                  }
                  transition={
                    reducedMotion ? { duration: 0.15 } : springs.smooth
                  }
                  className={cn(
                    "fixed inset-x-0 z-(--z-overlay) mx-auto w-[min(560px,calc(100%-var(--space-4)*2))] outline-none",
                    isCompact
                      ? "bottom-0 pb-[max(var(--space-4),var(--safe-area-bottom))]"
                      : "top-[2vh]",
                  )}
                >
                  <RadixDialog.Title asChild>
                    <VisuallyHidden.Root>
                      Search documentation
                    </VisuallyHidden.Root>
                  </RadixDialog.Title>
                  <SearchField
                    value={query}
                    onValueChange={setQuery}
                    results={results}
                    onResultSelect={handleResultSelect}
                    onCancel={handleClose}
                    resultsPlacement={isCompact ? "above" : "below"}
                    placeholder="Search docs"
                    aria-label="Search documentation"
                    autoFocus
                  />
                </motion.div>
              </RadixDialog.Content>
            </RadixDialog.Portal>
          )}
        </AnimatePresence>
      </RadixDialog.Root>
    </>
  );
}
