# Spot check

Every route the site serves, 32 in all, was rendered against the production server at 1440x900
and at 390x844, screenshotted whole and in viewport-height tiles, and measured element by element
for absolute position, box size, font size, line height, weight, color, margin, padding, grid and
flex settings, and for images the natural pixel size and object fit. The review covers layout,
spacing, typography and illustration only. Wording is the charity's and was not reviewed. Every
number below was measured; the five highest-severity claims and a sample of the rest were
re-measured against the running server and checked against the cited source line before this
document was written.

## What to fix first

Seven changes account for most of the table below. Applying them in this order never undoes
earlier work: the kit primitive is corrected first, then the pages that bypass it are routed back
through it, then the containers that place it.

### 1. Plate has no ground contrast and no size floor

`web/src/components/site/Plate.tsx` is the one component every illustration is supposed to pass
through, and it makes two decisions that fail on contact with the page.

The ground is hard-coded `bg-mist` on line 4. A `tone="mist"` PageSection is also `bg-mist`, so
whenever a figure lands in a mist section the plate is invisible. Measured on
/beyond-first-line-therapy: the plate divs at y=2596, y=5692 and y=9540 all report
`rgb(239, 244, 238)` and their parent sections report `rgb(239, 244, 238)`. The plates at y=3741
and y=7067, in plain sections, are visible. Five figures of one family on one page, two
treatments. The same collision was measured on /about-ocd (plate y=1689 in the mist section
starting y=1534), /first-line-treatment (plate y=3412 in the mist section at y=3256), /conference
(plate y=1406 in the mist section at y=1250) and the nine supporter tiles on /about-orchard at
y=10291, 10775 and 11531. Where the artwork is an opaque JPEG the file's own white rectangle then
becomes the only visible edge, so a white card floats in a band that has no card.

`PLATE_ART` on line 5 is `mx-auto max-h-56 w-auto max-w-full rounded-lg object-contain`. That is a
ceiling with no floor: art smaller than the plate can never grow into it, and line 40 pins the box
at `flow:h-plate` (`--spacing-plate: 14.625rem`, 234px, `styles.css:29`). Measured ink inside the
identical 488x234 plate: /webinars "Made of Millions" 203x28, which is 2.5% of the plate area
beside a two-line paragraph; /research FFOR 440x79; /about-orchard NIHR 440x51; /beyond-first-line
-therapy drawings 244x186; /conference-2 lectern 233x186 inside a 744x234 plate, against 473x378
for the same file on /conference. The same artwork renders larger on a 390px phone than on a
1440px desktop, because below the `flow` breakpoint the plate hugs the art.

Fix in `web/src/components/site/Plate.tsx`: give the plate a ground that reads against every tone
it can land on (line 4), let the art fill the plate box instead of only shrinking into it (line 5,
keeping `object-contain` so ratio is preserved and keeping the `flow:max-h-*` guard on line 33),
and let the plate height follow the art rather than clamping it (line 40, the way the `band`
variant on the same line already does). Add a third `FigureSize` for wide raster wordmarks that
must not be pushed past their natural pixels (`FigureSize` is declared on line 11).

### 2. Six routes render illustration through `Photo` instead of `Figure`

`Photo` (`web/src/components/site/Figure.tsx:10`) is the bare image: `rounded-lg` and nothing
else. It is for photography. Six routes push flat line art, logos and posters through it, so those
figures get no plate, no ground, no size cap and no shared edge.

Measured: /brain-stimulation renders four bare `<img class="h-auto w-full rounded-lg">` at 481x433
(y=1917, 3843, 5710, 7718), right edge x=1301 against a container edge of x=1308, while the same
family of line art on /first-line-treatment, /about-ocd and /beyond-first-line-therapy renders at
186px of ink inside a 488x234 plate. /get-involved pairs a plated 242x186 figure at y=1140 with a
bare 488x413 image at y=1586 in the section immediately below. /research puts three 488x234 plates
at y=499, 1482 and 2065 around one bare 488x278 image at y=968. /volunteer hand-builds its own
`<figure>` around a `Photo` whose white ground sits on a mist section, ending at x=1246 against a
container edge of 1308. /conference-2 pairs a 744x234 plate with a bare 384x480 poster in the same
row, so the two columns end 234px apart. /orchard-ocd-college pushes a logo lockup through
PageBanner's photograph slot (`PageBanner.tsx:38`) and gets a 516x516 white block carrying 348x250
of ink.

Fix: swap `Photo` for `Figure` at `brain-stimulation/page.tsx:68, 134, 200, 270`,
`get-involved/page.tsx:97`, `research/page.tsx:41`, `volunteer/page.tsx:41-48` and
`conference-2/page.tsx:83`, and give `PageBanner.tsx:36-40` a non-photographic aside branch that
renders through `Plate`.

### 3. TextWithFigure strands the figure at both widths

`web/src/components/site/TextWithFigure.tsx` puts the text at 40rem and the figure in the
remaining 488px, tops level, collapsing below 57rem. Both halves of that rule fail on long
sections.

On desktop, `flow:items-start` (line 17) parks a 234px figure at the top of the column and leaves
the rest empty. Measured on /beyond-first-line-therapy: the MEMANTINE grid at y=7067 is
640px + 488px with a text column running to y=9305 and a 234px figure, so 2004px of the right
column is empty. Same section pattern at AAP (1052px empty), AMISULPRIDE (905px) and BRIEF
MENTIONS (763px). /brain-stimulation runs 1339px, 1256px, 1198px and 988px. /webinars leaves a
146px void under a two-line paragraph beside a 234px plate at y=2470. /conference spends 470px of
section height on a 29px line of copy paired with a 234px plate at y=1406.

On mobile the figure is emitted after the whole text column (line 22), so it lands at the bottom
of the section instead of under the heading it belongs to. Measured on /beyond-first-line-therapy:
MEMANTINE h2 at y=9806, its figure at y=12970, 3164px and six subsections later. AAP h2 at y=4951,
figure at y=6814, where it wedges between the AAP prose and the table belonging to it.
/brain-stimulation RTMS h2 y=2302, figure y=4840. /first-line-treatment NEUROTRANSMITTERS h2
y=4693, figure y=6968.

Fix in `TextWithFigure.tsx`: below the `flow` breakpoint the figure opens the section, so give the
figure div `-order-1` and move its gap to the top (line 22). At and above `flow`, either drop
`flow:items-start` for the figure track and make the figure sticky, or split the section in the
page file so the art wraps only the lead. `beyond-first-line-therapy/page.tsx:270` (2238px of prose
under one figure) and `brain-stimulation/page.tsx:200` (1772px) need the split either way.

### 4. Prose infers document structure from element position

`web/src/components/site/Prose.tsx` derives three treatments from where an element happens to sit
rather than from what it is, and all three misfire.

Lines 8 to 12 key a definition-row treatment off `p:has(>strong:first-child)`. `:first-child`
skips text nodes, so any paragraph that reaches a `<strong>` before it reaches any other element
matches. Measured on /about-ocd: the paragraph at x=132 y=1697 reports margin 8/8 while every
other paragraph on the page reports 24/24, and the 8px escapes the Prose box so the text column
starts 8px below the figure it should be level with. Same misfire on /beyond-first-line-therapy
(the paragraph under "AAP USE IN OCD" starts 12px below its heading against 24px everywhere else).
The tinted-card branch on lines 9 to 12 also indents its own text by `px-5` while the tint block
starts at the column edge, so on /work-with-us and /become-a-trustee the job-facts card is the one
block whose text sits at x=152 desktop and x=44 mobile against x=132 and x=24 for everything else,
and the tint it uses is `bg-mist`, the same value as the mist section 80px below it.

Line 14 is `[&_p>em:only-child]:not-italic [&_p>em:only-child]:text-ink`. `:only-child` ignores
text nodes, so it matches any paragraph containing exactly one `<em>`. Probed on
/complementary-and-alternative-therapies: "Movement Decoupling" and "trichotillomania" render
`normal` in `rgb(19, 40, 36)` while "Kundalini yoga", "Relaxation Response" and "Mindfulness
Meditation" in the next paragraph render `italic` in `rgb(62, 81, 76)`. The only difference is one
em versus three. Emphasis words like "both" and "strongly" come out roman ink, which reads as a
run-in heading.

Line 17 sets h4 to `text-base md:[&_h4]:text-lg`, the identical token pair the body itself uses on
line 6. Measured on /work-with-us: h3 20px/28px/700, h4 18px/28px/700, body 18px/29.25px/400. At
390px, h3 18px, h4 16px, body 16px. The ramp drops 36px to 20px in one step and then makes no
step at all, so a two-deep structure reads as one flat list of bold lines.

Fix in `Prose.tsx`: delete lines 8 to 12 and drive the definition-row treatment from explicit
markup (a `<dl>`, or a class set in the page file); delete line 14 and give a standfirst its own
class where one is wanted; and on lines 15 to 17 give the inner ramp steps that differ by more
than 2px, with h4 never landing on the body size.

### 5. Section headings run at two ranks and against no measure

`SECTION_HEADING_CLASSES` (`PageSection.tsx:24`) is `text-3xl leading-[1.1] font-bold text-balance
md:text-4xl`, which renders 36px/39.6px. `PeopleSections.tsx:103` hand-writes `mb-9 text-2xl
leading-[1.1] font-bold text-brand-deep md:text-3xl`, one step below, and builds its own
`Section`/`Container`/`h2` instead of using `PageSection`. Measured on /about-orchard in document
order: 36px at y=793, 1605, 3921, 4711, 5868, 8404 and 30px at y=2009, 6907, 10193, 12015, all at
x=132 with the same `mb-9`. The two ranks interleave, so "Scientific advisory board" cannot be
read as a peer or a child of "The Work We Do". /about is worse: its 20px card h2s at y=1201 come
before its 30px section h2 at y=1456, and 30px is the largest heading on the page.

`SECTION_HEADING_CLASSES` also carries no width cap, so `text-balance` wraps each heading against
the 1176px container while the body sits at 640px. Measured on /work-with-us: "Person
Specification - qualifications/ knowledge/experience" renders 1002px on one line, x=132 to x=1134,
against 320px, 324px, 316px, 447px and 139px for the page's other five h2s and 640px for every
paragraph. /cookies-privacy renders "WHAT OTHER INFORMATION DO WE REQUEST?" at 793px. The banner
h1 is already capped at 768px by `max-w-3xl` (`Banner.tsx:42`); the section heading should honor
the same cap.

Fix: add a width cap to `SECTION_HEADING_CLASSES` on `PageSection.tsx:24`, and render each people
group through `PageSection heading={group.label}` at `PeopleSections.tsx:101-106`, which also
removes the duplicated Section/Container/mb-9 wiring. Then replace the one remaining hand-written
heading literal at `page.tsx:166`, which renders 30px/36px 700 `rgb(19, 40, 36)` and is both a
level inversion inside its own section (its siblings are 20px, its parent h2 is 36px) and the only
heading on the site with no explicit line height.

### 6. Four routes are a banner and a footer with nothing between them

Measured at 1440x900: /our-policy, /our-research-strategy, /our-funding-policy and
/our-coi-policy each report `docHeight=900` with `main` at x=0 y=120 w=1440 h=367 containing
exactly one element, the banner. On /our-policy the only painted content is the h1 "Our Policy" at
60px/63px 700 italic at x=132 y=272 w=768 h=63; the footer starts at y=487, so 152px of empty
brand-deep sits under the title, and that is only because `[&>*:only-child]:grow` on `main`
stretches the banner to fill. At 390x844 `main` measures 156px against a footer of 783px. Each
source file is 11 lines and returns `<PageBanner title="..." />` and nothing else
(`our-policy/page.tsx:10`, `our-research-strategy/page.tsx:10`, `our-funding-policy/page.tsx:10`,
`our-coi-policy/page.tsx:10`). All four are reachable from the "Our research" dropdown and the
footer. /orchard-ocd-college is the same construction with a banner image and `docHeight=1209`.

Fix: give each route a `PageSection` carrying its body. If no body copy exists, remove the routes
and repoint `web/src/lib/site.ts:47-49, 81` and the in-prose link at `about-orchard/page.tsx:276`
at the page that carries the material.

### 7. Card grids disagree on stretch, crop and column count

Four grid components make four different decisions about the same relationship.

`participate-research/page.tsx:28` and `blog/page.tsx:26` both set `items-start`, so bordered cards
in one row end at different heights. Measured li heights on /participate-research at 1440:
356/411/384, 411/384/441, 414/414/469, 441/469/356, giving a 113px rag in the last row. /blog runs
409/381/409, 381/359/409, 436/381/381. The home page uses `items-stretch` for the same card, so the
site already has a precedent.

`ArticleCard.tsx:49` picks its image treatment from `isWideMedia` (`Media.tsx:31-33`,
`WIDE_RATIO = 1.4`), which is the wrong gate for a 16:9 band. Measured on /participate-research:
the POCD flyer is natural 475x1188 and is drawn `object-cover object-top` into 374x210, so 22% of
the poster is visible and the title is sliced through the glyphs; four more flyers at 475x671,
475x674, 475x593 and 389x553 take the same branch. The one asset wider than 1.4, natural 475x180,
takes the `object-contain p-6` branch and is the only card of twelve with a visible mist inset.
The rule is exactly inverted: the art that would fit is padded down, the art that cannot fit is
cropped.

`SpeakerGrid.tsx:11` is `grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4`, so its first column
count starts at 640px. Measured on /conference at 390: the grid template resolves to a single
342px column, the Our Speakers list is 7143px tall and Our Chairs 1829px, out of a document of
13070px. Each cell is 256px to 360px tall to carry a 128px circle, leaving about 107px of empty
gutter on each side of it.

`PeopleSections.tsx:109` switches from grid to `lg:flex lg:flex-wrap` with `lg:flex-[1_1_20rem]` on
line 118, so the last row stretches to consume the leftover track. Measured on /about-orchard "Our
volunteers": row 1 is three li at x=132, 532, 932, each 376x466; row 2 is two li at x=132 and
x=732, each 576x512. Same component, same section, 376px against 576px.

Fix: `items-stretch` at `participate-research/page.tsx:28` and `blog/page.tsx:26`; compare the
media ratio against 16/9 rather than 1.4 at `ArticleCard.tsx:49`; start `SpeakerGrid.tsx:11` at two
columns; keep `PeopleSections.tsx:109` a grid at `lg` and delete the now-dead flex-basis on line
118.

## All findings

| Sev | Area | Routes | Problem | Fix location |
| --- | --- | --- | --- | --- |
| High | Illustrations | /about-ocd, /first-line-treatment, /beyond-first-line-therapy, /conference, /about-orchard, /webinars | Plate ground is `bg-mist`, the same value as a mist PageSection, so the plate is invisible and an opaque asset's own white rectangle becomes the only visible edge. Measured plate and section both `rgb(239,244,238)` at 6 sites. | `site/Plate.tsx:4` |
| High | Illustrations | /webinars, /research, /about-orchard, /beyond-first-line-therapy, /conference-2, /conference | Plate art has a ceiling and no floor, and the plate is pinned at 234px, so ink inside the identical 488x234 box runs from 203x28 to 244x186 by accident of each asset's viewBox. Same file renders 473x378 on /conference and 233x186 on /conference-2. | `site/Plate.tsx:5, 33, 40` |
| High | Illustrations | /brain-stimulation, /get-involved, /research, /volunteer, /conference-2, /orchard-ocd-college | Illustration rendered through `Photo`, so no plate, ground, edge or size cap. /brain-stimulation shows 4 bare images at 481x433 against 186px of ink for the same art family on three sibling routes. | `brain-stimulation/page.tsx:68,134,200,270`; `get-involved/page.tsx:97`; `research/page.tsx:41`; `volunteer/page.tsx:41-48`; `conference-2/page.tsx:83`; `site/PageBanner.tsx:36-40` |
| High | Layout | /beyond-first-line-therapy, /brain-stimulation, /first-line-treatment, /about-ocd, /webinars, /conference | `flow:items-start` parks a 234px figure at the top of the 488px column and leaves the rest empty: 2004px on the MEMANTINE section, 1339px on ECT, 1052px on AAP. | `site/TextWithFigure.tsx:17` |
| High | Layout | /beyond-first-line-therapy, /brain-stimulation, /first-line-treatment, /about-ocd, /research | On mobile the figure is emitted after the whole text column, landing 1863px to 3164px below the heading it illustrates and reading as part of the next section. | `site/TextWithFigure.tsx:22` |
| High | Layout | /our-policy, /our-research-strategy, /our-funding-policy, /our-coi-policy | `main` is 367px tall at 1440 and contains only the banner; `docHeight` equals the 900px viewport. Each page file is 11 lines returning a bare `PageBanner`. | `our-policy/page.tsx:10` and the three siblings; `lib/site.ts:47-49,81` |
| High | Typography | /about-orchard, /about | Two h2 ranks, 36px and 30px, interleave down one page at the same x and the same `mb-9`, so the reader sees two ladders where the document has one. | `content/PeopleSections.tsx:101-106` |
| High | Typography | /work-with-us, /become-a-trustee, /beyond-first-line-therapy, /brain-stimulation, /complementary-and-alternative-therapies | h4 renders at exactly body size (18px desktop, 16px mobile) and h3 sits 2px above it at the same weight and color, so two levels read as one. | `site/Prose.tsx:16-17` |
| High | Typography | /complementary-and-alternative-therapies, /brain-stimulation, /beyond-first-line-therapy, /first-line-treatment | `[&_p>em:only-child]:not-italic` matches on element count, not on the paragraph being a standfirst, so the same class of term is italic or roman depending on how many other ems its paragraph holds. | `site/Prose.tsx:14` |
| High | Typography | /about-ocd | The closing section's title is passed as `label`, which is screen-reader only, so an 80px mist band opens straight into body copy with no heading. | `about-ocd/page.tsx:259` |
| High | Layout | /participate-research, /blog | `items-start` on the card grid leaves ragged row bottoms: li heights 356/411/384 then 441/469/356, a 113px rag in one row. | `participate-research/page.tsx:28`; `blog/page.tsx:26` |
| High | Illustrations | /participate-research, /blog | Image treatment picked from `WIDE_RATIO = 1.4` instead of the 16:9 band, so portrait flyers are cropped to 22% and sliced mid-word while the one landscape asset is contained with a 24px inset. | `content/ArticleCard.tsx:49`; `ui/Media.tsx:29-33` |
| High | Layout | /conference, /conference-2 | The speaker grid's first column count starts at `sm`, so at 390px it resolves to one 342px column; the two lists measure 7143px and 1829px of a 13070px document. | `content/SpeakerGrid.tsx:11` |
| High | Layout | /psilocybin-crowdfunding-campaign | A 163-name donor index is rendered as a 2-column table inside `Prose`, pinned to 640px: 82 rows, 3362px tall, with 536px of container empty beside it for the whole run, and 14 rows growing to 65px at 390px because the first column wraps. | `psilocybin-crowdfunding-campaign/page.tsx:119-122` |
| High | Illustrations | /complementary-and-alternative-therapies | The page's only figure is a raster screenshot of a table. Source 1518x394 renders 1128x292 desktop and 294x77 mobile, so its type is about 4.6px on a phone, and at 1176px it breaks the 640px measure for one element. | `complementary-and-alternative-therapies/page.tsx:389-394` |
| High | Illustrations | /about | The two officer portraits are 160x160 `rounded-lg`, full color, with the circle and ring baked into the asset (visible circle about 84px), above 50 member portraits at 128x128 `rounded-full` grayscale with a hairline ring. Three photographic treatments on one page, and the two most senior people read smallest. | `about/page.tsx:17`; assets `2025-06-1.png`, `2025-06-2.png` |
| High | Layout | /get-involved | The Volunteer h2 sits at x=132 while its paragraph starts at x=668, because the section hand-rolls a mirrored `flow:grid-cols-[1fr_40rem]` instead of using `TextWithFigure`. The illustration fills the space under the heading. | `get-involved/page.tsx:77-102` |
| High | Layout | /blog/yanns-ocd-story, /participate-research/ocd-exercise-study | `ArticleHeader` centers the title block against the figure, so a 91px title floats in the middle of a 488px row with 199px of empty column above the date. The kit's own `TextWithFigure` keeps tops level. | `content/ArticleHeader.tsx:24-25` |
| High | Spacing | all 32 routes at 390 | The banner drops to 40px of vertical padding below `sm` while every section keeps 64px, so the banner-to-first-section joint is 104px against 128px section to section, and the title clears the sticky header by less than any section heading below it. | `layout/Banner.tsx:29` |
| High | Spacing | /blog/yanns-ocd-story, /participate-research/ocd-exercise-study | `ArticleHeader` uses `pt-16 pb-12 md:pt-20`, so its bottom padding is 48px at both widths while its top padding steps 64 to 80. The largest boundary on the page gets the smallest gap. | `content/ArticleHeader.tsx:21` |
| Medium | Layout | /work-with-us, /cookies-privacy, /the-work-we-do | Section headings have no width cap, so `text-balance` wraps them against the 1176px container: one renders 1002px on a single line above a 640px column. | `site/PageSection.tsx:24` |
| Medium | Layout | /first-line-treatment | The 4-column dose table is trapped in the 640px prose measure with 536px of container empty beside it, shrunk to 14px/20px by a page-local override against 18px/29.25px body, and never gets a scroll region because `WIDE_COLUMNS = 4` tests `> 4`. Mobile columns 104/83/65/89 with a 97px header row. | `first-line-treatment/page.tsx:236-284`; `site/Table.tsx:5,19` |
| Medium | Typography | /first-line-treatment, /fundraising-events, /beyond-first-line-therapy, /brain-stimulation, /complementary-and-alternative-therapies, /conference | Section headings are typed in full capitals in the page files and rendered by the 36px display h2 with no tracking compensation, while sibling headings on the same pages are title case. One renders 929px wide above a 640px column; on mobile they stack three and four lines deep. The kit reserves uppercase for the 12px tracked eyebrow. | `first-line-treatment/page.tsx:75,128,200`; `fundraising-events/page.tsx:36,102,108,120`; and the equivalent heading props on the other four routes |
| Medium | Spacing | /about-ocd, /beyond-first-line-therapy, /work-with-us, /become-a-trustee | `p:has(>strong:first-child)` matches any paragraph reaching a `<strong>` before another element, cutting its margins from 24px to 8px; the tinted-card branch also indents its own text 20px past the column edge and uses the same mist as the section 80px below it. | `site/Prose.tsx:8-12` |
| Medium | Spacing | /about-ocd | The subtype stack clears the intro list by 16px but separates its own rows by 56px, so the first h3 reads as the last bullet's caption. | `about-ocd/page.tsx:132` |
| Medium | Layout | / | The About section changes width three times: pillar grid 1176px, lead paragraph 640px, video 896px (`max-w-4xl`), leaving 280x504px of bare mist beside the video. | `page.tsx:173` |
| Medium | Illustrations | / | A decorative image next to "Learn About Orchard OCD" is a 118x96 box whose entire visible content is three 9px flecks. It sets the 96px heading row, centers the 36px h3 with 30px of blank above and below, and pushes the heading-to-video gap to 54px. At 390 it takes its own row and puts 144px between heading and video. | `page.tsx:165-167` |
| Medium | Typography | / | "Learn About Orchard OCD" renders h3 at 30px/36px `rgb(19,40,36)`: larger than its own section's 20px sibling h3s, 6px under its parent h2, in a fourth heading color, and the only heading on the site with no explicit line height. | `page.tsx:166` |
| Medium | Layout | / | Highlight card titles are unclamped, so the longest title sets all four card heights and `mt-auto` leaves 83px of void above the buttons in cards 1 and 4 while card 2 is flush. The blog cards on the same page already clamp at 4 lines. | `page.tsx:41` |
| Medium | Layout | / (mobile) | The same five social pills are a ragged 2-column grid in the body and a packed row in the footer, because the footer passes a `flex flex-wrap` override the body does not. The body version leaves 68px to 80px holes and strands YouTube on a third row. | `content/SocialLinks.tsx:14`; `layout/Footer.tsx:36` |
| Medium | Layout | /about-orchard, /about | The people grid switches from grid to flex-wrap at `lg`, so the last row stretches: three 376px cards then two 576px cards in one section. | `content/PeopleSections.tsx:109,118` |
| Medium | Layout | /about (mobile) | In the compact card the portrait sits in a fixed 5.5rem column but the name keeps `text-center` and `items-center`, so 56 stacked rows have 56 different left edges (x=151 to x=189 in the first five). | `content/PeopleSections.tsx:55-56` |
| Medium | Illustrations | /about-orchard | Supporter plates are `bg-mist` inside a mist section, so the only visible edge is whatever each source file bakes in: some logos show a hard white square, others nothing. Logos are capped at 96px inside a 144px plate 318px wide. | `content/PeopleSections.tsx:40,43` |
| Medium | Layout | /about | The officer list carries `max-w-2xl`, so it ends at x=804 with 320px cards while the members grid directly below runs to x=1308 with 276px cards. The page narrows and widens again. | `about/page.tsx:44` |
| Medium | Typography | /about-orchard, /about | Person bios step down from 16px/26px at 390 to 14px/22.75px at 1440. It is the only text on the site that gets smaller on the larger screen, and it sits at 14px beside 18px prose. | `content/PeopleSections.tsx:72` |
| Medium | Spacing | /the-work-we-do | The sentence introducing the funded projects is 160px from the first project, with a ground change landing in the gap, because the intro section's 80px bottom padding meets the next section's 80px top padding. Inside its own group that sentence sits 24px from its neighbors. | `the-work-we-do/page.tsx:36-88` |
| Medium | Layout | /join-our-mailing-list | The form spans 1176px while the copy under it sits at 640px, leaving 536px empty for 210px, and the submit button is stretched to a 360px grid cell against 155px to 168px for every other button on the site. The 56px button also sits beside 52px fields. | `content/NewsletterSignup.tsx:10,44,45,61` |
| Medium | Layout | /conference | The venue map is 901x507 while the same section on /conference-2 caps its map at 768x432, and `items-start` pins a 128px button column beside it, leaving 227x379 of bare brand-deep. | `conference/page.tsx:117-118` |
| Medium | Layout | /conference | The SUPPORTED BY section spends 470px of height on a single 29px line of copy in a 640px column, leaving 205px of empty ground under it and 611px to its right. | `conference/page.tsx:83-87` |
| Medium | Illustrations | /conference | The Secure Your Spot drawing is set as a 1176px band carrying art that is 503px at source, so 350px of empty mist sits on each side. It is the widest object on the page holding the smallest art. | `conference/page.tsx:72-76` |
| Medium | Illustrations | /conference | Three exhibitor logos each carry a baked-in card, so the row renders a card inside a plate three times with three different inner grounds (white 320x160, navy 320x80, white 264x186) inside identical 371x234 plates. | `conference/page.tsx:98-112`, or re-cut the two JPEG assets |
| Medium | Layout | /webinars | Two of fifteen tiles carry a description, so those rows grow by the paragraph height while their neighbors stay short, leaving a 124px gap under two thumbnails against the 40px `gap-y-10`. A four-line title also pushes its thumbnail 26px below its row's. | `content/WebinarList.tsx:13-23` |
| Medium | Illustrations | /webinars | Two play treatments run side by side in one grid: tiles without a poster get a large centered pill on a dash field, tiles with a poster get a smaller pill pinned bottom right. | `blocks/VideoFacade.tsx:90-112` |
| Medium | Illustrations | /blog/yanns-ocd-story | The hero renders the full share-card artwork, whose baked teal caption band occupies 24% of the 488x488 figure and repeats the page title verbatim in white caps beside the italic h1. | `blog/[slug]/page.tsx:35-40` |
| Medium | Illustrations | /participate-research/ocd-exercise-study | The route hand-rolls its own plate at 488x128 against the kit's 234px, so the partner wordmark renders 440x80 flush to the padding box and its "UH" ink (153x78) stands taller than the page's own h1 ink (59px). | `participate-research/[slug]/page.tsx:36-44` |
| Medium | Typography | /this-page-does-not-exist | The 404 banner lead renders 18px/29.25px desktop and 16px/26px mobile against 20px/32.5px and 18px/29.25px for every other banner lead, and `text-balance` shrinks it to 54% of the measure. | `layout/NotFound.tsx:8` |
| Medium | Typography | /research, /our-research-strategy, /our-funding-policy, /our-coi-policy | At 390 the display h1 is 36px/37.8px and the first section h2 is 30px/33px, a ratio of 1.2 against 1.67 on desktop, so title and section heading read as one rank inside the first viewport. | `layout/Banner.tsx:42` or `site/PageSection.tsx:24` |
| Low | Spacing | all 32 routes | The footer opens on 64/40 (desktop/mobile) where sections close on 80/64, so the last joint on every page is 144px and 104px against 160px and 128px everywhere above it. | `layout/Footer.tsx:21` |
| Low | Spacing | / , /get-involved, /conference, /about-orchard, /first-line-treatment, /join-our-mailing-list, /beyond-first-line-therapy, /research, /about | The step from a section's opening block to the block under it is chosen per page: eight values in use (24, 28, 32, 36, 40, 48, 64), three of them on the home page alone for the same lead-then-action relationship. | export one step beside `site/PageSection.tsx:24` and use it at the listed call sites |
| Low | Typography | all 32 routes | The label rank is 12px/16px in four separate roles (banner eyebrow, article eyebrow, card date, footer column headings), below the 14px used by every nav link, button and footer link. | `site/PageBanner.tsx:7`; `content/ArticleCard.tsx:60`; `content/ArticleHeader.tsx:32`; `layout/Footer.tsx:31,43,62` |
| Low | Typography | all 32 routes | There is no type scale in the token file: `styles.css` declares 14 color tokens and 4 spacing tokens and no `--text-*` entries, so heading ranks are declared in five places and 29 distinct size/line-height/weight combinations render across the site. This is why the two hand-written heading literals drifted. | `app/(frontend)/styles.css:3-31` |
| Low | Spacing | /participate-research, /blog | The pagination rule is the same hairline the `ruled` section tone uses, but carries 40/40 of air against the tone's 80/80, so one device reads as two weights of break. | `content/Pagination.tsx:26` |
| Low | Spacing | /cookies-privacy | One section overrides the section padding to `py-10 md:py-12`, giving 48/48 desktop and 40/40 mobile where the page's five other sections all measure 80/80 and 64/64. It holds a single 269x56 link and no heading. | `cookies-privacy/page.tsx:39` |
| Low | Spacing | /complementary-and-alternative-therapies, /beyond-first-line-therapy | A three-line bridging paragraph gets its own unheaded `PageSection` and inherits the full chapter rhythm: a 306px band with 80/80 padding around 146px of copy, between a color edge and a rule. | `complementary-and-alternative-therapies/page.tsx:73-82`; `beyond-first-line-therapy/page.tsx:70-86` |
| Low | Layout | /beyond-first-line-therapy | The Table 2 caption and footnote are locked to the 640px measure while the table between them spans 1176px, so the line labeling the table stops less than halfway across it. | `beyond-first-line-therapy/page.tsx:184-217` |
| Low | Typography | /work-with-us, /become-a-trustee | Both routes drop the banner eyebrow their two sibling Get Involved routes carry, so their banners are 223px holding a single 60px h1 against 405px on /volunteer. | `work-with-us/page.tsx:12`; `become-a-trustee/page.tsx:12` |
| Low | Typography | /first-line-treatment | The banner lead is twelve lines of italic body text under the italic display h1, so two levels share one voice. The identical sentence in the page body renders upright, because `Prose` corrects a whole-paragraph em and the banner lead style does not. | `site/PageBanner.tsx:9-15` |
| Low | Typography | /blog/yanns-ocd-story, /participate-research/ocd-exercise-study | The display h1's italic side bearing pushes its first ink 5px to 8px inboard, so the largest element in the column is the only one off the left spine (h1 ink x=140 against eyebrow x=132, h2 x=133, body x=133). | `layout/Banner.tsx:42` |
| Low | Layout | /this-page-does-not-exist | The 404 is built to fill the viewport and misses by 27px (`docHeight=927` against 900), so a page with one sentence scrolls and the footer's bottom padding is cut at the fold. | `layout/NotFound.tsx:6` via `layout/Banner.tsx:29` |
| Low | Spacing | /research (mobile), /get-involved (mobile) | Once the columns collapse, the figure lands 24px below the button while 32px separates the button from the paragraph above it, so the illustration reads as belonging to the button. /get-involved additionally uses two different gaps for the same relationship, 24px from `TextWithFigure` and 40px from a page-local wrapper. | `site/TextWithFigure.tsx:22`; `get-involved/page.tsx:96` |
| Low | Spacing | all 32 routes at 390 | In the footer's bottom bar the copyright wraps to two lines and the strapline lands 8px under it at the same 14px/20px and the same white/60, so two statements read as one paragraph. | `layout/Footer.tsx:95` |

## Clean

Coverage was 32 routes at 1440x900 and the same 32 at 390x844, every one returning its expected
status.

**/terms-of-use** is the only route with no defect of its own. Measured at 1440: h1 60px/63px 700
italic at x=132 y=200, banner lead 20px/32.5px in a 640px measure, one section at 80/80 padding
holding three paragraphs at 18px/29.25px, all at x=132 with 24px margins. Nothing changes width,
nothing is stranded, the heading ramp has one step. It carries only the sitewide items in the
table (banner padding at 390, footer padding, the 12px label rank).

Four things held across the whole site and should not be touched while fixing the above:

- The display h1 rank. 60px/63px 700 italic on all 32 desktop routes and 36px/37.8px on all 32
  mobile routes, with italic used nowhere else except inline `<em>`.
- Container geometry. Every page starts content at x=132 at 1440 and x=24 at 390, with a right
  edge of x=1308, on every route measured.
- The section-to-section step. Every `PageSection` measures 80/80 at 1440 and 64/64 at 390, with
  one override (/cookies-privacy, in the table).
- The lime rule. One lime element per view, the Donate bar, on every route.

## Declined

- **"Artwork is upscaled past its natural pixels" on /brain-stimulation and /volunteer.** The
  numbers do not reproduce against the source files. `web/media/2022-06-bs2.jpg` is 481x433 and
  renders at exactly 481x433; `web/media/2022-06-Picture-1-1.png` is 426x404 and renders at exactly
  426x404. The 1.24x and 1.48x figures came from the served bitmap the image optimizer chose, not
  from a design decision. Both routes still appear in the table for the parts that do reproduce:
  no plate, no shared edge, and double the ink height of the same art family on sibling routes.
- **The `DashPattern` fragment on short mobile banners.** The 620x560 pattern cell does put only
  three dashes inside a 118px to 156px banner, but the pattern renders at 10% opacity behind the
  title. No cost to the reader.
- **The missing h2 on /join-our-mailing-list.** The section passes `label="Sign up for our
  E-News"` and renders no visible heading, but the banner h1 directly above it is "Join our mailing
  list" and the block below it is a labeled form. A heading here duplicates the title. The same
  construction on /about-ocd and /psilocybin-crowdfunding-campaign is in the table, because there
  it leaves a mist band and a 3362px table with nothing announcing them.
- **The 4px height mismatch between the newsletter fields and its submit button.** It is measured
  (56px button, 52px fields, bottoms aligned by `self-end`), but the three-across row that exposes
  it disappears once the form drops to the 40rem measure, so it is folded into the
  `NewsletterSignup` row rather than listed on its own.
- **Copy changes.** None are proposed. The uppercase-heading item changes letter case in a
  `heading` prop, not words or word order, and can be done in CSS instead if the strings must
  stay as authored.
- **Widening the reading measure or shrinking body type.** `max-w-measure` at 40rem measures 65 to
  73 characters and is correct. Several findings above are about elements that are not prose (a
  table, a name index, a caption) being locked to it, not about the measure itself.
