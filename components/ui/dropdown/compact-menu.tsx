"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { ReactNode, RefObject } from "react";
import { springs } from "@/lib/motion";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { ListItemContent } from "@/components/ui/list";
import { DragHighlight, itemClassName } from "./menu-core";
import type { DropdownItemDef, MenuAdapter, SubmenuRenderer } from "./menu-core";

interface StackFrame {
  label: string;
  items: DropdownItemDef[];
}

interface UseMenuStackOptions {
  items: DropdownItemDef[];
  containerRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
}

// compact-only (SSA.4): stack push/pop with a Back row instead of Radix's
// flyout cascade -- shared by Dropdown and ContextMenu so both get the same
// screen-stack behavior (including the scroll-to-top-before-push below)
// without either hand-rolling its own copy.
export function useMenuStack({ items, containerRef, reducedMotion }: UseMenuStackOptions) {
  const [stack, setStack] = useState<StackFrame[]>([]);
  const [direction, setDirection] = useState<"push" | "pop">("push");

  const currentFrame = stack[stack.length - 1];
  const currentItems = currentFrame ? currentFrame.items : items;

  // If the tapped submenu row sits below the fold (the content scrolled
  // down to reach it), snap the scroll position back to the top first --
  // otherwise the incoming screen would slide in already scrolled, hiding
  // its own top rows. The push only starts once the scroll settles.
  function pushSubmenu(label: string, subItems: DropdownItemDef[]) {
    const container = containerRef.current;
    const openSubmenu = () => {
      setDirection("push");
      setStack((previous) => [...previous, { label, items: subItems }]);
    };

    if (!container || container.scrollTop <= 0) {
      openSubmenu();
      return;
    }

    if (reducedMotion) {
      container.scrollTop = 0;
      openSubmenu();
      return;
    }

    container.scrollTo({ top: 0, behavior: "smooth" });
    // Frame-counted safety net (not a wall-clock timer) so this never
    // depends on an impure time read: ~500ms at 60fps in case the browser
    // never actually settles scrollTop back to exactly 0.
    const MAX_FRAMES = 30;
    let frame = 0;
    const waitForScrollTop = () => {
      frame += 1;
      if (container.scrollTop <= 0 || frame >= MAX_FRAMES) {
        openSubmenu();
        return;
      }
      requestAnimationFrame(waitForScrollTop);
    };
    requestAnimationFrame(waitForScrollTop);
  }

  function popSubmenu() {
    setDirection("pop");
    setStack((previous) => previous.slice(0, -1));
  }

  function reset() {
    setStack([]);
  }

  return { currentFrame, currentItems, stackLength: stack.length, direction, pushSubmenu, popSubmenu, reset };
}

// Direction-aware slide (contour-spec-dropdown-v2.md SSA.4): entering
// submenu comes from the right and settles at center; the retreating parent
// eases back to -30%/40% opacity instead of disappearing, signaling "still
// there." Reversed on Back. `custom` must be set on both AnimatePresence and
// the motion.div: AnimatePresence forwards it to the exiting element (which
// otherwise can't receive fresh props once removed from the tree), while
// the entering element reads its own prop normally. Exit always fades
// toward 0 opacity (not just the push case's partial 0.4 dim) so a screen
// leaving for good visibly dissolves instead of sliding off fully opaque.
const stackVariants = {
  enter: (direction: "push" | "pop") => ({
    x: direction === "push" ? "100%" : "-30%",
    opacity: direction === "push" ? 1 : 0.4,
    filter: "blur(8px)",
  }),
  center: { x: 0, opacity: 1, filter: "blur(0px)" },
  exit: (direction: "push" | "pop") => ({
    x: direction === "push" ? "-30%" : "100%",
    opacity: direction === "push" ? 0.4 : 0,
    filter: "blur(8px)",
  }),
};

interface CompactMenuTransitionProps {
  stackKey: number;
  direction: "push" | "pop";
  reducedMotion: boolean;
  children: ReactNode;
}

export function CompactMenuTransition({ stackKey, direction, reducedMotion, children }: CompactMenuTransitionProps) {
  if (reducedMotion) return <div>{children}</div>;
  return (
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={stackKey}
        custom={direction}
        variants={stackVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={springs.snappy}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function createBackRow(adapter: MenuAdapter, label: string, onBack: () => void): ReactNode {
  const { Item } = adapter;
  return (
    <Item
      className={itemClassName}
      onSelect={(event) => {
        event.preventDefault();
        onBack();
      }}
    >
      <Icon name="chevron-left" size="sm" color="tint" />
      <Text as="span" textStyle="footnote" weight="semibold" color="tint">
        {label}
      </Text>
    </Item>
  );
}

// compact submenu rows push a new stack frame instead of opening a Radix
// flyout (SSA.4) -- the regular+ flyout default in menu-core.tsx stays
// untouched and keeps handling both Dropdown and ContextMenu whenever
// they're not at the compact size class.
export function createCompactSubmenuRenderer(
  adapter: MenuAdapter,
  onPush: (label: string, items: DropdownItemDef[]) => void,
): SubmenuRenderer {
  const { Item } = adapter;
  const renderCompactSubmenu: SubmenuRenderer = (item, index, dragIndex, drag) => (
    <Item
      key={index}
      data-drag-select-index={dragIndex}
      className={itemClassName}
      onSelect={(event) => {
        event.preventDefault();
        onPush(item.label, item.items);
      }}
    >
      {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
      <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<Icon name="chevron-right" size="sm" />} />
    </Item>
  );
  return renderCompactSubmenu;
}
