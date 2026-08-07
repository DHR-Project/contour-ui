import Link from "next/link";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";

interface ComponentDetailBreadcrumbProps {
  title: string;
}

export function ComponentDetailBreadcrumb({ title }: ComponentDetailBreadcrumbProps) {
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
