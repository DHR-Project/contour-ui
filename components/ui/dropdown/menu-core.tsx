"use client";

import { motion } from "framer-motion";
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { springs } from "@/lib/motion";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { ListItemContent } from "@/components/ui/list";
import type { DragSelectTarget } from "./use-drag-select";

export type DropdownRole = "default" | "destructive";

export type DropdownItemDef =
  | { type: "action"; icon?: IconName; label: string; onSelect: () => void; role?: DropdownRole }
  | {
      type: "checkbox";
      icon?: IconName;
      label: string;
      checked: boolean;
      onCheckedChange: (checked: boolean) => void;
    }
  | {
      type: "radio-group";
      options: { value: string; label: string }[];
      value: string;
      onValueChange: (value: string) => void;
    }
  | { type: "submenu"; icon?: IconName; label: string; items: DropdownItemDef[] }
  | { type: "separator" }
  | { type: "label"; text: string };

// springs.snappy (SS6.3/6.4) approximated with --ease-spring-out (SS6.2) --
// Radix mounts/unmounts this content itself, outside of React's tree, so
// Framer Motion can't drive it directly (see globals.css keyframes comment).
// Dropdown's submenu-stack and drag-select motion is a different case: it
// only animates children *inside* this already-mounted content, so it
// doesn't fight the same constraint -- Framer Motion is safe to use there.
// Shared by Dropdown and ContextMenu (contour-spec-context-menu.md: don't
// rewrite the render logic) -- Radix's ContextMenu/DropdownMenu sub-components
// are structurally parallel but distinct component families, so the JSX
// switch itself can't be literally reused as-is; MenuAdapter below is the
// seam that lets renderMenuItems run against either one instead.
//
// Radius follows the concentric-nesting formula (outer = inner + padding),
// not --popover-radius directly -- at the item's --radius-sm (8px) plus the
// container's own 6px (p-1.5) padding, that's 14px, matching --radius-lg.
// `relative` anchors popLayout's absolutely-positioned exiting screen (see
// Dropdown's stackVariants) so it stays clipped by `overflow-x-hidden` instead
// of escaping to whatever ancestor happens to be positioned -- `overflow-y-auto`
// (rather than `hidden`) still clips the same way but additionally lets a
// menu taller than the viewport scroll internally, capped to Radix's own
// `--radix-dropdown-menu-content-available-height` (guideline: popovers must
// fit on screen with their own scroll, not overflow it). `contour-material`
// (tokens.css SS2.3a) replaces the old solid `bg-bg-tertiary` -- floating
// content should read as frosted glass, not a flat panel (guideline rule 1.2).
export const contentClassName =
  "relative z-[var(--z-dropdown)] min-w-48 max-h-(--radix-dropdown-menu-content-available-height) origin-[var(--radix-dropdown-menu-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-[var(--radius-lg)] border border-separator contour-material p-1.5 shadow-md " +
  "data-[state=open]:animate-[contour-scale-fade-in_var(--duration-fast)_var(--ease-spring-out)] " +
  "data-[state=closed]:animate-[contour-scale-fade-out_var(--duration-fast)_var(--ease-standard)]";

// --menu-item-padding-sides/-padding-y (SS4.8/4.9, contour-spec-dropdown-v2.md
// SSA.2a) -- denser than List's --padding-row-y since a menu needs to stay
// compact, and distinct from --padding-control-* which other controls use.
// `relative` is load-bearing for the absolutely-positioned drag-select
// highlight (SSA.5) rendered inside the active row.
export const itemClassName =
  "relative flex cursor-default select-none items-center gap-(--gap-icon-text) rounded-sm px-(--menu-item-padding-sides) py-(--menu-item-padding-y) outline-none data-[highlighted]:bg-fill-secondary data-[disabled]:pointer-events-none data-[disabled]:opacity-40";

export const sectionTitleClassName =
  "px-(--menu-item-padding-sides) pt-(--menu-section-title-padding-top) pb-(--menu-section-title-padding-bottom) text-[length:var(--menu-section-title-size)] text-label-secondary";

export const separatorClassName = "my-(--menu-item-separator-padding) h-px bg-separator";

// The minimal set of primitives that both radix-ui's `DropdownMenu` and
// `ContextMenu` namespace exports implement with matching prop shapes (both
// extend the same underlying `@radix-ui/react-menu` primitives). Assigning
// one of those namespace objects to a `MenuAdapter`-typed variable (see
// dropdown.tsx / context-menu.tsx) is what gives renderMenuItems its
// compile-time sync guarantee: add a member here (or change a prop shape)
// that one of the two namespaces doesn't actually satisfy, and that
// assignment fails to typecheck instead of the two menus silently drifting.
export interface MenuAdapter {
  Item: ComponentType<{
    className?: string;
    disabled?: boolean;
    onSelect?: (event: Event) => void;
    children?: ReactNode;
  }>;
  CheckboxItem: ComponentType<{
    className?: string;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    onSelect?: (event: Event) => void;
    children?: ReactNode;
  }>;
  RadioGroup: ComponentType<{
    value: string;
    onValueChange: (value: string) => void;
    children?: ReactNode;
  }>;
  RadioItem: ComponentType<{
    value: string;
    className?: string;
    onSelect?: (event: Event) => void;
    children?: ReactNode;
  }>;
  Label: ComponentType<{ className?: string; children?: ReactNode }>;
  Separator: ComponentType<{ className?: string }>;
  Sub: ComponentType<{ children?: ReactNode }>;
  SubTrigger: ComponentType<{ className?: string; children?: ReactNode }>;
  SubContent: ComponentType<{ className?: string; sideOffset?: number; children?: ReactNode }>;
  Portal: ComponentType<{ children?: ReactNode }>;
  ItemIndicator: ComponentType<{ children?: ReactNode }>;
}

function CheckIndicator({ adapter }: { adapter: MenuAdapter }) {
  const { ItemIndicator } = adapter;
  return (
    <ItemIndicator>
      <Icon name="check" size="sm" color="tint" />
    </ItemIndicator>
  );
}

// Collects drag-select targets (SSA.5) as a side effect of the same render
// pass that produces the item nodes, so the `data-drag-select-index` on each
// row and the `targets` array handed to Dropdown's useDragSelect can never
// drift out of sync with each other. ContextMenu never passes a `drag`
// context, so this stays entirely inert there (SSA.5 scope: Dropdown-only).
export interface DragRenderContext {
  targets: DragSelectTarget[];
  highlightedIndex: number | null;
  highlightLayoutId: string;
}

export function pushDragTarget(drag: DragRenderContext | undefined, target: DragSelectTarget): number | undefined {
  if (!drag) return undefined;
  drag.targets.push(target);
  return drag.targets.length - 1;
}

export function DragHighlight({ layoutId }: { layoutId: string }) {
  return (
    <motion.div
      layoutId={layoutId}
      transition={springs.snappy}
      className="absolute inset-0 -z-10 rounded-sm bg-fill-secondary"
    />
  );
}

type SubmenuItemDef = Extract<DropdownItemDef, { type: "submenu" }>;
export type SubmenuRenderer = (
  item: SubmenuItemDef,
  index: number,
  dragIndex: number | undefined,
  drag: DragRenderContext | undefined,
) => ReactNode;

// The plain flyout cascade (contour-spec-dropdown-v2.md SSA.4) -- correct
// as-is for both Dropdown's regular+ size classes and ContextMenu, which
// never overrides this. Nested flyout content is intentionally excluded
// from drag-select (SSA.5 scope note below).
export function createDefaultSubmenuRenderer(adapter: MenuAdapter): SubmenuRenderer {
  const { Sub, SubTrigger, SubContent, Portal } = adapter;
  const renderDefaultSubmenu: SubmenuRenderer = (item, index, dragIndex, drag) => (
    <Sub key={index}>
      <SubTrigger className={itemClassName} data-drag-select-index={dragIndex}>
        {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
        <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<Icon name="chevron-right" size="sm" />} />
      </SubTrigger>
      <Portal>
        <SubContent className={contentClassName} sideOffset={4}>
          {/* No `drag` passed through: drag-select only covers the currently
              visible screen (SSA.5 scope note, contour-spec-dropdown-v2.md). */}
          {renderMenuItems(adapter, item.items)}
        </SubContent>
      </Portal>
    </Sub>
  );
  return renderDefaultSubmenu;
}

// Shared item-rendering core: both Dropdown (regular+ and, via a custom
// `renderSubmenu`, compact) and ContextMenu call this against their own
// `MenuAdapter` instead of each keeping a hand-copied switch statement --
// see the MenuAdapter comment above for how that's enforced, not just
// convention.
export function renderMenuItems(
  adapter: MenuAdapter,
  items: DropdownItemDef[],
  drag?: DragRenderContext,
  renderSubmenu: SubmenuRenderer = createDefaultSubmenuRenderer(adapter),
): ReactNode[] {
  const { Item, CheckboxItem, RadioGroup, RadioItem, Label, Separator } = adapter;
  return items.map((item, index) => {
    switch (item.type) {
      case "separator":
        return <Separator key={index} className={separatorClassName} />;
      case "label":
        return (
          <Label key={index} className={sectionTitleClassName}>
            {item.text}
          </Label>
        );
      case "action": {
        const dragIndex = pushDragTarget(drag, { onSelect: item.onSelect });
        return (
          <Item
            key={index}
            data-drag-select-index={dragIndex}
            className={cn(itemClassName, item.role === "destructive" && "text-[rgb(var(--color-destructive))]")}
            onSelect={item.onSelect}
          >
            {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
            <ListItemContent leadingIcon={item.icon} title={item.label} />
          </Item>
        );
      }
      case "checkbox": {
        const dragIndex = pushDragTarget(drag, { onSelect: () => item.onCheckedChange(!item.checked) });
        return (
          <CheckboxItem
            key={index}
            data-drag-select-index={dragIndex}
            className={itemClassName}
            checked={item.checked}
            onCheckedChange={item.onCheckedChange}
            onSelect={(event) => event.preventDefault()}
          >
            {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
            <ListItemContent leadingIcon={item.icon} title={item.label} trailing={<CheckIndicator adapter={adapter} />} />
          </CheckboxItem>
        );
      }
      case "radio-group":
        return (
          <RadioGroup key={index} value={item.value} onValueChange={item.onValueChange}>
            {item.options.map((option) => {
              const dragIndex = pushDragTarget(drag, { onSelect: () => item.onValueChange(option.value) });
              return (
                <RadioItem
                  key={option.value}
                  value={option.value}
                  data-drag-select-index={dragIndex}
                  className={itemClassName}
                  onSelect={(event) => event.preventDefault()}
                >
                  {drag && dragIndex === drag.highlightedIndex && <DragHighlight layoutId={drag.highlightLayoutId} />}
                  <ListItemContent title={option.label} trailing={<CheckIndicator adapter={adapter} />} />
                </RadioItem>
              );
            })}
          </RadioGroup>
        );
      case "submenu": {
        // Highlightable like any other row, but releasing a drag over it is
        // a no-op -- it never cascades open mid-drag (SSA.5): the user must
        // release and tap again to enter the submenu normally.
        const dragIndex = pushDragTarget(drag, { onSelect: () => {} });
        return renderSubmenu(item, index, dragIndex, drag);
      }
      default:
        return null;
    }
  });
}
