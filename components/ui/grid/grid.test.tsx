import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Grid } from "./grid";

describe("Grid", () => {
  it("renders children without error", () => {
    render(<Grid>content</Grid>);
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("applies a fixed column count", () => {
    render(
      <Grid columns={3} data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId("grid")).toHaveStyle({ gridTemplateColumns: "repeat(3, 1fr)" });
  });

  it("applies auto-fit columns with the min item width token", () => {
    render(
      <Grid columns="auto-fit" minItemWidth="md" data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId("grid")).toHaveStyle({
      gridTemplateColumns: "repeat(auto-fit, minmax(var(--grid-min-item-md), 1fr))",
    });
  });

  it("resolves gap, gapX, and gapY independently", () => {
    render(
      <Grid gap="2" gapX="4" gapY="8" data-testid="grid">
        content
      </Grid>,
    );
    expect(screen.getByTestId("grid")).toHaveStyle({
      gap: "var(--space-2)",
      columnGap: "var(--space-4)",
      rowGap: "var(--space-8)",
    });
  });

  it("emits a scoped stylesheet for responsive column tiers", () => {
    const { container } = render(
      <Grid columns={{ compact: 1, regular: 2 }}>content</Grid>,
    );
    const styleTag = container.querySelector("style");
    expect(styleTag?.textContent).toContain("grid-template-columns:repeat(1,1fr)");
    expect(styleTag?.textContent).toContain("@media (min-width:768px)");
    expect(styleTag?.textContent).toContain("grid-template-columns:repeat(2,1fr)");
  });
});
