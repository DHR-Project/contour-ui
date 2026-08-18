<title>Contour UI</title>

Contour is a design system with 33 real, importable React components (plus compound subparts like `ListItem`/`ListItemContent`, `SheetHeader`/`SheetContent`) built on Tailwind CSS v4 utilities and CSS custom-property design tokens. No wrapping provider is required — dark mode, tint color, and accessibility overrides are plain DOM classes/CSS variables set on `<html>` (`.dark`, `--tint`, `.reduce-transparency`, `.reduce-motion`, `.high-contrast`), not React context. Components load as a browser global, not an npm import — see Loading below.

## Loading

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Then destructure off `window.Contour`:

```jsx
const { Card, HStack, VStack, Avatar, Text, Badge, Button } = window.Contour;
```

## Styling idiom: semantic Tailwind utilities + token custom properties

Never use raw hex values, arbitrary colors, or Tailwind's default gray/blue/etc scale — and note that **only utility classes already used somewhere in Contour's own source ship in `styles.css`** (this is a static stylesheet, not a live compiler), so stick to the verified list below rather than guessing at a plausible-looking class name.

**1. Color utilities that exist and are safe to use directly:**
`text-label-primary` `text-label-secondary` `text-label-tertiary` `text-label-quaternary` `bg-bg-primary` `bg-bg-secondary` `bg-bg-tertiary` `bg-fill-secondary` `bg-fill-tertiary` `bg-fill-quaternary` `bg-separator` `border-separator` `bg-tint` `text-tint` `bg-destructive` `border-destructive`. `bg-tint` is the user's chosen accent — default to it for interactive emphasis instead of a hardcoded color.

**2. Status colors and the 12 accent hues (red/orange/yellow/green/mint/teal/cyan/blue/indigo/purple/pink/brown) have no pre-generated utility class** — Contour's own components apply these dynamically via inline style, not Tailwind classes, since the color is chosen at runtime from a prop. Do the same: `style={{ color: 'rgb(var(--color-success))' }}` or `style={{ backgroundColor: 'rgb(var(--color-warning))' }}`. Prefer reaching for a component's own `color`/`variant`/`role` prop (e.g. `Badge`'s `color`, `Progress`'s `color`, `Button`'s `role="destructive"`) over hand-rolling one of these — the component already handles it correctly.

**3. Radius** is a native Tailwind theme scale here — plain utilities work: `rounded-xs` `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` `rounded-2xl` `rounded-full`.

**4. Spacing** uses the CSS-variable arbitrary-value syntax, confirmed present in the shipped CSS: `gap-(--space-N)` for N in 1,2,3,4,5,6,7,8,10,12,16,20 (e.g. `gap-(--space-4)`), plus `p-`/`px-`/`py-`/`m-`/`mb-` etc. with the same tokens. Semantic variants: `gap-(--gap-section)`, `px-(--padding-control-x)`, `py-(--padding-control-y)`.

Layout primitives (`Flex`, `Grid`, `Stack`/`HStack`/`VStack`, `Container`) take `gap` as a **prop** (`gap="3"`, plain space-scale key as a string), not a className.

## Where the truth lives

- `styles.css` (root) — the one stylesheet to link; it `@import`s tokens, fonts, and component styles. Grep it before trusting any class name not in the list above.
- Each component's own `.d.ts` in `components/<group>/<Name>/` — the real prop contract, already verified against source.
- Each component's `.prompt.md` — usage notes, anatomy, states, do/don't pairs sourced from Contour's own design spec.

## Example: a realistic composed screen fragment

```jsx
const { Card, HStack, VStack, Avatar, Text, Badge, Button } = window.Contour;

function NotificationRow() {
  return (
    <Card elevation="flat">
      <HStack gap="3" align="center" justify="between">
        <HStack gap="3" align="center">
          <Avatar name="Alice Johnson" size="md" />
          <VStack gap="0">
            <Text textStyle="body" weight="medium">Alice Johnson</Text>
            <Text textStyle="footnote" color="secondary">Reviewed your pull request</Text>
          </VStack>
        </HStack>
        <HStack gap="2" align="center">
          <Badge count={3} />
          <Button variant="tinted" size="sm">View</Button>
        </HStack>
      </HStack>
    </Card>
  );
}
```

## A few components with no controllable open state

`Dropdown`, `Tooltip`, and `ContextMenu` manage their open/closed state internally — there's no `open`/`defaultOpen` prop. Compose them as `<Dropdown items={[...]}><Button>Trigger label</Button></Dropdown>` and trust the real interaction to open them; don't try to force an "open" visual state via props.
