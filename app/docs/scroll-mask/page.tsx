import type { Metadata } from "next";
import {
  DocsSection,
  DocsSubsection,
  DocsCallout,
  DocsCode,
  DocsCodeBlock,
  DocsTable,
  DoDontPair,
} from "@/components/docs/docs-ui";
import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Scroll Mask",
  description:
    "Scroll-mask utilities — fade the clipped edge of any scroll container so content dissolves instead of ending on a hard cut.",
};

// Sample rows used by the live demos below. Kept plain so the demo shows the
// mask, not the content.
const SAMPLE_ROWS = [
  "Continuity",
  "Depth through material",
  "Content-first restraint",
  "Predictable adaptivity",
  "Input modality over size class",
  "Motion with intent",
  "Accessible by default",
  "One system, many surfaces",
];

function DemoRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md bg-fill-secondary px-(--space-3) py-(--space-2)">
      <Text textStyle="footnote">{children}</Text>
    </div>
  );
}

export default function ScrollMaskPage() {
  return (
    <div className="flex flex-col gap-(--gap-section)">
      {/* Page header */}
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Scroll Mask
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          A set of utilities that fade the clipped edge of a scroll container, so content dissolves
          into the boundary instead of ending on a hard cut. The fade is driven by the scroll
          position itself: an edge only fades while there is more content past it.
        </Text>
      </header>

      <DocsCallout kind="warning">
        <strong>House rule — every scroll container carries a scroll mask.</strong> If an element
        scrolls (<DocsCode>overflow-y: auto/scroll</DocsCode> or the <DocsCode>x</DocsCode>{" "}
        equivalent), it must also carry the matching <DocsCode>scroll-mask-*</DocsCode> utility. A
        hard cut at a scroll boundary reads as a layout bug and hides the fact that there is more to
        see. The only exception is a container whose edge is already visually terminated — a
        full-bleed region that ends at the window edge, or a surface closed by its own border
        (Dropdown, SearchField results), where the mask would fade the border along with the
        content.
      </DocsCallout>

      {/* Usage */}
      <DocsSection id="usage" title="Usage">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Put the utility on the scrolling element itself — the same element that owns{" "}
          <DocsCode>overflow</DocsCode>. Axis utilities fade both ends of that axis; the
          single-edge utilities fade one.
        </Text>

        <DocsCodeBlock lang="tsx" copyable>{`<div className="h-64 overflow-y-auto scroll-mask-y">
  {items.map((item) => (
    <Row key={item.id} {...item} />
  ))}
</div>`}</DocsCodeBlock>

        <DocsTable
          caption="Scroll-mask utilities"
          columns={[
            { key: "name", label: "Utility", width: "220px" },
            { key: "desc", label: "Fades" },
          ]}
          rows={[
            { name: <DocsCode>scroll-mask-y</DocsCode>, desc: "Top and bottom edges of a vertical scroller" },
            { name: <DocsCode>scroll-mask-x</DocsCode>, desc: "Left and right edges of a horizontal scroller" },
            { name: <DocsCode>scroll-mask-t</DocsCode>, desc: "Top edge only" },
            { name: <DocsCode>scroll-mask-b</DocsCode>, desc: "Bottom edge only" },
            { name: <DocsCode>scroll-mask-l</DocsCode>, desc: "Left edge only" },
            { name: <DocsCode>scroll-mask-r</DocsCode>, desc: "Right edge only" },
            {
              name: <DocsCode>scroll-mask-y-from-*</DocsCode>,
              desc: (
                <>
                  Where the fade starts, per axis. Accepts a spacing step (<DocsCode>-from-8</DocsCode>{" "}
                  = <DocsCode>--spacing(8)</DocsCode>), a percentage (<DocsCode>-from-70%</DocsCode>)
                  or an arbitrary length. Defaults to <DocsCode>80%</DocsCode>. Also available as{" "}
                  <DocsCode>-x-from-*</DocsCode> and per edge (<DocsCode>-t-from-*</DocsCode>, …).
                </>
              ),
            },
          ]}
        />
      </DocsSection>

      {/* Live examples */}
      <DocsSection id="examples" title="Examples">
        <DocsSubsection id="vertical" title="Vertical">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Scroll the list. The top edge is solid at rest and fades in once you leave the start;
            the bottom fade disappears as you reach the end.
          </Text>
          <HStack gap="4" wrap="wrap" align="start">
            <VStack gap="2">
              <Text textStyle="caption-1" color="tertiary" weight="semibold">
                scroll-mask-y
              </Text>
              <Card elevation="flat" padding="0" className="w-64">
                <VStack
                  gap="2"
                  className="scroll-mask-y h-48 overflow-y-auto p-(--space-3)"
                >
                  {SAMPLE_ROWS.map((row) => (
                    <DemoRow key={row}>{row}</DemoRow>
                  ))}
                </VStack>
              </Card>
            </VStack>

            <VStack gap="2">
              <Text textStyle="caption-1" color="tertiary" weight="semibold">
                No mask
              </Text>
              <Card elevation="flat" padding="0" className="w-64">
                <VStack gap="2" className="h-48 overflow-y-auto p-(--space-3)">
                  {SAMPLE_ROWS.map((row) => (
                    <DemoRow key={row}>{row}</DemoRow>
                  ))}
                </VStack>
              </Card>
            </VStack>
          </HStack>
        </DocsSubsection>

        <DocsSubsection id="horizontal" title="Horizontal">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            The same behavior on the inline axis — useful for chip rows, filter bars and any
            horizontally scrolling toolbar.
          </Text>
          <Card elevation="flat" padding="0" className="max-w-2xl">
            <HStack gap="2" className="scroll-mask-x overflow-x-auto p-(--space-3)">
              {SAMPLE_ROWS.map((row) => (
                <div
                  key={row}
                  className="shrink-0 rounded-full bg-fill-secondary px-(--space-3) py-(--space-2)"
                >
                  <Text textStyle="footnote" className="whitespace-nowrap">
                    {row}
                  </Text>
                </div>
              ))}
            </HStack>
          </Card>
        </DocsSubsection>

        <DocsSubsection id="fade-distance" title="Fade distance">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            <DocsCode>80%</DocsCode> of the box is opaque by default, leaving the outer fifth to
            fade. Shorten the fade on dense lists so it never eats a whole row.
          </Text>
          <HStack gap="4" wrap="wrap" align="start">
            <VStack gap="2">
              <Text textStyle="caption-1" color="tertiary" weight="semibold">
                scroll-mask-y-from-95%
              </Text>
              <Card elevation="flat" padding="0" className="w-64">
                <VStack
                  gap="2"
                  className="scroll-mask-y scroll-mask-y-from-95% h-48 overflow-y-auto p-(--space-3)"
                >
                  {SAMPLE_ROWS.map((row) => (
                    <DemoRow key={row}>{row}</DemoRow>
                  ))}
                </VStack>
              </Card>
            </VStack>

            <VStack gap="2">
              <Text textStyle="caption-1" color="tertiary" weight="semibold">
                scroll-mask-y-from-60%
              </Text>
              <Card elevation="flat" padding="0" className="w-64">
                <VStack
                  gap="2"
                  className="scroll-mask-y scroll-mask-y-from-60% h-48 overflow-y-auto p-(--space-3)"
                >
                  {SAMPLE_ROWS.map((row) => (
                    <DemoRow key={row}>{row}</DemoRow>
                  ))}
                </VStack>
              </Card>
            </VStack>
          </HStack>
        </DocsSubsection>
      </DocsSection>

      {/* How it works */}
      <DocsSection id="how-it-works" title="How it works">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Four registered custom properties hold the point where each edge starts fading. A
          scroll-driven animation moves them between <DocsCode>100%</DocsCode> (no fade) and the
          configured distance, so an edge is only faded while there is content past it. The four
          gradients are then intersected into a single mask.
        </Text>

        <DocsCodeBlock lang="css">{`@property --scroll-mask-t-from {
  syntax: "<length-percentage>";
  inherits: false;
  initial-value: 100%;
}

/* ...one per edge, plus the keyframes that drive them... */

mask-image: var(--scroll-mask-t), var(--scroll-mask-b),
            var(--scroll-mask-l), var(--scroll-mask-r);
mask-composite: intersect;
animation: scroll-mask-y-scroll linear, scroll-mask-x-scroll linear;
animation-timeline: scroll(self block), scroll(self inline);`}</DocsCodeBlock>

        <Text textStyle="body" color="secondary" className="max-w-prose">
          The <DocsCode>@property</DocsCode> registration is what makes the fade animatable — an
          unregistered custom property has no type, so it would snap between values instead of
          interpolating. The timeline is <DocsCode>scroll(self …)</DocsCode>, which is why the
          utility has to sit on the scrolling element and not on a wrapper.
        </Text>

        <DocsCallout kind="note">
          The whole block sits behind <DocsCode>@supports (animation-timeline: scroll())</DocsCode>.
          Browsers without scroll-driven animations get no mask at all — the container still scrolls
          normally, it just ends on a hard edge. Nothing else degrades.
        </DocsCallout>
      </DocsSection>

      {/* Rules */}
      <DocsSection id="rules" title="Rules">
        <DoDontPair
          do={
            <Text textStyle="footnote">
              Put the utility on the element that owns <DocsCode>overflow</DocsCode>, matching the
              axis it scrolls: <DocsCode>overflow-y-auto scroll-mask-y</DocsCode>.
            </Text>
          }
          dont={
            <Text textStyle="footnote">
              Put it on a wrapper around the scroller. The timeline resolves against{" "}
              <DocsCode>self</DocsCode>, so a non-scrolling element never animates and the mask
              stays inert.
            </Text>
          }
        />
        <DoDontPair
          do={
            <Text textStyle="footnote">
              Keep sticky headers, footers and controls clear of the faded end — anchor them to the
              edge that does not fade, or shorten the fade with{" "}
              <DocsCode>scroll-mask-*-from-*</DocsCode>.
            </Text>
          }
          dont={
            <Text textStyle="footnote">
              Leave an interactive control sitting inside the fade. The mask applies to the whole
              element, so a sticky button parked there becomes semi-transparent and hard to read.
            </Text>
          }
        />
        <DoDontPair
          do={
            <Text textStyle="footnote">
              Give the scroller enough padding that the mask fades empty space between rows rather
              than clipping the content that draws outside it.
            </Text>
          }
          dont={
            <Text textStyle="footnote">
              Rely on shadows or rings painted outside the border box. The mask box is the border
              box, so anything drawn past it is clipped.
            </Text>
          }
        />
      </DocsSection>

      {/* In the system */}
      <DocsSection id="in-the-system" title="Where it is used">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Toast applies <DocsCode>scroll-mask-y</DocsCode> to its expanded list once the list is
          taller than the page, so the toasts running off the far end fade out instead of being
          sliced. Sheet&apos;s scrollable body, TabBar&apos;s overflowing item row, and this
          site&apos;s own sidebar, table of contents and code blocks all carry it too. Any new
          scrolling surface is expected to do the same — see guideline rule 4.8.
        </Text>
      </DocsSection>
    </div>
  );
}
