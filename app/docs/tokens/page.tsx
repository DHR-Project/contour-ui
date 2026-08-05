import type { Metadata } from "next";
import { DocsSection, DocsCode, DocsCallout, DocsTable } from "@/components/docs/docs-ui";
import { Text } from "@/components/ui/text";
import { Grid } from "@/components/ui/grid";
import { VStack } from "@/components/ui/stack";

export const metadata: Metadata = {
  title: "Tokens",
  description:
    "All CSS custom properties defined in styles/tokens.css — the single source of truth for color, typography, spacing, radius, motion, and z-index in the Contour system.",
};

// ---------------------------------------------------------------------------
// Static token data sourced directly from styles/tokens.css
// ---------------------------------------------------------------------------

const BASE_COLORS = [
  { name: "--color-red", value: "rgb(255 56 60)", darkValue: "rgb(255 66 69)" },
  { name: "--color-orange", value: "rgb(255 141 40)", darkValue: "rgb(255 146 48)" },
  { name: "--color-yellow", value: "rgb(255 204 0)", darkValue: "rgb(255 214 0)" },
  { name: "--color-green", value: "rgb(52 199 89)", darkValue: "rgb(48 209 88)" },
  { name: "--color-mint", value: "rgb(0 200 179)", darkValue: "rgb(0 218 195)" },
  { name: "--color-teal", value: "rgb(0 195 208)", darkValue: "rgb(0 210 224)" },
  { name: "--color-cyan", value: "rgb(0 192 232)", darkValue: "rgb(60 211 254)" },
  { name: "--color-blue", value: "rgb(0 136 255)", darkValue: "rgb(0 145 255)" },
  { name: "--color-indigo", value: "rgb(97 85 245)", darkValue: "rgb(109 124 255)" },
  { name: "--color-purple", value: "rgb(203 48 224)", darkValue: "rgb(219 52 242)" },
  { name: "--color-pink", value: "rgb(255 45 85)", darkValue: "rgb(255 55 95)" },
  { name: "--color-brown", value: "rgb(172 127 94)", darkValue: "rgb(183 138 102)" },
];

const GRAY_COLORS = [
  { name: "--color-gray-1", value: "rgb(142 142 147)", darkValue: "rgb(142 142 147)" },
  { name: "--color-gray-2", value: "rgb(174 174 178)", darkValue: "rgb(99 99 102)" },
  { name: "--color-gray-3", value: "rgb(199 199 204)", darkValue: "rgb(72 72 74)" },
  { name: "--color-gray-4", value: "rgb(209 209 214)", darkValue: "rgb(58 58 60)" },
  { name: "--color-gray-5", value: "rgb(229 229 234)", darkValue: "rgb(44 44 46)" },
  { name: "--color-gray-6", value: "rgb(242 242 247)", darkValue: "rgb(28 28 30)" },
];

const SEMANTIC_COLORS = [
  { name: "--label-primary", description: "Primary text on solid backgrounds", section: "SS2.2" },
  { name: "--label-secondary", description: "Supporting text (60% opacity)", section: "SS2.2" },
  { name: "--label-tertiary", description: "Placeholder, hints (30% opacity)", section: "SS2.2" },
  { name: "--label-quaternary", description: "Decorative text (18% opacity)", section: "SS2.2" },
  { name: "--bg-primary", description: "Primary page background", section: "SS2.2" },
  { name: "--bg-secondary", description: "Secondary surface background", section: "SS2.2" },
  { name: "--bg-tertiary", description: "Tertiary surface background", section: "SS2.2" },
  { name: "--bg-grouped-primary", description: "Grouped list background", section: "SS2.2" },
  { name: "--bg-grouped-secondary", description: "Grouped card background", section: "SS2.2" },
  { name: "--fill-primary", description: "Control fill — 20% opacity", section: "SS2.2" },
  { name: "--fill-secondary", description: "Track/container fill — 16% opacity", section: "SS2.2" },
  { name: "--fill-tertiary", description: "Subtle fill — 12% opacity", section: "SS2.2" },
  { name: "--fill-quaternary", description: "Pressed state — 8% opacity", section: "SS2.2" },
  { name: "--separator", description: "Translucent divider — 12% opacity", section: "SS2.2" },
  { name: "--separator-opaque", description: "Opaque divider (light: 198 198 200)", section: "SS2.2" },
  { name: "--tint", description: "Brand accent — defaults to --color-blue", section: "SS2.7" },
  { name: "--tint-fill", description: "Tinted surface — 15% alpha", section: "SS2.7a" },
  { name: "--tint-fill-pressed", description: "Tinted pressed — 25% alpha", section: "SS2.7a" },
  { name: "--color-destructive", description: "Danger / error — aliases --color-red", section: "SS2.2" },
  { name: "--color-success", description: "Success — aliases --color-green", section: "SS2.2" },
  { name: "--color-warning", description: "Warning — aliases --color-orange", section: "SS2.2" },
  { name: "--overlay-default", description: "Modal backdrop dim (light: 0 0 0 / 0.2)", section: "SS2.2e" },
  { name: "--material-thin", description: "Frosted glass — lightest (70% opacity)", section: "SS2.3" },
  { name: "--material-regular", description: "Frosted glass — default (80% opacity)", section: "SS2.3" },
  { name: "--material-thick", description: "Frosted glass — densest (90% opacity)", section: "SS2.3" },
  { name: "--focus-ring-color", description: "Focus ring color (= --tint by default)", section: "SS2.8" },
  { name: "--focus-ring-width", description: "Focus ring width — 2px", section: "SS2.8" },
  { name: "--focus-ring-offset", description: "Focus ring offset — 2px", section: "SS2.8" },
  { name: "--shadow-xs", description: "Minimal shadow — thumb, pill", section: "SS2.9" },
  { name: "--shadow-sm", description: "Small shadow — Card raised, Slider thumb", section: "SS2.9" },
  { name: "--shadow-md", description: "Medium shadow — elevated surfaces", section: "SS2.9" },
  { name: "--shadow-lg", description: "Large shadow — floating panels", section: "SS2.9" },
];

const TYPOGRAPHY_SCALE = [
  { style: "large-title", size: "2.125rem (34px)", leading: "2.5625rem", letterSpacing: "+0.025rem", defaultAs: "h1" },
  { style: "title-1", size: "1.75rem (28px)", leading: "2.125rem", letterSpacing: "+0.02375rem", defaultAs: "h1" },
  { style: "title-2", size: "1.375rem (22px)", leading: "1.75rem", letterSpacing: "−0.01625rem", defaultAs: "h2" },
  { style: "title-3", size: "1.25rem (20px)", leading: "1.5625rem", letterSpacing: "−0.028125rem", defaultAs: "h3" },
  { style: "headline", size: "1.0625rem (17px)", leading: "1.375rem", letterSpacing: "−0.026875rem", defaultAs: "h4" },
  { style: "body", size: "1.0625rem (17px)", leading: "1.375rem", letterSpacing: "−0.026875rem", defaultAs: "p" },
  { style: "callout", size: "1rem (16px)", leading: "1.3125rem", letterSpacing: "−0.019375rem", defaultAs: "p" },
  { style: "subheadline", size: "0.9375rem (15px)", leading: "1.25rem", letterSpacing: "−0.014375rem", defaultAs: "span" },
  { style: "footnote", size: "0.8125rem (13px)", leading: "1.125rem", letterSpacing: "−0.005rem", defaultAs: "span" },
  { style: "caption-1", size: "0.75rem (12px)", leading: "1rem", letterSpacing: "0rem", defaultAs: "span" },
  { style: "caption-2", size: "0.6875rem (11px)", leading: "0.8125rem", letterSpacing: "+0.00375rem", defaultAs: "span" },
];

const SPACING_TOKENS = [
  { name: "--space-1", value: "4px", description: "Base unit" },
  { name: "--space-2", value: "8px", description: "" },
  { name: "--space-3", value: "12px", description: "" },
  { name: "--space-4", value: "16px", description: "Default control padding" },
  { name: "--space-5", value: "20px", description: "" },
  { name: "--space-6", value: "24px", description: "" },
  { name: "--space-7", value: "28px", description: "" },
  { name: "--space-8", value: "32px", description: "" },
  { name: "--space-10", value: "40px", description: "" },
  { name: "--space-12", value: "48px", description: "" },
  { name: "--space-16", value: "64px", description: "" },
  { name: "--space-20", value: "80px", description: "" },
];

const SEMANTIC_SPACING = [
  { name: "--padding-control-x", value: "var(--space-4)", description: "Horizontal control padding (Group 1 — fixed)" },
  { name: "--padding-control-y", value: "var(--space-2)", description: "Vertical control padding (Group 1 — fixed)" },
  { name: "--padding-row-x", value: "var(--space-4)", description: "List row horizontal padding" },
  { name: "--padding-row-y", value: "var(--space-3)", description: "List row vertical padding" },
  { name: "--gap-icon-text", value: "var(--space-2)", description: "Gap between icon and adjacent text" },
  { name: "--gap-section", value: "32px → 40px → 48px", description: "Section-level gap — responsive (Group 2)" },
  { name: "--page-margin", value: "16px → 24px → 32px", description: "Page edge margin — responsive" },
  { name: "--inset-grouped-margin-x", value: "16px → 20px → 24px", description: "Grouped list/card horizontal margin" },
  { name: "--inset-grouped-gap", value: "32px → 40px → 48px", description: "Gap between grouped sections" },
  { name: "--swipe-action-width", value: "80px", description: "ListItem swipe action reveal width" },
  { name: "--container-max-width", value: "720px", description: "Container variant='content' max-width" },
];

const RADIUS_TOKENS = [
  { name: "--radius-xs", value: "4px", usage: "Checkbox, small badge" },
  { name: "--radius-sm", value: "8px", usage: "TextField, small card" },
  { name: "--radius-md", value: "10px", usage: "SegmentedControl track" },
  { name: "--radius-lg", value: "14px", usage: "Alert, Card" },
  { name: "--radius-xl", value: "20px", usage: "Sheet, large panel" },
  { name: "--radius-2xl", value: "28px", usage: "Sheet on compact" },
  { name: "--radius-full", value: "9999px", usage: "Pill: Badge, Switch, TabBar pill, SearchField" },
  { name: "--sheet-radius-top", value: "34px (compact) / 38px (regular+)", usage: "Sheet top corner radius" },
  { name: "--popover-radius", value: "38px", usage: "Dropdown, ContextMenu content" },
];

const MOTION_TOKENS = [
  { name: "--ease-standard", value: "cubic-bezier(0.25, 0.1, 0.25, 1)", description: "Default CSS easing" },
  { name: "--ease-spring-out", value: "cubic-bezier(0.34, 1.56, 0.64, 1)", description: "Overshoot easing (approx. spring)" },
  { name: "--ease-decelerate", value: "cubic-bezier(0, 0, 0.2, 1)", description: "Ease-out for entering elements" },
  { name: "--ease-accelerate", value: "cubic-bezier(0.4, 0, 1, 1)", description: "Ease-in for exiting elements" },
  { name: "--duration-instant", value: "100ms", description: "Press scale, immediate feedback — 0ms at prefers-reduced-motion" },
  { name: "--duration-fast", value: "200ms", description: "Color transitions, hover, small UI changes" },
  { name: "--duration-normal", value: "300ms", description: "Standard animation duration" },
  { name: "--duration-slow", value: "400ms", description: "Content fades, sheet enter/exit" },
  { name: "--duration-slower", value: "500ms", description: "Long animations — skeleton, persistent states" },
];

const ZINDEX_TOKENS = [
  { name: "--z-base", value: "0", description: "Default stacking layer" },
  { name: "--z-dropdown", value: "100", description: "Dropdown, ContextMenu" },
  { name: "--z-sticky", value: "200", description: "Sticky headers" },
  { name: "--z-overlay", value: "300", description: "General overlay" },
  { name: "--z-sheet", value: "310", description: "Sheet (+ depth × 20 for nesting)" },
  { name: "--z-alert", value: "390", description: "Alert — below Toast, above any practical Sheet depth" },
  { name: "--z-toast", value: "400", description: "Toast — highest in the stack" },
  { name: "--z-tooltip", value: "500", description: "Tooltip (above everything)" },
];

const COMPONENT_TOKENS = [
  { name: "--button-bg-destructive", section: "SS10.1", description: "Tinted destructive button background (14% red alpha)" },
  { name: "--segmented-control-selected-bg", section: "SS10.2", description: "Active segment pill background (white / 27% white in dark)" },
  { name: "--tabbar-selection", section: "SS10.3", description: "Active tab color (= --tint in light, white in dark)" },
  { name: "--sidebar-bg-active", section: "SS10.6", description: "Selected row when window is focused" },
  { name: "--sidebar-bg-inactive", section: "SS10.6", description: "Selected row when window is blurred" },
];

export default function TokensPage() {
  return (
    <div className="flex flex-col gap-(--gap-section)">
      {/* Header */}
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Tokens
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          All CSS custom properties defined in{" "}
          <DocsCode>styles/tokens.css</DocsCode> — the single source of truth for the design
          system. Components must use semantic tokens, not base palette values directly
          (Guideline §2.1).
        </Text>
        <DocsCallout kind="note">
          Token values in this reference reflect the <strong>light mode / default sizeMode
          (large)</strong> baseline. Dark-mode overrides are applied via the{" "}
          <DocsCode>.dark</DocsCode> class. All durations collapse to{" "}
          <strong>0ms</strong> when <DocsCode>prefers-reduced-motion: reduce</DocsCode> is active.
        </DocsCallout>
      </header>

      {/* §1 Color — Base Palette */}
      <DocsSection id="color-base" title="Color — Base Palette">
        <Text textStyle="body" color="secondary">
          Base palette tokens (SS2.1) may only be referenced by semantic tokens — never used
          directly in components (Guideline §2.1). All values are RGB triples (space-separated)
          for <DocsCode>rgb(var(--name) / alpha)</DocsCode> usage.
        </Text>

        <Grid columns={{ compact: 2, regular: 4 }} gap="3">
          {BASE_COLORS.map((c) => (
            <VStack key={c.name} gap="2">
              <div
                className="h-12 rounded-lg border border-separator"
                style={{ background: c.value }}
                aria-hidden="true"
              />
              <div>
                <Text textStyle="caption-1" className="font-mono">
                  {c.name}
                </Text>
                <Text textStyle="caption-2" color="secondary" truncate>
                  {c.value}
                </Text>
              </div>
            </VStack>
          ))}
        </Grid>

        <div className="mt-(--space-2)">
          <Text
            as="h3"
            textStyle="footnote"
            weight="semibold"
            color="secondary"
            className="uppercase tracking-wide mb-(--space-3)"
          >
            Grays
          </Text>
          <Grid columns={{ compact: 3, regular: 6 }} gap="3">
            {GRAY_COLORS.map((c) => (
              <VStack key={c.name} gap="2">
                <div
                  className="h-8 rounded-lg border border-separator"
                  style={{ background: c.value }}
                  aria-hidden="true"
                />
                <Text textStyle="caption-2" color="secondary" className="font-mono">
                  {c.name}
                </Text>
              </VStack>
            ))}
          </Grid>
        </div>
      </DocsSection>

      {/* §2 Color — Semantic */}
      <DocsSection id="color-semantic" title="Color — Semantic Tokens">
        <Text textStyle="body" color="secondary">
          These are the tokens components use directly. Each has paired light/dark values.
        </Text>
        <DocsTable
          caption="Semantic color tokens"
          columns={[
            { key: "name", label: "Token", width: "260px" },
            { key: "section", label: "Section", width: "80px" },
            { key: "description", label: "Description" },
          ]}
          rows={SEMANTIC_COLORS.map((t) => ({
            name: <DocsCode>{t.name}</DocsCode>,
            section: <span className="text-caption-1 text-label-tertiary font-mono">{t.section}</span>,
            description: <span className="text-label-secondary">{t.description}</span>,
          }))}
        />
      </DocsSection>

      {/* §3 Typography */}
      <DocsSection id="typography" title="Typography Scale">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          11 text styles — the <strong>sizeMode=large</strong> baseline values. All sizes in{" "}
          <DocsCode>rem</DocsCode> (required for Dynamic Type — Guideline §2.2). The full
          12-sizeMode table lives in <DocsCode>lib/typography/scale.ts</DocsCode>.
        </Text>
        <DocsTable
          caption="Typography scale"
          columns={[
            { key: "style", label: "Style", width: "140px" },
            { key: "size", label: "Size", width: "140px" },
            { key: "leading", label: "Leading", width: "110px" },
            { key: "tracking", label: "Letter-spacing", width: "130px" },
            { key: "defaultAs", label: "Default as", width: "90px" },
          ]}
          rows={TYPOGRAPHY_SCALE.map((t) => ({
            style: (
              <span style={{ fontSize: t.size.split(" ")[0] }} className="font-medium text-label-primary">
                {t.style}
              </span>
            ),
            size: <DocsCode>{t.size}</DocsCode>,
            leading: <span className="text-caption-1 font-mono text-label-secondary">{t.leading}</span>,
            tracking: <span className="text-caption-1 font-mono text-label-secondary">{t.letterSpacing}</span>,
            defaultAs: <DocsCode>{t.defaultAs}</DocsCode>,
          }))}
        />

        <div className="mt-(--space-2)">
          <Text as="h3" textStyle="footnote" weight="semibold" color="secondary" className="mb-(--space-2)">
            Font weights
          </Text>
          <div className="flex flex-wrap gap-(--space-3)">
            {[
              { name: "--weight-regular", value: "400" },
              { name: "--weight-medium", value: "500" },
              { name: "--weight-semibold", value: "600" },
              { name: "--weight-bold", value: "700" },
            ].map((w) => (
              <span key={w.name} className="flex items-center gap-(--space-2) px-(--space-3) py-(--space-1) rounded-md border border-separator bg-fill-quaternary">
                <DocsCode>{w.name}</DocsCode>
                <span className="text-footnote text-label-secondary" style={{ fontWeight: w.value }}>
                  {w.value}
                </span>
              </span>
            ))}
          </div>
        </div>
      </DocsSection>

      {/* §4 Spacing */}
      <DocsSection id="spacing" title="Spacing">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          4pt base grid (SS4.1). Use semantic spacing tokens before raw scale tokens (Guideline §2.4).
          Group 1 tokens are fixed across all size-classes. Group 2 tokens respond to size-class.
        </Text>

        {/* Raw scale */}
        <div>
          <Text as="h3" textStyle="subheadline" weight="semibold" className="mb-(--space-3)">
            Raw scale (SS4.1)
          </Text>
          <div className="flex flex-col gap-(--space-2)">
            {SPACING_TOKENS.map((t) => (
              <div key={t.name} className="flex items-center gap-(--space-4)">
                <DocsCode>{t.name}</DocsCode>
                <div
                  className="bg-[rgb(var(--color-blue)/0.4)] rounded-sm"
                  style={{ width: t.value, height: "16px", minWidth: "4px" }}
                  aria-label={`${t.value} visual`}
                />
                <span className="text-caption-1 font-mono text-label-secondary">{t.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Semantic spacing */}
        <div>
          <Text as="h3" textStyle="subheadline" weight="semibold" className="mb-(--space-3)">
            Semantic spacing (SS4.2)
          </Text>
          <DocsTable
            caption="Semantic spacing tokens"
            columns={[
              { key: "name", label: "Token", width: "240px" },
              { key: "value", label: "Value" },
              { key: "description", label: "Description" },
            ]}
            rows={SEMANTIC_SPACING.map((t) => ({
              name: <DocsCode>{t.name}</DocsCode>,
              value: <span className="text-caption-1 font-mono text-label-secondary">{t.value}</span>,
              description: <span className="text-label-secondary">{t.description}</span>,
            }))}
          />
        </div>
      </DocsSection>

      {/* §5 Border Radius */}
      <DocsSection id="radius" title="Border Radius">
        <DocsTable
          caption="Radius tokens"
          columns={[
            { key: "name", label: "Token", width: "200px" },
            { key: "value", label: "Value", width: "200px" },
            { key: "preview", label: "Preview", width: "80px" },
            { key: "usage", label: "Used by" },
          ]}
          rows={RADIUS_TOKENS.map((t) => ({
            name: <DocsCode>{t.name}</DocsCode>,
            value: <span className="text-caption-1 font-mono text-label-secondary">{t.value}</span>,
            preview: (
              <div
                className="w-10 h-6 bg-[rgb(var(--color-blue)/0.25)] border border-[rgb(var(--color-blue)/0.4)]"
                style={{ borderRadius: t.value.split(" ")[0] }}
                aria-hidden="true"
              />
            ),
            usage: <span className="text-label-secondary">{t.usage}</span>,
          }))}
        />
      </DocsSection>

      {/* §6 Motion */}
      <DocsSection id="motion" title="Motion">
        <DocsCallout kind="note">
          All <DocsCode>--duration-*</DocsCode> tokens collapse to{" "}
          <strong>0ms</strong> when <DocsCode>prefers-reduced-motion: reduce</DocsCode> is active
          (except <DocsCode>--duration-slower</DocsCode> which is preserved for
          persistent animations like spinners that are the only loading signal).
          Framer Motion spring presets (snappy / smooth / gentle / bouncy) are defined in{" "}
          <DocsCode>lib/motion/springs.ts</DocsCode>.
        </DocsCallout>
        <DocsTable
          caption="Motion tokens"
          columns={[
            { key: "name", label: "Token", width: "220px" },
            { key: "value", label: "Value" },
            { key: "description", label: "Description" },
          ]}
          rows={MOTION_TOKENS.map((t) => ({
            name: <DocsCode>{t.name}</DocsCode>,
            value: <span className="text-caption-1 font-mono text-label-secondary break-all">{t.value}</span>,
            description: <span className="text-label-secondary">{t.description}</span>,
          }))}
        />
      </DocsSection>

      {/* §6.9 Z-Index */}
      <DocsSection id="z-index" title="Z-index / Layering Scale">
        <DocsTable
          caption="Z-index tokens"
          columns={[
            { key: "name", label: "Token", width: "180px" },
            { key: "value", label: "Value", width: "80px" },
            { key: "description", label: "Description" },
          ]}
          rows={ZINDEX_TOKENS.map((t) => ({
            name: <DocsCode>{t.name}</DocsCode>,
            value: <span className="text-caption-1 font-mono text-label-secondary">{t.value}</span>,
            description: <span className="text-label-secondary">{t.description}</span>,
          }))}
        />
      </DocsSection>

      {/* §10 Component-specific */}
      <DocsSection id="component-tokens" title="Component-Specific Tokens (SS10)">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Component-scoped tokens that have no general-purpose semantic meaning. Each maps
          1:1 to exactly one component. Per Guideline §2.3, these must live in{" "}
          <DocsCode>styles/tokens.css</DocsCode> under the SS10 section, not inline in the
          component file.
        </Text>
        <DocsTable
          caption="Component-specific tokens"
          columns={[
            { key: "name", label: "Token", width: "280px" },
            { key: "section", label: "Section", width: "80px" },
            { key: "description", label: "Description" },
          ]}
          rows={COMPONENT_TOKENS.map((t) => ({
            name: <DocsCode>{t.name}</DocsCode>,
            section: <span className="text-caption-1 text-label-tertiary font-mono">{t.section}</span>,
            description: <span className="text-label-secondary">{t.description}</span>,
          }))}
        />
      </DocsSection>
    </div>
  );
}
