import { MediaImage, type MediaValue } from '@/components/ui/Media'
import { cn } from '@/lib/cn'

const PLATE = 'flex w-full items-center justify-center overflow-hidden rounded-lg bg-mist p-6'
const PLATE_ART = 'mx-auto max-h-56 w-auto max-w-full rounded-lg object-contain'

export const PLATE_SIZES =
  '(min-width: 57rem) 32.25rem, (min-width: 768px) 40rem, calc(100vw - 3rem)'
export const BAND_SIZES = '(min-width: 57rem) 70.5rem, (min-width: 768px) 40rem, calc(100vw - 3rem)'

export type FigureSize = 'plate' | 'band'

export type PlateProps = {
  caption?: string | null
  href?: string | null
  size?: FigureSize
  sizes?: string
  className?: string
}

export function Plate({
  media,
  caption,
  href,
  size = 'plate',
  sizes,
  className,
}: PlateProps & { media: MediaValue }) {
  const band = size === 'band'
  const art = (
    <MediaImage
      media={media}
      className={cn(PLATE_ART, band ? 'flow:max-h-band-art' : 'flow:max-h-full')}
      sizes={sizes ?? (band ? BAND_SIZES : PLATE_SIZES)}
    />
  )

  return (
    <figure className={cn('w-full', className)}>
      <div className={cn(PLATE, band ? 'flow:min-h-plate' : 'flow:h-plate')}>
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
