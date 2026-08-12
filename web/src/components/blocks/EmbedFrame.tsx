import { cn } from '@/lib/cn'

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
      <div className="relative aspect-video overflow-hidden rounded-lg bg-mist">
        <iframe
          src={url}
          title={title || 'Map'}
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  )
}
