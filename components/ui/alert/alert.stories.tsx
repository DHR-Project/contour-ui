import type { Story } from "@ladle/react";
import { useState } from "react";
import { Alert } from "./alert";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components / Alert",
};
export default meta;

export const TwoActionsRow: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Delete item...</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="Delete this item?"
        description="This action cannot be undone."
        actions={[
          { label: "Cancel", role: "cancel", onClick: () => {} },
          { label: "Delete", role: "destructive", emphasized: true, onClick: () => {} },
        ]}
      />
    </div>
  );
};

export const OneAction: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Connection lost</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="Connection Lost"
        description="Please check your internet connection and try again."
        actions={[
          { label: "OK", role: "cancel", emphasized: true, onClick: () => {} },
        ]}
      />
    </div>
  );
};

export const ThreeActionsCol: Story = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>Discard draft?</Button>
      <Alert
        open={open}
        onOpenChange={setOpen}
        title="Discard draft?"
        actions={[
          { label: "Save Draft", role: "default", onClick: () => {} },
          { label: "Discard", role: "destructive", onClick: () => {} },
          { label: "Cancel", role: "cancel", emphasized: true, onClick: () => {} },
        ]}
      />
    </div>
  );
};
