import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TabBar } from "./tab-bar";
import type { TabBarItem } from "./tab-bar";

const ITEMS: TabBarItem[] = [
  { icon: "home", label: "Home" },
  { icon: "search", label: "Search" },
  { icon: "bell", label: "Alerts", badge: 3 },
];

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", { value: width, writable: true, configurable: true });
}

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  setViewportWidth(1024);
});

describe("TabBar (compact -> bottom)", () => {
  beforeEach(() => setViewportWidth(375));

  it("renders every item as a tab and marks the active one", () => {
    render(<TabBar items={ITEMS} value="Home" onValueChange={() => {}} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(screen.getByRole("tab", { name: /Home/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Search/ })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onValueChange when a tab is pressed", () => {
    const onValueChange = vi.fn();
    render(<TabBar items={ITEMS} value="Home" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: /Search/ }));
    expect(onValueChange).toHaveBeenCalledWith("Search");
  });

  it("renders a badge count on items that have one", () => {
    render(<TabBar items={ITEMS} value="Home" onValueChange={() => {}} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("caps a badge display at 99+", () => {
    render(
      <TabBar
        items={[{ icon: "bell", label: "Alerts", badge: 150 }]}
        value="Alerts"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByText("99+")).toBeInTheDocument();
  });

  it("has no layout toggle in compact/bottom position", () => {
    render(<TabBar items={ITEMS} value="Home" onValueChange={() => {}} />);
    expect(screen.queryByRole("button", { name: /Switch to/ })).not.toBeInTheDocument();
  });
});

describe("TabBar (regular+ -> top/sidebar)", () => {
  beforeEach(() => setViewportWidth(1024));

  it("defaults to top position with no saved preference", () => {
    render(<TabBar items={ITEMS} value="Home" onValueChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Switch to sidebar" })).toBeInTheDocument();
  });

  it("renders the top position as a pill nested inside a full-width blur band (SSB.2a)", () => {
    render(<TabBar items={ITEMS} value="Home" onValueChange={() => {}} />);
    const tablist = screen.getByRole("tablist");
    const pill = tablist.closest("nav")!;
    expect(pill).toHaveClass("rounded-full", "m-(--space-4)");
    // The band is the pill's parent and spans full width independent of
    // the pill's own margin -- it's what stays un-"patched" at the edges.
    expect(pill.parentElement).toHaveClass("overflow-hidden");
  });

  it("reads a saved sidebar preference from localStorage on mount", async () => {
    window.localStorage.setItem("contour-tabbar-layout", "sidebar");
    render(<TabBar items={ITEMS} value="Home" onValueChange={() => {}} />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Switch to top bar" })).toBeInTheDocument(),
    );
  });

  it("toggles to sidebar and persists the preference to localStorage", async () => {
    render(<TabBar items={ITEMS} value="Home" onValueChange={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to sidebar" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Switch to top bar" })).toBeInTheDocument(),
    );
    expect(window.localStorage.getItem("contour-tabbar-layout")).toBe("sidebar");
    expect(screen.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
  });
});
