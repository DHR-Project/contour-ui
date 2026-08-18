import { Stack } from "@/components/ui/stack";
import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";

function Tile({ label }: { label: string }) {
  return (
    <Flex align="center" justify="center" className="h-12 w-12 rounded-md bg-fill-secondary">
      <Text textStyle="footnote" color="secondary">
        {label}
      </Text>
    </Flex>
  );
}

export function Horizontal() {
  return (
    <Stack direction="horizontal" gap="3">
      <Tile label="A" />
      <Tile label="B" />
      <Tile label="C" />
    </Stack>
  );
}

export function Vertical() {
  return (
    <Stack direction="vertical" gap="2">
      <Tile label="A" />
      <Tile label="B" />
      <Tile label="C" />
    </Stack>
  );
}

export function DynamicDirection() {
  // direction is a plain prop, so the axis can flip conditionally (e.g. a
  // compact vs. regular size-class) without branching JSX.
  return (
    <Stack direction="horizontal" gap="4">
      <Tile label="A" />
      <Tile label="B" />
      <Tile label="C" />
    </Stack>
  );
}
