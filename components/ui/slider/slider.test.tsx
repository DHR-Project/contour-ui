import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders a single thumb with the given value", () => {
    render(<Slider value={40} onValueChange={() => {}} thumbLabel="Volume" />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("aria-valuenow", "40");
  });

  it("reports a plain number back when given a plain number", () => {
    const onValueChange = vi.fn();
    render(<Slider value={40} onValueChange={onValueChange} thumbLabel="Volume" step={1} />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    fireEvent.keyDown(thumb, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith(41);
  });

  it("renders one thumb per value and reports an array back when given an array", () => {
    const onValueChange = vi.fn();
    render(
      <Slider value={[20, 70]} onValueChange={onValueChange} thumbLabel={["Start", "End"]} />,
    );
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs).toHaveLength(2);
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "20");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "70");

    thumbs[0].focus();
    fireEvent.keyDown(thumbs[0], { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith([21, 70]);
  });

  it("disables every thumb when disabled", () => {
    render(<Slider value={40} onValueChange={() => {}} disabled thumbLabel="Volume" />);
    expect(screen.getByRole("slider")).toHaveAttribute("data-disabled");
  });

  it("clamps to min/max via keyboard Home/End", () => {
    const onValueChange = vi.fn();
    render(<Slider value={40} onValueChange={onValueChange} min={0} max={100} thumbLabel="Volume" />);
    const thumb = screen.getByRole("slider");
    thumb.focus();
    fireEvent.keyDown(thumb, { key: "End" });
    expect(onValueChange).toHaveBeenCalledWith(100);
    fireEvent.keyDown(thumb, { key: "Home" });
    expect(onValueChange).toHaveBeenCalledWith(0);
  });
});
