import type { Metadata } from 'next'

import { PeopleSections } from '@/components/content/PeopleSections'
import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { PageBanner, PageSection, Photo, Prose } from '@/components/site'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  title: 'About the Orchard OCD College',
  description:
    'The Orchard OCD College comprises prominent researchers and clinicians in the field of Obsessive-Compulsive Disorder working in the UK and internationally.',
}

function Officer({ file, title, name }: { file: string; title: string; name: string }) {
  return (
    <li className="flex flex-col items-center gap-4 rounded-lg border border-line p-6 text-center">
      <Photo file={file} alt={name} sizes="200px" className="w-40" />
      <h2 className={cn(CARD_TITLE_CLASSES, 'text-brand-link')}>{title}</h2>
      <p className="text-base leading-relaxed text-body">{name}</p>
    </li>
  )
}

export default function AboutCollegePage() {
  return (
    <>
      <PageBanner
        title="About the Orchard OCD College"
        image="2025-06-IMG-6588-1.jpg"
        imageAlt="Members of the Orchard OCD College gathered for a group photograph"
      />

      <PageSection label="The Orchard OCD College">
        <Prose>
          <p>
            The Orchard OCD College was created in March 2024. Working under the umbrella of Orchard
            OCD, the College comprises prominent researchers and clinicians in the field of
            Obsessive-Compulsive Disorder (OCD) working in the UK and internationally. With over 50
            members, our goal is to advance understanding and improve health and wellbeing of people
            with Obsessive Compulsive and Related Disorders (OCRDs) through supporting research
            collaborations, raising awareness about OCRDs, and informing public policies.
          </p>
        </Prose>
        <ul className="mt-12 grid max-w-2xl gap-8 sm:grid-cols-2">
          <Officer file="2025-06-1.png" title="Chair" name="Naomi Fineberg" />
          <Officer file="2025-06-2.png" title="Secretary" name="Ana Maria Pereira de Souza" />
        </ul>
      </PageSection>

      <PeopleSections only={['college']} />
    </>
  )
}
