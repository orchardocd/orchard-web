import Link from 'next/link'

import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { DashRule } from '@/components/layout/DashPattern'
import { LABEL_CLASSES } from '@/components/site'
import { MediaImage, type MediaValue } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import { formatDate } from '@/lib/format'

const BAND_CLASSES = 'aspect-[16/9] border-b border-line bg-mist'
const CARD_GRID_CLASSES = 'grid items-stretch gap-x-6 gap-y-10'

type ArticleCardProps = {
  href: string
  title: string
  date?: string | null
  byline?: string | null
  excerpt?: string | null
  image?: MediaValue
  accent?: string
  placeholder?: boolean
  headingLevel?: 2 | 3
}

export function ArticleCard({
  href,
  title,
  date,
  byline,
  excerpt,
  image,
  accent,
  placeholder = true,
  headingLevel = 2,
}: ArticleCardProps) {
  const Heading = headingLevel === 3 ? 'h3' : 'h2'

  return (
    <li
      className={cn(
        'relative flex flex-col overflow-hidden rounded-lg border border-line',
        accent ? 'border-t-6' : undefined,
      )}
      style={accent ? { borderTopColor: accent } : undefined}
    >
      {image ? (
        <MediaImage
          media={image}
          fills
          className={cn(BAND_CLASSES, 'object-contain')}
          sizes="(min-width: 1024px) 33vw, 100vw"
        />
      ) : placeholder ? (
        // Without a picture the card still needs the same opening band, or the row goes ragged.
        <div className={cn(BAND_CLASSES, 'hidden items-center justify-center md:flex')}>
          <DashRule className="scale-150" tone="brand-deep" />
        </div>
      ) : null}
      <div className="flex flex-col gap-2 p-5 md:p-7">
        {date || byline ? (
          <p className={cn(LABEL_CLASSES, 'text-faint')}>
            {date ? <time dateTime={date}>{formatDate(date)}</time> : null}
            {date && byline ? ' · ' : ''}
            {byline}
          </p>
        ) : null}
        <Heading className={cn('mt-1 line-clamp-4', CARD_TITLE_CLASSES)}>
          <Link
            href={href}
            className="text-ink no-underline after:absolute after:inset-0 hover:text-brand-link"
          >
            {title}
          </Link>
        </Heading>
        {excerpt ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-body">{excerpt}</p>
        ) : null}
      </div>
    </li>
  )
}

type ArticleLike = {
  id: number
  slug: string
  title: string
  publishedAt?: string | null
  byline?: string | null
  excerpt?: string | null
  featuredImage?: MediaValue
}

export function ArticleCards({
  articles,
  basePath,
  className,
  accents,
  showImages = true,
  placeholder = true,
  headingLevel = 2,
}: {
  articles: ArticleLike[]
  basePath: string
  className: string
  accents?: [string, string]
  showImages?: boolean
  placeholder?: boolean
  headingLevel?: 2 | 3
}) {
  return (
    <ul className={cn(className, CARD_GRID_CLASSES)}>
      {articles.map((article, index) => (
        <ArticleCard
          key={article.id}
          headingLevel={headingLevel}
          href={`${basePath}/${article.slug}`}
          title={article.title}
          date={article.publishedAt}
          byline={article.byline}
          excerpt={article.excerpt}
          image={showImages ? article.featuredImage : undefined}
          placeholder={placeholder}
          accent={accents ? accents[index % accents.length] : undefined}
        />
      ))}
    </ul>
  )
}
