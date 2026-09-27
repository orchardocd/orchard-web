import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'
import conference from '@/data/conference-2026.json'

export const metadata: Metadata = {
  title: 'Past conferences',
  description: 'Explore recordings, talks and resources from past Orchard OCD conferences.',
}

export default function PastConferencesPage() {
  return (
    <>
      <PageBanner title="Past conferences">
        <p>Explore the research and conversations from Orchard OCD scientific meetings.</p>
      </PageBanner>

      <PageSection heading={conference.event.title}>
        <Prose>
          <p className="font-bold">4–5 June 2026 · {conference.event.location}</p>
          <p>
            Revisit {conference.recordings.length} session recordings and {conference.talks.length}{' '}
            talks, with speaker information, abstracts, podcasts and infographics.
          </p>
        </Prose>
        <div className="mt-8">
          <ButtonLink href="/past-conferences/2026">Explore the 2026 conference</ButtonLink>
        </div>
      </PageSection>
    </>
  )
}
