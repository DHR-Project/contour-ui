import { Text } from "@/components/ui/text";
import { VStack, HStack } from "@/components/ui/stack";
import { Grid } from "@/components/ui/grid";
import { DocsPage } from "@/components/docs/docs-page";
import { ColorSwatch, LabelSwatch, ShadeSwatch } from "@/components/docs/token-swatch";
import { ImageBackdrop } from "@/components/docs/image-backdrop";

const basePalette = [
  "bg-system-blue",
  "bg-system-green",
  "bg-system-indigo",
  "bg-system-orange",
  "bg-system-pink",
  "bg-system-purple",
  "bg-system-red",
  "bg-system-teal",
  "bg-system-yellow",
];

const grayPalette = [
  "bg-system-gray-1",
  "bg-system-gray-2",
  "bg-system-gray-3",
  "bg-system-gray-4",
  "bg-system-gray-5",
  "bg-system-gray-6",
];

const shadeSteps = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];

// Written out literally (not built via template string) so Tailwind's
// static scanner can see every class name and generate the matching CSS -
// a class name assembled at runtime (`bg-system-${hue}-${step}`) never
// appears as literal text in this file, so it would silently produce no CSS.
const shadeScale: Record<string, Record<string, string>> = {
  blue: {
    "50": "bg-system-blue-50",
    "100": "bg-system-blue-100",
    "200": "bg-system-blue-200",
    "300": "bg-system-blue-300",
    "400": "bg-system-blue-400",
    "500": "bg-system-blue",
    "600": "bg-system-blue-600",
    "700": "bg-system-blue-700",
    "800": "bg-system-blue-800",
    "900": "bg-system-blue-900",
  },
  green: {
    "50": "bg-system-green-50",
    "100": "bg-system-green-100",
    "200": "bg-system-green-200",
    "300": "bg-system-green-300",
    "400": "bg-system-green-400",
    "500": "bg-system-green",
    "600": "bg-system-green-600",
    "700": "bg-system-green-700",
    "800": "bg-system-green-800",
    "900": "bg-system-green-900",
  },
  indigo: {
    "50": "bg-system-indigo-50",
    "100": "bg-system-indigo-100",
    "200": "bg-system-indigo-200",
    "300": "bg-system-indigo-300",
    "400": "bg-system-indigo-400",
    "500": "bg-system-indigo",
    "600": "bg-system-indigo-600",
    "700": "bg-system-indigo-700",
    "800": "bg-system-indigo-800",
    "900": "bg-system-indigo-900",
  },
  orange: {
    "50": "bg-system-orange-50",
    "100": "bg-system-orange-100",
    "200": "bg-system-orange-200",
    "300": "bg-system-orange-300",
    "400": "bg-system-orange-400",
    "500": "bg-system-orange",
    "600": "bg-system-orange-600",
    "700": "bg-system-orange-700",
    "800": "bg-system-orange-800",
    "900": "bg-system-orange-900",
  },
  pink: {
    "50": "bg-system-pink-50",
    "100": "bg-system-pink-100",
    "200": "bg-system-pink-200",
    "300": "bg-system-pink-300",
    "400": "bg-system-pink-400",
    "500": "bg-system-pink",
    "600": "bg-system-pink-600",
    "700": "bg-system-pink-700",
    "800": "bg-system-pink-800",
    "900": "bg-system-pink-900",
  },
  purple: {
    "50": "bg-system-purple-50",
    "100": "bg-system-purple-100",
    "200": "bg-system-purple-200",
    "300": "bg-system-purple-300",
    "400": "bg-system-purple-400",
    "500": "bg-system-purple",
    "600": "bg-system-purple-600",
    "700": "bg-system-purple-700",
    "800": "bg-system-purple-800",
    "900": "bg-system-purple-900",
  },
  red: {
    "50": "bg-system-red-50",
    "100": "bg-system-red-100",
    "200": "bg-system-red-200",
    "300": "bg-system-red-300",
    "400": "bg-system-red-400",
    "500": "bg-system-red",
    "600": "bg-system-red-600",
    "700": "bg-system-red-700",
    "800": "bg-system-red-800",
    "900": "bg-system-red-900",
  },
  teal: {
    "50": "bg-system-teal-50",
    "100": "bg-system-teal-100",
    "200": "bg-system-teal-200",
    "300": "bg-system-teal-300",
    "400": "bg-system-teal-400",
    "500": "bg-system-teal",
    "600": "bg-system-teal-600",
    "700": "bg-system-teal-700",
    "800": "bg-system-teal-800",
    "900": "bg-system-teal-900",
  },
  yellow: {
    "50": "bg-system-yellow-50",
    "100": "bg-system-yellow-100",
    "200": "bg-system-yellow-200",
    "300": "bg-system-yellow-300",
    "400": "bg-system-yellow-400",
    "500": "bg-system-yellow",
    "600": "bg-system-yellow-600",
    "700": "bg-system-yellow-700",
    "800": "bg-system-yellow-800",
    "900": "bg-system-yellow-900",
  },
};

const shadeHues = Object.keys(shadeScale);

const labelTokens = [
  "text-label-primary",
  "text-label-secondary",
  "text-label-tertiary",
  "text-label-quaternary",
];

const backgroundTokens = [
  "bg-bg-primary",
  "bg-bg-secondary",
  "bg-bg-tertiary",
  "bg-bg-grouped-primary",
  "bg-bg-grouped-secondary",
];

const fillTokens = ["bg-fill-primary", "bg-fill-secondary", "bg-fill-tertiary", "bg-fill-quaternary"];

const separatorTokens = ["bg-separator", "bg-separator-opaque"];

const stateTokens = ["bg-tint", "bg-destructive", "bg-success", "bg-warning"];

const materialTokens = ["material-thin", "material-regular", "material-thick"];

const toc = [
  { id: "base-palette", title: "Base palette" },
  { id: "shade-scale", title: "Shade scale" },
  { id: "label", title: "Label" },
  { id: "background", title: "Background" },
  { id: "fill", title: "Fill" },
  { id: "material", title: "Material" },
  { id: "separator", title: "Separator" },
  { id: "tint-state", title: "Tint & state" },
];

export default function ColorDocsPage() {
  return (
    <DocsPage toc={toc}>
      <VStack gap="10">
        <VStack gap="2">
          <Text variant="largeTitle">Color</Text>
          <Text variant="body" color="secondary">
            The color tokens defined in styles/tokens.css - base palette, its derived shade scale,
            and the semantic layer built on top. Components should only consume semantic tokens -
            never the base palette directly.
          </Text>
        </VStack>

        <VStack id="base-palette" gap="3" className="scroll-mt-6">
          <Text variant="title2">Base palette</Text>
          <Text variant="footnote" color="tertiary">
            Raw color values. Not for direct use in components - map to a semantic token first.
          </Text>
          <Grid columns={{ base: "3", regular: "5" }} gap="4">
            {basePalette.map((className) => (
              <ColorSwatch key={className} className={className} />
            ))}
          </Grid>
          <Grid columns={{ base: "3", regular: "6" }} gap="4">
            {grayPalette.map((className) => (
              <ColorSwatch key={className} className={className} />
            ))}
          </Grid>
        </VStack>

        <VStack id="shade-scale" gap="3" className="scroll-mt-6">
          <Text variant="title2">Shade scale</Text>
          <Text variant="footnote" color="tertiary">
            Each hue mixed toward white (below 500) or black (above 500). 500 is the base
            color itself. Derived automatically per mode - hover a step to see its value.
          </Text>
          <VStack gap="4" className="rounded-lg border border-separator p-6">
            {shadeHues.map((hue) => (
              <VStack key={hue} gap="2">
                <Text as="span" variant="caption1" color="tertiary" className="font-mono">
                  {hue}
                </Text>
                <HStack gap="1">
                  {shadeSteps.map((step) => (
                    <ShadeSwatch key={step} step={step} className={shadeScale[hue][step]} />
                  ))}
                </HStack>
              </VStack>
            ))}
          </VStack>
        </VStack>

        <VStack id="label" gap="3" className="scroll-mt-6">
          <Text variant="title2">Label</Text>
          <Text variant="footnote" color="tertiary">
            Text color, from most to least emphasis.
          </Text>
          <Grid columns={{ base: "2", regular: "4" }} gap="4">
            {labelTokens.map((className) => (
              <LabelSwatch key={className} className={className} />
            ))}
          </Grid>
        </VStack>

        <VStack id="background" gap="3" className="scroll-mt-6">
          <Text variant="title2">Background</Text>
          <Text variant="footnote" color="tertiary">
            Opaque - fully covers whatever is behind it. Placed over a photo below, none of
            it shows through any swatch.
          </Text>
          <ImageBackdrop seed="background" className="rounded-lg p-4">
            <Grid columns={{ base: "2", regular: "3" }} gap="4">
              {backgroundTokens.map((className) => (
                <ColorSwatch key={className} className={className} size="lg" />
              ))}
            </Grid>
          </ImageBackdrop>
        </VStack>

        <VStack id="fill" gap="3" className="scroll-mt-6">
          <Text variant="title2">Fill</Text>
          <Text variant="footnote" color="tertiary">
            Semi-transparent, meant to sit on top of a background layer. Placed over the same
            photo, it shows through each swatch - more so at lower emphasis.
          </Text>
          <ImageBackdrop seed="fill" className="rounded-lg p-4">
            <Grid columns={{ base: "2", regular: "3" }} gap="4">
              {fillTokens.map((className) => (
                <ColorSwatch key={className} className={className} size="lg" />
              ))}
            </Grid>
          </ImageBackdrop>
        </VStack>

        <VStack id="material" gap="3" className="scroll-mt-6">
          <Text variant="title2">Material</Text>
          <Text variant="footnote" color="tertiary">
            Frosted glass, for nav bars and sheets. Unlike Fill above, a material is never
            just a color - material-thin/regular/thick are utility classes (see
            app/globals.css) that always bundle a translucent background with
            backdrop-filter: blur(20px) in one class. Placed over the same striped pattern,
            the stripes behind each swatch soften instead of just tinting through.
          </Text>
          <ImageBackdrop variant="pattern" className="rounded-lg p-4">
            <Grid columns={{ base: "2", regular: "3" }} gap="4">
              {materialTokens.map((className) => (
                <ColorSwatch key={className} className={className} size="lg" />
              ))}
            </Grid>
          </ImageBackdrop>
        </VStack>

        <VStack id="separator" gap="3" className="scroll-mt-6">
          <Text variant="title2">Separator</Text>
          <Grid columns={{ base: "2", regular: "4" }} gap="4">
            {separatorTokens.map((className) => (
              <ColorSwatch key={className} className={className} />
            ))}
          </Grid>
        </VStack>

        <VStack id="tint-state" gap="3" className="scroll-mt-6">
          <Text variant="title2">Tint & state</Text>
          <Grid columns={{ base: "2", regular: "4" }} gap="4">
            {stateTokens.map((className) => (
              <ColorSwatch key={className} className={className} />
            ))}
          </Grid>
        </VStack>
      </VStack>
    </DocsPage>
  );
}
