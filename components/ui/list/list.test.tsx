import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { List } from "./list";
import { ListItem } from "./list-item";

describe("List", () => {
  it("renders each ListItem as a list item", () => {
    render(
      <List>
        <ListItem key="1" title="First" />
        <ListItem key="2" title="Second" />
      </List>,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("applies grouped styling only for style='grouped'", () => {
    const { container, rerender } = render(
      <List>
        <ListItem key="1" title="First" />
      </List>,
    );
    expect(container.querySelector("ul")).not.toHaveClass("rounded-lg");

    rerender(
      <List style="grouped">
        <ListItem key="1" title="First" />
      </List>,
    );
    expect(container.querySelector("ul")).toHaveClass("rounded-lg");
  });

  it("removes an item from the DOM after it's removed from children", async () => {
    const { rerender } = render(
      <List>
        <ListItem key="1" title="First" />
        <ListItem key="2" title="Second" />
      </List>,
    );
    expect(screen.getByText("Second")).toBeInTheDocument();

    rerender(
      <List>
        <ListItem key="1" title="First" />
      </List>,
    );

    await waitFor(() => expect(screen.queryByText("Second")).not.toBeInTheDocument(), { timeout: 2000 });
    expect(screen.getByText("First")).toBeInTheDocument();
  });
});
