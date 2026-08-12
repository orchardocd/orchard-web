import { RichText } from '@/components/RichText'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { DashPattern } from '@/components/layout/DashPattern'
import { Image } from '@/components/ui/Media'
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
              <Image
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
  const rest = all.slice(1)

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep">
        <DashPattern className="pointer-events-none absolute -top-8 -right-10 opacity-18" />
        <Container className="relative grid items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-balance text-white italic md:text-6xl">
              {title}
            </h1>
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
          </div>
          {intro?.image ? (
            <Image
              media={intro.image}
              className="rounded-lg"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          ) : null}
        </Container>
      </section>

      <HeroHighlights slides={rest} />
    </>
  )
}
