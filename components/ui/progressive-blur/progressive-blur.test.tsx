import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressiveBlur } from "./progressive-blur";

describe("ProgressiveBlur", () => {
  it("renders a single masked blur layer", () => {
    const { container } = render(<ProgressiveBlur position="top" />);
    expect(container.querySelectorAll(".progressive-blur-layer").length).toBe(1);
  });

  it("is hidden from assistive tech (purely decorative)", () => {
    const { container } = render(<ProgressiveBlur position="top" />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden");
  });

  it("masks layers top-to-bottom when position is top (jsdom normalizes away the default 'to bottom' keyword)", () => {
    const { container } = render(<ProgressiveBlur position="top" />);
    const layers = container.querySelectorAll<HTMLElement>(".progressive-blur-layer");
    layers.forEach((layer) => {
      expect(layer.style.maskImage).not.toContain("to top");
    });
  });

  it("masks layers from bottom-to-top when position is bottom", () => {
    const { container } = render(<ProgressiveBlur position="bottom" />);
    const layers = container.querySelectorAll<HTMLElement>(".progressive-blur-layer");
    layers.forEach((layer) => {
      expect(layer.style.maskImage).toContain("to top");
    });
  });

  it("scales blur by the given intensity", () => {
    const { container } = render(<ProgressiveBlur position="top" intensity={0} />);
    const layers = container.querySelectorAll<HTMLElement>(".progressive-blur-layer");
    layers.forEach((layer) => {
      expect(layer.style.opacity).toBe("0");
    });
  });

  it("clamps out-of-range intensity to [0, 1]", () => {
    const { container } = render(<ProgressiveBlur position="top" intensity={5} />);
    const layers = container.querySelectorAll<HTMLElement>(".progressive-blur-layer");
    layers.forEach((layer) => {
      expect(layer.style.opacity).toBe("1");
    });
  });
});
