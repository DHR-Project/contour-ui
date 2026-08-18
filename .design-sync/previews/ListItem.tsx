// ListItem only renders meaningfully inside its List parent (row layout,
// separators, swipe/hover-action affordances) -- every export here composes
// the full parent, per the compound-component preview convention.
import { List, ListItem } from "@/components/ui/list";

export function LeadingAction() {
  return (
    <List>
      <ListItem
        key="1"
        leadingIcon="bell"
        title="Swipe right to mark read"
        leadingAction={{ icon: "check", label: "Read", color: "tint", onAction: () => {} }}
      />
    </List>
  );
}

export function ConfirmDelete() {
  return (
    <List>
      <ListItem
        key="1"
        title="Tap Delete, then tap it again"
        subtitle="Tapping outside cancels instead"
        trailingActions={[
          { icon: "download", label: "Archive", color: "default", onAction: () => {} },
          { icon: "trash", label: "Delete", color: "destructive", onAction: () => {}, confirm: true },
        ]}
      />
    </List>
  );
}

export function WithContextMenu() {
  return (
    <List>
      <ListItem
        key="1"
        leadingIcon="bell"
        title="Right-click me (or long-press on touch)"
        contextMenuItems={[
          { type: "action", icon: "copy", label: "Duplicate", onSelect: () => {} },
          { type: "action", icon: "share", label: "Share", onSelect: () => {} },
          { type: "separator" },
          { type: "action", icon: "trash", label: "Delete", role: "destructive", onSelect: () => {} },
        ]}
      />
      <ListItem key="2" leadingIcon="user" title="No context menu on this row" />
    </List>
  );
}
