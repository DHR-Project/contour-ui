// Tooltip has no open/defaultOpen prop -- it's fully self-managed internal
// state (opens on hover/focus after openDelay), so these exports render the
// trigger only. See .design-sync/learnings/nav-overlay-batch-c.md.
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/stack";

export function OnIconButton() {
  return (
    <Tooltip content="Delete this item">
      <Button variant="plain" leadingIcon="trash" aria-label="Delete" />
    </Tooltip>
  );
}

export function OnText() {
  return (
    <Tooltip content="Synced 2 minutes ago">
      <button type="button" className="text-footnote text-label-secondary underline decoration-dotted">
        Last synced
      </button>
    </Tooltip>
  );
}

export function OpenDelays() {
  return (
    <HStack gap="3">
      <Tooltip content="Opens quickly" openDelay={100}>
        <Button variant="plain">Fast tooltip</Button>
      </Tooltip>
      <Tooltip content="Opens after the default 700ms delay">
        <Button variant="plain">Default tooltip</Button>
      </Tooltip>
    </HStack>
  );
}
