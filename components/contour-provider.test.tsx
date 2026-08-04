import { render, screen } from "@testing-library/react";
import { act } from "react";
import { describe, expect, it, beforeEach } from "vitest";
import { ContourProvider, useContourSizeMode } from "./contour-provider";

function Consumer() {
  const { sizeMode, setSizeMode } = useContourSizeMode();
  return (
    <button onClick={() => setSizeMode("xxxLarge")} data-size-mode={sizeMode}>
      {sizeMode}
    </button>
  );
}

describe("ContourProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.style.cssText = "";
  });

  it("defaults to sizeMode 'large', matching the SSR-safe baseline in tokens.css", () => {
    render(
      <ContourProvider>
        <Consumer />
      </ContourProvider>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("data-size-mode", "large");
  });

  it("updates --text-body-size on :root and persists the choice when sizeMode changes", async () => {
    render(
      <ContourProvider>
        <Consumer />
      </ContourProvider>,
    );

    await act(async () => {
      screen.getByRole("button").click();
    });

    expect(screen.getByRole("button")).toHaveAttribute("data-size-mode", "xxxLarge");
    expect(document.documentElement.style.getPropertyValue("--text-body-size")).toBe(`${23 / 16}rem`);
    expect(window.localStorage.getItem("contour-size-mode")).toBe("xxxLarge");
  });

  it("restores a persisted sizeMode from localStorage on mount", () => {
    window.localStorage.setItem("contour-size-mode", "xSmall");

    render(
      <ContourProvider>
        <Consumer />
      </ContourProvider>,
    );

    expect(screen.getByRole("button")).toHaveAttribute("data-size-mode", "xSmall");
  });
});
