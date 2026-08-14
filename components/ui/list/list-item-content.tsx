import type { ReactNode } from "react";
import { Flex } from "@/components/ui/flex";
import { VStack } from "@/components/ui/stack";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";

export interface ListItemContentProps {
  leadingIcon?: IconName;
  /** Usually a string; accepts ReactNode too (e.g. search-result rows wrap matched substrings in a highlight <mark>). */
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
}

// Presentational only -- no interaction, no onClick/swipe/keyboard handling.
// Shared by ListItem's own interactive shell and Dropdown's DropdownMenu.Item
// (contour-spec-list.md SS7) so the two don't stack conflicting interactive
// layers on top of each other.
export function ListItemContent({ leadingIcon, title, subtitle, trailing }: ListItemContentProps) {
  // container={false}: see Flex's ContainerGotcha story -- this wrapper
  // needs to fill/shrink with its (already width-constrained) parent row,
  // not act as its own size-containment root.
  return (
    <Flex align="center" gap="icon-text" container={false}>
      {leadingIcon && <Icon name={leadingIcon} size="md" className="shrink-0" />}
      <VStack gap="0" container={false} className="min-w-0 flex-1">
        <Text textStyle="body" truncate>
          {title}
        </Text>
        {subtitle && (
          <Text textStyle="footnote" color="secondary" truncate>
            {subtitle}
          </Text>
        )}
      </VStack>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </Flex>
  );
}
