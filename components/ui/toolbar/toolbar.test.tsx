import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Toolbar } from "./toolbar";

describe("Toolbar", () => {
  it("renders one button per action with its label", () => {
    render(
      <Toolbar
        actions={[
          { icon: "share", label: "Share", onClick: () => {} },
          { icon: "trash", label: "Delete", onClick: () => {} },
        ]}
      />,
    );
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("calls the action's onClick when clicked", () => {
    const onClick = vi.fn();
    render(<Toolbar actions={[{ icon: "share", label: "Share", onClick }]} />);
    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("falls back to the icon name as an accessible label for icon-only actions", () => {
    render(<Toolbar actions={[{ icon: "share", onClick: () => {} }]} />);
    expect(screen.getByRole("button", { name: "share" })).toBeInTheDocument();
  });

  it("renders progressive blur layers by default", () => {
    const { container } = render(<Toolbar actions={[{ icon: "share", label: "Share", onClick: () => {} }]} />);
    expect(container.querySelectorAll(".progressive-blur-layer").length).toBeGreaterThan(0);
  });

  it("falls back to a solid background when progressiveBlur is disabled", () => {
    const { container } = render(
      <Toolbar progressiveBlur={false} actions={[{ icon: "share", label: "Share", onClick: () => {} }]} />,
    );
    expect(container.querySelectorAll(".progressive-blur-layer")).toHaveLength(0);
    expect(container.firstElementChild).toHaveClass("bg-bg-primary");
  });

  it("positions at the bottom by default and at the top when requested", () => {
    const { container: bottomContainer } = render(
      <Toolbar actions={[{ icon: "share", label: "Share", onClick: () => {} }]} />,
    );
    expect(bottomContainer.firstElementChild).toHaveClass("bottom-0");

    const { container: topContainer } = render(
      <Toolbar position="top" actions={[{ icon: "share", label: "Share", onClick: () => {} }]} />,
    );
    expect(topContainer.firstElementChild).toHaveClass("top-0");
  });
});
