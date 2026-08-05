import type { Story } from "@ladle/react";
import { Avatar } from "./avatar";
import { HStack, VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Progress } from "@/components/ui/progress";
import { getAvatarProgressRing } from "@/lib/utils/avatar-progress-ring";

const meta = {
  title: "Components / Avatar",
};

export default meta;

export const Sizes: Story = () => (
  <HStack gap="4" align="center">
    <Avatar name="Alice Johnson" size="xs" />
    <Avatar name="Bob Smith" size="sm" />
    <Avatar name="Carol White" size="md" />
    <Avatar name="David Lee" size="lg" />
    <Avatar name="Eve Kim" size="xl" />
  </HStack>
);

export const FallbackChain: Story = () => (
  <HStack gap="4" align="center">
    {/* No src, no name — icon fallback */}
    <Avatar />
    {/* No src, name — initials + deterministic color */}
    <Avatar name="Alice Johnson" />
    <Avatar name="Bob Smith" />
    <Avatar name="Carol White" />
    {/* With src (will use initials here since the URL is fake) */}
    <Avatar
      src="https://example.com/broken.jpg"
      alt="Broken image test"
      name="Nguyễn Văn A"
    />
  </HStack>
);

export const Shapes: Story = () => (
  <HStack gap="4" align="center">
    <Avatar name="Alice Johnson" size="lg" shape="circle" />
    <Avatar name="Alice Johnson" size="lg" shape="squircle" />
  </HStack>
);

export const DeterministicColors: Story = () => (
  <VStack gap="4">
    <Text textStyle="footnote" color="secondary">
      Same name always produces the same color — consistent across screens.
    </Text>
    <HStack gap="3" align="center">
      {[
        "Alice Johnson",
        "Bob Smith",
        "Carol White",
        "David Lee",
        "Eve Kim",
        "Frank Liu",
        "Grace Park",
        "Henry Chen",
        "Iris Nguyen",
        "Jack Brown",
        "Kate Wilson",
        "Liam Davis",
      ].map((name) => (
        <Avatar key={name} name={name} size="sm" />
      ))}
    </HStack>
  </VStack>
);

export const WithProgressRing: Story = () => (
  <HStack gap="8" align="center">
    {(["sm", "md", "lg", "xl"] as const).map((size) => (
      <div key={size} className="relative inline-block">
        <Avatar name="Alice Johnson" size={size} />
        <Progress
          value={65}
          color="tint"
          label="Upload progress"
          {...getAvatarProgressRing(size)}
          className="absolute inset-0 -m-1 pointer-events-none"
          style={{ margin: `-${size === "xl" ? 6 : size === "lg" ? 5 : 4}px` }}
        />
      </div>
    ))}
  </HStack>
);
