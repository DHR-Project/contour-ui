import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// tailwind-merge doesn't know about our custom `@theme` scale names (they
// aren't Tailwind's built-in xs/sm/base/lg/... or normal/medium/bold/...),
// so without this, unrecognized `text-*`/`font-*` class names fall through
// to the wrong conflict group (e.g. "text-body" getting treated as a text
// color and silently dropped when paired with "text-label-primary").
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
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
      "font-weight": ["regular"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
