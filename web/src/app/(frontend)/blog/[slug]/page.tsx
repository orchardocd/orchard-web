import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { Container } from '@/components/ui/Container'
import { Image } from '@/components/ui/Media'
import { formatDate } from '@/lib/format'
import { getClient, getPostBySlug } from '@/lib/payload'

export const dynamicParams = false

export async function generateStaticParams() {
  const payload = await getClient()
  const posts = await payload.find({ collection: 'posts', limit: 500, select: { slug: true } })
  return posts.docs.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt ?? undefined }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article>
      <Container className="pt-14 pb-8">
        <p className="mb-4 text-xs font-bold tracking-[0.1em] text-faint uppercase">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          {post.byline ? ` · ${post.byline}` : ''}
        </p>
        <h1 className="max-w-4xl text-4xl leading-tight font-bold tracking-tight text-balance text-ink md:text-5xl">
          {post.title}
        </h1>
      </Container>

      {post.featuredImage ? (
        <Container className="pb-10">
          <Image
            media={post.featuredImage}
            className="max-h-[32rem] rounded-lg object-cover"
            sizes="(min-width: 1240px) 1200px, 100vw"
            priority
          />
        </Container>
      ) : null}

      <Container className="pb-16">
        <RenderBlocks blocks={post.layout} />
      </Container>
    </article>
  )
}
