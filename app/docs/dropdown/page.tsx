"use client";

import { useState } from "react";

import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
import { List, ListItem } from "@/components/ui/list";
import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/stack";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { DocsReference } from "@/components/docs/reference";

const triggerClass =
  "flex h-11 w-11 items-center justify-center rounded-full bg-tint text-white shadow-lg";

const usageCode = `import { Dropdown, DropdownContent, DropdownTrigger } from "@/components/ui/dropdown";
import { List, ListItem } from "@/components/ui/list";
import { Icon } from "@/components/icon";

export function Example() {
  return (
    <Dropdown>
      <DropdownTrigger className="..." aria-label="Open menu">
        <Icon name="plus" size={20} />
      </DropdownTrigger>
      <DropdownContent className="w-56">
        <List>
          <ListItem leadingIcon="user" title="Profile" onClick={() => {}} />
          <ListItem leadingIcon="settings" title="Settings" onClick={() => {}} />
          <ListItem leadingIcon="info" title="Help & Support" onClick={() => {}} />
        </List>
      </DropdownContent>
    </Dropdown>
  );
}`;

const sidesCode = `<DropdownContent side="right" align="start">...</DropdownContent>`;

const asChildCode = `<DropdownTrigger asChild>
  <button aria-label="Open menu">...</button>
</DropdownTrigger>`;

const toc = [
  { id: "usage", title: "Usage" },
  { id: "sides", title: "Side & align" },
  { id: "as-child", title: "asChild" },
  { id: "controlled", title: "Controlled" },
  { id: "accessibility", title: "Accessibility" },
  { id: "reference", title: "Reference" },
];

function ControlledDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown open={open} onOpenChange={setOpen}>
      <DropdownTrigger className={triggerClass} aria-label="Toggle">
        <Icon name={open ? "close" : "plus"} size={20} />
      </DropdownTrigger>
      <DropdownContent className="w-56 p-4">
        <Text variant="footnote">open = {String(open)}</Text>
      </DropdownContent>
    </Dropdown>
  );
}

export default function DropdownDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="8">
        <VStack gap="2">
          <Text variant="largeTitle">Dropdown</Text>
          <Text variant="body" color="secondary">
            A floating panel of arbitrary content, anchored to a trigger. Built entirely on
            framer-motion - open state, the trigger-to-content morph, outside-click, and
            Escape-to-close are all hand-written, not a Radix interactive primitive.
            @radix-ui/react-popper is used only for its headless anchor-positioning math (side,
            align, collision avoidance), not for any UI or interaction behavior.
          </Text>
          <Text variant="footnote" color="tertiary">
            Content morphs directly out of the trigger&apos;s own box - same FLIP technique as
            Select - rather than appearing as a second, disconnected element.
          </Text>
        </VStack>

        <VStack id="usage" gap="3" className="scroll-mt-6">
          <Text variant="title3">Usage</Text>
          <ComponentPreview>
            <Dropdown>
              <DropdownTrigger className={triggerClass} aria-label="Open menu">
                <Icon name="plus" size={20} />
              </DropdownTrigger>
              <DropdownContent className="w-56">
                <List variant="menu">
                  <ListItem leadingIcon="user" title="Profile" onClick={() => {}} chevron />
                  <ListItem leadingIcon="settings" title="Settings" onClick={() => {}} />
                  <ListItem leadingIcon="info" title="Help & Support" onClick={() => {}} />
                </List>
              </DropdownContent>
            </Dropdown>
          </ComponentPreview>
          <CodeBlock code={usageCode} />
        </VStack>

        <VStack id="sides" gap="3" className="scroll-mt-6">
          <Text variant="title3">Side &amp; align</Text>
          <Text variant="footnote" color="tertiary">
            DropdownContent passes side/align/sideOffset/alignOffset/collisionPadding straight
            through to Popper.Content.
          </Text>
          <ComponentPreview>
            <Dropdown>
              <DropdownTrigger className={triggerClass} aria-label="Open to the right">
                <Icon name="plus" size={20} />
              </DropdownTrigger>
              <DropdownContent side="right" className="w-56 p-4">
                <Text variant="footnote">Opens to the right</Text>
              </DropdownContent>
            </Dropdown>
          </ComponentPreview>
          <CodeBlock code={sidesCode} />
        </VStack>

        <VStack id="as-child" gap="3" className="scroll-mt-6">
          <Text variant="title3">asChild</Text>
          <Text variant="footnote" color="tertiary">
            Trigger off an existing element (e.g. a Button) instead of rendering a bare
            &lt;button&gt;.
          </Text>
          <ComponentPreview>
            <Dropdown>
              <DropdownTrigger asChild>
                <button className={triggerClass} aria-label="Open menu">
                  <Icon name="settings" size={20} />
                </button>
              </DropdownTrigger>
              <DropdownContent className="w-56 p-4">
                <Text variant="footnote">Triggered off a plain &lt;button&gt; via asChild</Text>
              </DropdownContent>
            </Dropdown>
          </ComponentPreview>
          <CodeBlock code={asChildCode} />
        </VStack>

        <VStack id="controlled" gap="3" className="scroll-mt-6">
          <Text variant="title3">Controlled</Text>
          <ComponentPreview>
            <ControlledDemo />
          </ComponentPreview>
        </VStack>

        <VStack id="accessibility" gap="3" className="scroll-mt-6">
          <Text variant="title3">Accessibility</Text>
          <Text variant="footnote" color="tertiary">
            A deliberate trade-off for full animation control: Dropdown wires up
            aria-expanded/aria-controls, Escape, and outside-click by hand, but has no built-in
            focus trap or roving tabindex the way a Radix-based primitive would. Reach for Select
            (or a future Dialog/Popover built on Radix) for anything that needs that.
          </Text>
        </VStack>

        <DocsReference
          library="@radix-ui/react-popper"
          links={[
            {
              label: "Radix Popper API reference",
              href: "https://www.radix-ui.com/primitives/docs/utilities/popper",
            },
          ]}
        />
      </VStack>
    </DocsPage>
  );
}
