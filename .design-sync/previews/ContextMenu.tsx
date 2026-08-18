// ContextMenu exposes no open/defaultOpen prop -- its open state is fully
// internal (Radix-controlled via a local useState in context-menu.tsx), and
// it only opens from a real right-click or long-press. A synthetic
// dispatched "contextmenu" event was tried and did not reliably open it in
// this static-capture harness, so -- same as Dropdown and Tooltip, which
// have the identical no-controllable-open-state constraint -- these previews
// show the real, correctly composed trigger rather than a non-functional
// forced-open attempt.
import { ContextMenu } from "@/components/ui/context-menu";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";

function TriggerArea({ label }: { label: string }) {
  return (
    <Flex
      align="center"
      justify="center"
      className="h-32 w-full rounded-md border border-dashed border-separator"
    >
      <Text textStyle="footnote" color="secondary">
        {label}
      </Text>
    </Flex>
  );
}

export function BasicActions() {
  return (
    <ContextMenu
      items={[
        { type: "action", icon: "copy", label: "Duplicate", onSelect: () => {} },
        { type: "action", icon: "share", label: "Share", onSelect: () => {} },
        { type: "separator" },
        { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: () => {} },
      ]}
    >
      <TriggerArea label="Right-click for actions" />
    </ContextMenu>
  );
}

export function WithSubmenu() {
  return (
    <ContextMenu
      items={[
        {
          type: "submenu",
          icon: "download",
          label: "Export",
          items: [
            { type: "action", label: "PDF", onSelect: () => {} },
            { type: "action", label: "CSV", onSelect: () => {} },
          ],
        },
        { type: "separator" },
        { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: () => {} },
      ]}
    >
      <TriggerArea label="Right-click for a submenu" />
    </ContextMenu>
  );
}
