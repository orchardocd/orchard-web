# Orchard OCD website

The Orchard OCD charity website (orchardocd.org), rebuilt on Payload CMS 3, Next.js 16,
React 19, TypeScript, Headless UI and Tailwind CSS 4.

Every piece of content comes from the previous WordPress site and is checked, page by
page, against a local mirror of it.

## Layout

| Path | What it holds |
| --- | --- |
| `web/` | The application: Payload config, collections, seed, and the Next.js frontend |
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

`pnpm parity` (from the repo root: `python3 tools/check_parity.py`) walks all 142 routes
with the production server running and enforces, in both directions:

- every text unit the old page rendered is present on the new page;
- every illustration the old page used is present on the new page;
- no copy exists on the new site that appears nowhere on the old site.

Copy that is genuinely new (UI wording such as "Skip to main content") lives in an
explicit allowlist in the script, so any addition has to be declared.

Current state: **2942/2942 text units, 368/368 images, 0 invented text units, 0 gaps.**

## Checks

```bash
cd web
pnpm verify   # lint, typecheck, duplication, seed, build, tests
pnpm parity   # content parity, needs `pnpm start` running
```

`pnpm test` covers Payload integration tests plus Playwright end-to-end tests, including
axe scans for WCAG 2.2 AA on every page template at desktop and mobile widths.
