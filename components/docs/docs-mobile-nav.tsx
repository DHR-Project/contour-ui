"use client";

import { useState } from "react";
import { Dialog as RadixDialog, VisuallyHidden } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { DocsSidebar } from "./docs-sidebar";
import { DocsSearch } from "./docs-search";

// Compact-only top bar -- the real sidebar (docs-sidebar.tsx) is hidden
// below `md`, so this is the only way to reach docs navigation on mobile.
// Hand-rolled left-edge drawer (not the Sheet component -- Sheet is locked
// to the Bottom Sheet/Modal Adaptive Presentation, contour-spec-sheet-v2.md
// SS2) rather than a horizontal slide. Both the bar and the drawer are
// `z-(--z-overlay)`+ so the drawer never sits under the fixed top bar --
// it opens below it (`top-14`, matching the bar's own height) instead of
// overlapping it.
export function DocsMobileNav() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const slideTransition = reducedMotion ? { duration: 0.15 } : springs.smooth;

  return (
    <>
      <div className="md:hidden fixed top-0 inset-x-0 z-(--z-sticky) h-14 flex items-center gap-(--space-3) bg-(--material-regular) backdrop-blur-lg border-b border-separator px-(--page-margin)">
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
              <RadixDialog.Content asChild forceMount aria-describedby={undefined}>
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={slideTransition}
                  className="md:hidden fixed left-0 top-14 bottom-0 z-(--z-overlay) w-[85%] max-w-[320px] bg-bg-primary border-r border-separator outline-none"
                >
                  <RadixDialog.Title asChild>
                    <VisuallyHidden.Root>Documentation navigation</VisuallyHidden.Root>
                  </RadixDialog.Title>
                  <DocsSidebar onNavigate={() => setOpen(false)} />
                </motion.div>
              </RadixDialog.Content>
            </RadixDialog.Portal>
          )}
        </AnimatePresence>
      </RadixDialog.Root>
    </>
  );
}
