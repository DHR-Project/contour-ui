import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TextField } from "./text-field";

describe("TextField", () => {
  it("renders the given value and placeholder", () => {
    render(<TextField value="hello" onValueChange={() => {}} placeholder="Email" />);
    const input = screen.getByPlaceholderText("Email");
    expect(input).toHaveValue("hello");
  });

  it("calls onValueChange as the user types", () => {
    const onValueChange = vi.fn();
    render(<TextField value="" onValueChange={onValueChange} aria-label="Name" />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a" } });
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("disables the input when disabled", () => {
    render(<TextField value="" onValueChange={() => {}} disabled aria-label="Name" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows the error message and marks the input invalid", () => {
    render(<TextField value="" onValueChange={() => {}} aria-label="Email" error="Required" />);
    expect(screen.getByText("Required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("renders a decorative trailing icon without a button when no click handler is given", () => {
    render(<TextField value="" onValueChange={() => {}} aria-label="Search" trailingIcon="search" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders an accessible trailing icon button when onTrailingIconClick is given", () => {
    const onTrailingIconClick = vi.fn();
    render(
      <TextField
        value="hello"
        onValueChange={() => {}}
        aria-label="Name"
        trailingIcon="close"
        onTrailingIconClick={onTrailingIconClick}
        trailingIconLabel="Clear"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onTrailingIconClick).toHaveBeenCalledTimes(1);
  });

  it("uses the given input type", () => {
    render(<TextField value="" onValueChange={() => {}} aria-label="Password" type="password" />);
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });
});
