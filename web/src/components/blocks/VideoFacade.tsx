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
      <MediaImage
        media={poster}
        fills
        className="h-full w-full object-cover"
        sizes="(min-width: 1024px) 60vw, 100vw"
      />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors group-hover:bg-ink/45">
        <span className="flex items-center gap-3 rounded-full bg-white/95 px-5 py-2.5 text-base font-bold text-ink shadow-lg">
          <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-lime">
            <svg viewBox="0 0 12 14" className="h-3 w-3 fill-ink-on-lime" focusable="false">
              <path d="M0 0l12 7-12 7z" />
            </svg>
          </span>
          Watch Now
        </span>
      </span>
    </button>
  )
}
