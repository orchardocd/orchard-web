import type { ReactNode } from 'react'

import { Container, Section } from '@/components/ui/Container'
import { cn } from '@/lib/cn'

export type SectionTone = 'plain' | 'ruled' | 'mist' | 'deep' | 'strong'

const TONES: Record<SectionTone, string> = {
  plain: '',
  ruled: 'border-t border-line',
  mist: 'bg-mist',
  deep: 'bg-brand-deep',
  strong: 'bg-brand-strong',
}

const HEADING_TONES: Record<SectionTone, string> = {
  plain: 'text-brand-deep',
  ruled: 'text-brand-deep',
  mist: 'text-brand-deep',
  deep: 'text-white',
  strong: 'text-white',
}

export const SECTION_HEADING_CLASSES =
  'max-w-3xl text-3xl leading-[1.1] font-bold text-balance md:text-4xl'

function slugify(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function PageSection({
  heading,
  id,
  label,
  tone = 'plain',
  className,
  children,
}: {
  heading?: string
  id?: string
  label?: string
  tone?: SectionTone
  className?: string
  children: ReactNode
}) {
  const headingId = heading ? (id ?? slugify(heading)) : undefined

  return (
    <Section
      labelledBy={headingId}
      label={headingId ? undefined : label}
      className={cn(TONES[tone], className)}
    >
      <Container>
        {heading ? (
          <h2 id={headingId} className={cn(SECTION_HEADING_CLASSES, HEADING_TONES[tone], 'mb-9')}>
            {heading}
          </h2>
        ) : null}
        {children}
      </Container>
    </Section>
  )
}
