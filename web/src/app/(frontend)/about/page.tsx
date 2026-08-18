import type { Metadata } from 'next'

import { PeopleSections } from '@/components/content/PeopleSections'
import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { LABEL_CLASSES, PageBanner, PageSection, Photo, Prose } from '@/components/site'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  title: 'About the Orchard OCD College',
  description:
    'The Orchard OCD College comprises prominent researchers and clinicians in the field of Obsessive-Compulsive Disorder working in the UK and internationally.',
}

function Officer({ file, title, name }: { file: string; title: string; name: string }) {
  return (
    <li className="flex flex-col items-center gap-4 rounded-lg border border-line p-5 text-center md:p-7">
      <div className="w-36 overflow-hidden rounded-full bg-mist ring-1 ring-line">
        <Photo
          file={file}
          alt=""
          sizes="300px"
          className="aspect-square scale-[2.08] object-cover grayscale"
        />
      </div>
      <p className={cn(LABEL_CLASSES, 'text-faint')}>{title}</p>
      <p className={cn(CARD_TITLE_CLASSES, 'text-brand-link')}>{name}</p>
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
        <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          <Officer file="2025-06-1.png" title="Chair" name="Naomi Fineberg" />
          <Officer file="2025-06-2.png" title="Secretary" name="Ana Maria Pereira de Souza" />
        </ul>
      </PageSection>

      <PeopleSections only={['college']} />
    </>
  )
}
