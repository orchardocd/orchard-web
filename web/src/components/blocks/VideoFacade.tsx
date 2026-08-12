'use client'

import { useState } from 'react'

import { MediaImage } from '@/components/ui/Media'
import type { Media } from '@/payload-types'

export function VideoFacade({
  src,
  title,
  poster,
}: {
  src: string
  title: string
  poster?: Media | null
}) {
  const [playing, setPlaying] = useState(false)

  if (playing) {
    return (
      <iframe
        src={`${src}${src.includes('?') ? '&' : '?'}autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Watch Now: ${title}`}
      className="group absolute inset-0 h-full w-full cursor-pointer"
    >
      <MediaImage media={poster} className="h-full w-full object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
      <span className="absolute inset-0 flex items-end justify-start bg-gradient-to-t from-ink/70 via-ink/10 to-transparent p-4 transition-colors group-hover:from-ink/85">
        <span className="rounded-full bg-white px-5 py-2.5 text-base font-bold text-ink">
          Watch Now
        </span>
      </span>
    </button>
  )
}
