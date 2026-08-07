"use client";

import Link from "next/link";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { useSizeClass } from "@/lib/hooks/use-size-class";

interface ComponentDetailBreadcrumbProps {
  title: string;
}

// Compact-only: regular+ keeps DocsSidebarRail (with its own active-item
// highlight) on screen at all times, so a breadcrumb trail here would only
// repeat what the sidebar already shows.
export function ComponentDetailBreadcrumb({ title }: ComponentDetailBreadcrumbProps) {
  const sizeClass = useSizeClass();

  if (sizeClass !== "compact") return null;

  return (
    <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-(--space-1)">
      <Link href="/docs" className="text-label-secondary hover-fine:text-label-primary shrink-0">
        <Text as="span" textStyle="footnote">
          Docs
        </Text>
      </Link>
      <Icon name="chevron-right" size="xs" className="text-label-tertiary shrink-0" />
      <Link
        href="/docs/components"
        className="text-label-secondary hover-fine:text-label-primary shrink-0"
      >
        <Text as="span" textStyle="footnote">
          Components
        </Text>
      </Link>
      <Icon name="chevron-right" size="xs" className="text-label-tertiary shrink-0" />
      <Text as="span" textStyle="footnote" weight="medium" truncate aria-current="page">
        {title}
      </Text>
    </nav>
  );
}
