"use client";

import { useId } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import {
  useContourPreferences,
  TINT_COLORS,
  type TintColor,
  type ThemeMode,
} from "@/components/contour-provider";
import type { SizeMode } from "@/lib/typography/scale";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Flex } from "@/components/ui/flex";
import { VStack } from "@/components/ui/stack";
import { Switch } from "@/components/ui/switch";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Slider } from "@/components/ui/slider";
import { Icon } from "@/components/icon";
import type { IconName } from "@/components/icon";
import { DocsSection, DocsSubsection } from "@/components/docs/docs-ui";

// Ordered to match lib/typography/scale.ts's SizeMode -- the Slider walks
// this array by index since sizeMode itself is a named scale, not a number.
const SIZE_MODES: SizeMode[] = [
  "xSmall",
  "small",
  "medium",
  "large",
  "xLarge",
  "xxLarge",
  "xxxLarge",
  "ax1",
  "ax2",
  "ax3",
  "ax4",
  "ax5",
];

const SIZE_MODE_LABEL: Record<SizeMode, string> = {
  xSmall: "Extra Small",
  small: "Small",
  medium: "Medium",
  large: "Large (Default)",
  xLarge: "Extra Large",
  xxLarge: "XX Large",
  xxxLarge: "XXX Large",
  ax1: "Accessibility 1",
  ax2: "Accessibility 2",
  ax3: "Accessibility 3",
  ax4: "Accessibility 4",
  ax5: "Accessibility 5",
};

// Tailwind needs literal class strings to pick these up at build time --
// can't interpolate `bg-[rgb(var(--color-${c}))]` (see rule 2.4 note in
// design-tokens-summary-v2.md re: no dynamic arbitrary-value class names).
const TINT_SWATCH_CLASS: Record<TintColor, string> = {
  red: "bg-[rgb(var(--color-red))]",
  orange: "bg-[rgb(var(--color-orange))]",
  yellow: "bg-[rgb(var(--color-yellow))]",
  green: "bg-[rgb(var(--color-green))]",
  mint: "bg-[rgb(var(--color-mint))]",
  teal: "bg-[rgb(var(--color-teal))]",
  cyan: "bg-[rgb(var(--color-cyan))]",
  blue: "bg-[rgb(var(--color-blue))]",
  indigo: "bg-[rgb(var(--color-indigo))]",
  purple: "bg-[rgb(var(--color-purple))]",
  pink: "bg-[rgb(var(--color-pink))]",
  brown: "bg-[rgb(var(--color-brown))]",
};

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: IconName }[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

// ---------------------------------------------------------------------------
// SettingRow -- label + description on the left, a Switch on the right.
// Hand-rolled (no dedicated list-row component covers this shape yet, see
// DocsBadgeLevel's TODO in docs-ui.tsx for the same situation).
// ---------------------------------------------------------------------------
interface SettingRowProps {
  label: string;
  description: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SettingRow({ label, description, checked, onCheckedChange }: SettingRowProps) {
  const id = useId();
  return (
    <Card as="div" className="flex items-center justify-between gap-(--space-4)">
      <label htmlFor={id} className="flex flex-col gap-1 min-w-0 cursor-pointer">
        <Text as="span" textStyle="body">
          {label}
        </Text>
        <Text as="span" textStyle="footnote" color="secondary">
          {description}
        </Text>
      </label>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} className="shrink-0" />
    </Card>
  );
}

export function SettingsPanel() {
  const {
    theme,
    setTheme,
    resolvedTheme,
    tint,
    setTint,
    sizeMode,
    setSizeMode,
    reduceTransparency,
    setReduceTransparency,
    reduceMotion,
    setReduceMotion,
    highContrast,
    setHighContrast,
  } = useContourPreferences();

  const sizeIndex = SIZE_MODES.indexOf(sizeMode);

  return (
    <div className="flex flex-col gap-(--gap-section)">
      <DocsSection id="appearance" title="Appearance">
        <DocsSubsection id="theme" title="Theme">
          <VStack gap="3">
            <SegmentedControl
              value={theme}
              onValueChange={(value) => setTheme(value as ThemeMode)}
              options={THEME_OPTIONS}
              fullWidth={false}
              // VStack's default items-stretch would otherwise force this
              // to the full parent width even with fullWidth={false} --
              // self-start makes it hug its own (icon + label) content.
              className="self-start"
            />
            <Text textStyle="footnote" color="secondary">
              {theme === "system"
                ? `Following system — currently ${resolvedTheme}.`
                : `Always ${resolvedTheme}.`}
            </Text>
          </VStack>
        </DocsSubsection>

        <DocsSubsection id="tint" title="Color tint">
          <Flex wrap="wrap" gap="3" role="group" aria-label="Color tint">
            {TINT_COLORS.map((color) => {
              const selected = tint === color;
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={color}
                  aria-pressed={selected}
                  onClick={() => setTint(color)}
                  className={cn(
                    "relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-(--duration-fast)",
                    "focus-visible:outline-solid focus-visible:[outline-width:var(--focus-ring-width)] focus-visible:outline-offset-(--focus-ring-offset) focus-visible:outline-[rgb(var(--focus-ring-color))]",
                    selected && "scale-110",
                    TINT_SWATCH_CLASS[color],
                  )}
                >
                  {selected && <Icon name="check" size="sm" decorative className="text-white" />}
                </button>
              );
            })}
          </Flex>
        </DocsSubsection>

        <DocsSubsection id="text-size" title="Text size">
          <VStack gap="4">
            <Slider
              value={sizeIndex}
              min={0}
              max={SIZE_MODES.length - 1}
              step={1}
              onValueChange={(value) => setSizeMode(SIZE_MODES[value as number])}
              thumbLabel="Text size"
              className="max-w-sm"
            />
            <Text textStyle="footnote" color="secondary">
              {SIZE_MODE_LABEL[sizeMode]}
            </Text>
            <Text textStyle="body">The quick brown fox jumps over the lazy dog.</Text>
          </VStack>
        </DocsSubsection>
      </DocsSection>

      <DocsSection id="accessibility" title="Accessibility">
        <VStack gap="3">
          <SettingRow
            label="Reduce Transparency"
            description="Replaces frosted-glass materials with solid backgrounds and turns off background blur."
            checked={reduceTransparency}
            onCheckedChange={setReduceTransparency}
          />
          <SettingRow
            label="Reduce Motion"
            description="Replaces spring and scale animations with simple fades, and sets transition durations to zero."
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
          />
          <SettingRow
            label="Increase Contrast"
            description="Strengthens separators, secondary text, and icon stroke width for better legibility."
            checked={highContrast}
            onCheckedChange={setHighContrast}
          />
        </VStack>
      </DocsSection>
    </div>
  );
}
