import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./sidebar";
import type { SidebarGroup, SidebarItem } from "./sidebar";

const ITEMS: SidebarItem[] = [
  { value: "home", icon: "home", label: "Home" },
  { value: "search", icon: "search", label: "Search" },
  { value: "alerts", icon: "bell", label: "Alerts", badge: 3 },
];

const GROUPS: SidebarGroup[] = [
  { items: [{ value: "all-notes", icon: "layers", label: "All Notes" }] },
  {
    label: "iCloud",
    items: [
      { value: "notes", icon: "layout-grid", label: "Notes" },
      { value: "recipes", icon: "heart", label: "Recipes" },
    ],
  },
];

const COLLAPSIBLE_GROUPS: SidebarGroup[] = [
  {
    label: "Layout",
    collapsible: true,
    defaultOpen: false,
    items: [
      { value: "flex", label: "Flex" },
      { value: "grid", label: "Grid" },
    ],
  },
  {
    label: "Controls",
    collapsible: true,
    defaultOpen: false,
    items: [{ value: "button", label: "Button" }],
  },
];

describe("Sidebar", () => {
  it("renders every item as a tab and marks the active one", () => {
    render(<Sidebar items={ITEMS} value="home" onValueChange={() => {}} />);
    const tabs = screen.getAllByRole("tab");
    expect(tabs).toHaveLength(3);
    expect(screen.getByRole("tab", { name: /Home/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /Search/ })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onValueChange with the item's value, not its label, when pressed", () => {
    let value = "home";
    const onValueChange = (next: string) => {
      value = next;
    };
    render(<Sidebar items={ITEMS} value={value} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: /Search/ }));
    expect(value).toBe("search");
  });

  it("renders a badge count on items that have one", () => {
    render(<Sidebar items={ITEMS} value="home" onValueChange={() => {}} />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("is a controlled, presentational list -- it never changes its own aria-selected without a value change from the parent", () => {
    const onValueChange = () => {};
    const { rerender } = render(<Sidebar items={ITEMS} value="home" onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: /Search/ }));
    expect(screen.getByRole("tab", { name: /Home/ })).toHaveAttribute("aria-selected", "true");
    rerender(<Sidebar items={ITEMS} value="search" onValueChange={onValueChange} />);
    expect(screen.getByRole("tab", { name: /Search/ })).toHaveAttribute("aria-selected", "true");
  });

  it("dims the active row's background when the window loses focus", () => {
    render(<Sidebar items={ITEMS} value="home" onValueChange={() => {}} />);
    const activeRow = screen.getByRole("tab", { name: /Home/ });

    act(() => {
      window.dispatchEvent(new Event("blur"));
    });
    expect(activeRow.querySelector('[aria-hidden="true"]')).toHaveClass(
      "bg-[rgb(var(--sidebar-bg-inactive))]",
    );

    act(() => {
      window.dispatchEvent(new Event("focus"));
    });
    expect(activeRow.querySelector('[aria-hidden="true"]')).toHaveClass(
      "bg-[rgb(var(--sidebar-bg-active))]",
    );
  });

  it("renders labelled groups, with every item still reachable as a tab", () => {
    render(<Sidebar items={GROUPS} value="all-notes" onValueChange={() => {}} />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByText("iCloud")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /^Notes$/ })).toHaveAttribute("aria-selected", "false");
  });

  it("omits a group header for an unlabelled group", () => {
    render(<Sidebar items={GROUPS} value="all-notes" onValueChange={() => {}} />);
    expect(screen.getByRole("tab", { name: /All Notes/ })).toBeInTheDocument();
  });

  it("selects the correct item across group boundaries", () => {
    let value = "all-notes";
    const onValueChange = (next: string) => {
      value = next;
    };
    render(<Sidebar items={GROUPS} value={value} onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole("tab", { name: /Recipes/ }));
    expect(value).toBe("recipes");
  });

  it("renders an item with no icon at all -- icon is optional", () => {
    render(
      <Sidebar
        items={[{ value: "flex", label: "Flex" }]}
        value="flex"
        onValueChange={() => {}}
      />,
    );
    expect(screen.getByRole("tab", { name: "Flex" })).toBeInTheDocument();
  });

  it("starts a collapsible group with defaultOpen:false collapsed, hiding its items", () => {
    render(<Sidebar items={COLLAPSIBLE_GROUPS} value="__none__" onValueChange={() => {}} />);
    expect(screen.queryByRole("tab", { name: "Flex" })).not.toBeInTheDocument();
    expect(screen.getByText("Layout")).toBeInTheDocument();
  });

  it("expands a collapsed group's items on clicking its header, and re-collapses on a second click", async () => {
    render(<Sidebar items={COLLAPSIBLE_GROUPS} value="__none__" onValueChange={() => {}} />);
    const header = screen.getByRole("button", { name: "Layout" });
    expect(header).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("tab", { name: "Flex" })).toBeInTheDocument();

    fireEvent.click(header);
    expect(header).toHaveAttribute("aria-expanded", "false");
    // AnimatePresence's exit animation unmounts the item asynchronously.
    await waitFor(() => expect(screen.queryByRole("tab", { name: "Flex" })).not.toBeInTheDocument());
  });

  it("starts a collapsible group open when it contains the active value, even with defaultOpen:false", () => {
    render(<Sidebar items={COLLAPSIBLE_GROUPS} value="button" onValueChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Button" })).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Flex" })).not.toBeInTheDocument();
  });

  it("auto-expands a collapsed group when `value` changes to one of its items", () => {
    const { rerender } = render(
      <Sidebar items={COLLAPSIBLE_GROUPS} value="__none__" onValueChange={() => {}} />,
    );
    expect(screen.queryByRole("tab", { name: "Button" })).not.toBeInTheDocument();

    rerender(<Sidebar items={COLLAPSIBLE_GROUPS} value="button" onValueChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Button" })).toBeInTheDocument();
  });
});
