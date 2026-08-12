import type { Metadata } from 'next'
import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { Image } from '@/components/ui/Media'
import { DashPattern } from '@/components/layout/DashPattern'
import { formatDate } from '@/lib/format'
import { getPosts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'News, personal stories and research updates from Orchard OCD.',
}

export default async function BlogIndex() {
  const posts = await getPosts(100)

  return (
    <>
      <section className="relative overflow-hidden bg-brand-deep">
        <DashPattern className="pointer-events-none absolute -top-8 -right-10 opacity-18" />
        <Container className="relative py-16 md:py-20">
          <h1 className="text-4xl leading-tight font-bold tracking-tight text-white italic md:text-6xl">
            Blog
          </h1>
        </Container>
      </section>

      <Container className="py-14">
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.docs.map((post) => (
            <li
              key={post.id}
              className="flex flex-col overflow-hidden rounded-lg border border-line"
            >
              {post.featuredImage ? (
                <Image
                  media={post.featuredImage}
                  className="aspect-[4/3] object-cover"
                  sizes="(min-width: 1024px) 33vw, 100vw"
                />
              ) : null}
              <div className="flex flex-1 flex-col gap-3 p-7">
                <p className="text-xs font-bold tracking-[0.1em] text-faint uppercase">
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  {post.byline ? ` · ${post.byline}` : ''}
                </p>
                <h2 className="text-xl leading-snug font-bold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-ink no-underline hover:text-brand-link"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt ? (
                  <p className="line-clamp-4 text-[0.97rem] leading-relaxed text-body">
                    {post.excerpt}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  )
}
