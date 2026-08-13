import type { Metadata } from 'next'

import { EmbedFrame } from '@/components/blocks/EmbedFrame'
import { SpeakerGrid } from '@/components/content/SpeakerGrid'
import { Figure, Mark, PageBanner, PageSection, Prose } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Conference',
  description:
    'ORCHARD OCD INTERNATIONAL SCIENTIFIC CONFERENCE 4-5TH JUNE 2026 Secure Your Spot! Secure Your Spot SUPPORTED BY Made possible by a Wellcome Trust Award EXHIBITORS International OCD Foundation, OCD Action & British Association for Psychopharmacology At 30 Euston Square, London NW1 2FB View Programme View Web App Guide Our Speakers Our Chairs',
}

const TICKETS_URL =
  'https://www.eventbrite.co.uk/e/orchard-ocd-international-scientific-conference-tickets-1865601597599'
const PROGRAMME_URL = 'https://drive.google.com/file/d/13rjMuHY7uyDjLnWX_znslP4bNJOy4uL2/view'
const WEB_APP_GUIDE_URL =
  'https://drive.google.com/file/d/1GbgS3bU4_vNHyoLhyhrUdTu2HTBn3xbZ/view?usp=drive_link'
const VENUE_MAP_URL =
  'https://maps.google.com/maps?q=30%20Euston%20Square%2C%20London%20NW1%202FB&t=m&z=10&output=embed&iwloc=near'
const VENUE = '30 Euston Square, London NW1 2FB'

const SENTENCE_CASE_HEADING = '[&_h2]:lowercase [&_h2]:first-letter:uppercase'
const EXHIBITOR_SIZES = '(min-width: 640px) 20rem, calc(100vw - 3rem)'

const SPEAKERS = [
  'Zhen Wang',
  'Lena Jelinek',
  'Elsa Fouragnan',
  'Ludvic Zrinzo',
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
]

const CHAIRS = [
  'Amy Milton',
  'David Veale',
  'Himanshu Tyagi',
  'Eric Hollander',
  'Susanne Walitza',
  'Christine Lochner',
  'Daniel Geller',
]

export default function ConferencePage() {
  return (
    <>
      <PageBanner
        title="ORCHARD OCD INTERNATIONAL SCIENTIFIC CONFERENCE"
        eyebrow="4-5TH JUNE 2026"
      />

      <PageSection heading="Secure Your Spot!">
        <Figure
          file="2024-08-Group-8.svg"
          alt="A speaker at a lectern addressing a seated audience under a conference banner"
          size="band"
          sizes="(min-width: 57rem) 33rem, calc(100vw - 3rem)"
          className="max-w-xl"
        />
        <p className="mt-8">
          <ButtonLink href={TICKETS_URL}>Secure Your Spot</ButtonLink>
        </p>
      </PageSection>

      <PageSection heading="SUPPORTED BY" tone="mist" className={SENTENCE_CASE_HEADING}>
        <div className="flex max-w-measure flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          <Mark
            file="2026-04-Wellcome-Trust.png"
            alt="Wellcome Trust"
            sizes="12rem"
            className="w-full max-w-48 shrink-0"
          />
          <p className="text-lg leading-relaxed text-body md:text-xl">
            Made possible by a Wellcome Trust Award
          </p>
        </div>
      </PageSection>

      <PageSection heading="EXHIBITORS" className={SENTENCE_CASE_HEADING}>
        <Prose>
          <p>
            International OCD Foundation, OCD Action &amp; British Association for
            Psychopharmacology
          </p>
        </Prose>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <Mark
            file="2017-04-The-D-in-OCD.png"
            alt="International OCD Foundation"
            sizes={EXHIBITOR_SIZES}
          />
          <Mark file="2026-04-OCD-Action.jpg" alt="OCD Action" sizes={EXHIBITOR_SIZES} />
          <Mark
            file="2026-04-BAP.jpg"
            alt="British Association for Psychopharmacology"
            sizes={EXHIBITOR_SIZES}
          />
        </div>
      </PageSection>

      <PageSection heading="At 30 Euston Square, London NW1 2FB" id="venue" tone="deep">
        <EmbedFrame url={VENUE_MAP_URL} title={VENUE} className="max-w-3xl" />
        <div className="mt-8 flex flex-wrap items-start gap-4">
          <ButtonLink href={PROGRAMME_URL} variant="light">
            View Programme
          </ButtonLink>
          <ButtonLink href={WEB_APP_GUIDE_URL} variant="light">
            View Web App Guide
          </ButtonLink>
        </div>
      </PageSection>

      <PageSection heading="Our Speakers">
        <SpeakerGrid names={SPEAKERS} />
      </PageSection>

      <PageSection heading="Our Chairs" tone="mist">
        <SpeakerGrid names={CHAIRS} />
      </PageSection>
    </>
  )
}
