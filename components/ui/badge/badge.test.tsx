import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge — counter variant", () => {
  it("renders the count value", () => {
    const { container } = render(<Badge count={5} />);
    expect(container).toHaveTextContent("5");
  });

  it("caps count at 99+", () => {
    const { container } = render(<Badge count={100} />);
    expect(container).toHaveTextContent("99+");
  });

  it("is hidden by default when count is 0", () => {
    const { container } = render(<Badge count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders when count is 0 and showZero is true", () => {
    const { container } = render(<Badge count={0} showZero />);
    expect(container.firstChild).not.toBeNull();
    expect(container).toHaveTextContent("0");
  });

  it("renders a dot without text when dot is true", () => {
    const { container } = render(<Badge dot />);
    const span = container.querySelector("span");
    expect(span).not.toBeNull();
    // No digit text inside a dot badge.
    expect(span?.textContent?.trim()).toBe("");
  });

  it("does not render when count is undefined (no dot)", () => {
    const { container } = render(<Badge />);
    expect(container.firstChild).toBeNull();
  });
});

describe("Badge — status variant", () => {
  it("renders the label text", () => {
    render(<Badge variant="status" label="New" />);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("renders with tint color by default", () => {
    const { container } = render(<Badge variant="status" label="Default" />);
    const span = container.querySelector("span");
    // Solid tone uses rgb(var(--tint)) as background
    expect(span?.style.background).toContain("rgb(var(--tint))");
  });

  it("renders with destructive color", () => {
    const { container } = render(
      <Badge variant="status" label="Error" color="destructive" />,
    );
    const span = container.querySelector("span");
    expect(span?.style.background).toContain("--color-destructive");
  });

  it("applies tinted tone with alpha background", () => {
    const { container } = render(
      <Badge variant="status" label="Info" tone="tinted" />,
    );
    const span = container.querySelector("span");
    // Tinted tone uses 0.15 alpha
    expect(span?.style.background).toContain("0.15");
  });
});
