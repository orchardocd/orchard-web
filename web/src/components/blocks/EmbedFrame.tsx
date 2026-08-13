import { cn } from '@/lib/cn'

const GOOGLE_MAP = /^https?:\/\/(?:[\w-]+\.)*google\.[\w.]+\/maps/
const MAP_ZOOM = /([?&]z=)(\d+)/
const MIN_MAP_ZOOM = 16

function withVenueZoom(url: string): string {
  if (!GOOGLE_MAP.test(url)) return url
  const zoom = MAP_ZOOM.exec(url)
  if (!zoom || Number(zoom[2]) >= MIN_MAP_ZOOM) return url
  return `${url.slice(0, zoom.index)}${zoom[1]}${MIN_MAP_ZOOM}${url.slice(zoom.index + zoom[0].length)}`
}

/** A third-party embed that is not a video, such as a map. */
export function EmbedFrame({
  url,
  title,
  className,
}: {
  url: string
  title?: string | null
  className?: string
}) {
  if (!/^https?:\/\//.test(url)) return null

  return (
    <div className={cn('w-full', className)}>
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-mist flow:mx-auto flow:h-full flow:w-auto">
        <iframe
          src={withVenueZoom(url)}
          title={title || 'Map'}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  )
}
