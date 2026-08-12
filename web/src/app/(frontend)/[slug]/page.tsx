import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { takeOpeningTitle } from '@/components/blocks/groupBlocks'
import { PageHero } from '@/components/layout/PageHero'
import { Container } from '@/components/ui/Container'
import { getPageBySlug } from '@/lib/payload'
import { slugMetadata, slugParams, type SlugParams } from '@/lib/routes'
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

  // A page whose body already opens with its own title leads with it, the way an article does,
  // rather than saying it once in the banner and again underneath.
  const leads =
    !page.hero?.length && takeOpeningTitle(page.layout ?? [], page.title).title !== null
  const rosters = GROUPS.map((group) => group.label)

  return (
    <>
      {leads ? null : <PageHero title={page.title} slides={page.hero} />}
      {page.layout?.length ? (
        <Container className={(page.hero?.length ?? 0) > 1 ? 'pb-14' : 'py-14'}>
          <RenderBlocks
            blocks={page.layout}
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
      {slug === 'participate-research' ? <StudyList /> : null}
      {slug === 'webinars' ? <WebinarList /> : null}
    </>
  )
}
