import type { Metadata } from 'next'

import { WebinarList } from '@/components/content/WebinarList'
import { Figure, PageBanner, PageSection, Prose, TextWithFigure } from '@/components/site'

export const metadata: Metadata = {
  title: 'Webinars',
}

const MADE_OF_MILLIONS = 'https://www.madeofmillions.com/'

export default function WebinarsPage() {
  return (
    <>
      <PageBanner title="Webinars" />

      <WebinarList />

      <PageSection label="Made of Millions" tone="ruled">
        <TextWithFigure
          figure={
            <Figure
              file="2022-06-logo-MadeofMillions.svg"
              alt="Made of Millions"
              href={MADE_OF_MILLIONS}
            />
          }
        >
          <Prose>
            <p>
              Above is a list of webinars we have hosted in partnership with{' '}
              <a href={MADE_OF_MILLIONS}>Made of Millions</a>. A special thank you to Orchard OCD
              Trustee &amp; Journalist Sean Fletcher for hosting these informative webinars.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>
    </>
  )
}
