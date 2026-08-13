import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { resolveMedia, RoundImage } from '@/components/ui/Media'
import { cn } from '@/lib/cn'
import { getSpeakers } from '@/lib/payload'

export async function SpeakerGrid({ names }: { names: string[] }) {
  const speakers = await getSpeakers()
  const byName = new Map(speakers.map((speaker) => [speaker.name, speaker]))

  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {names.map((name) => {
        const speaker = byName.get(name)
        if (!speaker) throw new Error(`No speaker named "${name}" in the speakers collection`)
        const photo = resolveMedia(speaker.photo)

        return (
          <li key={name} className="flex flex-col items-center gap-4 text-center">
            {photo ? (
              <RoundImage media={{ ...photo, alt: '' }} className="w-32" sizes="128px" />
            ) : null}
            <h3 className={cn(CARD_TITLE_CLASSES, 'text-balance text-brand-link')}>
              {speaker.name}
            </h3>
            {speaker.role ? (
              <p className="text-sm leading-relaxed text-body">{speaker.role}</p>
            ) : null}
          </li>
        )
      })}
    </ul>
  )
}
