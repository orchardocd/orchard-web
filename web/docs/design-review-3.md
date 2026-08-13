# Design review 3

Third pass over the rebuilt site at 1440x900 and 390x844, covering 30 routes: the home page, the
eleven `[slug]` article pages, the four "What Is OCD?" treatment pages, the three empty policy
pages, both conference pages, the blog index and both of its pages, a blog post, the studies index
and a study, the two job pages, the College pages, the newsletter page and the not-found page.
Geometry was measured in the running production build; every number below reproduces.

Rounds one and two fixed the page-level defects they found. What is left is almost entirely
systemic: nine components own the whole site, and each of the nine is doing one job wrong in a way
that surfaces on ten or twenty pages at once. The list below is ordered so that applying it in
order never undoes earlier work.

## The nine things to fix

### 1. Bound every image by the column it sits in

`MediaImage` writes the asset's intrinsic width as an inline `max-width` so nothing is ever
upscaled. An inline declaration cannot be beaten by a class, so the guard also defeats Tailwind
preflight's `img { max-width: 100% }`. `RenderBlocks` then asks for `w-auto`, which lets the image
take its density-corrected intrinsic width with no ceiling at all.

At 390px this pushes the document wider than the viewport on ten routes, so the whole page,
including the sticky header, drags sideways under a thumb:

| Route | scrollWidth | Offender |
|---|---|---|
| /get-involved | 452 | `get-involved-first-img.svg` 428px in a 342px column |
| /about-orchard | 435 | `Group-14645` 411px |
| /about-ocd, /research, /join-our-mailing-list, /about, /first-line-treatment, /complementary-and-alternative-therapies | 414 | four to one images at 390px each |
| /beyond-first-line-therapy | 400 | `flt4` 376px |

The same rule breaks columns at 1440 too. On /research the psilocybin photo and the FFOR wordmark
both render 720px wide with `right=852` inside a 640px figure whose text stops at 772, so the
article has two right edges. On /complementary-and-alternative-therapies the `table3` raster does
the same. On /blog/important-psilocybin-studyupdate at 390px the featured image measures
x=24..366 inside a plate that measures x=24..366 with 24px of padding, so the picture paints over
its own mist frame and erases the border on both sides. On the home page the first newsletter
envelope renders 108px wide in a 96px cell at x=126, the only element on the route left of the
x=132 rail.

Fix, one line. `web/src/components/ui/Media.tsx:44` becomes `style={{ maxWidth: min(100%, ${resolved.width}px) }}`
in place of `{ maxWidth: resolved.width }`. The intrinsic cap still holds, and no image can exceed
its container. Then `web/src/components/blocks/RenderBlocks.tsx:81` can keep `w-auto` and gains a
correct `sizes` hint of `(min-width: 768px) 40rem, calc(100vw - 3rem)`; today it has none and
inherits `100vw`, which is what makes the density-corrected width land at exactly 390.

Resolves: the mobile overflow finding on ten routes, the /research and
/complementary-and-alternative-therapies column overhang, the blog post plate paint-over, and the
home newsletter mark breaking the left rail.

### 2. Let a figure's scale come from its role, not from its asset

`RenderBlocks.tsx:79-86` renders every `imageBlock` through one rule, `max-h-[26rem] w-auto`, and
`groupBlocks.ts:202` diverts any run of two or more images into a logo row locked to `h-16`. One
rule for four different jobs produces four different failures:

- A 46x46 chevron takes a full figure row of its own. On /conference it measures `figure.mt-8.mb-4`
  at y=2449 h=46 with 32px above and 32px below, 110px of page for a mark that points at nothing
  and is not a link. Same on /conference-2, /first-line-treatment, /brain-stimulation and
  /complementary-and-alternative-therapies, where a 48x46 mark sits between the page title and its
  first sentence in a 118px band.
- A 497x483 illustration on /about-ocd renders at 66x64 because it happens to sit next to a 51px
  speck and the pair is classed as a logo strip. On /research a 663x475 illustration renders at
  89x64 because the run held two blocks that resolve to the same media file, and the duplicate is
  filtered out only after the grouping has committed.
- A 720x900 recruitment poster on /conference-2 is crushed to 333x416 (46% linear) by the flat
  height cap while 843px of container sits empty beside it; its deadline and submission rules are
  unreadable.
- The Wellcome mark on /conference renders 140x133 against three exhibitor marks 224px below it at
  64px, and the FFOR wordmark on /research is the widest object on the page at 720px with no plate.
- Five section illustrations on /beyond-first-line-therapy start at x=144, 192, 197, 214 and 221
  inside boxes that all begin at x=132, because the file's own canvas padding becomes layout. On
  /brain-stimulation the four marks come from one 481x433 canvas and land on four different left
  edges at optical widths 250, 375, 365 and 380px.
- Three marks on /about-orchard are dropped between an h4 and the sentence that completes it, so
  the reader meets "Our Vision", a 115px picture, then "is a world where all patients suffering
  from OCD receive effective treatment".

Fix in two places, both keyed on the resolved media, which `resolveMedia` already exports from
`web/src/components/ui/Media.tsx:8`:

- `web/src/components/blocks/groupBlocks.ts:195-209`: only emit `kind: 'logos'` when every image in
  the run resolves under about 240px intrinsic width, and count only the images that will survive
  the media-id dedupe; a run that collapses to one image falls through to the ordinary figure.
- `web/src/components/blocks/RenderBlocks.tsx:79-86`: branch the figure on the resolved size.
  Under about 120px intrinsic width, render an inline `w-12 align-middle` accent folded into the
  preceding heading's row instead of a full figure row. Between 120px and the measure, a plated
  figure, `mt-8 mb-8 w-full rounded-lg bg-mist p-6` with the image `mx-auto max-h-56 w-auto
  object-contain`, so the file's own canvas padding reads as frame rather than misalignment and
  every mark shares one center line. Above the measure and taller than wide, raise the cap to
  `max-h-[40rem]` so a portrait poster uses the column. A wordmark ratio above about 3 keeps the
  mist plate at `max-h-24`.
- `web/src/components/blocks/RenderBlocks.tsx:159`: relax the logo row from `h-16 w-auto
  max-w-none` to `h-auto w-auto max-h-16` so a mark smaller than the cell keeps its own size.

Round two declined re-cropping the mirrored assets and said the correction belongs in the plates.
This is that correction.

### 3. One owner for vertical space

Three separate mechanisms are each spending vertical space, and none of them is in charge.

**Block margins add instead of collapsing.** `RenderBlocks.tsx:137` makes the body root a flex
column, so every entry wrapper becomes an independent formatting context and adjacent margins sum.
Each block type then carries its own margin: figure `mt-8 mb-4`, video and embed `my-6`, button
`my-4`, logo row `my-8`, portrait grid `mt-4 mb-10`, and `RichText.tsx:9` adds `[&_h2]:mt-14` on
top. Measured ink-to-ink above a body h2, one rank of boundary:

| Route | Gaps above an h2 |
|---|---|
| /conference | 56, 56, 72, 72, 80, 72, 96 |
| /about-ocd | 88, 56, 64, 56, 56, 56, 56 |
| /research | 88, 72, 72 |
| /about-orchard | 56, 72, 56, 56 |

Six values for one boundary, decided by which block happened to precede it.

**Two section scales.** `Section` is `py-16 md:py-20` (Container.tsx:33). A second set of blocks is
on a fixed `py-14` with no breakpoint step: `Banner.tsx:43` (BannerPage, used by /blog and
not-found), `PageHero.tsx:27` (every highlight band) and `page.tsx:51`. The banner-to-content gap is
therefore 136px on /blog and every highlight-band route and 160px on /participate-research,
/webinars, /research, /conference and /our-coi-policy. The gap above the footer is 56px on /blog,
80px on fifteen routes, 96px on six and 120px on /conference, because trailing block margins leak
into the container padding.

**`main` absorbs the slack when a page has no body.** /our-policy, /our-research-strategy and
/our-funding-policy each render a 223px banner and nothing else. `main.flex-1` inside a
`min-h-screen` column stretches to 368px, leaving a 145px band of white that no padding accounts
for, under a 413px footer. Confirmed identical on all three: `docHeight=900`, `main y=119 h=368`,
`footer y=487 h=413`. /our-coi-policy adds a single 38px heading and measures `main h=421` against
the same 413px footer.

Fix:

- `web/src/components/blocks/RenderBlocks.tsx:137`: root becomes `cn('w-full', className)` so
  sibling margins collapse to the larger of the two, plus `[&>*:first-child>*]:mt-0` and
  `[&>*:last-child>*]:mb-0` so the first and last blocks cannot add to the container padding.
- Put every non-prose block on one value: `RenderBlocks.tsx:80` `mt-8 mb-4` → `my-8`, `:89` and
  `:91` `my-6` → `my-8`, `:96` `my-4` → `my-8`, `:173` `mt-4 mb-10` → `my-8`. The `my-8` logo row at
  `:154` is already there. A heading after any block then resolves to its own 56px.
- Retire `py-14`: `Banner.tsx:43` and `PageHero.tsx:27` become `py-16 md:py-20`; drop
  `className="py-14"` from `page.tsx:51`; `blog/[slug]/page.tsx:26` and
  `participate-research/[slug]/page.tsx:27` `pt-14` → `pt-16 md:pt-20`, and `:49` / `:55` `pb-24` →
  `pb-16 md:pb-20`.
- `app/(frontend)/[slug]/page.tsx:46`: drop the conditional and always pass `py-16 md:py-20`;
  `:60` and `:65` `pb-16 md:pb-20` → `py-16 md:py-20`, so the trailing NIHR block on /about-orchard
  and the newsletter form get the same 160px boundary every other section gets rather than 80px and
  119px. Drop `mt-10` from `NewsletterSignup.tsx:44`, which currently escapes its own container and
  floats the form's box 40px down.
- `app/(frontend)/layout.tsx:34`: `<main id="main" className="flex flex-1 flex-col
  [&>*:only-child]:grow">`. When the banner is a page's only child it absorbs the stretch and the
  page becomes a full-height title plate instead of a title strip over a white void. Every
  multi-section page is unaffected because the selector does not match.

### 4. Stop rendering running prose as bordered cards

`HeroHighlights` gives every slide the same anatomy: a bordered, padded card in a two- or
three-column grid. On five routes not one card in the set has anything to put in it. Measured:

| Route | Cards | With image | With title | With CTA | Band |
|---|---|---|---|---|---|
| /about-ocd | 5 | 0 | 0 | 0 | 1002px |
| /first-line-treatment | 5 | 0 | 0 | 0 | 1002px |
| /beyond-first-line-therapy | 5 | 0 | 0 | 0 | 1002px |
| /brain-stimulation | 5 | 0 | 0 | 0 | 1002px |
| /complementary-and-alternative-therapies | 5 | 0 | 0 | 0 | 1002px |

The titles are suppressed because all six slides carry the identical string "What Is OCD?" and
`PageHero.tsx:47` drops a title already used; the images are blanked because all six point at one
asset and `withoutRepeats` removes the repeats. What is left is one continuous passage cut into
five boxes: the banner paragraph ends "prevent or control (the obsessions)." and card one opens
"These lead to irresistible and recurring behaviours (the compulsions or rituals)." with 227px and
a border between them. Reading order runs across three columns and wraps. The measure drops from
the article's 640px to 305px, so the same prose is set at 30 characters a line here and 65
characters a line 1,000px below. Row two holds two cards and leaves a 371x412 cell empty, and
`items-stretch` leaves 236px, 148px and 90px of blank inside three of the five. On /about-ocd the
band costs 1,772px at 390px and the first body heading does not arrive until y=3023, 3.6 screens
down.

Fix, `web/src/components/layout/PageHero.tsx:28-38`: compute whether any surviving item carries its
own furniture, `const bare = items.every((s) => !s.image && !s.ctaHref && (!s.title ||
titled.has(s.title.trim().toLowerCase())))`. When `bare`, drop the `ul`/`li`/grid and render the run
as one `w-full max-w-measure` stack of `RichText` blocks. Every page whose slides still carry a
title, image or CTA keeps today's card exactly.

Two card defects survive for the pages that keep cards. `PageHero.tsx:30` `items-stretch` plus
`h-full` at `:38` pool all leftover height at the bottom of the shorter card, leaving a visibly
empty 572x106 region inside the second /get-involved card: add `justify-center` to the `li` so it
splits. And `PageHero.tsx:52` renders `<RichText data={slide.content} />` with no first-child reset,
so `p-6` plus `[&_p]:my-6` gives 49px above the first line against 25px below the last on every
card at 390px: pass `className="[&>*:first-child]:mt-0"`, the reset `RenderBlocks` already uses.

### 5. Give every page its own title, and the body a second heading tier

Four routes announce a subject that is not theirs. Their banner h1 reads "What Is OCD?", inherited
from slide zero of a shared hero, while the page's own name is rendered in the body as a 30px h2
identical in size, weight and color to every section label beneath it:

| Route | `<title>` | h1 | Page name renders as |
|---|---|---|---|
| /first-line-treatment | First line treatment | What Is OCD? | h2 30px/700 rgb(0,101,92) |
| /beyond-first-line-therapy | Beyond first line therapy | What Is OCD? | h2 30px/700 rgb(0,101,92) |
| /brain-stimulation | Brain Stimulation | What Is OCD? | h2 30px/700 rgb(0,101,92) |
| /complementary-and-alternative-therapies | Complementary and alternative therapies | What Is OCD? | h2 30px/700 rgb(0,101,92) |

The first desktop screen of /brain-stimulation is byte-identical to the first screen of
/complementary-and-alternative-therapies (md5 of both `desktop-tile-01.png` is
`74d88c03e70a0a33bf0f0ddc6d6732d4`). Screen-reader users get the same wrong document title.

Underneath, the body has exactly one heading tier because `seed/blocks.ts:24` clamps every source
level with `Math.min(Math.max(block.level, 2), 4)`, collapsing a source h1 and its h2s onto one
step. /conference renders eight h2s at 30px/700 rgb(0,101,92) covering the event name, the date,
the venue and every section label; /conference-2 five; /become-a-trustee twelve, including "Key
Responsibilities" and the four numbered responsibilities it owns; /work-with-us eleven, including
"Person Specification" and the "Essential"/"Desirable" pair under it; /volunteer five, so the
section title, three interview questions and the attribution are peers.

The home page inverts its own ramp at both widths. Measured:

| Element | Desktop | Mobile |
|---|---|---|
| h1 | 60px/63 | 36px/37.8 |
| Section h2 (five of them) | 36px/40 and 36px/45 | 36px/40 and 36px/45 |
| "Follow Us On Social Media" h2 | 24px/32 | 24px/32 |
| h3 "Learn About Orchard OCD" | 36px/40 | 30px/36 |
| h3 "Our Vision" | 20px/28 | 20px/28 |
| Highlight card h2 | 18px/24.75 | 18px/24.75 |

On desktop the h3 that introduces the video is byte-for-byte the section h2 above it. On mobile the
h1 and five h2s are all 36px, so the page has no title step at all; every other template steps its
h2 to 24px below `md`. And 36px lands on two different line-heights because `leading-tight` at
`RichText.tsx:9` and `page.tsx:147` is looser than the default at that size, so the only heading
that wraps is the only one set loose.

The hero lede runs the ramp backwards. `PageHero.tsx:96` asks for `text-xl`, but `PROSE`
(`RichText.tsx:7`) carries `md:text-lg`, which tailwind-merge cannot resolve against an unprefixed
class, so the deck is 20px on a 342px measure and 18px on a 620px one. Measured identical on
/about-ocd, /about-orchard, /get-involved and /first-line-treatment.

Fix:

- `web/src/components/layout/PageHero.tsx:92`: `<BannerTitle>{title}</BannerTitle>`, and keep the
  shared slide title directly above it in the site's eyebrow treatment,
  `text-[0.8rem] font-bold tracking-[0.14em] uppercase text-white` (not `text-white/70`, which
  composites to 4.28:1 on brand-deep and fails AA at that size). No wording is lost: "What Is OCD?"
  reads as the section the page sits in.
- `web/src/app/(frontend)/[slug]/page.tsx:33,49-50`: pass `title={page.title}` whenever
  `openingHeading(body[0])` matches it, not only on the `leads` path, so `takeOpeningTitle` lifts
  the duplicated body heading out of the h2 run. Then delete the `leads` branch entirely and always
  render `PageHero` when `banners` is true: today the branch turns on whether the old page happened
  to repeat its own title, which is why /our-research-strategy and /our-coi-policy open with a green
  masthead while /the-work-we-do, /volunteer, /work-with-us, /become-a-trustee, /fundraising-events,
  /psilocybin-crowdfunding-campaign, /terms-of-use, /cookies-privacy, /join-our-mailing-list and
  /the-work-we-do open on bare white. Round two's item 9 asked for this and only half of it landed.
- `web/src/components/blocks/RenderBlocks.tsx:139`: render the lifted title as an upright
  `text-3xl md:text-4xl text-ink` step when a banner already supplies the h1, and drop the
  `max-w-measure` that precedes `TITLE_CLASSES` in the same `cn()` call: both max-width utilities
  survive the merge and the 40rem one wins, which is why the /psilocybin-crowdfunding-campaign title
  wraps to three lines (270/373/266px) where a banner h1 would wrap to two.
- `web/src/seed/blocks.ts:24`: replace the clamp with a shift, `Math.min(block.level + 1, 4)`, so a
  source h1 becomes h2 and source h2s become h3, and set `[&_h3]:text-ink` in place of
  `[&_h3]:text-brand-link` at `RichText.tsx:10` so demoted labels do not read as links. Needs a
  reseed.
- `web/src/components/layout/PageHero.tsx:96`: `mt-6 text-lg md:text-xl` so the deck steps up with
  the measure instead of down.
- `web/src/app/(frontend)/page.tsx:88,147,176,213,243`: `text-4xl` → `text-3xl md:text-4xl`; `:126`
  `text-3xl md:text-4xl` → `text-2xl md:text-3xl`. Desktop reads 60/36/30/24/20/18, mobile
  36/30/24/20/18.
- `web/src/components/RichText.tsx:9-10`: add `[&_h2]:text-balance` and `[&_h3]:text-balance`, and
  replace `leading-tight` with `leading-[1.1]`. Injecting balance live turns
  "WHAT OTHER INFORMATION DO WE / REQUEST?" (509/149px) into "WHAT OTHER INFORMATION / DO WE
  REQUEST?" (405/253px) with no height change. Also fixes "(TDCS):" and "database" alone on line
  three on /work-with-us, "(FFOR)" on /research, "CONFERENCE" on /conference, and the stranded open
  bracket in "TRANSCRANIAL DIRECT CURRENT (OR / ELECTRIC) STIMULATION" on /brain-stimulation.

### 6. Make the mobile header usable

Below `lg` the entire site navigation is one disclosure panel, and its bottom cannot be reached.
Measured with the panel open at 390x844: the panel is 1066px tall with `overflow-y: visible` and
`max-height: none`, absolutely positioned inside a `sticky top-0` header. At scrollY=0 it spans
viewport y=112..1178; at scrollY=600 and at scrollY=3000 it spans y=72..1138 and never moves again.
Permanently below the fold at every scroll position: **Blog** (y=864), **Webinars** (904),
**Conference** (944), **About us** (997) and the **Donate** button (1066).

The Donate button is desktop-only in the bar as well: `Header.tsx:133` wraps it in
`hidden items-center gap-7 lg:flex`, so at 390px the 72px sticky row holds a 164x44 logo, a 74x40
Menu button and 104px of nothing. The only other donate affordance is an 85x20 underlined text link
in the lime announcement strip, which sits outside the sticky header and leaves the screen after
40px of scroll. On a 9,916px home page and an 18,986px /beyond-first-line-therapy that is 0.2% of
the scroll. The design rule that the one lime element in a view is the Donate action cannot hold
when the Donate action is off screen.

Fix, `web/src/components/layout/Header.tsx`:

- `:148`: `<DisclosurePanel className="absolute inset-x-0 top-full max-h-[calc(100dvh-7rem)]
  overflow-y-auto overscroll-contain border-t border-line bg-white shadow-xl">`. 7rem is the 40px
  announcement strip plus the 72px bar, so the panel is bounded in both the scrolled and unscrolled
  states.
- `:149`: `p-4` → `p-6`, so the panel's links land on the 24px gutter the logo above them and every
  page's content already use, rather than x=16.
- `:142`: wrap the `Disclosure` in `<div className="flex items-center gap-3 lg:hidden">` and place a
  compact `<ButtonLink href={settings.donateUrl} className="px-4 py-2 text-sm">Donate</ButtonLink>`
  before it; delete the duplicate at `:160`. Width at 390: 164 (logo) + 12 + ~88 (Donate) + 12 + 74
  (Menu) = 350 against a 342px content box, so step the logo at `:129` to `h-9 w-auto sm:h-11`,
  which recovers 30px.
- `:133-140`: on desktop the Donate button is a flex child of the nav group and inherits the same
  28px gap as the five links, so the primary action is spaced as a sixth nav item. Wrap both in one
  row at `gap-10` and keep the `PopoverGroup` at `gap-7`.
- `:72`: the popover panel uses `mt-3`, which opens it 16px inside the header band and paints over
  the header hairline for 288px. The trigger sits 28px above the header edge, so `mt-7` lands it on
  the hairline.

### 7. Fix the pages that are wrong, not only the pages that look wrong

Four defects here are factual, not aesthetic. All four are extraction losses.

**Three links 404.** Confirmed against the running server:

| Route | Anchor | href | Status |
|---|---|---|---|
| /the-work-we-do | webinars | `/ocd-webinars` | 404 |
| /fundraising-events | mission | `/about-us` | 404 |
| /become-a-trustee | Dr Nick Sireau, Chair, | `%23` → `/%23` | 404 |

The first two are the only internal in-body link on their page. `buildLinkMap` keys on the slug and
the mirror has no `ocd-webinars` or `about-us` page, so `rewriteHref` falls through to the raw path.
The third renders in exactly the teal bold underline of the working `nick@orchardocd.org` mailto
5px away on the same line, so the application instruction is half decoy.

Fix, `web/src/seed/links.ts`: add `map.set('ocd-webinars', '/webinars')` and
`map.set('about-us', '/about-orchard')` beside the two existing aliases at lines 18-19, matching
where the header already sends "About us"; and in `rewriteHtml` (lines 35-40) unwrap anchors whose
href is a bare fragment so the name stays as text and stops presenting as an affordance. Exactly one
`#` href exists in the whole seed.

**The donor table invents a header row.** `RenderBlocks.tsx:17` destructures every table as
`[head, ...body]`. The /psilocybin-crowdfunding-campaign donor roll has no header, so the served
markup is `<th scope="col">Louisa Ackermann</th><th scope="col">Brendan Kindlon</th>`: two of 164
donors are set bold ink above a 2px teal rule, and a screen reader announces every donor in column
one as belonging to a column named "Louisa Ackermann". The mirrored source is `<tbody><tr><td>` with
no `<th>` anywhere, and both columns are alphabetical from that row. Only two tables exist site-wide
and the other one (/beyond-first-line-therapy: AAP, Brand name, Weight Gain...) genuinely has one.

Fix: add a `headerRow` checkbox to `TableBlock` in `web/src/blocks/index.ts:80`, set it in
`web/src/seed/blocks.ts:114-119` from the extracted shape, and in
`web/src/components/blocks/RenderBlocks.tsx:17-46` render `<thead>` only when the flag is set,
otherwise put every row in `<tbody>` as `<td>`.

**Four fundraising categories are flattened into one flat list.** On /work-with-us the seed emits
four one-item lists interleaved with their task lists, and `blocks.ts:65` concatenates the HTML so
Lexical fuses all eight into one `ul`. The rendered result is a single 16-item bullet list where
"Trusts and foundations", "Fundraising Events", "Individual donations" and "Corporate fundraising"
are indistinguishable from the tasks under them, directly below a sentence promising "four main
categories". Fix in the `flush()` accumulation at `web/src/seed/blocks.ts:63-68`: when a `list`
block has exactly one item and the next block is also a `list`, nest them. The pattern occurs
exactly four times in `content.json`, all on this page.

The same file swallows a requirement: one `li` on /work-with-us carries a `<br>` and renders
"Copywriting skills." as a bullet-less third line inside the item above it. It is the only list item
containing a `<br>` in the entire seed. Split on `<br>` in the `list` case at `blocks.ts:27-30`;
`check_parity.py` already starts a new text unit at every break, so the units are byte-identical.

**Twelve section leads are printed twice.** On /complementary-and-alternative-therapies (six),
/beyond-first-line-therapy (four) and /brain-stimulation (two), a one- or two-line paragraph is
followed, sometimes across one subheading, by a longer paragraph that repeats it word for word
before continuing. Both are set in the same 18px body style, so the repeat reads as a rendering
fault; two of them end in a literal mid-sentence ellipsis. On /brain-stimulation "ECT is a procedure
by which a small and precise pulse of electricity is passed into the brain from the scalp." is
printed at y=7002 and again at y=7085. Fix beside `withoutRepeatedTitles` at
`web/src/components/blocks/groupBlocks.ts:135`: drop a `richText` block whose entire normalized text
is a strict prefix of a following prose block in the same section, exactly as that function already
drops a heading the page has used. Parity holds because `check_parity.py:446` tests each old unit
with `unit not in actual_text` against the whole page, and every word survives verbatim in the
longer block. Verify the containment empirically for all twelve pairs before shipping.

### 8. One card system

Cards are the site's dominant object and five components draw them five ways.

**The card plate ignores the asset's ratio.** `ArticleCard.tsx:30` gives every asset one
`aspect-[16/9] object-cover object-top` band and `:45` passes `fills`, which switches off the
intrinsic-width cap at `Media.tsx:44`. Wide assets are therefore upscaled and then cropped:

| Route | Asset | Natural | Drawn | Lost |
|---|---|---|---|---|
| /participate-research | Hertfordshire wordmark | 475x86 | 1160px wide (2.44x) | 68% of width; reads "sity of / dshire" |
| /participate-research | Cambridge | 475x124 | 804px (1.69x) | 53% of width |
| /participate-research | Max Planck / UCL | 475x159 | 627px (1.32x) | 40% of width |
| /blog?page=2 | Sunderland | 475x220 | 453px | 17.5% of width, both edges |
| /blog?page=2 | Orchard roundel | 297x297 | 374x374 (1.26x) | bottom 44%, tagline included |

On the studies index the wordmark is the card's only statement of who is recruiting, and the excerpt
often names no institution. Fix in `web/src/components/content/ArticleCard.tsx`: resolve
`resolveMedia(image)` and branch. Ratio at or above about 1.4 (landscape art and wordmarks) gets
`aspect-[16/9] border-b border-line bg-mist object-contain p-6` and drops `fills` at `:45`, so
`Media.tsx:44` caps each mark at its natural width and the mist ground gives it a plate. Portrait
and square assets keep today's cover crop, which is what round two moved to deliberately because A4
flyers shrink to noise under contain: a ratio branch does not reverse that decision, it scopes it.

**The placeholder plate fires where there is no row to keep level.** On the home page all three
"From The Blog" cards take the no-image branch, so the section opens with a single 1176x210 mist
band holding three copies of a 96x27 mark; a pixel census of one plate returns 97.97% flat ground.
At 390px every grid on the site is one column, so the plate's whole purpose is gone and it costs
573px on home and 1,719px across nine cards on /participate-research. Fix
`ArticleCard.tsx:51`: `className="hidden aspect-[16/9] items-center justify-center border-b
border-line bg-mist md:flex"`, and add a `placeholder` prop threaded from `PostCards` (`:106-116`)
so the home call at `page.tsx:220` can pass `placeholder={false}` alongside `showImages={false}`. No
parity image is touched; this branch renders a decorative div.

**Two clamps fight each other.** `ArticleCard.tsx:63` clamps the title to three lines and `:69`
clamps the excerpt to four, so the card spends its budget on boilerplate and cuts the words that
identify the item. Six of 32 titles on /participate-research are clipped mid-word (three needing
four lines, three needing five) while 18 of 26 excerpts run the full four lines; on /blog?page=2 one
title ends "obsessive-". Meanwhile the excerpt clamp is what drives the row spread: with
`items-stretch`, Biyi's card on /blog?page=2 is blank from y=759 to y=890 (131px) because a
row-mate's excerpt runs four lines and its own runs one. Fix: `:63` `line-clamp-3` → `line-clamp-4`
and `:69` `line-clamp-4` → `line-clamp-2`. That clears every clipped title and takes the worst void
from 131px to 79px.

**Four sizes for one role, six gap pairs for one grid.** Card body copy is 15.52px on
`ArticleCard.tsx:69` (an off-scale literal 0.48px from the token it is avoiding), 14px on
`PeopleSections.tsx:54`, 14px in a different color on `WebinarList.tsx:20` and 16px on the
conference captions. Card titles are 24px in `PageHero`, 20px in `ArticleCard`, 20px teal in
`PeopleSections`, 18px on the home highlights and 18px in `WebinarList`. Grid gaps resolve to 32/24
on the /about-orchard rosters, 16/16 on /about (the compact branch's `gap-4` at
`PeopleSections.tsx:89` merges over the `gap-x-6 gap-y-8` written two lines above), 48/32 on
/webinars, 40/24 on /blog and /participate-research, 32/32 on the highlight bands and the portrait
grids, and 24/24 on the home highlights. Fix: `ArticleCard.tsx:69` `text-[0.97rem]` → `text-sm`;
`WebinarList.tsx:20` `text-faint` → `text-body`; settle every card grid on `gap-x-6 gap-y-10`
(`PeopleSections.tsx:87` and drop `gap-4` from `:89`, `WebinarList.tsx:11`, `PageHero.tsx:30`,
`RenderBlocks.tsx:173`, `page.tsx:53`); and export one card-title class beside `BannerTitle` in
`Banner.tsx` (`text-lg leading-snug font-bold md:text-xl`) consumed from `page.tsx:67`,
`PageHero.tsx:48`, `ArticleCard.tsx:63`, `WebinarList.tsx:15` and `PeopleSections.tsx:44`, leaving
only the color token to vary by surface.

**Two rosters at the wrong density.** /conference and /conference-2 lay 34 portraits three-across at
371px each: 5,824px of a 9,302px document (62.6%) and 5,856px of 8,940px (65.5%). The site's own
roster renders portraits at 144px in the same three-column grid. Both grids also end on a single
card, leaving 773x459 of blank above the footer. `RenderBlocks.tsx:176` → `max-w-measure
grid-cols-2 md:grid-cols-3 lg:max-w-none lg:grid-cols-4`; the cell drops to 270px, the row pitch to
about 390px, and seven chairs land as 4+3 instead of 3+3+1. Update `sizes` at `:184` in the same
pass; today it declares 20rem for a 370.66px cell, so every portrait is drawn from a 320px bitmap at
1.16x. On mobile the same grid holds two columns at 155px, which sets every affiliation at the full
16px body size in a 155px box: roles run to six lines of twelve characters. Give the card a row
layout below `sm`: `ul` at `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, `li` at
`grid grid-cols-[5.5rem_1fr] items-center gap-4 sm:flex sm:flex-col`.

**Portraits are drawn two ways.** `RenderBlocks.tsx:181-185` hand-writes `aspect-square w-full
rounded-full object-contain grayscale` with no ground and no ring, while `RoundImage`
(`Media.tsx:59`) sets `aspect-square rounded-full bg-mist object-cover ring-1 ring-line grayscale`.
On /conference and /conference-2 that means white-backdrop portraits lose their disc entirely beside
dark-backdrop portraits that read as filled circles, in the same row. Render `RoundImage` there
instead, passing `sizes` explicitly: its 160px default would otherwise fetch a 160px bitmap into a
371px box.

**Roster bios are 14px and centered.** `PeopleSections.tsx:54` is `w-full text-center text-sm
leading-relaxed text-body`. All 29 excerpts on /about-orchard measure 14px/22.75 at 318px; ten run
ten lines or more, Chiara Toschi's runs 17 (h=387) and Bally's Foundation 20 (h=455). Centring a
20-line paragraph removes the left edge the eye returns to on every line, and 14px is two steps
below the 18px the same page uses in its impact-report card. Change to `w-full text-left text-base
leading-relaxed text-body sm:text-sm`, keeping `text-center` on the h3 at `:44`. Round two reverted
this in its plan without recording a reason; the measurement stands.

### 9. Return lime to the Donate action

The design system reserves lime for one thing. It is currently spent on four others, and in most
views the actual Donate control is dark green.

- `Footer.tsx:68` and `:90` paint `info@orchardocd.org` and the charity number `1174480` in
  rgb(182,191,0). In the last viewport of every one of the 30 routes reviewed they are the only lime
  on screen, and there is no donate action anywhere in the 413px footer. `:50` and `:77` add
  `hover:text-lime` to fifteen more links.
- `ArticleCard.tsx:52` renders `DashRule`, whose second rect is `#B6BF00` (`DashPattern.tsx:75`), in
  every image-less card plate. On /participate-research that is nine plates; a color census of one
  390x844 viewport returns 1,503 lime pixels in four clusters with no donate action on screen.
- `PageHero.tsx:96` sets `[&_a]:text-lime` on the banner intro, so the /get-involved first screen
  shows three lime elements ("mailing list", "Volunteer" and the announcement strip) of which none
  is donating, while the header Donate measures rgb(0,116,106).

Fix: `Footer.tsx:68` and `:90` → `text-white underline underline-offset-2` (white on the #0F2E2A
footer is 15:1, far above AA), `:50` and `:77` `hover:text-lime` → `hover:text-white`;
`DashPattern.tsx:69-77` take a tone so `DashRule`'s second rect can render `#00655C`, passed from
`ArticleCard.tsx:52`; `PageHero.tsx:96` `[&_a]:text-lime` → `[&_a]:text-white [&_a]:underline
[&_a]:underline-offset-2`. With item 6 putting a Donate button in the mobile bar, lime then marks
the announcement strip and the donate action and nothing else.

## Merged findings

Every surviving finding. Rows that appeared identically on several routes are collapsed.

| Severity | Area | Routes | Problem | Fix location |
|---|---|---|---|---|
| high | clarity | /the-work-we-do, /fundraising-events, /become-a-trustee | Three in-body links 404: `/ocd-webinars`, `/about-us`, `/%23`. Two are the page's only internal link | `seed/links.ts:18-19,35-40` |
| high | clarity | /psilocybin-crowdfunding-campaign | Two donors rendered as `<th scope="col">` column headers above the other 162 | `RenderBlocks.tsx:17,23-35`; `blocks/index.ts:80`; `seed/blocks.ts:114-119` |
| high | clarity | /about-ocd, /first-line-treatment, /beyond-first-line-therapy, /brain-stimulation, /complementary-and-alternative-therapies | Five bordered cards with no image, title or CTA hold one continuous passage cut into three columns at half the measure | `PageHero.tsx:28-38` |
| high | clarity | /first-line-treatment, /beyond-first-line-therapy, /brain-stimulation, /complementary-and-alternative-therapies | Banner h1 is "What Is OCD?"; the page's own name renders as a section-rank h2. First desktop screen is byte-identical across the set | `PageHero.tsx:92`; `[slug]/page.tsx:33,49-50` |
| high | clarity | /complementary-and-alternative-therapies, /beyond-first-line-therapy, /brain-stimulation | Twelve section leads printed twice, verbatim; two end in a mid-sentence ellipsis | `groupBlocks.ts:135` |
| high | clarity | /work-with-us | Four fundraising categories flattened into one 16-item bullet list; one `<br>` swallows a sixth requirement | `seed/blocks.ts:27-30,63-68` |
| high | imagery | /research, /complementary-and-alternative-therapies, /blog/[slug], / | Inline intrinsic `max-width` beats every class, so images overhang their column, paint over their own plate and break the x=132 rail | `Media.tsx:44`; `RenderBlocks.tsx:81` |
| high | imagery | /about-ocd, /research, /conference, /conference-2, /first-line-treatment, /beyond-first-line-therapy, /brain-stimulation, /complementary-and-alternative-therapies, /about-orchard, /join-our-mailing-list, /volunteer, /orchard-ocd-college, /about | One figure rule for every asset kind: 46px specks take a full row, 500px illustrations render at 64px, a 720x900 poster is crushed to 46%, five marks land on five left edges | `RenderBlocks.tsx:79-86,159`; `groupBlocks.ts:195-209` |
| high | imagery | /participate-research, /blog?page=2 | `fills` disables the upscale guard and one aspect serves every ratio: wordmarks upscaled 1.3x-2.4x and cropped 40-68% | `ArticleCard.tsx:30,45` |
| high | layout | /beyond-first-line-therapy | The 8-column side-effects table is 829px inside a 640px scroll box; two columns are off the page with no affordance | `RenderBlocks.tsx:196-199,20-21` |
| high | rhythm | every prose route | Block margins add instead of collapsing; one rank of boundary measures 56, 64, 72, 80, 88 and 96px depending on the preceding block type | `RenderBlocks.tsx:137,80,89,91,96,173` |
| high | rhythm | /blog, /, /about-ocd, /about-orchard, /get-involved, and the four therapy routes | Two section scales: `py-14` with no breakpoint step against `py-16 md:py-20`. Hero-to-content 136px or 160px; footer gap 56/80/96/120px | `Banner.tsx:43`; `PageHero.tsx:27`; `page.tsx:51`; `[slug]/page.tsx:46,60,65`; `NewsletterSignup.tsx:44` |
| high | typography | /conference, /conference-2, /become-a-trustee, /work-with-us, /volunteer, and the four therapy routes | The body has one heading tier: 5 to 12 h2s at 30px/700 rgb(0,101,92) with no rank between a container heading and its parts | `seed/blocks.ts:24`; `RichText.tsx:10` |
| high | typography | / | Desktop h3 == section h2 (both 36px/40); the highlight card h2 (18px) ranks below the pillar h3 (20px) | `page.tsx:88,126` |
| high | typography | /about-ocd, /about-orchard, /get-involved, /first-line-treatment | Hero lede is 20px on a 342px measure and 18px on a 620px one: the only text on the site that shrinks as the viewport grows | `PageHero.tsx:96` |
| high | typography | /about-orchard | 29 roster bios at 14px centered; ten run 10+ lines, the longest 20 | `PeopleSections.tsx:54` |
| high | wasted-space | /our-policy, /our-research-strategy, /our-funding-policy | Banner then a 145px white void then the footer; `main` is 368px against a 413px footer | `layout.tsx:34`; `Banner.tsx:20` |
| high | wasted-space | /conference, /conference-2 | 34 portraits three-across at 371px take 62.6% and 65.5% of the document | `RenderBlocks.tsx:176,184` |
| high | wasted-space | / | Three "From The Blog" cards all take the no-image branch: a 1176x210 mist band at 97.97% flat ground | `ArticleCard.tsx:49-54,99-117`; `page.tsx:220` |
| high | wasted-space | /our-coi-policy | The whole body is one 38px heading in a 198px band; the document overflows the viewport by 52px to reach a footer that is 98% of `main` | `[slug]/page.tsx:30-37,45-54`; `PageHero.tsx:92` |
| high | wasted-space | /the-work-we-do | Bannerless opening: a bare ink h1 on white where every nav sibling opens on a 223px brand band | `[slug]/page.tsx:33,42` |
| medium | clarity | /get-involved | The second highlight card has no heading and its "Learn More" names no destination; both card CTAs, Donate included, render as inline text links while two secondary actions below are 56px filled buttons | `PageHero.tsx:36-51`; `extract.py:794`; `seed/index.ts:239-240` |
| medium | clarity | /webinars | The h1 reads "Webinar" and the first body h2 reads "Webinars" 223px below it; the paragraph under it says the list is above when it is below | `[slug]/page.tsx:70` render order; `groupBlocks.ts:70` |
| medium | clarity | /cookies-privacy, /participate-research/[slug] | The page's only download is a rounded-full outline chip with a dead `gap-2` and no download marker, unlike every control on the site | `RichText.tsx:18-21`, copying `DocumentLink.tsx:13` |
| medium | clarity | /conference, /conference-2 | A 46x46 chevron takes a full row between the venue heading and the action, is not a link, and drops the `href` the seed carries | `RenderBlocks.tsx:79-86`; `seed/blocks.ts:80` |
| medium | clarity | /conference, /conference-2 | The venue map is embedded at zoom 10, so the frame shows 50km of Greater London and no marker is visible | `EmbedFrame.tsx:13-16` (parse the url; do not edit the generated seed) |
| medium | clarity | /participate-research | 32 studies on one 6,560px page with no pagination, while /blog pages the same component at twelve | `StudyList.tsx:6-17`; `lib/payload.ts:41-42`; `[slug]/page.tsx:69` |
| medium | clarity | /about-ocd | Five consecutive paragraphs of one explanation dealt into a 3-column bordered grid; card one opens "These lead to..." whose antecedent is 227px above in the hero | `PageHero.tsx:26-61` |
| medium | imagery | /conference, /conference-2, /about | Roster portraits hand-roll a circle with no ground and no ring, so white cut-outs lose their disc beside dark-backdrop portraits that read as filled discs | `RenderBlocks.tsx:181-185` → `RoundImage` |
| medium | imagery | /about-orchard | Supporter marks get no plate: two hard white squares, a gray disc, a white disc and a black disc in one grid beside 144px ringed portraits | `PeopleSections.tsx:29,32` |
| medium | imagery | /about | The lead group photograph is the only color image on a page of 58 grayscale portraits, and stops 86px short of the text column | `RenderBlocks.tsx:81` |
| medium | imagery | /research | One drawing printed twice within a screen and a half at two scales (429x401 and 331x312); the duplicate check passes them as separate uploads | `RenderBlocks.tsx:81` shared cap |
| medium | imagery | / | Four highlight plates are height-limited, so drawn art swings 118px to 202px inside identical boxes | `page.tsx:62` |
| medium | layout | /conference, /conference-2 | The map renders before the heading that names it and sits twice as close to the block above as to its own heading | `groupBlocks.ts:168-200` |
| medium | layout | /about | Chair and Secretary each get a full 1176px row for one 208px portrait while 56 members fit four to a 238px row | `RenderBlocks.tsx:168-193`; `groupBlocks.ts:172-184` |
| medium | layout | /about-orchard | The lone impact-report card is stretched to 1176px around a 640px column, leaving 470x231 empty, and indents its copy 33px right of the page rail | `PageHero.tsx:28-33` |
| medium | rhythm | /webinars | 175px between the intro and the grid it introduces, from two padded owners meeting head-on; the grid carries no heading of its own | `WebinarList.tsx:9` (`pt-0 md:pt-0`) or `[slug]/page.tsx:46` |
| medium | rhythm | /participate-research/[slug] | Every list sits exactly as far from its own lead-in as from the next block (24px both sides, six times) | `RichText.tsx:12` |
| medium | rhythm | /volunteer | The section title sits 56px above and 56px below: dead center between the paragraph it follows and the section it opens | `RenderBlocks.tsx:71,143` |
| medium | typography | / | Two section paragraphs carry `text-lg` and two do not, so the longest run of prose on the page is the one set smallest | `page.tsx:182,246` |
| medium | typography | /participate-research, /blog?page=2 | The title clamps at three lines while the excerpt is allowed four: six titles are cut mid-word while 18 excerpts run full | `ArticleCard.tsx:63,69` |
| medium | typography | /participate-research/[slug] | 904px of copy at one size, weight and color with no heading of any rank; three sentences that open lists get no rank | `RichText.tsx:6-23` (`[&_p:has(+ul)]`) |
| medium | typography | every route | Six type sizes between 12px and 15.52px, four of them rem literals, so header nav and the masthead Donate render smaller than every in-page button | `Header.tsx:24,77,78,137`; `Footer.tsx:31,36,42,50,61,64,102` |
| medium | typography | /about-ocd, /, /about-orchard, /conference, /get-involved, /the-work-we-do, /cookies-privacy, /research | `leading-tight` is looser than the default at 30px and 36px, so wrapped headings open up while single-line peers stay tight; one size lands on two leadings | `RichText.tsx:9`; `page.tsx:88,147,176,213,243`; `PeopleSections.tsx:82` |
| medium | wasted-space | /get-involved | The page changes width halfway down: a full-width card row, then 640px pinned left with 536px blank for 1,544px of scroll | `groupBlocks.ts:167-216`; `RenderBlocks.tsx:196-200` |
| medium | wasted-space | /about-ocd | Five cards in a three-column grid leave a 371x412 cell empty and 235/147/89px of blank inside three stretched cards | `PageHero.tsx:28-38` |
| medium | wasted-space | /orchard-ocd-college | The whole body is one logo in a 624px band with 760px empty beside it and 112/96px voids above and below | `RenderBlocks.tsx:80-81`; `[slug]/page.tsx:41-53` |
| medium | wasted-space | /blog, /blog?page=2 | `items-stretch` plus a top-packed body pools all leftover height at the card bottom: 131px, 106px and 79px of empty bordered white | `ArticleCard.tsx:69` |
| medium | wasted-space | /webinars | Only 2 of 15 cards carry a description, and it sits below the frame, so one caption inflates all three columns of its row by ~85px | `WebinarList.tsx:18-21` |
| medium | wasted-space | / | The newsletter CTA is alone in a grid column and `items-center` floats it at the row midpoint, aligned with the middle of a paragraph | `page.tsx:241,246,249,251-257` |
| medium | wasted-space | / | The Call For Proposals right column runs 309px past the left, leaving 163,560px of flat green under the Read More button | `page.tsx:202` |
| medium | color | /participate-research, /blog, / | Nine to twelve image-less card plates each render a lime dash, so lime marks "this card has no picture" with no donate action on screen | `DashPattern.tsx:69-77`; `ArticleCard.tsx:52` |
| medium | color | every route | The footer's only two lime elements are an email address and a charity number, and the footer holds no donate action | `Footer.tsx:50,68,77,90` |
| medium | color | /get-involved | Three lime elements on the first screen, none of them donating; the header Donate is dark green | `PageHero.tsx:96` |
| medium | layout | /conference, /conference-2 | The exhibitor logo row collapses to a ragged left-aligned stack at 128/256/91px, and only one mark carries its own plate | `RenderBlocks.tsx:154,156,159` |
| medium | imagery | /conference | The lone Wellcome mark renders 140x133 while three exhibitor marks 224px below are normalized to 64px | `groupBlocks.ts:206-209`; `RenderBlocks.tsx:80-81` |
| medium | imagery | /conference-2 | The Call For Posters flyer, which carries the deadline, is capped to 46% of its natural size with 843px empty beside it | `RenderBlocks.tsx:81` |
| medium | layout | /participate-research/[slug] | The download action renders at pill radius, 18px semibold and 20/8 padding against the site's 4px radius, 16px bold and 28/14 | `RichText.tsx:18-21` |
| low | clarity | /blog?page=2 | Six of twelve cards print their title twice, once baked into the artwork and once as the h3, separated by a 1px border | `ArticleCard.tsx:30` (plate branch from item 8) |
| low | color | / | Three blog cards alternate two teal accents, so with only three cards the middle one simply looks different | `page.tsx:219` |
| low | imagery | /participate-research/[slug] | The featured plate insets 64px at the sides against 25px top and bottom, and requests 288px for a 160px slot | `participate-research/[slug]/page.tsx:44,47,48` |
| low | imagery | /blog/[slug] | Three concentric frames around one photograph: a card hairline, 24-38px of mist, then the asset's own white margin | `blog/[slug]/page.tsx:38,41` |
| low | imagery | /beyond-first-line-therapy | Two section marks are the filled and outlined cuts of one drawing at the same size; the media-id dedupe cannot see it | `RenderBlocks.tsx:81` (a per-page ordinal, not a runtime signature) |
| low | imagery | /conference, /conference-2 | Every roster portrait is drawn from a 320px bitmap into a 371px box because `sizes` declares 20rem | `RenderBlocks.tsx:184` |
| low | imagery | / | The spot mark beside "Learn About Orchard OCD" is pushed to the far right by `justify-between`, 653px from the heading, where 117px of ink reads as dust | `page.tsx:125` |
| low | layout | /psilocybin-crowdfunding-campaign | Table cell text starts 16px right of the page rail while the row rules start on it | `RenderBlocks.tsx:29,40` (`first:pl-0`) |
| low | layout | / | The footer brand column is 84px too narrow for its own social row, stranding YouTube on a second line, while both link columns carry 53px spare | `Footer.tsx:22` |
| low | layout | /volunteer | The page's only image is optically indented 40px from the text rail by its own transparent canvas | `RenderBlocks.tsx:80-81` (plate from item 2) |
| low | rhythm | /blog | Pagination sits 48px under a grid whose own row gap is 40px, with no rule or surface; 820px of its row is empty | `Pagination.tsx:24` |
| low | rhythm | /conference, /conference-2 | A heading sits 32px above a figure but 16px above the grid it introduces | `RenderBlocks.tsx:173` (resolved by item 3) |
| low | rhythm | /conference, /conference-2 | The page opens with three headings in a row at the 56px section step, two of them with no content underneath | `groupBlocks.ts:44`; `RichText.tsx:9` (`[&_h2+h2]:mt-4`) |
| low | rhythm | /fundraising-events, /volunteer, /the-work-we-do, /psilocybin-crowdfunding-campaign | The gap under a leading title is 96px or 64px depending on whether the first block opens with a heading, because the `mt-0` reset never fires under a title | `RenderBlocks.tsx:198` (`isFirst={index === 0}`) |
| low | rhythm | /cookies-privacy, /work-with-us, /become-a-trustee | Four-field label records are spaced like unrelated narrative paragraphs at 24px | `RichText.tsx:8` (`[&_p:has(>strong:first-child)]:my-2`) |
| low | rhythm | /work-with-us | Five benefits render as one `<br>`-broken slab while the comparable "Essential" list is bulleted | `seed/blocks.ts:21-22` |
| low | typography | /this-page-does-not-exist | The page's only sentence breaks 597px / 58px, leaving "rebuilt." alone above the only button | `not-found.tsx:7` (`text-balance`) |
| low | typography | /terms-of-use, /volunteer, /the-work-we-do, /about, /join-our-mailing-list | No lead step on the opening paragraph, so a legal page goes 60px straight to 18px with no entry point | `RenderBlocks.tsx:71,198` |
| low | typography | /research | Three CTA pills identical in box, color and weight render in three different letter cases | `Button.tsx:18-19` (CSS `uppercase`, DOM text untouched) |
| low | typography | /blog, /participate-research, /blog/[slug], /participate-research/[slug], / | The eyebrow role is 12px at 0.1em in cards and 12.8px at 0.14em in the footer | `ArticleCard.tsx:57`; `Footer.tsx:31,42,61` |
| low | wasted-space | /conference | The chairs grid ends on a single card, leaving 773x459 blank immediately above the footer | `RenderBlocks.tsx:176` (resolved by item 8) |
| low | wasted-space | /psilocybin-crowdfunding-campaign | 82 rows at a 49px pitch carrying one 24px line each; the FAQ document sits below 4,019px of ruled names | `RenderBlocks.tsx:29,40` |
| low | wasted-space | /join-our-mailing-list | The form is 380px below the fold; the first screen is a title and a 514x416 envelope with no field, button or action | `RenderBlocks.tsx:81`; `[slug]/page.tsx:64-68` |
| low | wasted-space | /this-page-does-not-exist | `main` is 482px against a 413px footer, with the message and its recovery button stranded in a 640px column inside a 259px white band | `not-found.tsx:5-14` (render both inside the `Banner`) |

## Mobile

Two decisions cause most of the mobile damage, and both are absences rather than mistakes. First,
image width is decided by the asset and never by the column, so ten of the thirty routes scroll
sideways at 390px and the layout shifts under the reading thumb (item 1). Second, the header is
written for desktop and never given a mobile design: the whole site index is a disclosure panel a
third of which is unreachable, and the charity's conversion action does not exist below 1024px
except for the first 40px of scroll (item 6). Everything else below is a component that carries no
breakpoint step: a card grid, a roster, a footer column or a padding value tuned at 1440 and left
alone.

| Severity | Area | Routes | Problem | Fix location |
|---|---|---|---|---|
| high | layout | /get-involved (452), /about-orchard (435), /about-ocd, /research, /join-our-mailing-list, /about, /first-line-treatment, /complementary-and-alternative-therapies (414), /beyond-first-line-therapy (400) | `document.scrollWidth` exceeds the 390px viewport, so every page including the sticky header drags sideways and artwork is sliced at the screen edge | `Media.tsx:44`; `RenderBlocks.tsx:81` |
| high | layout | every route | The disclosure panel is 1066px tall with `overflow-y: visible` inside a sticky header: Blog, Webinars, Conference, About us and Donate are below the fold at every scroll position | `Header.tsx:148,149` |
| high | clarity | every route | No donate control exists below `lg` except an 85x20 text link in the non-sticky announcement strip, gone after 40px of scroll | `Header.tsx:129,133,142,160` |
| high | clarity | / | The banner dash field is sized from banner height, so at 390px it is 1,077px wide and lies under the h1 and the lead paragraph; white/92 on the lozenge ground measures 4.11:1 against 6.18:1 beside it | `Banner.tsx:21`; `DashPattern.tsx:25` |
| high | typography | / | h1 and five section h2s all render 36px, so the landing page has no title step; every other template steps its h2 to 24px | `page.tsx:88,147,176,213,243` |
| high | imagery | /blog, /blog?page=2, /participate-research | One 16:9 cover band for every ratio: eleven of twelve square posters lose 44% of their height and ten wordmarks lose 40-68% of their width | `ArticleCard.tsx:30,45` |
| high | clarity | /blog, /participate-research | Only the title text of a card is a link: 2.8% of a 342x424 tile, and on short titles a 24px line | `ArticleCard.tsx:36,64` (`relative` + `after:absolute after:inset-0`) |
| high | clarity | /participate-research | 32 studies on one 15,759px page: 18.7 screens with no pagination and no position marker | `StudyList.tsx:6-35`; `lib/payload.ts:41-42` |
| high | wasted-space | /about-ocd, /first-line-treatment, /beyond-first-line-therapy, /brain-stimulation, /complementary-and-alternative-therapies | 2,486px (2.95 screens) of identical prologue before the page's own subject, of which 498px is card border, padding and gaps buying nothing in one column | `PageHero.tsx:28-38` |
| high | layout | /beyond-first-line-therapy | The 8-column table shows 41% of itself in a 342px scroll box, cut mid-word, with no scroll affordance | `RenderBlocks.tsx:20,29,40` |
| high | wasted-space | /our-policy, /our-research-strategy | `main` is 166px and 204px under a 993px footer: 76-78% of the document is site chrome | `layout.tsx:34`; `Banner.tsx:20` |
| medium | wasted-space | every route | The footer's Contact block is the fourth child of a two-column grid, so it sits in a 159px column with a 159x226 empty cell beside it and the address wraps to four lines | `Footer.tsx:60` (`col-span-2 lg:col-span-1`) |
| medium | layout | /blog, /blog?page=2 | Seven 44px pagination steps plus six 8px gaps measure 356px against a 342px column, so page 7 drops to a second row alone | `Pagination.tsx:24` (`gap-1 sm:gap-2 justify-center`) |
| medium | typography | /conference, /conference-2 | The roster keeps two columns at 155px, so affiliations run to six lines of twelve characters and names break in two | `RenderBlocks.tsx:172-180` |
| medium | rhythm | /about-ocd, /get-involved, /first-line-treatment and the therapy set | Card copy sits 49px below the card's top edge and 25px above its bottom, because the rich text keeps its paragraph top margin on top of the card padding | `PageHero.tsx:52` |
| medium | typography | /about-orchard | The hero lede is 20px/28 on 342px: twelve lines averaging 30 characters, more tightly leaded than the 16px/26 body under it | `PageHero.tsx:96` |
| medium | typography | /about-orchard, /about | Roster bios are 14px centered in a 284px column while the article above is 16px in 342px, and the name is only 2px larger than the bio | `PeopleSections.tsx:44,54` |
| medium | wasted-space | /about-orchard | Roster card border and padding cost 53px per side and 7,298px of the 25,891px page, more than the whole article body | `PeopleSections.tsx:22-25,39` |
| medium | wasted-space | /webinars | Eleven posterless tiles render an empty 342x192 rectangle each, 31% of the document | `VideoEmbed.tsx:33-37`; `VideoFacade.tsx:44` |
| medium | imagery | /webinars | The "Watch Now" pill is 57% of the tile width and centered, so it blanks the headline of all four posters that have one | `VideoFacade.tsx:44,45,46` |
| medium | wasted-space | /about | Chair and Secretary each get a 208px frame drawing a 107px disc, 704px of page for two names, with a third of the column blank | `RenderBlocks.tsx:174-180` |
| medium | typography | /about | The compact member card leaves a 129px text box, so 17 of 56 names break into two half-width lines | `PeopleSections.tsx:24,89` |
| medium | clarity | /about | Only the 21px name line inside a 163x170 member tile is tappable, 7.8% of the card | `PeopleSections.tsx:21-52` |
| medium | clarity | /get-involved | Both card CTAs including Donate are 21px inline text links while the two secondary actions below are 56px buttons | `PageHero.tsx:52,96` |
| medium | rhythm | /join-our-mailing-list | 104px between the copy and the form, four times the paragraph rhythm, from `pb-16` plus the form's own `mt-10` | `NewsletterSignup.tsx:44` |
| medium | typography | / | The pull quote keeps 24px type inside 36px padding, so it runs ~17 characters a line and hyphenates a study title | `page.tsx:195` |
| medium | imagery | / | The webinar strip stacks but its 1080x1080 poster stays pinned to the 80px desktop thumbnail height | `page.tsx:225,227` |
| medium | typography | /get-involved | The banner lede is 20px/28 (1.40) while the body under it is 16px/26 (1.63): the tightest leading on the reversed-out text | `PageHero.tsx:96` |
| low | layout | every route | Social pills are 167x31 and nav links have 20px hit boxes with 12px of dead space between them | `Footer.tsx:36,45,48-53` |
| low | wasted-space | /blog, /participate-research, /webinars | The banner does not step its padding down, so a four-letter title occupies a 166px band and 334px (40%) of the first screen is chrome | `Banner.tsx:24` (`py-10 sm:py-16 md:py-20`) |
| low | rhythm | /fundraising-events | Thirteen fundraising ideas separated by 8px while lines inside one idea are 26px apart | `RichText.tsx:13` |
| low | rhythm | /participate-research/[slug] | Seven of nine list items wrap, so 8px item separation reads as one solid block against 26px internal leading | `RichText.tsx:13` |
| low | typography | /participate-research/[slug] | The PDF label wraps to two lines inside a `rounded-full` lozenge whose curve pushes the first characters past the text rail | `RichText.tsx:19,20` |
| low | rhythm | /this-page-does-not-exist | The 404 body pays 56px where every other page pays 64px, and its one sentence is two steps larger than site body copy | `Banner.tsx:43`; `not-found.tsx:7` |
| low | typography | /first-line-treatment | The 693-character opening disclaimer is set as sixteen italic lines, the largest italic run on a site that reserves italic for display headings | `RichText.tsx:6-23` |

## Declined

**Blocked by the parity check.**

- *Dropping the four repeated "INTRODUCTION" h3s on /brain-stimulation so all four sections read
  alike.* `route_expectations` yields `introduction` four times as an expected text unit (12
  characters, exactly at `MIN_UNIT_CHARS`), and the word appears nowhere else in the page's prose.
  Dropping every occurrence makes `'introduction' not in actual_text` at `check_parity.py:446`. The
  single surviving heading is already the resolution of `check_duplicate_text` against
  `check_parity`.
- *Restoring the suppressed heading on the second /get-involved highlight card.*
  `check_duplicate_text.py` forbids the same words twice on one page, and the words are the body h2
  900px below. The mist-callout treatment in the merged table gives the card an identity without
  copy.
- *Any counter, "showing N of M", section intro or relabeled control.* Copy is locked in both
  directions.

**Already declined in rounds one or two, with the stated reason still holding.**

- *Deleting or hiding repeated artwork* (the /research bulb and its second cut, the home social and
  newsletter pairs, the /about-ocd two-mark strip, /beyond-first-line-therapy's filled and outlined
  cuts of one drawing). Every extracted image must be present on its page. Items 2 and 8 normalize
  scale and plate instead.
- *Trimming the mirrored source assets*, including the `sharp().trim()` inside
  `seed/optimize-assets.mjs` proposed for the College logo and the two /about officer portraits.
  Round two declined re-cropping and pointed the correction at the plates. The trim would also
  re-roll every asset's sha256, which re-rolls the content dedupe and the new `signatures`/`likeness`
  collapse added in the last two commits; two padded cuts of one drawing that are distinct today
  could collapse and fire `repeatedImages`. Not worth it for two portraits.
- *Hand-editing the map zoom in `seed/content.json`.* Still declined: `tools/extract.py` regenerates
  the file. The `EmbedFrame.tsx` route in the merged table is a different fix and is not covered by
  that decline.
- *Narrowing the article containers, or centring the 40rem measure.* Round one declined the first,
  round two chose the second deliberately. Six findings this round report the 536px right gutter on
  prose routes as wasted space; that gutter is the arithmetic consequence of a 40rem measure hung
  left inside a 77.5rem container, which is the accepted shape and a fixed part of the design system.
  Only /get-involved survives, because its own card row establishes the full width first and then
  abandons it; it is in the merged table at medium, not headlined.
- *Resizing the home three-speck sparkle mark.* Round one dropped this and kept only the move; the
  move is in the merged table.
- *The per-page `:has()` chain keyed on a file extension.* Round one dropped it. The `p:has(+ul)`
  and `p:has(>strong:first-child)` rules in the merged table are structural, not per-page, and were
  checked against every route before listing.
- *Flipping `items-stretch` back to `items-start` on the hero highlights.* Round one asked for
  `items-start`, round two deliberately replaced it with `items-stretch` plus `h-full` to line up
  card CTAs. Reverting would create the ragged bottom edge the finding complains about. Item 4 adds
  `justify-center` so the leftover height splits instead.
- *Adding the mist placeholder to every image-less card to buy baseline alignment.* Round one
  dropped it, round two adopted it only where rows mix. Item 8 scopes it to widths that have rows.

**Refuted in verification.**

- *"/about-ocd figures have five different right edges."* Measured: all five share x=132 with the
  prose and every asset is transparent artwork with a ragged silhouette, so no box edge is visible.
  The proposed mist plate would create the edges the finding says are misaligned.
- *"/about-orchard headings float free of their text."* The margin collapse is real (23-24px
  heading-to-body against 24px paragraph-to-paragraph) but the heading is 30px bold teal against
  18px gray body with a 56px lead-in above it. No ambiguity renders.
- *"/about-orchard's peer-review list reads as one slab."* Each item opens with a bold ink term on
  top of a bullet marker and a hanging indent: three separators, not one. The proposed `my-4` also
  collapses to 16px, under the 29px leading it is meant to exceed.
- *"Roster portraits are visibly soft."* 4 of 20 are upscaled, the largest by 1.29x, and a 4x crop
  shows marginal smoothing. The proposed `w-28` frame downgrades 20 portraits to spare two and
  inverts the scale against the /about roster.
- *"The blog post h1 wraps early because `max-w-3xl` is inert."* True structurally, but forcing the
  wrapper to 48rem leaves the h1 at exactly two lines on the reviewed route. Zero visible change.
  Kept only as part of the `max-w-measure` removal at `RenderBlocks.tsx:139`, where it does change
  /psilocybin-crowdfunding-campaign.
- *"The article date invites a click."* The eyebrow is 12px uppercase bold at 1.2px tracking with no
  underline, and every link on the site is underlined. The card-versus-article color inconsistency
  is in the merged table at low; the "dead affordance" framing is not, and reversing round two's
  deliberate `text-brand-link` choice needs a decision, not a bug report.
- *"The blog card grid needs a subgrid."* No subgrid exists anywhere in the source, and
  `grid-rows-subgrid` would inherit the ul's `gap-y-10`, putting 40px between each card's date,
  title and excerpt. `WebinarList.tsx:15`'s `lg:min-h-[4.5rem]` is the in-house precedent, and it is
  itself the subject of a separate fix.
- *"Contained plates fix the blog and study crops."* A 374px tile at `aspect-[4/3]` with `p-3` gives
  a 350x256.5 content box, so a 475x475 poster draws at 256px against 374px today, and an A4 flyer
  draws at 0.370x against 0.787x. Round two's stated reason for leaving contain still holds. Only
  the ratio branch in item 8 survives, and it touches landscape assets only.
- *"The webinar scrim muddies the brand."* Measured accurate, but the eleven tiles are identical
  because those eleven webinars have no poster; under the proposed darker gradient they stay
  eleven identical rectangles.
- *"The webinar posters are oversampled nearly three times."* The source JPEGs are 864x486, so a
  371px slot at DPR 2 wants 742 device pixels. The hint is wrong; the cost is not.
- *"The conference roster portraits render blurred."* 1.16x. Sharp at native scale; only a 2x zoom
  shows it. The one-line `sizes` fix is in the merged table at low; the reader cost is not.
- *"Body `<em>` steals the display italic."* An italic drug name in 18px body copy is conventional
  emphasis, and the only competing italic is a 60px h1 thousands of pixels away. The proposed
  `not-italic font-semibold text-ink` also renders `em` almost identically to `strong`.
- *"/participate-research card metadata has no grouping."* Both gaps are 12px, but the date is 12px
  uppercase bold at 1.2px tracking in gray and the title is 20px bold in near-black. Type contrast
  carries the grouping.
- *"The /participate-research accent alternation reads as a category code."* The two teals differ by
  34 and 32 in the green and blue channels on a 6px band. Home's three-card row is in the merged
  table because with three cards the middle one simply looks odd; the 32-card grid is left alone.
- *"/conference's two stacked buttons read as a sequence."* Both are the same color and size and
  immediately adjacent; 176px is 1.9% of the page. A new run-folding pass in `groupBlocks` is
  disproportionate.
- *"/orchard-ocd-college's figure is asymmetric."* The 16px imbalance is between invisible box edges;
  221px of the 416px box is the file's own blank margin. The visible asymmetry belongs to the asset,
  which is declined above.
- *"The header logo, nav and Donate need an active state."* `Header.tsx` genuinely has no
  `aria-current`, but every route named in support of the finding opens with a 60px h1 stating the
  page name, and two of the four routes cited are not in the navigation at all, so the proposed rule
  would change zero pixels on the emptiest one.
- *"/become-a-trustee and /work-with-us need a sticky spec card in the right gutter."* The detector
  as written cannot fire: `buildLayout` flushes the section heading and the spec paragraphs into one
  `richText`, and `splitAtHeadings` will not separate them. The heading-tier fix in item 5 supplies
  the structure these pages are missing.

**Too small to justify a change.**

- The 0.48px difference between `text-[0.97rem]` and `text-base` in isolation. It is worth changing
  only as part of collapsing the six sub-16px sizes in item 8, which is why it appears there and
  not on its own.
- The 8px difference between the /about-ocd highlight band's opening gap (57px) and its closing gap
  (79px), reported separately from the `py-14` retirement in item 3. Item 3 subsumes it, and 24px of
  the closing gap belongs to the video block's own margin.
- `/blog/important-psilocybin-studyupdate`'s 14.5px-per-side frame asymmetry, reported as "visibly
  lopsided". The three-frame finding on the same element is in the merged table; the height cap is
  not worth a second row.
