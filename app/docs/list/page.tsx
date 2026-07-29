"use client";

import { useState } from "react";

import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
import { List, ListItem } from "@/components/ui/list";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";

const usageCode = `import { List, ListItem } from "@/components/ui/list";

export function Example() {
  return (
    <List>
      <ListItem leadingIcon="user" title="Profile" subtitle="Name, photo" chevron onClick={...} />
      <ListItem leadingIcon="settings" title="Settings" chevron onClick={...} />
    </List>
  );
}`;

const groupedCode = `<List variant="grouped">
  <ListItem leadingIcon="user" title="Profile" chevron onClick={...} />
  <ListItem title="Version" trailing={<span>1.0.0</span>} />
</List>`;

const menuCode = `import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
import { List, ListItem } from "@/components/ui/list";

export function Example() {
  return (
    <Dropdown>
      <DropdownTrigger className="...">Open menu</DropdownTrigger>
      <DropdownContent className="w-56">
        <List variant="menu">
          <ListItem leadingIcon="user" title="Profile" onClick={...} />
          <ListItem leadingIcon="settings" title="Settings" onClick={...} />
        </List>
      </DropdownContent>
    </Dropdown>
  );
}`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "grouped", title: "Grouped" },
  { id: "menu", title: "Menu (in Dropdown)" },
  { id: "static-rows", title: "Static rows" },
  { id: "trailing", title: "Trailing content" },
  { id: "disabled", title: "Disabled" },
];

function ToggleRow() {
  const [on, setOn] = useState(true);
  return (
    <List variant="grouped" className="w-full max-w-80">
      <ListItem leadingIcon="info" title="Notifications" trailing={<Switch checked={on} onCheckedChange={setOn} />} />
      <ListItem leadingIcon="heart" title="Favorites only" trailing={<Switch />} />
    </List>
  );
}

export default function ListDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">List</Text>
          <Text variant="body" color="secondary">
            A row-based list. List renders the container (plain, grouped, or menu) and dividers;
            ListItem is the row - leading icon, title/subtitle, and any trailing content
            (a value, a Switch, a chevron). Built on the row and grouped-inset spacing tokens
            in styles/tokens.css.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <div className="w-full max-w-80 rounded-lg border border-separator p-4">
            <List>
              <ListItem
                leadingIcon="user"
                title="Profile"
                subtitle="Name, photo"
                chevron
                onClick={() => {}}
              />
              <ListItem leadingIcon="settings" title="Settings" chevron onClick={() => {}} />
            </List>
          </div>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="grouped" gap="3" className="scroll-mt-6">
          <Text variant="title3">Grouped</Text>
          <Text variant="footnote" color="tertiary">
            variant=&quot;grouped&quot; adds the rounded, bg-grouped-secondary card look - meant
            to sit on a bg-grouped-primary page background, a settings-style grouped list.
          </Text>
          <div className="w-full max-w-80 rounded-lg bg-bg-grouped-primary p-4">
            <List variant="grouped">
              <ListItem leadingIcon="user" title="Profile" chevron onClick={() => {}} />
              <ListItem title="Version" trailing={<span className="text-label-tertiary">1.0.0</span>} />
            </List>
          </div>
          <CodeBlock code={groupedCode} />
        </VStack>

        <VStack id="menu" gap="3" className="scroll-mt-6">
          <Text variant="title3">Menu (in Dropdown)</Text>
          <Text variant="footnote" color="tertiary">
            variant=&quot;menu&quot; drops the divider lines and card background in favor of
            compact rounded rows with a Select-style hover highlight - meant for floating-panel
            content (Dropdown, and later Popover), which already supplies its own
            background/border/shadow. A grouped card nested inside would double up on that
            chrome.
          </Text>
          <div className="w-full max-w-80 rounded-lg border border-separator p-8">
            <Dropdown>
              <DropdownTrigger className="rounded-md bg-fill-secondary px-3 py-2 text-body text-label-primary">
                Open menu
              </DropdownTrigger>
              <DropdownContent className="w-56">
                <List variant="menu">
                  <ListItem leadingIcon="user" title="Profile" onClick={() => {}} />
                  <ListItem leadingIcon="settings" title="Settings" onClick={() => {}} />
                  <ListItem leadingIcon="heart" title="Favorites" onClick={() => {}} />
                </List>
              </DropdownContent>
            </Dropdown>
          </div>
          <CodeBlock code={menuCode} />
        </VStack>

        <VStack id="static-rows" gap="3" className="scroll-mt-6">
          <Text variant="title3">Static rows</Text>
          <Text variant="footnote" color="tertiary">
            A ListItem without onClick or asChild renders as a plain (non-interactive) row - no
            hover state, no button semantics.
          </Text>
          <div className="w-full max-w-80 rounded-lg border border-separator p-4">
            <List variant="grouped">
              <ListItem title="Name" trailing={<span className="text-label-secondary">Contour</span>} />
              <ListItem title="Plan" trailing={<span className="text-label-secondary">Pro</span>} />
            </List>
          </div>
        </VStack>

        <VStack id="trailing" gap="3" className="scroll-mt-6">
          <Text variant="title3">Trailing content</Text>
          <Text variant="footnote" color="tertiary">
            trailing accepts any node - a Switch, a value string, a badge.
          </Text>
          <div className="w-full max-w-80 rounded-lg bg-bg-grouped-primary p-4">
            <ToggleRow />
          </div>
        </VStack>

        <VStack id="disabled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Disabled</Text>
          <div className="w-full max-w-80 rounded-lg border border-separator p-4">
            <List>
              <ListItem leadingIcon="user" title="Enabled row" chevron onClick={() => {}} />
              <ListItem
                leadingIcon="settings"
                title="Disabled row"
                chevron
                onClick={() => {}}
                disabled
              />
            </List>
          </div>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
