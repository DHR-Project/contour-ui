import { VStack, HStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/icon";

export function ArticleMeta() {
  return (
    <VStack gap="1" className="max-w-72">
      <Text textStyle="headline">Designing with system colors</Text>
      <Text textStyle="footnote" color="secondary">
        Published Aug 12 &middot; 6 min read
      </Text>
    </VStack>
  );
}

export function GapScale() {
  return (
    <VStack gap="5">
      <VStack gap="1">
        <Text textStyle="caption-2" color="tertiary">
          Tight gap
        </Text>
        <div className="h-3 w-32 rounded-sm bg-fill-secondary" />
        <div className="h-3 w-32 rounded-sm bg-fill-secondary" />
      </VStack>
      <VStack gap="4">
        <Text textStyle="caption-2" color="tertiary">
          Loose gap
        </Text>
        <div className="h-3 w-32 rounded-sm bg-fill-secondary" />
        <div className="h-3 w-32 rounded-sm bg-fill-secondary" />
      </VStack>
    </VStack>
  );
}

export function CenteredEmptyState() {
  return (
    <VStack gap="3" align="center" className="w-64 py-(--space-6)">
      <span className="text-label-tertiary">
        <Icon name="search" size="lg" />
      </span>
      <Text textStyle="body" weight="medium">
        No results found
      </Text>
      <Text textStyle="footnote" color="secondary" className="text-center">
        Try a different search term or clear your filters.
      </Text>
    </VStack>
  );
}
