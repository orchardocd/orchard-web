import type { ReactNode } from 'react'

import { TITLE_CLASSES } from '@/components/layout/Banner'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

export const ARTICLE_FIGURE_SIZES = '(min-width: 57rem) 31rem, calc(100vw - 3rem)'

export function ArticleHeader({
  title,
  eyebrow,
  lead,
  figure,
}: {
  title: string
  eyebrow: ReactNode
  lead?: ReactNode
  figure?: ReactNode
}) {
  return (
    <Container className="pt-16 pb-12 md:pt-20">
      <div
        className={cn(
          'grid items-center gap-x-12 gap-y-8',
          figure ? 'flow:grid-cols-[minmax(0,40rem)_minmax(0,1fr)]' : undefined,
        )}
      >
        <div className="w-full max-w-measure">
          {lead}
          <p
            className={cn(
              'mb-3 text-xs font-bold tracking-[0.1em] text-brand-link uppercase',
              lead ? 'mt-10' : undefined,
            )}
          >
            {eyebrow}
          </p>
          <h1 className={cn(TITLE_CLASSES, 'text-ink')}>{title}</h1>
        </div>
        {figure}
      </div>
    </Container>
  )
}
