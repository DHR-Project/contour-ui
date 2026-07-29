export interface DocsNavItem {
  title: string;
  href: string;
  badge?: string;
}

export interface DocsNavGroup {
  title: string;
  items: DocsNavItem[];
}

export const docsNavGroups: DocsNavGroup[] = [
  {
    title: "Overview",
    items: [{ title: "Introduction", href: "/docs" }],
  },
  {
    title: "Foundations",
    items: [
      { title: "Tokens", href: "/docs/tokens" },
      { title: "Color", href: "/docs/color" },
    ],
  },
  {
    title: "Layout",
    items: [
      { title: "Flex", href: "/docs/flex" },
      { title: "Stack", href: "/docs/stack" },
      { title: "Grid", href: "/docs/grid" },
      { title: "Spacer", href: "/docs/spacer" },
      { title: "Container", href: "/docs/container" },
    ],
  },
  {
    title: "Components",
    items: [
      { title: "Button", href: "/docs/button" },
      { title: "Switch", href: "/docs/switch" },
      { title: "Checkbox", href: "/docs/checkbox" },
      { title: "Radio Group", href: "/docs/radio-group" },
      { title: "Slider", href: "/docs/slider" },
      { title: "Segmented", href: "/docs/segmented" },
      { title: "Text Field", href: "/docs/text-field" },
      { title: "Textarea", href: "/docs/textarea" },
      { title: "Select", href: "/docs/select", badge: "Beta" },
      { title: "Label", href: "/docs/label" },
      { title: "Dropdown", href: "/docs/dropdown", badge: "Beta" },
      { title: "List", href: "/docs/list", badge: "Beta" },
      { title: "Divider", href: "/docs/divider" },
      { title: "Text", href: "/docs/text" },
      { title: "Icon", href: "/docs/icon" },
      { title: "Badge", href: "/docs/badge" },
    ],
  },
];

// Flat list, derived from the groups above. Kept for call sites that don't need grouping.
export const docsNavItems: DocsNavItem[] = docsNavGroups.flatMap((group) => group.items);
