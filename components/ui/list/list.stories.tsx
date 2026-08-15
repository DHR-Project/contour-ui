import { useState } from "react";
import type { Story } from "@ladle/react";
import { List } from "./list";
import { ListItem } from "./list-item";

const meta = {
  title: "Components / List",
};

export default meta;

/**
 * `plain` (default): full-width, fixed --padding-row-* density (SS4.1
 * group 1). Separators are inset by default -- they start after the
 * leading icon, matching the native-feeling list pattern.
 */
export const Plain: Story = () => (
  <List>
    <ListItem
      key="1"
      leadingIcon="bell"
      title="Notifications"
      subtitle="On for messages and calls"
      onClick={() => {}}
    />
    <ListItem
      key="2"
      leadingIcon="user"
      title="Account"
      trailingIcon="chevron-right"
      onClick={() => {}}
    />
    <ListItem
      key="3"
      leadingIcon="settings"
      title="Settings"
      trailingText="3 updates"
      onClick={() => {}}
    />
  </List>
);

/** `grouped`: rounded card boundary, responsive `--inset-grouped-margin-x`. */
export const Grouped: Story = () => (
  <div className="w-80 bg-fill-quaternary p-4">
    <List style="grouped">
      <ListItem key="1" title="Wi-Fi" trailingText="Home" onClick={() => {}} />
      <ListItem
        key="2"
        title="Bluetooth"
        trailingText="On"
        onClick={() => {}}
      />
      <ListItem
        key="3"
        title="Cellular"
        onClick={() => {}}
        separatorInset={false}
      />
    </List>
  </div>
);

export const NonInteractive: Story = () => (
  <List>
    <ListItem key="1" leadingIcon="info" title="Version" trailingText="1.0.0" />
    <ListItem key="2" leadingIcon="info" title="Build" trailingText="42" />
  </List>
);

export const Disabled: Story = () => (
  <List>
    <ListItem key="1" leadingIcon="bell" title="Available" onClick={() => {}} />
    <ListItem
      key="2"
      leadingIcon="bell"
      title="Unavailable (disabled)"
      onClick={() => {}}
      disabled
    />
  </List>
);

/**
 * Trailing actions (touch: swipe to reveal; desktop: hover/focus-within
 * reveal, SS4.4). Max 3 -- extras beyond the 3rd are ignored (SS4.1).
 * Destructive action is last in the array so full-swipe-commit (mail-app
 * style) triggers it, not a lighter action.
 */
export const TrailingActions: Story = () => (
  <List>
    <ListItem
      key="1"
      leadingIcon="bell"
      title="Swipe or hover this row"
      subtitle="Reveals Archive + Delete"
      trailingActions={[
        {
          icon: "download",
          label: "Archive",
          color: "default",
          onAction: () => {},
        },
        {
          icon: "trash",
          label: "Delete",
          color: "destructive",
          onAction: () => {},
        },
      ]}
    />
  </List>
);

export const LeadingAction: Story = () => (
  <List>
    <ListItem
      key="1"
      leadingIcon="bell"
      title="Swipe right to mark read"
      leadingAction={{
        icon: "check",
        label: "Read",
        color: "tint",
        onAction: () => {},
      }}
    />
  </List>
);

/**
 * At exactly 3 trailing actions, desktop hover reveals a single "..."
 * trigger instead of all 3 in place (too little room otherwise) -- clicking
 * it opens all 3 the same way the 1-2 action case reveals (row's own
 * padding, title stays anchored/visible) instead of a popover (touch still
 * swipe-reveals all 3 directly, unaffected).
 */
export const CollapsedTrailingActions: Story = () => (
  <List>
    <ListItem
      key="1"
      title="Hover, then click the ... trigger"
      subtitle="Reveals Flag + Archive + Delete"
      trailingActions={[
        { icon: "star", label: "Flag", color: "warning", onAction: () => {} },
        {
          icon: "download",
          label: "Archive",
          color: "default",
          onAction: () => {},
        },
        {
          icon: "trash",
          label: "Delete",
          color: "destructive",
          onAction: () => {},
        },
      ]}
    />
  </List>
);

/**
 * `confirm: true` on a `SwipeAction` (leading or trailing, contour-spec-list.md
 * SS4.5) arms instead of running immediately: the tapped action expands to
 * fill the row and everything else fades out. Tapping it again runs
 * `onAction`; tapping outside or Escape cancels back to the normal row.
 */
export const ConfirmAction: Story = () => (
  <List>
    <ListItem
      key="1"
      title="Tap Delete, then tap it again"
      subtitle="Tapping outside cancels instead"
      trailingActions={[
        {
          icon: "download",
          label: "Archive",
          color: "default",
          onAction: () => {},
        },
        {
          icon: "trash",
          label: "Delete",
          color: "destructive",
          onAction: () => {},
          confirm: true,
        },
      ]}
    />
  </List>
);

/**
 * Additive, not breaking (contour-spec-context-menu.md) -- right-click on
 * desktop; touch is disambiguated against swipe/scroll via a ~500ms
 * long-press timer on the same touch handler, not demoable with a mouse.
 * Separate from `trailingActions`: swipe is for 1-2 quick actions, this is
 * the full menu (Mail app pattern).
 */
export const WithContextMenu: Story = () => (
  <List>
    <ListItem
      key="1"
      leadingIcon="bell"
      title="Right-click me (or long-press on touch)"
      contextMenuItems={[
        {
          type: "action",
          icon: "copy",
          label: "Duplicate",
          onSelect: () => {},
        },
        { type: "action", icon: "share", label: "Share", onSelect: () => {} },
        { type: "separator" },
        {
          type: "action",
          icon: "trash",
          label: "Delete",
          role: "destructive",
          onSelect: () => {},
        },
      ]}
    />
    <ListItem key="2" leadingIcon="user" title="No context menu on this row" />
  </List>
);

/** Add/remove animates via AnimatePresence + `layout` (SS5). */
export const AddRemove: Story = () => {
  const [items, setItems] = useState([
    { id: 1, title: "First item" },
    { id: 2, title: "Second item" },
    { id: 3, title: "Third item" },
  ]);
  let nextId = items.length + 1;
  return (
    <div className="w-80">
      <button
        type="button"
        className="mb-3 rounded-sm bg-fill-secondary px-3 py-1 text-footnote"
        onClick={() =>
          setItems((prev) => [
            ...prev,
            { id: nextId++, title: `Item ${nextId}` },
          ])
        }
      >
        Add item
      </button>
      <List>
        {items.map((item) => (
          <ListItem
            key={item.id}
            title={item.title}
            trailingActions={[
              {
                icon: "trash",
                label: "Delete",
                color: "destructive",
                onAction: () =>
                  setItems((prev) => prev.filter((i) => i.id !== item.id)),
                confirm: true,
              },
              {
                icon: "share",
                label: "Share",
                color: "tint",
                onAction() {},
              },
              {
                icon: "star",
                label: "Flag",
                color: "warning",
                onAction() {},
              },
            ]}
          />
        ))}
      </List>
    </div>
  );
};
