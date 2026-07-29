/**
 * Responsive prop resolution shared by the layout primitives (Flex, Stack,
 * Grid). Every responsive prop on those components accepts either a plain
 * value, or an object that varies the value by:
 *
 * - Viewport breakpoint: `regular` / `regularLg` / `regularXl`, matching
 *   the compact/regular size-class system in styles/tokens.css (base
 *   with no key = compact, i.e. mobile-first). These map to Tailwind's
 *   built-in md:/lg:/xl: prefixes, whose default widths (768/1024/1280px)
 *   already line up with --bp-regular/--bp-regular-lg/--bp-regular-xl.
 * - Container breakpoint: `containerSm` / `containerMd` / `containerLg` /
 *   `containerXl`, sized against the nearest ancestor with `container`
 *   enabled (Tailwind's `@container` query) instead of the viewport. Maps
 *   to Tailwind's built-in @sm:/@md:/@lg:/@xl: container query variants.
 *
 * Both kinds can be mixed in the same object - a component can react to
 * viewport size, container size, or both at once.
 */
export interface ResponsiveObject<T extends string> {
  base?: T;
  regular?: T;
  regularLg?: T;
  regularXl?: T;
  containerSm?: T;
  containerMd?: T;
  containerLg?: T;
  containerXl?: T;
}

export type ResponsiveValue<T extends string> = T | ResponsiveObject<T>;

const viewportPrefix = {
  regular: "md:",
  regularLg: "lg:",
  regularXl: "xl:",
} as const satisfies Record<string, string>;

const containerPrefix = {
  containerSm: "@sm:",
  containerMd: "@md:",
  containerLg: "@lg:",
  containerXl: "@xl:",
} as const satisfies Record<string, string>;

/**
 * Resolves a ResponsiveValue against a value -> className lookup map into
 * a space-separated className string.
 *
 * resolveResponsive("row", directionClass) -> "flex-row"
 * resolveResponsive({ base: "column", regular: "row" }, directionClass)
 *   -> "flex-col md:flex-row"
 */
export function resolveResponsive<T extends string>(
  value: ResponsiveValue<T> | undefined,
  classMap: Record<T, string>,
): string {
  if (value === undefined) return "";
  if (typeof value === "string") return classMap[value] ?? "";

  const classes: string[] = [];

  if (value.base) classes.push(classMap[value.base]);

  for (const key of Object.keys(viewportPrefix) as Array<keyof typeof viewportPrefix>) {
    const step = value[key];
    if (step) classes.push(viewportPrefix[key] + classMap[step]);
  }

  for (const key of Object.keys(containerPrefix) as Array<keyof typeof containerPrefix>) {
    const step = value[key];
    if (step) classes.push(containerPrefix[key] + classMap[step]);
  }

  return classes.join(" ");
}
