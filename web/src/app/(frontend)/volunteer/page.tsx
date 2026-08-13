import type { Metadata } from 'next'

import { Figure, PageBanner, PageSection, Prose, TextWithFigure } from '@/components/site'

export const metadata: Metadata = {
  title: 'Volunteer',
  description:
    'We treasure our volunteers here at Orchard OCD. Even the smallest support can make a big difference to our work.',
}

export default function VolunteerPage() {
  return (
    <>
      <PageBanner title="Volunteer" eyebrow="Get Involved">
        <p>
          We treasure our volunteers here at Orchard OCD. Even the smallest support can make a big
          difference to our work; we certainly wouldn’t be in the position we are currently without
          the commitment and kindness of our volunteers.
        </p>
      </PageBanner>

      <PageSection label="Volunteering with Orchard OCD">
        <Prose>
          <p>
            We are always on the lookout for volunteers to help us with a range of activities,
            including marketing, design, communications, fundraising, project organisation,
            on-the-day support, photography, and scientific advice. Whether you are experienced in
            these areas or a complete beginner, we are sure to have something to suit your skills,
            availability, and personal development goals.
          </p>
          <p>
            To find out more and register your interest, please email{' '}
            <a href="mailto:nick@orchardocd.org">nick@orchardocd.org</a>.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Volunteer Testimony" tone="mist">
        <TextWithFigure
          figure={
            <Figure
              file="2022-06-Picture-1-1.png"
              alt="Tracy, a volunteer with Orchard OCD"
              caption="Tracy - Orchard Volunteer"
            />
          }
        >
          <Prose>
            <h3>1. Why did you join the Orchard volunteer group?</h3>
            <p>
              Having experienced OCD, I wanted to actively do something to respond to the impact it
              has and help to make things better for everyone affected.
            </p>
            <h3>2. Why do you support Orchard</h3>
            <p>
              I know how much of a difference it would make to the lives of people with OCD for more
              effective treatments to be available
            </p>
            <h3>3. Why do we need Orchard?</h3>
            <p>
              To help drive the effort to undertake research and find new treatments – to make it
              happen
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>
    </>
  )
}
