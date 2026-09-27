import type { Metadata } from 'next'
import Link from 'next/link'

import { PageBanner, PageSection, Prose } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'
import conference from '@/data/conference-2026.json'

export const metadata: Metadata = {
  title: '2026 conference archive',
  description:
    'Watch recordings and explore talks, podcasts and infographics from the Orchard OCD International Scientific Conference, 4–5 June 2026 in London.',
}

const LINK_CLASSES = 'font-bold text-brand-link underline underline-offset-4'
const TIME_FORMAT = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/London',
})

const podcasts = conference.talks.flatMap((talk) =>
  talk.resources
    .filter((resource) => resource.type === 'podcast')
    .map((resource) => ({ ...resource, talkId: talk.id, talkTitle: talk.title })),
)

export default function ConferenceArchivePage() {
  return (
    <>
      <PageBanner
        title={conference.event.title}
        eyebrow="Conference archive · 4–5 June 2026 · London"
        actions={
          <>
            <ButtonLink href="#recordings" variant="light">
              Watch recordings
            </ButtonLink>
            <ButtonLink href="#programme" variant="ghost">
              Explore the programme
            </ButtonLink>
            <ButtonLink href="#podcasts" variant="ghost">
              Listen to podcasts
            </ButtonLink>
          </>
        }
      >
        <p>
          Revisit the two-day scientific meeting through session recordings, speaker abstracts and
          supporting resources.
        </p>
      </PageBanner>

      <PageSection heading="Session recordings" id="recordings">
        <div className="grid items-start gap-x-8 gap-y-12 lg:grid-cols-2">
          {conference.recordings.map((recording) => (
            <article key={recording.id} aria-labelledby={`recording-${recording.id}`}>
              <h3 id={`recording-${recording.id}`} className="mb-4 text-2xl font-bold text-ink">
                {recording.title}
              </h3>
              <video
                controls
                preload="none"
                aria-labelledby={`recording-${recording.id}`}
                className="aspect-video w-full rounded-lg bg-brand-deep"
              >
                <source src={recording.url} type="video/mp4" />
                <a href={recording.url}>Watch {recording.title}</a>
              </video>
              <p className="mt-3 text-sm text-body">
                {Math.floor(recording.durationSeconds / 60)} minutes
              </p>
              {recording.description ? (
                <p className="mt-3 leading-relaxed text-body">{recording.description}</p>
              ) : null}
              <p className="mt-3">
                <a className={LINK_CLASSES} href={recording.url}>
                  Open recording<span className="sr-only">: {recording.title}</span>
                </a>
              </p>
            </article>
          ))}
        </div>
      </PageSection>

      <PageSection heading="Programme and abstracts" id="programme" tone="mist">
        <p className="mb-8 max-w-measure leading-relaxed text-body">
          Times are shown in London time. Open a talk to read its abstract and explore the available
          resources.
        </p>
        <div className="space-y-12">
          {[1, 2].map((day) => (
            <section key={day} aria-labelledby={`day-${day}`}>
              <h3 id={`day-${day}`} className="mb-6 text-2xl font-bold text-ink">
                Day {day} · {day === 1 ? '4' : '5'} June 2026
              </h3>
              <ul className="space-y-3">
                {conference.talks
                  .filter((talk) => talk.day === day)
                  .map((talk) => (
                    <li key={talk.id} id={`talk-${talk.id}`} className="scroll-mt-8">
                      <details className="rounded-lg border border-line bg-white px-5 py-4">
                        <summary className="cursor-pointer text-lg font-bold text-brand-link">
                          {talk.startsAt ? (
                            <time dateTime={talk.startsAt} className="mr-3 text-sm text-body">
                              {TIME_FORMAT.format(new Date(talk.startsAt))}
                            </time>
                          ) : null}
                          <span>{talk.title}</span>
                        </summary>
                        <div className="mt-5 space-y-5">
                          {talk.session ? (
                            <p className="text-sm text-body">{talk.session}</p>
                          ) : null}
                          {talk.speakers.length ? (
                            <ul className="space-y-2 text-body">
                              {talk.speakers.map((speaker) => (
                                <li key={speaker.name}>
                                  <strong className="text-ink">{speaker.name}</strong>
                                  {speaker.institution ? ` · ${speaker.institution}` : ''}
                                </li>
                              ))}
                            </ul>
                          ) : null}
                          {talk.description ? (
                            <Prose>
                              {talk.description.split(/\n\s*\n/).map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                              ))}
                            </Prose>
                          ) : (
                            <p className="text-body">An abstract is not available for this talk.</p>
                          )}
                          {talk.resources.length ? (
                            <ul className="flex flex-wrap gap-x-6 gap-y-3">
                              {talk.resources.map((resource, resourceIndex) => (
                                <li key={resource.id}>
                                  <a
                                    className={LINK_CLASSES}
                                    href={
                                      resource.type === 'podcast'
                                        ? `#podcast-${resource.id}`
                                        : resource.url
                                    }
                                  >
                                    {resource.type === 'podcast'
                                      ? 'Listen to podcast'
                                      : 'View infographic'}
                                    <span className="sr-only">
                                      : {resource.title || talk.title}, resource {resourceIndex + 1}
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      </details>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </PageSection>

      <PageSection heading="Conference podcasts" id="podcasts">
        <ul className="grid items-start gap-8 lg:grid-cols-2">
          {podcasts.map((podcast) => (
            <li key={podcast.id} id={`podcast-${podcast.id}`} className="scroll-mt-8 space-y-4">
              <h3 className="text-xl font-bold text-ink">{podcast.title || podcast.talkTitle}</h3>
              {podcast.caption ? (
                <p className="leading-relaxed text-body">{podcast.caption}</p>
              ) : null}
              <audio
                controls
                preload="none"
                aria-label={podcast.title || podcast.talkTitle}
                className="w-full"
              >
                <source src={podcast.url} type="audio/ogg" />
                <a href={podcast.url}>Listen to {podcast.title || podcast.talkTitle}</a>
              </audio>
              <a className={LINK_CLASSES} href={podcast.url}>
                Open audio<span className="sr-only">: {podcast.title || podcast.talkTitle}</span>
              </a>
            </li>
          ))}
        </ul>
      </PageSection>

      <PageSection label="Conference archive navigation" tone="ruled">
        <Prose>
          <p>
            <Link href="/past-conferences">All past conferences</Link>
          </p>
          <p>
            Programme and resources from the{' '}
            <a href={conference.source}>Orchard OCD conference app</a>.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
