import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContextMenu } from "./context-menu";
import type { DropdownItemDef } from "@/components/ui/dropdown/menu-core";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { value: width, writable: true, configurable: true });
}

afterEach(() => {
  setViewportWidth(1024);
});

describe("ContextMenu", () => {
  it("opens on right-click and shows items", async () => {
    render(
      <ContextMenu items={[{ type: "action", label: "Duplicate", onSelect: () => {} }]}>
        <div>Row</div>
      </ContextMenu>,
    );
    expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();

    fireEvent.contextMenu(screen.getByText("Row"));
    expect(await screen.findByText("Duplicate")).toBeInTheDocument();
  });

  it("calls onSelect and closes on item click", async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu items={[{ type: "action", label: "Duplicate", onSelect }]}>
        <div>Row</div>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByText("Row"));
    const item = await screen.findByText("Duplicate");
    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText("Duplicate")).not.toBeInTheDocument());
  });

  it("does not open when disabled", () => {
    render(
      <ContextMenu items={[{ type: "action", label: "Duplicate", onSelect: () => {} }]} disabled>
        <div>Row</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText("Row"));
    expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();
  });

  // Mirrors dropdown.test.tsx's own "compact submenu-stack" block --
  // ContextMenu shares useMenuStack/renderMenuItems with Dropdown (see
  // context-menu.tsx), so it gets the same push/pop stack instead of a
  // flyout at compact size classes.
  describe("compact submenu-stack (contour-spec-dropdown-v2.md SSA.4)", () => {
    const onDeepSelect = vi.fn();
    const items: DropdownItemDef[] = [
      { type: "action", label: "Rename", onSelect: () => {} },
      {
        type: "submenu",
        label: "Move to",
        items: [{ type: "action", label: "Archive", onSelect: onDeepSelect }],
      },
    ];

    beforeEach(() => {
      setViewportWidth(375);
      // Forces the reduced-motion branch (a plain swap, no AnimatePresence)
      // so the outgoing screen doesn't linger mid-exit-animation alongside
      // the incoming one -- see dropdown.test.tsx's identical setup.
      vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
        matches: query.includes("prefers-reduced-motion"),
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }));
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("replaces the parent list with the submenu + a Back row instead of a flyout", async () => {
      render(
        <ContextMenu items={items}>
          <div>Row</div>
        </ContextMenu>,
      );

      fireEvent.contextMenu(screen.getByText("Row"));
      fireEvent.click(await screen.findByText("Move to"));

      expect(await screen.findByText("Archive")).toBeInTheDocument();
      expect(screen.queryByText("Rename")).not.toBeInTheDocument();
      expect(screen.getByText("Move to")).toBeInTheDocument(); // now the Back row's label
    });

    it("Back returns to the parent list at the same level", async () => {
      render(
        <ContextMenu items={items}>
          <div>Row</div>
        </ContextMenu>,
      );
      fireEvent.contextMenu(screen.getByText("Row"));
      fireEvent.click(await screen.findByText("Move to"));
      await screen.findByText("Archive");

      fireEvent.click(screen.getByText("Move to"));
      expect(await screen.findByText("Rename")).toBeInTheDocument();
      expect(screen.queryByText("Archive")).not.toBeInTheDocument();
    });

    it("selecting a deep action fires onSelect", async () => {
      render(
        <ContextMenu items={items}>
          <div>Row</div>
        </ContextMenu>,
      );
      fireEvent.contextMenu(screen.getByText("Row"));
      fireEvent.click(await screen.findByText("Move to"));
      fireEvent.click(await screen.findByText("Archive"));

      expect(onDeepSelect).toHaveBeenCalledTimes(1);
    });
  });
});
