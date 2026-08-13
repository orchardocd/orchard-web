import { VideoEmbed } from '@/components/blocks/VideoEmbed'
import { siteImage } from '@/components/site/media'

export async function Video({
  url,
  title,
  poster,
  className,
}: {
  url: string
  title: string
  poster?: string
  className?: string
}) {
  return (
    <VideoEmbed
      url={url}
      title={title}
      poster={poster ? await siteImage(poster) : undefined}
      className={className}
    />
  )
}
