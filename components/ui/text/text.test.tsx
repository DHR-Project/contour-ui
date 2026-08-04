import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./text";

describe("Text", () => {
  it("renders children without error, defaulting to body/p", () => {
    render(<Text>hello</Text>);
    const el = screen.getByText("hello");
    expect(el.tagName).toBe("P");
    expect(el).toHaveClass("text-body");
  });

  it("uses the default element per style, overridable via as", () => {
    const { rerender } = render(<Text textStyle="title-2">Heading</Text>);
    expect(screen.getByText("Heading").tagName).toBe("H2");

    rerender(
      <Text textStyle="title-2" as="h1">
        Heading
      </Text>,
    );
    expect(screen.getByText("Heading").tagName).toBe("H1");
  });

  it("defaults headline to semibold and body to regular", () => {
    const { rerender } = render(<Text textStyle="headline">Row title</Text>);
    expect(screen.getByText("Row title")).toHaveClass("font-semibold");

    rerender(<Text textStyle="body">Body text</Text>);
    expect(screen.getByText("Body text")).toHaveClass("font-regular");
  });

  it("allows overriding weight independent of style", () => {
    render(
      <Text textStyle="body" weight="bold">
        Emphasis
      </Text>,
    );
    expect(screen.getByText("Emphasis")).toHaveClass("font-bold");
  });

  it("maps label colors to classes and semantic tokens to inline style", () => {
    const { rerender } = render(<Text color="secondary">Muted</Text>);
    expect(screen.getByText("Muted")).toHaveClass("text-label-secondary");

    rerender(<Text color="destructive">Error</Text>);
    const el = screen.getByText("Error");
    expect(el).not.toHaveClass("text-label-secondary");
    expect(el).toHaveStyle({ color: "rgb(var(--color-destructive))" });
  });

  it("applies single-line and multi-line truncation", () => {
    const { rerender } = render(<Text truncate>Long text</Text>);
    expect(screen.getByText("Long text")).toHaveClass("truncate");

    rerender(<Text truncate={3}>Long text</Text>);
    expect(screen.getByText("Long text")).toHaveStyle({ WebkitLineClamp: "3" });
  });

  it("applies a density-{value} class only when density is non-default", () => {
    const { rerender } = render(<Text>Default</Text>);
    expect(screen.getByText("Default")).not.toHaveClass("density-tight");
    expect(screen.getByText("Default")).not.toHaveClass("density-loose");

    rerender(<Text density="tight">Tight</Text>);
    expect(screen.getByText("Tight")).toHaveClass("density-tight");

    rerender(<Text density="loose">Loose</Text>);
    expect(screen.getByText("Loose")).toHaveClass("density-loose");
  });

  it("accepts a native style prop without colliding with textStyle", () => {
    render(
      <Text textStyle="headline" style={{ marginTop: 8 }}>
        Native style
      </Text>,
    );
    const el = screen.getByText("Native style");
    expect(el.tagName).toBe("H4");
    expect(el).toHaveClass("text-headline");
    expect(el).toHaveStyle({ marginTop: "8px" });
  });
});
