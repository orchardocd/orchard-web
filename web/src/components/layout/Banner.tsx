import type { ReactNode } from 'react'

import { DashPattern } from '@/components/layout/DashPattern'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

/** The dark green banner every page opens with. */
export function Banner({
  children,
  aside,
  after,
  className,
}: {
  children: ReactNode
  aside?: ReactNode
  after?: ReactNode
  className?: string
}) {
  return (
    <section className={cn('relative overflow-hidden bg-brand-deep', className)}>
      <DashPattern className="pointer-events-none absolute inset-y-0 right-0 opacity-18" />
      <Container
        className={cn(
          'relative py-16 md:py-20',
          aside ? 'grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]' : undefined,
        )}
      >
        <div>{children}</div>
        {aside}
      </Container>
      {after}
    </section>
  )
}

/** A banner headline followed by page content: the shape of every simple page. */
export function BannerPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <Banner>
        <BannerTitle>{title}</BannerTitle>
      </Banner>
      <Container className="py-14">{children}</Container>
    </>
  )
}

export const TITLE_CLASSES =
  'max-w-3xl text-4xl leading-[1.05] font-bold tracking-tight text-balance italic md:text-6xl'

export function BannerTitle({ children }: { children: ReactNode }) {
  return <h1 className={cn(TITLE_CLASSES, 'text-white')}>{children}</h1>
}
