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
  /** Let the image fill its box even where that means drawing it past its own pixels. */
  fills?: boolean
  /** Overrides the upload's own alt text. Empty where the picture repeats the words beside it. */
  alt?: string
}

export function MediaImage({
  media,
  className,
  sizes = '(min-width: 1024px) 50vw, 100vw',
  priority = false,
  fallbackWidth = 1200,
  fallbackHeight = 800,
  fills = false,
  alt,
}: MediaImageProps) {
  const resolved = resolveMedia(media)
  if (!resolved?.url) return null

  return (
    <NextImage
      src={resolved.url}
      alt={alt ?? resolved.alt ?? ''}
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

export function RoundImage({ media, className, sizes = '160px', alt }: MediaImageProps) {
  return (
    <MediaImage
      media={media}
      sizes={sizes}
      alt={alt}
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
