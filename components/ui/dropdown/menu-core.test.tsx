import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ContextMenu, DropdownMenu } from "radix-ui";
import { renderMenuItems } from "./menu-core";
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
            <DropdownMenu.Content>{renderMenuItems(DropdownMenu, items)}</DropdownMenu.Content>
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
            <ContextMenu.Content>{renderMenuItems(ContextMenu, items)}</ContextMenu.Content>
          </ContextMenu.Portal>
        </ContextMenu.Root>,
      ),
    open: () => {
      fireEvent.contextMenu(screen.getByText("Open"));
    },
  },
];

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
