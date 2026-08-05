import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Sheet, SheetContent } from "./sheet";
import { resolveDragTarget, snapFractionToY } from "./sheet-drag";

// jsdom's matchMedia stub (vitest.setup.ts) always reports `matches: false`,
// so useIsCoarsePointer() is false here -- every test below renders the
// Modal presentation. Drag/snap-point behavior is covered separately as
// pure math on sheet-drag.ts, since simulating a real Framer Motion drag
// gesture isn't supported in jsdom (same tradeoff Slider's tests make,
// which stick to keyboard interaction only).

describe("Sheet", () => {
  it("renders content when open, nothing when closed", () => {
    const { rerender } = render(
      <Sheet open={false} onOpenChange={() => {}} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );
    expect(screen.queryByText("Sheet body")).not.toBeInTheDocument();

    rerender(
      <Sheet open={true} onOpenChange={() => {}} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );
    expect(screen.getByText("Sheet body")).toBeInTheDocument();
  });

  it("closes via the close button when dismissible (default)", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("blocks the close button when dismissible=false", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Sheet open={true} onOpenChange={onOpenChange} dismissible={false} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it("evaluates a function dismissible at close time", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    let allow = false;
    const { rerender } = render(
      <Sheet open={true} onOpenChange={onOpenChange} dismissible={() => allow} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).not.toHaveBeenCalled();

    allow = true;
    rerender(
      <Sheet open={true} onOpenChange={onOpenChange} dismissible={() => allow} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("locks the close button while an async dismissible is pending", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    let resolveDismiss: (value: boolean) => void = () => {};
    const dismissible = () => new Promise<boolean>((resolve) => (resolveDismiss = resolve));

    render(
      <Sheet open={true} onOpenChange={onOpenChange} dismissible={dismissible} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );

    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);
    expect(closeButton).toBeDisabled();
    expect(onOpenChange).not.toHaveBeenCalled();

    await act(async () => {
      resolveDismiss(true);
    });
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
  });

  it("closes on Escape when dismissible, blocks it when not", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Sheet open={true} onOpenChange={onOpenChange} dismissible={false} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );

    await user.keyboard("{Escape}");
    expect(onOpenChange).not.toHaveBeenCalled();

    rerender(
      <Sheet open={true} onOpenChange={onOpenChange} dismissible={true} title="Details">
        <SheetContent>Sheet body</SheetContent>
      </Sheet>,
    );
    await user.keyboard("{Escape}");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

describe("Sheet nesting (z-index)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("stacks z-index by 20 per depth and warns at 3+ levels deep", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    function Panel({ testId }: { testId: string }) {
      return (
        <Sheet open={true} onOpenChange={() => {}} title={testId}>
          <SheetContent data-testid={testId}>{testId}</SheetContent>
        </Sheet>
      );
    }

    render(
      <>
        <Panel testId="sheet-a" />
        <Panel testId="sheet-b" />
        <Panel testId="sheet-c" />
      </>,
    );

    await waitFor(() => {
      const a = screen.getByTestId("sheet-a");
      const b = screen.getByTestId("sheet-b");
      const c = screen.getByTestId("sheet-c");
      const zA = Number(a.style.zIndex);
      const zB = Number(b.style.zIndex);
      const zC = Number(c.style.zIndex);
      expect(zB).toBe(zA + 20);
      expect(zC).toBe(zA + 40);
    });

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("nesting reached 3 levels"));
  });
});

describe("sheet-drag math", () => {
  it("snapFractionToY maps the fully-open fraction to y=0", () => {
    expect(snapFractionToY(1, 1, 800)).toBe(0);
    expect(snapFractionToY(0, 1, 800)).toBe(800);
    expect(snapFractionToY(0.5, 1, 800)).toBe(400);
  });

  it("resolveDragTarget settles on the nearest snap point by distance", () => {
    const target = resolveDragTarget({
      currentY: 100,
      velocityY: 0,
      snapPoints: [0.4, 0.9],
      maxSnap: 0.9,
      viewportHeight: 800,
      includeDismiss: true,
    });
    // 0.9 -> y=0, 0.4 -> y=400, dismiss -> y=720. 100 is nearest to y=0 (0.9).
    expect(target).toBe(0.9);
  });

  it("resolveDragTarget commits to dismiss when dragged past the lowest snap point", () => {
    const target = resolveDragTarget({
      currentY: 750,
      velocityY: 0,
      snapPoints: [0.4, 0.9],
      maxSnap: 0.9,
      viewportHeight: 800,
      includeDismiss: true,
    });
    expect(target).toBe("dismiss");
  });

  it("resolveDragTarget commits in the fling direction above the velocity threshold", () => {
    // At y=400 (the 0.4 snap point), a fast downward flick should commit to
    // dismiss even though 0.4 is technically closer than fully-closed.
    const target = resolveDragTarget({
      currentY: 400,
      velocityY: 600,
      snapPoints: [0.4, 0.9],
      maxSnap: 0.9,
      viewportHeight: 800,
      includeDismiss: true,
    });
    expect(target).toBe("dismiss");
  });

  it("resolveDragTarget excludes dismiss when includeDismiss is false", () => {
    const target = resolveDragTarget({
      currentY: 750,
      velocityY: 0,
      snapPoints: [0.4, 0.9],
      maxSnap: 0.9,
      viewportHeight: 800,
      includeDismiss: false,
    });
    expect(target).toBe(0.4);
  });
});
