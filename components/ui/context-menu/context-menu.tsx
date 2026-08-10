"use client";

import { useId, useRef, useState } from "react";
import { ContextMenu as RadixContextMenu } from "radix-ui";
import type { ReactElement } from "react";
import { useSizeClass } from "@/lib/hooks/use-size-class";
import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";
import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";
// Direct imports (not the "@/components/ui/dropdown" barrel) -- Rollup
// flags a circular chunk dependency otherwise, since Dropdown's own barrel
// re-exports from menu-core.tsx.
import { CONTENT_COLLISION_PADDING, contextMenuContentClassName, renderMenuItems } from "@/components/ui/dropdown/menu-core";
import type { DragRenderContext, DropdownItemDef, MenuAdapter } from "@/components/ui/dropdown/menu-core";
import {
  CompactMenuTransition,
  createBackRow,
  createCompactSubmenuRenderer,
  useMenuStack,
} from "@/components/ui/dropdown/compact-menu";
import { useDragSelect } from "@/components/ui/dropdown/use-drag-select";
import type { DragSelectTarget } from "@/components/ui/dropdown/use-drag-select";

export interface ContextMenuProps {
  /** Reuses Dropdown's item type verbatim (contour-spec-context-menu.md). */
  items: DropdownItemDef[];
  /** asChild pattern, same as Dropdown's `trigger`. */
  children: ReactElement;
  disabled?: boolean;
}

// Assigning the radix-ui `ContextMenu` namespace to a `MenuAdapter`-typed
// variable is the compile-time half of the sync guarantee with Dropdown
// (see menu-core.tsx's MenuAdapter comment): if the shared renderMenuItems
// ever needs a primitive or prop shape ContextMenu doesn't actually have,
// this line fails to typecheck instead of the two menus silently drifting.
const contextMenuAdapter: MenuAdapter = RadixContextMenu;

/**
 * Right-click on `pointer: fine` -- Radix handles this natively via the
 * trigger's own `oncontextmenu` listener. On `pointer: coarse`, this is
 * driven externally: the consumer (ListItem) owns its own long-press timer
 * (disambiguated against its swipe/scroll gestures) and dispatches a
 * synthetic `contextmenu` event at the press coordinates when it fires,
 * rather than relying on the browser's own touch-and-hold behavior, which
 * can't be disambiguated against a competing gesture (contour-spec-
 * context-menu.md SS3).
 *
 * Compact submenu-stack and drag-select (SSA.4/SSA.5) now match Dropdown --
 * both go through the same shared `useMenuStack`/`useDragSelect` as
 * Dropdown, just with `activation: "open"` on the latter: ContextMenu opens
 * from a long-press dispatched by the consumer while the finger is already
 * down, not from a trigger pointerdown Dropdown itself intercepts, so the
 * drag session starts as soon as the menu opens instead of at a separate
 * trigger-press moment (see use-drag-select.ts).
 */
export function ContextMenu({ items, children, disabled }: ContextMenuProps) {
  const sizeClass = useSizeClass();
  const isCompact = sizeClass === "compact";
  const isCoarsePointer = useIsCoarsePointer();
  const reducedMotion = useReducedMotion();
  const highlightLayoutId = `context-menu-drag-highlight-${useId()}`;
  const contentRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const { currentFrame, currentItems, stackLength, direction, pushSubmenu, popSubmenu, reset } = useMenuStack({
    items,
    containerRef: contentRef,
    reducedMotion,
  });

  const dragTargets: DragSelectTarget[] = [];
  const { highlightedIndex } = useDragSelect({
    activation: "open",
    enabled: isCoarsePointer,
    open,
    targets: dragTargets,
    containerRef: contentRef,
  });

  // Only built on coarse pointers -- fine-pointer (mouse) never renders the
  // extra highlight nodes or index attributes (SSA.5 scope: touch-only).
  const drag: DragRenderContext | undefined = isCoarsePointer
    ? { targets: dragTargets, highlightedIndex, highlightLayoutId }
    : undefined;

  const compactSubmenuRenderer = createCompactSubmenuRenderer(contextMenuAdapter, pushSubmenu);

  const compactScreen = (
    <>
      {currentFrame && createBackRow(contextMenuAdapter, currentFrame.label, popSubmenu)}
      {renderMenuItems(contextMenuAdapter, contextMenuContentClassName, currentItems, drag, compactSubmenuRenderer)}
    </>
  );

  const content = !isCompact ? (
    renderMenuItems(contextMenuAdapter, contextMenuContentClassName, items, drag)
  ) : (
    <CompactMenuTransition stackKey={stackLength} direction={direction} reducedMotion={reducedMotion}>
      {compactScreen}
    </CompactMenuTransition>
  );

  return (
    <RadixContextMenu.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <RadixContextMenu.Trigger asChild disabled={disabled}>
        {children}
      </RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          ref={contentRef}
          className={contextMenuContentClassName}
          collisionPadding={CONTENT_COLLISION_PADDING}
        >
          {content}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
