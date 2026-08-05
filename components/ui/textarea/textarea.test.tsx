import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./textarea";

describe("Textarea", () => {
  it("renders the given value and placeholder", () => {
    render(
      <Textarea
        value="hello"
        onValueChange={() => {}}
        placeholder="Write here"
      />,
    );
    const textarea = screen.getByPlaceholderText("Write here");
    expect(textarea).toHaveValue("hello");
  });

  it("calls onValueChange as the user types", () => {
    const onValueChange = vi.fn();
    render(
      <Textarea
        value=""
        onValueChange={onValueChange}
        aria-label="Message"
      />,
    );
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "new text" },
    });
    expect(onValueChange).toHaveBeenCalledWith("new text");
  });

  it("disables the textarea when disabled is true", () => {
    render(
      <Textarea value="" onValueChange={() => {}} disabled aria-label="Name" />,
    );
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows the error message and marks the textarea invalid", () => {
    render(
      <Textarea
        value=""
        onValueChange={() => {}}
        aria-label="Description"
        error="This field is required"
      />,
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("does not show an error message when error is not set", () => {
    render(
      <Textarea value="" onValueChange={() => {}} aria-label="Description" />,
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid");
  });

  it("enforces maxLength on the underlying textarea", () => {
    render(
      <Textarea
        value=""
        onValueChange={() => {}}
        aria-label="Bio"
        maxLength={100}
      />,
    );
    expect(screen.getByRole("textbox")).toHaveAttribute("maxLength", "100");
  });

  it("renders the character counter when maxLength is set and showCounter is true", () => {
    render(
      <Textarea
        value="hello"
        onValueChange={() => {}}
        aria-label="Bio"
        maxLength={100}
        showCounter
      />,
    );
    expect(screen.getByText("5/100")).toBeInTheDocument();
  });

  it("does not render the counter when showCounter is false", () => {
    render(
      <Textarea
        value="hello"
        onValueChange={() => {}}
        aria-label="Bio"
        maxLength={100}
        showCounter={false}
      />,
    );
    expect(screen.queryByText("5/100")).not.toBeInTheDocument();
  });

  it("does not render the counter when maxLength is not set", () => {
    render(
      <Textarea value="hello" onValueChange={() => {}} aria-label="Bio" />,
    );
    // No "X/undefined" text should appear.
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  it("counter reflects the current value length", () => {
    const { rerender } = render(
      <Textarea
        value="abc"
        onValueChange={() => {}}
        aria-label="Bio"
        maxLength={50}
      />,
    );
    expect(screen.getByText("3/50")).toBeInTheDocument();

    rerender(
      <Textarea
        value="abcdef"
        onValueChange={() => {}}
        aria-label="Bio"
        maxLength={50}
      />,
    );
    expect(screen.getByText("6/50")).toBeInTheDocument();
  });
});
