import { HStack } from "@/components/ui/stack";
import { Avatar } from "@/components/ui/avatar";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";

export function ProfileRow() {
  return (
    <HStack gap="3" align="center">
      <Avatar name="Alice Johnson" size="md" />
      <div>
        <Text textStyle="body" weight="medium">
          Alice Johnson
        </Text>
        <Text textStyle="footnote" color="secondary">
          alice@example.com
        </Text>
      </div>
    </HStack>
  );
}

export function IconLabelRow() {
  return (
    <HStack gap="2" align="center">
      <Icon name="bell" size="sm" color="tint" />
      <Text textStyle="footnote" color="secondary">
        3 new notifications
      </Text>
    </HStack>
  );
}

export function JustifyBetween() {
  return (
    <HStack justify="between" align="center" gap="3" className="w-72">
      <Text textStyle="body">Total</Text>
      <Text textStyle="body" weight="semibold">
        $128.00
      </Text>
    </HStack>
  );
}

export function Wrap() {
  return (
    <HStack gap="2" wrap="wrap" className="max-w-64">
      {["Design", "Frontend", "Accessibility", "Motion", "Tokens"].map((tag) => (
        <span
          key={tag}
          className="rounded-full bg-fill-secondary px-(--space-3) py-(--space-1) text-caption-1 text-label-secondary"
        >
          {tag}
        </span>
      ))}
    </HStack>
  );
}
