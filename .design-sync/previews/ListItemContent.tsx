// ListItemContent is presentational only -- shared by ListItem's interactive
// shell and Dropdown's DropdownMenu.Item so neither stacks a second layer of
// interactivity. It renders meaningfully on its own (no List/ListItem parent
// required), matching how it's demonstrated in component-demos.tsx.
import { ListItemContent } from "@/components/ui/list";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";

export function Default() {
  return (
    <div className="w-72">
      <ListItemContent leadingIcon="bell" title="Notifications" subtitle="On for messages and calls" />
    </div>
  );
}

export function TrailingIcon() {
  return (
    <div className="w-72">
      <ListItemContent leadingIcon="settings" title="Settings" trailing={<Icon name="chevron-right" size="sm" />} />
    </div>
  );
}

export function TrailingText() {
  return (
    <div className="w-72">
      <ListItemContent
        leadingIcon="user"
        title="Account"
        trailing={
          <Text textStyle="body" color="secondary">
            Personal
          </Text>
        }
      />
    </div>
  );
}

export function Selected() {
  return (
    <div className="w-72">
      <ListItemContent title="Newest first" trailing={<Icon name="check" size="sm" color="tint" />} />
    </div>
  );
}

export function NoLeadingIcon() {
  return (
    <div className="w-72">
      <ListItemContent title="Plain title" subtitle="No leading icon" />
    </div>
  );
}

export function Truncation() {
  return (
    <div className="w-48">
      <ListItemContent
        leadingIcon="bell"
        title="A very long title that should truncate with an ellipsis"
        subtitle="A very long subtitle that should also truncate with an ellipsis"
        trailing={<Icon name="chevron-right" size="sm" />}
      />
    </div>
  );
}
