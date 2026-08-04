import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ContextMenu } from "./context-menu";

describe("ContextMenu", () => {
  it("opens on right-click and shows items", async () => {
    render(
      <ContextMenu items={[{ type: "action", label: "Duplicate", onSelect: () => {} }]}>
        <div>Row</div>
      </ContextMenu>,
    );
    expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();

    fireEvent.contextMenu(screen.getByText("Row"));
    expect(await screen.findByText("Duplicate")).toBeInTheDocument();
  });

  it("calls onSelect and closes on item click", async () => {
    const onSelect = vi.fn();
    render(
      <ContextMenu items={[{ type: "action", label: "Duplicate", onSelect }]}>
        <div>Row</div>
      </ContextMenu>,
    );

    fireEvent.contextMenu(screen.getByText("Row"));
    const item = await screen.findByText("Duplicate");
    fireEvent.click(item);

    expect(onSelect).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByText("Duplicate")).not.toBeInTheDocument());
  });

  it("does not open when disabled", () => {
    render(
      <ContextMenu items={[{ type: "action", label: "Duplicate", onSelect: () => {} }]} disabled>
        <div>Row</div>
      </ContextMenu>,
    );
    fireEvent.contextMenu(screen.getByText("Row"));
    expect(screen.queryByText("Duplicate")).not.toBeInTheDocument();
  });
});
