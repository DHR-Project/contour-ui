import { useState } from "react";
import { ScrollRail } from "@/components/ui/scroll-rail";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";

function RailChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <Flex
      align="center"
      justify="center"
      container={false}
      className={`h-10 shrink-0 rounded-full px-(--space-4) ${active ? "bg-tint" : "bg-fill-secondary"}`}
    >
      <Text
        textStyle="footnote"
        weight="medium"
        className={`whitespace-nowrap ${active ? "text-white" : "text-label-primary"}`}
      >
        {label}
      </Text>
    </Flex>
  );
}

const RAIL_ITEMS = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`);

export function Horizontal() {
  return (
    <div className="w-full max-w-80">
      <ScrollRail className="gap-(--space-2)">
        {RAIL_ITEMS.map((item) => (
          <RailChip key={item} label={item} />
        ))}
      </ScrollRail>
    </div>
  );
}

export function Vertical() {
  return (
    <div className="h-64 w-40">
      <ScrollRail orientation="vertical" className="gap-(--space-2)">
        {RAIL_ITEMS.map((item) => (
          <RailChip key={item} label={item} />
        ))}
      </ScrollRail>
    </div>
  );
}

export function ActiveIndexHorizontal() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="w-full max-w-80">
      <ScrollRail activeIndex={activeIndex} className="gap-(--space-2)">
        {RAIL_ITEMS.map((item, index) => (
          <button key={item} type="button" onClick={() => setActiveIndex(index)}>
            <RailChip label={item} active={index === activeIndex} />
          </button>
        ))}
      </ScrollRail>
    </div>
  );
}

export function ActiveIndexVertical() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="h-64 w-40">
      <ScrollRail activeIndex={activeIndex} orientation="vertical" className="gap-(--space-2)">
        {RAIL_ITEMS.map((item, index) => (
          <button key={item} type="button" onClick={() => setActiveIndex(index)}>
            <RailChip label={item} active={index === activeIndex} />
          </button>
        ))}
      </ScrollRail>
    </div>
  );
}
