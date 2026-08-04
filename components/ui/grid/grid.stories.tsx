import type { Story } from "@ladle/react";
import { Grid } from "./grid";

const meta = {
  title: "Layout / Grid",
};

export default meta;

const tile = (label: string) => (
  <div
    key={label}
    className="flex h-20 items-center justify-center rounded-sm bg-fill-secondary text-footnote text-label-secondary"
  >
    {label}
  </div>
);

/**
 * Fixed column count -> `repeat(N, 1fr)`. Use Grid (not Flex) when items
 * must align on both axes across rows -- see contour-spec-grid.md SS1.
 */
export const FixedColumns: Story = () => (
  <Grid columns={3} gap="4">
    {Array.from({ length: 6 }, (_, i) => tile(String(i + 1)))}
  </Grid>
);

/**
 * Responsive per size-class -- compact-first, unset tiers inherit the
 * nearest smaller size-class (guideline rule 3.3). Resize the Ladle
 * viewport (width addon) to see it change at 768/1024/1280px.
 */
export const ResponsiveColumns: Story = () => (
  <Grid columns={{ compact: 1, regular: 2, "regular-lg": 3, "regular-xl": 4 }} gap="4">
    {Array.from({ length: 8 }, (_, i) => tile(String(i + 1)))}
  </Grid>
);

/**
 * Auto-fit with a min item width token (SS4.5) -- items reflow to fill
 * available space without a size-class lookup.
 */
export const AutoFit: Story = () => (
  <Grid columns="auto-fit" minItemWidth="sm" gap="3">
    {Array.from({ length: 7 }, (_, i) => tile(String(i + 1)))}
  </Grid>
);

export const AsymmetricGap: Story = () => (
  <Grid columns={3} gapX="2" gapY="8">
    {Array.from({ length: 6 }, (_, i) => tile(String(i + 1)))}
  </Grid>
);
