"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { springs, durations } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { TextField } from "@/components/ui/text-field";
import { ListItemContent } from "@/components/ui/list";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { Button } from "../button";

export interface SearchFieldResult {
  id: string;
  label: string;
  icon?: IconName;
  /** Forwarded to ListItemContent's own subtitle slot (e.g. a category label). */
  subtitle?: string;
}

export interface SearchFieldProps {
  value: string;
  onValueChange: (value: string) => void;
  /** Debounced (debounceMs) after the last keystroke. */
  onSearch?: (value: string) => void;
  /** Cancel = auto clear + blur, then this callback -- one combined gesture, not a plain click. */
  onCancel?: () => void;
  placeholder?: string;
  debounceMs?: number;
  autoFocus?: boolean;

  // Popover results -- built-in optional (contour-spec-search-field.md SS5).
  // undefined = popover stays closed even while focused; [] = "no results".
  results?: SearchFieldResult[];
  onResultSelect?: (id: string) => void;
  loading?: boolean;
  emptyMessage?: string;
  /** Which side of the field the results popover opens toward. Default "below" (SS5). "above" is for callers that dock the field near the bottom of the viewport (e.g. a compact-mode search sheet), where there's no room to open downward. */
  resultsPlacement?: "below" | "above";

  className?: string;
  id?: string;
  "aria-label"?: string;
}

// Container open/close mirrors Dropdown's actual shipped radius (--radius-lg,
// the concentric-nesting result -- see components/ui/dropdown/dropdown.tsx
// comment) rather than the --popover-radius token literally; that's what
// "consistent with Dropdown" resolves to once Dropdown's own code is the
// source of truth instead of its spec text.
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

// "Content swap" pattern (contour-spec-search-field.md SS5b) -- exiting
// content doesn't bounce, entering content does; per-variant `transition`
// lets AnimatePresence apply each independently.
const contentVariants = {
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: durations.fast },
  },
  enter: { opacity: 0, filter: "blur(4px)", scale: 0.96 },
  center: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: springs.bouncy,
  },
};

export function SearchField({
  value,
  onValueChange,
  onSearch,
  onCancel,
  placeholder = "Search",
  debounceMs = 300,
  autoFocus,
  results,
  onResultSelect,
  loading = false,
  emptyMessage = "No results found",
  resultsPlacement = "below",
  className,
  id,
  "aria-label": ariaLabel,
}: SearchFieldProps) {
  const [focused, setFocused] = useState(false);
  // Escape closes the popover without blurring the field (SS5d) -- separate
  // from `focused` so the field's own focus ring/Cancel button don't react.
  const [dismissed, setDismissed] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const reducedMotion = useReducedMotion();

  // Measures the Cancel button's own (static) rendered width once, so its
  // enter/exit can be animated as a real numeric `width` tween instead of
  // relying on layout/FLIP -- see the width-jump note at the render below.
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [cancelWidth, setCancelWidth] = useState(0);
  useLayoutEffect(() => {
    if (cancelRef.current)
      setCancelWidth(cancelRef.current.getBoundingClientRect().width);
  }, []);

  const generatedId = useId();
  const listboxId = `searchfield-listbox-${generatedId}`;
  const highlightLayoutId = `searchfield-highlight-${generatedId}`;

  const showPopover =
    focused && !dismissed && (loading || results !== undefined);
  const hasResults = results !== undefined && results.length > 0;
  const contentKey = loading
    ? "loading"
    : !results
      ? "none"
      : results.length === 0
        ? "empty"
        : `results:${results.map((r) => r.id).join(",")}`;

  // Reset the highlight whenever the result set itself changes shape (new
  // search, cleared field) -- an index from the previous list would point at
  // the wrong row otherwise. Adjusted during render (React's documented
  // pattern for "reset state when a prop changes") rather than in an effect,
  // since a synchronous setState in an effect body triggers a cascading
  // re-render for no benefit here (see roadmap-v2.md's set-state-in-effect note).
  const [prevResults, setPrevResults] = useState(results);
  if (results !== prevResults) {
    setPrevResults(results);
    if (highlightedIndex !== null) setHighlightedIndex(null);
  }

  useEffect(() => {
    if (!onSearch) return;
    debounceRef.current = setTimeout(() => onSearch(value), debounceMs);
    return () => clearTimeout(debounceRef.current);
  }, [value, debounceMs, onSearch]);

  // Caps the popover at the real available space instead of a flat 60vh:
  // on mobile browsers, `vh` reflects the layout viewport, which does not shrink
  // when the on-screen keyboard covers part of the screen, so a field docked
  // near the bottom (resultsPlacement="above") would let the popover grow up
  // past the top of what's actually visible. `visualViewport` tracks the
  // keyboard-shrunk area, and getBoundingClientRect() is visual-viewport-
  // relative in modern browsers, so this stays correct as the keyboard
  // opens/closes.
  const [maxPopoverHeight, setMaxPopoverHeight] = useState<number | undefined>(
    undefined,
  );
  useEffect(() => {
    if (!showPopover) return;

    const gap = 8; // matches the --space-2 gap between the field and popover
    const margin = 16; // breathing room so the popover never touches the screen edge

    function recompute() {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const viewportHeight =
        window.visualViewport?.height ?? window.innerHeight;
      const available =
        resultsPlacement === "above"
          ? rect.top - gap - margin
          : viewportHeight - rect.bottom - gap - margin;
      setMaxPopoverHeight(
        Math.max(0, Math.min(available, viewportHeight * 0.6)),
      );
    }

    recompute();
    window.visualViewport?.addEventListener("resize", recompute);
    window.visualViewport?.addEventListener("scroll", recompute);
    window.addEventListener("resize", recompute);
    return () => {
      window.visualViewport?.removeEventListener("resize", recompute);
      window.visualViewport?.removeEventListener("scroll", recompute);
      window.removeEventListener("resize", recompute);
    };
  }, [showPopover, resultsPlacement]);

  function handleValueChange(next: string) {
    setDismissed(false);
    onValueChange(next);
  }

  function handleFocus() {
    setFocused(true);
    setDismissed(false);
  }

  function handleBlur() {
    setFocused(false);
  }

  function handleClear() {
    onValueChange("");
    inputRef.current?.focus();
  }

  function handleCancel() {
    onValueChange("");
    inputRef.current?.blur();
    onCancel?.();
  }

  function selectResult(index: number) {
    if (!results || !results[index]) return;
    onResultSelect?.(results[index].id);
    setHighlightedIndex(null);
  }

  function runImmediateSearch() {
    clearTimeout(debounceRef.current);
    onSearch?.(value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      if (showPopover) {
        event.preventDefault();
        setDismissed(true);
        setHighlightedIndex(null);
      }
      return;
    }

    if (!hasResults) {
      if (event.key === "Enter") runImmediateSearch();
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev === null || prev === results!.length - 1 ? 0 : prev + 1,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightedIndex((prev) =>
          prev === null || prev === 0 ? results!.length - 1 : prev - 1,
        );
        break;
      case "Enter":
        if (highlightedIndex === null) {
          runImmediateSearch();
        } else {
          event.preventDefault();
          selectResult(highlightedIndex);
        }
        break;
    }
  }

  const containerTransition = reducedMotion ? { duration: 0 } : springs.snappy;

  const cancelTransition = reducedMotion ? { duration: 0 } : springs.smooth;

  // Cancel lives beside the field only while there's no popover to hold it --
  // once results/loading/empty is showing, it moves into the popover's own
  // sticky header instead (see the popover render below) so it doesn't sit
  // apart from the content it's dismissing.
  const showFieldCancel = focused && !showPopover;

  return (
    // `relative` here (not just around the field) so the popover below can
    // span the full row -- field + gap + Cancel -- instead of just the
    // field's own (shrunk-when-focused) width.
    <div
      ref={containerRef}
      className={cn("relative flex items-center gap-(--space-2)", className)}
    >
      <div className="min-w-0 flex-1">
        <TextField
          ref={inputRef}
          id={id}
          value={value}
          onValueChange={handleValueChange}
          placeholder={placeholder}
          leadingIcon="search"
          trailingIcon={value.length > 0 ? "close" : undefined}
          onTrailingIconClick={value.length > 0 ? handleClear : undefined}
          trailingIconLabel="Clear"
          rounded="full"
          type="search"
          autoFocus={autoFocus}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-label={ariaLabel ?? placeholder}
          role="combobox"
          aria-expanded={showPopover}
          aria-controls={listboxId}
          aria-activedescendant={
            highlightedIndex !== null
              ? `${listboxId}-option-${highlightedIndex}`
              : undefined
          }
        />
      </div>

      {/* Always mounted (not AnimatePresence-toggled) so its box is there to
          measure -- `width` is tweened between 0 and that measured value
          every frame, which is what makes the field's reclaimed space move
          in step with it instead of snapping the instant Cancel mounts. */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: showFieldCancel ? cancelWidth : 0 }}
        transition={cancelTransition}
        className="shrink-0 overflow-hidden"
      >
        <motion.button
          ref={cancelRef}
          type="button"
          onClick={handleCancel}
          tabIndex={showFieldCancel ? 0 : -1}
          aria-hidden={!showFieldCancel}
          initial={{ opacity: 0 }}
          animate={{ opacity: showFieldCancel ? 1 : 0 }}
          transition={cancelTransition}
          className="whitespace-nowrap text-subheadline font-medium text-tint"
        >
          Cancel
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {showPopover && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={containerTransition}
            // max-h + overflow-y-auto: fits on screen with its own scroll
            // rather than running off it when there are many results.
            // max-h-[60vh] is the design-intended soft cap; maxPopoverHeight
            // (once measured) further clamps it to the real available space,
            // which matters on mobile browsers where the keyboard shrinks the
            // visible area without shrinking `vh` -- see the effect above.
            // contour-material (tokens.css SS2.3a): frosted glass, not a
            // flat panel, matching every other floating surface.
            style={
              maxPopoverHeight !== undefined
                ? { maxHeight: maxPopoverHeight }
                : undefined
            }
            className={cn(
              "absolute left-0 right-0 z-(--z-dropdown) max-h-[60vh] overflow-x-hidden overflow-y-auto rounded-lg ring-1 ring-separator contour-material shadow-md",
              resultsPlacement === "above"
                ? "bottom-[calc(100%+var(--space-2))]"
                : "top-[calc(100%+var(--space-2))]",
            )}
          >
            {/* Cancel's popover-open home (see showFieldCancel above) --
                sticky so it stays reachable while the results list scrolls
                underneath it; needs its own material background + z-index so
                scrolled rows pass behind it instead of painting over it. */}
            <div className="sticky top-0 z-10 flex items-center justify-end rounded-t-lg border-b border-separator contour-material px-(--space-3) py-(--space-2)">
              <Button size="sm" variant="plain" onClick={handleCancel}>
                Cancel
              </Button>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={contentKey}
                variants={contentVariants}
                initial={reducedMotion ? "center" : "enter"}
                animate="center"
                exit={reducedMotion ? "center" : "exit"}
              >
                {loading ? (
                  <div className="flex items-center justify-center p-(--space-6)">
                    {/* Progress isn't implemented yet (spec-only) -- same
                        spinner+animate-spin fallback Button uses for its
                        own loading state. */}
                    <Icon
                      name="spinner"
                      size="md"
                      className="animate-spin text-label-secondary"
                    />
                  </div>
                ) : !results ? null : results.length === 0 ? (
                  <div className="p-(--space-4)">
                    <Text textStyle="footnote" color="secondary">
                      {emptyMessage}
                    </Text>
                  </div>
                ) : (
                  <div role="listbox" id={listboxId} className="p-1.5">
                    {results.map((result, index) => (
                      <div
                        key={result.id}
                        id={`${listboxId}-option-${index}`}
                        role="option"
                        aria-selected={highlightedIndex === index}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        onClick={() => selectResult(index)}
                        className="relative flex cursor-default items-center rounded-sm px-(--menu-item-padding-sides) py-(--menu-item-padding-y)"
                      >
                        {highlightedIndex === index && (
                          <motion.div
                            layoutId={highlightLayoutId}
                            transition={springs.smooth}
                            className="absolute inset-0 rounded-sm bg-fill-quaternary"
                          />
                        )}
                        <ListItemContent
                          leadingIcon={result.icon}
                          title={result.label}
                          subtitle={result.subtitle}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
