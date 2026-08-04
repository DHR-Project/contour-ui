import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListItemContent } from "./list-item-content";

describe("ListItemContent", () => {
  it("renders the title", () => {
    render(<ListItemContent title="Notifications" />);
    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("renders subtitle only when given", () => {
    const { rerender } = render(<ListItemContent title="Title" />);
    expect(screen.queryByText("Subtitle")).not.toBeInTheDocument();

    rerender(<ListItemContent title="Title" subtitle="Subtitle" />);
    expect(screen.getByText("Subtitle")).toBeInTheDocument();
  });

  it("renders a leading icon only when given", () => {
    const { container, rerender } = render(<ListItemContent title="Title" />);
    expect(container.querySelector("svg")).not.toBeInTheDocument();

    rerender(<ListItemContent title="Title" leadingIcon="bell" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders arbitrary trailing content", () => {
    render(<ListItemContent title="Title" trailing={<span>trailing content</span>} />);
    expect(screen.getByText("trailing content")).toBeInTheDocument();
  });

  it("truncates title and subtitle by default", () => {
    render(<ListItemContent title="Title" subtitle="Subtitle" />);
    expect(screen.getByText("Title")).toHaveClass("truncate");
    expect(screen.getByText("Subtitle")).toHaveClass("truncate");
  });
});
