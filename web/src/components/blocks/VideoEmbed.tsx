import { VideoFacade } from '@/components/blocks/VideoFacade'
import { resolveMedia } from '@/components/ui/Media'
import { cn } from '@/lib/cn'

const YOUTUBE = /(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/
const VIMEO = /vimeo\.com\/(?:video\/)?(\d+)/

export function embedUrl(url: string): string | null {
  const youtube = YOUTUBE.exec(url)
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`
  const vimeo = VIMEO.exec(url)
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`
  if (/^https?:\/\//.test(url)) return url
  return null
}

export function VideoEmbed({
  url,
  title,
  className,
  poster,
}: {
  url: string
  title?: string | null
  className?: string
  poster?: unknown
}) {
  const src = embedUrl(url)
  if (!src) return null
  const posterMedia = resolveMedia(poster as Parameters<typeof resolveMedia>[0])

  return (
    <div className={cn('mx-auto max-w-4xl', className)}>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-brand-dark">
        {posterMedia ? (
          <VideoFacade src={src} title={title || 'Video'} poster={posterMedia} />
        ) : (
          <iframe
            src={src}
            title={title || 'Video'}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
    </div>
  )
}

export function VideoPlayer({
  block,
}: {
  block: { url?: string | null; file?: unknown; title?: string | null; poster?: unknown }
}) {
  const file = typeof block.file === 'object' && block.file !== null ? (block.file as { url?: string | null; title?: string | null }) : null

  if (file?.url) {
    return (
      <div className="mx-auto max-w-4xl">
        <video controls preload="metadata" className="w-full rounded-lg bg-brand-dark">
          <source src={file.url} type="video/mp4" />
          Your browser does not support embedded video.
        </video>
      </div>
    )
  }

  return block.url ? (
    <VideoEmbed url={block.url} title={block.title} poster={block.poster} />
  ) : null
}
