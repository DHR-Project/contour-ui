import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flex } from "./flex";

describe("Flex", () => {
  it("renders children without error", () => {
    render(<Flex>content</Flex>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("applies direction, justify, align, and wrap classes", () => {
    render(
      <Flex direction="column" justify="between" align="center" wrap="wrap" data-testid="flex">
        content
      </Flex>,
    );
    const el = screen.getByTestId("flex");
    expect(el).toHaveClass("flex-col", "justify-between", "items-center", "flex-wrap");
  });

  it("resolves raw and semantic gap tokens to CSS variables", () => {
    const { rerender } = render(
      <Flex gap="4" data-testid="flex">
        content
      </Flex>,
    );
    expect(screen.getByTestId("flex")).toHaveStyle({ gap: "var(--space-4)" });

    rerender(
      <Flex gap="section" data-testid="flex">
        content
      </Flex>,
    );
    expect(screen.getByTestId("flex")).toHaveStyle({ gap: "var(--gap-section)" });
  });

  it("renders as the given element via `as`", () => {
    render(
      <Flex as="nav" data-testid="flex">
        content
      </Flex>,
    );
    expect(screen.getByTestId("flex").tagName).toBe("NAV");
  });

  it("enables container queries by default and allows opting out", () => {
    const { rerender } = render(<Flex data-testid="flex">content</Flex>);
    expect(screen.getByTestId("flex")).toHaveClass("@container");

    rerender(
      <Flex container={false} data-testid="flex">
        content
      </Flex>,
    );
    expect(screen.getByTestId("flex")).not.toHaveClass("@container");
  });
});
