import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./sidebar";
import type { SidebarItem } from "./sidebar";

const ITEMS: SidebarItem[] = [
  { value: "home", icon: "home", label: "Home" },
  { value: "search", icon: "search", label: "Search" },
  { value: "alerts", icon: "bell", label: "Alerts", badge: 3 },
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
});
