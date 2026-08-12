import NextImage from 'next/image'

import { cn } from '@/lib/cn'
import type { Media } from '@/payload-types'

export type MediaValue = number | Media | null | undefined

export function resolveMedia(value: MediaValue): Media | null {
  return typeof value === 'object' && value !== null ? value : null
}

type MediaImageProps = {
  media: MediaValue
  className?: string
  sizes?: string
  priority?: boolean
  fallbackWidth?: number
  fallbackHeight?: number
}

export function MediaImage({
  media,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  fallbackWidth = 1200,
  fallbackHeight = 800,
}: MediaImageProps) {
  const resolved = resolveMedia(media)
  if (!resolved?.url) return null

  return (
    <NextImage
      src={resolved.url}
      alt={resolved.alt ?? ''}
      width={resolved.width ?? fallbackWidth}
      height={resolved.height ?? fallbackHeight}
      sizes={sizes}
      priority={priority}
      className={cn('h-auto w-full', className)}
    />
  )
}

export function RoundImage({ media, className, sizes = '160px' }: MediaImageProps) {
  return (
    <MediaImage
      media={media}
      sizes={sizes}
      fallbackWidth={400}
      fallbackHeight={400}
      className={cn('aspect-square rounded-full object-cover', className)}
    />
  )
}
