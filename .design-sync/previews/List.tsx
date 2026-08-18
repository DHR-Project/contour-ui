import { List, ListItem } from "@/components/ui/list";

export function Plain() {
  return (
    <List>
      <ListItem key="1" leadingIcon="bell" title="Notifications" subtitle="On for messages and calls" onClick={() => {}} />
      <ListItem key="2" leadingIcon="user" title="Account" trailingIcon="chevron-right" onClick={() => {}} />
      <ListItem key="3" leadingIcon="settings" title="Settings" trailingText="3 updates" onClick={() => {}} />
    </List>
  );
}

export function Grouped() {
  return (
    <div className="w-80 bg-fill-quaternary p-(--space-4)">
      <List style="grouped">
        <ListItem key="1" title="Wi-Fi" trailingText="Home" onClick={() => {}} />
        <ListItem key="2" title="Bluetooth" trailingText="On" onClick={() => {}} />
        <ListItem key="3" title="Cellular" onClick={() => {}} separatorInset={false} />
      </List>
    </div>
  );
}

export function NonInteractive() {
  return (
    <List>
      <ListItem key="1" leadingIcon="info" title="Version" trailingText="1.0.0" />
      <ListItem key="2" leadingIcon="info" title="Build" trailingText="42" />
    </List>
  );
}

export function Disabled() {
  return (
    <List>
      <ListItem key="1" leadingIcon="bell" title="Available" onClick={() => {}} />
      <ListItem key="2" leadingIcon="bell" title="Unavailable (disabled)" onClick={() => {}} disabled />
    </List>
  );
}

export function TrailingActions() {
  return (
    <List>
      <ListItem
        key="1"
        leadingIcon="bell"
        title="Swipe or hover this row"
        subtitle="Reveals Archive + Delete"
        trailingActions={[
          { icon: "download", label: "Archive", color: "default", onAction: () => {} },
          { icon: "trash", label: "Delete", color: "destructive", onAction: () => {} },
        ]}
      />
    </List>
  );
}
