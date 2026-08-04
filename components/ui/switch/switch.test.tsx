import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";

describe("Switch", () => {
  it("reflects the checked prop via data-state and forwards aria-label", () => {
    render(<Switch checked={false} onCheckedChange={() => {}} aria-label="Airplane mode" />);
    const el = screen.getByRole("switch", { name: "Airplane mode" });
    expect(el).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onCheckedChange on click", () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} aria-label="Airplane mode" />);
    fireEvent.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("renders a label that toggles the switch when clicked", () => {
    const onCheckedChange = vi.fn();
    render(<Switch checked={false} onCheckedChange={onCheckedChange} label="Notifications" />);
    fireEvent.click(screen.getByText("Notifications"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("does not call onCheckedChange when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <Switch checked={false} onCheckedChange={onCheckedChange} disabled aria-label="Airplane mode" />,
    );
    const el = screen.getByRole("switch");
    expect(el).toBeDisabled();
    fireEvent.click(el);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
