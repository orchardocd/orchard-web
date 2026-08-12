import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { TITLE_CLASSES } from '@/components/layout/Banner'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { MediaImage } from '@/components/ui/Media'
import { formatDate } from '@/lib/format'
import { getStudyBySlug } from '@/lib/payload'
import { slugMetadata, slugParams, type SlugParams } from '@/lib/routes'

// Unknown slugs fall through to our own not-found page rather than Next's internal 404.
export const dynamicParams = true

export const generateStaticParams = () => slugParams('studies')

export const generateMetadata = slugMetadata(getStudyBySlug)

export default async function StudyPage({ params }: SlugParams) {
  const { slug } = await params
  const study = await getStudyBySlug(slug)
  if (!study) notFound()

  return (
    <article>
      <Container className="pt-14 pb-8">
        <div className="w-full max-w-measure">
          <Link
            href="/participate-research"
            className="text-sm font-bold text-brand-link no-underline hover:underline"
          >
            ← All studies
          </Link>
          <p className="mt-10 mb-3 text-xs font-bold tracking-[0.1em] text-brand-link uppercase">
            <time dateTime={study.publishedAt}>{formatDate(study.publishedAt)}</time>
          </p>
          <h1 className={cn(TITLE_CLASSES, 'text-ink')}>{study.title}</h1>
        </div>
      </Container>

      {study.featuredImage ? (
        <Container className="pb-12">
          <div className="flex w-full max-w-[18rem] items-center justify-center rounded-lg border border-line bg-mist p-6">
            <MediaImage
              media={study.featuredImage}
              className="max-h-40 w-auto object-contain"
              sizes="18rem"
              priority
            />
          </div>
        </Container>
      ) : null}

      <Container className="pb-24">
        <RenderBlocks blocks={study.layout} alreadyShown={[study.featuredImage]} title={study.title} />
      </Container>
    </article>
  )
}
