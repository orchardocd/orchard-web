import Link from 'next/link'

import { MediaImage, type MediaValue } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'
import { withoutRepeats } from '@/lib/unique-images'

export type ArticleCardProps = {
  href: string
  title: string
  date?: string | null
  byline?: string | null
  excerpt?: string | null
  image?: MediaValue
  accent?: string
  imageClassName?: string
}

export function ArticleCard({
  href,
  title,
  date,
  byline,
  excerpt,
  image,
  accent,
  imageClassName = 'aspect-[4/3] border-b border-line bg-mist object-contain p-4',
}: ArticleCardProps) {
  return (
    <li
      className={cn(
        'flex flex-col overflow-hidden rounded-lg border border-line',
        accent ? 'border-t-6' : undefined,
      )}
      style={accent ? { borderTopColor: accent } : undefined}
    >
      {image ? (
        <MediaImage
          media={image}
          className={imageClassName}
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      ) : null}
      <div className="flex flex-col gap-3 p-7">
        {date || byline ? (
          <p className="text-xs font-bold tracking-[0.1em] text-faint uppercase">
            {date ? <time dateTime={date}>{formatDate(date)}</time> : null}
            {date && byline ? ' · ' : ''}
            {byline}
          </p>
        ) : null}
        <h3 className="text-xl leading-snug font-bold">
          <Link href={href} className="text-ink no-underline hover:text-brand-link">
            {title}
          </Link>
        </h3>
        {excerpt ? (
          <p className="line-clamp-4 text-[0.97rem] leading-relaxed text-body">{excerpt}</p>
        ) : null}
      </div>
    </li>
  )
}

export type PostLike = {
  id: number
  slug: string
  title: string
  publishedAt?: string | null
  byline?: string | null
  excerpt?: string | null
  featuredImage?: MediaValue
}

export function PostCards({
  posts,
  className,
  accents,
  showImages = true,
  imageClassName,
}: {
  posts: PostLike[]
  className: string
  accents?: [string, string]
  showImages?: boolean
  imageClassName?: string
}) {
  const items = withoutRepeats(
    posts.map((post) => ({ ...post, image: showImages ? post.featuredImage : undefined })),
  )

  return (
    <ul className={className}>
      {items.map((post, index) => (
        <ArticleCard
          key={post.id}
          href={`/blog/${post.slug}`}
          title={post.title}
          date={post.publishedAt}
          byline={post.byline}
          excerpt={post.excerpt}
          image={post.image}
          imageClassName={imageClassName}
          accent={accents ? accents[index % accents.length] : undefined}
        />
      ))}
    </ul>
  )
}
