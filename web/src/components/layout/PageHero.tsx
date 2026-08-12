import { RichText } from '@/components/RichText'
import { Banner, BannerTitle } from '@/components/layout/Banner'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import { withoutRepeats } from '@/lib/unique-images'
import type { Media, Page } from '@/payload-types'

type HeroSlide = NonNullable<Page['hero']>[number]

export function HeroHighlights({
  slides,
  alreadyShown = [],
  alreadyTitled = [],
}: {
  slides: HeroSlide[]
  alreadyShown?: (number | Media | null | undefined)[]
  /** Headings the page already carries, so a card never repeats one of them. */
  alreadyTitled?: string[]
}) {
  const items = withoutRepeats(slides, alreadyShown)
  if (items.length === 0) return null
  const titled = new Set(alreadyTitled.map((title) => title.trim().toLowerCase()))

  return (
    <Container className="py-14">
      <ul
        className={cn(
          'grid items-stretch gap-8',
          items.length > 1 && 'md:grid-cols-2',
          items.length > 2 && items.length !== 4 && 'lg:grid-cols-3',
        )}
      >
        {items.map((slide, index) => (
          <li
            key={slide.id ?? index}
            className="flex h-full flex-col gap-4 rounded-lg border border-line p-6 sm:p-8"
          >
            {slide.image ? (
              <MediaImage
                media={slide.image}
                className="rounded-lg"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : null}
            {slide.title && !titled.has(slide.title.trim().toLowerCase()) ? (
              <h2 className="text-xl leading-tight font-bold text-ink md:text-2xl">
                {slide.title}
              </h2>
            ) : null}
            {slide.content ? <RichText data={slide.content} /> : null}
            {slide.ctaHref && slide.ctaLabel ? (
              <ButtonLink href={slide.ctaHref} variant="secondary" className="self-start">
                {slide.ctaLabel}
              </ButtonLink>
            ) : null}
          </li>
        ))}
      </ul>
    </Container>
  )
}

export function PageHero({
  title,
  slides,
  bodyHeadings = [],
}: {
  title: string
  slides: HeroSlide[] | null | undefined
  /** Headings the page body carries, so a highlight card never repeats one. */
  bodyHeadings?: string[]
}) {
  const all = slides ?? []
  const intro = all[0]

  return (
    <>
      <Banner
        aside={
          intro?.image ? (
            <MediaImage
              media={intro.image}
              className="rounded-lg"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          ) : undefined
        }
      >
        <BannerTitle>{intro?.title || title}</BannerTitle>
        {intro?.content ? (
          <RichText
            data={intro.content}
            className="mt-6 text-xl text-white/92 [&_a]:text-lime [&_strong]:text-white"
          />
        ) : null}
        {intro?.ctaHref && intro.ctaLabel ? (
          <ButtonLink href={intro.ctaHref} variant="donate" className="mt-8">
            {intro.ctaLabel}
          </ButtonLink>
        ) : null}
      </Banner>

      <HeroHighlights
        slides={all.slice(1)}
        alreadyShown={[intro?.image]}
        alreadyTitled={[intro?.title || title, ...bodyHeadings]}
      />
    </>
  )
}
