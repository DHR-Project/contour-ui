"use client";

import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon/icon.types";
import { Label } from "@/components/ui/label";
import { Segmented, type SegmentedOption } from "@/components/ui/segmented";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { Divider } from "@/components/ui/divider";
import { usePreferences, type Theme } from "@/components/providers/preferences-provider";

function ThemeOptionLabel({ icon, label }: { icon: IconName; label: string }) {
  return (
    <span title={label} className="flex items-center justify-center">
      <Icon name={icon} size={16} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

const themeOptions: SegmentedOption[] = [
  { value: "light", label: <ThemeOptionLabel icon="sun" label="Light" /> },
  { value: "dark", label: <ThemeOptionLabel icon="moon" label="Dark" /> },
  { value: "system", label: <ThemeOptionLabel icon="monitor" label="System" /> },
];

/**
 * Appearance controls surfaced at the bottom of the docs nav. Both settings
 * are global (components/providers/preferences-provider.tsx applies them to
 * the whole document, not just the docs section), so this doubles as the
 * one place in the app a visitor can reach them.
 */
export function DocsNavPreferences() {
  const { theme, setTheme, motionPreference, setMotionPreference } = usePreferences();
  const reducesMotion = motionPreference === "reduce";

  return (
    <VStack gap="4">
      <Divider />

      <VStack gap="2" className="px-3">
        <Text as="span" variant="caption2" color="tertiary" className="font-semibold tracking-wide uppercase">
          Theme
        </Text>
        <Segmented
          size="sm"
          aria-label="Theme"
          options={themeOptions}
          value={theme}
          onValueChange={(value) => setTheme(value as Theme)}
        />
      </VStack>

      <Label className="px-3">
        <HStack justify="between" align="center" gap="3">
          <VStack gap="0">
            <Text as="span" variant="subheadline">
              Reduce motion
            </Text>
            <Text as="span" variant="caption2" color="tertiary">
              Turns off animations app-wide
            </Text>
          </VStack>
          <Switch
            size="sm"
            checked={reducesMotion}
            onCheckedChange={(checked) => setMotionPreference(checked ? "reduce" : "no-reduce")}
          />
        </HStack>
      </Label>
    </VStack>
  );
}
