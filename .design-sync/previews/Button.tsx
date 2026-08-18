import { Button } from "@/components/ui/button";
import { HStack } from "@/components/ui/stack";

export function Variants() {
  return (
    <HStack gap="3" wrap="wrap">
      <Button variant="filled">Filled</Button>
      <Button variant="tinted">Tinted</Button>
      <Button variant="plain">Plain</Button>
    </HStack>
  );
}

export function RolesAndStates() {
  return (
    <HStack gap="3" wrap="wrap">
      <Button variant="filled" role="destructive">
        Delete
      </Button>
      <Button variant="tinted" leadingIcon="share">
        Share
      </Button>
      <Button variant="plain" loading>
        Loading
      </Button>
      <Button variant="filled" disabled>
        Disabled
      </Button>
    </HStack>
  );
}

export function Sizes() {
  return (
    <HStack gap="3" wrap="wrap" align="center">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </HStack>
  );
}

export function IconsAndShape() {
  return (
    <HStack gap="3" wrap="wrap" align="center">
      <Button trailingIcon="chevron-right">Next</Button>
      <Button corner="squircle" variant="tinted">
        Squircle
      </Button>
      <Button aria-label="Favorite" leadingIcon="star" variant="plain" />
    </HStack>
  );
}

export function FullWidth() {
  return (
    <Button fullWidth className="max-w-64">
      Full width
    </Button>
  );
}
