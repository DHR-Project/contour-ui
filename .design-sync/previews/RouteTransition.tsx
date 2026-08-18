// RouteTransition drives the cross-fade/push-pop between navigations via
// usePathname() -- outside a real Next.js router tree (as here) that context
// has no Provider, so usePathname() resolves to its documented default
// (null) rather than throwing, and the wrapper just renders its children
// settled at rest. There's no dedicated demo/story for this component (it's
// framework plumbing, not something a docs page showcases interactively),
// so these compose realistic page content the way it's actually used in
// app/docs/layout.tsx: wrapping only the page content, not persistent
// chrome.
import { RouteTransition } from "@/components/ui/route-transition";
import { HStack, VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

function DemoPage() {
  return (
    <VStack gap="3" className="w-full max-w-sm p-(--space-6)">
      <Text textStyle="title-3">Inbox</Text>
      <Card elevation="flat">
        <HStack gap="3" align="center">
          <Avatar name="Alice Johnson" size="md" />
          <VStack gap="0">
            <Text textStyle="body" weight="medium">
              Alice Johnson
            </Text>
            <Text textStyle="footnote" color="secondary">
              Reviewed your pull request
            </Text>
          </VStack>
        </HStack>
      </Card>
      <Card elevation="flat">
        <HStack gap="3" align="center">
          <Avatar name="Marcus Lee" size="md" />
          <VStack gap="0">
            <Text textStyle="body" weight="medium">
              Marcus Lee
            </Text>
            <Text textStyle="footnote" color="secondary">
              Shared a document with you
            </Text>
          </VStack>
        </HStack>
      </Card>
    </VStack>
  );
}

// cacheDepth only affects cross-navigation caching behavior, not the resting
// visual output -- a second export toggling it would render pixel-identical
// to Default in a single static shot, so this stays a single export.
export function Default() {
  return (
    <RouteTransition>
      <DemoPage />
    </RouteTransition>
  );
}
