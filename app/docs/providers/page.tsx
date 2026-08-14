import type { Metadata } from "next";
import Link from "next/link";
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

export const metadata: Metadata = {
  title: "Providers",
  description:
    "ContourProvider and the useContourPreferences hook — theme, tint, size mode, and accessibility state shared across the component tree, plus the override providers used for docs previews.",
};

export default function ProvidersPage() {
  return (
    <div className="flex flex-col gap-(--gap-section)">
      {/* Page header */}
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Providers
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          <DocsCode>ContourProvider</DocsCode> wraps the app once at the root and makes theme, tint,
          Dynamic Type size, and accessibility preferences available to every component underneath
          it. A small set of override providers alongside it let a subtree pin a single hook&apos;s
          value for previews and tests.
        </Text>
      </header>

      {/* ContourProvider */}
      <DocsSection id="contour-provider" title="ContourProvider">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Mount once near the root of the app (<DocsCode>app/layout.tsx</DocsCode>). It reads every
          preference directly from <DocsCode>localStorage</DocsCode> via{" "}
          <DocsCode>useSyncExternalStore</DocsCode> — never from local component state — so there is
          no setState-during-effect render cascade on mount, and preferences changed in one part of
          the tree are reflected everywhere else immediately (guideline SSR-safety rule).
        </Text>

        <DocsCodeBlock lang="tsx" copyable>{`import { ContourProvider } from "@/components/contour-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ContourProvider>{children}</ContourProvider>
      </body>
    </html>
  );
}`}</DocsCodeBlock>

        <DocsCallout kind="warning">
          <strong>Pair it with a FOUC-prevention script.</strong> Persisted preferences only apply
          once <DocsCode>ContourProvider</DocsCode>&apos;s effects run after hydration. To avoid a
          flash of the wrong theme/tint on load, run an inline{" "}
          <DocsCode>beforeInteractive</DocsCode> script that applies the same{" "}
          <DocsCode>localStorage</DocsCode> keys to <DocsCode>&lt;html&gt;</DocsCode> before React
          hydrates — see the <DocsCode>themeInitScript</DocsCode> in{" "}
          <DocsCode>app/layout.tsx</DocsCode>. Keep the two in sync: any key{" "}
          <DocsCode>ContourProvider</DocsCode> reads must also be applied there.
        </DocsCallout>

        <DocsSubsection id="contour-provider-props" title="Props">
          <DocsTable
            caption="ContourProvider props"
            columns={[
              { key: "name", label: "Prop", width: "140px" },
              { key: "type", label: "Type", width: "160px" },
              { key: "default", label: "Default", width: "100px" },
              { key: "description", label: "Description" },
            ]}
            rows={[
              {
                name: <DocsCode>sizeMode</DocsCode>,
                type: <DocsCode>SizeMode</DocsCode>,
                default: <DocsCode>&quot;large&quot;</DocsCode>,
                description:
                  "Fallback Dynamic Type level used when nothing is persisted yet. The default matches the SSR-safe baseline baked into styles/tokens.css, so there is no flash on first visit.",
              },
              {
                name: <DocsCode>children</DocsCode>,
                type: <DocsCode>ReactNode</DocsCode>,
                default: "—",
                description: "The app tree that should see the shared preference context.",
              },
            ]}
          />
        </DocsSubsection>

        <DocsSubsection id="contour-provider-persisted-state" title="Persisted state">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Each preference is backed by its own <DocsCode>localStorage</DocsCode> key. Writes go
            through a shared <DocsCode>writeAndNotify</DocsCode> helper that also dispatches a{" "}
            <DocsCode>contour-preference-change</DocsCode> event on <DocsCode>window</DocsCode> —
            the signal every consuming hook (<DocsCode>useReducedMotion</DocsCode>,{" "}
            <DocsCode>useReduceTransparency</DocsCode>) listens for, since the native{" "}
            <DocsCode>storage</DocsCode> event only fires in other tabs, never the one that made the
            change.
          </Text>
          <DocsTable
            caption="ContourProvider context value"
            columns={[
              { key: "name", label: "Field", width: "200px" },
              { key: "type", label: "Type" },
            ]}
            rows={[
              { name: <DocsCode>sizeMode / setSizeMode</DocsCode>, type: <DocsCode>SizeMode</DocsCode> },
              { name: <DocsCode>theme / setTheme</DocsCode>, type: <DocsCode>&quot;light&quot; | &quot;dark&quot; | &quot;system&quot;</DocsCode> },
              {
                name: <DocsCode>resolvedTheme</DocsCode>,
                type: <DocsCode>&quot;light&quot; | &quot;dark&quot;</DocsCode>,
              },
              { name: <DocsCode>tint / setTint</DocsCode>, type: <DocsCode>TintColor</DocsCode> },
              {
                name: <DocsCode>reduceTransparency / setReduceTransparency</DocsCode>,
                type: <DocsCode>boolean</DocsCode>,
              },
              {
                name: <DocsCode>reduceMotion / setReduceMotion</DocsCode>,
                type: <DocsCode>boolean</DocsCode>,
              },
              {
                name: <DocsCode>highContrast / setHighContrast</DocsCode>,
                type: <DocsCode>boolean</DocsCode>,
              },
            ]}
          />
          <Text textStyle="footnote" color="secondary" className="max-w-prose">
            <DocsCode>resolvedTheme</DocsCode> is <DocsCode>theme</DocsCode> resolved against
            <DocsCode>prefers-color-scheme</DocsCode> when <DocsCode>theme</DocsCode> is
            <DocsCode>&quot;system&quot;</DocsCode> — read this instead of{" "}
            <DocsCode>theme</DocsCode> whenever the actual light/dark value in effect matters.{" "}
            <DocsCode>tint</DocsCode> is always one of the 12 base system colors — see{" "}
            <Link href="/docs/tokens" className="underline underline-offset-2">
              Tokens
            </Link>
            .
          </Text>
        </DocsSubsection>

        <DocsSubsection id="use-contour-preferences" title="useContourPreferences">
          <Text textStyle="body" color="secondary" className="max-w-prose">
            Reads the context value set up by <DocsCode>ContourProvider</DocsCode>. Outside of a
            provider it falls back to the same defaults <DocsCode>ContourProvider</DocsCode> itself
            starts from, rather than throwing — safe to call from any component, including ones
            rendered in isolation (Ladle stories, tests).
          </Text>
          <DocsCodeBlock lang="tsx" copyable>{`import { useContourPreferences } from "@/components/contour-provider";

function AppearanceMenu() {
  const { theme, setTheme, tint, setTint } = useContourPreferences();
  // ...
}`}</DocsCodeBlock>
        </DocsSubsection>

        <DocsCallout kind="tip">
          The <Link href="/docs/settings" className="underline underline-offset-2">Settings</Link>{" "}
          page is a live, working example of every field above wired up to real controls.
        </DocsCallout>
      </DocsSection>

      {/* Override providers */}
      <DocsSection id="override-providers" title="Override providers">
        <Text textStyle="body" color="secondary" className="max-w-prose">
          Two narrow providers let a subtree pin one hook&apos;s value regardless of the real device
          — used by docs previews and stories to demonstrate compact/regular or touch/mouse
          behavior without resizing the window or emulating a device. Neither one is part of the
          app-wide setup; mount them only around the specific preview that needs a fixed value. See{" "}
          <Link href="/docs/hooks" className="underline underline-offset-2">
            Hooks
          </Link>{" "}
          for the hooks they pair with.
        </Text>

        <DocsTable
          caption="Override providers"
          columns={[
            { key: "name", label: "Provider", width: "220px" },
            { key: "pairs", label: "Pairs with", width: "180px" },
            { key: "value", label: "value prop" },
          ]}
          rows={[
            {
              name: <DocsCode>SizeClassOverrideProvider</DocsCode>,
              pairs: <DocsCode>useSizeClass()</DocsCode>,
              value: <DocsCode>SizeClass</DocsCode>,
            },
            {
              name: <DocsCode>CoarsePointerOverrideProvider</DocsCode>,
              pairs: <DocsCode>useIsCoarsePointer()</DocsCode>,
              value: <DocsCode>boolean</DocsCode>,
            },
          ]}
        />

        <DocsCodeBlock lang="tsx" copyable>{`import { SizeClassOverrideProvider } from "@/lib/hooks/use-size-class";

<SizeClassOverrideProvider value="compact">
  <TabBar items={items} />
</SizeClassOverrideProvider>`}</DocsCodeBlock>

        <DoDontPair
          do={
            <Text textStyle="footnote">
              Wrap only the demo/preview subtree that needs a fixed value, as{" "}
              <DocsCode>SizeClassPreview</DocsCode> does around a single component demo.
            </Text>
          }
          dont={
            <Text textStyle="footnote">
              Mount an override provider near the app root. It permanently disconnects every
              descendant from the real viewport/pointer, which is only ever correct for an isolated
              preview.
            </Text>
          }
        />
      </DocsSection>
    </div>
  );
}
