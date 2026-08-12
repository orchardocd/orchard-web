import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { openingHeading, splitAtTitles, takeOpeningTitle } from '@/components/blocks/groupBlocks'
import { PageHero } from '@/components/layout/PageHero'
import { Container } from '@/components/ui/Container'
import { getPageBySlug } from '@/lib/payload'
import { slugMetadata, slugParams, type SlugParams } from '@/lib/routes'
import { NewsletterSignup } from '@/components/content/NewsletterSignup'
import { GROUPS, PeopleSections } from '@/components/content/PeopleSections'
import { StudyList } from '@/components/content/StudyList'
import { WebinarList } from '@/components/content/WebinarList'

// Unknown slugs fall through to our own not-found page rather than Next's internal 404.
export const dynamicParams = true

const RESERVED = ['blog']

export const generateStaticParams = () => slugParams('pages', [...RESERVED])

export const generateMetadata = slugMetadata(getPageBySlug)

export default async function DynamicPage({ params }: SlugParams) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()

  // With no slide of its own the banner shows the page title, so the body must not repeat it:
  // where there is content underneath, the page leads with the title the way an article does.
  const banners = !page.hero?.length
  const opening = takeOpeningTitle(page.layout ?? [], page.title)
  // A page with nothing under its title still needs the banner, or it opens on an empty screen.
  const leads = banners && opening.title !== null && opening.blocks.length > 0
  const layout = banners && !leads ? opening.blocks : (page.layout ?? [])
  const rosters = GROUPS.map((group) => group.label)
  // Whatever the old page put after a roster title belongs after the roster itself.
  const { before: body, after: trailing } = splitAtTitles(layout, rosters)
  const headings = body.map(openingHeading).filter((heading): heading is string => heading !== null)

  return (
    <>
      {leads ? null : (
        <PageHero title={page.title} slides={page.hero} bodyHeadings={headings} />
      )}
      {body.length ? (
        <Container className={(page.hero?.length ?? 0) > 1 ? 'pb-16 md:pb-20' : 'py-16 md:py-20'}>
          <RenderBlocks
            blocks={body}
            title={leads ? page.title : undefined}
            showTitle={leads}
            renderedElsewhere={rosters}
          />
        </Container>
      ) : null}
      {slug === 'about-orchard' ? (
        <PeopleSections only={['team', 'scientific-advisory-board', 'partners', 'ambassadors']} />
      ) : null}
      {slug === 'about' ? <PeopleSections only={['college']} /> : null}
      {trailing.length ? (
        <Container className="pb-16 md:pb-20">
          <RenderBlocks blocks={trailing} renderedElsewhere={rosters} />
        </Container>
      ) : null}
      {slug === 'join-our-mailing-list' ? (
        <Container className="pb-16 md:pb-20">
          <NewsletterSignup />
        </Container>
      ) : null}
      {slug === 'participate-research' ? <StudyList /> : null}
      {slug === 'webinars' ? <WebinarList /> : null}
    </>
  )
}
