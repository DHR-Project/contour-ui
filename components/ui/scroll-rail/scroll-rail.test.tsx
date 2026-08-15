import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ScrollRail } from "./scroll-rail";
import { SizeClassOverrideProvider } from "@/lib/hooks/use-size-class";

// jsdom never computes real layout -- scrollWidth/clientWidth (and their
// vertical equivalents) always read 0, so overflow must be stubbed on the
// prototype, keyed off the track's data-testid, before mount (the effect
// that measures overflow runs synchronously on mount).
function mockOverflow({
  scrollWidth = 0,
  clientWidth = 0,
  scrollHeight = 0,
  clientHeight = 0,
}: {
  scrollWidth?: number;
  clientWidth?: number;
  scrollHeight?: number;
  clientHeight?: number;
}) {
  const isTrack = function (this: HTMLElement) {
    return this.dataset.testid === "track";
  };
  const spies = [
    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockImplementation(function (this: HTMLElement) {
      return isTrack.call(this) ? scrollWidth : 0;
    }),
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
      return isTrack.call(this) ? clientWidth : 0;
    }),
    vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockImplementation(function (this: HTMLElement) {
      return isTrack.call(this) ? scrollHeight : 0;
    }),
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockImplementation(function (this: HTMLElement) {
      return isTrack.call(this) ? clientHeight : 0;
    }),
  ];
  return () => spies.forEach((spy) => spy.mockRestore());
}

function Items({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} data-item-index={index}>
          Item {index}
        </div>
      ))}
    </>
  );
}

// Lays the track at x:0/width:200 and each item at a fixed 100px slot
// (matching its data-item-index), so the activeIndex-centering math has
// real numbers to work with -- jsdom's real layout is always 0x0.
function mockRects() {
  return vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(function (
    this: HTMLElement,
  ) {
    const index = this.dataset.itemIndex;
    const left = index !== undefined ? Number(index) * 100 : 0;
    const width = index !== undefined ? 100 : 200;
    return {
      left,
      width,
      top: 0,
      height: 40,
      right: left + width,
      bottom: 40,
      x: left,
      y: 0,
      toJSON() {},
    } as DOMRect;
  });
}

describe("ScrollRail", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows no arrows when content does not overflow", () => {
    render(
      <ScrollRail data-testid="track">
        <Items />
      </ScrollRail>,
    );
    expect(screen.queryByRole("button", { name: "Scroll backward" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Scroll forward" })).not.toBeInTheDocument();
  });

  it("shows only the forward arrow when scrolled to the start with overflow", async () => {
    const restore = mockOverflow({ scrollWidth: 600, clientWidth: 200 });
    render(
      <ScrollRail data-testid="track">
        <Items />
      </ScrollRail>,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Scroll forward" })).toBeInTheDocument(),
    );
    expect(screen.queryByRole("button", { name: "Scroll backward" })).not.toBeInTheDocument();
    restore();
  });

  it("does not render arrows when showArrows is false, even with overflow", () => {
    const restore = mockOverflow({ scrollWidth: 600, clientWidth: 200 });
    render(
      <ScrollRail data-testid="track" showArrows={false}>
        <Items />
      </ScrollRail>,
    );
    expect(screen.queryByRole("button", { name: "Scroll forward" })).not.toBeInTheDocument();
    restore();
  });

  it("scrolls forward by ~70% of the track width when the forward arrow is clicked", async () => {
    const restore = mockOverflow({ scrollWidth: 600, clientWidth: 200 });
    render(
      <ScrollRail data-testid="track">
        <Items />
      </ScrollRail>,
    );
    const track = screen.getByTestId("track");
    // jsdom doesn't implement scrollBy at all -- assign rather than spyOn,
    // which requires the property to already exist.
    const scrollBySpy = vi.fn();
    track.scrollBy = scrollBySpy;

    await waitFor(() => screen.getByRole("button", { name: "Scroll forward" }));
    fireEvent.click(screen.getByRole("button", { name: "Scroll forward" }));

    expect(scrollBySpy).toHaveBeenCalledWith({ left: 140, behavior: "smooth" });
    restore();
  });

  it("uses up/down chevrons and vertical scroll classes when orientation is vertical", async () => {
    const restore = mockOverflow({ scrollHeight: 600, clientHeight: 200 });
    render(
      <ScrollRail data-testid="track" orientation="vertical">
        <Items />
      </ScrollRail>,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Scroll forward" })).toBeInTheDocument(),
    );
    expect(screen.getByTestId("track")).toHaveClass("overflow-y-auto", "scroll-mask-y");
    restore();
  });

  it("centers the active child in the track when activeIndex changes", () => {
    // Track sits at x:0/width:200 (mockRects); item 2 sits at x:200/width:100
    // -- centering it means scrolling so the item's midpoint (250) lands on
    // the track's own midpoint offset (100), i.e. scrollLeft = 250 - 100 = 150.
    mockRects();
    // jsdom doesn't implement scrollTo at all -- assign rather than spyOn,
    // which requires the property to already exist.
    const scrollToSpy = vi.fn();
    HTMLElement.prototype.scrollTo = scrollToSpy;

    render(
      <ScrollRail data-testid="track" activeIndex={2}>
        <Items />
      </ScrollRail>,
    );

    expect(scrollToSpy).toHaveBeenCalledWith({ left: 150, behavior: "smooth" });
  });

  it("hides arrows at the compact size-class even with overflow and showArrows true", async () => {
    const restore = mockOverflow({ scrollWidth: 600, clientWidth: 200 });
    render(
      <SizeClassOverrideProvider value="compact">
        <ScrollRail data-testid="track">
          <Items />
        </ScrollRail>
      </SizeClassOverrideProvider>,
    );
    // Give the overflow-measuring effect a tick to run, then confirm it
    // never rendered an arrow despite genuine overflow being present.
    await waitFor(() => expect(screen.getByTestId("track")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: "Scroll forward" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Scroll backward" })).not.toBeInTheDocument();
    restore();
  });

  it("shows arrows again at the regular size-class", async () => {
    const restore = mockOverflow({ scrollWidth: 600, clientWidth: 200 });
    render(
      <SizeClassOverrideProvider value="regular">
        <ScrollRail data-testid="track">
          <Items />
        </ScrollRail>
      </SizeClassOverrideProvider>,
    );
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Scroll forward" })).toBeInTheDocument(),
    );
    restore();
  });

  it("renders the track as the child element itself when asChild is set", () => {
    render(
      <ScrollRail asChild>
        <ul data-testid="track">
          <li>Item 0</li>
        </ul>
      </ScrollRail>,
    );
    const track = screen.getByTestId("track");
    expect(track.tagName).toBe("UL");
    expect(track).toHaveClass("overflow-x-auto");
  });
});
