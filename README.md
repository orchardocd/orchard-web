# Orchard OCD website

The Orchard OCD charity website (orchardocd.org), rebuilt on Payload CMS 3, Next.js 16,
React 19, TypeScript, Headless UI and Tailwind CSS 4.

Every piece of content comes from the previous WordPress site and is checked, page by
page, against a local mirror of it.

## Layout

| Path | What it holds |
| --- | --- |
| `web/` | The application: Payload config, collections, seed, and the Next.js frontend |
| `web/src/seed/content.json` | Everything the old site contained, as structured data |
| `tools/extract.py` | Reads the mirror and writes `web/src/seed/content.json` |
| `tools/check_parity.py` | Compares every rendered page against the old site |
| `mirror/` | wget mirror of the old site plus its wp-json dumps (not committed) |
| `design/` | The three homepage design directions; Campaign Green is the one built |

## Getting started

```bash
cd web
pnpm install
pnpm seed        # wipes and rebuilds the local SQLite database from content.json
pnpm dev
```

The admin panel is at `/admin`. `PAYLOAD_ADMIN_EMAIL` and `PAYLOAD_ADMIN_PASSWORD` in
`.env` create the first user during seeding.

## Content pipeline

```
mirror/  ──tools/extract.py──▶  content.json  ──optimize-assets.mjs──▶  seed/assets/
                                     │
                                     └──────────pnpm seed──────────▶  Payload (SQLite)
```

- `pnpm content` runs the extractor and then the asset optimizer. Run it in that order:
  the optimizer adds the `asset` field the seed needs, and the seed fails loudly without it.
- The optimizer resizes images, converts opaque PNGs to JPEG, and transcodes the six
  self-hosted videos to MP4, taking the assets from 328 MB to 87 MB.
- `pnpm seed` wipes every collection and rebuilds it, so it is always safe to re-run.

## Content parity

`pnpm parity` walks all 142 routes with the production server running and enforces, in both
directions:

- every text unit the old page rendered is present on the new page, down to headings and
  button labels (the floor is 12 characters, so only single words are exempt);
- every illustration the old page used is present on the new page, under the same heading
  it sat under, and never rendered twice on one page;
- no copy exists on the new site that appears nowhere on the old site.

Copy that is genuinely new (UI wording such as "Skip to main content") lives in an
explicit allowlist in the script, so any addition has to be declared.

CI checks parity against `web/src/seed/parity-expectations.json`, a fixture holding what
each old page contained, so the check runs without the mirror. Regenerate it with
`pnpm parity:update` after re-extracting; `pnpm parity:mirror` checks against the mirror
directly.

Current state: **3351/3351 text units, 368/368 images, 0 invented text units, 0 gaps.**

## Editing the landing page

The landing page is not a rich-text document. It is a set of designed sections fed by the
Home page global, where every field is semantic: a heading, a paragraph, a link label, a
picture. Editors change words and images; the site owns type, colour, spacing and layout.
Adding a section means adding fields and a component, not markup in a text box.

## Content model

| Collection | Count | Notes |
| --- | --- | --- |
| Home page (global) | 1 | The landing page as semantic fields, never markup |
| Pages | 28 | Body stored as blocks; hero slides carry the old banner sliders |
| Posts | 84 | The blog, at `/blog/<slug>` |
| Studies | 32 | "Participate in research", at `/participate-research/<slug>` |
| Webinars | 15 | Titles from the page's slider, with poster images |
| People | 85 | Team, scientific advisory board, supporters, volunteers, and 56 College members |
| Speakers | 34 | Conference speakers |
| Media / Documents / Videos | 328 / 22 / 6 | Uploads, PDFs, and the self-hosted talks |

Globals hold the navigation, footer columns, donate and registry URLs, contact details,
social profiles, homepage statistics, and newsletter copy.

## Checks

```bash
cd web
pnpm verify   # lint, typecheck, duplication, seed, build, tests
pnpm parity   # content parity, needs `pnpm start` running
```

`pnpm test` covers Payload integration tests plus Playwright end-to-end tests, including
axe scans for WCAG 2.2 AA on every page template at desktop and mobile widths.
