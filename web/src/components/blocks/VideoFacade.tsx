'use client'

import { useState } from 'react'

import { Image } from '@/components/ui/Media'
import type { Media } from '@/payload-types'

export function VideoFacade({
  src,
  title,
  poster,
}: {
  src: string
  title: string
  poster: Media
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
      className="group absolute inset-0 h-full w-full cursor-pointer"
    >
      <Image media={poster} className="h-full w-full object-cover" sizes="(min-width: 1024px) 60vw, 100vw" />
      <span className="absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors group-hover:bg-ink/40">
        <span className="rounded-full bg-lime px-7 py-4 text-lg font-bold text-ink-on-lime">
          ▶ Play
        </span>
      </span>
      <span className="sr-only">Play video: {title}</span>
    </button>
  )
}
