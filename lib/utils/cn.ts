import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const systemHues = [
  "blue",
  "green",
  "indigo",
  "orange",
  "pink",
  "purple",
  "red",
  "teal",
  "yellow",
] as const;
const shadeSteps = [50, 100, 200, 300, 400, 600, 700, 800, 900] as const;

// e.g. "system-blue-50", "system-blue-100", ... for every hue x step.
const systemShadeClasses = systemHues.flatMap((hue) =>
  shadeSteps.map((step) => `system-${hue}-${step}`),
);

/**
 * tailwind-merge does not know about the custom theme scales registered in
 * app/globals.css (@theme inline). Without this, it cannot tell that
 * `text-large-title` is a font-size utility and `text-label-primary` is a
 * text-color utility, so it treats them as conflicting and drops one - see
 * the Text component's type scale silently collapsing to a single size.
 * Registering the scales below tells it which group each class belongs to.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "large-title",
            "title-1",
            "title-2",
            "title-3",
            "headline",
            "body",
            "callout",
            "subheadline",
            "footnote",
            "caption-1",
            "caption-2",
          ],
        },
      ],
      "text-color": [
        {
          text: [
            "label-primary",
            "label-secondary",
            "label-tertiary",
            "label-quaternary",
            "tint",
            "destructive",
            "success",
            "warning",
          ],
        },
      ],
      "bg-color": [
        {
          bg: [
            "label-primary",
            "label-secondary",
            "label-tertiary",
            "label-quaternary",
            "bg-primary",
            "bg-secondary",
            "bg-tertiary",
            "bg-grouped-primary",
            "bg-grouped-secondary",
            "fill-primary",
            "fill-secondary",
            "fill-tertiary",
            "fill-quaternary",
            "separator",
            "separator-opaque",
            "tint",
            "destructive",
            "success",
            "warning",
            "system-blue",
            "system-green",
            "system-indigo",
            "system-orange",
            "system-pink",
            "system-purple",
            "system-red",
            "system-teal",
            "system-yellow",
            "system-gray-1",
            "system-gray-2",
            "system-gray-3",
            "system-gray-4",
            "system-gray-5",
            "system-gray-6",
            ...systemShadeClasses,
          ],
        },
      ],
      // material-* is a custom @utility (see app/globals.css) bundling a
      // background with a backdrop blur - not part of the bg-color group
      // (its class name has no bg- prefix), so it needs its own group to
      // dedupe correctly if two material classes are ever composed.
      "backdrop-filter": [{ material: ["thin", "regular", "thick"] }],
      "border-color": [{ border: ["separator", "separator-opaque", "tint", "destructive"] }],
      "ring-color": [{ ring: ["tint", "destructive"] }],
    },
  },
});

/**
 * Merges class names shadcn/ui-style: clsx handles conditionals,
 * tailwind-merge resolves duplicate/conflicting Tailwind classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
