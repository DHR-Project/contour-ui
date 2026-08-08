import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SplitView } from "./split-view";
import { SizeClassOverrideProvider } from "@/lib/hooks/use-size-class";
import { CoarsePointerOverrideProvider } from "@/lib/hooks/use-coarse-pointer";

describe("SplitView", () => {
  it("renders both sidebar and content", () => {
    render(
      <SizeClassOverrideProvider value="regular-lg">
        <CoarsePointerOverrideProvider value={false}>
          <SplitView sidebar={<div>Sidebar nav</div>}>
            <div>Route content</div>
          </SplitView>
        </CoarsePointerOverrideProvider>
      </SizeClassOverrideProvider>,
    );
    expect(screen.getByText("Sidebar nav")).toBeInTheDocument();
    expect(screen.getByText("Route content")).toBeInTheDocument();
  });

  it("pads content and shows a resize handle on regular+ with a fine pointer", () => {
    render(
      <SizeClassOverrideProvider value="regular-lg">
        <CoarsePointerOverrideProvider value={false}>
          <SplitView sidebar={<div>Sidebar nav</div>}>
            <div>Route content</div>
          </SplitView>
        </CoarsePointerOverrideProvider>
      </SizeClassOverrideProvider>,
    );

    expect(screen.getByRole("separator", { name: "Resize sidebar" })).toBeInTheDocument();
    expect(screen.getByText("Route content").parentElement).toHaveClass("pl-(--sidebar-current-width)");
  });

  it("omits the resize handle on a coarse pointer", () => {
    render(
      <SizeClassOverrideProvider value="regular-lg">
        <CoarsePointerOverrideProvider value={true}>
          <SplitView sidebar={<div>Sidebar nav</div>}>
            <div>Route content</div>
          </SplitView>
        </CoarsePointerOverrideProvider>
      </SizeClassOverrideProvider>,
    );

    expect(screen.queryByRole("separator", { name: "Resize sidebar" })).not.toBeInTheDocument();
  });

  it("hides the sidebar entirely and drops content padding on compact", () => {
    render(
      <SizeClassOverrideProvider value="compact">
        <CoarsePointerOverrideProvider value={false}>
          <SplitView sidebar={<div>Sidebar nav</div>}>
            <div>Route content</div>
          </SplitView>
        </CoarsePointerOverrideProvider>
      </SizeClassOverrideProvider>,
    );

    expect(screen.queryByText("Sidebar nav")).not.toBeInTheDocument();
    expect(screen.getByText("Route content").parentElement).not.toHaveClass("pl-(--sidebar-current-width)");
    expect(screen.queryByRole("separator", { name: "Resize sidebar" })).not.toBeInTheDocument();
  });
});
