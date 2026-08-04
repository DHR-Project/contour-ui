import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HStack, Stack, VStack } from "./stack";

describe("Stack", () => {
  it("renders children without error", () => {
    render(<Stack direction="horizontal">content</Stack>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("maps horizontal/vertical direction to row/column", () => {
    render(
      <Stack direction="horizontal" data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveClass("flex-row");
  });

  it("defaults gap to the row semantic token", () => {
    render(<Stack direction="vertical" data-testid="stack">content</Stack>);
    expect(screen.getByTestId("stack")).toHaveStyle({ gap: "var(--padding-row-y)" });
  });

  it("allows overriding gap", () => {
    render(
      <Stack direction="vertical" gap="4" data-testid="stack">
        content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveStyle({ gap: "var(--space-4)" });
  });
});

describe("HStack / VStack", () => {
  it("HStack renders a row", () => {
    render(<HStack data-testid="hstack">content</HStack>);
    expect(screen.getByTestId("hstack")).toHaveClass("flex-row");
  });

  it("VStack renders a column", () => {
    render(<VStack data-testid="vstack">content</VStack>);
    expect(screen.getByTestId("vstack")).toHaveClass("flex-col");
  });
});
