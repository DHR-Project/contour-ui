import { useState } from "react";
import { SearchField } from "@/components/ui/search-field";
import type { SearchFieldResult } from "@/components/ui/search-field";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";

export function Basic() {
  const [value, setValue] = useState("");
  return (
    <div className="w-72">
      <SearchField value={value} onValueChange={setValue} />
    </div>
  );
}

const SEARCH_FIELD_DEMO_ITEMS: { id: string; label: string; icon: SearchFieldResult["icon"] }[] = [
  { id: "button", label: "Button", icon: "star" },
  { id: "checkbox", label: "Checkbox", icon: "check" },
  { id: "dropdown", label: "Dropdown", icon: "chevron-down" },
  { id: "search-field", label: "SearchField", icon: "search" },
  { id: "slider", label: "Slider", icon: "settings" },
];

export function Results() {
  const [value, setValue] = useState("s");
  const [selected, setSelected] = useState<string | null>(null);

  const results = SEARCH_FIELD_DEMO_ITEMS.filter((item) =>
    item.label.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <VStack gap="2" className="w-80">
      <SearchField
        value={value}
        onValueChange={setValue}
        results={results}
        onResultSelect={setSelected}
        placeholder="Search components"
      />
      <Text textStyle="footnote" color="secondary">
        {selected ? `Selected: ${selected}` : "No selection yet"}
      </Text>
    </VStack>
  );
}
