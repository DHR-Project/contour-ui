@AGENTS.md
@CLAUDE.local.md

# Contour Development Guidelines

## Build and Test Commands
- Run development server (Next.js): `pnpm dev`
- Run development preview (Ladle serve): `pnpm ladle`
- Run tests (Vitest): `pnpm test`
- Run linter (ESLint): `pnpm lint`
- Build production bundle: `pnpm build`

## Code Style Rules
- All code comments and documentation must be written in English only. No exceptions.
- Do not use emojis in code or comments.
- Never reference trademarked brands, specific operating systems, or proprietary design guidelines (e.g. do not refer to specific commercial platform guidelines, fruit-themed companies, or custom OS names). Use neutral, platform-agnostic wording instead (e.g. "native-feeling", "adaptive", "system colors", "size-classes").
- Docs pages (`app/docs/**`) must be built from library UI components in `components/ui` and `components/docs` (e.g., `Text`, layout primitives) rather than raw HTML/Tailwind styling where a matching component exists. Scan and sweep docs pages when new components ship to update raw markup.
- This is a reusable component library: when wrapping third-party primitives (e.g., Radix UI), expose their full capability instead of narrowing to today's specific use case (e.g., `Slider` must accept `value`/`defaultValue` as a number or an array of numbers to support multi-thumb setups).

## Design & Token Guidelines (local-docs source of truth)
- **Semantic-Only Access**: Never reference base color variables (e.g. `--color-blue`) or raw hex values directly. Use semantic tokens (e.g., `--tint`, `--label-primary`, `--bg-primary`, `--fill-secondary`).
- **Dark Mode**: Maintain dark mode via CSS variables inside the `.dark` class. Do not use conditional JavaScript logic inside component code to select colors based on active theme.
- **Spacing**: Use `rem` for typography sizing, and `px` for layout padding, spacing, and radius based on the 4pt grid system.
  - *Fixed Spacing*: Gaps associated with reading flow and density (e.g. text-to-icon gap `--gap-icon-text`, item separator) remain constant.
  - *Responsive Spacing*: Gaps associated with layout boundaries and gutters (e.g. page margins `--inset-grouped-margin-x`) scale with size-classes.
- **Depth through Material**: Create spatial depth using frosted glass overlays (`--material-*`) and semantic background layers, minimizing drop-shadow usage.
- **Layout primitives**: Compose layouts with `Flex`, `Grid`, `Stack`, and `Container`.
  - *Flex Container Gotcha*: `Flex` and `Stack` default to `container={true}` (scoped `container-type: inline-size`). When composing internal layout rows/columns inside custom components, explicitly set `container={false}` to avoid layout compression.
- **Input Modality & Interactive States**:
  - *Hover states*: Define standard interaction states (`default`, `hover`, `active`, `focus-visible`, `disabled`). Hover states must only be enabled for fine pointing devices: `@media (hover: hover) and (pointer: fine)`.
  - *Touch target*: Interactive targets should ideally reach 44px when coarse pointer is detected (`pointer: coarse`). The absolute target floor must be 24px (AA requirement). Use centered `before:` absolute pseudo-elements to expand target areas without modifying physical layout dimensions. Vùng chạm includes the control label.
  - *Spring motion*: Use physical spring transitions (`gentle`, `snappy`, `smooth`) rather than ease curves, except when actively dragging.
  - *CSS transitions*: For overlay elements (Dropdowns, Tooltips) that mount/unmount outside React rendering cycles, use CSS `@keyframes` animations rather than Framer Motion to prevent exit animation conflicts.
- **SSR Safety**: Do not trigger synchronous state updates in `useEffect` during initial render (e.g., loading settings from `localStorage`). Use `useSyncExternalStore` for external state synchronization.
