import NextImage from 'next/image'

import { cn } from '@/lib/cn'
import type { Media } from '@/payload-types'

export type MediaValue = number | Media | null | undefined

export function resolveMedia(value: MediaValue): Media | null {
  return typeof value === 'object' && value !== null ? value : null
}

export function Image({
  media,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
}: {
  media: MediaValue
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const resolved = resolveMedia(media)
  if (!resolved?.url) return null

  return (
    <NextImage
      src={resolved.url}
      alt={resolved.alt ?? ''}
      width={resolved.width ?? 1200}
      height={resolved.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', className)}
    />
  )
}

export function RoundImage({
  media,
  className,
  sizes = '160px',
}: {
  media: MediaValue
  className?: string
  sizes?: string
}) {
  const resolved = resolveMedia(media)
  if (!resolved?.url) return null

  return (
    <NextImage
      src={resolved.url}
      alt={resolved.alt ?? ''}
      width={resolved.width ?? 400}
      height={resolved.height ?? 400}
      sizes={sizes}
      className={cn('aspect-square rounded-full object-cover', className)}
    />
  )
}
