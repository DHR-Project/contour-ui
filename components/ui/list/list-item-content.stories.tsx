import type { Story } from "@ladle/react";
import { ListItemContent } from "./list-item-content";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";

const meta = {
  title: "Components / List / ListItemContent",
};

export default meta;

/**
 * Presentational only (contour-spec-list.md SS7) -- shared by ListItem's
 * interactive shell and Dropdown's DropdownMenu.Item so neither stacks a
 * second layer of interactivity on top of the other.
 */
export const Default: Story = () => (
  <div className="w-72">
    <ListItemContent leadingIcon="bell" title="Notifications" subtitle="On for messages and calls" />
  </div>
);

export const WithTrailingIcon: Story = () => (
  <div className="w-72">
    <ListItemContent leadingIcon="settings" title="Settings" trailing={<Icon name="chevron-right" size="sm" />} />
  </div>
);

export const WithTrailingText: Story = () => (
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

/** Used for a selected Dropdown item -- trailing = a check mark. */
export const Selected: Story = () => (
  <div className="w-72">
    <ListItemContent title="Newest first" trailing={<Icon name="check" size="sm" color="tint" />} />
  </div>
);

export const NoLeadingIcon: Story = () => (
  <div className="w-72">
    <ListItemContent title="Plain title" subtitle="No leading icon" />
  </div>
);

export const Truncation: Story = () => (
  <div className="w-48">
    <ListItemContent
      leadingIcon="bell"
      title="A very long title that should truncate with an ellipsis"
      subtitle="A very long subtitle that should also truncate with an ellipsis"
      trailing={<Icon name="chevron-right" size="sm" />}
    />
  </div>
);
