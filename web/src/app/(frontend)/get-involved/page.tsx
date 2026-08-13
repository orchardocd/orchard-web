import type { Metadata } from 'next'
import Link from 'next/link'

import { Figure, PageBanner, PageSection, Photo, Prose, TextWithFigure } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'
import { CONTACT, DONATE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Get Involved',
  description:
    'There are different ways to get involved with us. You can join our mailing list, you can volunteer with us or fundraise for Orchard.',
}

export default function GetInvolvedPage() {
  return (
    <>
      <PageBanner
        title="Get Involved"
        actions={
          <ButtonLink href={`mailto:${CONTACT.email}`} variant="ghost">
            Volunteer
          </ButtonLink>
        }
      >
        <p>
          There are different ways to get involved with us. You can join our{' '}
          <Link href="/join-our-mailing-list">mailing list</Link>, you can volunteer with us or
          fundraise for Orchard.
        </p>
      </PageBanner>

      <PageSection heading="Donate Now" tone="mist">
        <Prose>
          <p>
            Orchard is a medical charity that develops new and better treatments for
            obsessive-compulsive disorder (OCD). One person out of 30 suffers from OCD, yet current
            treatments are lacking. Please support us as we seek to tackle this severe mental
            illness.
          </p>
        </Prose>
        <div className="mt-8">
          <ButtonLink href={DONATE_URL} variant="donate">
            Donate Now
          </ButtonLink>
        </div>
      </PageSection>

      <PageSection heading="Fundraising & Events">
        <TextWithFigure
          figure={
            <Figure
              file="2022-04-get-involved-first-img.svg"
              alt="Supporters carrying coins and banknotes up to a giant Orchard OCD sign"
            />
          }
        >
          <Prose>
            <p>
              While individual donations are extremely beneficial to supporting the work we do,
              there are more fun ways to fundraise for Orchard OCD. Don’t forget to ask your
              workplace if they can match fund any donations you raise.
            </p>
          </Prose>
          <div className="mt-8">
            <ButtonLink
              href="/fundraising-events"
              variant="secondary"
              detail="about fundraising and events"
            >
              Learn More
            </ButtonLink>
          </div>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="Volunteer" tone="mist">
        <div className="w-full flow:grid flow:grid-cols-[1fr_40rem] flow:items-start flow:gap-x-12">
          <div className="w-full max-w-measure flow:order-2">
            <Prose>
              <p>
                We treasure our volunteers here at Orchard OCD. Even the smallest support can make a
                big difference to our work; we certainly wouldn’t be in the position we are
                currently without the commitment and kindness of our volunteers.
              </p>
            </Prose>
            <div className="mt-8">
              <ButtonLink
                href="/volunteer"
                variant="secondary"
                detail="about volunteering"
              >
                Learn More
              </ButtonLink>
            </div>
          </div>
          <div className="mt-10 flow:order-1 flow:mt-0">
            <Photo
              file="2022-04-get-involved-volunteer-img.svg"
              alt="Five volunteers seen from above, joining hands in a circle"
            />
          </div>
        </div>
      </PageSection>
    </>
  )
}
