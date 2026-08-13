import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ARTICLE_FIGURE_SIZES, ArticleHeader } from '@/components/content/ArticleHeader'
import { RichText } from '@/components/RichText'
import { Plate } from '@/components/site'
import { Container } from '@/components/ui/Container'
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
      <ArticleHeader
        title={study.title}
        lead={
          <Link
            href="/participate-research"
            className="text-sm font-bold text-brand-link no-underline hover:underline"
          >
            ← All studies
          </Link>
        }
        eyebrow={<time dateTime={study.publishedAt}>{formatDate(study.publishedAt)}</time>}
        figure={
          study.featuredImage ? (
            <Plate media={study.featuredImage} sizes={ARTICLE_FIGURE_SIZES} priority />
          ) : null
        }
      />

      {study.body ? (
        <Container className="pb-16 md:pb-20">
          <RichText data={study.body} videoTitle={study.title} />
        </Container>
      ) : null}
    </article>
  )
}
