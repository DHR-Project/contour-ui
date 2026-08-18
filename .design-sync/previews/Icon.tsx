import { Icon } from "@/components/icon";
import { HStack } from "@/components/ui/stack";

export function Colors() {
  return (
    <HStack gap="4" align="center">
      <Icon name="bell" size="lg" />
      <Icon name="search" size="lg" color="tint" />
      <Icon name="trash" size="lg" color="destructive" />
      <Icon name="circle-check" size="lg" color="success" />
    </HStack>
  );
}

export function Sizes() {
  return (
    <HStack gap="4" align="center">
      <Icon name="star" size="xs" />
      <Icon name="star" size="sm" />
      <Icon name="star" size="md" />
      <Icon name="star" size="xl" />
    </HStack>
  );
}

export function Accessible() {
  return (
    <Icon
      name="triangle-alert"
      size="md"
      color="warning"
      decorative={false}
      aria-label="Warning"
    />
  );
}
