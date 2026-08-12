import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { PageHero } from '@/components/layout/PageHero'
import { Container } from '@/components/ui/Container'
import { getPageBySlug } from '@/lib/payload'
import { slugMetadata, slugParams, type SlugParams } from '@/lib/routes'
import { PeopleSections } from '@/components/content/PeopleSections'
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

  return (
    <>
      <PageHero title={page.title} slides={page.hero} />
      <Container className="py-14">
        <RenderBlocks blocks={page.layout} />
      </Container>
      {slug === 'about-orchard' ? (
        <PeopleSections only={['team', 'scientific-advisory-board', 'partners', 'ambassadors']} />
      ) : null}
      {slug === 'about' ? <PeopleSections only={['college']} /> : null}
      {slug === 'participate-research' ? <StudyList /> : null}
      {slug === 'webinars' ? <WebinarList /> : null}
    </>
  )
}
