import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { TITLE_CLASSES } from '@/components/layout/Banner'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { MediaImage } from '@/components/ui/Media'
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
      <Container className="pt-14 pb-8">
        <div className="mx-auto w-full max-w-measure">
        <p className="mb-4 text-xs font-bold tracking-[0.1em] text-faint uppercase">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.byline ? ` · ${post.byline}` : ''}
        </p>
        <h1 className={cn(TITLE_CLASSES, 'text-ink')}>
          {post.title}
        </h1>
        </div>
      </Container>

      {post.featuredImage ? (
        <Container className="pb-10">
          <MediaImage
            media={post.featuredImage}
            className="mx-auto w-full max-w-measure rounded-lg"
            sizes="(min-width: 768px) 40rem, calc(100vw - 3rem)"
            priority
          />
        </Container>
      ) : null}

      <Container className="pb-16">
        <RenderBlocks blocks={post.layout} alreadyShown={[post.featuredImage]} title={post.title} />
      </Container>
    </article>
  )
}
