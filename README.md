# Orchard OCD website

The Orchard OCD charity website (orchardocd.org), rebuilt on Payload CMS 3, Next.js 16,
React 19, TypeScript, Headless UI and Tailwind CSS 4.

Every piece of content comes from the previous WordPress site and is checked, page by
page, against a local mirror of it.

## Layout

| Path | What it holds |
| --- | --- |
| `web/` | The application: Payload config, collections, seed, and the Next.js frontend |
| `web/src/app/(frontend)/` | One directory per route. Every page is hand-written React |
| `web/src/components/site/` | The kit those pages compose: banner, section, prose, figure, table |
| `web/src/seed/content.json` | Everything the old site contained, as structured data |
| `tools/extract.py` | Reads the mirror and writes `web/src/seed/content.json` |
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
- `pnpm seed` wipes every collection and rebuilds it, so it is always safe to re-run. It
  loads the five content collections and the uploads; the rest of `content.json` is kept as
  the record the hand-written pages were written from, and as the register of every upload
  those pages draw by filename.

## Editing a page

Pages are not CMS documents. Each route is a React file under `web/src/app/(frontend)/`
that composes the kit and holds its own copy inline, so the picture can sit beside the
paragraph it illustrates. The landing page is `web/src/app/(frontend)/page.tsx`, no
different from the rest. Changing a page means editing that file; there is no block palette
and no layout field, and an editor cannot change how any page is laid out.

Navigation, footer columns, contact details, donate and registry URLs, social profiles and
newsletter copy live in `web/src/lib/site.ts`.

## Content model

The CMS holds content, never layout: five collections and the uploads they reference.

| Collection | Count | Notes |
| --- | --- | --- |
| Posts | 84 | The blog, at `/blog/<slug>`; the body is rich text |
| Studies | 32 | "Participate in research", at `/participate-research/<slug>` |
| Webinars | 15 | Titles from the old page's slider, with poster images |
| People | 85 | Team, scientific advisory board, supporters, volunteers, and 56 College members |
| Speakers | 34 | Conference speakers, listed by both conference pages |
| Media / Documents / Videos | 305 / 22 / 6 | Uploads, PDFs, and the self-hosted talks |

Three supporting collections carry no page content: Categories (the blog's own taxonomy),
Subscribers (the mailing list the newsletter form writes to) and Users (admin login).
There are no globals.

## Checks

```bash
cd web
pnpm verify      # lint, typecheck, duplication, seed, build, tests
pnpm lighthouse  # Lighthouse budgets, needs `pnpm start` running
```

CI runs lint, typecheck, duplication, seed and build, then the test suite (which carries the
axe scans for WCAG 2.2 AA on every page template at desktop and mobile widths), then Lighthouse.
