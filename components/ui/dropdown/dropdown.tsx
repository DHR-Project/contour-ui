"use client";

import { useId, useRef, useState } from "react";
import { DropdownMenu } from "radix-ui";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactElement } from "react";
import { springs } from "@/lib/motion";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { ListItemContent } from "@/components/ui/list";
import { useDragSelect } from "./use-drag-select";
import type { DragSelectTarget } from "./use-drag-select";
import { contentClassName, DragHighlight, itemClassName, renderMenuItems } from "./menu-core";
import type { DragRenderContext, DropdownItemDef, MenuAdapter, SubmenuRenderer } from "./menu-core";

export type { DropdownItemDef, DropdownRole } from "./menu-core";
export { contentClassName, itemClassName, sectionTitleClassName, separatorClassName } from "./menu-core";

export interface DropdownProps {
  trigger: ReactElement;
  items: DropdownItemDef[];
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

// Assigning the radix-ui `DropdownMenu` namespace to a `MenuAdapter`-typed
// variable is the compile-time half of the sync guarantee with ContextMenu
// (see menu-core.tsx's MenuAdapter comment): if the shared renderMenuItems
// ever needs a primitive or prop shape DropdownMenu doesn't actually have,
// this line fails to typecheck.
const dropdownMenuAdapter: MenuAdapter = DropdownMenu;

interface StackFrame {
  label: string;
  items: DropdownItemDef[];
}

// Direction-aware slide (contour-spec-dropdown-v2.md SSA.4): entering
// submenu comes from the right and settles at center; the retreating parent
// eases back to -30%/40% opacity instead of disappearing, signaling "still
// there." Reversed on Back. `custom` must be set on both AnimatePresence and
// the motion.div: AnimatePresence forwards it to the exiting element (which
// otherwise can't receive fresh props once removed from the tree), while
// the entering element reads its own prop normally.
// Exit always fades toward 0 opacity now (not just the push case's partial
// 0.4 dim) so a screen leaving for good visibly dissolves instead of
// sliding off fully opaque.
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

export function Dropdown({ trigger, items, side = "bottom", align = "start" }: DropdownProps) {
  const sizeClass = useSizeClass();
  const isCompact = sizeClass === "compact";
  const isCoarsePointer = useIsCoarsePointer();
  const reducedMotion = useReducedMotion();
  const highlightLayoutId = `dropdown-drag-highlight-${useId()}`;
  const contentRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [stack, setStack] = useState<StackFrame[]>([]);
  const [direction, setDirection] = useState<"push" | "pop">("push");

  const currentFrame = stack[stack.length - 1];
  const currentItems = currentFrame ? currentFrame.items : items;

  // If the tapped submenu row sits below the fold (the content scrolled
  // down to reach it), snap the scroll position back to the top first --
  // otherwise the incoming screen would slide in already scrolled, hiding
  // its own top rows. The push only starts once the scroll settles.
  function pushSubmenu(label: string, subItems: DropdownItemDef[]) {
    const container = contentRef.current;
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

  const dragTargets: DragSelectTarget[] = [];
  const { highlightedIndex, triggerDragProps } = useDragSelect({
    enabled: isCoarsePointer,
    open,
    onOpenRequest: () => setOpen(true),
    targets: dragTargets,
    containerRef: contentRef,
  });

  // Only built on coarse pointers -- fine-pointer (mouse) never renders the
  // extra highlight nodes or index attributes (SSA.5 scope: touch-only).
  const drag: DragRenderContext | undefined = isCoarsePointer
    ? { targets: dragTargets, highlightedIndex, highlightLayoutId }
    : undefined;

  // compact: stack push/pop with Back, no Radix flyout (SSA.4). regular+:
  // Radix's default flyout cascade, untouched.
  const compactSubmenuRenderer: SubmenuRenderer = (item, index, dragIndex, dragCtx) => (
    <DropdownMenu.Item
      key={index}
      data-drag-select-index={dragIndex}
      className={itemClassName}
      onSelect={(event) => {
        event.preventDefault();
        pushSubmenu(item.label, item.items);
      }}
    >
      {dragCtx && dragIndex === dragCtx.highlightedIndex && <DragHighlight layoutId={dragCtx.highlightLayoutId} />}
      <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<Icon name="chevron-right" size="sm" />} />
    </DropdownMenu.Item>
  );

  const backRow = currentFrame && (
    <DropdownMenu.Item
      className={itemClassName}
      onSelect={(event) => {
        event.preventDefault();
        popSubmenu();
      }}
    >
      <Icon name="chevron-left" size="sm" color="tint" />
      <Text as="span" textStyle="footnote" weight="semibold" color="tint">
        {currentFrame.label}
      </Text>
    </DropdownMenu.Item>
  );

  const compactScreen = (
    <>
      {backRow}
      {renderMenuItems(dropdownMenuAdapter, currentItems, drag, compactSubmenuRenderer)}
    </>
  );

  const content = !isCompact ? (
    renderMenuItems(dropdownMenuAdapter, items, drag)
  ) : reducedMotion ? (
    <div>{compactScreen}</div>
  ) : (
    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
      <motion.div
        key={stack.length}
        custom={direction}
        variants={stackVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={springs.snappy}
      >
        {compactScreen}
      </motion.div>
    </AnimatePresence>
  );

  return (
    <DropdownMenu.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setStack([]);
      }}

    >
      {/* onPointerDown intercepts touchstart to open immediately, ahead of
          Radix's own click handling (SSA.5: the menu should open right away
          while the finger is still down, not wait for release). No-op on
          mouse/pen; merges with the child's own handlers via Radix's
          asChild/Slot. */}
      <DropdownMenu.Trigger asChild {...triggerDragProps}>
        {trigger}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content ref={contentRef} className={contentClassName} side={side} align={align} sideOffset={4}>
          {content}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
