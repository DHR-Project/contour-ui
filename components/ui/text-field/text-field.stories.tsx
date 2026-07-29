import { useState } from "react";
import type { Story } from "@ladle/react";
import { TextField, type TextFieldProps } from "./text-field";

export const Basic: Story = () => (
  <div style={{ width: 280 }}>
    <TextField label="Email" placeholder="you@example.com" />
  </div>
);

export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 280 }}>
    <TextField size="sm" label="Small" placeholder="Placeholder" />
    <TextField size="md" label="Medium" placeholder="Placeholder" />
    <TextField size="lg" label="Large" placeholder="Placeholder" />
  </div>
);

export const WithIcons: Story = () => (
  <div style={{ width: 280 }}>
    <TextField label="Search" leadingIcon="search" placeholder="Search..." />
  </div>
);

export const Clearable: Story = () => {
  const [value, setValue] = useState("Contour");
  return (
    <div style={{ width: 280 }}>
      <TextField
        label="Project name"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onClear={() => setValue("")}
      />
    </div>
  );
};

export const HelperAndError: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 280 }}>
    <TextField label="Username" helperText="Visible to other members." />
    <TextField label="Username" defaultValue="a" errorText="Must be at least 3 characters." />
  </div>
);

export const Disabled: Story = () => (
  <div style={{ width: 280 }}>
    <TextField label="Disabled" defaultValue="Can't touch this" disabled />
  </div>
);

export const Playground: Story<TextFieldProps> = (props) => (
  <div style={{ width: 280 }}>
    <TextField {...props} />
  </div>
);
Playground.args = {
  label: "Label",
  placeholder: "Placeholder",
  size: "md",
};
Playground.argTypes = {
  size: {
    options: ["sm", "md", "lg"],
    control: { type: "select" },
  },
};
