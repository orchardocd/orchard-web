# Design review

Every page template was screenshotted at 1440x900 and 390x844, critiqued against layout,
typography, rhythm, clarity, wasted space, imagery and consistency, then each finding was
checked a second time against the screenshot and the source. Only findings that survived that
second pass are listed here.

Reviewers worked under the same constraints as the build: copy and illustrations are fixed by
the parity check, the brand palette is fixed, and contrast must stay at WCAG 2.2 AA. Every fix
below is therefore a change to layout, size, spacing, grouping or styling.

**63 findings**: 26 high, 32 medium, 5 low.

## Plan

# Orchard design fix plan

Every item ends with the same gate: `pnpm verify`, then `pnpm start` + `pnpm parity` (all 142 routes, both directions) to prove no text unit or illustration moved section, then re-shoot both viewports.

## 1. Stop grid rows stretching to their tallest cell
**Change:** add `items-start` to every card grid, and stop the card body claiming leftover height.
- `src/components/content/PeopleSections.tsx` line 60 `ul` → `grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3`
- `src/app/(frontend)/blog/page.tsx` → `grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3` (gap 8→6 to match StudyList and home)
- `src/components/content/ArticleCard.tsx` line ~41 → `flex flex-col gap-3 p-7` (drop `flex-1`)
- `src/components/layout/PageHero.tsx` line 23 `ul` → `grid items-start gap-10 md:grid-cols-2`; same line make the column count conditional: `cn('grid items-start gap-10', items.length > 1 && 'md:grid-cols-2')`, and give the `li` `rounded-lg border border-line p-8`

**Pages:** about-orchard, blog-index, about-ocd, get-involved, college.
**Worked when:** no card contains a blank run taller than its own text; the about-ocd highlights band loses both ~520px voids; the lone 2021 Impact Report highlight fills its row and reads as a card.
**Cost:** ~6 lines. Do first.

## 2. One centred content column for article bodies
**Change:** RenderBlocks owns a single column; nothing inside it sets its own width.
- `src/components/blocks/RenderBlocks.tsx`: root → `cn('mx-auto flex w-full max-w-measure flex-col', className)`; imageBlock figure `mx-auto max-w-2xl` → `w-full`; BlockTable `mx-auto max-w-4xl` → `w-full`
- `src/components/blocks/VideoEmbed.tsx` line 33 `mx-auto w-full max-w-4xl` → `w-full`; same for the `VideoPlayer` file branch
- `src/app/(frontend)/blog/[slug]/page.tsx` and `participate-research/[slug]/page.tsx`: wrap each Container's children in `<div className="mx-auto w-full max-w-measure">`; drop `max-w-4xl` from both h1s
- Featured images in the same two files: blog drops `max-h-[32rem] object-cover` (keeps `rounded-lg`); study drops `max-h-[32rem]`, gains `max-h-[12rem]` inside `<div className="rounded-lg bg-mist p-8">`; both set `sizes="(min-width: 768px) 40rem, calc(100vw - 3rem)"`
- Home only: pass `className="max-w-none"` to the `<VideoEmbed>` in `src/app/(frontend)/page.tsx` lines 132-136 so it keeps the full container width there

**Pages:** about-ocd, about-orchard, blog-post, study, conference, college, webinars, get-involved, policy.
**Worked when:** on desktop every figure, video, table and paragraph shares one left edge and one right edge; no page has an ink-free vertical band wider than ~270px next to running text; the Yann's OCD Story portrait renders square and uncropped with its teal caption band; the Hertfordshire wordmark no longer out-scales the h1.
**Cost:** 4 files, mechanical. Largest single reduction in wasted space.

## 3. One card-image tile
**Change:** every card tile becomes the same plate: contained artwork, mist ground, inset, closing rule.
- `src/components/content/ArticleCard.tsx`: add `imageClassName?: string` to `PostCards` props and forward it
- `src/app/(frontend)/blog/page.tsx`: `imageClassName="aspect-video bg-mist object-contain p-4 border-b border-line"`
- `src/components/content/StudyList.tsx` line 23 → `aspect-[4/3] bg-mist object-contain p-4 border-b border-line`
- `src/app/(frontend)/page.tsx` line 62 highlight `MediaImage` → `aspect-[4/3] bg-mist object-contain p-6`

**Pages:** blog-index, studies-index, home.
**Worked when:** no poster word is sliced by a card edge (BBC, "Internationa/OCD/Foundatio", "NEW BLOG", "MARGHERITA" all read whole); no wordmark touches a card border; card 1 on home stops reading as a teal banner; portrait study posters gain roughly 18% linear scale.

## 4. Give lime back to donate
**Change:** add `light: 'bg-white text-brand-link hover:bg-mist'` to `VARIANTS` in `src/components/ui/Button.tsx` (only for dark-green surfaces; `ghost` stays the lower-emphasis option). Switch `variant="donate"` → `variant="light"` on `src/app/(frontend)/page.tsx` lines 187, 230, 252. In `src/components/blocks/VideoFacade.tsx` re-anchor the control: overlay span → `absolute inset-0 flex items-end justify-start bg-gradient-to-t from-ink/70 via-ink/10 to-transparent p-3 transition-colors group-hover:from-ink/85`, pill → `rounded-full bg-white px-5 py-2.5 text-base font-bold text-ink`.
**Pages:** home, about-ocd, webinars, studies-index.
**Worked when:** lime appears exactly twice on home (announcement strip, hero Donate Now); every webinar poster headline is legible with the pill sitting bottom-left over the strapline.

## 5. One owner for vertical rhythm
**Change:** heading margins survive block boundaries; block wrappers stop adding a second gap.
- `src/components/RichText.tsx` PROSE: replace `[&>h2:first-child]:mt-0` with `[&>*:last-child]:mb-0`
- `src/components/blocks/RenderBlocks.tsx`: drop `gap-8` from the root; pass `className={index === 0 ? '[&>*:first-child]:mt-0' : undefined}` to `<RichText>`; give the imageBlock figure `my-4`, the video wrapper `my-6`, the buttonBlock `my-4`

**Pages:** conference, get-involved, about-ocd, policy.
**Worked when:** a section heading has ~48px above it against ~20-36px between paragraphs of one flow; the get-involved fundraising button no longer reads as part of Volunteer; policy body padding measures the same top and bottom (56px).

## 6. One heading ramp
**Change:**
- `src/app/(frontend)/page.tsx`: `text-3xl` → `text-4xl` on the participate (line 146, keep `leading-tight`), proposals (175) and newsletter (242) h2s
- `src/components/layout/PageHero.tsx` line 33: `text-2xl leading-snug` → `text-3xl leading-tight`
- `src/components/RichText.tsx` PROSE: `[&_h2]:text-2xl md:[&_h2]:text-3xl`, `[&_h3]:text-xl md:[&_h3]:text-2xl`
- `src/components/layout/Banner.tsx`: export the BannerTitle class string; `src/app/(frontend)/blog/[slug]/page.tsx` and `participate-research/[slug]/page.tsx` consume it (ink instead of white) so post and study titles get the italic display step
- `src/seed/blocks.ts` line 24: `const level = Math.min(block.level + 1, 4)` and `src/components/RichText.tsx` `[&_h3]:text-brand-link` → `[&_h3]:text-ink`. This one needs a reseed and a pass over every page that already uses h3, so schedule it with the seed run rather than alone.

**Pages:** home, get-involved, blog-post, conference, all RichText pages on mobile.
**Worked when:** desktop ramp reads 60/36/30/24; mobile 36/24/20; conference shows three tiers instead of one; post titles are italic like every other page title.

## 7. Stop stacking empty section padding and stray full-bleed rules
**Change:**
- `src/app/(frontend)/[slug]/page.tsx`: render the body Container only when `page.layout?.length`, and set its padding by whether highlights precede it: `className={(page.hero?.length ?? 0) > 1 ? 'pb-14' : 'py-14'}`
- `src/components/content/StudyList.tsx` line 12 and `src/components/content/WebinarList.tsx`: drop `className="border-t border-line"`

**Pages:** studies-index, get-involved, webinars.
**Worked when:** studies-index goes from hero to first card in one 64/80px gap with no hairline dividing two empty regions; the get-involved 186px band drops to one section gap.

## 8. Webinars: one tile surface, three columns
**Change:** `src/components/blocks/VideoEmbed.tsx` always renders `<VideoFacade>`; delete the bare `<iframe>` branch; make `poster` optional in `src/components/blocks/VideoFacade.tsx` so poster-less tiles keep the `bg-brand-dark` frame and the same control. `src/components/content/WebinarList.tsx`: `grid gap-x-8 gap-y-12 lg:grid-cols-2 xl:grid-cols-3`, `li` → `grid content-start gap-4 lg:row-span-3 lg:grid-rows-subgrid`, h3 `text-xl` → `text-lg`, description → `text-sm leading-relaxed text-faint`.
**Pages:** webinars (also removes 13 third-party iframes from the index).
**Worked when:** fifteen identical tiles in five rows of three, no YouTube chrome before a click, no orphan, frames sharing a top edge per row, page roughly a third shorter.

## 9. Conference and get-involved: group blocks by role
**Change:** in `src/components/blocks/RenderBlocks.tsx` add a pre-pass over `blocks`:
- fold each consecutive `imageBlock` + `richText` speaker pair into a card, emitting each run as `<ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">` (matching PeopleSections), portrait `aspect-square w-full rounded-lg object-cover`, name `text-lg font-bold text-ink` with `mt-4`, role `text-base text-faint` with `mt-1`
- fold each run of consecutive `imageBlock` blocks into `<ul className="flex flex-wrap items-center gap-10">` with `MediaImage className="h-16 w-auto max-w-none object-contain"`; this needs `src/components/ui/Media.tsx` to stop hard-coding `h-auto w-full` (move to overridable defaults)
- size a lead illustration that opens a page as `max-w-sm`, so get-involved's two near-identical scenes differ in scale
- these runs opt out of the item 2 column with `max-w-none`; everything else stays in it
Also `src/seed/assets/2024-08-conference-arrow.svg` + `web/media/2024-08-conference-arrow.svg`: `fill="white"` → `fill="#00655C"`, and pass the dropped `href` through `src/seed/blocks.ts` line 80 so the chevron links to the map again.

**Pages:** conference, get-involved.
**Worked when:** the conference roster drops from ~26,000px to a three-column grid; supporter and exhibitor marks sit on one 64px-tall row; the 129px white band mid-conference disappears; get-involved's two illustrations no longer read as a duplicated render.

## 10. People cards: one component, per-group density
**Change:** `src/components/content/PeopleSections.tsx`
- `PersonCard` `li`: drop `text-center`, add `text-center` to the `h3`, set the excerpt to `w-full text-left text-base leading-relaxed text-body`
- branch on `person.group`: `partners` renders `<MediaImage className="h-20 w-auto max-w-[70%] object-contain" sizes="200px" />` instead of `RoundImage`
- per-group grid class: `college` → `grid items-start gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` with a compact card (`p-4 sm:p-6`, avatar `w-24 sm:w-28 lg:w-32`); other groups unchanged
- surface alternation → `index % 2 === 0 ? 'bg-mist' : undefined` so the first roster separates from the white article
- export the card body as a shared `PersonFigure` and render the college Chair and Secretary through it from `RenderBlocks`, laid out `grid gap-6 sm:grid-cols-2 max-w-measure`, so each name sits in the same box as its portrait
- trim the transparent canvases on `web/media/2025-06-1.png` and `2025-06-2.png` (320x320 with the circle at 78-241) at source rather than scaling in CSS

**Pages:** about-orchard, college.
**Worked when:** no bio is centred past ~6 lines; partner wordmarks are not inside round frames; the college page drops from 18,539px mobile / 7,647px grid to roughly half; each officer's name is nearer their own portrait than the next role label.

## 11. One-line corrections
- `src/components/RichText.tsx` PROSE: add `[&_a_strong]:text-inherit` so bold links stop rendering ink-black (study page, site-wide)
- `src/seed/content.json` line 333: remove the single stray `<br>` inside the OCD Subtypes intro (about-ocd). No words change
- `src/components/layout/Banner.tsx` line 21 → `<DashPattern className="pointer-events-none absolute inset-y-0 right-0 opacity-18" />`, and `src/components/layout/DashPattern.tsx` svg → `className="h-full w-auto"` with `preserveAspectRatio="xMaxYMid meet"`, so no dash is sliced by the banner edge (every banner page; policy is where it shows worst)
- `src/app/(frontend)/[slug]/page.tsx`: when `page.layout[0]` is a richText whose first heading matches `page.title` case-insensitively, pass the site's existing eyebrow treatment to `RenderBlocks` (`text-[0.8rem] font-bold tracking-[0.14em] uppercase text-faint`, `mt-0 mb-6`) so the policy pages stop printing their title twice at h2 rank

---

## Dropped

- **`reserveMedia` mist placeholder on image-less study cards.** Spends a 210-280px empty band per card to buy baseline alignment. Item 1 already lets those cards size to their content, which is the correct answer to a short card.
- **`md:columns-2` masonry for the about-ocd highlights and the rosters.** Multi-column packing reorders cards column-major, which breaks roster order and reading order. `items-start` recovers the space without it.
- **The 12-utility `:has(> a[href$='.pdf']:only-child)` chain in RichText for the study flyer.** A per-page selector chain in the shared prose style, keyed on a file extension. The site already has `DocumentLink`; emit that block from `src/seed/blocks.ts` (line 67) instead if the treatment is wanted.
- **The same `:has()` trick promoting the get-involved highlight CTA to a button.** Same reason. The data is the defect: `seed/content.json` leaves `links: []` and buries the CTA in the slide body. Populate `ctaHref`/`ctaLabel` and the existing `ButtonLink variant="secondary"` branch in `PageHero.tsx` fires on its own.
- **`scale-[1.95]` on the two college officer portraits.** A magic number derived from two specific PNGs that breaks the moment either file is re-exported. Trimming the canvases (item 10) fixes it at source.
- **Narrowing the three article `Container`s to `max-w-[44rem]`.** Item 2 reaches the same 40rem column from inside `RenderBlocks`, and leaves the container wide enough for the conference speaker grid and the logo rows in item 9, which a 44rem container would forbid.
- **Home's three-speck sparkle illustration resize.** The marks are already ~4px; a smaller box makes them less legible. Moving it next to the h3 (`flex flex-wrap items-center gap-4` on `page.tsx` line 125) is the whole fix.

## Findings by page

### home (`/`)

#### Newsletter section wastes half its width: the right column holds only a button

`high` · wasted-space · desktop

**Seen:** The newsletter band runs y4362-4835 (473px tall). The right grid column, x744-1308, contains nothing but the 244x61px "Join Our Mailing List" button at y4570-4635; the remaining ~250,000px of that column is flat #00746A. The button's top edge aligns with nothing in the left column, landing between the paragraph's last line (ends y4640) and the envelope illustrations (start y4680).

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/page.tsx line 240, change the newsletter Container from `grid items-center gap-12 lg:grid-cols-2` to `flex flex-col gap-8`. Add `max-w-measure` to the paragraph on line 245 (it currently has none and would otherwise run the full 1176px container). Then wrap the `Illustrations` (line 248) and the `ButtonLink` (lines 250-256) in a single `<div className="flex flex-wrap items-center gap-10">`, dropping `mt-8` from the Illustrations and `justify-self-start` from the button (a grid-only utility).

#### Lime is spent on four non-donate CTAs, so the donate action no longer owns it

`high` · consistency · both

**Seen:** Lime #B6BF00 buttons appear on the video overlay play pill ("Watch Now", y2210-2280), the Call For Proposals "Read More" (y3463-3514), the webinar band "Watch Now" (y4188-4240) and the newsletter "Join Our Mailing List" (y4570-4635), on top of the lime announcement strip at y0-38. The header "Donate" button at y4300-... is dark green, so of six lime elements only the hero "Donate Now" is a donate action. Four peer CTAs read louder than the masthead donate button.

**Fix:** Add a fifth variant to VARIANTS in /home/eugenio/orchard/web/src/components/ui/Button.tsx: `light: 'bg-white text-brand-link hover:bg-mist'` (#00776D on white is 5.4:1, on #EFF4EE 5.0:1, both AA). In /home/eugenio/orchard/web/src/app/(frontend)/page.tsx switch `variant="donate"` to `variant="light"` on the proposals CTA (line 187), the webinar CTA (line 230) and the newsletter CTA (line 252). In /home/eugenio/orchard/web/src/components/blocks/VideoFacade.tsx change the play pill span from `bg-lime text-ink-on-lime` to `bg-white text-brand-link`. Lime then remains only on the announcement bar and the hero Donate Now.

#### "Learn About Orchard OCD" sparkle illustration is stranded at the far right as three specks

`medium` · imagery · both

**Seen:** On desktop the ctaImages SVG occupies a 64px box at x1240-1307, y1879-1943, flush to the container's right edge and roughly 800px from the left-aligned heading at x132, with completely empty mist between them. The artwork inside is three marks of about 4px each (177 non-background pixels in the whole box), so it reads as dust or a rendering artifact rather than an illustration. On mobile the same box sits alone under the heading as three floating dots.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/page.tsx line 125, change the wrapper from `flex flex-wrap items-center justify-between gap-6` to `flex flex-wrap items-center gap-4` so the sparkle sits immediately after the h3 as an accent instead of being pushed to the margin. Keep `size="h-16"` on the Illustrations call at line 129: the marks are already ~4px, so shrinking the box makes them less legible, not more.

#### The video is centred inside a section where everything else is left-aligned

`medium` · layout · desktop

**Seen:** Measured on the screenshot: the pillar card grid spans x130-1309 and the "Learn About Orchard OCD" heading starts at x132, but the video player spans x272-1167, inset 140px on each side. Its left edge aligns with no other element on the page, so the player reads as a stranded block under its own heading with a dead mist gutter on both sides.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/page.tsx pass `className="max-w-none"` to the `<VideoEmbed>` at lines 132-136. cn() uses tailwind-merge, so `max-w-none` replaces the `max-w-4xl` set in /home/eugenio/orchard/web/src/components/blocks/VideoEmbed.tsx and the player spans the container, lining its left edge up with the heading and the pillar grid.

#### Call For Proposals columns share no alignment line: the heading sits 108px below the quote

`medium` · layout · desktop

**Seen:** In the dark green band (y3066-3690) the quote card starts at y3143 while the "Call For Proposals 2022" heading starts at y3251. `items-center` centres the shorter left column, so the section's two strongest elements float at different heights and roughly 105px of empty green sits above the heading while the column below it ends at y3514 against the illustration's y3612.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/page.tsx line 173, change the proposals Container from `grid items-center gap-12 lg:grid-cols-2` to `grid items-start gap-12 lg:grid-cols-2` so the heading and the quote card share a top edge at the section's padding line.

#### Peer section headings use two different sizes with no rule behind it

`medium` · typography · both

**Seen:** Measured glyph heights on the desktop shot: "From The Blog" is 36px tall (text-4xl) and "Call For Proposals 2022", directly above it, is 28px tall (text-3xl). "About Orchard OCD" is text-4xl while "Want To Participate In Brand New OCD Research?" and "Subscribe to our newsletter" are text-3xl. All five are the same level of section heading, so the ramp reads as an accident, most visibly across the proposals/blog boundary.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/page.tsx change `text-3xl` to `text-4xl` on the three section h2s that are out of step: the participate heading (line 146, keeping `leading-tight`), the proposals heading (line 175) and the newsletter heading (line 242). That leaves the hero h1 in BannerTitle as the only larger, italic step, and card-level h2/h3s untouched.

#### First highlight card's image bleeds to the card edges while the other three float inset

`medium` · consistency · both

**Seen:** In the four-card row (desktop y820-1240) card 1's Orchard OCD Registry image is a solid teal block that runs the full 276px card width and touches the left and right card borders, leaving only a ~30px mist strip above and ~22px below. Cards 2, 3 and 4 show their photo or illustration floating on the mist tint with clear margins on all four sides. Card 1 therefore reads as a coloured banner and the others as icons on a tint. The same split is visible on mobile at y1135-1360.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/page.tsx line 62, change the highlight `MediaImage` className from `aspect-[4/3] bg-mist object-contain` to `aspect-[4/3] bg-mist object-contain p-6`, so every card's artwork is inset by the same amount and none touches the card border.

### about-ocd (`/about-ocd`)

#### The article body has no single column: prose, figures and the video sit on three different axes and the right half of the page is empty

`high` · layout · desktop

**Seen:** Inside the 1176px Container (x=132..1308) the prose is capped by max-w-measure and pinned flush left, running x=132..772, while the imageBlock figures are centred in the full container (subtype illustrations x~460..950) and the video is centred at max-w-4xl (x=272..1167). Three different left edges. Everything right of x=800 is white from the end of the highlights to the footer: the region around the two question marks (y~2490..3450), the region beside every subtype illustration, and worst of all the hoarding paragraph at y~8440..9440, a 33-line slab pinned to the left with the entire right half of the page blank beside it.

**Fix:** Give the article one centred column. In /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx line 71 change the root from `cn('flex flex-col gap-8', className)` to `cn('mx-auto flex w-full max-w-[46rem] flex-col', className)`; pass `className="mx-auto"` to `<RichText>` at line 76 so the 40rem measure centres inside that column; change the figure at line 84 from `mx-auto max-w-2xl` to `w-full`; and in /home/eugenio/orchard/web/src/components/blocks/VideoEmbed.tsx line 33 change `mx-auto w-full max-w-4xl` to `w-full`. Every block then shares the same left and right edge and the column is centred in the Container.

#### Highlight grid rows lock to the tallest cell, leaving two ~500px voids in the right column

`high` · wasted-space · desktop

**Seen:** In the highlights band the right column is blank from y=767 to y=1283 (516px) and again from y=1440 to the end of the band at y~1960 (520px). Only the first card carries the three-figure illustration, so its cell is ~700px tall while the card beside it ("Other unwanted obsessive thoughts...") is four lines; the row height strands that short card at the top of a half-empty cell, and the fifth card sits alone in the left column with the whole right column empty. On a 1440x900 viewport that is more than half a screen of nothing, twice.

**Fix:** In /home/eugenio/orchard/web/src/components/layout/PageHero.tsx line 23 replace `grid gap-10 md:grid-cols-2` on the `ul` with `md:columns-2 md:gap-10`, and on the `li` at line 25 change `flex flex-col gap-4` to `mb-10 flex break-inside-avoid flex-col gap-4`, so the cards pack against each other instead of sitting in fixed rows.

#### The two question-mark illustrations render at mismatched heights and bracket a stranded heading

`medium` · imagery · both

**Seen:** On desktop the first teal question mark occupies y~2490..3020 (about 530px of box height), the "What Causes OCD?" heading follows at y~3075, then a second, visually identical mark at y~3150..3450 (about 300px). Same asset family, nearly two to one in rendered height, with nothing between them but the heading. Both are centred on x~720 while the heading they belong to starts at x=132, so the heading floats between two marks that share no edge with it. On mobile the same pair runs back to back with only the heading between (visible around y=3200..4100).

**Fix:** Cap the illustration box so both marks resolve to the same height. In /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx line 84, after the `w-full` change above, give the figure `[&_img]:mx-auto [&_img]:max-h-56 [&_img]:object-contain md:[&_img]:max-h-80`. Combined with the centred column from the layout finding, both marks then sit on the same axis and the same left edge as the heading.

#### Section headings sit equidistant between the text above and the illustration below, and block boundaries add unmotivated space between paragraphs of the same flow

`medium` · rhythm · both

**Seen:** Measured in the text column: above the "Obsessive Thoughts About Symmetry, Compulsions Of Ordering And Arranging" heading there is ~69px and below it, before its illustration, ~55px. The heading reads as floating rather than owning the figure that follows. Separately, two paragraphs of the same prose flow are pushed ~83px apart at a block boundary (between "...focused treatment strategies." and "The typical dysfunctional thoughts...", visible on both viewports as an unexplained gap) while paragraphs inside a single block sit ~40px apart, so vertical distance carries no meaning.

**Fix:** Let one owner control the rhythm. In /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx drop `gap-8` from the root (already done in the layout finding) and give the non-prose blocks their own margins: `my-4` on the imageBlock figure (line 84) and `my-6` on the VideoEmbed wrapper. In /home/eugenio/orchard/web/src/components/RichText.tsx line 9 change `[&>h2:first-child]:mt-0` to `[&>h2:first-child]:mt-16` so a heading that opens its own block regains its lead-in, and add `[&>*:first-child_h2]:mt-0` to the RenderBlocks root so the first block on the page is not double-spaced under the Container's `py-14`.

#### The video's "Watch Now" pill uses the lime reserved for the donate action

`medium` · consistency · both

**Seen:** The overlay button on the video poster (desktop y~2160..2230, mobile mid-page) is a solid #B6BF00 lime pill and is the loudest element on the page. The same lime is used by the donate strip above the header and by the Donate button in the header, so the page presents two competing primary lime actions and the video's wins on size.

**Fix:** In /home/eugenio/orchard/web/src/components/blocks/VideoFacade.tsx line 39 change `rounded-full bg-lime px-7 py-4 text-lg font-bold text-ink-on-lime` to `rounded-full bg-white px-7 py-4 text-lg font-bold text-ink`. Ink on white keeps AA over the darkened poster and leaves lime to the donate action alone.

#### A stray line break splits the OCD Subtypes intro, leaving an orphan half-line mid-sentence

`low` · typography · both

**Seen:** Under "OCD Subtypes" the paragraph reads "Although patients with OCD share some clinical characteristics, they frequently have symptoms", breaks early at about a third of the measure, and restarts at the left margin with "that are distinctive. Grouping patients according to...". The short ragged line in the middle of an otherwise full-measure block reads as a rendering fault. Visible on desktop and mobile.

**Fix:** Remove the single stray `<br>` inside that paragraph's html string in /home/eugenio/orchard/web/src/seed/content.json (line 333, `...they frequently have symptoms<br>that are distinctive...`). No words change. Do NOT apply a blanket `[&_br]:hidden` in RichText.tsx: the same seed file contains 100+ other `<br>` tags that carry meaning (the numbered three-pillar list, the benefits list, the contact-name blocks), and hiding them all would run those lines together.

### about-orchard (`/about-orchard`)

#### Article column is pinned to the left of the container, leaving a 536px empty band for six screens of scroll

`high` · wasted-space · desktop

**Seen:** The container runs x=132 to x=1308 (max-w-[77.5rem] + px-8 at 1440), but every paragraph from the impact block down to the NIHR logo breaks at x<=772; measured maximum ink across that whole region is x=805, and that is the mission bulb illustration, not text. The band x=772 to x=1308 carries no ink for roughly 6,400px of scroll. The rosters below then use the full width (measured ink to x=1307), so the page reads on two different right edges.

**Fix:** src/app/(frontend)/[slug]/page.tsx line 29: `<Container className="py-14">` becomes `<Container className="max-w-[52rem] py-14">`; cn() is twMerge, so the narrower max-width wins over the base max-w-[77.5rem] and the 40rem measure centers with even ~64px margins. Also change BlockTable's wrapper in src/components/blocks/RenderBlocks.tsx line 18 from `mx-auto max-w-4xl` to `mx-auto max-w-full` so tables on the other slug pages still fill the narrower column.

#### Roster cards stretch to the tallest bio in the row, leaving up to 390px of empty card

`high` · wasted-space · desktop

**Seen:** Our team row 1: Chiara Toschi's 20-line bio sets the row height, so Katherine Selby's 4-line card carries about 340px of blank white below her text and Ilenia's about 280px. Our supporters row 2: Bally's Foundation's 22-line entry leaves about 390px empty in the Cambridge Social Ventures card and about 240px in The Caffeine Partnership. Scientific advisory board row 1: Jim Hagan about 165px, Carolyn Rodriguez about 250px.

**Fix:** src/components/content/PeopleSections.tsx line 60: `<ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">` gains `items-start`, so each card sizes to its own content instead of stretching to row height. Do not switch the `ul` to `columns-*` masonry: multi-column packing reflows the roster into column-major order and breaks the roster ordering.

#### Card bios are center-aligned, so 15 to 22 line paragraphs are ragged on both edges

`medium` · typography · both

**Seen:** Every card body is centered in a ~320px text column: Dr Lynne Drummond's 15 lines, Chiara Toschi's 20 lines, Bally's Foundation's 22 lines and Charlotte's 18 lines all read as centered blocks with no left edge to return to. Short bios (Katherine Selby, Jordan) survive centering, the long ones do not. Same treatment on mobile, e.g. Sabine Bahn's block at 390px.

**Fix:** src/components/content/PeopleSections.tsx PersonCard: drop `text-center` from the `li` (line 17, keeping `flex flex-col items-center gap-4 rounded-lg border border-line p-7`), add `text-center` to the `h3` (line 21), and set the excerpt `p` (line 31) to `w-full text-left text-base leading-relaxed text-body`, which also drops the off-scale `text-[0.97rem]`. `w-full` is required because `items-center` otherwise shrink-wraps the short bios.

#### Illustrations center on the container, not on the text column they belong to

`medium` · imagery · desktop

**Seen:** The vision heart spans x=660-780, the mission bulb x=634-805 and the goals target x=658-781, all centered on x=719, while the paragraph column runs x=132-772 with its center at x=452. Each icon therefore straddles the right edge of the text it sits inside, between its label ('Our Vision') and the sentence that completes it. The Work We Do illustration spans x=404-1043 and the NIHR logo x=432-1007, overhanging the text column by 271px and 235px.

**Fix:** src/components/blocks/RenderBlocks.tsx line 84: `<figure key={key} className="mx-auto max-w-2xl">` becomes `mx-auto max-w-measure`, so no figure can exceed the 40rem prose column; combined with the container change above, figures and prose then share one center line. Do not add a height cap: the 674x494 Work We Do SVG is drawn to read at column width.

#### Partner logos are forced into the same 144px round portrait frame as headshots

`medium` · imagery · both

**Seen:** In Our supporters, the National Lottery Community Fund and Hospital Saturday Fund wordmarks render at roughly 125x40 inside the 144px circular frame, so the artwork fills about a fifth of the box; Cambridge Social Ventures reads as a plain gray disc and The Caffeine Partnership as a solid black disc, both sitting in the same grid row as Faiz Aiz Kermani's round photographic portrait.

**Fix:** src/components/content/PeopleSections.tsx PersonCard line 19: branch on `person.group`. Keep `<RoundImage media={person.photo} className="w-36" sizes="144px" />` for team, scientific-advisory-board and ambassadors; for partners render `<MediaImage media={person.photo} sizes="200px" className="h-20 w-auto max-w-[70%] object-contain" />` (no `aspect-square`, no `rounded-full`; twMerge drops MediaImage's base `h-auto w-full`).

#### The 2021 Impact Report highlight renders as a half-width, unsurfaced fragment 143px above the article

`medium` · layout · both

**Seen:** Desktop: the block's heading and paragraph stop at x=697 because a single item sits in a two-column grid, so the right 568px column is empty. Both viewports: the blank band between 'Download Report' and the 'About Orchard OCD' heading measures 143px, against 35-64px for every other heading break in the article (measured 48, 58, 59, 62, 63, 64). The block carries no border, surface or rule, so it reads as stray prose ahead of the article rather than as a highlight.

**Fix:** src/components/layout/PageHero.tsx HeroHighlights (lines 22-42): make the column count depend on the item count, e.g. `className={cn('grid gap-10', items.length > 1 && 'md:grid-cols-2')}` on the `ul`, and give the `li` the card treatment already used by PersonCard, `rounded-lg border border-line p-8`, so the stacked `py-14` from this Container and the article Container reads as a boundary between two units.

#### First roster opens on the same white ground as the article, so only two of the four rosters get a surface

`low` · rhythm · both

**Seen:** 'Our team' sits on white directly below the white article and the NIHR logo, with nothing but section padding marking the switch from a 640px prose column to a three-column card grid. 'Scientific advisory board' and 'Our volunteers' land on mist, 'Our supporters' back on white, so the boundary that most needs announcing is the only one without a surface change.

**Fix:** src/components/content/PeopleSections.tsx line 54: `className={index % 2 === 1 ? 'bg-mist' : undefined}` becomes `index % 2 === 0 ? 'bg-mist' : undefined`, so the first roster opens on mist against the white article and the alternation continues from there.

### blog-index (`/blog`)

#### object-cover on the card tile slices text and logos out of poster-style artwork

`high` · imagery · both

**Seen:** The default `aspect-[4/3] object-cover` crop cuts through artwork that carries words. Desktop bottom row: the BBC card renders as "B B C" with the final letter sliced by the card edge, and its neighbour reads "Internationa / OCD / Foundatio". The 30 March 2023 webinar card shows "THING YOU NEED TO KNOW ABOUT OCD", "ERSATION WITH DR LYNNE DRUMMOND", "sday 6th April / am UK Time" with the Orchard roundel clipped at the right edge. The 17 June 2024 card has its "NEW BLOG" heading cut in half along the top edge, and the 12 May 2023 card shows only "MARGHERITA" with the line above it sliced. Mobile repeats it: "iohave / pharmaceutic" for the Biohaven logo, "BUTLER H" over "a Care New England" for Butler Hospital, and the 2021 Impact Report illustration loses the watering can and its title band. Portrait photos are zoomed to a face fragment.

**Fix:** `PostCards` in src/components/content/ArticleCard.tsx does not forward `imageClassName`, so the blog grid falls back to the `aspect-[4/3] object-cover` default while StudyList.tsx:23 already uses the correct treatment. Add `imageClassName?: string` to the `PostCards` props and pass it through to `ArticleCard`, then set `imageClassName="aspect-video bg-mist object-contain"` on the `PostCards` call in src/app/(frontend)/blog/page.tsx. Every poster and logo then reads whole against the same mist plate used on the studies index, and the shorter 16:9 tile removes roughly 70px per row.

#### Stretched grid rows inflate imageless cards into 300px+ of empty bordered white

`high` · wasted-space · desktop

**Seen:** Each row is as tall as its tallest card, so short cards become mostly blank box. "This thing's like a Chameleon" (18 May 2020) stops four lines in and leaves about two thirds of its card empty next to the full-height "Singing in the Rain" card. "Myths and Truths surrounding OCD" (12 October 2020) ends after one line of excerpt with roughly 190px of blank white below it. "The walking wounded" (26 May 2020) and "A torturer in my brain" (28 May 2020) both trail long empty tails, and the row above "Singing in the Rain" leaves the left column as a bordered rectangle containing nothing at all. Smaller versions recur down the whole page ("Biyi's OCD Story", "Jared's OCD Story", "Méliane's OCD story").

**Fix:** Add `items-start` to the grid class in src/app/(frontend)/blog/page.tsx so each `li` is its own content height (`grid items-start gap-6 md:grid-cols-2 lg:grid-cols-3`), and drop `flex-1` from the body div in src/components/content/ArticleCard.tsx (`className="flex flex-col gap-3 p-7"`). Take the gap from `gap-8` to `gap-6` at the same time so the blog grid matches StudyList.tsx and the home page grid, which both use `gap-6`.

#### Artwork drawn on white has no plate or divider, so those cards look like they start mid-content

`medium` · consistency · both

**Seen:** The media element carries no background and no bottom border, so white-background assets bleed straight into the white card body. The 28 February 2023 hiring card shows the Orchard logo floating in an unbounded white area, and the same happens on the "NEW ATLAS" card (20 July 2020), the University of Hertfordshire tDCS card (24 April 2023), the "New OCD Awareness Video" card (14 March 2023) and, on mobile, the Biohaven and Butler Hospital cards. In each case the neighbouring card in the same row has a hard edge-to-edge photo block, so one card family shows two different anatomies side by side.

**Fix:** Give the tile a surface and a boundary in the same string added by the imagery fix: pass `imageClassName="aspect-video bg-mist object-contain border-b border-line"` from src/app/(frontend)/blog/page.tsx. The `bg-mist` fill gives every card an identical image plate whether or not the asset has its own background, and `border-b border-line` (the token already used for section rules) closes the plate against the body padding.

### blog-post (`/blog/yanns-ocd-story`)

#### A ~540px dead column runs beside the whole article on desktop

`high` · wasted-space · desktop

**Seen:** The prose column runs x=132-769 (637px, the 40rem `max-w-measure` in RichText) but is left-aligned inside the Container content box that ends at x=1306. Everything from x=769 to x=1306 is blank white for the full height of the article (y=846 to y=3137, about 2,290px of scroll). The featured image directly above spans the full 1174px, so the eye tracks a full-width image, then a narrow left-hugging text block, with a permanent void down the right side. Three widths stack flush left with no shared axis but the left edge.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/blog/[slug]/page.tsx put all three Containers on one centered column: wrap the children of each (date + h1, MediaImage, RenderBlocks) in `<div className="mx-auto w-full max-w-measure">`, and drop `max-w-4xl` from the h1 so the title sits on the same measure. So body blocks keep that axis, change /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx from `mx-auto max-w-2xl` (imageBlock figure) and `mx-auto max-w-4xl` (BlockTable wrapper) to `mx-auto max-w-measure`.

#### Featured image is crop-destroyed on desktop: the subject's head and the teal caption band are cut off

`high` · imagery · desktop

**Seen:** The asset is square: mobile renders it at ~344x347 (y=272-619) showing the full portrait plus a teal band reading "YANN'S OCD STORY" with a rule under it. Desktop renders the same asset at 1174x510 (x=132-1306, y=294-804), a 2.3:1 letterbox produced by `max-h-[32rem] object-cover` on the MediaImage: the cap and forehead are sliced off at the top edge and the entire teal caption band is gone. Roughly two thirds of the image height is discarded, so desktop shows an over-scaled crop of a face while mobile shows a different, complete image.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/blog/[slug]/page.tsx drop `max-h-[32rem] object-cover` from the MediaImage className (keep `rounded-lg`) and render it inside the shared `mx-auto w-full max-w-measure` column from the previous finding, so the natural square ratio renders at 640px wide, uncropped. Set `sizes="(min-width: 768px) 40rem, calc(100vw - 3rem)"` to match the new column and the Container's `px-6`.

#### Post title drops the display treatment every other page h1 uses

`medium` · consistency · both

**Seen:** "Yann's OCD Story" renders upright (roman) bold at 48px from `text-4xl md:text-5xl` in the post page.tsx, while BannerTitle in /home/eugenio/orchard/web/src/components/layout/Banner.tsx sets every other page's h1 as italic Exo at `text-4xl md:text-6xl` with `leading-[1.05]`. The one heading that qualifies as this page's display heading is the only h1 on the site that does not get the display treatment, so it reads as an enlarged section heading rather than a page title.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/blog/[slug]/page.tsx put the h1 on the BannerTitle ramp: `text-4xl leading-[1.05] font-bold tracking-tight text-balance text-ink italic md:text-6xl` (ink on white keeps AA). Extract that class string next to BannerTitle in Banner.tsx and have both consume it so the two cannot drift apart.

#### Title and section headings are nearly the same size on mobile, flattening hierarchy

`medium` · typography · mobile

**Seen:** On the 390px viewport the h1 is 36px (`text-4xl`) and "OCD Onset" / "OCD Advocacy" are 30px (`[&_h2]:text-3xl` in RichText, which has no mobile step), both bold, both `text-ink`, both flush left on the same x. Past the image, the section heading reads as a second title, so nothing signals which heading owns the page. The desktop ramp (48/30/18) is fine; only the mobile step is too small.

**Fix:** In /home/eugenio/orchard/web/src/components/RichText.tsx make the body headings responsive in the PROSE string: `[&_h2]:text-2xl md:[&_h2]:text-3xl` and `[&_h3]:text-xl md:[&_h3]:text-2xl`, giving a 36/24/20/18 mobile ramp while leaving desktop unchanged. This applies site-wide, so every RichText page gets the same mobile step.

### studies-index (`/participate-research`)

#### The page opens on 192px of empty white split by a stranded full-bleed hairline

`high` · wasted-space · both

**Seen:** Desktop pixel scan: the green hero band ends at y=337, the page is pure white from y=338 to y=449, a 1px #DDE1E1 rule runs edge to edge across the full 1440px at y=450, then 80px more white before the first card row starts at y=531. Mobile repeats it exactly: hero ends y=315, 112px white, rule at y=428, 64px white, cards at y=493. The divider separates two empty regions, so it reads as a rendering fault in the first viewport.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/[slug]/page.tsx the `<Container className="py-14">` around `<RenderBlocks blocks={page.layout} />` renders even though RenderBlocks returns null for an empty layout (RenderBlocks.tsx line 66), so it still pays 56px+56px = the measured 112px. Guard it: `{page.layout?.length ? (<Container className="py-14"><RenderBlocks blocks={page.layout} /></Container>) : null}`. Then drop `className="border-t border-line"` from the `<Section label="Participate in research">` in /home/eugenio/orchard/web/src/components/content/StudyList.tsx line 12, since nothing precedes the grid for it to divide. The Section's own `py-16 md:py-20` becomes the whole hero-to-grid gap (64px mobile, 80px desktop).

#### One 16:9 band holds artwork at wildly different scales: posters shrink to illegibility, wordmarks bleed into the card border

`high` · imagery · both

**Seen:** Desktop cards are 374px wide with a 210px-tall aspect-video band. The portrait posters in row 1 render only 150px wide (self-reporting OCD study) and 110px wide (POCD study), leaving 110-130px of mist on each side and body text far below legible size. Mobile is worse: the POCD poster sits ~70px wide inside a 342px card. In the same band, the University of Hertfordshire, City University London and Manchester Metropolitan wordmarks run the full 374px and touch the left and right card borders with zero inset, and the white-background Cambridge logo renders as a white stripe spanning border to border with mist bars above and below.

**Fix:** In /home/eugenio/orchard/web/src/components/content/StudyList.tsx line 23 change `imageClassName="aspect-video bg-mist object-contain"` to `imageClassName="aspect-[4/3] bg-mist object-contain p-4"`. The band grows 210px to 280px on desktop and 192px to 256px on mobile, so height-constrained portrait posters gain about 18% linear scale (150px to ~175px wide), and the 16px inset turns the mist into a consistent frame so no wordmark reaches the card edge. MediaImage renders a border-box `<img>` (Media.tsx line 40), so aspect-ratio still governs the outer band and the padding only insets the contained artwork.

#### Cards with no poster start their text at the card top, so dates and titles sit on three baselines in one row

`medium` · consistency · desktop

**Seen:** Row at y=4654: 'Teenagers with Obsessive-compulsive disorder (OCD)' has no image, so its date sits at y=4692 while the Cambridge and Anglia Ruskin cards beside it start their dates at y=4903, 211px lower; that card is 463px tall with its last text at y=4868, leaving 249px (54%) blank. The row at y=5150 repeats it: 'The University of Cambridge is recruiting OCD patients' and 'Smartphone Psychology study' begin at the card top while 'Brain Explorer App' begins below its media band, and the Smartphone card runs roughly three quarters empty.

**Fix:** In /home/eugenio/orchard/web/src/components/content/ArticleCard.tsx add an opt-in prop `reserveMedia?: boolean` (default false) and replace the `null` arm of the `{image ? <MediaImage .../> : null}` branch (lines 37-43) with `<div className={cn('w-full bg-mist', imageClassName)} aria-hidden />` when it is set; pass `reserveMedia` on the `<ArticleCard>` in /home/eugenio/orchard/web/src/components/content/StudyList.tsx line 16. Keep it opt-in: /home/eugenio/orchard/web/src/app/(frontend)/page.tsx line 215 renders PostCards with `showImages={false}`, so an unconditional placeholder would put three empty mist bands into the landing page blog row.

### study (`/participate-research/ocd-exercise-study`)

#### Featured poster fills the full 1176px container and out-scales the page title by 4x

`high` · imagery · desktop

**Seen:** Measured on study-desktop.png: the University of Hertfordshire wordmark occupies x=132 to x=1306 (1175px) and y=343 to y=555 (212px). The "UH" glyphs fill almost that entire 212px height, while the h1 "OCD & Exercise Study" caps at 46px tall (y=261 to y=307) and stops at x=591. The sponsor logo is therefore the largest and blackest object on the page, and the only element that reaches the container's right edge, so its right edge aligns with nothing else. Inline images in the same article are capped by `mx-auto max-w-2xl` at RenderBlocks.tsx:84, so featured and inline images on one page are sized by two unrelated rules.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/participate-research/[slug]/page.tsx line 44, change the MediaImage class from `max-h-[32rem] rounded-lg object-contain` to `max-h-[12rem] rounded-lg object-contain` and line 45 `sizes` from `(min-width: 1240px) 1200px, 100vw` to `(min-width: 768px) 640px, 100vw` so the browser stops fetching a 1200px asset for a 640px slot. Wrap the MediaImage in `<div className="rounded-lg bg-mist p-8">`: the PNG at src/seed/assets/2022-06-OCD-Exercise-Study.png is verified transparent-background with #1D1D1B glyphs, so mist #EFF4EE gives the floating wordmark a ground and stays far above AA. Mirror the `sizes` change in blog/[slug]/page.tsx line 39.

#### Article column is stranded in the left half of the container, leaving a 520x600px empty white region

`high` · wasted-space · desktop

**Seen:** Container is `max-w-[77.5rem]` with `md:px-8`, giving 1176px of content from x=132 to x=1306. The prose is separately capped by `max-w-measure` (40rem) and ends at x=769; the h1 ends at x=591; the poster runs to x=1306. Three different right edges on one page. The rectangle x=780 to x=1300, y=600 to y=1200 samples to a single unique RGB value (pure white, standard deviation 0.0), roughly 520x600px of blank page with nothing to fill it.

**Fix:** Narrow the article container rather than the text inside it: pass `max-w-[44rem]` to all three `Container` calls in /home/eugenio/orchard/web/src/app/(frontend)/participate-research/[slug]/page.tsx (lines 25, 41, 51). 44rem minus the 2rem `md:px-8` padding on each side lands exactly on the 40rem measure, so back link, date, h1, poster and prose share one centred 640px column with a single right edge. `cn` in lib/cn.ts is twMerge, so the passed `max-w-[44rem]` replaces Container's `max-w-[77.5rem]` rather than colliding with it. Apply the identical change to the three Container calls in /home/eugenio/orchard/web/src/app/(frontend)/blog/[slug]/page.tsx (lines 24, 35, 45), which repeats this structure.

#### Bold link renders in ink black while every other link on the page is teal

`high` · consistency · both

**Seen:** Pixel-sampled on both screenshots: `l.bottoms@hert.ac.uk` renders at mean RGB (36,69,64), the #132824 ink family, on desktop and mobile alike, while `OCD-Exercise-Flyer` one line below samples (17,128,118) and `University of Hertfordshire` in the first paragraph samples (13,126,116), both the #00776D brand-link teal. Two links in adjacent lines get two different colours, and the near-black one reads as emphasised body copy rather than a mailto.

**Fix:** The seed HTML at src/seed/content.json (/studies/6/blocks/3) is `<strong><a href="mailto:...">`, which Lexical normalises to `<a><strong>`, so the PROSE rule `[&_strong]:text-ink` at /home/eugenio/orchard/web/src/components/RichText.tsx line 16 paints the anchor's own text. Add `[&_a_strong]:text-inherit` to the PROSE array; its (0,1,2) specificity beats the (0,1,1) strong rule, so bold inside a link inherits `text-brand-link` from the anchor and follows `hover:[&_a]:text-brand-link-hover` on hover.

#### The flyer download is styled as body copy, not as the site's document treatment

`medium` · consistency · both

**Seen:** The article ends with `OCD-Exercise-Flyer` alone on its own line, rendered in exactly the inline-link treatment of the links inside the paragraphs above: same 18px size, same teal, same underline, separated by the same paragraph gap. The page's one downloadable asset and its take-part action is visually indistinguishable from a mid-sentence reference. The site already has a distinct treatment for downloadable documents in components/blocks/DocumentLink.tsx, which this one never receives because the seed emits it as a richText block (src/seed/blocks.ts:67) rather than a documentBlock.

**Fix:** In /home/eugenio/orchard/web/src/components/RichText.tsx, add a variant targeting a paragraph whose only child is a PDF anchor and give it the treatment already defined at DocumentLink.tsx:13: `[&_p:has(>a[href$='.pdf']:only-child)]:mt-8` plus `[&_p:has(>a[href$='.pdf']:only-child)>a]:inline-flex [&_p:has(>a[href$='.pdf']:only-child)>a]:items-center [&_p:has(>a[href$='.pdf']:only-child)>a]:rounded [&_p:has(>a[href$='.pdf']:only-child)>a]:border-2 [&_p:has(>a[href$='.pdf']:only-child)>a]:border-brand [&_p:has(>a[href$='.pdf']:only-child)>a]:px-6 [&_p:has(>a[href$='.pdf']:only-child)>a]:py-3 [&_p:has(>a[href$='.pdf']:only-child)>a]:no-underline [&_p:has(>a[href$='.pdf']:only-child)>a]:hover:bg-mist`. The href survives seeding unrewritten (links.ts returns /wp-content/ URLs as-is), so the `$='.pdf'` match holds. Label text is untouched.

### webinars (`/webinars`)

#### Lime "Watch Now" pill is centred on every poster and wipes out the poster's own headline

`high` · imagery · both

**Seen:** On all four poster tiles the lime pill lands on the optical centre of the artwork and blanks its lettering. Desktop: "Doubt in OCD" reads "...OUBT IN OCD" with the middle covered; "What are Glutamate and GABA..." loses "GABA AND DO THEY HOLD"; "The neurochemical basis" loses "MARJAN BIRIA" (reads "ARJAN BIRIA"); the ultrasound poster has the tail of "Conversation" cut. The pill measures ~154x56px inside a 564x317px frame. Mobile is worse: on the 342px-wide neurochemical tile the pill spans ~150px, 44% of the frame width, and erases "BASIS OF OCD WITH / MARJAN BIRIA".

**Fix:** In src/components/blocks/VideoFacade.tsx anchor the control to the bottom-left, where every one of these posters carries only the small italic strapline rather than its headline: change the overlay span from `absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors group-hover:bg-ink/40` to `absolute inset-0 flex items-end justify-start p-3 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent transition-colors group-hover:from-ink/85`, and shrink the pill from `px-7 py-4 text-lg` to `px-5 py-2.5 text-base`. Lime on ink-on-lime is unchanged, and the scrim only sits under the pill.

#### Three different surfaces for the same kind of tile in one grid

`high` · consistency · both

**Seen:** The first two tiles render as raw YouTube iframes carrying YouTube's furniture: channel avatar, "MadeOfMillions", a red play badge, an overlay title that repeats the h3 above it ("Live with Orchard: OCD & Future-Forward Treatme..."), a French "Regarder sur YouTube" button, and on the second tile a stray live-chat bubble ("SinMiedo Cross / Hello from California!"). Four tiles render the branded lime facade. The remaining nine render as flat empty dark-green rectangles (unloaded lazy iframes). Side by side down the same two-column grid they read as three unrelated components.

**Fix:** In src/components/blocks/VideoEmbed.tsx always render `<VideoFacade>` and delete the bare `<iframe>` branch; make `poster` optional in src/components/blocks/VideoFacade.tsx (`poster?: Media`) so a poster-less tile keeps the existing `relative aspect-video overflow-hidden rounded-lg bg-brand-dark` frame and shows the same control. Every tile then presents one brand-owned surface, YouTube chrome appears only after a click, and thirteen third-party iframes stop loading on the index.

#### Fifteen tiles in a two-column grid orphan the last one and leave a 564x450px hole

`medium` · wasted-space · desktop

**Seen:** The final tile, "BAP: Public OCD Lecture 'I just can't stop' with Professor Naomi Fineberg + Q&A", sits alone in the left column (y 3920-4290) while the right column is blank from y 3855 to the footer at 4375: a 564x450px empty rectangle. The two-column grid at a 1176px content width also stretches this scannable index to 4811px tall.

**Fix:** In src/components/content/WebinarList.tsx change the list from `grid gap-12 lg:grid-cols-2` to `grid gap-x-8 gap-y-12 lg:grid-cols-2 xl:grid-cols-3`, and drop the h3 from `text-xl` to `text-lg` so the longer titles hold two or three lines in the narrower column. Fifteen items make exactly five rows of three at 1440px, so nothing is orphaned, each frame is a still-comfortable ~371x209px, and the page loses roughly a third of its height.

#### Video frames do not share a top edge across a row because titles run one or two lines

`medium` · layout · desktop

**Seen:** In row 3 "The Brain on OCD with Professor Trevor Robbins" is one line so its frame top sits at y=1678, while "Treating OCD during the COVID Pandemic with Professor Naomi Fineberg" wraps to two lines and its frame top sits at y=1706: a 28px step. The same happens on the "Doubt in OCD" / "What are Glutamate and GABA..." row, where the frames start 27px apart. The frames are the strongest shapes on the page, so the stagger is the first thing the eye catches.

**Fix:** In src/components/content/WebinarList.tsx make each card a subgrid so title, frame and description lock onto shared rows without moving the title below the frame: change the `<li>` from `flex flex-col gap-4` to `grid content-start gap-4 lg:row-span-3 lg:grid-rows-subgrid`. The ragged edge then falls inside the title row, where it does not register.

#### Made of Millions logo is centred against left-aligned prose and reads as a section title

`medium` · imagery · both

**Seen:** On desktop the black caps logo (245x45px) is centred on the 1176px content column at x 597-841 while the heading "Webinars" and the paragraph that names Made of Millions sit hard left at x=132. It has ~50px of blank above, ~55px below, then the full-bleed hairline, so a 230px band holds one 45px logo, and at that isolation it reads as a heading for the grid rather than the partner credit for the link in the sentence above. The same centring against left-aligned text is visible on mobile.

**Fix:** In src/components/blocks/RenderBlocks.tsx, imageBlock case, change `<figure className="mx-auto max-w-2xl">` to `<figure className="max-w-measure">` so the figure's left edge lines up with the prose column. The logo then sits directly under the sentence that names the partner and the intro reads as one block.

#### The two cards that carry a description style it like a second title

`low` · consistency · both

**Seen:** Under "'Everything You Need To Know About OCD'..." and "Can Ultrasound Become an Effective OCD Treatment..." a two-line grey paragraph sits below the frame at nearly body size; the other thirteen cards have nothing there. At that size it reads as a second title rather than a caption, and those two cards run ~55px taller so their grid row bottoms out below every other row.

**Fix:** In src/components/content/WebinarList.tsx change the description paragraph from `text-[0.97rem] leading-relaxed text-body` to `text-sm leading-relaxed text-faint`, matching the figcaption treatment already used in RenderBlocks. #5e6e68 on white is 5.4:1, so AA holds, and the size and colour drop mark it as supporting metadata.

### conference (`/conference`)

#### Speaker roster stacks one 576px portrait per row and fills 89% of the document

`high` · layout · both

**Seen:** Measured on conference-desktop.png: every portrait is exactly 576x576 at x=432-1007, one per row, repeating at y=3324, 4112, 4900, 5658, 6446, 7021... at a ~788px pitch. The roster runs from y=3324 to the footer and is 88.7% of the 29,973px document. Across that whole run, only 1.3% of pixel rows contain any ink right of x=1010, so the strip from x=1010 to the container edge at x=1308 is blank for ~26,000px. Mobile repeats the same one-per-row stack (342px squares) over a 23,036px page.

**Fix:** In src/components/blocks/RenderBlocks.tsx add a pre-pass over `blocks` that folds each consecutive `imageBlock` + `richText` pair (the seed emits exactly that pair per speaker: portrait, then one richText holding the name and role paragraphs) into a card, and emit each run as `<ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">` matching the grid already used in src/components/content/PeopleSections.tsx. Inside the card give the portrait `aspect-square w-full rounded-lg object-cover` via MediaImage's className instead of the shared `figure mx-auto max-w-2xl`, with `sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"`.

#### Every image is centred while every word is flush left, producing six different left edges

`high` · layout · both

**Seen:** Measured x-bounds on desktop: headings and body copy 132-735, buttons 132-322, but hero illustration 520-954, Wellcome 623-816, IOCDF 598-836, OCD Action 384-1055, BAP 597-836, map 272-1167, speaker portraits 432-1007. A speaker's own name starts 300px left of the portrait it belongs to. Mobile is the same: text at x=24, logos centred at 118-268 and 132-256. The cause is `mx-auto` on the imageBlock figure, which cancels the flex column's default cross-axis stretch and makes each figure shrink-to-fit then centre.

**Fix:** In src/components/blocks/RenderBlocks.tsx line 84 change the imageBlock figure from `mx-auto max-w-2xl` to `max-w-2xl self-start`; `self-start` is required, because simply deleting `mx-auto` restores `align-items: stretch` and blows each figure out to the full 1240px container. Do the same in src/components/blocks/VideoEmbed.tsx line 33: `mx-auto w-full max-w-4xl` becomes `w-full max-w-4xl self-start` so the map shares the x=132 edge with its address heading.

#### The conference-arrow illustration is white-filled on white, leaving a 129px empty band mid-page

`high` · imagery · both

**Seen:** Every pixel row from y=2942 to y=3070 on desktop is pure white across the full 1440px width, between the 'At 30 Euston Square, London NW1 2FB' heading (ink ends y=2941) and the 'View Programme' button (starts y=3071). Mobile shows the same blank band at y=2299-2417. The 48px figure is occupying the row but painting nothing: src/seed/assets/2024-08-conference-arrow.svg sets `fill="white"` on its single path.

**Fix:** Change `fill="white"` to `fill="#00655C"` on the path in src/seed/assets/2024-08-conference-arrow.svg (and the copy at web/media/2024-08-conference-arrow.svg). Then in src/components/blocks/RenderBlocks.tsx route assets whose intrinsic width is under ~96px away from the full-row `figure` branch into an inline `w-12 shrink-0` element rendered beside the address heading, so a 48px chevron stops reserving its own row. Note src/seed/blocks.ts line 80 drops the source block's `href` (it links to the Google Maps place), so the chevron is also a dead affordance; pass `href` through and wrap the icon in a link.

#### Section headings get the same air as gaps inside a paragraph group, so the page is one flat stack

`high` · rhythm · both

**Seen:** Measured blank runs on desktop: 38px above 'SUPPORTED BY', 38px above 'EXHIBITORS', 38px above 'Our Speakers', 32px between the two stacked buttons, 33px between a speaker's name and role. Section boundaries and within-section gaps are indistinguishable at 32-38px throughout. Mobile matches: 32px between buttons, 38px before 'Our Speakers'. The `[&_h2]:mt-12` rule never fires because the seed emits each heading as its own single-node RichText block, so `[&>h2:first-child]:mt-0` always matches.

**Fix:** Remove `[&>h2:first-child]:mt-0` from the PROSE string in src/components/RichText.tsx line 9 so the `[&_h2]:mt-12` survives, giving section heads 48px plus the wrapper's 32px flex gap. Keep the RenderBlocks wrapper at `gap-8` for within-section items, and add `first:[&_h2]:mt-0` scoped to the RichText used inside blog/study article bodies if the leading heading there gains unwanted top space.

#### The event title, the date and the section labels all render at one 30px tier

`medium` · typography · both

**Seen:** Measured cap heights are identical across every heading on desktop: 'ORCHARD OCD INTERNATIONAL SCIENTIFIC CONFERENCE' 22px, '4-5TH JUNE 2026' 22px, 'SUPPORTED BY' 22px, 'EXHIBITORS' 22px, and 'Secure Your Spot!' / 'At 30 Euston Square...' / 'Our Speakers' 29px with descenders, i.e. all text-3xl. The source data does carry a distinction, the conference title is level 1 in seed/content.json while the rest are level 2, but src/seed/blocks.ts line 24 clamps with `Math.min(Math.max(block.level, 2), 4)` and collapses them into one h2 tier.

**Fix:** In src/seed/blocks.ts line 24 shift instead of clamping: `const level = Math.min(block.level + 1, 4)`, so a source h1 becomes h2 (text-3xl) and source h2s become h3, preserving the single page h1 already rendered by BannerTitle in src/components/layout/PageHero.tsx. Then in src/components/RichText.tsx line 10 change the h3 rule from `[&_h3]:text-brand-link` to `[&_h3]:text-ink` so the demoted labels read as headings rather than links, leaving a three-step ramp: hero display, 30px title, 24px section label.

#### Supporter and exhibitor logos render at raw intrinsic size, one per row, at wildly different optical weights

`medium` · imagery · both

**Seen:** Measured desktop logo widths: Wellcome 193px, IOCDF 238px, OCD Action 671px (capped by max-w-2xl, and the only one with a filled dark navy rectangle bleeding to hard edges), BAP 239px. The OCD Action banner is 2.8x wider than its neighbours. The three exhibitor marks occupy y=1762 to y=2315, 553px of page for three logos. Mobile is worse: 124px, then a full-bleed 341px band, then 151px.

**Fix:** In src/components/blocks/RenderBlocks.tsx group each run of consecutive `imageBlock` blocks into a single `<ul className="flex flex-wrap items-center gap-10">` and pass `className="h-16 w-auto max-w-none object-contain"` to MediaImage so all marks normalise to a 64px optical height on one left-aligned row. This needs MediaImage in src/components/ui/Media.tsx to stop hard-coding `h-auto w-full` first: move those to defaults that the passed className can override, or the merged `h-16` will lose to `h-auto`.

#### Each speaker portrait sits equidistant from its own name and the previous speaker's affiliation

`medium` · rhythm · both

**Seen:** Measured per speaker on desktop: portrait bottom to name 59px, name to role 33px, role to the next portrait 58px. The face is as close to the caption above it as to the caption below it, so the roster reads as an ambiguous alternating strip. Name and role also share identical treatment, both 18px body text at the same weight and colour, visible on 'Zhen Wang' / 'Associate Professor, Shanghai Mental Health Center, Shanghai Jiao Tong University'. Mobile measures 58/33/58.

**Fix:** Inside the speaker card added to src/components/blocks/RenderBlocks.tsx, render the paired RichText with `className="max-w-none [&_p]:my-0 [&_p:first-child]:mt-4 [&_p:first-child]:text-lg [&_p:first-child]:font-bold [&_p:first-child]:text-ink [&_p:last-child]:mt-1 [&_p:last-child]:text-base [&_p:last-child]:leading-snug [&_p:last-child]:text-faint"`, so the portrait binds to its name at 16px while `gap-8` separates whole cards.

### get-involved (`/get-involved`)

#### The same artwork renders twice, at the same size, 155px apart

`high` · imagery · both

**Seen:** Desktop ink boxes measured off the screenshot: the lead figure (uploads/2022/05/invld.png) draws at x396-988, y957-1470; the fundraising figure (get-involved-first-img.svg) draws at x393-1050, y1625-2123. Only the 'Fundraising & Events' h2 (y1535-1564) sits between them. Both are the same scene: ladder, lime ORCHARD box, dollar coin, megaphone woman. Both come from the single `<figure className="mx-auto max-w-2xl">` in RenderBlocks.tsx, so both are centred in the same 672px box at near-identical scale (592px vs 657px of drawn art). Mobile repeats it at y1312-1529 then y1625-1963, 96px apart. The page reads as a duplicated render.

**Fix:** Stop giving every image the same box in /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx `case 'imageBlock'`. Differentiate by role: an image that has no heading-led run around it (the lead invld.png, block index 0 of this page) renders as `<figure className="max-w-sm">` with no `mx-auto`, flush to the container's x=132 left edge; an image inside a heading-led run renders as the right cell of the two-column pair described in the layout finding. The two then differ in both scale (384px vs half-column) and alignment, and no two centred 672px blocks ever stack.

#### All copy is flush left at x=132 while every illustration is centred, leaving the right 45% of the page empty

`high` · layout · desktop

**Seen:** Measured: headings, paragraphs and buttons all start at x=132 and body lines stop at x=770 (max-w-measure, 40rem). The three figures sit at x396-988, x393-1050 and x427-1014, centred on the 1440px container centre of 720. Nothing shares a left or right edge with anything else. From the 'Fundraising & Events' heading (y1535) to the footer (y3287) the strip from x=770 to the container's right edge at x=1308 (538px, 45% of the content width) carries nothing but the middle band of three illustrations.

**Fix:** In RenderBlocks.tsx, group the flat block list into heading-led runs and render each run as `<section className="md:grid md:grid-cols-2 md:items-center md:gap-12">`: prose plus buttonBlock stack in the left cell (keeping their 40rem measure), the run's imageBlock fills the right cell as `<figure className="w-full">` with `mx-auto max-w-2xl` dropped. The artwork then occupies the empty right column instead of floating in the middle of the page.

#### The same 'Learn More' action is an underlined text link in one place and a solid green button in another

`medium` · consistency · both

**Seen:** 'Learn More' in the right highlight column is a plain underlined teal inline link (desktop y=759-771, x739-838) pointing at the fundraising-events page. The identical label pointing at the identical destination lower down is a filled dark-green pill (x132-275, y2324-2376). The page's conversion action, 'Donate Now' (y=759-771), gets the weakest of the three treatments. The cause is in the data: seed/content.json puts each highlight's CTA inside the slide `body` rich text and leaves `links: []`, so the `ButtonLink variant="secondary"` branch at PageHero.tsx:35-39 never fires.

**Fix:** In `HeroHighlights` in /home/eugenio/orchard/web/src/components/layout/PageHero.tsx, pass a class to `<RichText>` that promotes a trailing lone-link paragraph to the secondary button, mirroring `buttonClasses('secondary')` from /home/eugenio/orchard/web/src/components/ui/Button.tsx: `[&>p:last-child:has(a:only-child)>a]:inline-flex [&>p:last-child:has(a:only-child)>a]:rounded [&>p:last-child:has(a:only-child)>a]:border-2 [&>p:last-child:has(a:only-child)>a]:border-brand [&>p:last-child:has(a:only-child)>a]:px-7 [&>p:last-child:has(a:only-child)>a]:py-3.5 [&>p:last-child:has(a:only-child)>a]:font-bold [&>p:last-child:has(a:only-child)>a]:no-underline`. Use the outlined secondary variant for both columns, not `donate`, so lime stays reserved for the single header Donate button.

#### A section break gets the same spacing as the gap between a heading and its own paragraph

`medium` · rhythm · both

**Seen:** Desktop: the fundraising 'Learn More' button ends at y=2376 and the 'Volunteer' heading starts at y=2414, a 38px gap. The gap from that heading (ends y=2436) to its first paragraph line (y=2472) is 36px. Mobile is identical: 2300 to 2338 is 38px, 2360 to 2395 is 35px. The boundary between two sections is indistinguishable from the join inside one, so the fundraising button reads as belonging to Volunteer.

**Fix:** RenderBlocks.tsx wraps everything in a flat `flex flex-col gap-8` (32px) and RichText.tsx's PROSE zeroes the heading margin with `[&>h2:first-child]:mt-0`. Remove that override from PROSE in /home/eugenio/orchard/web/src/components/RichText.tsx and apply it from RenderBlocks only to the first block (`className={index === 0 ? '[&>h2:first-child]:mt-0' : undefined}`), so a heading that opens a later block keeps its `mt-12`: section breaks become 32+48=80px against 36px intra-section gaps, without adding stray space at the top of the body.

#### The Volunteer illustration trails its own call to action, so the two sections order their artwork differently

`medium` · consistency · both

**Seen:** Fundraising runs heading (y1535) then illustration (y1625-2123) then paragraph then button. Volunteer runs heading (y2414), paragraph (y2472-2573), button (y2635-2686), then a 500px circle-of-people illustration (x427-1014, y2729-3231) that ends the page 56px above the footer. Two adjacent sections of the same kind put the picture in opposite positions, and the page's last action is buried above half a screen of artwork rather than closing the section.

**Fix:** In the run-grouping added to RenderBlocks.tsx, place a run's imageBlock in the right grid cell regardless of where it falls in the block list, and keep prose then buttonBlock stacked in the left cell. Both sections then present as heading plus copy plus button on the left with the illustration alongside, and each ends on its button. The illustration stays inside the Volunteer run, so the section-parity check still passes.

#### A 186px full-width blank band separates the highlights from the first illustration

`medium` · wasted-space · desktop

**Seen:** The last ink of the two-column highlights is the 'Donate Now' and 'Learn More' underline at y=771. The next ink anywhere across the 1440px width is the lead illustration's confetti at y=957. 186px of nothing spans the full page, and the figure's own internal margin adds more before the artwork proper begins.

**Fix:** In /home/eugenio/orchard/web/src/app/(frontend)/[slug]/page.tsx the body `<Container className="py-14">` follows `PageHero`, whose `HeroHighlights` already ends with `Container className="py-14"`, stacking 56+56px plus the RenderBlocks `gap-8`. Make the body padding conditional on highlights existing: `className={(page.hero?.length ?? 0) > 1 ? 'pb-14' : 'py-14'}`, so pages whose hero has no highlight slides keep their top padding under the dark banner.

#### 'Fundraising & Events' is set at two different sizes on the same page

`medium` · typography · both

**Seen:** The heading in the right highlight column renders at 24px (cap height 18px, desktop y540-568) while the identical string lower down renders at 30px (cap height 22px, y1535-1564); same mismatch for 'Donate Now' at 24px against 'Volunteer' at 30px, and the same 18px-versus-20px cap difference on mobile. Source confirms it: PageHero.tsx:33 uses `text-2xl`, RichText.tsx PROSE uses `[&_h2]:text-3xl`. Four h2s, two steps of the ramp, no rank difference between them.

**Fix:** Change the `HeroHighlights` heading in /home/eugenio/orchard/web/src/components/layout/PageHero.tsx from `text-2xl leading-snug font-bold text-ink` to `text-3xl leading-tight font-bold text-ink` so it matches `[&_h2]:text-3xl [&_h2]:leading-tight` in /home/eugenio/orchard/web/src/components/RichText.tsx and all four h2s land on one step.

### college (`/about`)

#### Two officer portraits burn ~930px of desktop height on 158px circles

`high` · wasted-space · both

**Seen:** Desktop: the "Chair" label ends at y=1351, the Secretary's name ends at y=2263, so 912px of page carries two portraits and four short lines. The Chair circle measures x 641-798 by y 1474-1632, i.e. 158px, with 123px of blank above it and 133px below before the name. Mobile repeats it: circle y 1356-1456 (100px) with 96px blank above and 106px below. The blank is baked into the uploads: web/media/2025-06-1.png and 2025-06-2.png are 320x320 canvases whose visible circle occupies only pixels 78-241, so ~24% of the canvas on every side renders as empty page.

**Fix:** In /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx the imageBlock case sends every upload through `figure className="mx-auto max-w-2xl"` with MediaImage's `h-auto w-full`; because `mx-auto` makes the figure a shrink-to-fit flex item it lays out at the PNG's intrinsic 320px, dead margin included. Add a branch when resolveMedia(block.image) has width === height && width <= 400 that renders `<figure className="w-40 overflow-hidden rounded-full"><MediaImage media={block.image} sizes="160px" className="scale-[1.95]" /></figure>`. The 1.95 is 320/164, the canvas-to-circle ratio of these two files, so the circle fills the 160px frame and the transparent band stops occupying layout.

#### Each officer's name sits 133px below their portrait but 39px above the next role label

`high` · clarity · both

**Seen:** Desktop: Chair portrait ends y=1633, "Naomi Fineberg" ink starts y=1765 (132px away), "Secretary" starts y=1821, only 38px below her name. Mobile: portrait ends 1456, name at 1562 (106px), "Secretary" at 1618 (39px). The nearest neighbour of every name is the next person's role, so the block reads as "Chair / [photo] / Naomi Fineberg Secretary".

**Fix:** Two causes in /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx. First, the 78px transparent band under the portrait, removed by the cropped `w-40 overflow-hidden rounded-full` branch above. Second, the flat `flex flex-col gap-8` wrapper puts 32px after the figure while the name and the following role live in one richText where `[&_p]:my-5` and `[&_h4]:mt-7` in /home/eugenio/orchard/web/src/components/RichText.tsx collapse to 28px. Render the portrait branch inside a wrapper carrying `mb-0` and drop the outer gap for it to `gap-2`, so roughly 8-12px sits under the portrait against the unchanged 28px before the next h4.

#### Mobile stacks the 56-member grid one card per row, making the page 18,539px tall

`high` · wasted-space · mobile

**Seen:** At 390px each card spans x 24-366 (342px) and y 2169-2449 (280px) but holds only a 144px avatar (x 123-266) and one name, so about 198px of every card's width is empty. Fifty-six of those stacked is the bulk of the 18,539px page height.

**Fix:** In /home/eugenio/orchard/web/src/components/content/PeopleSections.tsx the `ul` is `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`, so below the 640px sm breakpoint it is one column. The college group is avatar plus name only, unlike the team and advisory groups whose PersonCard renders a bio, so give GROUPS a per-group class: for `college` use `grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` and pass a compact flag into PersonCard that swaps `p-7` for `p-4 sm:p-6` and `RoundImage className="w-36" sizes="144px"` for `className="w-24 sm:w-28 lg:w-32" sizes="(min-width:1024px) 128px, 96px"`. The other groups keep today's classes.

#### Every image is centred while the heading and body copy are left aligned, so nothing shares an edge

`medium` · layout · desktop

**Seen:** The body heading and paragraph start at x=132 and the 40rem measure ends near x=772. The group photo runs x=384 to x=1055, so its left edge is 252px inside the text rail and its right edge overhangs the copy by 283px. Both officer circles are centred on x=719.5 for the same reason while their "Chair" and "Secretary" labels sit at x=132.

**Fix:** In /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx change the imageBlock figure from `mx-auto max-w-2xl` to `max-w-measure` so it stretches to the same 40rem left rail the prose already uses in /home/eugenio/orchard/web/src/components/RichText.tsx, and leave the new small-square portrait branch as `w-40` with no `mx-auto` so the circles start at x=132 under their labels. Note the two changes are coupled: dropping `mx-auto` alone would stretch the 320px portrait PNGs to 640px and double their dead margin, so the cropped frame branch must land in the same edit.

#### The two officers get a weaker treatment than the 56 members below them

`medium` · consistency · both

**Seen:** "Naomi Fineberg" and "Ana Maria Pereira de Souza" render as plain 18px grey body paragraphs with no frame, while every member name below is 20px bold teal centred inside a bordered card. The two most senior people therefore read as less important than the grid entries, and Ana Maria Pereira de Souza appears in both treatments, once as loose text at x=132 and once as the last card of the grid.

**Fix:** Extract the `li` body of PersonCard in /home/eugenio/orchard/web/src/components/content/PeopleSections.tsx into a shared PersonFigure (`flex flex-col items-center gap-4 rounded-lg border border-line p-7 text-center` with the name at `text-xl font-bold text-brand-link`), and in /home/eugenio/orchard/web/src/components/blocks/RenderBlocks.tsx render the Chair and Secretary portrait branch through it, laid out as `grid gap-6 sm:grid-cols-2 max-w-measure`. That also puts each name inside the same box as its portrait, which is the grouping fix the clarity finding needs.

#### Desktop member cards are mostly empty width and the three-column grid runs 5,146px

`medium` · wasted-space · desktop

**Seen:** Card borders sit at x 132-507, 532-907 and 932-1307, so each card is 375px wide and carries a 144px avatar (x 248-391) plus one centred name: with `p-7` that leaves about 175px of empty width inside every card. Fifty-six members over three columns gives 19 rows at a 270px pitch, from y=2501 to y=7647.

**Fix:** In /home/eugenio/orchard/web/src/components/content/PeopleSections.tsx, the same per-group class introduced for the mobile fix should end `lg:grid-cols-4` for `college`. At 1440 the 1176px container minus three 24px gaps divided by four gives 276px cards, still comfortable around a `w-32` avatar with `p-6`, and cuts the grid from 19 rows to 14.

### policy (`/terms-of-use`)

#### The page title is printed twice, and the repeat outranks everything in the body

`medium` · clarity · both

**Seen:** "Terms of Use" renders at 60px white italic in the banner (desktop ink y=200-245) and again 63px lower at 30px bold ink as the body's first heading (desktop y=400-422, mobile y=340). Nothing sits between them, so the first thing the eye meets in the body is a restatement of the headline it just read, and the body's top heading rank is spent on a label carrying no new information. The same doubling shows on mobile at y=178-205 then y=340.

**Fix:** RenderBlocks already accepts a className on its flex wrapper (src/components/blocks/RenderBlocks.tsx line 71), so no prop threading is needed. In src/app/(frontend)/[slug]/page.tsx, derive the first heading text from page.layout[0] when it is a richText block, compare it trimmed and case-insensitively to page.title, and when they match render `<RenderBlocks blocks={page.layout} className="[&>:first-child>h2:first-child]:mt-0 [&>:first-child>h2:first-child]:mb-6 [&>:first-child>h2:first-child]:text-[0.8rem] [&>:first-child>h2:first-child]:font-bold [&>:first-child>h2:first-child]:tracking-[0.14em] [&>:first-child>h2:first-child]:uppercase [&>:first-child>h2:first-child]:text-faint" />`, overriding `[&_h2]:text-3xl [&_h2]:text-ink` from the PROSE string in src/components/RichText.tsx. That is the site's existing eyebrow treatment (Footer.tsx line 31, ArticleCard.tsx line 46); text-faint #5e6e68 on white is 5.3:1, so AA holds. The words stay, the element stays an h2, it just reads as a document label rather than a second title. Keep it conditional so genuine first headings on other [slug] pages are untouched.

#### Decorative dashes are sliced flat by the banner's top and bottom edges

`low` · imagery · both

**Seen:** Desktop: at the banner's very first row (y=116) three dashes are already cut off square by the boundary with the white header, at x=923-955, x=1090-1149 (the lime dash, roughly a third of its 20px height lost) and x=1390-1409. Mobile: the top edge cuts two more at row 113 (x=40-99 lime, x=340-359), and the second dash row straddles the banner's bottom edge, leaving three pale half-lozenges at rows 270-277 (x=0-75, x=156-172, x=343-367) hanging on the green-to-white boundary under the title. The banner is 223px tall on desktop and 166px on mobile while the pattern SVG is 560px.

**Fix:** src/components/layout/Banner.tsx line 21 sets `absolute -top-8 -right-10`, which pushes the first dash row 32px above the section and, at short banner heights, drops the second row onto the bottom edge. Anchor the pattern to the banner box and scale it: `<DashPattern className="pointer-events-none absolute inset-y-0 right-0 opacity-18" />`, and in src/components/layout/DashPattern.tsx give the svg `className="h-full w-auto"` with `preserveAspectRatio="xMaxYMid meet"` alongside the existing viewBox. All fourteen dashes then fit whole inside the green field at both 223px and 166px.

#### Body section padding is unequal top versus bottom

`low` · rhythm · both

**Seen:** Desktop: banner ends y=337, first heading ink starts y=400 (62px); last paragraph ink ends y=1208, footer starts y=1290 (82px). Mobile measures identically: 62px above, 82px below. The whole text block therefore sits high in its own section, and since the container's padding is py-14 (56px) on both sides the 20px difference comes from an untrimmed trailing margin, not from the design.

**Fix:** The last paragraph's `[&_p]:my-5` (20px) is not trimmed and adds to the `py-14` on the body Container in src/app/(frontend)/[slug]/page.tsx. In the PROSE string in src/components/RichText.tsx line 9, replace `[&>h2:first-child]:mt-0` with a broader entry `[&>*:first-child]:mt-0 [&>*:last-child]:mb-0`. Both gaps then resolve to the same 56px of section padding.

