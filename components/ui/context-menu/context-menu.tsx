"use client";

import { ContextMenu as RadixContextMenu } from "radix-ui";
import type { ReactElement } from "react";
import { cn } from "@/lib/utils/cn";
import { Icon } from "@/components/icon";
import { ListItemContent } from "@/components/ui/list";
// Direct import (not the "@/components/ui/dropdown" barrel) -- Rollup flags
// a circular chunk dependency otherwise, since Dropdown's own barrel
// re-exports from this same module.
import { contentClassName, itemClassName, sectionTitleClassName, separatorClassName } from "@/components/ui/dropdown/dropdown";
import type { DropdownItemDef } from "@/components/ui/dropdown/dropdown";

export interface ContextMenuProps {
  /** Reuses Dropdown's item type verbatim (contour-spec-context-menu.md). */
  items: DropdownItemDef[];
  /** asChild pattern, same as Dropdown's `trigger`. */
  children: ReactElement;
  disabled?: boolean;
}

function CheckIndicator() {
  return (
    <RadixContextMenu.ItemIndicator>
      <Icon name="check" size="sm" color="tint" />
    </RadixContextMenu.ItemIndicator>
  );
}

// Mirrors Dropdown's renderItems (contour-spec-context-menu.md: don't
// rewrite the render logic, reuse DropdownItemDef[] and the render logic
// verbatim) using the same DropdownItemDef union and the same visual tokens
// (contentClassName/itemClassName/etc., imported directly from dropdown.tsx).
// Kept as its own small switch rather than a single unified function
// because Radix's ContextMenu and
// DropdownMenu sub-components are structurally parallel but distinct
// component families with no common base type. This is deliberately the
// plain flyout submenu only -- no compact push/pop stack, no drag-select --
// out of scope for this minimal wrapper (see contour-session-changelog-v2.md).
function renderContextMenuItems(items: DropdownItemDef[]) {
  return items.map((item, index) => {
    switch (item.type) {
      case "separator":
        return <RadixContextMenu.Separator key={index} className={separatorClassName} />;
      case "label":
        return (
          <RadixContextMenu.Label key={index} className={sectionTitleClassName}>
            {item.text}
          </RadixContextMenu.Label>
        );
      case "action":
        return (
          <RadixContextMenu.Item
            key={index}
            className={cn(itemClassName, item.role === "destructive" && "text-[rgb(var(--color-destructive))]")}
            onSelect={item.onSelect}
          >
            <ListItemContent leadingIcon={item.icon} title={item.label} />
          </RadixContextMenu.Item>
        );
      case "checkbox":
        return (
          <RadixContextMenu.CheckboxItem
            key={index}
            className={itemClassName}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            onSelect={(event) => event.preventDefault()}
          >
            <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<CheckIndicator />} />
          </RadixContextMenu.CheckboxItem>
        );
      case "radio-group":
        return (
          <RadixContextMenu.RadioGroup key={index} value={item.value} onValueChange={item.onValueChange}>
            {item.options.map((option) => (
              <RadixContextMenu.RadioItem
                key={option.value}
                value={option.value}
                className={itemClassName}
                onSelect={(event) => event.preventDefault()}
              >
                <ListItemContent title={option.label} trailing={<CheckIndicator />} />
              </RadixContextMenu.RadioItem>
            ))}
          </RadixContextMenu.RadioGroup>
        );
      case "submenu":
        return (
          <RadixContextMenu.Sub key={index}>
            <RadixContextMenu.SubTrigger className={itemClassName}>
              <ListItemContent
                leadingIcon={item.icon}
                title={item.label}
                trailing={<Icon name="chevron-right" size="sm" />}
              />
            </RadixContextMenu.SubTrigger>
            <RadixContextMenu.Portal>
              <RadixContextMenu.SubContent className={contentClassName} sideOffset={4}>
                {renderContextMenuItems(item.items)}
              </RadixContextMenu.SubContent>
            </RadixContextMenu.Portal>
          </RadixContextMenu.Sub>
        );
      default:
        return null;
    }
  });
}

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
          {renderContextMenuItems(items)}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}
