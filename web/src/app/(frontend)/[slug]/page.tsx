import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { PageHero } from '@/components/layout/PageHero'
import { Container } from '@/components/ui/Container'
import { getClient, getPageBySlug } from '@/lib/payload'
import { PeopleSections } from '@/components/content/PeopleSections'
import { StudyList } from '@/components/content/StudyList'
import { WebinarList } from '@/components/content/WebinarList'

export const dynamicParams = false

const RESERVED = new Set(['home', 'blog'])

export async function generateStaticParams() {
  const payload = await getClient()
  const pages = await payload.find({ collection: 'pages', limit: 200, select: { slug: true } })
  return pages.docs
    .filter((page) => !RESERVED.has(page.slug))
    .map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.meta?.description ?? undefined,
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()

  return (
    <>
      <PageHero title={page.title} slides={page.hero} />
      <Container className="py-14">
        <RenderBlocks blocks={page.layout} />
      </Container>
      {slug === 'about-orchard' ? <PeopleSections /> : null}
      {slug === 'participate-research' ? <StudyList /> : null}
      {slug === 'webinars' ? <WebinarList /> : null}
    </>
  )
}
