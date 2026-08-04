import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";

describe("Button", () => {
  it("renders its label", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("requires an aria-label when icon-only (no children)", () => {
    render(<Button leadingIcon="trash" aria-label="Delete" />);
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("fires onClick on click and keyboard activation", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    button.focus();
    fireEvent.keyDown(button, { key: "Enter" });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("disables interaction and sets aria-busy while loading", () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disables interaction when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("applies variant x role background colors", () => {
    const { rerender } = render(<Button variant="filled">Save</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-[rgb(var(--tint))]");

    rerender(
      <Button variant="filled" role="destructive">
        Delete
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveClass("bg-[rgb(var(--color-destructive))]");
  });

  it("applies aspect-square for icon-only buttons", () => {
    render(<Button leadingIcon="trash" aria-label="Delete" />);
    expect(screen.getByRole("button")).toHaveClass("aspect-square");
  });
});
