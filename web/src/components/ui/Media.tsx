import NextImage from 'next/image'

import { cn } from '@/lib/cn'
import type { Media } from '@/payload-types'

export type MediaValue = number | Media | null | undefined

export function resolveMedia(value: MediaValue): Media | null {
  return typeof value === 'object' && value !== null ? value : null
}

type MediaMetrics = {
  width: number
  height: number
  ratio: number
}

function mediaMetrics(value: MediaValue): MediaMetrics | null {
  const resolved = resolveMedia(value)
  if (!resolved?.width || !resolved.height) return null

  return {
    width: resolved.width,
    height: resolved.height,
    ratio: resolved.width / resolved.height,
  }
}

const WIDE_RATIO = 1.4

export function isWideMedia(value: MediaValue): boolean {
  const metrics = mediaMetrics(value)
  return metrics !== null && metrics.ratio >= WIDE_RATIO
}

type MediaImageProps = {
  media: MediaValue
  className?: string
  sizes?: string
  priority?: boolean
  fallbackWidth?: number
  fallbackHeight?: number
  /** Let the image fill its box even where that means drawing it past its own pixels. */
  fills?: boolean
}

export function MediaImage({
  media,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  fallbackWidth = 1200,
  fallbackHeight = 800,
  fills = false,
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
      // Nothing is worth blowing up past the pixels it was drawn with.
      style={!fills && resolved.width ? { maxWidth: `min(100%, ${resolved.width}px)` } : undefined}
      className={cn('h-auto w-full', className)}
    />
  )
}

export function RoundImage({ media, className, sizes = '160px' }: MediaImageProps) {
  return (
    <MediaImage
      media={media}
      sizes={sizes}
      fills
      fallbackWidth={400}
      fallbackHeight={400}
      className={cn(
        'aspect-square rounded-full bg-mist object-cover ring-1 ring-line grayscale',
        className,
      )}
    />
  )
}
