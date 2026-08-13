import { notFound } from 'next/navigation'

import { ARTICLE_FIGURE_SIZES, ArticleHeader } from '@/components/content/ArticleHeader'
import { RichText } from '@/components/RichText'
import { Plate } from '@/components/site'
import { Container } from '@/components/ui/Container'
import { formatDate } from '@/lib/format'
import { getPostBySlug } from '@/lib/payload'
import { slugMetadata, slugParams, type SlugParams } from '@/lib/routes'

// Unknown slugs fall through to our own not-found page rather than Next's internal 404.
export const dynamicParams = true

export const generateStaticParams = () => slugParams('posts')

export const generateMetadata = slugMetadata(getPostBySlug)

export default async function PostPage({ params }: SlugParams) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article>
      <ArticleHeader
        title={post.title}
        eyebrow={
          <>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            {post.byline ? ` · ${post.byline}` : ''}
          </>
        }
        figure={
          post.featuredImage ? (
            <Plate media={post.featuredImage} sizes={ARTICLE_FIGURE_SIZES} priority />
          ) : null
        }
      />

      {post.body ? (
        <Container className="pb-16 md:pb-20">
          <RichText data={post.body} videoTitle={post.title} />
        </Container>
      ) : null}
    </article>
  )
}
