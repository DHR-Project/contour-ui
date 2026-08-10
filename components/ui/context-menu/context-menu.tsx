"use client";

import { ContextMenu as RadixContextMenu } from "radix-ui";
import type { ReactElement } from "react";
// Direct import (not the "@/components/ui/dropdown" barrel) -- Rollup flags
// a circular chunk dependency otherwise, since Dropdown's own barrel
// re-exports from this same module.
import { contentClassName, renderMenuItems } from "@/components/ui/dropdown/menu-core";
import type { DropdownItemDef, MenuAdapter } from "@/components/ui/dropdown/menu-core";

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
// This is deliberately still the plain flyout submenu only -- no compact
// push/pop stack, no drag-select -- out of scope for this minimal wrapper
// (see contour-session-changelog-v2.md); renderMenuItems is only called
// here without a `drag` context or a custom `renderSubmenu`.
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
 */
export function ContextMenu({ items, children, disabled }: ContextMenuProps) {
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger asChild disabled={disabled}>
        {children}
      </RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content className={contentClassName}>
          {renderMenuItems(contextMenuAdapter, items)}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
