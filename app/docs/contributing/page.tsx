import type { Metadata } from "next";
import { DocsSection, DocsSubsection, DocsCode, DocsCallout } from "@/components/docs/docs-ui";
import { Text } from "@/components/ui/text";

export const metadata: Metadata = {
  title: "Contributing",
  description:
    "Process conventions for contributors adding or changing components in the Contour codebase — file structure, story coverage, and test requirements.",
};

// These are contributor/process conventions, not reader-facing product
// documentation -- kept on a separate page from /docs/guidelines so the
// two audiences (people using Contour vs. people building it) never mix.
export default function ContributingPage() {
  return (
    <div className="flex flex-col gap-(--gap-section)">
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Contributing
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Process conventions that apply when adding or changing a component in this codebase.
          These are internal engineering rules, distinct from the reader-facing rules on the{" "}
          <DocsCode>Guidelines</DocsCode> page.
        </Text>
        <DocsCallout kind="note">
          This page is for people contributing code to Contour, not for people consuming the
          component library. If you&apos;re looking for design rules, see Guidelines instead.
        </DocsCallout>
      </header>

      <DocsSection id="doc-format" title="Component File Structure">
        <DocsSubsection id="rule-7-1" title="One implementation, one stories file, one export" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Every component ships with exactly three files:{" "}
            <DocsCode>&lt;name&gt;.tsx</DocsCode> (implementation),{" "}
            <DocsCode>&lt;name&gt;.stories.tsx</DocsCode> (Ladle previews, co-located), and{" "}
            <DocsCode>index.ts</DocsCode> (public export). Separate long-form documentation files
            are not created alongside components — this page and the rest of{" "}
            <DocsCode>/docs</DocsCode> are the documentation surface instead.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-7-2" title="Stories must cover all states" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Each <DocsCode>.stories.tsx</DocsCode> must include separate stories for: default, each
            major variant, disabled, loading (when applicable), and at least one story demonstrating
            different size-class behavior (if the component adapts).
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-7-3" title="Anatomy and token notes belong in story descriptions">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Ladle story metadata (JSDoc / <DocsCode>meta.parameters.docs.description</DocsCode>) is
            the place for concise anatomy notes — which tokens the component uses, which design
            principle applies. This keeps implementation notes close to the code without a separate
            long document.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-7-4" title="At least one Do / Don't pair per component" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Every component&apos;s <DocsCode>/docs/components/[slug]</DocsCode> page must include at
            least one Do / Don&apos;t example pair. Priority components for this are those most
            likely to be misused: Sheet, Button (destructive role), Dropdown, Alert, and any
            component with a non-obvious semantic constraint.
          </Text>
        </DocsSubsection>

        <DocsSubsection id="rule-7-5" title="Tests ship with the component, not after" badge="required">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            <DocsCode>&lt;name&gt;.test.tsx</DocsCode> is created at the same time as the
            component. Minimum coverage: render without error, each major variant, keyboard
            interaction (Tab / Enter / Space / Escape). Tests that are &ldquo;added later&rdquo; are
            tests that are never added.
          </Text>
        </DocsSubsection>
      </DocsSection>
    </div>
  );
}
