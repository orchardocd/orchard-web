import { RichText } from '@/components/RichText'
import { Banner, BannerTitle } from '@/components/layout/Banner'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/Media'
import type { Page } from '@/payload-types'

type HeroSlide = NonNullable<Page['hero']>[number]

export function HeroHighlights({ slides }: { slides: HeroSlide[] }) {
  if (slides.length === 0) return null

  return (
    <Container className="py-14">
      <ul className="grid gap-10 md:grid-cols-2">
        {slides.map((slide, index) => (
          <li key={slide.id ?? index} className="flex flex-col gap-4">
            {slide.image ? (
              <MediaImage
                media={slide.image}
                className="rounded-lg"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
            ) : null}
            <h2 className="text-2xl leading-snug font-bold text-ink">{slide.title}</h2>
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
}: {
  title: string
  slides: HeroSlide[] | null | undefined
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
        <BannerTitle>{title}</BannerTitle>
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

      <HeroHighlights slides={all.slice(1)} />
    </>
  )
}
