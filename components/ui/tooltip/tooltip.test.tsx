import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tooltip } from "./tooltip";

describe("Tooltip", () => {
  it("is not visible until triggered", () => {
    render(
      <Tooltip content="Delete this item">
        <button type="button">Delete</button>
      </Tooltip>,
    );
    expect(screen.queryByText("Delete this item")).not.toBeInTheDocument();
  });

  it("shows on focus and hides on blur", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete this item">
        <button type="button">Delete</button>
      </Tooltip>,
    );

    await user.tab();
    expect(await screen.findByText("Delete this item")).toBeInTheDocument();

    await user.tab();
    expect(screen.queryByText("Delete this item")).not.toBeInTheDocument();
  });

  it("shows on hover after the open delay", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content="Delete this item" openDelay={10}>
        <button type="button">Delete</button>
      </Tooltip>,
    );

    await user.hover(screen.getByText("Delete"));
    expect(await screen.findByText("Delete this item")).toBeInTheDocument();
  });
});
