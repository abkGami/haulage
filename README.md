# Northwake — freight forwarding site

A marketing page for a freight forwarder, built as a real Next.js app: same eight
sections, copy and design tokens as the single-file version it replaces, but split
into components with Tailwind, Motion and GSAP. The old build is kept untouched in
[`legacy/index.html`](legacy/index.html) as the verified reference.

## Stack

| | |
|---|---|
| Framework | Next.js 16.4.3 (App Router), React 19.3, TypeScript |
| Styling | Tailwind CSS 4 via `@tailwindcss/turbopack` (no PostCSS step) |
| UI motion | [`motion`](https://motion.dev) 14 — reveals, accordion, menu, form swap, counters, card tilt |
| Scroll motion | GSAP 3.15 + ScrollTrigger — progress bar and process axis |
| Type | `next/font/google`: Exo 2 800, Public Sans 400/700, self-hosted at build |

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
npx tsc --noEmit
```

Node 20.9 or newer.

## Where things live

```
app/layout.tsx          fonts, metadata, SVG sprite, skip link, header, recorder
app/page.tsx            section order: hero → trust → services → proof →
                        process → coverage+FAQ → quote → footer
app/globals.css         design tokens, scene/header geometry, static-mode rules
components/scenes/      scene-engine.ts (scrub engine), ScrubSection.tsx
components/site/        Header, MobileMenu, ProgressBar, Recorder
components/sections/    one file per section
components/ui/          Reveal, Accordion, StatCounter, IndustryCard,
                        SectionTitle, QuoteForm, icons
lib/                    clips.ts, site.ts, motion.ts, cx.ts
legacy/index.html       the single-file build this replaces — reference only
```

## Swap points

| What | Where | Notes |
|---|---|---|
| Quote endpoint | `NEXT_PUBLIC_QUOTE_ENDPOINT` | Copy `.env.example` to `.env.local`. Empty → demo success after 650 ms, then a `mailto:` fallback on failure. The form posts `FormData` and expects any 2xx. |
| Scene footage | `lib/clips.ts` | `A` is wired (1080p + 720p + poster). `B` and `C` are `null` and render the neutral `.no-media` surface — no invented footage. `D` reuses `A`, reversed by the engine. |
| Copy, contact, domain | `lib/site.ts`, metadata in `app/layout.tsx` | `northwake.example` is a placeholder everywhere. |
| Navigation, footer links | `NAV`, `FOOTER_COLUMNS` in `lib/site.ts` | About / Careers / News / Privacy / Terms are `#` placeholders. |
| Colours, easing | `@theme` block at the top of `app/globals.css` | Tailwind utilities pick them up automatically. |

## Design tokens

`cream #F7F5EF` · `paper #F9F9F9` · `page #0a0b0c` · `cloud #e2dedd` ·
`ink #141516` · `accent #D8321F` · `grey #7d7978`.

The brief's "white" is named `paper` so Tailwind's own `white` is left alone. Two
values were nudged for measured contrast, both single-value changes: `grey` is
`#7d7978` (the spec's `#8f8b8a` measured 2.53:1 on cloud, below the brief's own
3:1 floor) and `--ink-mute` is `rgba(20,21,22,.65)` (the spec's `.6` measured
4.35:1).

## Motion ownership

- **Hero scrub is custom, not ScrollTrigger.** `scene-engine.ts` maps scroll to
  clip time with a two-part knee (low `0.46` on the hero), smooths with
  `cur += (target - cur) * 0.22`, seeks only when not already seeking and off by
  more than 1/60 s, and re-seeks on `seeked`. The video is never played, looped or
  faded — only `currentTime` moves.
- **GSAP ScrollTrigger** drives the 2 px progress bar (`scaleX`) and the process
  axis (`scaleY` + `is-on` steps), because those are continuous scroll-linked
  values.
- **Motion** owns everything discrete: first-view reveals, the FAQ accordion, the
  mobile menu, the quote-success swap, stat counters and the industry-card tilt.
- **Reduced motion** puts the engine in static mode, sets Motion durations to
  zero, and lets CSS flatten the layout.

## Static mode, no-JS, and why nothing touches `<html>`

`@media (prefers-reduced-motion: reduce), (scripting: none)` collapses the tall
scrub tracks, hides clips, forces `.rv` visible and hides the progress bar.
Without JavaScript the header also gets a solid background, since nothing can
sample the section beneath it.

The first attempt flagged these states with a class/`data-*` attribute written by
an inline script before paint. React 19 compares the root `<html>` attributes when
a deferred segment hydrates, treated the extra attributes as a mismatch
(`Minified React error #418`), and regenerated the tree — which silently dropped
the progress bar. Nothing in this app mutates attributes React renders now:
- reduced motion and no-JS are pure CSS media queries;
- the header's light/dark and menu state are React class names on `<header>`;
- the progress bar picks its colour up with `body:has(.hd.is-light)`;
- the menu scroll lock is `document.body.style.overflow`, set on click.

Browser baseline follows from that: `:has()`, `svh` and `scripting` mean Chrome
120+, Safari 17+, Firefox 113+ for the static fallback.

## Verified

Chrome 156 via Playwright at 1440×960 and 390×844, production build:

- Geometry matches the original within 4 px: track 4347.84 px, knee 0.7875,
  h1 67.2 px, document 21,216 px; section tops hero 0 → trust 4021 → services
  5370 → proof 9126 → process 10633 → coverage 14954 → quote 16536 → footer
  20810.
- Mobile rhythm (narrow/portrait): scenes flow instead of pinning, with a 58vh
  lead-in, 10vh intro gap, 9vh block gap and a 0.35vh run-out. At 390×844 the
  hero track is 2,904.84 px and the document 16,618 px (was 4,052.66 / 20,805),
  so the first copy lands at 0.58 screens instead of 1.12. Desktop geometry is
  unchanged.
- Hero scrub 0 → 4.371 s, reverse pass, per-scene dim 0 → 0.28.
- Header theme flips at every seam; process axis `scaleY .9187`; all four steps
  active.
- FAQ: `aria-expanded`, `inert`, single-open, 77 px panel.
- Form: three inline errors + focus to the first field, success panel replaces the
  form and takes focus.
- Menu at 390: opens, first link focused, Tab/Shift+Tab trapped, Escape closes and
  restores focus, body scroll locked.
- Reduced motion and no-JS: auto-height tracks, clips hidden, reveals visible,
  counters final, no horizontal scroll.
- Header contrast: 7.89:1 worst case at 1440, 5.67:1 at 390; nothing below 4.5:1.
- `overflow-x` 0 at 320, 390, 768, 1024, 1440, 1920, 2560. No console or page
  errors in any mode.

Payload on first load, gzip: HTML 16.4 KB, CSS 8.6 KB, JS 253.5 KB (8 chunks).
That is the cost of React + Next + Motion + GSAP; the single file was 18.8 KB.
The largest saving available is dropping GSAP and driving the progress bar and
process axis from the scrub engine's existing scroll handler.

## Known gaps

- Scenes B (container port) and C (road/rail corridor) still have no footage; they
  render the deliberate neutral surface until URLs land in `lib/clips.ts`.
- Not tested on real Safari/Firefox or physical iOS/Android hardware.
- The hero 1080p clip is 4.7 MB and the 720p is 2.4 MB — both should be
  re-encoded before launch.
