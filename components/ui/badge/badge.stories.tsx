import type { Story } from "@ladle/react";
import { useState } from "react";
import { Badge } from "./badge";
import { HStack, VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/icon";

const meta = {
  title: "Components / Badge",
};

export default meta;

export const CounterNumbers: Story = () => (
  <HStack gap="4" align="center">
    <Badge count={1} />
    <Badge count={9} />
    <Badge count={42} />
    <Badge count={100} />
    <Badge count={999} />
  </HStack>
);

export const CounterDot: Story = () => (
  <HStack gap="4" align="center">
    <Badge dot />
    {/* Positioned over an icon — the typical use case. */}
    <div className="relative inline-block">
      <Icon name="bell" size="md" />
      <Badge dot className="absolute -top-1 -right-1" />
    </div>
  </HStack>
);

export const CounterShowZero: Story = () => (
  <HStack gap="4" align="center">
    <Text textStyle="footnote" color="secondary">showZero=false (hidden):</Text>
    <Badge count={0} />
    <Text textStyle="footnote" color="secondary">showZero=true:</Text>
    <Badge count={0} showZero />
  </HStack>
);

export const CounterPositioned: Story = () => (
  <HStack gap="6" align="center">
    <div className="relative inline-block">
      <Icon name="bell" size="lg" />
      <Badge count={3} className="absolute -top-1 -right-1" />
    </div>
    <div className="relative inline-block">
      <Icon name="circle-check" size="lg" />
      <Badge count={42} className="absolute -top-1 -right-1" />
    </div>
    <div className="relative inline-block">
      <Icon name="star" size="lg" />
      <Badge count={0} showZero className="absolute -top-1 -right-1" />
    </div>
  </HStack>
);

export const StatusSolid: Story = () => (
  <HStack gap="3" align="center" wrap="wrap">
    <Badge variant="status" label="New" color="tint" />
    <Badge variant="status" label="Beta" color="warning" />
    <Badge variant="status" label="Error" color="destructive" />
    <Badge variant="status" label="Done" color="success" />
  </HStack>
);

export const StatusTinted: Story = () => (
  <HStack gap="3" align="center" wrap="wrap">
    <Badge variant="status" label="New" color="tint" tone="tinted" />
    <Badge variant="status" label="Beta" color="warning" tone="tinted" />
    <Badge variant="status" label="Error" color="destructive" tone="tinted" />
    <Badge variant="status" label="Done" color="success" tone="tinted" />
  </HStack>
);

export const LiveCounter: Story = () => {
  const [count, setCount] = useState(0);
  return (
    <VStack gap="4">
      <HStack gap="3" align="center">
        <div className="relative inline-block">
          <Icon name="bell" size="lg" />
          <Badge count={count} className="absolute -top-1 -right-1" />
        </div>
        <Text textStyle="body">{count === 0 ? "No notifications" : `${count} notification${count === 1 ? "" : "s"}`}</Text>
      </HStack>
      <HStack gap="3">
        <button
          onClick={() => setCount((n) => n + 1)}
          className="text-tint text-footnote"
        >
          + Add
        </button>
        <button
          onClick={() => setCount(0)}
          className="text-label-secondary text-footnote"
        >
          Clear
        </button>
      </HStack>
    </VStack>
  );
};
