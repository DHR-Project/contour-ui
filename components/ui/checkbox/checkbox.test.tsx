import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders unchecked by default and forwards aria-label", () => {
    render(<Checkbox aria-label="Accept" />);
    expect(screen.getByRole("checkbox", { name: "Accept" })).toHaveAttribute("data-state", "unchecked");
  });

  it("toggles on click and calls onCheckedChange", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole("checkbox");

    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("data-state", "checked");

    fireEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it("supports indeterminate state", () => {
    render(<Checkbox aria-label="Accept" checked="indeterminate" />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "indeterminate");
  });

  it("renders a label that toggles the checkbox when clicked", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox label="Remember me" onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByText("Remember me"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not toggle when disabled", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" disabled onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("stays controlled when `checked` is provided", () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" checked={false} onCheckedChange={onCheckedChange} />);
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-state", "unchecked");
  });
});
