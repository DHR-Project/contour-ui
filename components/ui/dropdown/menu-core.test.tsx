import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContextMenu, DropdownMenu } from "radix-ui";
import { contextMenuContentClassName, dropdownContentClassName, renderMenuItems } from "./menu-core";
import type { DropdownItemDef } from "./menu-core";

// Runs the same assertions against Dropdown's and ContextMenu's real Radix
// namespaces (not the Dropdown/ContextMenu wrapper components -- those also
// differ in how they're opened, click vs right-click, which is legitimately
// out of scope here). This is the test-time half of the sync guarantee
// alongside menu-core.tsx's MenuAdapter comment: since both wrapper
// components call the exact same `renderMenuItems` shown failing or passing
// below, a regression in one is a regression in both, and this is what
// actually proves it rather than just asserting the types line up.
interface Harness {
  name: string;
  renderItems: (items: DropdownItemDef[]) => void;
  open: () => Promise<void> | void;
}

const harnesses: Harness[] = [
  {
    name: "DropdownMenu adapter",
    renderItems: (items) =>
      render(
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>Open</DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className={dropdownContentClassName}>
              {renderMenuItems(DropdownMenu, dropdownContentClassName, items)}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>,
      ),
    open: async () => {
      const user = userEvent.setup();
      await user.click(screen.getByText("Open"));
    },
  },
  {
    name: "ContextMenu adapter",
    renderItems: (items) =>
      render(
        <ContextMenu.Root>
          <ContextMenu.Trigger>Open</ContextMenu.Trigger>
          <ContextMenu.Portal>
            <ContextMenu.Content className={contextMenuContentClassName}>
              {renderMenuItems(ContextMenu, contextMenuContentClassName, items)}
            </ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
      ),
    open: () => {
      fireEvent.contextMenu(screen.getByText("Open"));
    },
  },
];

// Regression coverage for a real bug: ContextMenu used to reuse Dropdown's
// content class verbatim, which bound `max-height`/`transform-origin` to
// DropdownMenu.Content's own CSS vars -- vars that are simply never set
// inside ContextMenu.Content (each Radix menu family sets its own,
// differently-named ones). The effect on a real device: no height cap, so
// ContextMenu's popover had nothing to make it scroll and just ran off the
// screen. Plain string assertions (not a render) since jsdom can't verify
// the resulting layout/scroll behavior itself.
describe("dropdownContentClassName / contextMenuContentClassName", () => {
  it("each binds to its own Radix family's content-available-height var, not the other's", () => {
    expect(dropdownContentClassName).toContain("max-h-(--radix-dropdown-menu-content-available-height)");
    expect(dropdownContentClassName).not.toContain("--radix-context-menu-content-available-height");
    expect(contextMenuContentClassName).toContain("max-h-(--radix-context-menu-content-available-height)");
    expect(contextMenuContentClassName).not.toContain("--radix-dropdown-menu-content-available-height");
  });

  it("each binds to its own Radix family's content-transform-origin var, not the other's", () => {
    expect(dropdownContentClassName).toContain("origin-[var(--radix-dropdown-menu-content-transform-origin)]");
    expect(dropdownContentClassName).not.toContain("--radix-context-menu-content-transform-origin");
    expect(contextMenuContentClassName).toContain("origin-[var(--radix-context-menu-content-transform-origin)]");
    expect(contextMenuContentClassName).not.toContain("--radix-dropdown-menu-content-transform-origin");
  });
});

describe.each(harnesses)("renderMenuItems ($name)", ({ renderItems, open }) => {
  it("renders an action row and fires onSelect on click", async () => {
    const onSelect = vi.fn();
    renderItems([{ type: "action", label: "Duplicate", onSelect }]);

    await open();
    const item = await screen.findByText("Duplicate");
    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("toggles a checkbox item without closing the menu", async () => {
    const onCheckedChange = vi.fn();
    renderItems([{ type: "checkbox", label: "Wi-Fi only", checked: false, onCheckedChange }]);

    await open();
    const item = await screen.findByText("Wi-Fi only");
    fireEvent.click(item);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByText("Wi-Fi only")).toBeInTheDocument();
  });

  it("applies destructive styling to an action's role", async () => {
    renderItems([{ type: "action", label: "Delete", role: "destructive", onSelect: () => {} }]);

    await open();
    const item = await screen.findByText("Delete");
    expect(item.closest('[role="menuitem"]')).toHaveClass("text-[rgb(var(--color-destructive))]");
  });
});
