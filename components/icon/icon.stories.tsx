import type { Story } from "@ladle/react";
import { Icon } from "./icon";
import { iconRegistry } from "./icon-registry";
import type { IconName } from "./icon.types";

const meta = {
  title: "Foundation / Icon",
};

export default meta;

const names = Object.keys(iconRegistry) as IconName[];

/**
 * The full registry (icon-registry.ts) -- the only file allowed to import
 * from lucide-react (guideline rule 6.1). Every other component must go
 * through `<Icon name="..." />`.
 */
export const Registry: Story = () => (
  <div className="grid grid-cols-6 gap-4">
    {names.map((name) => (
      <div key={name} className="flex flex-col items-center gap-1 text-caption-1 text-label-secondary">
        <Icon name={name} size="lg" />
        <span>{name}</span>
      </div>
    ))}
  </div>
);

/**
 * Size scale mirrors Text Style pairing (contour-spec-icon.md SS2) --
 * xs/sm/md/lg/xl map to --icon-size-* tokens.
 */
export const Sizes: Story = () => (
  <div className="flex items-end gap-4">
    {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
      <div key={size} className="flex flex-col items-center gap-1 text-caption-1 text-label-secondary">
        <Icon name="star" size={size} />
        <span>{size}</span>
      </div>
    ))}
  </div>
);

/**
 * `color` defaults to currentColor (icon inherits the surrounding text
 * color) -- override only with a semantic token, never a raw hex value.
 */
export const Color: Story = () => (
  <div className="flex items-center gap-4">
    <Icon name="circle-check" color="success" />
    <Icon name="triangle-alert" color="warning" />
    <Icon name="circle-alert" color="destructive" />
    <Icon name="star" color="tint" />
  </div>
);

/**
 * Do: icon-only controls set `decorative={false}` + `aria-label`.
 * Don't: leave an icon-only button with no accessible name.
 */
export const Accessibility: Story = () => (
  <div className="flex items-center gap-4">
    <button type="button" aria-label="Delete item" className="rounded-sm p-2 hover:bg-fill-secondary">
      <Icon name="trash" decorative={false} aria-label="Delete item" />
    </button>
    <span className="inline-flex items-center gap-1 text-footnote text-label-secondary">
      <Icon name="clock" />
      2 min ago
    </span>
  </div>
);
