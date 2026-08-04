import type { Story } from "@ladle/react";
import { Tooltip } from "./tooltip";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Tooltip",
};

export default meta;

/**
 * Fade only (no scale), triggered by hover/focus rather than click -- a
 * separate Radix primitive from Dropdown, not sharing DropdownMenu
 * (contour-spec-dropdown.md SSB.2). 700ms open delay by default.
 */
export const Default: Story = () => (
  <div className="pt-16 pl-16">
    <Tooltip content="Delete this item">
      <Button variant="plain" leadingIcon="trash" aria-label="Delete" />
    </Tooltip>
  </div>
);

export const OnText: Story = () => (
  <div className="pt-16 pl-16">
    <Tooltip content="Synced 2 minutes ago">
      <button type="button" className="text-footnote text-label-secondary underline decoration-dotted">
        Last synced
      </button>
    </Tooltip>
  </div>
);

export const InstantOpenDelay: Story = () => (
  <div className="pt-16 pl-16">
    <HStack gap="3">
      <Tooltip content="Opens quickly" openDelay={100}>
        <Button variant="plain">Fast tooltip</Button>
      </Tooltip>
      <Tooltip content="Opens after the default 700ms delay">
        <Button variant="plain">Default tooltip</Button>
      </Tooltip>
    </HStack>
  </div>
);
