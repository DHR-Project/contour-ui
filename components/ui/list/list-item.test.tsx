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

  it("shows at most 3 trailing actions -- extras beyond the 3rd are ignored", async () => {
    const user = userEvent.setup();
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
    // 3 visible actions collapse behind the "..." trigger (see the describe
    // block below) -- open it to see which ones survived the slice(0, 3).
    await user.click(screen.getByRole("button", { name: "Show actions" }));
    expect(screen.getByRole("button", { name: "Flag" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Archive" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Share" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Delete" })).not.toBeInTheDocument();
  });

  describe("desktop collapsed trailing actions (3 actions, contour-spec-list.md SS4.4)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("shows a single trigger instead of all 3 inline; clicking it reveals them, and picking one runs it, flashes, then closes", () => {
      const onAction = vi.fn();
      render(
        <List>
          <ListItem
            key="1"
            title="Row"
            trailingActions={[
              { icon: "star", label: "Flag", color: "warning", onAction: () => {} },
              { icon: "download", label: "Archive", color: "default", onAction: () => {} },
              { icon: "trash", label: "Delete", color: "destructive", onAction },
            ]}
          />
        </List>,
      );
      expect(screen.getByRole("button", { name: "Show actions" })).toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Show actions" }));
      expect(screen.queryByRole("button", { name: "Show actions" })).not.toBeInTheDocument();

      fireEvent.click(screen.getByRole("button", { name: "Delete" }));
      // Runs immediately -- Delete has no `confirm`.
      expect(onAction).toHaveBeenCalledTimes(1);
      // But the trigger stays hidden behind the tap-feedback flash until it
      // auto-reverts (FLASH_HOLD_MS), not immediately.
      expect(screen.queryByRole("button", { name: "Show actions" })).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(screen.getByRole("button", { name: "Show actions" })).toBeInTheDocument();
    });
  });

  describe("confirm actions (contour-spec-list.md SS4.5)", () => {
    it("arms on first tap instead of running immediately, then runs on the second tap", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      render(
        <List>
          <ListItem
            key="1"
            title="Row"
            trailingActions={[{ icon: "trash", label: "Delete", color: "destructive", onAction, confirm: true }]}
          />
        </List>,
      );
      await user.click(screen.getByRole("button", { name: "Delete" }));
      expect(onAction).not.toHaveBeenCalled();

      await user.click(screen.getByRole("button", { name: "Delete" }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });

    it("cancels back without running the action on an outside click", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      render(
        <div>
          <List>
            <ListItem
              key="1"
              title="Row"
              trailingActions={[{ icon: "trash", label: "Delete", color: "destructive", onAction, confirm: true }]}
            />
          </List>
          <button type="button">Outside</button>
        </div>,
      );
      await user.click(screen.getByRole("button", { name: "Delete" }));
      await user.click(screen.getByRole("button", { name: "Outside" }));
      expect(onAction).not.toHaveBeenCalled();
      // Armed overlay is gone -- the normal row is back, not stuck expanded.
      expect(screen.getByText("Row")).toBeInTheDocument();
    });

    it("does not arm actions without confirm -- unchanged immediate-run behavior", async () => {
      const user = userEvent.setup();
      const onAction = vi.fn();
      render(
        <List>
          <ListItem
            key="1"
            title="Row"
            trailingActions={[{ icon: "download", label: "Archive", color: "default", onAction }]}
          />
        </List>,
      );
      await user.click(screen.getByRole("button", { name: "Archive" }));
      expect(onAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("non-confirm tap feedback (contour-spec-list.md SS4.5)", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("flashes the tapped action full-row, then auto-reverts without needing another tap", () => {
      const onAction = vi.fn();
      render(
        <div>
          <List>
            <ListItem
              key="1"
              title="Row"
              trailingActions={[{ icon: "download", label: "Archive", color: "default", onAction }]}
            />
          </List>
        </div>,
      );
      const row = screen.getByText("Row");
      fireEvent.click(screen.getByRole("button", { name: "Archive" }));
      // Runs immediately, unlike confirm.
      expect(onAction).toHaveBeenCalledTimes(1);
      // The row content is faded + inert behind the flash while it's up --
      // no second click needed to trigger this, it happened on the same tap.
      expect(row.closest("[inert]")).not.toBeNull();

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(row.closest("[inert]")).toBeNull();
    });

    it("does not let a second tap on the flashing overlay re-run the action", () => {
      const onAction = vi.fn();
      render(
        <List>
          <ListItem
            key="1"
            title="Row"
            trailingActions={[{ icon: "download", label: "Archive", color: "default", onAction }]}
          />
        </List>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Archive" }));
      expect(onAction).toHaveBeenCalledTimes(1);

      // Two "Archive" buttons exist while flashing: the (now inert, hidden)
      // original and the full-row flash overlay -- the overlay one is last.
      const buttons = screen.getAllByRole("button", { name: "Archive", hidden: true });
      fireEvent.click(buttons[buttons.length - 1]);
      expect(onAction).toHaveBeenCalledTimes(1);
    });
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
