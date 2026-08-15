"use client";

import { useState } from "react";
import { Dialog as RadixDialog, VisuallyHidden } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useReduceTransparency } from "@/lib/hooks/use-reduce-transparency";
import { DocsSidebarNav } from "./docs-sidebar-nav";
import { DocsSearch } from "./docs-search";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { cn } from "@/lib/utils";

// Compact-only top bar -- the real sidebar (docs-sidebar-rail.tsx) is
// hidden below `md`, so this is the only way to reach docs navigation on
// mobile. Drawer renders the same DocsSidebarNav as the desktop rail, so
// the nav content itself never diverges by size-class, only its container
// does (persistent rail vs. a hamburger-triggered Sheet). `sticky` (not
// `fixed`) so the bar takes up real space in flow instead of needing a
// manual top-padding offset on the page content below it. Hand-rolled
// left-edge drawer (not the Sheet component -- Sheet is locked to the
// Bottom Sheet/Modal Adaptive Presentation, contour-spec-sheet-v2.md SS2)
// rather than a horizontal slide.
export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const reduceTransparency = useReduceTransparency();
  const slideTransition = reducedMotion ? { duration: 0.15 } : springs.smooth;

  return (
    <>
      <div className="md:hidden sticky top-0 z-(--z-sticky)">
        <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-14")}>
          <ProgressiveBlur position="top" />
        </div>
        <div
          className={cn(
            "relative h-14 flex items-center gap-(--space-3) px-(--page-margin) z-10",
            reduceTransparency && "border-b border-separator",
          )}
        >
          <Button
            variant="plain"
            size="sm"
            leadingIcon="sidebar"
            aria-label="Toggle navigation"
            onClick={() => setOpen(true)}
          />
          <Text textStyle="headline" weight="semibold" className="flex-1">
            Contour Docs
          </Text>
          <DocsSearch variant="icon" />
        </div>
      </div>

      <RadixDialog.Root open={open} onOpenChange={setOpen}>
        <AnimatePresence>
          {open && (
            <RadixDialog.Portal forceMount>
              <RadixDialog.Overlay asChild forceMount>
                <motion.div
                  className="md:hidden fixed inset-0 z-(--z-overlay) bg-overlay-default"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0.15 : 0.2 }}
                />
              </RadixDialog.Overlay>
              <RadixDialog.Content
                asChild
                forceMount
                aria-describedby={undefined}
              >
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={slideTransition}
                  className="md:hidden fixed left-0 top-14 bottom-0 z-(--z-overlay) w-[85%] max-w-[320px] bg-bg-primary border-r border-separator outline-none"
                >
                  <RadixDialog.Title asChild>
                    <VisuallyHidden.Root>
                      Documentation navigation
                    </VisuallyHidden.Root>
                  </RadixDialog.Title>
                  <DocsSidebarNav onNavigate={() => setOpen(false)} />
                </motion.div>
              </RadixDialog.Content>
            </RadixDialog.Portal>
          )}
        </AnimatePresence>
      </RadixDialog.Root>
    </>
  );
}
