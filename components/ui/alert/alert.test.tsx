import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "./alert";

describe("Alert", () => {
  it("renders title and description when open", () => {
    render(
      <Alert
        open={true}
        onOpenChange={() => {}}
        title="Test Alert"
        description="Alert Description"
        actions={[{ label: "OK", onClick: () => {} }]}
      />
    );
    
    expect(screen.getByText("Test Alert")).toBeInTheDocument();
    expect(screen.getByText("Alert Description")).toBeInTheDocument();
  });

  it("calls action onClick and onOpenChange(false) when a button is clicked", () => {
    const handleOpenChange = vi.fn();
    const handleAction = vi.fn();
    
    render(
      <Alert
        open={true}
        onOpenChange={handleOpenChange}
        title="Test Alert"
        actions={[{ label: "Confirm", onClick: handleAction }]}
      />
    );
    
    const button = screen.getByText("Confirm");
    fireEvent.click(button);
    
    expect(handleAction).toHaveBeenCalledOnce();
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
