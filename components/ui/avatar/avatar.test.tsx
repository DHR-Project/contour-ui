import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders without crashing (no props)", () => {
    const { container } = render(<Avatar />);
    expect(container.firstChild).not.toBeNull();
  });

  it("renders initials from a full name", () => {
    const { container } = render(<Avatar name="Alice Johnson" />);
    // Initials should be "AJ".
    expect(container).toHaveTextContent("AJ");
  });

  it("renders a single initial for a one-word name", () => {
    const { container } = render(<Avatar name="Alice" />);
    expect(container).toHaveTextContent("A");
  });

  it("uses the first and last word for initials in multi-word names", () => {
    const { container } = render(<Avatar name="Alice Marie Johnson" />);
    // First word "Alice" + last word "Johnson" → "AJ".
    expect(container).toHaveTextContent("AJ");
  });

  it("applies the circle shape class by default", () => {
    const { container } = render(<Avatar name="Test User" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-full");
  });

  it("applies squircle shape class when specified", () => {
    const { container } = render(<Avatar name="Test User" shape="squircle" />);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-[30%]");
  });

  it("applies size class for each size", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl"] as const;
    const expectedClasses: Record<typeof sizes[number], string> = {
      xs: "h-6",
      sm: "h-8",
      md: "h-10",
      lg: "h-14",
      xl: "h-20",
    };
    sizes.forEach((size) => {
      const { container } = render(<Avatar name="Test" size={size} />);
      const root = container.firstChild as HTMLElement;
      expect(root.className).toContain(expectedClasses[size]);
    });
  });

  it("generates a deterministic background color from the name", () => {
    const { container: c1 } = render(<Avatar name="Alice Johnson" />);
    const { container: c2 } = render(<Avatar name="Alice Johnson" />);
    const fallback1 = c1.querySelector("[style]") as HTMLElement;
    const fallback2 = c2.querySelector("[style]") as HTMLElement;
    // Same name → same background style.
    expect(fallback1.style.background).toBe(fallback2.style.background);
  });

  it("generates different colors for different names", () => {
    const { container: c1 } = render(<Avatar name="Alice Johnson" />);
    const { container: c2 } = render(<Avatar name="Bob Smith" />);
    const fallback1 = c1.querySelector("[style]") as HTMLElement;
    const fallback2 = c2.querySelector("[style]") as HTMLElement;
    // Different names are very likely to produce different colors (not guaranteed,
    // but the test names were chosen to produce distinct hashes).
    expect(fallback1.style.background).not.toBe(fallback2.style.background);
  });
});
