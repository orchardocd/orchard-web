import type { Metadata } from 'next'

import { EmbedFrame } from '@/components/blocks/EmbedFrame'
import { SpeakerGrid } from '@/components/content/SpeakerGrid'
import { Figure, PageBanner, PageSection, Photo } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Conference',
  description:
    'ORCHARD OCD INTERNATIONAL SCIENTIFIC Conference 4-5TH JUNE 2026 Secure Your Spot! Get Your Ticket At 30 Euston Square, London NW1 2FB Download Guidelines Our Speakers Download Brochure Add Your Heading Text Here',
}

const TICKETS_URL =
  'https://www.eventbrite.co.uk/e/orchard-ocd-international-scientific-conference-tickets-1865601597599'
const BROCHURE_URL =
  'https://www.orchardocd.org/wp-content/uploads/2024/08/Orchard_OCD_Conference_Ad-1.pdf'
const GUIDELINES_URL =
  'https://www.orchardocd.org/wp-content/uploads/2025/11/Poster-Guidelines-Orchard-Scientific-Meeting-2026.pdf'
const VENUE_MAP_URL =
  'https://maps.google.com/maps?q=30%20Euston%20Square%2C%20NW1%202FB&t=m&z=10&output=embed&iwloc=near'

const SPEAKERS = [
  'Zhen Wang',
  'Lena Jelinek',
  'Daniel Geller',
  'Elsa Fouragnan',
  'Ludvic Zrinzo',
  'Christine Lochner',
  'Susanne Walitza',
  'Eric Hollander',
  'Matilde Vaghi',
  'Max Ahmed',
  'Tobias Hauser',
  'Sabine Wilhelm',
  'Samuel Chamberlain',
  'Rebecca Price',
  'Odile Van Den Heuvel',
  'Nora Strom',
  'Nick Sireau',
  'Michael Van Ameringen',
  'Naomi Fineberg',
  'Lynne Drummond',
  'Leonardo Fontenelle',
  'Kate Fitzgerald',
  'Jon Grant',
  'Isaac Fradkin',
  'Janardhan Reddy',
  'Dominique Endres',
  'David Mataix-Cols',
  'Christopher Pittenger',
  'Carolyn Rodriguez',
  'Andreas Horn',
  'Trevor Robbins',
  'Amy Milton',
  'David Veale',
  'Himanshu Tyagi',
]

export default function ConferenceCallForPostersPage() {
  return (
    <>
      <PageBanner
        title="ORCHARD OCD INTERNATIONAL SCIENTIFIC Conference"
        eyebrow="4-5TH JUNE 2026"
        actions={
          <ButtonLink href={BROCHURE_URL} variant="ghost">
            Download Brochure
          </ButtonLink>
        }
      />

      <PageSection heading="Secure Your Spot!">
        <div className="grid gap-12 flow:grid-cols-[1fr_24rem] flow:items-start">
          <div className="flex flex-col items-start gap-9">
            <Figure
              file="2024-08-Group-8.svg"
              alt="A speaker at a lectern addressing a seated audience under a conference banner"
            />
            <ButtonLink href={TICKETS_URL}>Get Your Ticket</ButtonLink>
          </div>
          <div className="flex w-full flex-col items-start gap-6">
            <Photo
              file="2026-03-Copy-of-POSTERS.jpg"
              sizes="(min-width: 57rem) 24rem, calc(100vw - 3rem)"
            />
            <ButtonLink href={GUIDELINES_URL} variant="secondary">
              Download Guidelines
            </ButtonLink>
          </div>
        </div>
      </PageSection>

      <PageSection heading="At 30 Euston Square, London NW1 2FB" id="venue" tone="deep">
        <EmbedFrame
          url={VENUE_MAP_URL}
          title="30 Euston Square, London NW1 2FB"
          className="max-w-3xl"
        />
      </PageSection>

      <PageSection heading="Our Speakers">
        <SpeakerGrid names={SPEAKERS} />
      </PageSection>
    </>
  )
}
