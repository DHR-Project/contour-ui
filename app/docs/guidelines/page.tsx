import type { Metadata } from "next";
import {
  DocsSection,
  DocsSubsection,
  DocsCallout,
  DocsCode,
} from "@/components/docs/docs-ui";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Guidelines",
  description:
    "Contour design guidelines — design principles, token usage, responsive behavior, interaction, accessibility, and iconography rules.",
};

// ---------------------------------------------------------------------------
// "recommended" vs "hard-floor" distinction preserved per rule level
// ---------------------------------------------------------------------------

export default function GuidelinesPage() {
  return (
    <div className="flex flex-col gap-(--gap-section)">
      {/* Page header */}
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Design Guidelines
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Six rule sets that govern every decision in the Contour component system. Rules are marked{" "}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgb(var(--color-blue)/0.12)] text-[rgb(var(--color-blue))] text-caption-1 font-semibold">Recommended</span>{" "}
          or{" "}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgb(var(--color-red)/0.12)] text-[rgb(var(--color-red))] text-caption-1 font-semibold">Hard floor</span>{" "}
          where the distinction matters.
        </Text>
      </header>

      {/* §1 Design Principles */}
      <DocsSection id="principles" title="1. Design Principles">
        <DocsSubsection id="continuity" title="1.1 Continuity">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            No abrupt corners — in geometry or motion. Every transition must feel like a physical
            object moving continuously, never snapping between states. Use spring physics (Framer
            Motion) instead of static easings. Squircle (continuous corner) is the long-term
            geometric direction but is not yet applied universally — gated on a performant
            clip-path / SVG solution. Today&apos;s default is standard{" "}
            <DocsCode>border-radius</DocsCode> with opt-in per-component.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="depth-material" title="1.2 Depth through material, not shadow">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Spatial hierarchy via frosted glass / blur (<DocsCode>--material-*</DocsCode>) and
            semantic background layers (primary / secondary / tertiary — <DocsCode>--bg-*</DocsCode>
            ), not heavy <DocsCode>box-shadow</DocsCode>. Elevated layers use denser material, not
            darker shadows. Shadows (<DocsCode>--shadow-*</DocsCode>) are a fallback only — used
            when material cannot be applied (e.g. <DocsCode>prefers-reduced-transparency</DocsCode>{" "}
            is active, or element floats above a solid background with no viable blur target).
          </Text>
        </DocsSubsection>

        <DocsSubsection id="content-first" title="1.3 Content-first restraint">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Components never draw more attention than their content. Tint color (
            <DocsCode>--tint</DocsCode>, <DocsCode>--color-destructive</DocsCode>) is reserved for
            actions and states with real meaning. Everything else uses neutral label and fill tokens.
            Typography scale prioritizes legibility at every size over visual impact.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="adaptivity" title="1.4 Predictable adaptivity">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Components that adapt across size-classes must follow one consistent system-wide logic —
            not per-component ad hoc breakpoints. Moving from compact to regular+ should feel like a
            natural evolution of the same interface, not a different product. Unpredictable layout
            jumps are a regression, not a feature.
          </Text>
        </DocsSubsection>
      </DocsSection>

      {/* §2 Token Usage Rules */}
      <DocsSection id="token-usage" title="2. Token Usage Rules">
        <DocsSubsection id="rule-2-1" title="2.1 Semantic-only access" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Component code never calls base palette tokens directly (
            <DocsCode>--color-blue</DocsCode>, <DocsCode>--color-gray-3</DocsCode>…). Only semantic
            tokens are permitted (<DocsCode>--label-primary</DocsCode>,{" "}
            <DocsCode>--fill-secondary</DocsCode>, <DocsCode>--tint</DocsCode>…). Base tokens exist
            solely so semantic tokens can reference them.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-2-2" title="2.2 Units: rem for type, px for spacing / radius" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Typography always uses <DocsCode>rem</DocsCode> (required for Dynamic Type — rule
            3.6 in tokens). Spacing and radius follow the 4pt grid in <DocsCode>px</DocsCode> as
            source values. No fractional pixel values or arbitrary numbers outside the defined
            scale.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-2-3" title="2.3 No ad-hoc component-level tokens" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            If a component needs a value not in the global token set, it must be documented as a
            &ldquo;token gap&rdquo; and proposed for global addition — not created as a local CSS
            variable used by only one component. Component-specific tokens that are justified
            (e.g. <DocsCode>--segmented-control-selected-bg</DocsCode>) live in{" "}
            <DocsCode>styles/tokens.css</DocsCode> under the <DocsCode>SS10.*</DocsCode> section,
            not inline in the component file.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-2-4" title="2.4 Semantic spacing before raw scale">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Choose spacing by semantic role first (
            <DocsCode>--padding-control-x</DocsCode>,{" "}
            <DocsCode>--gap-section</DocsCode>…). Only use raw{" "}
            <DocsCode>--space-N</DocsCode> tokens when no semantic token matches the context.
            Overrides for genuine exceptions are permitted but must be explained where the
            component is implemented — this friction prevents silent drift from the system.
          </Text>
          <DocsCallout kind="note">
            <strong>Two spacing groups:</strong> Group 1 (icon-text gap, row padding — tied to
            reading rhythm / content density) stays fixed across all size-classes. Group 2
            (page margins, section gaps, block padding — tied to &ldquo;breathing room&rdquo; and
            overall layout) scales up with size-class. Do not cross-assign between groups.
          </DocsCallout>
        </DocsSubsection>

        <DocsSubsection id="rule-2-5" title="2.5 Dark mode: never hardcode by mode">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            No <DocsCode>if (isDark) color = X</DocsCode>. Every color must go through a semantic
            token that has paired light / dark values via the{" "}
            <DocsCode>.dark</DocsCode> class. Component code is always unaware of which mode is
            active.
          </Text>
        </DocsSubsection>
      </DocsSection>

      {/* §3 Responsive & Size-Class */}
      <DocsSection id="responsive" title="3. Responsive & Size-Class Behavior">
        <DocsSubsection id="rule-3-1" title="3.1 Media query vs container query vs useSizeClass hook">
          <ul className="flex flex-col gap-(--space-2) text-body text-label-secondary max-w-prose list-none">
            <li>
              <strong className="text-label-primary">Media query:</strong> layout-level decisions
              only (app shell: sidebar visible or not, number of primary columns).
            </li>
            <li>
              <strong className="text-label-primary">Container query:</strong> all reusable
              components — so a Card in a narrow sidebar adapts differently from the same Card in a
              wide main column, without knowing the viewport width.
            </li>
            <li>
              <strong className="text-label-primary">
                <DocsCode>useSizeClass()</DocsCode> hook:
              </strong>{" "}
              only when a fundamentally different DOM structure is needed (e.g. TabBar ↔ Sidebar
              switch). Not for style-only differences.
            </li>
          </ul>
        </DocsSubsection>

        <DocsSubsection id="rule-3-2" title="3.2 No custom breakpoints in components" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Only the four defined size-classes are allowed (compact / regular / regular-lg /
            regular-xl — see <DocsCode>--bp-*</DocsCode> tokens). An arbitrary{" "}
            <DocsCode>@media (min-width: 900px)</DocsCode> inside a component is always wrong — it
            is a signal to revisit the design, not add a breakpoint.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-3-3" title="3.3 Mobile-first (compact-first)" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Default styles (no media/container query) always represent the compact state. Larger
            size-classes override upward. Never write desktop-first styles and override down.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-3-4" title="3.4 Changes must be additive across size-classes">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            As size-class increases, changes must be expansive — more columns, more whitespace, more
            visible information. A feature that disappears or behavior that reverses at larger sizes
            is a regression.
          </Text>
        </DocsSubsection>
      </DocsSection>

      {/* §4 Component States & Interaction */}
      <DocsSection id="interaction" title="4. Component States & Interaction">
        <DocsSubsection id="rule-4-1" title="4.1 Mandatory state set for every interactive component" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Every interactive component must define:{" "}
            <DocsCode>default</DocsCode>,{" "}
            <DocsCode>hover</DocsCode> (mouse only — not simulated on touch),{" "}
            <DocsCode>active/pressed</DocsCode>,{" "}
            <DocsCode>focus-visible</DocsCode>, and{" "}
            <DocsCode>disabled</DocsCode>. Omitting <DocsCode>focus-visible</DocsCode> is never
            acceptable, even for visually &ldquo;simple&rdquo; components.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-4-2" title="4.2 Press feedback is required" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Every tappable element must give immediate feedback on <DocsCode>active</DocsCode>:
            scale 0.96–0.98 using <DocsCode>--duration-instant</DocsCode> (100ms). This is the
            only confirmation a touch input registers — it cannot be omitted as a &ldquo;nice to
            have.&rdquo;
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-4-3" title="4.3 Fixed mapping between interaction type and motion preset">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Do not choose spring presets arbitrarily per component. Use the preset table in
            tokens §6.4 (snappy / smooth / gentle / bouncy for common patterns; morph / FLIP / blur
            for shared-element, used selectively). Unrecognized patterns require a documented
            &ldquo;motion gap&rdquo; before a custom preset is introduced.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-4-4" title="4.4 Focus ring: consistent, never hidden by material">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Use the three shared tokens:{" "}
            <DocsCode>--focus-ring-color</DocsCode>,{" "}
            <DocsCode>--focus-ring-width</DocsCode>, and{" "}
            <DocsCode>--focus-ring-offset</DocsCode>. On frosted glass surfaces, use{" "}
            <DocsCode>--focus-ring-color-on-material</DocsCode> (solid value, both light and dark
            variants) — the standard color may wash out against blur.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-4-5" title="4.5 Loading / empty state animation must use system timing">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Skeleton and spinner animations must use durations from the defined scale (
            <DocsCode>--duration-normal</DocsCode> or longer for persistent states). No ad hoc
            loops with timing outside the scale.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-4-6" title="4.6 Effects must be idempotent for React Activity caching">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Components that may be wrapped in React{" "}
            <DocsCode>&lt;Activity&gt;</DocsCode> (route caching) must check whether data already
            exists before fetching. Activity tears down effects when hidden and re-runs them when
            visible — non-idempotent effects cause a loading flash despite the DOM being preserved.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-4-7" title="4.7 Flex / Stack for flow layout; plain div for position anchors" badge="recommended">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Use <DocsCode>Flex</DocsCode> / <DocsCode>Stack</DocsCode> when arranging multiple
            children in a real flow (row / column, with gap / justify / align). For a single{" "}
            <DocsCode>position: relative</DocsCode> anchor needed by an absolutely-positioned child
            (badge overlay, ring bounding box) — use a plain{" "}
            <DocsCode>&lt;div className=&quot;relative inline-block&quot;&gt;</DocsCode>. The
            container-query containment in <DocsCode>Flex</DocsCode> breaks shrink-to-fit sizing
            in this use case.
          </Text>
        </DocsSubsection>
      </DocsSection>

      {/* §5 Accessibility Baseline */}
      <DocsSection id="accessibility" title="5. Accessibility Baseline">
        <DocsSubsection id="rule-5-1" title="5.1 Minimum contrast" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Text must meet WCAG AA: 4.5:1 for normal text, 3:1 for large text (≥ 18px or ≥ 14px
            bold). Text on frosted glass / material surfaces requires separate contrast testing —
            blur + alpha reduce effective contrast below static computed values.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-5-2" title="5.2 Focus must always be visible" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Every interactive element must be reachable and operable by keyboard (Tab / Enter /
            Space / Escape) with a clear focus ring (rule 4.4). Using{" "}
            <DocsCode>outline: none</DocsCode> without an equivalent replacement is a hard failure.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-5-3" title="5.3 Reduced motion is the default path, not a fallback" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Write animation styles under{" "}
            <DocsCode>prefers-reduced-motion: no-preference</DocsCode> first. The reduced-motion
            fallback (typically a simple fade) is the else branch, not an afterthought. This
            ordering prevents the common mistake of forgetting to implement the reduced path.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-5-4" title="5.4 Semantic HTML before ARIA" badge="recommended">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Use correct HTML elements first (
            <DocsCode>&lt;button&gt;</DocsCode>, <DocsCode>&lt;nav&gt;</DocsCode>,{" "}
            <DocsCode>&lt;dialog&gt;</DocsCode>…) via Radix primitives. Add ARIA attributes only
            when semantic HTML is insufficient. Never use ARIA to repair a wrong element choice.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-5-5" title="5.5 Touch target minimum" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            <strong className="text-label-primary">Hard floor (required):</strong> every interactive
            control must have at least a 24×24 px touch target area (WCAG 2.2 SC 2.5.8 AA). This
            is non-negotiable.
          </Text>
          <Text textStyle="body" color="secondary" className="max-w-prose mt-(--space-2)">
            <strong className="text-label-primary">Recommended target:</strong> 44×44 px when input
            modality is touch (<DocsCode>pointer: coarse</DocsCode>), at any size-class — including
            regular+ (tablets are touchscreens too). Reach this via padding or{" "}
            <DocsCode>before:</DocsCode> pseudo-element; do not sacrifice spacing or density solely
            to hit 44 px.
          </Text>
          <DocsCallout kind="note">
            Rules 5.5a and 5.5b further clarify: (a) the hit area for a control with a label must
            cover the entire control + label unit, not just the control mark; (b) adjacent touch
            areas must never overlap — cap each side&apos;s inset to{" "}
            <DocsCode>gap / 2</DocsCode> when controls are closely spaced.
          </DocsCallout>
        </DocsSubsection>

        <DocsSubsection id="rule-5-6" title="5.6 Increase Contrast must be implemented, not placeholder" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            The <DocsCode>prefers-contrast: more</DocsCode> overrides in{" "}
            <DocsCode>tokens.css SS2.4</DocsCode> are real implementation requirements, not
            aspirational notes. They must be tested before shipping. The current separator /
            secondary label alpha values in that section are flagged as preliminary and need
            verification.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-5-7" title="5.7 Reduced Transparency must disable blur, not just change color" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            When <DocsCode>prefers-reduced-transparency</DocsCode> is active, frosted glass
            surfaces must switch to a solid background (
            <DocsCode>tokens.css SS2.4b</DocsCode>). Additionally,{" "}
            <DocsCode>backdrop-filter: blur(…)</DocsCode> must be disabled — changing the background
            color alone is not sufficient.
          </Text>
        </DocsSubsection>
      </DocsSection>

      {/* §6 Content & Iconography */}
      <DocsSection id="content" title="6. Content & Iconography">
        <DocsSubsection id="rule-6-1" title="6.1 Icons always via abstraction layer" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            No component may <DocsCode>import &#123; X &#125; from &quot;lucide-react&quot;</DocsCode>{" "}
            directly. All icon usage goes through{" "}
            <DocsCode>&lt;Icon name=&quot;…&quot; /&gt;</DocsCode> from the icon registry. Changing
            the icon library later only requires updating one file.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-6-2" title="6.2 Icon size must match the adjacent text style">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            An icon next to body text uses <DocsCode>size=&quot;md&quot;</DocsCode> (20 px). An
            icon next to a caption uses <DocsCode>size=&quot;xs&quot;</DocsCode> (12 px) — the
            icon size scales with the text style it sits beside, from{" "}
            <DocsCode>xs</DocsCode> (12 px) up to <DocsCode>xl</DocsCode> (32 px).
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-6-3" title="6.3 Icon-only elements need a hidden label" badge="hard-floor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Any icon-only button or control must include an{" "}
            <DocsCode>aria-label</DocsCode> or <DocsCode>sr-only</DocsCode> text describing the
            action. Pass <DocsCode>decorative=&#123;false&#125;</DocsCode> to{" "}
            <DocsCode>&lt;Icon&gt;</DocsCode> and supply an <DocsCode>aria-label</DocsCode>.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-6-4" title="6.4 Text: pick style by role, not by appearance">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Each of the 11 Text Styles has a defined semantic role — see the{" "}
            <DocsCode>Tokens</DocsCode> page for the full scale. Choose the style that matches the
            content&apos;s role — not the one that &ldquo;looks right&rdquo; at current size. Using{" "}
            <DocsCode>title-1</DocsCode> for dense inline labels because it &ldquo;stands out&rdquo;
            is wrong usage.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-6-5" title="6.5 Truncation must be explicit">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Long text (file names, titles) must have an explicit truncation rule (
            <DocsCode>truncate</DocsCode> prop for single-line,{" "}
            <DocsCode>truncate=&#123;N&#125;</DocsCode> for multi-line clamp). Overflow or layout
            breakage caused by untruncated text is a bug, not a content author error.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-6-6" title="6.6 Default labels must be overridable via props">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Component defaults like &ldquo;Cancel&rdquo; or &ldquo;Done&rdquo; must be exposed as
            props with a sensible default — not hardcoded in JSX. This prepares for
            internationalization without a full rewrite later.
          </Text>
        </DocsSubsection>
      </DocsSection>
    </div>
  );
}
