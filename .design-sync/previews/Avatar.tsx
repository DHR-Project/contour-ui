import { Avatar } from "@/components/ui/avatar";
import { HStack } from "@/components/ui/stack";

export function Sizes() {
  return (
    <HStack gap="4" align="center">
      <Avatar name="Alice Johnson" size="xs" />
      <Avatar name="Bob Smith" size="sm" />
      <Avatar name="Carol White" size="md" />
      <Avatar name="David Lee" size="lg" />
      <Avatar name="Eve Kim" size="xl" />
    </HStack>
  );
}

export function Fallback() {
  return (
    <HStack gap="4" align="center">
      {/* No props -- icon fallback */}
      <Avatar size="md" />
      {/* Name only -- initials + deterministic color */}
      <Avatar name="Alice Johnson" size="md" />
      <Avatar name="Bob Smith" size="md" />
      <Avatar name="Carol White" size="md" />
      {/* Broken src -- falls back to initials after delayMs=600 */}
      <Avatar src="https://example.com/broken.jpg" alt="Broken" name="Nguyễn Văn A" size="md" />
    </HStack>
  );
}

export function Shapes() {
  return (
    <HStack gap="4" align="center">
      <Avatar name="Alice Johnson" size="lg" shape="circle" />
      <Avatar name="Alice Johnson" size="lg" shape="squircle" />
    </HStack>
  );
}
