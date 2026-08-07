import { act, render, screen, waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { RouteTransition } from "./route-transition";
import { useNavigationDirection } from "./use-navigation-direction";

let mockPathname = "/items";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
}));

// jsdom's matchMedia stub (vitest.setup.ts) always reports `matches: false`,
// so useSizeClass() resolves to "compact" here regardless of window width --
// matches how Sheet's tests document the same constraint for coarse-pointer
// detection.
describe("useNavigationDirection", () => {
  beforeEach(() => {
    mockPathname = "/items";
  });

  it("defaults to push on first render", () => {
    const { result } = renderHook(() => useNavigationDirection());
    expect(result.current).toBe("push");
  });

  it("reports push when the pathname changes without a popstate event", () => {
    const { result, rerender } = renderHook(() => useNavigationDirection());
    mockPathname = "/items/1";
    rerender();
    expect(result.current).toBe("push");
  });

  it("reports pop after a popstate event precedes the pathname change", () => {
    const { result, rerender } = renderHook(() => useNavigationDirection());
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    mockPathname = "/items/1";
    rerender();
    expect(result.current).toBe("pop");
  });
});

describe("RouteTransition", () => {
  beforeEach(() => {
    mockPathname = "/items";
  });

  it("renders the current route's children", () => {
    render(
      <RouteTransition>
        <div>Items list</div>
      </RouteTransition>,
    );
    expect(screen.getByText("Items list")).toBeInTheDocument();
  });

  it("renders the new route's children after a navigation", async () => {
    const { rerender } = render(
      <RouteTransition>
        <div>Items list</div>
      </RouteTransition>,
    );

    mockPathname = "/items/1";
    rerender(
      <RouteTransition>
        <div>Item detail</div>
      </RouteTransition>,
    );

    // AnimatePresence mode="wait" holds the outgoing view's exit animation
    // to completion before mounting the new one -- wait for that to settle
    // rather than asserting synchronously.
    await waitFor(() => expect(screen.getByText("Item detail")).toBeInTheDocument());
  });

  it("does not throw with caching disabled (cacheDepth 0)", () => {
    expect(() =>
      render(
        <RouteTransition cacheDepth={0}>
          <div>Items list</div>
        </RouteTransition>,
      ),
    ).not.toThrow();
  });

  it("clamps cacheDepth to the hard cap without throwing", () => {
    expect(() =>
      render(
        <RouteTransition cacheDepth={50}>
          <div>Items list</div>
        </RouteTransition>,
      ),
    ).not.toThrow();
  });
});
