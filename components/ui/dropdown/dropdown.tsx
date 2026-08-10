"use client";

import { useId, useRef, useState } from "react";
import { DropdownMenu } from "radix-ui";
import type { ReactElement } from "react";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
import { useDragSelect } from "./use-drag-select";
import type { DragSelectTarget } from "./use-drag-select";
import { dropdownContentClassName, renderMenuItems } from "./menu-core";
import type { DragRenderContext, DropdownItemDef, MenuAdapter } from "./menu-core";
import { CompactMenuTransition, createBackRow, createCompactSubmenuRenderer, useMenuStack } from "./compact-menu";

export type { DropdownItemDef, DropdownRole } from "./menu-core";
export { dropdownContentClassName as contentClassName, itemClassName, sectionTitleClassName, separatorClassName } from "./menu-core";

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

export function Dropdown({ trigger, items, side = "bottom", align = "start" }: DropdownProps) {
  const sizeClass = useSizeClass();
  const isCompact = sizeClass === "compact";
  const isCoarsePointer = useIsCoarsePointer();
  const reducedMotion = useReducedMotion();
  const highlightLayoutId = `dropdown-drag-highlight-${useId()}`;
  const contentRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const { currentFrame, currentItems, stackLength, direction, pushSubmenu, popSubmenu, reset } = useMenuStack({
    items,
    containerRef: contentRef,
    reducedMotion,
  });

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
  const compactSubmenuRenderer = createCompactSubmenuRenderer(dropdownMenuAdapter, pushSubmenu);

  const compactScreen = (
    <>
      {currentFrame && createBackRow(dropdownMenuAdapter, currentFrame.label, popSubmenu)}
      {renderMenuItems(dropdownMenuAdapter, dropdownContentClassName, currentItems, drag, compactSubmenuRenderer)}
    </>
  );

  const content = !isCompact ? (
    renderMenuItems(dropdownMenuAdapter, dropdownContentClassName, items, drag)
  ) : (
    <CompactMenuTransition stackKey={stackLength} direction={direction} reducedMotion={reducedMotion}>
      {compactScreen}
    </CompactMenuTransition>
  );

  return (
    <DropdownMenu.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
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
        <DropdownMenu.Content ref={contentRef} className={dropdownContentClassName} side={side} align={align} sideOffset={4}>
          {content}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
