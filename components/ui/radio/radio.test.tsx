import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RadioGroup } from "./radio";

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

// Lays options out at fixed 100px vertical slots, matching their
// `data-drag-select-index` order, so hit-testing by clientX/clientY has
// something real to compare against (jsdom's real layout is always 0x0).
function mockOptionRects() {
  document.querySelectorAll<HTMLElement>("[data-drag-select-index]").forEach((row) => {
    const index = Number(row.dataset.dragSelectIndex);
    vi.spyOn(row, "getBoundingClientRect").mockReturnValue({
      left: 0,
      right: 200,
      top: index * 40,
      bottom: index * 40 + 40,
      width: 200,
      height: 40,
      x: 0,
      y: index * 40,
      toJSON() {},
    } as DOMRect);
  });
}

const OPTIONS = [
  { value: "a", label: "Option A" },
  { value: "b", label: "Option B" },
];

describe("RadioGroup", () => {
  it("renders one radio per option and marks the selected value", () => {
    render(<RadioGroup value="a" onValueChange={() => {}} options={OPTIONS} />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
    expect(radios[0]).toHaveAttribute("data-state", "checked");
    expect(radios[1]).toHaveAttribute("data-state", "unchecked");
  });

  it("calls onValueChange when a different option is selected via its label", () => {
    const onValueChange = vi.fn();
    render(<RadioGroup value="a" onValueChange={onValueChange} options={OPTIONS} />);
    fireEvent.click(screen.getByText("Option B"));
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("disables an individual option via `disabled`", () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        value="a"
        onValueChange={onValueChange}
        options={[...OPTIONS, { value: "c", label: "Option C", disabled: true }]}
      />,
    );
    fireEvent.click(screen.getByText("Option C"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("disables every option when the group is disabled", () => {
    const onValueChange = vi.fn();
    render(<RadioGroup value="a" onValueChange={onValueChange} options={OPTIONS} disabled />);
    fireEvent.click(screen.getByText("Option B"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("lays out options horizontally when direction=horizontal", () => {
    render(
      <RadioGroup value="a" onValueChange={() => {}} options={OPTIONS} direction="horizontal" />,
    );
    expect(screen.getByRole("radiogroup").firstElementChild).toHaveClass("flex-row");
  });

  describe("drag-select (contour-spec-dropdown-v2.md SSA.5)", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("commits the option under the finger as the drag crosses into it", () => {
      mockCoarsePointer();
      const onValueChange = vi.fn();
      render(<RadioGroup value="a" onValueChange={onValueChange} options={OPTIONS} />);
      mockOptionRects();

      const group = screen.getByRole("radiogroup");
      fireEvent.pointerDown(group, { pointerType: "touch", clientX: 10, clientY: 10 });
      fireEvent.pointerMove(document, { clientX: 10, clientY: 50 }); // over "Option B" (index 1)
      fireEvent.pointerUp(document, { clientX: 10, clientY: 50 });

      expect(onValueChange).toHaveBeenCalledWith("b");
    });

    it("skips a disabled option under the finger", () => {
      mockCoarsePointer();
      const onValueChange = vi.fn();
      render(
        <RadioGroup
          value="a"
          onValueChange={onValueChange}
          options={[...OPTIONS, { value: "c", label: "Option C", disabled: true }]}
        />,
      );
      mockOptionRects();

      const group = screen.getByRole("radiogroup");
      // Starts outside any option's (mocked) rect so the press itself
      // doesn't register a hit -- isolates the assertion to the drag
      // landing on the disabled option.
      fireEvent.pointerDown(group, { pointerType: "touch", clientX: 10, clientY: -100 });
      fireEvent.pointerMove(document, { clientX: 10, clientY: 90 }); // over "Option C" (index 2)
      fireEvent.pointerUp(document, { clientX: 10, clientY: 90 });

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });
});
