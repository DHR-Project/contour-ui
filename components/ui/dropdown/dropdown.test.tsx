import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Dropdown } from "./dropdown";
import type { DropdownItemDef } from "./dropdown";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { value: width, writable: true, configurable: true });
}

afterEach(() => {
  setViewportWidth(1024);
});

describe("Dropdown", () => {
  it("opens on trigger click and shows items", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger={<button type="button">Actions</button>}
        items={[{ type: "action", label: "Duplicate", onSelect: () => {} }]}
      />,
    );
    expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();

    await user.click(screen.getByText("Actions"));
    expect(await screen.findByText("Duplicate")).toBeInTheDocument();
  });

  it("calls onSelect and closes on item click", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Dropdown
        trigger={<button type="button">Actions</button>}
        items={[{ type: "action", label: "Duplicate", onSelect }]}
      />,
    );

    await user.click(screen.getByText("Actions"));
    const item = await screen.findByText("Duplicate");
    await user.click(item);

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText("Duplicate")).not.toBeInTheDocument());
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(
      <Dropdown
        trigger={<button type="button">Actions</button>}
        items={[{ type: "action", label: "Duplicate", onSelect: () => {} }]}
      />,
    );

    await user.click(screen.getByText("Actions"));
    await screen.findByText("Duplicate");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByText("Duplicate")).not.toBeInTheDocument());
  });

  it("toggles a checkbox item without closing the menu", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Dropdown
        trigger={<button type="button">View</button>}
        items={[{ type: "checkbox", label: "Wi-Fi only", checked: false, onCheckedChange }]}
      />,
    );

    await user.click(screen.getByText("View"));
    const item = await screen.findByText("Wi-Fi only");
    await user.click(item);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByText("Wi-Fi only")).toBeInTheDocument();
  });

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
      // the incoming one -- the push/pop state machine is what's under test
      // here, not the spring timing (that's checked visually in ladle).
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
      const user = userEvent.setup();
      render(<Dropdown trigger={<button type="button">Actions</button>} items={items} />);

      await user.click(screen.getByText("Actions"));
      await user.click(await screen.findByText("Move to"));

      expect(await screen.findByText("Archive")).toBeInTheDocument();
      expect(screen.queryByText("Rename")).not.toBeInTheDocument();
      expect(screen.getByText("Move to")).toBeInTheDocument(); // now the Back row's label
    });

    it("Back returns to the parent list at the same level", async () => {
      const user = userEvent.setup();
      render(<Dropdown trigger={<button type="button">Actions</button>} items={items} />);

      await user.click(screen.getByText("Actions"));
      await user.click(await screen.findByText("Move to"));
      await screen.findByText("Archive");

      await user.click(screen.getByText("Move to"));
      expect(await screen.findByText("Rename")).toBeInTheDocument();
      expect(screen.queryByText("Archive")).not.toBeInTheDocument();
    });

    it("selecting a deep action fires onSelect", async () => {
      const user = userEvent.setup();
      render(<Dropdown trigger={<button type="button">Actions</button>} items={items} />);

      await user.click(screen.getByText("Actions"));
      await user.click(await screen.findByText("Move to"));
      await user.click(await screen.findByText("Archive"));

      expect(onDeepSelect).toHaveBeenCalledTimes(1);
    });
  });
});
