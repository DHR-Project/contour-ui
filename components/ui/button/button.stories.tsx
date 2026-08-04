import type { Story } from "@ladle/react";
import { Button } from "./button";
import { HStack, VStack } from "@/components/ui/stack";

const meta = {
  title: "Components / Button",
};

export default meta;

/**
 * `variant` x `role` is orthogonal, matching UIButton.Configuration --
 * destructive is a role, not a 4th parallel variant (contour-spec-button.md
 * SS1). At most one `filled` button per screen.
 */
export const VariantAndRole: Story = () => (
  <VStack gap="section">
    <HStack gap="3">
      <Button variant="filled">Filled</Button>
      <Button variant="tinted">Tinted</Button>
      <Button variant="plain">Plain</Button>
    </HStack>
    <HStack gap="3">
      <Button variant="filled" role="destructive">
        Delete Account
      </Button>
      <Button variant="tinted" role="destructive">
        Delete Account
      </Button>
      <Button variant="plain" role="destructive">
        Remove from list
      </Button>
    </HStack>
  </VStack>
);

export const Sizes: Story = () => (
  <HStack gap="3" align="center">
    <Button size="sm">Small</Button>
    <Button size="md">Medium</Button>
    <Button size="lg">Large</Button>
  </HStack>
);

export const WithIcons: Story = () => (
  <VStack gap="3">
    <HStack gap="3">
      <Button leadingIcon="plus">New item</Button>
      <Button trailingIcon="chevron-right">Continue</Button>
    </HStack>
    <HStack gap="3">
      <Button leadingIcon="trash" aria-label="Delete" />
      <Button variant="tinted" leadingIcon="settings" aria-label="Settings" />
      <Button variant="plain" leadingIcon="share" aria-label="Share" />
    </HStack>
  </VStack>
);

export const Loading: Story = () => (
  <HStack gap="3">
    <Button loading>Saving</Button>
    <Button loading leadingIcon="plus">
      Saving
    </Button>
    <Button loading leadingIcon="trash" aria-label="Deleting" />
  </HStack>
);

export const Disabled: Story = () => (
  <HStack gap="3">
    <Button disabled>Filled</Button>
    <Button variant="tinted" disabled>
      Tinted
    </Button>
    <Button variant="plain" disabled>
      Plain
    </Button>
  </HStack>
);

export const FullWidth: Story = () => (
  <div className="w-80">
    <Button fullWidth>Continue</Button>
  </div>
);

/**
 * Do: at most one `filled` (primary) action per screen/section.
 * Don't: multiple filled buttons competing for attention -- use tinted/plain
 * for secondary actions instead (guideline rule 1.3, Content-first restraint).
 */
export const DoAndDont: Story = () => (
  <VStack gap="section">
    <div>
      <p className="mb-2 text-footnote text-label-secondary">Do</p>
      <HStack gap="3">
        <Button variant="filled">Save</Button>
        <Button variant="plain">Cancel</Button>
      </HStack>
    </div>
    <div>
      <p className="mb-2 text-footnote text-label-secondary">
        Don&apos;t (two competing filled actions)
      </p>
      <HStack gap="3">
        <Button variant="filled">Save</Button>
        <Button variant="filled">Cancel</Button>
      </HStack>
    </div>
  </VStack>
);
