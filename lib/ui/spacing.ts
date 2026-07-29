/**
 * The gap/spacing scale shared by every layout primitive (Flex, Stack,
 * Grid). Mirrors styles/tokens.css space-1..space-20 - Tailwind's default
 * spacing scale already lines up 1:1 with those px values, so no custom
 * theme registration is needed, just this lookup for the discrete steps
 * the layout components expose.
 */
export type SpacingStep =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "10"
  | "12"
  | "16"
  | "20";

export const gapClass: Record<SpacingStep, string> = {
  "0": "gap-0",
  "1": "gap-1",
  "2": "gap-2",
  "3": "gap-3",
  "4": "gap-4",
  "5": "gap-5",
  "6": "gap-6",
  "7": "gap-7",
  "8": "gap-8",
  "10": "gap-10",
  "12": "gap-12",
  "16": "gap-16",
  "20": "gap-20",
};
