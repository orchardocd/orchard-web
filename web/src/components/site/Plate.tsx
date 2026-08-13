import { MediaImage, resolveMedia, type MediaValue } from '@/components/ui/Media'
import { cn } from '@/lib/cn'

const PLATE =
  'flex w-full grow items-center justify-center overflow-hidden rounded-lg border border-line bg-white p-6'
const PLATE_ART = 'mx-auto max-h-plate w-full rounded-lg object-contain'

export const PLATE_SIZES =
  '(min-width: 57rem) 32.25rem, (min-width: 768px) 40rem, calc(100vw - 3rem)'
export const BAND_SIZES = '(min-width: 57rem) 70.5rem, (min-width: 768px) 40rem, calc(100vw - 3rem)'

export type FigureSize = 'plate' | 'band' | 'mark'

const PLATE_VARIANTS: Record<FigureSize, { box: string; art: string; sizes: string }> = {
  plate: { box: 'flow:min-h-plate', art: 'flow:max-h-80', sizes: PLATE_SIZES },
  band: { box: 'flow:min-h-plate', art: 'flow:max-h-band-art', sizes: BAND_SIZES },
  mark: { box: '', art: 'flow:max-h-plate', sizes: PLATE_SIZES },
}

export type PlateProps = {
  caption?: string | null
  href?: string | null
  size?: FigureSize
  sizes?: string
  priority?: boolean
  className?: string
}

export function Plate({
  media,
  caption,
  href,
  size = 'plate',
  sizes,
  priority = false,
  className,
}: PlateProps & { media: MediaValue }) {
  const variant = PLATE_VARIANTS[size]
  const art = (
    <MediaImage
      media={media}
      fills={resolveMedia(media)?.mimeType === 'image/svg+xml'}
      priority={priority}
      className={cn(PLATE_ART, variant.art)}
      sizes={sizes ?? variant.sizes}
    />
  )

  return (
    <figure className={cn('flex w-full flex-col', className)}>
      <div className={cn(PLATE, variant.box)}>
        {href ? (
          <a
            href={href}
            rel="noreferrer"
            className="flex h-full w-full items-center justify-center"
          >
            {art}
          </a>
        ) : (
          art
        )}
      </div>
      {caption ? <figcaption className="mt-3 text-sm text-faint">{caption}</figcaption> : null}
    </figure>
  )
}
