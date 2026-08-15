import { useState } from "react";
import type { Story } from "@ladle/react";
import { ScrollRail } from "./scroll-rail";

const meta = {
  title: "Components / ScrollRail",
};

export default meta;

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 rounded-full bg-fill-secondary px-(--space-4) py-(--space-2) text-body text-label-primary">
      {children}
    </div>
  );
}

const MANY_ITEMS = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`);

export const Horizontal: Story = () => (
  <div className="flex w-80 gap-(--space-2) py-(--space-8)">
    <ScrollRail className="gap-(--space-2)">
      {MANY_ITEMS.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </ScrollRail>
  </div>
);

export const Vertical: Story = () => (
  <div className="h-64 w-40 py-(--space-8)">
    <ScrollRail orientation="vertical" className="gap-(--space-2)">
      {MANY_ITEMS.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </ScrollRail>
  </div>
);

export const NoOverflow: Story = () => (
  <div className="w-96 py-(--space-8)">
    <ScrollRail className="gap-(--space-2)">
      <Chip>One</Chip>
      <Chip>Two</Chip>
      <Chip>Three</Chip>
    </ScrollRail>
  </div>
);

export const ArrowsHidden: Story = () => (
  <div className="w-80 py-(--space-8)">
    <ScrollRail showArrows={false} className="gap-(--space-2)">
      {MANY_ITEMS.map((item) => (
        <Chip key={item}>{item}</Chip>
      ))}
    </ScrollRail>
  </div>
);

export const ScrollToActiveIndex: Story = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div className="flex w-80 flex-col gap-(--space-4) py-(--space-8)">
      <ScrollRail activeIndex={activeIndex} className="gap-(--space-2)">
        {MANY_ITEMS.map((item, index) => (
          <button key={item} onClick={() => setActiveIndex(index)}>
            <Chip>{item}</Chip>
          </button>
        ))}
      </ScrollRail>
    </div>
  );
};

export const AsChild: Story = () => (
  <div className="w-80 py-(--space-8)">
    <ScrollRail asChild>
      <ul className="flex gap-(--space-2)">
        {MANY_ITEMS.map((item) => (
          <li key={item} className="shrink-0">
            <Chip>{item}</Chip>
          </li>
        ))}
      </ul>
    </ScrollRail>
  </div>
);
