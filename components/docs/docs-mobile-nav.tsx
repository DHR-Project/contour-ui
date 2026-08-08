"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Dialog as RadixDialog, VisuallyHidden } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import { NavBar } from "@/components/ui/nav-bar";
import { springs } from "@/lib/motion";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { getComponent } from "@/lib/docs/component-registry";
import { DocsSidebarNav } from "./docs-sidebar-nav";
import { DocsSearch } from "./docs-search";

const COMPONENT_DETAIL_PATTERN = /^\/docs\/components\/([^/]+)$/;

// Compact-only top bar -- the real sidebar (docs-sidebar-rail.tsx) is
// hidden below `md` (SplitView's own contract), so this NavBar + drawer
// pair is the only way to reach docs navigation on mobile. Hand-rolled
// left-edge drawer (not the Sheet component -- Sheet is locked to the
// Bottom Sheet/Modal Adaptive Presentation, contour-spec-sheet-v2.md SS2)
// rather than a horizontal slide. NavBar is `sticky`, not `fixed`, so it
// takes up real space in flow instead of needing a manual top-padding
// offset on the page content below it.
export function DocsMobileNav() {
  const [navOpen, setNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const router = useRouter();
  const pathname = usePathname();
  const slideTransition = reducedMotion ? { duration: 0.15 } : springs.smooth;

  // Component detail pages are a push destination *under* /docs/components
  // (reached from its browse grid, from search, or from a category folder
  // in the sidebar) -- so on compact they get a Back leading action instead
  // of the hamburger, the same way the hamburger has no reason to
  // disappear on any of the top-level pages that don't have a parent to
  // go back to.
  const detailSlug = pathname.match(COMPONENT_DETAIL_PATTERN)?.[1];
  const detailComponent = detailSlug ? getComponent(detailSlug) : undefined;

  return (
    <>
      <div className="md:hidden">
        <NavBar
          title={detailComponent ? detailComponent.name : "Contour Docs"}
          // Fixed compact bar, not the iOS large-title collapse -- this is
          // a persistent app-shell header across every /docs/* page, not a
          // single scrollable screen's own title.
          largeTitleMode={false}
          leadingAction={
            detailComponent
              ? {
                  icon: "chevron-left",
                  label: "Back to Components",
                  onClick: () => router.push("/docs/components"),
                }
              : {
                  icon: "sidebar",
                  label: "Toggle navigation",
                  onClick: () => setNavOpen(true),
                }
          }
          trailingActions={[
            { icon: "search", label: "Search documentation", onClick: () => setSearchOpen(true) },
          ]}
        />
      </div>

      {/* Renders only the overlay -- its trigger button lives in NavBar's
          trailingActions above (DocsSearchProps' `open` contract). */}
      <DocsSearch open={searchOpen} onOpenChange={setSearchOpen} />

      <RadixDialog.Root open={navOpen} onOpenChange={setNavOpen}>
        <AnimatePresence>
          {navOpen && (
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
                  // Matches NavBar's own collapsed height (44px) plus the
                  // safe-area inset it pads itself with, so the drawer
                  // opens directly under the bar instead of overlapping it.
                  style={{ top: "calc(var(--safe-area-top) + 44px)" }}
                  className="md:hidden fixed left-0 bottom-0 z-(--z-overlay) w-[85%] max-w-[320px] bg-bg-primary border-r border-separator outline-none"
                >
                  <RadixDialog.Title asChild>
                    <VisuallyHidden.Root>
                      Documentation navigation
                    </VisuallyHidden.Root>
                  </RadixDialog.Title>
                  <DocsSidebarNav onNavigate={() => setNavOpen(false)} />
                </motion.div>
              </RadixDialog.Content>
            </RadixDialog.Portal>
          )}
        </AnimatePresence>
      </RadixDialog.Root>
    </>
  );
}
