import type { Story } from "@ladle/react";
import { Container, type ContainerProps } from "./container";

export const Playground: Story<ContainerProps> = (props) => (
  <Container {...props}>
    <div style={{ background: "rgb(0 122 255 / 0.15)", padding: 12, borderRadius: 8 }}>
      Container content
    </div>
  </Container>
);
Playground.args = {
  size: "lg",
};
Playground.argTypes = {
  size: {
    options: ["sm", "md", "lg", "xl", "full"],
    control: { type: "select" },
  },
};
