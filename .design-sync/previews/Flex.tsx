import { Flex } from "@/components/ui/flex";
import { Text } from "@/components/ui/text";

function Tile({ label, className }: { label: string; className?: string }) {
  return (
    <Flex
      align="center"
      justify="center"
      className={`h-16 rounded-md bg-fill-secondary ${className ?? ""}`}
    >
      <Text textStyle="footnote" color="secondary">
        {label}
      </Text>
    </Flex>
  );
}

export function Row() {
  return (
    <Flex gap="3">
      <Tile label="1" />
      <Tile label="2" />
      <Tile label="3" />
    </Flex>
  );
}

export function Column() {
  return (
    <Flex direction="column" gap="2" className="max-w-40">
      <Tile label="Column A" />
      <Tile label="Column B" />
    </Flex>
  );
}

export function Justify() {
  return (
    <Flex justify="between" align="center" gap="2" className="w-72">
      <Tile label="Start" className="w-20" />
      <Tile label="End" className="w-20" />
    </Flex>
  );
}

export function Wrap() {
  return (
    <Flex wrap="wrap" gap="2" className="max-w-48">
      {Array.from({ length: 4 }, (_, i) => (
        <Tile key={i} label={String(i + 1)} className="w-20" />
      ))}
    </Flex>
  );
}
