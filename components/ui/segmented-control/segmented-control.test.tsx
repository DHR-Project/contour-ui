import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "./segmented-control";

function mockCoarsePointer() {
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) => ({
    matches: query.includes("pointer: coarse"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }));
}

// Lays segments out left-to-right at fixed 100px slots, matching their
// `data-drag-select-index` order, so hit-testing by clientX/clientY has
// something real to compare against (jsdom's real layout is always 0x0).
function mockSegmentRects() {
  document.querySelectorAll<HTMLElement>("[data-drag-select-index]").forEach((row) => {
    const index = Number(row.dataset.dragSelectIndex);
    vi.spyOn(row, "getBoundingClientRect").mockReturnValue({
      left: index * 100,
      right: index * 100 + 100,
      top: 0,
      bottom: 40,
      width: 100,
      height: 40,
      x: index * 100,
      y: 0,
      toJSON() {},
    } as DOMRect);
  });
}

const OPTIONS = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
];

describe("SegmentedControl", () => {
  it("renders one option per segment and marks the active one pressed", () => {
    render(<SegmentedControl value="day" onValueChange={() => {}} options={OPTIONS} />);
    const buttons = screen.getAllByRole("radio");
    expect(buttons).toHaveLength(3);
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute("data-state", "on");
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute("data-state", "off");
  });

  it("calls onValueChange when a different segment is clicked", () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl value="day" onValueChange={onValueChange} options={OPTIONS} />);
    fireEvent.click(screen.getByRole("radio", { name: "Week" }));
    expect(onValueChange).toHaveBeenCalledWith("week");
  });

  it("does not call onValueChange when the already-active segment is clicked again", () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl value="day" onValueChange={onValueChange} options={OPTIONS} />);
    fireEvent.click(screen.getByRole("radio", { name: "Day" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("stretches segments with flex-1 when fullWidth (default)", () => {
    render(<SegmentedControl value="day" onValueChange={() => {}} options={OPTIONS} />);
    expect(screen.getByRole("radio", { name: "Day" })).toHaveClass("flex-1");
  });

  it("does not stretch segments when fullWidth is false", () => {
    render(
      <SegmentedControl value="day" onValueChange={() => {}} options={OPTIONS} fullWidth={false} />,
    );
    expect(screen.getByRole("radio", { name: "Day" })).not.toHaveClass("flex-1");
  });

  describe("drag-select (contour-spec-dropdown-v2.md SSA.5)", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("commits the segment under the finger as the drag crosses into it", () => {
      mockCoarsePointer();
      const onValueChange = vi.fn();
      render(<SegmentedControl value="day" onValueChange={onValueChange} options={OPTIONS} />);
      mockSegmentRects();

      const container = screen.getByRole("radio", { name: "Day" }).parentElement!;
      fireEvent.pointerDown(container, { pointerType: "touch", clientX: 10, clientY: 10 });
      fireEvent.pointerMove(document, { clientX: 250, clientY: 10 }); // over "month" (index 2)
      fireEvent.pointerUp(document, { clientX: 250, clientY: 10 });

      expect(onValueChange).toHaveBeenCalledWith("month");
    });

    it("does nothing on mouse (fine pointer)", () => {
      mockCoarsePointer();
      const onValueChange = vi.fn();
      render(<SegmentedControl value="day" onValueChange={onValueChange} options={OPTIONS} />);
      mockSegmentRects();

      const container = screen.getByRole("radio", { name: "Day" }).parentElement!;
      fireEvent.pointerDown(container, { pointerType: "mouse", clientX: 10, clientY: 10 });
      fireEvent.pointerMove(document, { clientX: 250, clientY: 10 });
      fireEvent.pointerUp(document, { clientX: 250, clientY: 10 });

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
