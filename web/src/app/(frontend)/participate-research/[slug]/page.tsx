import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Container } from '@/components/ui/Container'
import { Image } from '@/components/ui/Media'
import { formatDate } from '@/lib/format'
import { getClient, getStudyBySlug } from '@/lib/payload'

export const dynamicParams = false

export async function generateStaticParams() {
  const payload = await getClient()
  const studies = await payload.find({ collection: 'studies', limit: 200, select: { slug: true } })
  return studies.docs.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const study = await getStudyBySlug(slug)
  if (!study) return {}
  return { title: study.title, description: study.excerpt ?? undefined }
}

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = await getStudyBySlug(slug)
  if (!study) notFound()

  return (
    <article>
      <Container className="pt-14 pb-8">
        <Link
          href="/participate-research"
          className="text-sm font-bold text-brand-link no-underline hover:underline"
        >
          ← All studies
        </Link>
        <p className="mt-6 mb-4 text-xs font-bold tracking-[0.1em] text-faint uppercase">
          <time dateTime={study.publishedAt}>{formatDate(study.publishedAt)}</time>
        </p>
        <h1 className="max-w-4xl text-4xl leading-tight font-bold tracking-tight text-balance text-ink md:text-5xl">
          {study.title}
        </h1>
      </Container>

      {study.featuredImage ? (
        <Container className="pb-10">
          <Image
            media={study.featuredImage}
            className="max-h-[32rem] rounded-lg object-contain"
            sizes="(min-width: 1240px) 1200px, 100vw"
            priority
          />
        </Container>
      ) : null}

      <Container className="pb-16">
        <RenderBlocks blocks={study.layout} />
      </Container>
    </article>
  )
}
