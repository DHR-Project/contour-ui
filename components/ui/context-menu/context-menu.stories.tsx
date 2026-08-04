import type { Story } from "@ladle/react";
import { ContextMenu } from "./context-menu";

const meta = {
  title: "Components / Context Menu",
};

export default meta;

/**
 * Right-click (pointer: fine) opens natively via Radix's own oncontextmenu
 * handling. Reuses Dropdown's DropdownItemDef union and visual tokens
 * (contour-spec-context-menu.md) -- on touch, this is driven externally by
 * a consumer's own long-press timer (see ListItem), not demoable with a
 * mouse in Ladle.
 */
export const RightClick: Story = () => (
  <ContextMenu
    items={[
      { type: "action", icon: "copy", label: "Duplicate", onSelect: () => {} },
      { type: "action", icon: "share", label: "Share", onSelect: () => {} },
      { type: "separator" },
      { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: () => {} },
    ]}
  >
    <div className="flex h-40 w-64 items-center justify-center rounded-md border border-dashed border-separator text-label-secondary">
      Right-click this area
    </div>
  </ContextMenu>
);

export const Disabled: Story = () => (
  <ContextMenu items={[{ type: "action", label: "Duplicate", onSelect: () => {} }]} disabled>
    <div className="flex h-40 w-64 items-center justify-center rounded-md border border-dashed border-separator text-label-secondary">
      Right-click does nothing here
    </div>
  </ContextMenu>
);
