import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/icon";
import { HStack } from "@/components/ui/stack";

export function Counters() {
  return (
    <HStack gap="4" align="center">
      <Badge count={1} />
      <Badge count={9} />
      <Badge count={42} />
      <Badge count={999} />
      <Badge dot />
    </HStack>
  );
}

export function StatusSolid() {
  return (
    <HStack gap="3" align="center">
      <Badge variant="status" label="New" color="tint" />
      <Badge variant="status" label="Beta" color="warning" />
      <Badge variant="status" label="Error" color="destructive" />
      <Badge variant="status" label="Done" color="success" />
    </HStack>
  );
}

export function StatusTinted() {
  return (
    <HStack gap="3" align="center">
      <Badge variant="status" label="New" color="tint" tone="tinted" />
      <Badge variant="status" label="Beta" color="warning" tone="tinted" />
      <Badge variant="status" label="Error" color="destructive" tone="tinted" />
      <Badge variant="status" label="Done" color="success" tone="tinted" />
    </HStack>
  );
}

export function Positioned() {
  return (
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
        <Icon name="bell" size="lg" />
        <Badge dot className="absolute -top-0.5 -right-0.5" />
      </div>
    </HStack>
  );
}
