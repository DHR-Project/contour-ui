import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon } from "./icon";

describe("Icon", () => {
  it("renders without error", () => {
    const { container } = render(<Icon name="star" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("is aria-hidden by default (decorative)", () => {
    const { container } = render(<Icon name="star" />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("exposes an accessible name when decorative is false", () => {
    const { container } = render(<Icon name="trash" decorative={false} aria-label="Delete" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toHaveAttribute("aria-hidden");
    expect(svg).toHaveAttribute("aria-label", "Delete");
  });

  it("resolves size to the matching CSS token", () => {
    const { container } = render(<Icon name="star" size="lg" />);
    expect(container.querySelector("svg")).toHaveStyle({
      width: "var(--icon-size-lg)",
      height: "var(--icon-size-lg)",
    });
  });

  it("defaults stroke to currentColor and resolves semantic overrides", () => {
    const { container, rerender } = render(<Icon name="star" />);
    expect(container.querySelector("svg")).toHaveAttribute("stroke", "currentColor");

    rerender(<Icon name="star" color="destructive" />);
    expect(container.querySelector("svg")).toHaveAttribute("stroke", "rgb(var(--color-destructive))");
  });
});
