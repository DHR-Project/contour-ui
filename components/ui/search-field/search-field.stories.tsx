import { useMemo, useState } from "react";
import type { Story } from "@ladle/react";
import { SearchField } from "./search-field";
import type { SearchFieldResult } from "./search-field";

const meta = {
  title: "Components / SearchField",
};

export default meta;

export const Basic: Story = () => {
  const [value, setValue] = useState("");
  return (
    <div className="w-72">
      <SearchField value={value} onValueChange={setValue} />
    </div>
  );
};

const ALL_RESULTS: SearchFieldResult[] = [
  { id: "button", label: "Button", icon: "star" },
  { id: "checkbox", label: "Checkbox", icon: "check" },
  { id: "dropdown", label: "Dropdown", icon: "chevron-down" },
  { id: "search-field", label: "SearchField", icon: "search" },
  { id: "slider", label: "Slider", icon: "settings" },
];

export const WithResults: Story = () => {
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const results = useMemo<SearchFieldResult[] | undefined>(() => {
    if (value.trim() === "") return undefined;
    return ALL_RESULTS.filter((r) => r.label.toLowerCase().includes(value.toLowerCase()));
  }, [value]);

  return (
    <div className="flex w-96 flex-col gap-4">
      <SearchField
        value={value}
        onValueChange={setValue}
        results={results}
        onResultSelect={setSelected}
        placeholder="Search components"
      />
      {selected && <p className="text-sm text-label-secondary">Selected: {selected}</p>}
    </div>
  );
};

export const Loading: Story = () => {
  const [value, setValue] = useState("but");
  return (
    <div className="w-96">
      <SearchField value={value} onValueChange={setValue} loading autoFocus />
    </div>
  );
};

export const EmptyResults: Story = () => {
  const [value, setValue] = useState("zzz");
  return (
    <div className="w-96">
      <SearchField value={value} onValueChange={setValue} results={[]} autoFocus />
    </div>
  );
};

export const WithCancel: Story = () => {
  const [value, setValue] = useState("");
  const [cancelled, setCancelled] = useState(0);
  return (
    <div className="flex w-96 flex-col gap-4">
      <SearchField value={value} onValueChange={setValue} onCancel={() => setCancelled((c) => c + 1)} />
      <p className="text-sm text-label-secondary">Cancelled {cancelled} time(s)</p>
    </div>
  );
};
