import type { Metadata } from "next";
import { SettingsPanel } from "@/components/docs/settings-panel";
import { Text } from "@/components/ui/text";
import { DocsCode } from "@/components/docs/docs-ui";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Live appearance and accessibility preferences for the Contour docs site — theme, color tint, text size, reduce transparency, reduce motion, and increase contrast.",
};

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-(--gap-section)">
      <header className="flex flex-col gap-(--space-3)">
        <Text as="h1" textStyle="large-title" weight="semibold">
          Settings
        </Text>
        <Text textStyle="body" color="secondary" className="max-w-prose">
          These preferences are backed by <DocsCode>ContourProvider</DocsCode> and persist in{" "}
          <DocsCode>localStorage</DocsCode> — changes apply immediately across this docs site.
        </Text>
      </header>
      <SettingsPanel />
    </div>
  );
}
