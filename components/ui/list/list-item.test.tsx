import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { List } from "./list";
import { ListItem } from "./list-item";

function touchAt(clientX: number, clientY: number) {
  return { touches: [{ clientX, clientY }] };
}

describe("ListItem", () => {
  it("renders title, subtitle, and trailing text", () => {
    render(
      <List>
        <ListItem key="1" title="Notifications" subtitle="On for messages" trailingText="3" />
      </List>,
    );
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("On for messages")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders as a native button and fires onClick when interactive", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <List>
        <ListItem key="1" title="Account" onClick={onClick} />
      </List>,
    );
    const button = screen.getByRole("button", { name: /Account/ });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not render an interactive role when onClick is absent", () => {
    render(
      <List>
        <ListItem key="1" title="Version" trailingText="1.0.0" />
      </List>,
    );
    expect(screen.queryByRole("button", { name: /Version/ })).not.toBeInTheDocument();
  });

  it("disables interaction when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <List>
        <ListItem key="1" title="Account" onClick={onClick} disabled />
      </List>,
    );
    const button = screen.getByRole("button", { name: /Account/ });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders trailing action buttons that fire onAction", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <List>
        <ListItem
          key="1"
          title="Swipe me"
          trailingActions={[{ icon: "trash", label: "Delete", color: "destructive", onAction }]}
        />
      </List>,
    );
    await user.click(screen.getByRole("button", { name: /Delete/ }));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it("collapses the 4th+ trailing action into a More button", () => {
    render(
      <List>
        <ListItem
          key="1"
          title="Row"
          trailingActions={[
            { icon: "star", label: "Flag", color: "warning", onAction: () => {} },
            { icon: "download", label: "Archive", color: "default", onAction: () => {} },
            { icon: "share", label: "Share", color: "tint", onAction: () => {} },
            { icon: "trash", label: "Delete", color: "destructive", onAction: () => {} },
          ]}
        />
      </List>,
    );
    expect(screen.getByRole("button", { name: "Flag" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "More actions" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Share" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  it("renders a leading action button", () => {
    render(
      <List>
        <ListItem
          key="1"
          title="Row"
          leadingAction={{ icon: "check", label: "Read", color: "tint", onAction: () => {} }}
        />
      </List>,
    );
    expect(screen.getByRole("button", { name: "Read" })).toBeInTheDocument();
  });

  describe("contextMenuItems (contour-spec-context-menu.md)", () => {
    it("opens on right-click when passed", async () => {
      render(
        <List>
          <ListItem
            key="1"
            title="Row"
            contextMenuItems={[{ type: "action", label: "Rename", onSelect: () => {} }]}
          />
        </List>,
      );
      expect(screen.queryByText("Rename")).not.toBeInTheDocument();
      fireEvent.contextMenu(screen.getByText("Row"));
      expect(await screen.findByText("Rename")).toBeInTheDocument();
    });

    it("does not wrap the row in a menu when not passed (right-click untouched)", () => {
      render(
        <List>
          <ListItem key="1" title="Row" />
        </List>,
      );
      fireEvent.contextMenu(screen.getByText("Row"));
      // No custom popover renders at all -- nothing to query for; this just
      // documents that firing contextmenu on a plain row is a no-op here.
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    describe("touch long-press disambiguation (contour-spec-context-menu.md SS3)", () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it("opens the menu after holding still past the threshold", () => {
        render(
          <List>
            <ListItem
              key="1"
              title="Row"
              contextMenuItems={[{ type: "action", label: "Rename", onSelect: () => {} }]}
            />
          </List>,
        );
        const row = screen.getByText("Row");
        fireEvent.touchStart(row, touchAt(10, 10));

        act(() => {
          vi.advanceTimersByTime(500);
        });

        expect(screen.getByText("Rename")).toBeInTheDocument();
      });

      it("cancels the long-press when the finger moves past the tolerance before the timer fires", () => {
        render(
          <List>
            <ListItem
              key="1"
              title="Row"
              contextMenuItems={[{ type: "action", label: "Rename", onSelect: () => {} }]}
            />
          </List>,
        );
        const row = screen.getByText("Row");
        fireEvent.touchStart(row, touchAt(10, 10));
        fireEvent.touchMove(row, touchAt(10, 30)); // |ΔY| = 20 > 10px tolerance

        act(() => {
          vi.advanceTimersByTime(500);
        });

        expect(screen.queryByText("Rename")).not.toBeInTheDocument();
      });

      it("cancels the long-press on touchend before the timer fires", () => {
        render(
          <List>
            <ListItem
              key="1"
              title="Row"
              contextMenuItems={[{ type: "action", label: "Rename", onSelect: () => {} }]}
            />
          </List>,
        );
        const row = screen.getByText("Row");
        fireEvent.touchStart(row, touchAt(10, 10));
        fireEvent.touchEnd(row);

        act(() => {
          vi.advanceTimersByTime(500);
        });

        expect(screen.queryByText("Rename")).not.toBeInTheDocument();
      });
    });
  });
});
