import Link from 'next/link'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { DashPattern } from '@/components/layout/DashPattern'
import { HeroHighlights } from '@/components/layout/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { Container, Section } from '@/components/ui/Container'
import { formatDate } from '@/lib/format'
import { getPageBySlug, getPosts, getSiteSettings, getWebinars } from '@/lib/payload'

export default async function HomePage() {
  const [settings, posts, webinars, page] = await Promise.all([
    getSiteSettings(),
    getPosts(3),
    getWebinars(),
    getPageBySlug('home'),
  ])
  const latestWebinar = webinars[0]

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep">
        <DashPattern className="pointer-events-none absolute -top-8 -right-10 opacity-18" />
        <Container className="relative pt-20 pb-16 md:pt-24">
          <p className="mb-5 text-sm font-bold tracking-[0.22em] text-lime-soft uppercase">
            Find · Filter · Fund
          </p>
          <h1 className="max-w-4xl text-5xl leading-[1.02] font-bold tracking-tight text-balance text-white italic md:text-7xl">
            Advancing global <span className="text-lime">OCD research</span>
          </h1>
          <p className="mt-7 max-w-2xl text-xl leading-relaxed text-pretty text-white/92 md:text-2xl">
            Help us develop better treatments for Obsessive Compulsive Disorder (OCD).
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href={settings.donateUrl} variant="donate" className="px-8 py-4 text-lg">
              Donate now
            </ButtonLink>
            <ButtonLink href={settings.registryUrl} variant="ghost" className="px-8 py-4 text-lg">
              Join the OCD registry
            </ButtonLink>
          </div>
        </Container>

        {(settings.stats ?? []).length > 0 ? (
          <Container className="relative grid gap-7 pb-20 md:grid-cols-2">
            {(settings.stats ?? []).map((stat) => (
              <div
                key={stat.id ?? stat.value}
                className="flex items-center gap-6 rounded-lg bg-white p-7 shadow-[0_14px_34px_rgba(0,30,27,0.24)]"
              >
                <p className="text-4xl font-bold tracking-tight whitespace-nowrap text-brand md:text-5xl">
                  {stat.value}
                </p>
                <p className="text-base leading-relaxed text-body">{stat.description}</p>
              </div>
            ))}
          </Container>
        ) : null}
      </section>

      <Container>
        <div className="grid gap-6 pt-16 md:grid-cols-3">
          <a
            href={settings.donateUrl}
            className="flex min-h-44 flex-col gap-3 rounded-lg bg-brand p-8 text-white no-underline hover:bg-brand-hover"
          >
            <h2 className="text-2xl font-bold">Donate</h2>
            <p className="text-base leading-relaxed text-white/90">
              Donate today to help OCD research.
            </p>
            <span aria-hidden="true" className="mt-auto text-2xl font-bold">
              →
            </span>
          </a>
          <a
            href={settings.registryUrl}
            className="flex min-h-44 flex-col gap-3 rounded-lg border-2 border-transparent bg-mist p-8 no-underline hover:border-brand"
          >
            <h2 className="text-2xl font-bold text-brand-link">Join the registry</h2>
            <p className="text-base leading-relaxed text-body">
              Participate in exciting new OCD research.
            </p>
            <span aria-hidden="true" className="mt-auto text-2xl font-bold text-brand">
              →
            </span>
          </a>
          <Link
            href="/fundraising-events"
            className="flex min-h-44 flex-col gap-3 rounded-lg border-2 border-transparent bg-mist p-8 no-underline hover:border-brand"
          >
            <h2 className="text-2xl font-bold text-brand-link">Fundraising & events</h2>
            <p className="text-base leading-relaxed text-body">
              Volunteer · Work with us · Become a trustee
            </p>
            <span aria-hidden="true" className="mt-auto text-2xl font-bold text-brand">
              →
            </span>
          </Link>
        </div>
      </Container>

      <Section label="Highlights" className="pt-4 pb-0">
        <HeroHighlights slides={page?.hero ?? []} />
      </Section>

      <Section labelledBy="about-orchard" className="bg-mist">
        <Container>
          <h2 id="about-orchard" className="sr-only">
            About Orchard OCD
          </h2>
          <RenderBlocks blocks={page?.layout} />
        </Container>
      </Section>

      <Section labelledBy="from-the-blog" className="border-t border-line">
        <Container>
          <div className="mb-10 flex flex-wrap items-baseline justify-between gap-6">
            <h2 id="from-the-blog" className="text-4xl font-bold text-ink">
              From the <span className="text-brand">blog</span>
            </h2>
            <Link
              href="/blog"
              className="text-base font-bold text-brand-link no-underline hover:text-brand-link-hover hover:underline"
            >
              View all posts →
            </Link>
          </div>
          <ul className="grid gap-6 md:grid-cols-3">
            {posts.docs.map((post, index) => (
              <li
                key={post.id}
                className="flex flex-col gap-3 rounded-lg border border-line border-t-6 p-7"
                style={{ borderTopColor: index % 2 === 0 ? '#B6BF00' : '#00877C' }}
              >
                <p className="text-xs font-bold tracking-[0.1em] text-faint uppercase">
                  {formatDate(post.publishedAt)}
                  {post.byline ? ` · ${post.byline}` : ''}
                </p>
                <h3 className="text-xl leading-snug font-bold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-ink no-underline hover:text-brand-link"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.excerpt ? (
                  <p className="line-clamp-4 text-[0.97rem] leading-relaxed text-body">
                    {post.excerpt}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>

          {latestWebinar ? (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-lg bg-brand-deep px-9 py-7">
              <p className="text-lg text-white">
                Our latest webinar: <span className="font-bold">{latestWebinar.title}</span>
              </p>
              <ButtonLink href="/webinars" variant="donate">
                Watch now
              </ButtonLink>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section labelledBy="newsletter" className="bg-brand">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="newsletter" className="text-3xl font-bold text-white">
              {settings.newsletter?.heading || 'Subscribe to our newsletter'}
            </h2>
            <p className="mt-4 leading-relaxed text-pretty text-white/92">
              {settings.newsletter?.body}
            </p>
          </div>
          <div>
            <ButtonLink
              href={settings.newsletter?.signupUrl || '/join-our-mailing-list'}
              variant="donate"
              className="px-8 py-4 text-lg"
            >
              Join our mailing list
            </ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  )
}
