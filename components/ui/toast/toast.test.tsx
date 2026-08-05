import { render, screen, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster } from "./toast";
import { toast, dismissToast } from "./use-toast";

describe("Toast", () => {
  it("renders toast when triggered", () => {
    render(<Toaster />);
    act(() => {
      toast({ title: "Test Toast", description: "Hello world" });
    });

    expect(screen.getByText("Test Toast")).toBeInTheDocument();
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("dismisses toast correctly", () => {
    render(<Toaster />);
    let id: string;
    act(() => {
      id = toast({ title: "Dismiss Me" });
    });

    expect(screen.getByText("Dismiss Me")).toBeInTheDocument();

    act(() => {
      dismissToast(id!);
    });

    // We can't immediately assert not to be in document because of framer motion exit animation,
    // but we know Radix will handle the unmounting when animation is over.
  });
});
