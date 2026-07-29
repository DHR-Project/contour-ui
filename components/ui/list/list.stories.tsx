import { useState } from "react";
import type { Story } from "@ladle/react";
import { List, ListItem } from "./list";

export const Plain: Story = () => (
  <div style={{ width: 320 }}>
    <List>
      <ListItem leadingIcon="user" title="Profile" subtitle="Name, photo" chevron onClick={() => {}} />
      <ListItem leadingIcon="settings" title="Settings" chevron onClick={() => {}} />
      <ListItem leadingIcon="heart" title="Favorites" trailing={<span>12</span>} chevron onClick={() => {}} />
    </List>
  </div>
);

export const Grouped: Story = () => (
  <div style={{ width: 320, background: "rgb(242 242 247)", padding: 16 }}>
    <List variant="grouped">
      <ListItem leadingIcon="user" title="Profile" chevron onClick={() => {}} />
      <ListItem leadingIcon="settings" title="Settings" chevron onClick={() => {}} />
      <ListItem title="Version" trailing={<span style={{ color: "#8e8e93" }}>1.0.0</span>} />
    </List>
  </div>
);

export const Static: Story = () => (
  <div style={{ width: 320 }}>
    <List variant="grouped">
      <ListItem title="Name" trailing={<span>Contour</span>} />
      <ListItem title="Plan" trailing={<span>Pro</span>} />
    </List>
  </div>
);

export const Disabled: Story = () => (
  <div style={{ width: 320 }}>
    <List>
      <ListItem leadingIcon="user" title="Enabled row" chevron onClick={() => {}} />
      <ListItem leadingIcon="settings" title="Disabled row" chevron onClick={() => {}} disabled />
    </List>
  </div>
);

export const Toggle: Story = () => {
  const [on, setOn] = useState(true);
  return (
    <div style={{ width: 320 }}>
      <List variant="grouped">
        <ListItem
          leadingIcon="info"
          title="Notifications"
          trailing={
            <button
              onClick={() => setOn((v) => !v)}
              style={{
                width: 36,
                height: 20,
                borderRadius: 999,
                background: on ? "#0a84ff" : "#e5e5ea",
                border: "none",
              }}
            />
          }
        />
      </List>
    </div>
  );
};
