# Contour UI design-sync notes

Repo-specific gotchas and decisions for future syncs. Read this before starting
a re-sync, and append to it whenever a new one is learned.

## Known render warns (checked against these on every re-sync)

- **`Icon` — `[RENDER_THIN]` "mounts have no text and paint nothing".**
  Benign false-positive. `Icon`'s previews (`Colors`/`Sizes`/`Accessible`) render
  real SVG icons with no text content by design, and the render-check's
  text-presence heuristic flags that. The graded cells are confirmed correct
  (screenshots show real icons at real sizes/colors) and `package-capture.mjs`
  reports them `carried forward` on every re-run, meaning the underlying
  render hasn't changed. Safe to ignore this specific warn on future syncs
  unless the actual screenshot changes.

## Components intentionally left on the floor card

- **`Alert` and `Toaster`** — both have a real, correct render (confirmed by
  reading the live DOM directly with a throwaway Playwright script pointed at
  `ds-bundle`), but the visible content only appears ~300-500ms after mount:
  both wrap their entrance in Framer Motion (`AnimatePresence` + `motion.div`
  with an explicit `transition` — `springs.bouncy` for Alert, per-toast spring
  physics for Toaster's stack peek). `.ds-sync/package-capture.mjs`'s
  `settle()` only awaits `document.fonts.ready` and image `decode()`, not
  animation completion, so the capture screenshot is taken mid-animation —
  near-fully transparent, reading as a blank card.
  - Tried and confirmed ineffective: seeding `toast()`/forcing `open` state
    *synchronously during render* (so the item is present at the very first
    commit, not added via a later effect) — content still animates in via its
    own explicit `transition`, so it doesn't help.
  - Tried and confirmed ineffective: wrapping in `<MotionConfig transition=
    {{duration: 0}}>` — an explicit `transition` prop on the individual
    `motion.*` element always overrides the inherited `MotionConfig` default,
    and both components set one explicitly.
  - Not attempted (out of scope for preview authoring): editing
    `alert.tsx`/`toast.tsx` to add a reduced-motion escape hatch, or forking
    `package-capture.mjs`'s `settle()` to wait for animations. Either would
    fix this properly; re-attempt authoring these two if either lands.
  - Any other component built on `AnimatePresence` without `initial={false}`
    plus an explicit per-element `transition` will hit the same wall if
    authored later — check for that pattern before spending time on it.

## Docs source (per-component `.prompt.md` / cfg.docsDir)

- The authoritative source is `lib/docs/component-specs.ts` (cross-referenced
  with `lib/docs/component-registry.ts` for category), rendered to markdown by
  `.design-sync/stage-assets.mjs` into `.design-sync/.cache/docs/` — **not**
  `local-docs/contour-spec-*.md`. Those are internal planning notes, partly in
  Vietnamese, that name a commercial platform throughout — fine as an internal
  reference, wrong to ship into a design agent's prompt. See the file header
  comment in `stage-assets.mjs` for the full reasoning.
- `ScrollRail` and `Tooltip` had no entry in `component-specs.ts` at last
  sync (`Tooltip` has since been added; `ScrollRail` still doesn't as of this
  writing — it's a newer component). Both get a synthesized `.prompt.md` from
  their `.d.ts` + JSDoc + authored preview instead, which is a fine fallback.

## Design guidelines source

- Same problem as above: `local-docs/contour-design-guidelines-v2.md` is
  Vietnamese and names a commercial platform. `stage-assets.mjs` instead
  extracts the public `/docs/guidelines` page's rendered text (JSX → markdown,
  a small regex-based extractor in `stage-assets.mjs`) into
  `.design-sync/.cache/guidelines/design-guidelines.md`.
- `/docs/tokens` is deliberately **not** extracted the same way — it's mostly
  a big literal color-value table, and the real token values already ship
  live in `cfg.cssEntry` as real `var(--*)` custom properties, which is more
  useful to a design agent than a prose restatement.

## Cosmetic: nested path under `guidelines/`

- The shipped guidelines file lands at
  `guidelines/.design-sync/.cache/guidelines/design-guidelines.md`, not a flat
  `guidelines/design-guidelines.md`. `emitGuidelines` preserves the full
  `PKG_DIR`-relative subpath of the matched source file, and since the staged
  source lives under `.design-sync/.cache/`, that whole prefix comes along.
  Harmless (the content and its `guidelines/` root are correct — a design
  agent reading the folder still finds it), just a bit ugly if a human
  browses the folder. Not worth fixing given the only way to get a flat path
  is staging the file *outside* `.design-sync/` entirely, which conflicts
  with keeping generated staging artifacts inside the designated cache dir.

## `package.json` `types` field — real design-sync infrastructure, not stray

- `package.json` has `"types": ".design-sync/.cache/dts-types/_root.d.ts"`
  (the file itself doesn't need to exist; only the directory it names does).
  This repo ships no built `dist/` `.d.ts` tree (it's a Next.js app, not a
  published package), and `.ds-sync/lib/dts.mjs`'s prop extraction *only*
  reads an already-emitted `.d.ts` tree via this field — it does not infer
  types from `.tsx` source directly. Without it, every component's props
  silently stubbed to `[key: string]: unknown` (confirmed during the first
  sync — this is not a hypothetical).
  - `cfg.buildCmd` runs `npx tsc -p .design-sync/tsconfig.dts.json` (a
    declaration-only build scoped to `components/ui/**` + `components/icon/**`,
    output to the gitignored `.design-sync/.cache/dts-types/`) before
    `stage-assets.mjs`, so this stays populated every sync.
  - This field is inert for the actual Next.js app (nothing in the build/dev/
    test pipeline reads package.json's `types` field) — safe to keep
    indefinitely, but flagging here so a future reader doesn't wonder why a
    private app has a `types` field pointing at a path that doesn't exist
    outside of a design-sync run.

## `cfg.dtsPropsFor` overrides — why each one exists

All hand-written because the auto-extraction genuinely produced something
wrong or empty, not preference:

- **`Button`** — real props are wrapped in ~30 framer-motion `HTMLMotionProps`
  fields (`Button` is built on `motion.button`) that the extractor surfaced
  as if they were curated API. Override lists only the real public props
  (matches `lib/docs/component-specs.ts`'s documented Button props exactly).
- **`Icon`** — the real prop is `name: IconName` (required) plus a
  `decorative`/`aria-label` discriminated-union accessibility pair; the
  extractor dropped `name` entirely and flattened the union to `decorative?:
  boolean`. Icon is used by nearly every other component's preview, so this
  one mattered a lot.
- **`HStack` / `VStack`** — thin `Omit<StackProps, "direction">` wrappers;
  the extractor couldn't flatten the re-export and stubbed to
  `[key: string]: unknown`.
- **`Badge`** — real type is `BadgeCounterProps | BadgeStatusProps` (a
  top-level union); the extractor only kept the two fields common to both
  branches (`variant`, `className`) and dropped everything mode-specific
  (`count`/`dot`/`showZero` vs `label`/`color`/`tone`). Override flattens
  both branches with JSDoc noting which mode each field belongs to (a real
  union isn't expressible as a flat interface body, so this is an accepted
  approximation, not a literal reproduction of the type).
- **`Progress`** — same union-flattening issue as Badge
  (`ProgressCircularProps | ProgressLinearProps`); extractor dropped `size`/
  `diameter`/`strokeWidth` (circular-only) entirely.
- **General pattern**: if a future re-sync's `.d.ts` for some component looks
  suspiciously thin (just `variant`/`className`, or a handful of fields when
  the component visibly does more), check whether its real type is a
  **top-level union** (`TypeA | TypeB`, not an intersection) — that's the
  extractor's blind spot every time it's shown up so far.

## `cfg.overrides` (`cardMode`/`viewport`/`primaryStory`) — why each one exists

- **`Sheet` / `SheetContent` / `SheetHeader`** — `Sheet` portals to
  `document.body` as a centered Modal or full-viewport Bottom Sheet; forcing
  `open` renders real content but it doesn't stay confined to a grid cell.
  `{"cardMode": "single", "viewport": "480x640"}` on all three (they share the
  same `Sheet` parent) contains it correctly — confirmed via screenshot.
- **`SplitView`** — `position: fixed` sidebar, same grid-escape problem.
  `{"cardMode": "single", "primaryStory": "WithSidebar"}` — confirmed clean.
- **`Alert` had the same override at one point** (`cardMode: single` fixed
  its grid-escape) but was reverted to the floor card for the animation-timing
  reason above — remove is correct, don't re-add without also re-authoring
  `Alert.tsx`.

## Other findings from batch authoring (folded from now-deleted learnings files)

- **`RouteTransition`** calls `usePathname()` from `next/navigation`, and the
  shipped `_ds_bundle.js` has no shim for that module (only `react`/
  `react-dom`/`react-is`/`scheduler` are shimmed in `.ds-sync/lib/bundle.mjs`'s
  `reactShim`) — checked Next's own source and `usePathname()` resolves
  safely to `pathname = null` with no Provider (no throw), confirmed by the
  clean render in practice. If a future component needs real route context,
  a `next/navigation` shim would need adding to `bundle.mjs`.
- **`SplitView`**'s preview is the one exception among all 42 that imports
  from `@/lib/hooks/*` (`SizeClassOverrideProvider`, `CoarsePointerOverrideProvider`)
  rather than only `@/components/ui/*` / `@/components/icon` — needed to force
  deterministic sidebar/drag-handle visibility for a static capture (same
  override-provider pattern `split-view.test.tsx` uses internally). Fine, just
  noting it as the one precedent if another component ever needs the same trick.

## Components with no controllable open/expanded state (accepted limitation)

`Dropdown`, `Tooltip`, and `ContextMenu` all manage their open state
internally (Radix, via local `useState`) with no `open`/`defaultOpen` prop
exposed to consumers. `ContextMenu` additionally only opens from a real
right-click/long-press — a synthetic dispatched `contextmenu` `MouseEvent`
was tried and did not reliably open it (Radix's trigger handler should
receive it per source inspection, but empirically it didn't render open).
All three previews show the real, correctly composed **trigger** rather than
a non-functional forced-open attempt — this is the honest achievable render,
not a bug. If a future re-sync wants open-state screenshots for these, the
capture harness would need to simulate a real trigger interaction
(click/right-click/hover-and-wait) before screenshotting, which is out of
scope for preview authoring alone.

## Preview-authoring workflow note (not a repo fact, but worth keeping)

Running the build/capture loop (`preview-rebuild.mjs` + `package-capture.mjs`)
*from inside a subagent* was unreliable this session (agents repeatedly
stalled specifically on those heavy Bash calls, both as forks and as fresh
general-purpose agents, regardless of concurrency). What worked reliably:
subagents author `.design-sync/previews/*.tsx` only (no build commands), and
the orchestrating session runs build/capture/grade itself afterward, chunked
into small `--components` batches (~5 at a time) via backgrounded Bash. If
re-running a large author-then-verify pass, keep that split.

## Component/API mismatches discovered during preview authoring

- Otherwise none found beyond what the `dtsPropsFor` section above already
  covers — the `component-demos.tsx` demo source (used as the primary
  authoring reference) matched the current component APIs closely throughout.
