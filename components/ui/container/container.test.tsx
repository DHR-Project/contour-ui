import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./container";

describe("Container", () => {
  it("renders children without error", () => {
    render(<Container>content</Container>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("applies page-edge padding for both variants", () => {
    render(<Container data-testid="container">content</Container>);
    const el = screen.getByTestId("container");
    expect(el.className).toContain("pl-[max(var(--page-margin),var(--safe-area-left))]");
    expect(el.className).toContain("pr-[max(var(--page-margin),var(--safe-area-right))]");
  });

  it("only applies max-width/centering for variant='content'", () => {
    const { rerender } = render(
      <Container variant="page" data-testid="container">
        content
      </Container>,
    );
    expect(screen.getByTestId("container").className).not.toContain("max-w-");

    rerender(
      <Container variant="content" data-testid="container">
        content
      </Container>,
    );
    expect(screen.getByTestId("container").className).toContain(
      "max-w-[var(--container-max-width)]",
    );
  });
});
