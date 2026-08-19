import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NavBar } from "./nav-bar";

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", { value, writable: true, configurable: true });
  // Real browsers keep document.scrollingElement.scrollTop in sync with
  // window.scrollY automatically; jsdom does neither real layout nor that
  // sync, and useScrollProgress (via framer-motion's scroll()) reads
  // scrollTop off the container -- document.scrollingElement when there's
  // no scrollable ancestor -- not window.scrollY.
  const scrollingElement = document.scrollingElement ?? document.documentElement;
  Object.defineProperty(scrollingElement, "scrollTop", { value, writable: true, configurable: true });
  fireEvent.scroll(window);
}

afterEach(() => {
  setScrollY(0);
});

describe("NavBar", () => {
  it("renders the title as the page heading when not in Large Title mode", () => {
    render(<NavBar title="Settings" largeTitleMode={false} />);
    expect(screen.getByRole("heading", { level: 1, name: "Settings" })).toBeInTheDocument();
  });

  it("renders both a compact (hidden) and a large title when Large Title mode is on", () => {
    render(<NavBar title="Inbox" largeTitleMode={true} />);
    const heading = screen.getByRole("heading", { level: 1, name: "Inbox" });
    expect(heading).toBeInTheDocument();
    // The compact duplicate is aria-hidden -- only one accessible heading.
    expect(screen.getAllByText("Inbox")).toHaveLength(2);
  });

  it("renders the large title at full opacity and the compact title fully hidden at the top of the page", () => {
    render(<NavBar title="Inbox" largeTitleMode={true} />);
    const heading = screen.getByRole("heading", { level: 1, name: "Inbox" });
    expect(heading.parentElement).toHaveStyle({ opacity: "1" });
    // The aria-hidden compact duplicate is the other "Inbox" text node.
    const compact = screen.getAllByText("Inbox").find((el) => el !== heading);
    expect(compact).toHaveStyle({ opacity: "0" });
  });

  it("keeps the compact title fully hidden while the Large Title is still fading -- never both visible at once", async () => {
    render(<NavBar title="Inbox" largeTitleMode={true} />);
    const heading = screen.getByRole("heading", { level: 1, name: "Inbox" });

    setScrollY(40); // ~77% of the 52px collapse range -- past STAGE_THRESHOLD's midpoint but not the 90% mark
    await waitFor(() => {
      const opacity = Number(heading.parentElement?.style.opacity);
      expect(opacity).toBeLessThan(0.3); // Large Title mostly faded away already
    });
    const compact = screen.getAllByText("Inbox").find((el) => el !== heading);
    expect(compact).toHaveStyle({ opacity: "0" }); // but the compact title hasn't started appearing yet
  });

  it("fully reveals the compact title (and fully hides the Large Title) once scrolled past the collapse range", async () => {
    render(<NavBar title="Inbox" largeTitleMode={true} />);
    const heading = screen.getByRole("heading", { level: 1, name: "Inbox" });

    setScrollY(52); // full collapse range (96 - 44)
    await waitFor(() => expect(heading.parentElement).toHaveStyle({ opacity: "0" }));
    const compact = screen.getAllByText("Inbox").find((el) => el !== heading);
    expect(compact).toHaveStyle({ opacity: "1" });
  });

  it("also stages the leading action behind the 90% threshold, alongside the compact title", async () => {
    render(
      <NavBar
        title="Inbox"
        largeTitleMode={true}
        leadingAction={{ icon: "arrow-left", label: "Back", onClick: () => {} }}
      />,
    );
    const button = screen.getByRole("button", { name: "Back" });
    expect(button.parentElement).toHaveStyle({ opacity: "0" });

    setScrollY(52);
    await waitFor(() => expect(button.parentElement).toHaveStyle({ opacity: "1" }));
  });

  it("tracks a scrollable ancestor's own scroll position instead of only `window`", async () => {
    // Regression test: NavBar/ProgressiveBlur used to hardcode
    // window.scrollY, which silently never collapses the Large Title when
    // the bar lives inside its own `overflow-y: auto` section (a common
    // real-app layout) instead of the page body scrolling directly. jsdom
    // never computes real layout, so scrollHeight/clientHeight (what
    // findScrollParent compares to detect a scrollable ancestor) are
    // stubbed on the prototype, keyed off this test's marker element,
    // BEFORE mount -- the effect that looks for a scroll parent runs
    // synchronously on mount, too early to patch the instance after the
    // fact.
    const scrollHeightSpy = vi
      .spyOn(HTMLElement.prototype, "scrollHeight", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.dataset.testid === "scroll-parent" ? 1000 : 0;
      });
    const clientHeightSpy = vi
      .spyOn(HTMLElement.prototype, "clientHeight", "get")
      .mockImplementation(function (this: HTMLElement) {
        return this.dataset.testid === "scroll-parent" ? 500 : 0;
      });

    const { container } = render(
      <div data-testid="scroll-parent" style={{ overflowY: "auto" }}>
        <NavBar title="Inbox" largeTitleMode={true} />
      </div>,
    );
    const scrollParent = container.querySelector('[data-testid="scroll-parent"]') as HTMLElement;
    const heading = screen.getByRole("heading", { level: 1, name: "Inbox" });
    expect(heading.parentElement).toHaveStyle({ opacity: "1" });

    Object.defineProperty(scrollParent, "scrollTop", { value: 52, configurable: true });
    fireEvent.scroll(scrollParent);

    await waitFor(() => expect(heading.parentElement).toHaveStyle({ opacity: "0" }));
    // window itself never scrolled -- confirms the ancestor's scrollTop
    // (not window.scrollY) drove the collapse.
    expect(window.scrollY).toBe(0);

    scrollHeightSpy.mockRestore();
    clientHeightSpy.mockRestore();
  });

  it("renders a leading action button that calls onClick", () => {
    const onClick = vi.fn();
    render(
      <NavBar
        title="Detail"
        largeTitleMode={false}
        leadingAction={{ icon: "arrow-left", label: "Back", onClick }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("caps trailingActions at 2", () => {
    render(
      <NavBar
        title="Detail"
        largeTitleMode={false}
        trailingActions={[
          { icon: "share", label: "Share", onClick: () => {} },
          { icon: "star", label: "Favorite", onClick: () => {} },
          { icon: "trash", label: "Delete", onClick: () => {} },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Favorite" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("renders progressive blur layers by default", () => {
    const { container } = render(<NavBar title="Inbox" largeTitleMode={false} />);
    expect(container.querySelectorAll(".progressive-blur-layer").length).toBeGreaterThan(0);
  });

  it("falls back to a solid background when progressiveBlur is disabled", () => {
    const { container } = render(
      <NavBar title="Inbox" largeTitleMode={false} progressiveBlur={false} />,
    );
    expect(container.querySelectorAll(".progressive-blur-layer")).toHaveLength(0);
    expect(container.querySelector("header")).toHaveClass("bg-bg-primary");
  });
});
