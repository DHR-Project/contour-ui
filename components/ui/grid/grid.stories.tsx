import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { Grid, type GridProps } from "./grid";

function Box({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        background: "rgb(0 122 255 / 0.15)",
        padding: 12,
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      {children}
    </div>
  );
}

export const Columns: Story = () => (
  <Grid columns="3" gap="3">
    {Array.from({ length: 6 }).map((_, i) => (
      <Box key={i}>{i + 1}</Box>
    ))}
  </Grid>
);

export const Playground: Story<GridProps> = (props) => (
  <Grid {...props}>
    {Array.from({ length: 6 }).map((_, i) => (
      <Box key={i}>{i + 1}</Box>
    ))}
  </Grid>
);
Playground.args = {
  columns: "3",
  gap: "4",
};
Playground.argTypes = {
  columns: {
    options: ["1", "2", "3", "4", "5", "6", "12"],
    control: { type: "select" },
  },
  gap: {
    options: ["0", "1", "2", "3", "4", "5", "6", "8", "12", "16", "20"],
    control: { type: "select" },
  },
};
