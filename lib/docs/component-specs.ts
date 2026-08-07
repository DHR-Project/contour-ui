/**
 * Full component spec data for all 29 Contour components.
 * Sourced directly from local-docs/contour-spec-*.md files.
 * Used by /docs/components/[slug]/page.tsx to render documentation.
 */

export interface TokenRef {
  /** CSS custom property name, e.g. "--tint" */
  name: string;
  /** Section reference, e.g. "§2.7" */
  section?: string;
  /** Brief description */
  description?: string;
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export interface StateRow {
  state: string;
  description: string;
}

export interface AnatomyItem {
  name: string;
  description: string;
}

export interface DoDontPair {
  do: string;
  dont: string;
}

export interface ComponentSpec {
  slug: string;
  name: string;
  description: string;
  anatomy?: AnatomyItem[];
  props?: PropRow[];
  states?: StateRow[];
  doDont?: DoDontPair[];
  tokens?: TokenRef[];
  notes?: string;
}

export const COMPONENT_SPECS: ComponentSpec[] = [
  // -------------------------------------------------------------------------
  // LAYOUT
  // -------------------------------------------------------------------------
  {
    slug: "flex",
    name: "Flex",
    description:
      "The lowest-level layout primitive — a thin wrapper over CSS Flexbox that serves as the foundation for Stack and any reusable flex-based layout. Defaults to container-type: inline-size for container queries.",
    anatomy: [
      { name: "Root element", description: "div (or any safe semantic element via `as` prop)" },
      { name: "CSS flex container", description: "Direction, justify, align, wrap, gap — all token-constrained" },
    ],
    props: [
      { name: "direction", type: '"row" | "row-reverse" | "column" | "column-reverse"', default: '"row"', description: "Flex direction" },
      { name: "justify", type: '"start" | "end" | "center" | "between" | "around" | "evenly"', default: '"start"', description: "justify-content" },
      { name: "align", type: '"start" | "end" | "center" | "stretch" | "baseline"', default: '"stretch"', description: "align-items" },
      { name: "wrap", type: '"nowrap" | "wrap" | "wrap-reverse"', default: '"nowrap"', description: "flex-wrap" },
      { name: "gap", type: 'SpaceToken | "icon-text" | "row" | "section"', default: "—", description: "Gap between children; prefer semantic tokens over raw scale" },
      { name: "container", type: "boolean", default: "true", description: "Enables container-type: inline-size for container queries. Set false inside another component to avoid containment side-effects." },
      { name: "as", type: '"div" | "section" | "article" | "header" | "footer" | "nav" | "ul" | "li" | "form"', default: '"div"', description: "Semantic HTML element — span and button are excluded" },
    ],
    states: [
      { state: "Default", description: "Flex container with container query enabled" },
      { state: "container={false}", description: "container-type: inline-size disabled — required for children with position: sticky/fixed or when shrink-to-fit sizing is needed" },
    ],
    doDont: [
      {
        do: 'Use gap="section" (semantic token) for section-level spacing — it automatically responds to size-class changes',
        dont: "Use a raw gap value like gap=\"8\" for section-level spacing — it ignores the responsive system",
      },
      {
        do: 'Use as="nav" for semantic navigation wrappers',
        dont: 'Use as="span" or as="button" — inline elements break flex context',
      },
    ],
    tokens: [
      { name: "--gap-icon-text", section: "§4.2", description: 'Maps to gap="icon-text"' },
      { name: "--padding-row-y", section: "§4.2", description: 'Maps to gap="row"' },
      { name: "--gap-section", section: "§4.2b", description: 'Maps to gap="section", responsive' },
    ],
  },

  {
    slug: "grid",
    name: "Grid",
    description:
      "CSS Grid wrapper for 2D layouts where rows and columns must align simultaneously. Use instead of Flex when true column alignment across multiple rows is required.",
    anatomy: [
      { name: "Root element", description: "div (or ul/ol/section via `as` prop)" },
      { name: "Grid container", description: "columns, gap, auto-fit/fill support" },
    ],
    props: [
      { name: "columns", type: 'number | Partial<Record<SizeClass, number>> | "auto-fit" | "auto-fill"', default: "1", description: "Column count — fixed, responsive by size-class, or automatic" },
      { name: "minItemWidth", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: "—", description: "Required when columns is auto-fit/auto-fill. Maps to 120/160/200/280/360px tokens." },
      { name: "gap", type: "SpaceToken | SemanticGap", default: "—", description: "Gap on both axes" },
      { name: "gapX", type: "SpaceToken | SemanticGap", default: "—", description: "Column-gap override" },
      { name: "gapY", type: "SpaceToken | SemanticGap", default: "—", description: "Row-gap override" },
      { name: "container", type: "boolean", default: "true", description: "Container query context" },
    ],
    doDont: [
      {
        do: 'Use columns="auto-fit" + minItemWidth="md" for responsive galleries without hardcoding breakpoints',
        dont: "Pass raw px values for minItemWidth — only preset tokens from the scale are accepted",
      },
      {
        do: "Use gapX/gapY when you need asymmetric spacing (e.g. more vertical gap in a photo grid)",
        dont: "Use Grid for 1D layouts — use Flex instead",
      },
    ],
    tokens: [
      { name: "--grid-min-item-xs/sm/md/lg/xl", section: "§4.5", description: "minItemWidth token values" },
    ],
  },

  {
    slug: "stack",
    name: "Stack",
    description:
      "HStack and VStack convenience aliases built on Flex. HStack locks direction to horizontal, VStack to vertical, making intent immediately clear without remembering row/column string values.",
    anatomy: [
      { name: "HStack", description: "Flex with direction='row', default gap='row'" },
      { name: "VStack", description: "Flex with direction='column', default gap='row'" },
    ],
    props: [
      { name: "direction", type: '"horizontal" | "vertical"', default: "required (Stack only)", description: "Sets flex direction. HStack/VStack omit this — direction is locked." },
      { name: "gap", type: "SpaceToken | SemanticGap", default: '"row"', description: "Default is 'row' (maps --padding-row-y) — unlike Flex which has no default" },
      { name: "justify / align / wrap / container / as", type: "inherited from Flex", default: "—", description: "All Flex props are available" },
    ],
    doDont: [
      {
        do: "Use HStack/VStack for the common case — intent is immediately clear",
        dont: 'Use <Flex direction="column"> where <VStack> would read more clearly',
      },
      {
        do: "Use <Stack direction={isCompact ? 'vertical' : 'horizontal'}> for conditional direction",
        dont: "Render {isCompact ? <VStack> : <HStack>} — Stack with conditional direction is cleaner",
      },
    ],
    tokens: [
      { name: "--padding-row-y", section: "§4.2", description: 'Default gap="row"' },
    ],
  },

  {
    slug: "container",
    name: "Container",
    description:
      "Handles the page/block boundary with the screen edge — applies --page-margin and safe-area insets at a single root point. Unlike Flex/Grid/Stack, it does not arrange children, only manages edge padding.",
    anatomy: [
      { name: "page variant", description: "Full-width; applies horizontal page margin + safe-area insets. Uses max() to honor whichever is larger." },
      { name: "content variant", description: "Adds max-width (720px) + margin-inline: auto for centered text content with comfortable line length." },
    ],
    props: [
      { name: "variant", type: '"page" | "content"', default: '"page"', description: "page = full-width shell; content = centered reading column (max-width 720px)" },
    ],
    doDont: [
      {
        do: "Compose Stack/Flex inside Container to arrange children — <Container><VStack gap='section'>…</VStack></Container>",
        dont: "Add gap/justify/align to Container itself — it has a single responsibility: edge padding",
      },
      {
        do: "Use variant='content' for text-heavy pages to limit line length to ~65–75 chars",
        dont: "Use Container to handle --safe-area-top/--safe-area-bottom — those belong to NavBar/TabBar",
      },
    ],
    tokens: [
      { name: "--page-margin", section: "§4.3", description: "Responsive horizontal margin" },
      { name: "--safe-area-left / --safe-area-right", section: "§4.4", description: "Physical edge insets" },
      { name: "--container-max-width", section: "§4.6", description: "720px — content variant max-width" },
    ],
  },

  // -------------------------------------------------------------------------
  // NAVIGATION
  // -------------------------------------------------------------------------
  {
    slug: "nav-bar",
    name: "NavBar",
    description:
      "Fixed top navigation bar with a scroll-linked Large Title that collapses to a compact centered title, progressive blur backdrop, and leading/trailing action slots.",
    anatomy: [
      { name: "Large Title area", description: "34px font, collapses on scroll" },
      { name: "Compact title", description: "Centered inline title shown after collapse" },
      { name: "Leading action", description: "Single icon button slot (max 1)" },
      { name: "Trailing actions", description: "Up to 2 icon button slots" },
      { name: "Progressive blur", description: "4-layer backdrop that ramps with scroll velocity" },
    ],
    props: [
      { name: "title", type: "string", default: "required", description: "Screen/page title" },
      { name: "largeTitleMode", type: "boolean", default: "true (compact) / false (regular+)", description: "Enables Large Title collapse on scroll" },
      { name: "leadingAction", type: "{ icon, onClick, label }", default: "—", description: "Single leading icon action" },
      { name: "trailingActions", type: "{ icon, onClick, label }[]", default: "—", description: "Up to 2 trailing icon actions — hard limit" },
      { name: "progressiveBlur", type: "boolean", default: "true", description: "Progressive blur backdrop" },
    ],
    states: [
      { state: "At top", description: "Transparent, no blur, Large Title fully visible" },
      { state: "Scrolling", description: "Large Title collapses; blur ramps up proportionally" },
      { state: "Scrolled", description: "Blur held at full; reduces when scrolling fast (velocity-adaptive)" },
    ],
    doDont: [
      {
        do: "Let NavBar own --safe-area-top — do not add top safe area padding in Container or page layout",
        dont: "Share API or state between NavBar and TabBar — they are independent components",
      },
      {
        do: "Keep trailingActions to 2 max — hard limit due to narrow bar",
        dont: "Use NavBar as a non-floating element that takes up space in document flow",
      },
    ],
    tokens: [
      { name: "--safe-area-top", section: "§4.4" },
      { name: "--material-regular", section: "§2.3", description: "Blur band backdrop" },
      { name: "--progressive-blur-layers / --progressive-blur-max", section: "§2.10" },
    ],
  },

  {
    slug: "tab-bar",
    name: "TabBar",
    description:
      "Primary navigation tab bar with floating-pill selection indicator. Renders at the bottom on compact, at the top as a pill on regular+, and toggles to Sidebar on regular+ by user preference.",
    anatomy: [
      { name: "Bottom bar (compact)", description: "Fixed bottom, icon + label per item, safe-area padding" },
      { name: "Top pill (regular+)", description: "Full-width blur band + floating pill with --material-thick background" },
      { name: "Sidebar (regular+, preference)", description: "Vertical navigation list, toggles from top pill" },
    ],
    props: [
      { name: "items", type: "{ icon, label, badge? }[]", default: "required", description: "Navigation items with optional badge count" },
      { name: "value", type: "string", default: "required", description: "Currently active item identifier" },
      { name: "onValueChange", type: "(value: string) => void", default: "required", description: "Selection change callback" },
    ],
    states: [
      { state: "Active item", description: "--tabbar-selection color (tint in light, white in dark)" },
      { state: "Inactive item", description: "--label-secondary color" },
      { state: "compact", description: "Bottom fixed position, no toggle" },
      { state: "regular+ top", description: "Full-width blur band + pill, toggle to sidebar available" },
    ],
    doDont: [
      {
        do: "Let TabBar determine its own position from size-class and saved preference",
        dont: "Hardcode position='bottom' on regular-width layouts — bottom tab bars are compact-only convention",
      },
      {
        do: "Ensure the blur band is inset-inline: 0 (full-width), not scoped to the pill width",
        dont: "Clip Progressive Blur to pill bounds — content at margins would appear unblurred",
      },
    ],
    tokens: [
      { name: "--tabbar-selection", section: "§10.3", description: "Active tab color" },
      { name: "--material-thick", section: "§2.3", description: "Pill background" },
      { name: "--safe-area-bottom", section: "§4.4", description: "Compact bottom padding" },
      { name: "--radius-full", section: "§5.1", description: "Pill shape" },
    ],
  },

  {
    slug: "toolbar",
    name: "Toolbar",
    description:
      "Contextual action bar with progressive blur, placed at the bottom of a screen (compact) or at the bottom of a panel (regular+). Simpler than NavBar — no adaptive logic.",
    anatomy: [
      { name: "Action row", description: "Horizontal list of icon+label action buttons" },
      { name: "Progressive blur backdrop", description: "Same mechanism as NavBar" },
    ],
    props: [
      { name: "actions", type: "{ icon?, label?, onClick }[]", default: "required", description: "Action buttons" },
      { name: "position", type: '"top" | "bottom"', default: '"bottom"', description: "Placement" },
      { name: "progressiveBlur", type: "boolean", default: "true", description: "Progressive blur backdrop" },
    ],
    doDont: [
      {
        do: "Use Toolbar for contextual, screen-specific actions",
        dont: "Use Toolbar as primary navigation — that's TabBar's role",
      },
    ],
    tokens: [
      { name: "--progressive-blur-*", section: "§2.10" },
      { name: "--safe-area-bottom", section: "§4.4" },
    ],
  },

  {
    slug: "sidebar",
    name: "Sidebar",
    description:
      "Navigation column for SplitView with shared-element selection indicator. Renders as a floating overlay (Progressive Blur, position: fixed) with icon+label rows mirroring TabBar items.",
    notes: "This component is deferred — awaiting SplitView and RouteTransition implementation first.",
    anatomy: [
      { name: "Sidebar root", description: "position: fixed, Progressive Blur backdrop" },
      { name: "Navigation rows", description: "icon + label + badge via ListItemContent" },
      { name: "Selection background", description: "layoutId morph between rows (springs.smooth)" },
    ],
    props: [
      { name: "items", type: "SidebarItem[]", default: "required", description: "{ value, icon, label, badge? }" },
      { name: "value", type: "string", default: "required", description: "Currently active route segment (controlled)" },
      { name: "onValueChange", type: "(value: string) => void", default: "required", description: "Selection handler — caller does router.push" },
    ],
    states: [
      { state: "Selected, window focused", description: "--sidebar-bg-active background" },
      { state: "Selected, window blurred", description: "--sidebar-bg-inactive background (macOS Mail pattern)" },
      { state: "Unselected, hovered", description: "--fill-quaternary background" },
      { state: "Focused (keyboard)", description: "--focus-ring-* around full row" },
    ],
    doDont: [
      {
        do: "Use Sidebar as the sidebar prop value for SplitView — it is the canonical content for that slot",
        dont: "Put routing logic in Sidebar — call router.push in onValueChange at the SplitView level",
      },
    ],
    tokens: [
      { name: "--sidebar-bg-active / --sidebar-bg-inactive", section: "§10.6" },
      { name: "--fill-quaternary", section: "§2.2", description: "Hover state" },
    ],
  },

  // -------------------------------------------------------------------------
  // CONTROLS
  // -------------------------------------------------------------------------
  {
    slug: "button",
    name: "Button",
    description:
      "Primary interactive element with filled, tinted, and plain visual variants across default and destructive semantic roles. Composes Flex + Icon + Text internally with full token coverage.",
    anatomy: [
      { name: "Container (<button>)", description: "Handles press/hover/focus states" },
      { name: "Leading Icon", description: "Optional — auto-sized to button size" },
      { name: "Label", description: 'Text style="body" weight="semibold"' },
      { name: "Trailing Icon", description: "Optional" },
      { name: "Spinner", description: "Replaces leading icon in loading state" },
    ],
    props: [
      { name: "variant", type: '"filled" | "tinted" | "plain"', default: '"filled"', description: "Visual style: filled = solid tint bg, tinted = alpha tint bg, plain = no bg" },
      { name: "role", type: '"default" | "destructive"', default: '"default"', description: "Orthogonal to variant — swaps tint to --color-destructive" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls padding and icon size" },
      { name: "leadingIcon", type: "IconName", default: "—", description: "Icon before label" },
      { name: "trailingIcon", type: "IconName", default: "—", description: "Icon after label" },
      { name: "loading", type: "boolean", default: "false", description: "Disables interaction, shows spinner, keeps layout stable" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables interaction" },
      { name: "fullWidth", type: "boolean", default: "false", description: "Stretches button to fill container" },
      { name: "corner", type: '"standard" | "squircle"', default: '"standard"', description: "Border-radius style" },
      { name: "aria-label", type: "string", default: "—", description: "Required (TypeScript-enforced) when no children (icon-only button)" },
    ],
    states: [
      { state: "Default", description: "Full opacity, static" },
      { state: "Hover", description: "Background color transition via --duration-fast — pointer: fine only" },
      { state: "Pressed", description: "Scale 0.97 via --duration-instant spring" },
      { state: "Focus", description: "--focus-ring-* shown on :focus-visible" },
      { state: "Loading", description: "Spinner visible, non-interactive, layout stable" },
      { state: "Disabled", description: "Opacity 0.4, non-interactive" },
    ],
    doDont: [
      {
        do: "Use maximum one filled button per screen — it is the highest-emphasis action",
        dont: "Place two filled buttons side-by-side; one should be tinted or plain",
      },
      {
        do: "Use role='destructive' with any variant to signal danger",
        dont: "Create a separate hard-coded 'red button' variant outside the role system",
      },
    ],
    tokens: [
      { name: "--tint", section: "§2.7" },
      { name: "--tint-fill / --tint-fill-pressed", section: "§2.7a" },
      { name: "--color-destructive", section: "§2.2" },
      { name: "--button-bg-destructive", section: "§10.1" },
      { name: "--focus-ring-*", section: "§2.8" },
      { name: "--padding-control-x/y", section: "§4.2" },
      { name: "--duration-instant / --duration-fast", section: "§6.2" },
    ],
  },

  {
    slug: "checkbox",
    name: "Checkbox",
    description:
      "Radix-based checkbox with optional label, three states (unchecked / checked / indeterminate), and a scale+fade checkmark animation via springs.snappy.",
    anatomy: [
      { name: "Box", description: "20px (md) / 16px (sm) square, --radius-xs border" },
      { name: "Checkmark / Minus icon", description: "White check or minus icon inside box" },
      { name: "Label", description: 'Optional — Text style="body" via <label> wrapping' },
      { name: "Touch hit area", description: "Pseudo-element; must cover full label+box unit (rule 5.5a)" },
    ],
    props: [
      { name: "checked", type: 'boolean | "indeterminate"', default: "—", description: 'Controlled state; "indeterminate" shows minus icon' },
      { name: "onCheckedChange", type: "(checked: boolean) => void", default: "—", description: "Change handler" },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "Box size: md = 20px, sm = 16px" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables interaction, opacity 0.4" },
      { name: "label", type: "string", default: "—", description: "Optional label text; click label toggles checkbox" },
    ],
    states: [
      { state: "Unchecked", description: "Transparent box, --separator-opaque border" },
      { state: "Checked", description: "--tint box fill, white check icon" },
      { state: "Indeterminate", description: "--tint box fill, white minus icon" },
      { state: "Disabled", description: "Opacity 0.4 (any state)" },
      { state: "Focus", description: "--focus-ring-* around box on :focus-visible" },
    ],
    doDont: [
      {
        do: "Wrap the hit-area pseudo-element around the whole label (box + text) when a label is present",
        dont: "Place the hit-area only on the box when a label exists — users expect the full label to be clickable",
      },
      {
        do: 'Use "indeterminate" for partially-selected groups (e.g. select-all with some children unselected)',
        dont: "Simulate indeterminate state with a custom icon outside the checked prop",
      },
    ],
    tokens: [
      { name: "--separator-opaque", section: "§2.2", description: "Box border" },
      { name: "--tint", section: "§2.7", description: "Checked/indeterminate fill" },
      { name: "--radius-xs", section: "§5.1" },
    ],
  },

  {
    slug: "radio",
    name: "Radio",
    description:
      "RadioGroup built on Radix — always exposes options as a grouped set with vertical or horizontal layout. Individual Radio is never exported; use RadioGroup exclusively.",
    anatomy: [
      { name: "Circle", description: "20px (md) / 16px (sm), --radius-full border" },
      { name: "Selection dot", description: "Inner circle at 60% size, --tint fill, scale 0→1 on select" },
      { name: "Label", description: "Text style='body' via <label> wrapping" },
      { name: "Group container", description: "VStack or HStack based on direction prop" },
    ],
    props: [
      { name: "value", type: "string", default: "required", description: "Controlled selected value" },
      { name: "onValueChange", type: "(value: string) => void", default: "required", description: "Change handler" },
      { name: "options", type: "{ value: string; label: string; disabled?: boolean }[]", default: "required", description: "Array of radio options" },
      { name: "size", type: '"sm" | "md"', default: '"md"', description: "Circle size" },
      { name: "direction", type: '"horizontal" | "vertical"', default: '"vertical"', description: "Layout direction" },
    ],
    states: [
      { state: "Unselected", description: "Transparent circle, --separator-opaque border" },
      { state: "Selected", description: "--tint border, inner dot --tint fill" },
      { state: "Disabled", description: "Opacity 0.4" },
      { state: "Focus", description: "--focus-ring-* around entire label on :focus-visible" },
    ],
    doDont: [
      {
        do: "Always use RadioGroup — never render a standalone Radio (single radio has no UX meaning)",
        dont: "Export or render individual Radio items without a wrapping group context",
      },
      {
        do: "Let RadioGroup handle VStack/HStack internally",
        dont: "Add an extra layout wrapper outside RadioGroup when changing direction",
      },
    ],
    tokens: [
      { name: "--separator-opaque", section: "§2.2" },
      { name: "--tint", section: "§2.7" },
      { name: "--radius-full", section: "§5.1" },
    ],
  },

  {
    slug: "switch",
    name: "Switch",
    description:
      "Fixed-size toggle (51×31px track) built on Radix Switch, with a sliding white thumb driven by springs.snappy and fast-duration track color transition.",
    anatomy: [
      { name: "Track", description: "51×31px, --radius-full; background: --fill-secondary (off) / --tint (on)" },
      { name: "Thumb", description: "27px white circle (always white, not dark-mode-aware) + --shadow-xs" },
      { name: "Label", description: "Optional via <label> wrapping" },
    ],
    props: [
      { name: "checked", type: "boolean", default: "required", description: "Controlled on/off state" },
      { name: "onCheckedChange", type: "(checked: boolean) => void", default: "required", description: "Change handler" },
      { name: "disabled", type: "boolean", default: "false", description: "Opacity 0.4, non-interactive" },
      { name: "label", type: "string", default: "—", description: "Optional label text" },
    ],
    states: [
      { state: "Off", description: "--fill-secondary track, thumb at left" },
      { state: "On", description: "--tint track, thumb at right" },
      { state: "Disabled", description: "Opacity 0.4 in either state" },
      { state: "Focus", description: "--focus-ring-* around interactive area" },
    ],
    doDont: [
      {
        do: "Keep thumb white in both light and dark mode — intentional for contrast against both track states",
        dont: "Change thumb color in dark mode",
      },
      {
        do: "Use springs.snappy for thumb position (physical movement) and --duration-fast for track color",
        dont: "Apply spring animation to the track background-color change",
      },
    ],
    tokens: [
      { name: "--fill-secondary", section: "§2.2", description: "Off-state track" },
      { name: "--tint", section: "§2.7", description: "On-state track" },
      { name: "--shadow-xs", section: "§2.9", description: "Thumb shadow" },
    ],
  },

  {
    slug: "slider",
    name: "Slider",
    description:
      "Range input built on Radix Slider with a direct-manipulation-first motion model — no animation during drag, snap spring only on release. Supports single and multi-thumb (range) modes.",
    anatomy: [
      { name: "Track", description: "4px height, --fill-secondary background, --radius-full" },
      { name: "Range fill", description: "--tint background, filled from min to current value" },
      { name: "Thumb", description: "28px circle, --bg-primary fill + --shadow-sm shadow" },
    ],
    props: [
      { name: "value", type: "number | number[]", default: "required", description: "Controlled value(s) — number for single-thumb, number[] for multi-thumb range" },
      { name: "onValueChange", type: "(value: number | number[]) => void", default: "required", description: "Change handler" },
      { name: "min", type: "number", default: "0", description: "Minimum value" },
      { name: "max", type: "number", default: "100", description: "Maximum value" },
      { name: "step", type: "number", default: "1", description: "Step increment; snaps on release" },
      { name: "disabled", type: "boolean", default: "false", description: "Disables interaction" },
    ],
    states: [
      { state: "Default", description: "Static track + thumb" },
      { state: "Dragging", description: "Thumb follows pointer 1:1 with zero animation — direct manipulation exception" },
      { state: "Released", description: "Thumb snaps to nearest step via springs.snappy" },
      { state: "Click on track", description: "Thumb animates to clicked position via springs.smooth" },
    ],
    doDont: [
      {
        do: "Keep thumb tracking at 1:1 with no animation during active drag",
        dont: "Apply spring animation to thumb position while user is dragging — creates 'lag' feel",
      },
      {
        do: "Use springs.snappy for post-release snap to a discrete step",
        dont: "Use springs.smooth for step snap — it's too slow for a correction movement",
      },
    ],
    tokens: [
      { name: "--fill-secondary", section: "§2.2", description: "Track background" },
      { name: "--tint", section: "§2.7", description: "Range fill" },
      { name: "--bg-primary", section: "§2.2", description: "Thumb background" },
      { name: "--shadow-sm", section: "§2.9", description: "Thumb shadow" },
    ],
  },

  {
    slug: "segmented-control",
    name: "SegmentedControl",
    description:
      "Single-selection segment picker using Radix ToggleGroup with a Framer Motion shared-element pill (layoutId) that morphs between segments — not a tab navigator.",
    anatomy: [
      { name: "Track", description: "--fill-secondary background, 2px padding, --radius-md" },
      { name: "Segment buttons", description: 'Text style="footnote" weight="semibold"' },
      { name: "Pill", description: "motion.div with layoutId, --bg-primary fill + --shadow-xs; morphs smoothly between segments" },
    ],
    props: [
      { name: "value", type: "string", default: "required", description: "Controlled selected value" },
      { name: "onValueChange", type: "(value: string) => void", default: "required", description: "Change handler" },
      { name: "options", type: "{ value: string; label: string; icon?: IconName }[]", default: "required", description: "Segment definitions" },
      { name: "fullWidth", type: "boolean", default: "true", description: "Stretch to fill container; segments share space equally" },
    ],
    states: [
      { state: "Active segment", description: "Pill rendered behind it, --label-primary text" },
      { state: "Inactive segment", description: "No pill, --label-secondary text" },
      { state: "Transitioning", description: "Pill morphs via layoutId + springs.smooth" },
    ],
    doDont: [
      {
        do: "Use Radix ToggleGroup (single) — SegmentedControl selects a value, not navigates a route",
        dont: "Use Radix Tabs for SegmentedControl — Tabs implies route/panel navigation",
      },
      {
        do: "Use the layoutId morph pill so the active indicator slides smoothly",
        dont: "Use CSS background-color switching or remount the pill — causes an abrupt visual cut",
      },
    ],
    tokens: [
      { name: "--fill-secondary", section: "§2.2", description: "Track background" },
      { name: "--bg-primary", section: "§2.2", description: "Pill background" },
      { name: "--segmented-control-selected-bg", section: "§10.2" },
      { name: "--shadow-xs", section: "§2.9", description: "Pill shadow" },
    ],
  },

  {
    slug: "text-field",
    name: "TextField",
    description:
      "Single-line text input with optional leading/trailing icons, inline error state, and border-color transitions. The fixed-padding Group 1 form control.",
    anatomy: [
      { name: "Container", description: "1px solid --separator border, --radius-sm, fixed padding" },
      { name: "Leading icon", description: "Optional, decorative, size='sm'" },
      { name: "Input", description: "Native <input> element" },
      { name: "Trailing icon", description: "Optional; if interactive, requires aria-label + hit area" },
      { name: "Error message", description: 'Text style="footnote" color="destructive" below container' },
    ],
    props: [
      { name: "value", type: "string", default: "required", description: "Controlled input value" },
      { name: "onValueChange", type: "(value: string) => void", default: "required", description: "Change handler" },
      { name: "placeholder", type: "string", default: "—", description: "Placeholder text" },
      { name: "leadingIcon", type: "IconName", default: "—", description: "Decorative icon before input" },
      { name: "trailingIcon", type: "IconName", default: "—", description: "Icon after input (e.g. clear, show/hide password)" },
      { name: "error", type: "string", default: "—", description: "Error message; presence triggers error state" },
      { name: "disabled", type: "boolean", default: "false", description: "Opacity 0.4, non-interactive" },
      { name: "type", type: '"text" | "email" | "password" | "number" | "search"', default: '"text"', description: "Native input type" },
    ],
    states: [
      { state: "Default", description: "--separator border" },
      { state: "Focus", description: "--tint border + --focus-ring-*" },
      { state: "Error", description: "--color-destructive border + inline error message" },
      { state: "Disabled", description: "Opacity 0.4" },
    ],
    doDont: [
      {
        do: "Use the error prop to show validation — it sets both red border and inline message",
        dont: "Manage error state externally with custom red borders or injected text nodes",
      },
      {
        do: "Add aria-label to an interactive trailing icon (e.g. clear/show-password)",
        dont: "Use an interactive trailing icon without aria-label — invisible to screen readers (rule 6.3)",
      },
    ],
    tokens: [
      { name: "--separator", section: "§2.2", description: "Default border" },
      { name: "--tint", section: "§2.7", description: "Focus border" },
      { name: "--color-destructive", section: "§2.2", description: "Error border + message" },
      { name: "--padding-control-x/y", section: "§4.2", description: "Fixed padding (Group 1)" },
      { name: "--radius-sm", section: "§5.1" },
    ],
  },

  {
    slug: "textarea",
    name: "Textarea",
    description:
      "Standalone auto-resizing multi-line text input — separate from TextField — with character counter and threshold-based warning color.",
    anatomy: [
      { name: "textarea element", description: "resize: none, JS-driven height auto-grow" },
      { name: "Character counter", description: 'Bottom-right: "{length}/{maxLength}"' },
      { name: "Error message", description: "Reuses TextField error pattern" },
    ],
    props: [
      { name: "value", type: "string", default: "—", description: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", default: "—", description: "Value handler" },
      { name: "rows", type: "number", default: "3", description: "Initial visible line count" },
      { name: "autoResize", type: "boolean", default: "true", description: "JS auto-height on input" },
      { name: "maxRows", type: "number", default: "10", description: "Height cap; scrolls internally beyond" },
      { name: "maxLength", type: "number", default: "—", description: "Hard character limit" },
      { name: "showCounter", type: "boolean", default: "true", description: "Show counter when maxLength is set" },
      { name: "counterThreshold", type: "number", default: "0.9", description: "Fraction of maxLength to trigger warning color" },
      { name: "error", type: "string", default: "—", description: "Inline error message" },
    ],
    states: [
      { state: "Default", description: "Initial rows height" },
      { state: "Expanded", description: "Auto-grows up to maxRows, then scrolls internally" },
      { state: "Counter normal", description: "--label-secondary color" },
      { state: "Counter warning", description: "--color-destructive at counterThreshold" },
      { state: "Error", description: "--color-destructive border + error message" },
    ],
    doDont: [
      {
        do: "Set both maxLength and showCounter={true} for user-facing text inputs with limits",
        dont: "Use spring transitions for height changes — use CSS transition: height --duration-fast",
      },
      {
        do: "Let autoResize handle height — never give Textarea a fixed height alongside autoResize={true}",
        dont: "Override height manually when autoResize is active",
      },
    ],
    tokens: [
      { name: "--label-secondary", section: "§2.2", description: "Counter normal color" },
      { name: "--color-destructive", section: "§2.2", description: "Counter warning + error" },
      { name: "--padding-control-x/y", section: "§4.2", description: "Inherited from TextField pattern" },
      { name: "--duration-fast", section: "§6.2", description: "Height transition" },
    ],
  },

  {
    slug: "search-field",
    name: "SearchField",
    description:
      "Search input built on TextField with pill shape, Cancel button, optional debounced callback, and an opt-in built-in results combobox popover with content-swap animation.",
    anatomy: [
      { name: "TextField base", description: "Pill border-radius, fixed leading search icon" },
      { name: "Clear (×) button", description: "Visible when value is non-empty" },
      { name: "Cancel button", description: "External, slides in on focus" },
      { name: "Results popover", description: "Optional; spinner / empty / item list via ListItemContent" },
    ],
    props: [
      { name: "value", type: "string", default: "—", description: "Controlled value" },
      { name: "onValueChange", type: "(value: string) => void", default: "—", description: "Value change handler" },
      { name: "onSearch", type: "(value: string) => void", default: "—", description: "Debounced search callback" },
      { name: "onCancel", type: "() => void", default: "—", description: "Called after field clear+blur" },
      { name: "results", type: "{ id, label, icon? }[] | undefined", default: "undefined", description: "undefined = no popover; [] = empty state" },
      { name: "loading", type: "boolean", default: "—", description: "Shows spinner in popover" },
      { name: "debounceMs", type: "number", default: "300", description: "Debounce delay" },
    ],
    states: [
      { state: "Idle", description: "Not focused, no popover" },
      { state: "Focused, no results prop", description: "No popover" },
      { state: "Loading", description: "Popover with Progress spinner" },
      { state: "Empty", description: "Popover with emptyMessage" },
      { state: "Results", description: "Popover list via ListItemContent" },
    ],
    doDont: [
      {
        do: "Pass results={[]} (empty array) to show the 'no results' state",
        dont: "Expect results={undefined} to show empty state — undefined means 'no popover at all'",
      },
      {
        do: "Expect onResultSelect to auto-fill the field — component is fully controlled; dev decides what happens after selection",
        dont: "Assume clearing the field happens automatically on result select",
      },
    ],
    tokens: [
      { name: "--radius-full", section: "§5.1", description: "Pill shape" },
      { name: "--z-dropdown", section: "§6.9", description: "Results popover z-index" },
    ],
  },

  // -------------------------------------------------------------------------
  // DISPLAY
  // -------------------------------------------------------------------------
  {
    slug: "text",
    name: "Text",
    description:
      "Typography primitive mapping the 11-style Dynamic Type scale with density and color control. Decouples visual style (textStyle prop) from HTML semantic element (as prop).",
    anatomy: [
      { name: "Root element", description: "Rendered HTML tag — defaults per style (h1, h2, h3, h4, p, span)" },
      { name: "Type scale", description: "Font size, leading, letter-spacing from CSS custom properties" },
    ],
    props: [
      { name: "textStyle", type: '"large-title" | "title-1" | "title-2" | "title-3" | "headline" | "body" | "callout" | "subheadline" | "footnote" | "caption-1" | "caption-2"', default: '"body"', description: "Maps to a full type scale entry" },
      { name: "as", type: "HTML element tag", default: "per-style default", description: "Override semantic element independently of visual style" },
      { name: "weight", type: '"regular" | "medium" | "semibold" | "bold"', default: "style's default", description: "Override font weight" },
      { name: "color", type: '"primary" | "secondary" | "tertiary" | "quaternary" | SemanticColorToken', default: '"primary"', description: "Semantic label color; no raw hex" },
      { name: "density", type: '"tight" | "default" | "loose"', default: '"default"', description: "Per-instance line-spacing override" },
      { name: "truncate", type: "boolean | number", default: "—", description: "true = single-line ellipsis; number = multi-line clamp" },
    ],
    states: [
      { state: "Default", description: "Reads CSS vars set by ContourProvider based on sizeMode" },
      { state: "sizeMode change", description: "ContourProvider recalculates all --text-* vars; component reads passively" },
    ],
    doDont: [
      {
        do: "Override as when the visual heading level doesn't match document heading order",
        dont: 'Assume the default as is always semantically correct — verify heading hierarchy',
      },
      {
        do: "Use color='secondary'/'tertiary' for supporting text",
        dont: "Pass raw hex or base color tokens to color — only semantic label tokens",
      },
    ],
    tokens: [
      { name: "--text-{style}-size/-leading/-letter-spacing", section: "§3.3", description: "Dynamic Type v2 lookup per style per sizeMode" },
      { name: "--weight-regular/medium/semibold/bold", section: "§3.3" },
      { name: "--label-primary/secondary/tertiary/quaternary", section: "§2.2" },
    ],
  },

  {
    slug: "icon",
    name: "Icon",
    description:
      "Abstraction layer over lucide-react — all components consume icons through this component. Never import directly from lucide-react.",
    anatomy: [
      { name: "SVG element", description: "From lucide-react icon registry" },
      { name: "Size token", description: "--icon-size-{xs/sm/md/lg/xl}" },
      { name: "Stroke width", description: "2px default, 2.5px at prefers-contrast: more" },
    ],
    props: [
      { name: "name", type: "IconName", default: "required", description: "Union type from icon-registry.ts" },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "12/16/20/24/32px" },
      { name: "color", type: '"currentColor" | SemanticColorToken', default: '"currentColor"', description: "Inherits text color by default" },
      { name: "decorative", type: "boolean", default: "true", description: "true → aria-hidden; false → aria-label required" },
    ],
    states: [
      { state: "decorative={true}", description: "aria-hidden='true' — invisible to assistive tech" },
      { state: "decorative={false}", description: "Announced via aria-label" },
      { state: "prefers-contrast: more", description: "Stroke width auto-increases to 2.5" },
    ],
    doDont: [
      {
        do: "Choose icon size by matching the Text Style it sits next to",
        dont: 'Import directly from "lucide-react" in other components — always go through <Icon>',
      },
      {
        do: "Use decorative={false} + aria-label for icon-only buttons",
        dont: "Use color with a hex value — only semantic color tokens are accepted",
      },
    ],
    tokens: [
      { name: "--icon-size-xs/sm/md/lg/xl", section: "§0.1" },
      { name: "--icon-stroke-width", section: "§0.2" },
    ],
  },

  {
    slug: "card",
    name: "Card",
    description:
      "Content grouping wrapper with configurable elevation and responsive inset padding. Does not arrange children — compose Stack/Flex inside as needed.",
    anatomy: [
      { name: "Root element", description: "div / article / section via as prop" },
      { name: "Background fill + border or shadow", description: "Elevation-dependent" },
    ],
    props: [
      { name: "elevation", type: '"flat" | "raised"', default: '"flat"', description: "flat = background + border; raised = adds --shadow-sm" },
      { name: "padding", type: 'SpaceToken | "default"', default: '"default"', description: '"default" = responsive --inset-grouped-margin-x' },
      { name: "corner", type: '"standard" | "squircle"', default: '"standard"', description: "Border-radius style" },
      { name: "as", type: '"div" | "article" | "section"', default: '"div"', description: "Semantic element" },
    ],
    states: [
      { state: "elevation='flat'", description: "--bg-grouped-secondary + 1px solid --separator border" },
      { state: "elevation='raised'", description: "Adds --shadow-sm — for Cards over complex backgrounds" },
    ],
    doDont: [
      {
        do: "Use elevation='flat' (default) for most cards — prefer depth through color/border before shadows",
        dont: "Use elevation='raised' by default everywhere — shadows appear only when truly needed",
      },
      {
        do: "Use padding='default' for general content cards — it's responsive and consistent",
        dont: "Add gap/justify/align props to Card — it has a single responsibility: wrapping",
      },
    ],
    tokens: [
      { name: "--bg-grouped-secondary", section: "§2.2" },
      { name: "--separator", section: "§2.2" },
      { name: "--shadow-sm", section: "§2.9" },
      { name: "--inset-grouped-margin-x", section: "§4.2c", description: "Responsive padding" },
    ],
  },

  {
    slug: "list",
    name: "List",
    description:
      "Full-featured list container with plain and grouped styles, swipe actions (touch), hover-reveal actions (desktop), and animated add/remove using Framer Motion.",
    anatomy: [
      { name: "List", description: "plain = full-width; grouped = rounded + responsive margin" },
      { name: "ListItem — Leading zone", description: "Icon slot" },
      { name: "ListItem — Main zone", description: "Title + subtitle (never moves)" },
      { name: "ListItem — Trailing zone", description: "Icon or text" },
      { name: "Swipe actions", description: "Revealed on swipe (touch) or hover/focus-within (desktop)" },
      { name: "ListItemContent", description: "Shared presentational sub-component reused by Dropdown" },
    ],
    props: [
      { name: "style (List)", type: '"plain" | "grouped"', default: '"plain"', description: "Visual style" },
      { name: "title (ListItem)", type: "string", default: "required", description: "Primary label" },
      { name: "subtitle (ListItem)", type: "string", default: "—", description: "Secondary label" },
      { name: "leadingIcon (ListItem)", type: "IconName", default: "—", description: "Leading zone icon" },
      { name: "trailingIcon (ListItem)", type: "IconName", default: "—", description: "Trailing zone icon" },
      { name: "onClick (ListItem)", type: "() => void", default: "—", description: "Makes the whole row interactive" },
      { name: "leadingAction", type: "SwipeAction", default: "—", description: "Single swipe action on leading edge" },
      { name: "trailingActions", type: "SwipeAction[]", default: "—", description: "Up to 3 trailing; 4+ collapse into 'More' dropdown" },
      { name: "contextMenuItems", type: "DropdownItemDef[]", default: "—", description: "Long-press / right-click context menu" },
    ],
    states: [
      { state: "Default", description: "Static row" },
      { state: "Hover (pointer: fine)", description: "Trailing actions cross-fade in" },
      { state: "Pressed", description: "--fill-quaternary background; no scale on full-width row" },
      { state: "Swipe (touch)", description: "Actions reveal at --swipe-action-width threshold" },
      { state: "Add animation", description: "opacity + scale + blur + height via springs.smooth" },
      { state: "Remove animation", description: "Same properties exit to 0; siblings re-flow" },
    ],
    doDont: [
      {
        do: "Guard hover CSS in @media (hover: hover) and (pointer: fine) to prevent sticky hover on mobile Safari",
        dont: 'Use bare :hover for action reveal — causes double-tap issues on touch devices',
      },
      {
        do: "Place destructive action last in trailingActions array — full-swipe commit triggers the last item",
        dont: "Put a destructive action first where users might accidentally full-swipe it",
      },
    ],
    tokens: [
      { name: "--padding-row-x / --padding-row-y", section: "§4.2", description: "Group 1 fixed padding" },
      { name: "--inset-grouped-margin-x / --inset-grouped-gap", section: "§4.2c/d", description: "Grouped style responsive spacing" },
      { name: "--swipe-action-width", section: "§4.7" },
      { name: "--fill-quaternary", section: "§2.2", description: "Pressed state" },
    ],
  },

  {
    slug: "badge",
    name: "Badge",
    description:
      "Non-interactive indicator with counter (notification number/dot) and status (text label with semantic color) variants. tone='solid' is the default for guaranteed contrast on any background.",
    anatomy: [
      { name: "Badge root", description: "Pill or circle shape — no self-positioning" },
      { name: "Count text or dot", description: "counter variant" },
      { name: "Label text", description: "status variant" },
    ],
    props: [
      { name: "variant", type: '"counter" | "status"', default: '"counter"', description: "Discriminated union" },
      { name: "count", type: "number", default: "—", description: "(counter) Displayed number; >99 shows '99+'" },
      { name: "dot", type: "boolean", default: "false", description: "(counter) Show dot only, no number" },
      { name: "label", type: "string", default: "—", description: "(status) Required label text" },
      { name: "color", type: '"tint" | "destructive" | "success" | "warning"', default: '"tint"', description: "(status) Semantic color" },
      { name: "tone", type: '"solid" | "tinted"', default: '"solid"', description: "solid = safe on any bg; tinted = alpha bg, only safe on controlled backgrounds" },
    ],
    states: [
      { state: "counter, count > 0", description: "Renders pill/circle with number" },
      { state: "counter, dot", description: "Renders 8px circle" },
      { state: "status, solid", description: "Opaque background, white text — always safe" },
      { state: "status, tinted", description: "Alpha background — safe only on bg-primary/secondary" },
    ],
    doDont: [
      {
        do: "Default to tone='solid' for Badge on Cards, images, or unknown backgrounds",
        dont: "Use tone='tinted' on gradient/image/custom-color backgrounds — unresolved contrast risk",
      },
      {
        do: "Wrap Badge in <div className='relative inline-block'> and use absolute positioning to place over icons",
        dont: "Expect Badge to position itself — it has no internal position: absolute logic",
      },
    ],
    tokens: [
      { name: "--color-destructive", section: "§2.2", description: "Counter background" },
      { name: "--tint / --color-success / --color-warning", section: "§2.2" },
      { name: "--radius-full", section: "§5.1" },
    ],
  },

  {
    slug: "avatar",
    name: "Avatar",
    description:
      "Flat-API image display with 3-tier fallback (image → initials → generic icon), deterministic color assignment from name hash, and optional squircle shape.",
    anatomy: [
      { name: "Image layer", description: "Radix Avatar.Image, hidden on load error" },
      { name: "Fallback layer", description: "Initials text or generic icon — shown after 600ms delay" },
    ],
    props: [
      { name: "src", type: "string", default: "—", description: "Image URL" },
      { name: "alt", type: "string", default: "—", description: "Required when src is provided" },
      { name: "name", type: "string", default: "—", description: "Generates initials + deterministic background color" },
      { name: "icon", type: "IconName", default: '"user"', description: "Final fallback if no src or name" },
      { name: "size", type: '"xs" | "sm" | "md" | "lg" | "xl"', default: '"md"', description: "24/32/40/56/80px" },
      { name: "shape", type: '"circle" | "squircle"', default: '"circle"', description: "Border-radius style" },
    ],
    states: [
      { state: "Image loaded", description: "Shows <img>" },
      { state: "Loading / error", description: "Shows fallback after 600ms delay to prevent flash" },
      { state: "Initials fallback", description: "Deterministic color bg (hash of name) + white text" },
      { state: "Icon fallback", description: "Generic silhouette on --fill-tertiary bg" },
    ],
    doDont: [
      {
        do: "Use name prop always — ensures a meaningful fallback with consistent color",
        dont: "Add onClick to Avatar directly — wrap in <button> and apply touch target rules to the wrapper",
      },
      {
        do: "Use getAvatarProgressRing helper to compose a Progress ring overlay",
        dont: "Add showProgress, verified, or statusDot props to Avatar — compose those externally",
      },
    ],
    tokens: [
      { name: "--color-{red/orange/...}", section: "§2.1", description: "12 accent colors for initials bg" },
      { name: "--radius-full", section: "§5.1", description: "Circle shape" },
    ],
  },

  {
    slug: "progress",
    name: "Progress",
    description:
      "Circular and linear progress indicators. Circular supports both indeterminate (spinner) and determinate modes. Linear is always determinate — no linear indeterminate mode.",
    anatomy: [
      { name: "SVG circles", description: "Track + fill arc — circular variant" },
      { name: "Track + fill divs", description: "Linear variant" },
    ],
    props: [
      { name: "variant", type: '"circular" | "linear"', default: '"circular"', description: "Discriminated union" },
      { name: "value", type: "number (0-100)", default: "undefined", description: "undefined = indeterminate (circular only); required for linear" },
      { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "(circular) 16/24/32px" },
      { name: "diameter", type: "number", default: "—", description: "Escape hatch for custom diameter (e.g. ring around Avatar)" },
      { name: "color", type: '"tint" | "destructive" | "success" | "warning"', default: '"tint"', description: "Fill color" },
      { name: "label", type: "string", default: "—", description: "aria-label; required if no adjacent visible text" },
    ],
    states: [
      { state: "Circular indeterminate", description: "270° arc rotating 360° continuously (0.8s linear infinite)" },
      { state: "Circular determinate", description: "Static arc, length = value%, animated on value change" },
      { state: "Linear determinate", description: "Width = value%, smooth transition on change" },
      { state: "prefers-reduced-motion", description: "Rotation replaced with opacity pulse — animation doesn't stop fully (it's the only 'loading' signal)" },
    ],
    doDont: [
      {
        do: "Use variant='circular' (no value) for unknown-duration loading states",
        dont: "Expect a linear indeterminate mode — it doesn't exist",
      },
      {
        do: "Use springs for value transitions — no, use CSS transition for linear bar (no spring overshoot at 100%)",
        dont: "Use spring transitions for determinate progress — it would visually overshoot 100%",
      },
    ],
    tokens: [
      { name: "--fill-secondary", section: "§2.2", description: "Linear track" },
      { name: "--tint / --color-*", section: "§2.2", description: "Fill color" },
      { name: "--duration-normal", section: "§6.2", description: "Determinate value transition" },
    ],
  },

  // -------------------------------------------------------------------------
  // FEEDBACK
  // -------------------------------------------------------------------------
  {
    slug: "alert",
    name: "Alert",
    description:
      "Mandatory-decision dialog built on Radix AlertDialog that blocks all other interaction until the user explicitly selects an action. Escape key does NOT close Alert.",
    anatomy: [
      { name: "Backdrop", description: "--overlay-default with blur" },
      { name: "Alert container", description: "min(320px, 100% − 2×space-4), --material-thick + blur(20px)" },
      { name: "Title", description: 'Text style="headline" centered' },
      { name: "Description", description: 'Text style="footnote" color="secondary" centered' },
      { name: "Action buttons", description: "2 → horizontal 50/50; 1 or ≥3 → vertical full-width with separators" },
    ],
    props: [
      { name: "open", type: "boolean", default: "—", description: "Controlled open state" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", description: "State change handler" },
      { name: "title", type: "string", default: "—", description: "Required dialog title" },
      { name: "description", type: "string", default: "—", description: "Optional explanatory text" },
      { name: "actions", type: "AlertAction[]", default: "—", description: "1–3 action buttons" },
      { name: "AlertAction.role", type: '"default" | "destructive" | "cancel"', default: '"default"', description: "Visual + semantic role" },
      { name: "AlertAction.emphasized", type: "boolean", default: "false", description: "Bold text = preferred action" },
    ],
    states: [
      { state: "Closed", description: "Not rendered" },
      { state: "Open", description: "Scale bounce-in from 1.1→1, springs.bouncy" },
      { state: "Escape key", description: "Does NOT close Alert — by design" },
      { state: "Focus starts on", description: "Cancel/safe action (never destructive)" },
    ],
    doDont: [
      {
        do: "Use Alert when the user must make an irreversible decision (delete, disconnect, confirm)",
        dont: "Use Alert for showing forms or content — use Sheet for that",
      },
      {
        do: "Set emphasized={true} on the safest/preferred action to guide the user",
        dont: "Use Button component inside Alert actions — Alert actions have their own distinct styling",
      },
    ],
    tokens: [
      { name: "--overlay-default", section: "§2.2e" },
      { name: "--material-thick", section: "§2.3" },
      { name: "--z-alert", section: "§6.9", description: "390 — below Toast (400), above Sheet" },
      { name: "--radius-lg", section: "§5.1" },
    ],
  },

  {
    slug: "toast",
    name: "Toast",
    description:
      "Transient notification displayed via a global provider system. Stacks and collapses/expands based on input modality, and anchors to any of six screen positions. Always use the toast() function or the useToast() hook, never render Toast JSX directly.",
    anatomy: [
      { name: "Toaster viewport", description: "One per app, mounted at the root; anchored by the position prop (adaptive by default: top-center on compact, bottom-right on regular+)" },
      { name: "Icon", description: "Auto-assigned by variant" },
      { name: "Title + Description", description: "Required / optional text" },
      { name: "Action button", description: "Max 1 optional action" },
      { name: "Stack layer", description: "Collapsed peek (up to 3 visible), expanded on hover/tap" },
      { name: "Action row", description: "Show Less + Clear, visible whenever the list is open. Sits at the anchored edge outside the scroll box, so it never scrolls away or dims under the scroll mask, and its room is reserved with animated padding so the stack never jumps" },
      { name: "Clear button", description: "Dismisses every toast. One click with a mouse (labelled by a tooltip); on touch the first tap widens it into the word \"Clear\" and the second one clears" },
    ],
    props: [
      { name: "title", type: "string", default: "required", description: "Notification title" },
      { name: "description", type: "string", default: "—", description: "Optional subtitle" },
      { name: "variant", type: '"default" | "success" | "warning" | "destructive"', default: '"default"', description: "Controls icon + color; warning/destructive announce assertively" },
      { name: "action", type: "{ label: string; onPress: () => void }", default: "—", description: "Single optional action" },
      { name: "duration", type: "number (ms)", default: "4000", description: "Auto-dismiss delay; undefined = persistent" },
      { name: "position", type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" | { compact?, regular? }', default: '{ compact: "top-center", regular: "bottom-right" }', description: "<Toaster> prop. Drives stacking direction, expand direction, enter animation and swipe axis" },
      { name: "expandedMaxHeight", type: "number (px)", default: "full page height", description: "<Toaster> prop. Height the expanded list may reach before it scrolls internally, with a faded scroll edge" },
      { name: "showLessLabel", type: "string", default: '"Show Less"', description: "<Toaster> prop. Label of the button that collapses an open list" },
      { name: "clearLabel", type: "string", default: '"Clear"', description: "<Toaster> prop. Label of the button that dismisses every toast at once — tooltip with a mouse, in-button text on touch" },
    ],
    states: [
      { state: "Collapsed stack", description: "Layered peek (scale -0.05, 8px per layer, offset away from the anchored edge)" },
      { state: "Hover preview", description: "Fine pointer only — hovering the stack expands the list (Show Less included), and it re-collapses ~300ms after the pointer leaves" },
      { state: "Pinned list", description: "Click or tap the stack to keep the list open; it stays until Show Less is pressed, mouse or not" },
      { state: "Armed clear", description: "Touch only — the first tap on the clear button expands it and cross-fades the X into its label; a tap elsewhere reverts it" },
      { state: "Scrolling list", description: "A pinned list taller than expandedMaxHeight scrolls, anchored so the newest toast stays in view, with the clipped edge faded by scroll-mask-y" },
      { state: "Enter", description: "Slide+fade along the vertical axis — down from above for top anchors, up from below for bottom anchors; never sideways" },
      { state: "Exit", description: "Auto (duration elapsed) or swipe-dismiss toward the anchored edge" },
    ],
    doDont: [
      {
        do: "Use variant='warning' or 'destructive' for urgent messages — they are announced assertively to screen readers",
        dont: "Place <Toast> JSX directly in component trees — always use the toast() function through a single root-level <Toaster>",
      },
      {
        do: "Pick a position that matches the surface: bottom-anchored stacks expand upward, top-anchored ones downward",
        dont: "Mount more than one <Toaster> — every one of them renders the same global stack",
      },
    ],
    tokens: [
      { name: "--color-success / --color-warning / --color-destructive", section: "§2.2" },
      { name: "--z-toast", section: "§6.9", description: "400 — highest in the z-index stack" },
      { name: "--duration-normal", section: "§6.2", description: "Enter/exit" },
    ],
  },

  // -------------------------------------------------------------------------
  // OVERLAY
  // -------------------------------------------------------------------------
  {
    slug: "sheet",
    name: "Sheet",
    description:
      "Adaptive overlay — Bottom Sheet on touch, Centered Modal with a mouse/trackpad (input modality, not size-class). Built on Radix Dialog + Framer Motion drag with snap points, nested stacking, and conditional dismiss.",
    anatomy: [
      { name: "Sheet root", description: "Manages open state" },
      { name: "SheetContent", description: "Main surface with safe-area padding" },
      { name: "SheetHeader", description: "Title area" },
      { name: "Grabber bar", description: "58×4px, touch only" },
      { name: "Backdrop overlay", description: "Per nesting depth" },
    ],
    props: [
      { name: "open", type: "boolean", default: "—", description: "Controlled open state" },
      { name: "onOpenChange", type: "(open: boolean) => void", default: "—", description: "State change handler" },
      { name: "snapPoints", type: "number[]", default: "[1]", description: "Snap positions (§6.8 token)" },
      { name: "title", type: "string", default: "—", description: "Optional header title" },
      { name: "dismissible", type: "boolean | (() => boolean | Promise<boolean>)", default: "true", description: "Static or dynamic dismiss gate" },
    ],
    states: [
      { state: "Closed", description: "Not rendered" },
      { state: "Open (touch)", description: "Bottom Sheet, drag-enabled -- pointer: coarse, at every size-class" },
      { state: "Open (mouse/trackpad)", description: "Centered Modal, no drag, dismiss via Close/Escape/click-outside" },
      { state: "Blocked dismiss", description: "Bounce-back via springs.bouncy; shake animation on button press" },
      { state: "Receded", description: "Sheet below active nested Sheet: scale 0.94, y -16px" },
    ],
    doDont: [
      {
        do: "Use Sheet for content/forms where the user needs to fill in data before continuing",
        dont: "Use Sheet when you need a forced decision — use Alert instead",
      },
      {
        do: "Let Sheet handle motion-only feedback on blocked dismiss; show a toast to explain why",
        dont: "Nest 3+ Sheets — console warning is emitted at ≥3 depth",
      },
    ],
    tokens: [
      { name: "--sheet-radius-top / --sheet-radius-bottom", section: "§4.8", description: "34px/58px on compact" },
      { name: "--grabber-width / --grabber-height", section: "§4.8" },
      { name: "--z-sheet", section: "§6.9", description: "310 + depth×20" },
    ],
  },

  {
    slug: "dropdown",
    name: "Dropdown",
    description:
      "Floating action menu built on Radix DropdownMenu with action, checkbox, radio-group, submenu, separator, and label item types. Shares ListItemContent with List for consistent row anatomy.",
    anatomy: [
      { name: "Trigger", description: "Any element via Radix asChild pattern" },
      { name: "Content container", description: "--popover-radius (38px), 6px padding" },
      { name: "Items", description: "ListItemContent-based rows with --menu-item-padding-*" },
      { name: "Section title", description: "--menu-section-title-size (13px compact / 12px regular+)" },
      { name: "Submenu", description: "Flyout cascade (regular+) or stack push/pop (compact)" },
    ],
    props: [
      { name: "trigger", type: "ReactElement", default: "required", description: "Trigger element (asChild)" },
      { name: "items", type: "DropdownItemDef[]", default: "required", description: "Array of item definitions" },
      { name: "side", type: '"top" | "bottom" | "left" | "right"', default: '"bottom"', description: "Preferred opening direction" },
      { name: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment relative to trigger" },
    ],
    states: [
      { state: "Closed", description: "Not rendered" },
      { state: "Open", description: "Scale 0.95→1 + fade via springs.snappy" },
      { state: "Item hover/focus", description: "Highlighted background (Radix handles)" },
      { state: "Submenu compact", description: "Stack push/pop — full content swap with Back button" },
      { state: "Submenu regular+", description: "Flyout cascade — both parent and sub visible" },
    ],
    doDont: [
      {
        do: "Use type: 'checkbox' / 'radio-group' items for multi-select — menu stays open",
        dont: "Use type: 'action' for multi-select flows — it closes after each selection",
      },
      {
        do: "Keep Tooltip and Dropdown as separate components — they use different Radix primitives",
        dont: "Share the same Radix primitive for Tooltip and Dropdown",
      },
    ],
    tokens: [
      { name: "--popover-radius", section: "§4.8" },
      { name: "--menu-item-padding-sides/y", section: "§4.9" },
      { name: "--z-dropdown", section: "§6.9" },
    ],
  },

  {
    slug: "context-menu",
    name: "ContextMenu",
    description:
      "Contextual action menu triggered by right-click (pointer) or long-press (touch). Reuses all render/item/submenu logic from Dropdown with only the trigger mechanism differing.",
    anatomy: [
      { name: "Trigger wrapper", description: "asChild — wraps any element" },
      { name: "Menu container", description: "Positioned at cursor/tap coordinates, not element bounds" },
      { name: "Menu items", description: "Reuses DropdownItemDef[] / ListItemContent" },
    ],
    props: [
      { name: "items", type: "DropdownItemDef[]", default: "required", description: "Reuses Dropdown item type" },
      { name: "children", type: "React.ReactElement", default: "required", description: "asChild trigger element" },
      { name: "disabled", type: "boolean", default: "—", description: "Disables context menu" },
    ],
    states: [
      { state: "Long-press in progress (touch)", description: "Row scale 0.97 + dim bg (springs.snappy)" },
      { state: "Open", description: "Menu at cursor/touch position" },
    ],
    doDont: [
      {
        do: "Use contextMenuItems prop on ListItem for per-row actions — disambiguates from swipe-reveal automatically",
        dont: "Apply ContextMenu to components with complex gesture systems without gesture conflict analysis",
      },
    ],
    tokens: [
      { name: "--z-dropdown", section: "§6.9", description: "Shared with Dropdown" },
    ],
  },

  {
    slug: "route-transition",
    name: "RouteTransition",
    description:
      "Core navigation animation wrapper (in app/template.tsx, or invoked directly inside a layout.tsx with persistent chrome) driving a light cross-fade between page content via Framer Motion AnimatePresence, with optional Activity state caching.",
    anatomy: [
      { name: "motion.div wrapper", description: "Keyed by pathname" },
      { name: "AnimatePresence mode='wait'", description: "Outgoing page exits before the incoming one enters" },
      { name: "<Activity> subtrees", description: "Optional caching for route state preservation" },
    ],
    props: [
      { name: "children", type: "React.ReactNode", default: "required", description: "Current route's page content" },
      { name: "cacheDepth", type: "number", default: "1", description: "LRU route cache depth (hard cap: 10)" },
    ],
    states: [
      { state: "Default", description: "Cross-fade only, no slide or blur (--duration-fast)" },
      { state: "prefers-reduced-motion", description: "Same cross-fade, shorter (--duration-instant)" },
    ],
    doDont: [
      {
        do: "For a simple app with no persistent chrome, place RouteTransition in app/template.tsx",
        dont: "Use cacheDepth > 10 — hard-capped internally to prevent memory leaks",
      },
      {
        do: "For a layout with persistent chrome (sidebar, nav bar) that must not re-animate, call RouteTransition directly inside that layout.tsx, wrapping only the page content — a nested template.tsx there would remount on every navigation (Next's own per-segment key) and lose AnimatePresence's coordinated exit/enter along with it",
        dont: "Let RouteTransition's children include layout chrome — anything inside its motion.div remounts and re-animates on every navigation, including elements that should stay static",
      },
      {
        do: "Make all data-fetching effects idempotent when using cacheDepth > 0",
        dont: "Use View Transitions API as the default — it is opt-in only for specific shared-element cross-route cases",
      },
    ],
    tokens: [
      { name: "--duration-fast", section: "§6.2", description: "Default cross-fade" },
      { name: "--duration-instant", section: "§6.2", description: "Reduced-motion cross-fade" },
    ],
  },

  {
    slug: "split-view",
    name: "SplitView",
    description:
      "Top-level layout for multi-column adaptive interfaces (sidebar + list + detail). URL-driven column count, floating overlay sidebar with drag-resize, and RouteTransition as navigation engine.",
    anatomy: [
      { name: "Sidebar slot", description: "position: fixed, --sidebar-current-width CSS var" },
      { name: "Content area", description: "padding-left: --sidebar-current-width" },
      { name: "Drag-resize border", description: "~8px hit area, cursor: col-resize, pointer: fine only" },
      { name: "RouteTransition layer", description: "Navigation within content area" },
    ],
    props: [
      { name: "sidebar", type: "React.ReactNode", default: "—", description: "Sidebar content (typically <Sidebar>)" },
      { name: "children", type: "React.ReactNode", default: "—", description: "Route content" },
      { name: "minSidebarWidth", type: "number", default: "240", description: "Minimum drag width (px)" },
      { name: "maxSidebarWidth", type: "number", default: "400", description: "Maximum drag width (px)" },
      { name: "collapsible", type: "boolean", default: "true", description: "Icon-only collapse — declared but not implemented in v1" },
    ],
    states: [
      { state: "compact", description: "Single-view push/pop via RouteTransition" },
      { state: "regular+", description: "Floating sidebar visible, content padded" },
      { state: "Sidebar drag (pointer: fine)", description: "Direct manipulation, snaps at min/max via springs.snappy" },
      { state: "Width persisted", description: "localStorage key: 'contour-splitview-sidebar-width'" },
    ],
    doDont: [
      {
        do: "Use <Sidebar> component as the sidebar prop — it is the canonical content definition",
        dont: "Expect touch users to resize the sidebar — drag-resize is pointer: fine only",
      },
      {
        do: "Let SplitView own width/resize logic — Sidebar knows nothing about its own width",
        dont: "Use CSS Grid/Flex to place Sidebar as a physical column — it is position: fixed overlay",
      },
    ],
    tokens: [
      { name: "--sidebar-current-width", description: "Dynamic CSS var set from JS state" },
      { name: "--z-sidebar", section: "§6.9" },
    ],
  },
];

/** Look up a spec by slug. Returns undefined if not found. */
export function getComponentSpec(slug: string): ComponentSpec | undefined {
  return COMPONENT_SPECS.find((s) => s.slug === slug);
}
