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
        <div className="mx-auto w-full max-w-measure">
        <Link
          href="/participate-research"
          className="text-sm font-bold text-brand-link no-underline hover:underline"
        >
          ← All studies
        </Link>
        <p className="mt-6 mb-4 text-xs font-bold tracking-[0.1em] text-faint uppercase">
          <time dateTime={study.publishedAt}>{formatDate(study.publishedAt)}</time>
        </p>
        <h1 className={cn(TITLE_CLASSES, 'text-ink')}>
          {study.title}
        </h1>
        </div>
      </Container>

      {study.featuredImage ? (
        <Container className="pb-10">
          <div className="mx-auto w-full max-w-measure rounded-lg bg-mist p-8">
            <MediaImage
              media={study.featuredImage}
              className="mx-auto max-h-48 w-auto object-contain"
              sizes="(min-width: 768px) 40rem, calc(100vw - 3rem)"
              priority
            />
          </div>
        </Container>
      ) : null}

      <Container className="pb-16">
        <RenderBlocks blocks={study.layout} alreadyShown={[study.featuredImage]} title={study.title} />
      </Container>
    </article>
  )
}
