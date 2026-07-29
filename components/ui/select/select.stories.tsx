import { useState } from "react";
import type { Story } from "@ladle/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

export const Basic: Story = () => (
  <Select defaultValue="apple">
    <SelectTrigger className="w-56">
      <SelectValue placeholder="Pick a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
    </SelectContent>
  </Select>
);

export const Sizes: Story = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 224 }}>
    <Select defaultValue="a">
      <SelectTrigger size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Small</SelectItem>
      </SelectContent>
    </Select>
    <Select defaultValue="a">
      <SelectTrigger size="md">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Medium</SelectItem>
      </SelectContent>
    </Select>
    <Select defaultValue="a">
      <SelectTrigger size="lg">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="a">Large</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export const Groups: Story = () => (
  <Select defaultValue="apple">
    <SelectTrigger className="w-56">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>Fruit</SelectLabel>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Vegetable</SelectLabel>
        <SelectItem value="carrot">Carrot</SelectItem>
        <SelectItem value="potato">Potato</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const Disabled: Story = () => (
  <Select disabled defaultValue="apple">
    <SelectTrigger className="w-56">
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
    </SelectContent>
  </Select>
);

export const Controlled: Story = () => {
  const [value, setValue] = useState("apple");
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-56">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
      </SelectContent>
    </Select>
  );
};
