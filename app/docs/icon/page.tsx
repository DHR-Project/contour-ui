"use client";

import { useMemo, useState } from "react";

import { Icon } from "@/components/icon";
import { iconRegistry } from "@/components/icon/icon-registry";
import type { IconName } from "@/components/icon/icon.types";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { Grid } from "@/components/ui/grid";
import { TextField } from "@/components/ui/text-field";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const usageCode = `import { Icon } from "@/components/icon";

export function Example() {
  return <Icon name="search" />;
}`;

const iconNames = Object.keys(iconRegistry) as IconName[];

const toc = [
  { id: "usage", title: "Usage" },
  { id: "all-icons", title: "All icons" },
  { id: "reference", title: "Reference" },
];

export default function IconDocsPage() {
  const [query, setQuery] = useState("");

  const filteredIconNames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return iconNames;
    return iconNames.filter((name) => name.includes(normalized));
  }, [query]);

  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Icon</Text>
          <Text variant="body" color="secondary">
            A thin wrapper around lucide-react. Never import lucide-react directly in a
            component - go through icon-registry.ts so the icon set can be swapped in one place.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="all-icons" gap="3" className="scroll-mt-6">
          <Text variant="title3">
            All icons ({filteredIconNames.length}/{iconNames.length})
          </Text>
          <TextField
            type="text"
            size="sm"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
            placeholder="Search icons..."
            aria-label="Search icons"
            leadingIcon="search"
            wrapperClassName="max-w-xs"
          />
          {filteredIconNames.length === 0 ? (
            <Text variant="footnote" color="tertiary">
              No icons found.
            </Text>
          ) : (
            <Grid
              columns={{ base: "2", regular: "3", regularLg: "4" }}
              gap="3"
              className="rounded-lg border border-separator p-6"
            >
              {filteredIconNames.map((name) => (
                <VStack
                  key={name}
                  align="center"
                  justify="center"
                  gap="2"
                  className="rounded-md p-4 text-center hover:bg-fill-quaternary"
                >
                  <Icon name={name} size={20} className="text-label-primary" />
                  <Text as="span" variant="caption2" color="tertiary" className="font-mono">
                    {name}
                  </Text>
                </VStack>
              ))}
            </Grid>
          )}
        </VStack>

        <DocsReference
          library="lucide-react"
          links={[{ label: "lucide-react icon list", href: "https://lucide.dev/icons" }]}
        />
      </VStack>
    </DocsPage>
  );
}
