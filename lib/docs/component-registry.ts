/**
 * Central registry for all 29 Contour components.
 * Status reflects the real state of components/ui, not the roadmap notes.
 */

export type ComponentStatus =
  | "complete" // Has code, stories, tests -- live demo available
  | "spec-only" // Spec locked, no code yet
  | "deferred"; // Spec locked, explicitly blocked on dependency

export interface ComponentCategory {
  id: string;
  label: string;
}

export const CATEGORIES: ComponentCategory[] = [
  { id: "layout", label: "Layout" },
  { id: "navigation", label: "Navigation" },
  { id: "controls", label: "Controls" },
  { id: "display", label: "Display" },
  { id: "feedback", label: "Feedback" },
  { id: "overlay", label: "Overlay" },
];

export interface ComponentMeta {
  /** URL slug for /docs/components/[slug] */
  slug: string;
  /** Display name */
  name: string;
  /** Short description (one sentence, English) */
  description: string;
  /** Category id */
  category: string;
  /** Build status */
  status: ComponentStatus;
  /**
   * Import path relative to repo root for live demo.
   * Only set when status === "complete".
   */
  importPath?: string;
  /**
   * For deferred components, a specific human-readable reason.
   */
  deferredReason?: string;
}

export const COMPONENTS: ComponentMeta[] = [
  // Layout
  {
    slug: "flex",
    name: "Flex",
    description: "Flexbox container with token-constrained gap, alignment, and direction props.",
    category: "layout",
    status: "complete",
    importPath: "@/components/ui/flex",
  },
  {
    slug: "grid",
    name: "Grid",
    description: "CSS Grid wrapper with responsive columns per size-class via scoped <style>.",
    category: "layout",
    status: "complete",
    importPath: "@/components/ui/grid",
  },
  {
    slug: "stack",
    name: "Stack",
    description: "HStack and VStack convenience aliases built on Flex for directional layouts.",
    category: "layout",
    status: "complete",
    importPath: "@/components/ui/stack",
  },
  {
    slug: "container",
    name: "Container",
    description: "Page-boundary handler for margin and safe-area insets; does not arrange children.",
    category: "layout",
    status: "complete",
    importPath: "@/components/ui/container",
  },

  // Navigation
  {
    slug: "nav-bar",
    name: "NavBar",
    description: "Scrolled-linked navigation bar with Large Title, progressive blur, and leading/trailing actions.",
    category: "navigation",
    status: "complete",
    importPath: "@/components/ui/nav-bar",
  },
  {
    slug: "tab-bar",
    name: "TabBar",
    description: "Bottom tab bar with floating-pill selection indicator that switches to Sidebar at regular+ size-class.",
    category: "navigation",
    status: "complete",
    importPath: "@/components/ui/tab-bar",
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    description: "Contextual action bar with progressive blur; placed at bottom on compact or bottom of a panel on regular+.",
    category: "navigation",
    status: "complete",
    importPath: "@/components/ui/toolbar",
  },
  {
    slug: "sidebar",
    name: "Sidebar",
    description: "Navigation column for SplitView that mirrors TabBar items with row-level selection state.",
    category: "navigation",
    status: "deferred",
    deferredReason: "Not yet implemented — waiting for SplitView / RouteTransition",
  },

  // Controls
  {
    slug: "button",
    name: "Button",
    description: "Primary interactive element with filled, tinted, and plain variants across default and destructive roles.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/button",
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    description: "Two-state plus indeterminate control with 44px touch target covering the label.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/checkbox",
  },
  {
    slug: "radio",
    name: "Radio",
    description: "Radio group with horizontal and vertical layout options, sharing the Checkbox hit-area pattern.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/radio",
  },
  {
    slug: "switch",
    name: "Switch",
    description: "Toggle control with fixed white thumb and spring-animated track.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/switch",
  },
  {
    slug: "slider",
    name: "Slider",
    description: "Range input supporting single and multi-thumb (range) modes with spring release animation.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/slider",
  },
  {
    slug: "segmented-control",
    name: "SegmentedControl",
    description: "Mutually exclusive option selector with shared-element pill and drag-select support.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/segmented-control",
  },
  {
    slug: "text-field",
    name: "TextField",
    description: "Single-line text input with optional leading/trailing icons, error state, and fixed padding.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/text-field",
  },
  {
    slug: "textarea",
    name: "Textarea",
    description: "Multi-line auto-resizing text input with character counter and color-coded threshold.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/textarea",
  },
  {
    slug: "search-field",
    name: "SearchField",
    description: "Text input with built-in popover combobox, built on TextField with content-swap animation.",
    category: "controls",
    status: "complete",
    importPath: "@/components/ui/search-field",
  },

  // Display
  {
    slug: "text",
    name: "Text",
    description: "Typography primitive mapping the 11-style Dynamic Type scale with density and color control.",
    category: "display",
    status: "complete",
    importPath: "@/components/ui/text",
  },
  {
    slug: "icon",
    name: "Icon",
    description: "Abstraction layer over lucide-react that enforces token-sized, stroke-width-consistent icons.",
    category: "display",
    status: "complete",
    importPath: "@/components/icon",
  },
  {
    slug: "card",
    name: "Card",
    description: "Content container with flat or raised elevation and responsive inset padding.",
    category: "display",
    status: "complete",
    importPath: "@/components/ui/card",
  },
  {
    slug: "list",
    name: "List",
    description: "Virtualization-ready list with swipe actions (touch), hover reveal (desktop), and animated add/remove.",
    category: "display",
    status: "complete",
    importPath: "@/components/ui/list",
  },
  {
    slug: "badge",
    name: "Badge",
    description: "Counter and status badge in solid or tinted tone, designed for safe contrast on any background.",
    category: "display",
    status: "complete",
    importPath: "@/components/ui/badge",
  },
  {
    slug: "avatar",
    name: "Avatar",
    description: "User avatar with image, initials fallback, and optional progress ring; deterministic initials color.",
    category: "display",
    status: "complete",
    importPath: "@/components/ui/avatar",
  },
  {
    slug: "progress",
    name: "Progress",
    description: "Circular and linear progress indicators; linear is always determinate.",
    category: "display",
    status: "complete",
    importPath: "@/components/ui/progress",
  },

  // Feedback
  {
    slug: "alert",
    name: "Alert",
    description: "Non-dismissible dialog built on Radix AlertDialog, requiring explicit user action.",
    category: "feedback",
    status: "complete",
    importPath: "@/components/ui/alert",
  },
  {
    slug: "toast",
    name: "Toast",
    description: "Ephemeral notification stack that collapses or expands based on input modality.",
    category: "feedback",
    status: "complete",
    importPath: "@/components/ui/toast",
  },

  // Overlay
  {
    slug: "sheet",
    name: "Sheet",
    description: "Adaptive presentation surface with snap points, drag-to-dismiss, and receding card stack.",
    category: "overlay",
    status: "spec-only",
  },
  {
    slug: "dropdown",
    name: "Dropdown",
    description: "Context menu and tooltip built on Radix, sharing ListItemContent with List for consistent row anatomy.",
    category: "overlay",
    status: "complete",
    importPath: "@/components/ui/dropdown",
  },
  {
    slug: "context-menu",
    name: "ContextMenu",
    description: "Right-click / long-press menu reusing Dropdown's render and submenu-stack logic.",
    category: "overlay",
    status: "complete",
    importPath: "@/components/ui/context-menu",
  },
  {
    slug: "route-transition",
    name: "RouteTransition",
    description: "Navigation stack animation wrapper for App Router, using React Activity for route caching.",
    category: "overlay",
    status: "spec-only",
  },
  {
    slug: "split-view",
    name: "SplitView",
    description: "Multi-column adaptive layout built on RouteTransition with draggable column resize.",
    category: "overlay",
    status: "spec-only",
  },
];

/** Look up a component by its slug. Returns undefined if not found. */
export function getComponent(slug: string): ComponentMeta | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}

/** Get all components in a category. */
export function getComponentsByCategory(categoryId: string): ComponentMeta[] {
  return COMPONENTS.filter((c) => c.category === categoryId);
}

/** Get all slugs (for generateStaticParams). */
export function getAllSlugs(): string[] {
  return COMPONENTS.map((c) => c.slug);
}
