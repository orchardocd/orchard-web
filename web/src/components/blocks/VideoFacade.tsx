'use client'

import { useState } from 'react'

import { DashRects } from '@/components/layout/DashPattern'
import { MediaImage } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import type { Media } from '@/payload-types'

const DASHES = [
  { x: 20, y: 26, w: 56, r: -24 },
  { x: 248, y: 20, w: 34, r: 24 },
  { x: 272, y: 88, w: 48, r: 90 },
  { x: 30, y: 118, w: 34, r: 24 },
  { x: 128, y: 150, w: 56, r: 0 },
  { x: 214, y: 138, w: 34, r: -24 },
]

function DashField() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 180"
      focusable="false"
      className="absolute inset-0 h-full w-full"
    >
      <DashRects dashes={DASHES} height={10} opacity={0.18} />
    </svg>
  )
}

function PlayPill({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center rounded-full bg-white/95 font-bold text-ink shadow-lg transition-colors group-hover:bg-white',
        compact ? 'gap-2 px-3.5 py-2 text-sm' : 'gap-3 px-5 py-2.5 text-base',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex items-center justify-center rounded-full bg-brand-strong',
          compact ? 'h-6 w-6' : 'h-7 w-7',
        )}
      >
        <svg
          viewBox="0 0 12 14"
          className={cn('fill-white', compact ? 'h-2.5 w-2.5' : 'h-3 w-3')}
          focusable="false"
        >
          <path d="M0 0l12 7-12 7z" />
        </svg>
      </span>
      Watch Now
    </span>
  )
}

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
      {poster ? (
        <>
          <MediaImage
            media={poster}
            fills
            className="h-full w-full object-cover"
            sizes="(min-width: 1024px) 60vw, 100vw"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-ink/70 to-transparent transition-colors group-hover:from-ink/85"
          />
          <span className="absolute right-3 bottom-3">
            <PlayPill compact />
          </span>
        </>
      ) : (
        <>
          <DashField />
          <span className="absolute inset-0 flex items-center justify-center transition-colors group-hover:bg-ink/20">
            <PlayPill />
          </span>
        </>
      )}
    </button>
  )
}
