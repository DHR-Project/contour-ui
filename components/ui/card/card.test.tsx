import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./card";

describe("Card", () => {
  it("renders children without error", () => {
    render(<Card>content</Card>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("defaults to flat elevation with a border, no shadow", () => {
    render(<Card data-testid="card">content</Card>);
    const el = screen.getByTestId("card");
    expect(el).toHaveClass("border", "border-separator");
    expect(el).not.toHaveClass("shadow-sm");
  });

  it("raised elevation adds shadow-sm instead of a border", () => {
    render(
      <Card elevation="raised" data-testid="card">
        content
      </Card>,
    );
    const el = screen.getByTestId("card");
    expect(el).toHaveClass("shadow-sm");
    expect(el).not.toHaveClass("border");
  });

  // toHaveStyle can't resolve the `padding` shorthand + var() combo through
  // jsdom's getComputedStyle, so these assert the inline style directly.
  it("defaults padding to the responsive inset-grouped-margin-x token", () => {
    render(<Card data-testid="card">content</Card>);
    expect((screen.getByTestId("card") as HTMLElement).style.padding).toBe(
      "var(--inset-grouped-margin-x)",
    );
  });

  it("uses a fixed raw SpaceToken padding when given", () => {
    render(
      <Card padding="4" data-testid="card">
        content
      </Card>,
    );
    expect((screen.getByTestId("card") as HTMLElement).style.padding).toBe("var(--space-4)");
  });

  it("renders as the given element via `as`", () => {
    render(
      <Card as="article" data-testid="card">
        content
      </Card>,
    );
    expect(screen.getByTestId("card").tagName).toBe("ARTICLE");
  });
});
