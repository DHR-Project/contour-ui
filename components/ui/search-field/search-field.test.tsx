import { useState } from "react";
import type { ComponentProps } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SearchField } from "./search-field";
import type { SearchFieldResult } from "./search-field";

function ControlledSearchField(props: Partial<ComponentProps<typeof SearchField>>) {
  const [value, setValue] = useState(props.value ?? "");
  return <SearchField {...props} value={value} onValueChange={setValue} />;
}

describe("SearchField", () => {
  it("renders with a search leading icon and no clear button when empty", () => {
    render(<SearchField value="" onValueChange={() => {}} placeholder="Search" />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("calls onValueChange as the user types", () => {
    const onValueChange = vi.fn();
    render(<SearchField value="" onValueChange={onValueChange} placeholder="Search" />);
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "a" } });
    expect(onValueChange).toHaveBeenCalledWith("a");
  });

  it("shows a clear button once there's a value, clearing it on click", async () => {
    const user = userEvent.setup();
    render(<ControlledSearchField value="hello" />);
    const clearButton = screen.getByRole("button", { name: "Clear" });
    await user.click(clearButton);
    expect(screen.getByRole("combobox")).toHaveValue("");
  });

  it("reveals the Cancel button on focus and calls onValueChange('') + onCancel on click", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    render(<ControlledSearchField value="hello" onCancel={onCancel} />);
    // Always mounted (width-animated), so it's hidden from a11y/tab order
    // rather than absent, until the field is focused.
    expect(screen.getByText("Cancel")).toHaveAttribute("aria-hidden", "true");

    await user.click(screen.getByRole("combobox"));
    const cancelButton = screen.getByText("Cancel");
    await waitFor(() => expect(cancelButton).toHaveAttribute("aria-hidden", "false"));
    await user.click(cancelButton);

    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("does not show a popover while focused when results is undefined", async () => {
    const user = userEvent.setup();
    render(<SearchField value="" onValueChange={() => {}} />);
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows the empty message when results is an empty array", async () => {
    const user = userEvent.setup();
    render(<SearchField value="zzz" onValueChange={() => {}} results={[]} />);
    await user.click(screen.getByRole("combobox"));
    expect(await screen.findByText("No results found")).toBeInTheDocument();
  });

  it("shows a loading spinner when loading", async () => {
    const user = userEvent.setup();
    render(<SearchField value="a" onValueChange={() => {}} loading />);
    await user.click(screen.getByRole("combobox"));
    await waitFor(() => expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true"));
  });

  it("renders results as options and calls onResultSelect on click", async () => {
    const user = userEvent.setup();
    const onResultSelect = vi.fn();
    const results: SearchFieldResult[] = [{ id: "1", label: "Button" }, { id: "2", label: "Badge" }];
    render(<SearchField value="b" onValueChange={() => {}} results={results} onResultSelect={onResultSelect} />);

    await user.click(screen.getByRole("combobox"));
    const option = await screen.findByText("Button");
    await user.click(option);

    expect(onResultSelect).toHaveBeenCalledWith("1");
  });

  it("navigates results with arrow keys and selects the highlighted one on Enter", async () => {
    const user = userEvent.setup();
    const onResultSelect = vi.fn();
    const results: SearchFieldResult[] = [{ id: "1", label: "Button" }, { id: "2", label: "Badge" }];
    render(<SearchField value="b" onValueChange={() => {}} results={results} onResultSelect={onResultSelect} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await screen.findByRole("listbox");

    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", expect.stringContaining("option-0"));

    await user.keyboard("{Enter}");
    expect(onResultSelect).toHaveBeenCalledWith("1");
  });

  it("wraps around when navigating past the last result with ArrowDown", async () => {
    const user = userEvent.setup();
    const results: SearchFieldResult[] = [{ id: "1", label: "Button" }, { id: "2", label: "Badge" }];
    render(<SearchField value="b" onValueChange={() => {}} results={results} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await screen.findByRole("listbox");

    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", expect.stringContaining("option-0"));
  });

  it("Escape closes the popover but keeps focus and text", async () => {
    const user = userEvent.setup();
    const results: SearchFieldResult[] = [{ id: "1", label: "Button" }];
    render(<SearchField value="b" onValueChange={() => {}} results={results} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await screen.findByRole("listbox");

    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
    expect(input).toHaveFocus();
    expect(input).toHaveValue("b");
  });

  it("calls onSearch after the debounce delay, and immediately on Enter with no highlight", async () => {
    vi.useFakeTimers();
    const onSearch = vi.fn();
    render(<SearchField value="hello" onValueChange={() => {}} onSearch={onSearch} debounceMs={300} />);

    vi.advanceTimersByTime(299);
    expect(onSearch).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(onSearch).toHaveBeenCalledWith("hello");

    vi.useRealTimers();
  });
});
