import { VideoEmbed } from '@/components/blocks/VideoEmbed'
import { PostCards } from '@/components/content/ArticleCard'
import { SocialLinks } from '@/components/content/SocialLinks'
import { Banner, BannerTitle } from '@/components/layout/Banner'
import { Illustrations } from '@/components/layout/Illustrations'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { MediaImage } from '@/components/ui/Media'
import { sentenceCase } from '@/lib/format'
import { getHomePage, getPosts, getSiteSettings } from '@/lib/payload'

export default async function HomePage() {
  const [home, settings, posts] = await Promise.all([getHomePage(), getSiteSettings(), getPosts(3)])
  const { about, proposals, participate, social, blog, webinar, video } = home

  return (
    <>
      <Banner
        aside={
          home.hero.image ? (
            <MediaImage
              media={home.hero.image}
              className="rounded-lg"
              sizes="(min-width: 1024px) 40vw, 100vw"
              priority
            />
          ) : undefined
        }
      >
        <BannerTitle>{home.hero.title}</BannerTitle>
        {about.intro ? (
          <p className="mt-7 max-w-measure text-lg leading-relaxed text-pretty text-white/92">
            {sentenceCase(about.intro)}
          </p>
        ) : null}
        <div className="mt-9 flex flex-wrap items-center gap-4">
          {home.hero.ctaHref && home.hero.ctaLabel ? (
            <ButtonLink href={home.hero.ctaHref} variant="donate" className="px-8 py-4 text-lg">
              {home.hero.ctaLabel}
            </ButtonLink>
          ) : null}
          {about.ctaHref && (about.ctaHeading || about.ctaLabel) ? (
            <ButtonLink href={about.ctaHref} variant="ghost" className="px-8 py-4 text-lg">
              {about.ctaHeading ?? about.ctaLabel}
            </ButtonLink>
          ) : null}
        </div>
      </Banner>

      {(home.highlights ?? []).length > 0 ? (
        <Section label={about.heading} className="py-14">
          <Container>
            <ul className="grid items-start gap-6 md:grid-cols-2 lg:grid-cols-4">
              {(home.highlights ?? []).map((item, index) => (
                <li
                  key={item.id ?? index}
                  className="flex flex-col overflow-hidden rounded-lg border border-line"
                >
                  {item.image ? (
                    <MediaImage
                      media={item.image}
                      className="aspect-[4/3] border-b border-line bg-mist object-contain p-6"
                      sizes="(min-width: 1024px) 25vw, 50vw"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col gap-4 p-6">
                    <h2 className="text-lg leading-snug font-bold text-ink">{item.title}</h2>
                    {item.ctaHref && item.ctaLabel ? (
                      <ButtonLink
                        href={item.ctaHref}
                        variant="secondary"
                        className="mt-auto self-start px-5 py-2.5 text-sm"
                      >
                        {item.ctaLabel}
                      </ButtonLink>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      ) : null}

      <Section labelledBy="about-orchard" className="bg-mist">
        <Container>
          <div className="flex flex-wrap items-center justify-between gap-8">
            <h2 id="about-orchard" className="text-4xl font-bold text-ink">
              {about.heading}
            </h2>
            {about.image ? (
              <MediaImage media={about.image} className="max-w-40" sizes="160px" />
            ) : null}
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {(about.pillars ?? []).map((pillar, index) => (
              <div
                key={pillar.id ?? index}
                className="rounded-lg bg-white p-8 shadow-[0_2px_10px_rgba(14,42,39,0.06)]"
              >
                {pillar.image ? (
                  <MediaImage media={pillar.image} className="mb-5 h-16 w-auto" sizes="64px" />
                ) : null}
                <h3 className="mb-3 text-xl font-bold text-brand-link">{pillar.title}</h3>
                <p className="text-base leading-relaxed text-body">{pillar.body}</p>
              </div>
            ))}
            <div className="rounded-lg bg-white p-8 shadow-[0_2px_10px_rgba(14,42,39,0.06)]">
              {about.goalsImage ? (
                <MediaImage media={about.goalsImage} className="mb-5 h-16 w-auto" sizes="64px" />
              ) : null}
              <h3 className="mb-3 text-xl font-bold text-brand-link">{about.goalsTitle}</h3>
              <p className="mb-2 text-base leading-relaxed text-body">{about.goalsIntro}</p>
              <ol className="list-decimal pl-5 text-base leading-relaxed text-body">
                {(about.goals ?? []).map((goal, index) => (
                  <li key={goal.id ?? index}>{goal.text}</li>
                ))}
              </ol>
            </div>
          </div>

          {video?.url || (about.ctaImages ?? []).length > 0 ? (
            <div className="mt-12 flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <h3 id="learn-about" className="text-2xl font-bold text-brand-link">
                  {about.ctaHeading ?? about.heading}
                </h3>
                <Illustrations items={about.ctaImages} size="h-16" />
              </div>
              {video?.url ? (
                <VideoEmbed
                  url={video.url}
                  title={about.ctaHeading ?? about.heading}
                  poster={video.poster}
                  className="max-w-none"
                />
              ) : null}
            </div>
          ) : null}
        </Container>
      </Section>

      <Section labelledBy="participate">
        <Container className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 id="participate" className="text-4xl leading-tight font-bold text-ink">
              {participate?.heading}
            </h2>
            <p className="mt-4 max-w-measure text-lg leading-relaxed text-body">
              {participate?.body}
            </p>
            {participate?.ctaHref && participate?.ctaLabel ? (
              <ButtonLink href={participate.ctaHref} className="mt-7">
                {participate.ctaLabel}
              </ButtonLink>
            ) : null}
            <Illustrations items={participate?.images} className="mt-8" size="h-20" />
          </div>
          <div className="rounded-lg bg-mist p-8">
            <h2 className="text-2xl font-bold text-brand-link">{social?.heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-body">{social?.body}</p>
            <Illustrations items={social?.images} className="mt-6" size="h-20" />
            <SocialLinks
              items={settings.social}
              className="mt-5"
              linkClassName="inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-link no-underline hover:bg-brand-strong hover:text-white"
            />
          </div>
        </Container>
      </Section>

      <Section labelledBy="proposals" className="bg-brand-deep">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="proposals" className="text-4xl font-bold text-white">
              {proposals?.heading}
            </h2>
            {(proposals?.body ?? []).map((paragraph, index) => (
              <p
                key={paragraph.id ?? index}
                className="mt-5 max-w-measure leading-relaxed text-pretty text-white/92"
              >
                {paragraph.text}
              </p>
            ))}
            {proposals?.ctaHref && proposals.ctaLabel ? (
              <ButtonLink href={proposals.ctaHref} variant="light" className="mt-8">
                {proposals.ctaLabel}
              </ButtonLink>
            ) : null}
          </div>
          <div className="flex flex-col gap-8">
            {proposals?.quote ? (
              <blockquote className="rounded-lg bg-white/10 p-9 text-2xl leading-snug font-semibold text-pretty text-white">
                <p>{proposals.quote}</p>
              </blockquote>
            ) : null}
            {proposals?.image ? (
              <MediaImage
                media={proposals.image}
                className="mx-auto max-w-xs"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
            ) : null}

          </div>
        </Container>
      </Section>

      <Section labelledBy="from-the-blog" className="border-t border-line">
        <Container>
          <h2 id="from-the-blog" className="mb-10 text-4xl font-bold text-ink">
            {blog?.heading}
          </h2>
          <PostCards
            posts={posts.docs}
            className="grid items-start gap-6 md:grid-cols-3"
            accents={['#B6BF00', '#00877C']}
            showImages={false}
          />
          <Illustrations items={blog?.images} className="mt-10 justify-center" />

          {webinar?.title ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-lg bg-brand-deep px-9 py-7">
              {webinar.image ? (
                <MediaImage media={webinar.image} className="h-20 w-auto rounded" sizes="120px" />
              ) : null}
              <h3 className="flex-1 text-lg font-semibold text-white">{webinar.title}</h3>
              {webinar.ctaHref && webinar.ctaLabel ? (
                <ButtonLink href={webinar.ctaHref} variant="light">
                  {webinar.ctaLabel}
                </ButtonLink>
              ) : null}
            </div>
          ) : null}
        </Container>
      </Section>

      <Section labelledBy="newsletter" className="bg-brand-strong">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="newsletter" className="text-4xl font-bold text-white">
              {settings.newsletter?.heading}
            </h2>
            <p className="mt-4 leading-relaxed text-pretty text-white/92">
              {settings.newsletter?.body}
            </p>
            <Illustrations items={home.newsletter?.images} className="mt-8" size="h-20" />
          </div>
          <ButtonLink
            href={settings.newsletter?.signupUrl || '/join-our-mailing-list'}
            variant="light"
            className="px-8 py-4 text-lg"
          >
            Join Our Mailing List
          </ButtonLink>
        </Container>
      </Section>
    </>
  )
}
