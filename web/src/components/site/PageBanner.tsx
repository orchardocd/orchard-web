import type { ReactNode } from 'react'

import { Mark, Photo } from '@/components/site/Figure'
import { Banner, BannerTitle } from '@/components/layout/Banner'
import { cn } from '@/lib/cn'

export const LABEL_CLASSES = 'text-sm font-bold tracking-[0.1em] uppercase'

export const BANNER_LEAD_CLASSES = [
  'mt-6 max-w-measure text-lg leading-relaxed text-white/92 md:text-xl',
  '[&_p]:my-6 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
  '[&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-white/80',
  '[&_strong]:font-bold [&_strong]:text-white',
  '[&_em]:font-semibold [&_em]:text-white [&_em]:not-italic',
  '[&_ul]:mt-2 [&_ul]:mb-6 [&_ul]:list-disc [&_ul]:pl-6 [&_li+li]:mt-3',
].join(' ')

const BANNER_IMAGE_SIZES = '(min-width: 1024px) 40vw, 100vw'

export type BannerImageKind = 'photo' | 'mark'

function BannerAside({ file, alt, kind }: { file: string; alt?: string; kind: BannerImageKind }) {
  if (kind === 'mark') return <Mark file={file} alt={alt} sizes={BANNER_IMAGE_SIZES} priority />
  return <Photo file={file} alt={alt} sizes={BANNER_IMAGE_SIZES} priority />
}

export function PageBanner({
  title,
  eyebrow,
  image,
  imageAlt,
  imageKind = 'photo',
  actions,
  children,
}: {
  title: string
  eyebrow?: string
  image?: string
  imageAlt?: string
  imageKind?: BannerImageKind
  actions?: ReactNode
  children?: ReactNode
}) {
  return (
    <Banner
      aside={image ? <BannerAside file={image} alt={imageAlt} kind={imageKind} /> : undefined}
    >
      <div className="flex flex-col gap-3">
        <BannerTitle>{title}</BannerTitle>
        {eyebrow ? <p className={cn(LABEL_CLASSES, 'order-first text-white')}>{eyebrow}</p> : null}
      </div>
      {children ? <div className={BANNER_LEAD_CLASSES}>{children}</div> : null}
      {actions ? (
        <div className={cn('flex flex-wrap items-center gap-4', children ? 'mt-8' : 'mt-9')}>
          {actions}
        </div>
      ) : null}
    </Banner>
  )
}
