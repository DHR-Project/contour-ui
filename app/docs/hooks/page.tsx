import type { Metadata } from "next";
import Link from "next/link";
import {
  DocsSection,
  DocsSubsection,
  DocsCallout,
  DocsCode,
  DocsCodeBlock,
  DocsTable,
} from "@/components/docs/docs-ui";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Hooks",
  description:
    "Contour's shared React hooks — responsive size-class, input modality, accessibility preferences, scroll tracking, and interaction primitives used across the component library.",
};

export default function HooksPage() {
  return (
    <div className="flex flex-col gap-(--gap-section)">
      {/* Page header */}
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Hooks
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Framework-level React hooks that back Contour&apos;s components — responsive breakpoints,
          input modality, accessibility preferences, and scroll-driven measurements. Import them
          directly from <DocsCode>lib/hooks/*</DocsCode> when building a new component or custom
          layout.
        </Text>
      </header>

      <DocsCallout kind="note">
        Every hook here reads real browser state (<DocsCode>matchMedia</DocsCode>,{" "}
        <DocsCode>localStorage</DocsCode>, scroll position). Each one starts from the same value the
        server would render — <DocsCode>false</DocsCode>, <DocsCode>&quot;compact&quot;</DocsCode>,
        or <DocsCode>0</DocsCode> — and corrects itself in a mount effect, so there is no hydration
        mismatch even when the real client value differs.
      </DocsCallout>

      {/* Responsive & input modality */}
      <DocsSection id="responsive" title="Responsive &amp; input modality">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Drives layout and gesture forks off two independent traits — viewport width and pointer
          precision — rather than device guesses (guideline rule 4.1).
        </Text>

        <DocsSubsection id="use-size-class" title="useSizeClass">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Returns the current responsive size-class tier, recomputed at each breakpoint crossing
            via one <DocsCode>matchMedia</DocsCode> query per tier.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useSizeClass } from "@/lib/hooks/use-size-class";

const sizeClass = useSizeClass(); // "compact" | "regular" | "regular-lg" | "regular-xl"`}</DocsCodeBlock>
          <DocsTable
            caption="useSizeClass return values"
            columns={[
              { key: "tier", label: "Tier", width: "140px" },
              { key: "minWidth", label: "Min width", width: "120px" },
            ]}
            rows={[
              { tier: <DocsCode>compact</DocsCode>, minWidth: "0px (default)" },
              { tier: <DocsCode>regular</DocsCode>, minWidth: "768px" },
              { tier: <DocsCode>regular-lg</DocsCode>, minWidth: "1024px" },
              { tier: <DocsCode>regular-xl</DocsCode>, minWidth: "1280px" },
            ]}
          />
          <Text textStyle="footnote" color="secondary" className="max-w-prose">
            A <DocsCode>SizeClassOverrideProvider</DocsCode> exported from the same module pins the
            value for a subtree, regardless of real viewport width — used by docs previews. See{" "}
            <Link href="/docs/providers" className="underline underline-offset-2">
              Providers
            </Link>
            .
          </Text>
        </DocsSubsection>

        <DocsSubsection id="use-is-coarse-pointer" title="useIsCoarsePointer">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            True when the primary pointer is coarse (touch) — the deciding trait for gesture sets
            that fork on input modality, such as ListItem&apos;s swipe reveal or
            SegmentedControl&apos;s drag-select. A touch-capable regular+ tablet is still coarse; a
            mouse-driven compact window is not.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useIsCoarsePointer } from "@/lib/hooks/use-coarse-pointer";

const isCoarse = useIsCoarsePointer(); // boolean`}</DocsCodeBlock>
          <Text textStyle="footnote" color="secondary" className="max-w-prose">
            Pairs with a <DocsCode>CoarsePointerOverrideProvider</DocsCode>, mirroring{" "}
            <DocsCode>SizeClassOverrideProvider</DocsCode> above.
          </Text>
        </DocsSubsection>
      </DocsSection>

      {/* Accessibility preferences */}
      <DocsSection id="accessibility" title="Accessibility preferences">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Both hooks below combine the OS-level media query with{" "}
          <Link href="/docs/providers" className="underline underline-offset-2">
            ContourProvider
          </Link>
          &apos;s manual toggle for the same preference — the manual toggle only ever adds the
          effect, it never turns off a real OS-level preference. They listen for the
          <DocsCode>contour-preference-change</DocsCode> event ContourProvider dispatches on every
          preference write, so a toggle flipped from the Settings panel updates every consumer
          immediately.
        </Text>

        <DocsSubsection id="use-reduced-motion" title="useReducedMotion">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            True if <DocsCode>prefers-reduced-motion: reduce</DocsCode> is set, or the manual
            &quot;Reduce Motion&quot; toggle is on. Gate spring/transition animations on this before
            playing them.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useReducedMotion } from "@/lib/hooks/use-reduced-motion";

const reduceMotion = useReducedMotion(); // boolean`}</DocsCodeBlock>
        </DocsSubsection>

        <DocsSubsection id="use-reduce-transparency" title="useReduceTransparency">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Same pattern for <DocsCode>prefers-reduced-transparency: reduce</DocsCode> and the
            manual &quot;Reduce Transparency&quot; toggle — check before rendering frosted-glass
            material (<DocsCode>--material-*</DocsCode>) instead of a flat fallback.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useReduceTransparency } from "@/lib/hooks/use-reduce-transparency";

const reduceTransparency = useReduceTransparency(); // boolean`}</DocsCodeBlock>
        </DocsSubsection>
      </DocsSection>

      {/* Scroll */}
      <DocsSection id="scroll" title="Scroll">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Each of these finds the element ref&apos;s nearest scrollable ancestor rather than
          assuming <DocsCode>window</DocsCode>, since the driving element may live inside its own
          scroll container.
        </Text>

        <DocsSubsection id="use-scroll-progress" title="useScrollProgress">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            0–1 progress through <DocsCode>[0, range]</DocsCode> of whichever container actually
            scrolls — drives NavBar&apos;s Large Title collapse. rAF-throttled to one pending
            measurement at a time.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useScrollProgress } from "@/lib/hooks/use-scroll-progress";

const progress = useScrollProgress(range, enabled, elementRef); // number, 0-1`}</DocsCodeBlock>
          <DocsTable
            caption="useScrollProgress parameters"
            columns={[
              { key: "name", label: "Parameter", width: "120px" },
              { key: "type", label: "Type", width: "160px" },
              { key: "description", label: "Description" },
            ]}
            rows={[
              {
                name: <DocsCode>range</DocsCode>,
                type: <DocsCode>number</DocsCode>,
                description: "Scroll distance (px) over which progress goes from 0 to 1.",
              },
              {
                name: <DocsCode>enabled</DocsCode>,
                type: <DocsCode>boolean</DocsCode>,
                description: "Disables measurement entirely; the hook returns 0 while false.",
              },
              {
                name: <DocsCode>elementRef</DocsCode>,
                type: <DocsCode>RefObject&lt;Element | null&gt;</DocsCode>,
                description: "Element whose nearest scrollable ancestor is measured.",
              },
            ]}
          />
        </DocsSubsection>

        <DocsSubsection id="use-scroll-velocity-factor" title="useScrollVelocityFactor">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            0–1 multiplier for progressive-blur intensity based on scroll speed — full blur under
            ~15px/frame, zeroed past ~40px/frame, linear falloff between. Always returns{" "}
            <DocsCode>1</DocsCode> under reduced motion, since this is itself a scroll-linked
            dynamic effect.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useScrollVelocityFactor } from "@/lib/hooks/use-scroll-velocity";

const blurFactor = useScrollVelocityFactor(elementRef); // number, 0-1`}</DocsCodeBlock>
        </DocsSubsection>

        <DocsSubsection id="use-active-heading" title="useActiveHeading">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Scrollspy that returns the id of the heading the reader is currently under — the id of
            the last heading (in document order) whose top has scrolled past a fixed offset. Powers
            this site&apos;s own table-of-contents.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useActiveHeading } from "@/lib/hooks/use-active-heading";

const activeId = useActiveHeading(headingIds, pageKey); // string | null`}</DocsCodeBlock>
          <DocsTable
            caption="useActiveHeading parameters"
            columns={[
              { key: "name", label: "Parameter", width: "120px" },
              { key: "type", label: "Type", width: "140px" },
              { key: "description", label: "Description" },
            ]}
            rows={[
              {
                name: <DocsCode>ids</DocsCode>,
                type: <DocsCode>string[]</DocsCode>,
                description: "Heading element ids, in document order.",
              },
              {
                name: <DocsCode>pageKey</DocsCode>,
                type: <DocsCode>string?</DocsCode>,
                description:
                  "Forces the effect to re-subscribe on route change, even when the new page reuses the same heading ids.",
              },
            ]}
          />
        </DocsSubsection>
      </DocsSection>

      {/* Interaction */}
      <DocsSection id="interaction" title="Interaction">
        <DocsSubsection id="use-drag-select-group" title="useDragSelectGroup">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Touch-only &quot;drag across visible options, highlight, commit on release&quot; gesture
            shared by SegmentedControl and RadioGroup. Gated on <DocsCode>pointer: coarse</DocsCode>{" "}
            — desktop mouse never drives it. Each option element needs a{" "}
            <DocsCode>data-drag-select-index</DocsCode> attribute for hit-testing.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useDragSelectGroup } from "@/lib/hooks/use-drag-select-group";

const { highlightedIndex, containerDragProps } = useDragSelectGroup({
  enabled: isCoarsePointer,
  targets: options.map((option) => ({ onSelect: () => select(option.value) })),
  containerRef,
});`}</DocsCodeBlock>
          <DocsTable
            caption="useDragSelectGroup options and return value"
            columns={[
              { key: "name", label: "Field", width: "180px" },
              { key: "type", label: "Type" },
            ]}
            rows={[
              { name: <DocsCode>enabled</DocsCode>, type: <DocsCode>boolean</DocsCode> },
              {
                name: <DocsCode>targets</DocsCode>,
                type: <DocsCode>{"{ onSelect: () => void }[]"}</DocsCode>,
              },
              {
                name: <DocsCode>containerRef</DocsCode>,
                type: <DocsCode>RefObject&lt;HTMLElement | null&gt;</DocsCode>,
              },
              {
                name: <DocsCode>→ highlightedIndex</DocsCode>,
                type: <DocsCode>number | null</DocsCode>,
              },
              {
                name: <DocsCode>→ containerDragProps</DocsCode>,
                type: <DocsCode>{"{ onPointerDown }"}</DocsCode>,
              },
            ]}
          />
        </DocsSubsection>
      </DocsSection>

      {/* Window */}
      <DocsSection id="window" title="Window">
        <DocsSubsection id="use-window-focus" title="useWindowFocus">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Whether the browser window/tab itself currently has focus — distinct from{" "}
            <DocsCode>:focus-within</DocsCode> (keyboard focus on a descendant). Sidebar uses this to
            dim its active row when the user switches to another app or tab.
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useWindowFocus } from "@/lib/hooks/use-window-focus";

const focused = useWindowFocus(); // boolean`}</DocsCodeBlock>
        </DocsSubsection>
      </DocsSection>
    </div>
  );
}
