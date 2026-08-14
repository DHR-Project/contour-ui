// GENERATED FILE -- do not edit by hand.
// Produced by scripts/build-docs-content-index.mjs from the prose docs pages
// (app/docs/**/page.tsx). Re-run `pnpm docs:index` after editing any of
// their content so this file stays in sync.

export interface DocsContentEntry {
  /** Page path, with a "#<section-id>" anchor when the text came from a
   * specific DocsSection/DocsSubsection rather than the page as a whole. */
  href: string;
  /** Docs page this entry belongs to, e.g. "Guidelines". */
  pageTitle: string;
  /** Nearest enclosing section/subsection title, if any. */
  heading?: string;
  /** Flattened, whitespace-collapsed text content of that section. */
  text: string;
}

export const DOCS_CONTENT_INDEX: DocsContentEntry[] = [
  {
    "href": "/docs",
    "pageTitle": "Overview",
    "text": "layout-grid compass sliders-horizontal image message-circle layers %s — Contour Docs Contour Docs Contour component library documentation — design guidelines, tokens, and component reference. Continuity No abrupt corners — in geometry or motion. Every transition should feel like a physical object moving continuously, never snapping between states. Spring physics (Framer Motion) instead of static easings. Depth through material Spatial hierarchy via frosted glass and semantic background layers — not heavy shadows. Elevated surfaces use denser material, not darker shadows. Content-first restraint Components never shout louder than their content. Tint is reserved for meaningful actions and states; everything else uses neutral label and fill tokens. Predictable adaptivity Layout changes across size-classes follow one consistent system-wide logic — compact defaults, regular+ expansions. Components evolve naturally, they don't become different things. Guidelines Design principles, token usage, responsive behavior, interaction, accessibility, and iconography rules. Tokens All CSS custom properties: colors, typography, spacing, radius, motion, and z-index. Components complete spec-only deferred Contour A component library built on native-feeling design principles — adaptive, accessible, and composable. Tailwind v4 + Next.js App Router + TypeScript, with a design token system grounded in real CSS custom properties. Component status summary components with live code spec-only deferred"
  },
  {
    "href": "/docs#start-here",
    "pageTitle": "Overview",
    "heading": "Start here",
    "text": "Main documentation sections"
  },
  {
    "href": "/docs#components-overview",
    "pageTitle": "Overview",
    "heading": "Components",
    "text": "component s spec-only Spec deferred Deferred"
  },
  {
    "href": "/docs/guidelines",
    "pageTitle": "Guidelines",
    "text": "Guidelines Contour design guidelines — design principles, token usage, responsive behavior, interaction, accessibility, and iconography rules. Design Guidelines Six rule sets that govern every decision in the Contour component system. Rules are marked Recommended or Hard floor where the distinction matters."
  },
  {
    "href": "/docs/guidelines#continuity",
    "pageTitle": "Guidelines",
    "heading": "1.1 Continuity",
    "text": "No abrupt corners — in geometry or motion. Every transition must feel like a physical object moving continuously, never snapping between states. Use spring physics (Framer Motion) instead of static easings. Squircle (continuous corner) is the long-term geometric direction but is not yet applied universally — gated on a performant clip-path / SVG solution. Today's default is standard border-radius with opt-in per-component."
  },
  {
    "href": "/docs/guidelines#depth-material",
    "pageTitle": "Guidelines",
    "heading": "1.2 Depth through material, not shadow",
    "text": "Spatial hierarchy via frosted glass / blur ( --material-* ) and semantic background layers (primary / secondary / tertiary — --bg-* ), not heavy box-shadow . Elevated layers use denser material, not darker shadows. Shadows ( --shadow-* ) are a fallback only — used when material cannot be applied (e.g. prefers-reduced-transparency is active, or element floats above a solid background with no viable blur target)."
  },
  {
    "href": "/docs/guidelines#content-first",
    "pageTitle": "Guidelines",
    "heading": "1.3 Content-first restraint",
    "text": "Components never draw more attention than their content. Tint color ( --tint , --color-destructive ) is reserved for actions and states with real meaning. Everything else uses neutral label and fill tokens. Typography scale prioritizes legibility at every size over visual impact."
  },
  {
    "href": "/docs/guidelines#adaptivity",
    "pageTitle": "Guidelines",
    "heading": "1.4 Predictable adaptivity",
    "text": "Components that adapt across size-classes must follow one consistent system-wide logic — not per-component ad hoc breakpoints. Moving from compact to regular+ should feel like a natural evolution of the same interface, not a different product. Unpredictable layout jumps are a regression, not a feature."
  },
  {
    "href": "/docs/guidelines#rule-2-1",
    "pageTitle": "Guidelines",
    "heading": "2.1 Semantic-only access",
    "text": "Component code never calls base palette tokens directly ( --color-blue , --color-gray-3 …). Only semantic tokens are permitted ( --label-primary , --fill-secondary , --tint …). Base tokens exist solely so semantic tokens can reference them."
  },
  {
    "href": "/docs/guidelines#rule-2-2",
    "pageTitle": "Guidelines",
    "heading": "2.2 Units: rem for type, px for spacing / radius",
    "text": "Typography always uses rem (required for Dynamic Type — rule 3.6 in tokens). Spacing and radius follow the 4pt grid in px as source values. No fractional pixel values or arbitrary numbers outside the defined scale."
  },
  {
    "href": "/docs/guidelines#rule-2-3",
    "pageTitle": "Guidelines",
    "heading": "2.3 No ad-hoc component-level tokens",
    "text": "If a component needs a value not in the global token set, it must be documented as a “token gap” and proposed for global addition — not created as a local CSS variable used by only one component. Component-specific tokens that are justified (e.g. --segmented-control-selected-bg ) live in styles/tokens.css under the SS10.* section, not inline in the component file."
  },
  {
    "href": "/docs/guidelines#rule-2-4",
    "pageTitle": "Guidelines",
    "heading": "2.4 Semantic spacing before raw scale",
    "text": "Choose spacing by semantic role first ( --padding-control-x , --gap-section …). Only use raw --space-N tokens when no semantic token matches the context. Overrides for genuine exceptions are permitted but must be explained where the component is implemented — this friction prevents silent drift from the system. Two spacing groups: Group 1 (icon-text gap, row padding — tied to reading rhythm / content density) stays fixed across all size-classes. Group 2 (page margins, section gaps, block padding — tied to “breathing room” and overall layout) scales up with size-class. Do not cross-assign between groups."
  },
  {
    "href": "/docs/guidelines#rule-2-5",
    "pageTitle": "Guidelines",
    "heading": "2.5 Dark mode: never hardcode by mode",
    "text": "No if (isDark) color = X . Every color must go through a semantic token that has paired light / dark values via the .dark class. Component code is always unaware of which mode is active."
  },
  {
    "href": "/docs/guidelines#responsive",
    "pageTitle": "Guidelines",
    "heading": "3. Responsive & Size-Class Behavior",
    "text": "Every layout decision resolves to one of four size-classes — never an arbitrary viewport width. Values are defined as --bp-* tokens (see /docs/tokens ). Size-class breakpoints Size-class Range Typical devices Layout mode compact < 768px Phone, any orientation 1 column — push/pop navigation regular 768–1023px Small tablet, portrait 2 columns — sidebar can overlay regular-lg 1024–1279px Tablet landscape 2 fixed columns — sidebar + detail regular-xl ≥ 1280px Tablet Pro landscape, desktop 3 columns — sidebar + list + detail"
  },
  {
    "href": "/docs/guidelines#rule-3-1",
    "pageTitle": "Guidelines",
    "heading": "3.1 Media query vs container query vs useSizeClass hook",
    "text": "Media query: layout-level decisions only (app shell: sidebar visible or not, number of primary columns). Container query: all reusable components — so a Card in a narrow sidebar adapts differently from the same Card in a wide main column, without knowing the viewport width. useSizeClass() hook: only when a fundamentally different DOM structure is needed (e.g. TabBar ↔ Sidebar switch). Not for style-only differences."
  },
  {
    "href": "/docs/guidelines#rule-3-2",
    "pageTitle": "Guidelines",
    "heading": "3.2 No custom breakpoints in components",
    "text": "Only the four defined size-classes are allowed (compact / regular / regular-lg / regular-xl — see --bp-* tokens). An arbitrary @media (min-width: 900px) inside a component is always wrong — it is a signal to revisit the design, not add a breakpoint."
  },
  {
    "href": "/docs/guidelines#rule-3-3",
    "pageTitle": "Guidelines",
    "heading": "3.3 Mobile-first (compact-first)",
    "text": "Default styles (no media/container query) always represent the compact state. Larger size-classes override upward. Never write desktop-first styles and override down."
  },
  {
    "href": "/docs/guidelines#rule-3-4",
    "pageTitle": "Guidelines",
    "heading": "3.4 Changes must be additive across size-classes",
    "text": "As size-class increases, changes must be expansive — more columns, more whitespace, more visible information. A feature that disappears or behavior that reverses at larger sizes is a regression."
  },
  {
    "href": "/docs/guidelines#rule-4-1",
    "pageTitle": "Guidelines",
    "heading": "4.1 Mandatory state set for every interactive component",
    "text": "Every interactive component must define: default , hover (mouse only — not simulated on touch), active/pressed , focus-visible , and disabled . Omitting focus-visible is never acceptable, even for visually “simple” components."
  },
  {
    "href": "/docs/guidelines#rule-4-2",
    "pageTitle": "Guidelines",
    "heading": "4.2 Press feedback is required",
    "text": "Every tappable element must give immediate feedback on active : scale 0.96–0.98 using --duration-instant (100ms). This is the only confirmation a touch input registers — it cannot be omitted as a “nice to have.”"
  },
  {
    "href": "/docs/guidelines#rule-4-3",
    "pageTitle": "Guidelines",
    "heading": "4.3 Fixed mapping between interaction type and motion preset",
    "text": "Do not choose spring presets arbitrarily per component. Use the preset table in tokens §6.4 (snappy / smooth / gentle / bouncy for common patterns; morph / FLIP / blur for shared-element, used selectively). Unrecognized patterns require a documented “motion gap” before a custom preset is introduced."
  },
  {
    "href": "/docs/guidelines#rule-4-4",
    "pageTitle": "Guidelines",
    "heading": "4.4 Focus ring: consistent, never hidden by material",
    "text": "Use the three shared tokens: --focus-ring-color , --focus-ring-width , and --focus-ring-offset . On frosted glass surfaces, use --focus-ring-color-on-material (solid value, both light and dark variants) — the standard color may wash out against blur."
  },
  {
    "href": "/docs/guidelines#rule-4-5",
    "pageTitle": "Guidelines",
    "heading": "4.5 Loading / empty state animation must use system timing",
    "text": "Skeleton and spinner animations must use durations from the defined scale ( --duration-normal or longer for persistent states). No ad hoc loops with timing outside the scale."
  },
  {
    "href": "/docs/guidelines#rule-4-6",
    "pageTitle": "Guidelines",
    "heading": "4.6 Effects must be idempotent for React Activity caching",
    "text": "Components that may be wrapped in React <Activity> (route caching) must check whether data already exists before fetching. Activity tears down effects when hidden and re-runs them when visible — non-idempotent effects cause a loading flash despite the DOM being preserved."
  },
  {
    "href": "/docs/guidelines#rule-4-7",
    "pageTitle": "Guidelines",
    "heading": "4.7 Flex / Stack for flow layout; plain div for position anchors",
    "text": "Use Flex / Stack when arranging multiple children in a real flow (row / column, with gap / justify / align). For a single position: relative anchor needed by an absolutely-positioned child (badge overlay, ring bounding box) — use a plain <div className=\"relative inline-block\"> . The container-query containment in Flex breaks shrink-to-fit sizing in this use case."
  },
  {
    "href": "/docs/guidelines#rule-4-8",
    "pageTitle": "Guidelines",
    "heading": "4.8 Every scroll container fades its clipped edge",
    "text": "Any element that scrolls ( overflow-y: auto/scroll or the x equivalent) must carry the matching scroll-mask-* utility on that same element — scroll-mask-y for a vertical scroller, scroll-mask-x for a horizontal one, or the single-edge variants. A hard cut at a scroll boundary reads as a layout bug and hides the fact that there is more to see. The only exception is a boundary that is already visually terminated: a full-bleed region ending at the window edge, or a surface closed by its own border (Dropdown, SearchField results) — the mask box is the border box, so masking those would fade the border with the content. See /docs/scroll-mask for the utilities and their fade-distance modifiers."
  },
  {
    "href": "/docs/guidelines#rule-5-1",
    "pageTitle": "Guidelines",
    "heading": "5.1 Minimum contrast",
    "text": "Text must meet WCAG AA: 4.5:1 for normal text, 3:1 for large text (≥ 18px or ≥ 14px bold). Text on frosted glass / material surfaces requires separate contrast testing — blur + alpha reduce effective contrast below static computed values."
  },
  {
    "href": "/docs/guidelines#rule-5-2",
    "pageTitle": "Guidelines",
    "heading": "5.2 Focus must always be visible",
    "text": "Every interactive element must be reachable and operable by keyboard (Tab / Enter / Space / Escape) with a clear focus ring (rule 4.4). Using outline: none without an equivalent replacement is a hard failure."
  },
  {
    "href": "/docs/guidelines#rule-5-3",
    "pageTitle": "Guidelines",
    "heading": "5.3 Reduced motion is the default path, not a fallback",
    "text": "Write animation styles under prefers-reduced-motion: no-preference first. The reduced-motion fallback (typically a simple fade) is the else branch, not an afterthought. This ordering prevents the common mistake of forgetting to implement the reduced path."
  },
  {
    "href": "/docs/guidelines#rule-5-4",
    "pageTitle": "Guidelines",
    "heading": "5.4 Semantic HTML before ARIA",
    "text": "Use correct HTML elements first ( <button> , <nav> , <dialog> …) via Radix primitives. Add ARIA attributes only when semantic HTML is insufficient. Never use ARIA to repair a wrong element choice."
  },
  {
    "href": "/docs/guidelines#rule-5-5",
    "pageTitle": "Guidelines",
    "heading": "5.5 Touch target minimum",
    "text": "Hard floor (required): every interactive control must have at least a 24×24 px touch target area (WCAG 2.2 SC 2.5.8 AA). This is non-negotiable. Recommended target: 44×44 px when input modality is touch ( pointer: coarse ), at any size-class — including regular+ (tablets are touchscreens too). Reach this via padding or before: pseudo-element; do not sacrifice spacing or density solely to hit 44 px. Rules 5.5a and 5.5b further clarify: (a) the hit area for a control with a label must cover the entire control + label unit, not just the control mark; (b) adjacent touch areas must never overlap — cap each side's inset to gap / 2 when controls are closely spaced."
  },
  {
    "href": "/docs/guidelines#rule-5-6",
    "pageTitle": "Guidelines",
    "heading": "5.6 Increase Contrast must be implemented, not placeholder",
    "text": "The prefers-contrast: more overrides in tokens.css SS2.4 are real implementation requirements, not aspirational notes. They must be tested before shipping. The current separator / secondary label alpha values in that section are flagged as preliminary and need verification."
  },
  {
    "href": "/docs/guidelines#rule-5-7",
    "pageTitle": "Guidelines",
    "heading": "5.7 Reduced Transparency must disable blur, not just change color",
    "text": "When prefers-reduced-transparency is active, frosted glass surfaces must switch to a solid background ( tokens.css SS2.4b ). Additionally, backdrop-filter: blur(…) must be disabled — changing the background color alone is not sufficient."
  },
  {
    "href": "/docs/guidelines#rule-6-1",
    "pageTitle": "Guidelines",
    "heading": "6.1 Icons always via abstraction layer",
    "text": "No component may import { X } from \"lucide-react\" directly. All icon usage goes through <Icon name=\"…\" /> from the icon registry. Changing the icon library later only requires updating one file."
  },
  {
    "href": "/docs/guidelines#rule-6-2",
    "pageTitle": "Guidelines",
    "heading": "6.2 Icon size must match the adjacent text style",
    "text": "An icon next to body text uses size=\"md\" (20 px). An icon next to a caption uses size=\"xs\" (12 px) — the icon size scales with the text style it sits beside, from xs (12 px) up to xl (32 px)."
  },
  {
    "href": "/docs/guidelines#rule-6-3",
    "pageTitle": "Guidelines",
    "heading": "6.3 Icon-only elements need a hidden label",
    "text": "Any icon-only button or control must include an aria-label or sr-only text describing the action. Pass decorative={false} to <Icon> and supply an aria-label ."
  },
  {
    "href": "/docs/guidelines#rule-6-4",
    "pageTitle": "Guidelines",
    "heading": "6.4 Text: pick style by role, not by appearance",
    "text": "Each of the 11 Text Styles has a defined semantic role — see the Tokens page for the full scale. Choose the style that matches the content's role — not the one that “looks right” at current size. Using title-1 for dense inline labels because it “stands out” is wrong usage."
  },
  {
    "href": "/docs/guidelines#rule-6-5",
    "pageTitle": "Guidelines",
    "heading": "6.5 Truncation must be explicit",
    "text": "Long text (file names, titles) must have an explicit truncation rule ( truncate prop for single-line, truncate={N} for multi-line clamp). Overflow or layout breakage caused by untruncated text is a bug, not a content author error."
  },
  {
    "href": "/docs/guidelines#rule-6-6",
    "pageTitle": "Guidelines",
    "heading": "6.6 Default labels must be overridable via props",
    "text": "Component defaults like “Cancel” or “Done” must be exposed as props with a sensible default — not hardcoded in JSX. This prepares for internationalization without a full rewrite later."
  },
  {
    "href": "/docs/tokens",
    "pageTitle": "Tokens",
    "text": "Tokens All CSS custom properties defined in styles/tokens.css — the single source of truth for color, typography, spacing, radius, motion, and z-index in the Contour system. --color-red rgb(255 66 69) --color-orange rgb(255 146 48) --color-yellow rgb(255 214 0) --color-green rgb(48 209 88) --color-mint rgb(0 218 195) --color-teal rgb(0 210 224) --color-cyan rgb(60 211 254) --color-blue rgb(0 145 255) --color-indigo rgb(109 124 255) --color-purple rgb(219 52 242) --color-pink rgb(255 55 95) --color-brown rgb(183 138 102) --color-gray-1 rgb(142 142 147) --color-gray-2 rgb(99 99 102) --color-gray-3 rgb(72 72 74) --color-gray-4 rgb(58 58 60) --color-gray-5 rgb(44 44 46) --color-gray-6 rgb(28 28 30) --label-primary Primary text on solid backgrounds SS2.2 --label-secondary Supporting text (60% opacity) SS2.2 --label-tertiary Placeholder, hints (30% opacity) SS2.2 --label-quaternary Decorative text (18% opacity) SS2.2 --bg-primary Primary page background SS2.2 --bg-secondary Secondary surface background SS2.2 --bg-tertiary Tertiary surface background SS2.2 --bg-grouped-primary Grouped list background SS2.2 --bg-grouped-secondary Grouped card background SS2.2 --fill-primary Control fill — 20% opacity SS2.2 --fill-secondary Track/container fill — 16% opacity SS2.2 --fill-tertiary Subtle fill — 12% opacity SS2.2 --fill-quaternary Pressed state — 8% opacity SS2.2 --separator Translucent divider — 12% opacity SS2.2 --separator-opaque Opaque divider (light: 198 198 200) SS2.2 --tint Brand accent — defaults to --color-blue SS2.7 --tint-fill Tinted surface — 15% alpha SS2.7a --tint-fill-pressed Tinted pressed — 25% alpha SS2.7a --color-destructive Danger / error — aliases --color-red SS2.2 --color-success Success — aliases --color-green SS2.2 --color-warning Warning — aliases --color-orange SS2.2 --overlay-default Modal backdrop dim (light: 0 0 0 / 0.2) SS2.2e --material-thin Frosted glass — lightest (70% opacity) SS2.3 --material-regular Frosted glass — default (80% opacity) SS2.3 --material-thick Frosted glass — densest (90% opacity) SS2.3 --focus-ring-color Focus ring color (= --tint by default) SS2.8 --focus-ring-width Focus ring width — 1px SS2.8 --focus-ring-offset Focus ring offset — 0px SS2.8 --shadow-xs Minimal shadow — thumb, pill SS2.9 --shadow-sm Small shadow — Card raised, Slider thumb SS2.9 --shadow-md Medium shadow — elevated surfaces SS2.9 --shadow-lg Large shadow — floating panels SS2.9 2.5625rem +0.025rem h1 2.125rem +0.02375rem h1 1.75rem −0.01625rem h2 1.5625rem −0.028125rem h3 1.375rem −0.026875rem h4 1.375rem −0.026875rem p 1.3125rem −0.019375rem p 1.25rem −0.014375rem span 1.125rem −0.005rem span 1rem 0rem span 0.8125rem +0.00375rem span --space-1 Base unit --space-2 --space-3 --space-4 Default control padding --space-5 --space-6 --space-7 --space-8 --space-10 --space-12 --space-16 --space-20 --padding-control-x Horizontal control padding (Group 1 — fixed) --padding-control-y Vertical control padding (Group 1 — fixed) --padding-row-x List row horizontal padding --padding-row-y List row vertical padding --gap-icon-text Gap between icon and adjacent text --gap-section Section-level gap — responsive (Group 2) --page-margin Page edge margin — responsive --inset-grouped-margin-x Grouped list/card horizontal margin --inset-grouped-gap Gap between grouped sections --swipe-action-width ListItem swipe action reveal width --container-max-width Container variant='content' max-width --safe-area-top Notch / status bar inset --safe-area-right Landscape notch inset --safe-area-bottom Home indicator inset --safe-area-left Landscape notch inset --radius-xs Checkbox, small badge --radius-sm TextField, small card --radius-md SegmentedControl track --radius-lg Alert, Card --radius-xl Sheet, large panel --radius-2xl Sheet on compact --radius-full Pill: Badge, Switch, TabBar pill, SearchField --sheet-radius-top Sheet top corner radius --popover-radius Dropdown, ContextMenu content --ease-standard Default CSS easing --ease-spring-out Overshoot easing (approx. spring) --ease-decelerate Ease-out for entering elements --ease-accelerate Ease-in for exiting elements --duration-instant Press scale, immediate feedback — 0ms at prefers-reduced-motion --duration-fast Color transitions, hover, small UI changes --duration-normal Standard animation duration --duration-slow Content fades, sheet enter/exit --duration-slower Long animations — skeleton, persistent states --progressive-blur-max Peak blur radius at the band's sharpest edge --progressive-blur-tint-alpha Tint opacity backing the blur — 0.85 under Increase Contrast --z-base Default stacking layer --z-sidebar SplitView's floating Sidebar overlay --z-sticky Sticky headers --z-dropdown Dropdown, ContextMenu — above sticky headers, so a floating popover is never clipped behind one --z-overlay General overlay --z-sheet Sheet (+ depth × 20 for nesting) --z-alert Alert — below Toast, above any practical Sheet depth --z-toast Toast — highest in the stack --z-tooltip Tooltip (above everything) --button-bg-destructive SS10.1 Tinted destructive button background (14% red alpha) --segmented-control-selected-bg SS10.2 Active segment pill background (white / 27% white in dark) --tabbar-selection SS10.3 Active tab color (= --tint in light, white in dark) --sidebar-bg-active SS10.6 Selected row when window is focused --sidebar-bg-inactive SS10.6 Selected row when window is blurred Tokens All CSS custom properties defined in styles/tokens.css — the single source of truth for the design system. Components must use semantic tokens, not base palette values directly (Guideline §2.1). Token values in this reference reflect the light mode / default sizeMode (large) baseline. Dark-mode overrides are applied via the .dark class. All durations collapse to 0ms when prefers-reduced-motion: reduce is active."
  },
  {
    "href": "/docs/tokens#color-base",
    "pageTitle": "Tokens",
    "heading": "Color — Base Palette",
    "text": "Base palette tokens (SS2.1) may only be referenced by semantic tokens — never used directly in components (Guideline §2.1). All values are RGB triples (space-separated) for rgb(var(--name) / alpha) usage. Grays"
  },
  {
    "href": "/docs/tokens#color-semantic",
    "pageTitle": "Tokens",
    "heading": "Color — Semantic Tokens",
    "text": "These are the tokens components use directly. Each has paired light/dark values. Semantic color tokens Token Section Description"
  },
  {
    "href": "/docs/tokens#typography",
    "pageTitle": "Tokens",
    "heading": "Typography Scale",
    "text": "11 text styles — the sizeMode=large baseline values. All sizes in rem (required for Dynamic Type — Guideline §2.2). The full 12-sizeMode table lives in lib/typography/scale.ts . Typography scale Style Size Leading Letter-spacing Default as Font weights --weight-regular --weight-medium --weight-semibold --weight-bold"
  },
  {
    "href": "/docs/tokens#spacing",
    "pageTitle": "Tokens",
    "heading": "Spacing",
    "text": "4pt base grid (SS4.1). Use semantic spacing tokens before raw scale tokens (Guideline §2.4). Group 1 tokens are fixed across all size-classes. Group 2 tokens respond to size-class. Raw scale (SS4.1) Semantic spacing (SS4.2) Semantic spacing tokens Token Value Description Safe area insets (SS4.4) Safe area inset tokens Token Value Description"
  },
  {
    "href": "/docs/tokens#radius",
    "pageTitle": "Tokens",
    "heading": "Border Radius",
    "text": "Radius tokens Token Value Preview Used by"
  },
  {
    "href": "/docs/tokens#motion",
    "pageTitle": "Tokens",
    "heading": "Motion",
    "text": "All --duration-* tokens collapse to 0ms when prefers-reduced-motion: reduce is active (except --duration-slower which is preserved for persistent animations like spinners that are the only loading signal). Framer Motion spring presets (snappy / smooth / gentle / bouncy) are defined in lib/motion/springs.ts . Motion tokens Token Value Description"
  },
  {
    "href": "/docs/tokens#progressive-blur",
    "pageTitle": "Tokens",
    "heading": "Progressive Blur",
    "text": "Drives the graduated blur band used behind NavBar, TabBar, and Toolbar (SS2.10) — a single translucent surface that transitions from sharp to fully blurred, not a uniform frosted panel. Disabled entirely under prefers-reduced-transparency: reduce in favor of a flat --bg-primary fill. Progressive blur tokens Token Value Description"
  },
  {
    "href": "/docs/tokens#z-index",
    "pageTitle": "Tokens",
    "heading": "Z-index / Layering Scale",
    "text": "Z-index tokens Token Value Description"
  },
  {
    "href": "/docs/tokens#component-tokens",
    "pageTitle": "Tokens",
    "heading": "Component-Specific Tokens (SS10)",
    "text": "Component-scoped tokens that have no general-purpose semantic meaning. Each maps 1:1 to exactly one component. Per Guideline §2.3, these must live in styles/tokens.css under the SS10 section, not inline in the component file. Component-specific tokens Token Section Description"
  },
  {
    "href": "/docs/scroll-mask",
    "pageTitle": "Scroll Mask",
    "text": "Scroll Mask Scroll-mask utilities — fade the clipped edge of any scroll container so content dissolves instead of ending on a hard cut. Continuity Depth through material Content-first restraint Predictable adaptivity Input modality over size class Motion with intent Accessible by default One system, many surfaces Scroll Mask A set of utilities that fade the clipped edge of a scroll container, so content dissolves into the boundary instead of ending on a hard cut. The fade is driven by the scroll position itself: an edge only fades while there is more content past it. House rule — every scroll container carries a scroll mask. If an element scrolls ( overflow-y: auto/scroll or the x equivalent), it must also carry the matching scroll-mask-* utility. A hard cut at a scroll boundary reads as a layout bug and hides the fact that there is more to see. The only exception is a container whose edge is already visually terminated — a full-bleed region that ends at the window edge, or a surface closed by its own border (Dropdown, SearchField results), where the mask would fade the border along with the content."
  },
  {
    "href": "/docs/scroll-mask#usage",
    "pageTitle": "Scroll Mask",
    "heading": "Usage",
    "text": "Put the utility on the scrolling element itself — the same element that owns overflow . Axis utilities fade both ends of that axis; the single-edge utilities fade one. tsx <div className=\"h-64 overflow-y-auto scroll-mask-y\"> {items.map((item) => ( <Row key={item.id} {...item} /> ))} </div> Scroll-mask utilities Utility Fades scroll-mask-y Top and bottom edges of a vertical scroller scroll-mask-x Left and right edges of a horizontal scroller scroll-mask-t Top edge only scroll-mask-b Bottom edge only scroll-mask-l Left edge only scroll-mask-r Right edge only scroll-mask-y-from-* Where the fade starts, per axis. Accepts a spacing step ( -from-8 = --spacing(8) ), a percentage ( -from-70% ) or an arbitrary length. Defaults to 80% . Also available as -x-from-* and per edge ( -t-from-* , …)."
  },
  {
    "href": "/docs/scroll-mask#vertical",
    "pageTitle": "Scroll Mask",
    "heading": "Vertical",
    "text": "Scroll the list. The top edge is solid at rest and fades in once you leave the start; the bottom fade disappears as you reach the end. scroll-mask-y No mask"
  },
  {
    "href": "/docs/scroll-mask#horizontal",
    "pageTitle": "Scroll Mask",
    "heading": "Horizontal",
    "text": "The same behavior on the inline axis — useful for chip rows, filter bars and any horizontally scrolling toolbar."
  },
  {
    "href": "/docs/scroll-mask#fade-distance",
    "pageTitle": "Scroll Mask",
    "heading": "Fade distance",
    "text": "80% of the box is opaque by default, leaving the outer fifth to fade. Shorten the fade on dense lists so it never eats a whole row. scroll-mask-y-from-95% scroll-mask-y-from-60%"
  },
  {
    "href": "/docs/scroll-mask#how-it-works",
    "pageTitle": "Scroll Mask",
    "heading": "How it works",
    "text": "Four registered custom properties hold the point where each edge starts fading. A scroll-driven animation moves them between 100% (no fade) and the configured distance, so an edge is only faded while there is content past it. The four gradients are then intersected into a single mask. css @property --scroll-mask-t-from { syntax: \"<length-percentage>\"; inherits: false; initial-value: 100%; } /* ...one per edge, plus the keyframes that drive them... */ mask-image: var(--scroll-mask-t), var(--scroll-mask-b), var(--scroll-mask-l), var(--scroll-mask-r); mask-composite: intersect; animation: scroll-mask-y-scroll linear, scroll-mask-x-scroll linear; animation-timeline: scroll(self block), scroll(self inline); The @property registration is what makes the fade animatable — an unregistered custom property has no type, so it would snap between values instead of interpolating. The timeline is scroll(self …) , which is why the utility has to sit on the scrolling element and not on a wrapper. The whole block sits behind @supports (animation-timeline: scroll()) . Browsers without scroll-driven animations get no mask at all — the container still scrolls normally, it just ends on a hard edge. Nothing else degrades."
  },
  {
    "href": "/docs/scroll-mask#rules",
    "pageTitle": "Scroll Mask",
    "heading": "Rules",
    "text": "Put the utility on the element that owns overflow , matching the axis it scrolls: overflow-y-auto scroll-mask-y . Put it on a wrapper around the scroller. The timeline resolves against self , so a non-scrolling element never animates and the mask stays inert. Keep sticky headers, footers and controls clear of the faded end — anchor them to the edge that does not fade, or shorten the fade with scroll-mask-*-from-* . Leave an interactive control sitting inside the fade. The mask applies to the whole element, so a sticky button parked there becomes semi-transparent and hard to read. Give the scroller enough padding that the mask fades empty space between rows rather than clipping the content that draws outside it. Rely on shadows or rings painted outside the border box. The mask box is the border box, so anything drawn past it is clipped."
  },
  {
    "href": "/docs/scroll-mask#in-the-system",
    "pageTitle": "Scroll Mask",
    "heading": "Where it is used",
    "text": "Toast applies scroll-mask-y to its expanded list once the list is taller than the page, so the toasts running off the far end fade out instead of being sliced. Sheet's scrollable body, TabBar's overflowing item row, and this site's own sidebar, table of contents and code blocks all carry it too. Any new scrolling surface is expected to do the same — see guideline rule 4.8."
  },
  {
    "href": "/docs/contributing",
    "pageTitle": "Contributing",
    "text": "Contributing Process conventions for contributors adding or changing components in the Contour codebase — file structure, story coverage, and test requirements. Contributing Process conventions that apply when adding or changing a component in this codebase. These are internal engineering rules, distinct from the reader-facing rules on the Guidelines page. This page is for people contributing code to Contour, not for people consuming the component library. If you're looking for design rules, see Guidelines instead."
  },
  {
    "href": "/docs/contributing#rule-7-1",
    "pageTitle": "Contributing",
    "heading": "One implementation, one stories file, one export",
    "text": "Every component ships with exactly three files: <name>.tsx (implementation), <name>.stories.tsx (Ladle previews, co-located), and index.ts (public export). Separate long-form documentation files are not created alongside components — this page and the rest of /docs are the documentation surface instead."
  },
  {
    "href": "/docs/contributing#rule-7-2",
    "pageTitle": "Contributing",
    "heading": "Stories must cover all states",
    "text": "Each .stories.tsx must include separate stories for: default, each major variant, disabled, loading (when applicable), and at least one story demonstrating different size-class behavior (if the component adapts)."
  },
  {
    "href": "/docs/contributing#rule-7-3",
    "pageTitle": "Contributing",
    "heading": "Anatomy and token notes belong in story descriptions",
    "text": "Ladle story metadata (JSDoc / meta.parameters.docs.description ) is the place for concise anatomy notes — which tokens the component uses, which design principle applies. This keeps implementation notes close to the code without a separate long document."
  },
  {
    "href": "/docs/contributing#rule-7-4",
    "pageTitle": "Contributing",
    "heading": "At least one Do / Don't pair per component",
    "text": "Every component's /docs/components/[slug] page must include at least one Do / Don't example pair. Priority components for this are those most likely to be misused: Sheet, Button (destructive role), Dropdown, Alert, and any component with a non-obvious semantic constraint."
  },
  {
    "href": "/docs/contributing#rule-7-5",
    "pageTitle": "Contributing",
    "heading": "Tests ship with the component, not after",
    "text": "<name>.test.tsx is created at the same time as the component. Minimum coverage: render without error, each major variant, keyboard interaction (Tab / Enter / Space / Escape). Tests that are “added later” are tests that are never added."
  },
  {
    "href": "/docs/settings",
    "pageTitle": "Settings",
    "text": "Settings Live appearance and accessibility preferences for the Contour docs site — theme, color tint, text size, reduce transparency, reduce motion, and increase contrast. Settings These preferences are backed by ContourProvider and persist in localStorage — changes apply immediately across this docs site."
  }
];
