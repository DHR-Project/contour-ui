import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress — circular", () => {
  it("renders a progressbar role", () => {
    render(<Progress label="Loading" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-label from label prop", () => {
    render(<Progress label="Uploading files" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-label",
      "Uploading files",
    );
  });

  it("omits aria-valuenow when indeterminate (value undefined)", () => {
    render(<Progress label="Loading" />);
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow",
    );
  });

  it("sets aria-valuenow when determinate", () => {
    render(<Progress value={42} label="Progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "42",
    );
  });

  it("sets aria-valuemin and aria-valuemax when determinate", () => {
    render(<Progress value={50} label="Progress" />);
    const bar = screen.getByRole("progressbar");
    expect(bar).toHaveAttribute("aria-valuemin", "0");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
  });

  it("renders an SVG element", () => {
    const { container } = render(<Progress label="Loading" />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("defaults to md size (24px SVG)", () => {
    const { container } = render(<Progress label="Loading" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("24");
    expect(svg?.getAttribute("height")).toBe("24");
  });

  it("respects size=sm (16px SVG)", () => {
    const { container } = render(<Progress size="sm" label="Loading" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("16");
  });

  it("respects size=lg (32px SVG)", () => {
    const { container } = render(<Progress size="lg" label="Loading" />);
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("32");
  });

  it("uses custom diameter when provided", () => {
    const { container } = render(
      <Progress diameter={48} strokeWidth={4} label="Custom" />,
    );
    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("width")).toBe("48");
  });
});

describe("Progress — linear", () => {
  it("renders a progressbar role", () => {
    render(<Progress variant="linear" value={50} label="Uploading" />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("sets aria-valuenow", () => {
    render(<Progress variant="linear" value={75} label="Progress" />);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "75",
    );
  });

  it("clamps value to [0, 100]", () => {
    const { container } = render(
      <Progress variant="linear" value={150} label="Over" />,
    );
    const fill = container.querySelector("[style]") as HTMLElement | null;
    // The fill div should be at 100% (clamped).
    expect(fill?.style.width).toBe("100%");
  });

  it("renders a fill element with correct width", () => {
    const { container } = render(
      <Progress variant="linear" value={40} label="Progress" />,
    );
    // "div > div" would also match the progressbar div itself (its parent,
    // RTL's container, is a div too) -- [style] unambiguously reaches the
    // inner fill, the only element with an inline style by default.
    const fill = container.querySelector("[style]") as HTMLElement | null;
    expect(fill?.style.width).toBe("40%");
  });
});
