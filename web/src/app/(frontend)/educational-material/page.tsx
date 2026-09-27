import type { Metadata } from 'next'
import Link from 'next/link'

import { PageBanner, PageSection, Prose } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Educational material',
  description:
    'Explore Orchard OCD podcasts, conference recordings, webinars and Nick Sireau’s writing.',
}

const CHRISTINE_PODCAST =
  'https://woteuvxtmppyrqmvglwq.supabase.co/storage/v1/object/public/audio/podcasts/af8a7ac6-d652-47d2-abae-bb7e059ba877.ogg'

export default function EducationalMaterialPage() {
  return (
    <>
      <PageBanner title="Educational material">
        <p>Conversations, talks and writing from the Orchard OCD community.</p>
      </PageBanner>

      <PageSection heading="Podcasts">
        <Prose>
          <h3>Christine Lochner</h3>
          <p>An Orchard podcast conversation with Professor Christine Lochner.</p>
        </Prose>
        <audio
          controls
          preload="none"
          aria-label="Orchard podcast with Professor Christine Lochner"
          className="mt-6 w-full max-w-measure"
          src={CHRISTINE_PODCAST}
        >
          <a href={CHRISTINE_PODCAST}>Listen to the Christine Lochner podcast</a>
        </audio>
        <Prose className="mt-4">
          <p>
            <a href={CHRISTINE_PODCAST}>Open the audio recording</a> (38 minutes).
          </p>
          <h3>Conference podcasts</h3>
          <p>
            Listen to podcasts accompanying talks from the June 2026 Orchard OCD International
            Scientific Conference, alongside their abstracts and other resources.
          </p>
          <p>
            <Link href="/past-conferences/2026#podcasts">Browse conference podcasts</Link>
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Nick Sireau’s Substack" tone="mist">
        <Prose>
          <p>Read Nick Sireau’s articles and listen to his podcast conversations on Substack.</p>
        </Prose>
        <p className="mt-8">
          <ButtonLink href="https://substack.com/@nicksireau">Visit Nick’s Substack</ButtonLink>
        </p>
      </PageSection>

      <PageSection heading="Talks and webinars">
        <Prose>
          <p>
            Watch our <Link href="/webinars">webinars</Link> or explore the recordings and resources
            from <Link href="/past-conferences">past conferences</Link>.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
