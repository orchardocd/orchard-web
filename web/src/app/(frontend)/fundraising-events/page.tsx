import type { Metadata } from 'next'
import Link from 'next/link'

import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Fundraising & Events',
  description:
    'While individual donations are extremely beneficial to supporting the work we do, there are more fun ways to fundraise for Orchard OCD.',
}

const FUNDRAISING_EMAIL = 'juliet@orchardocd.org'

const CAPS_HEADING = '[&_h2]:tracking-[0.02em]'

function JustGiving() {
  return (
    <a href="https://www.justgiving.com/" rel="noreferrer">
      JustGiving
    </a>
  )
}

function FundraisingEmail() {
  return <a href={`mailto:${FUNDRAISING_EMAIL}`}>{FUNDRAISING_EMAIL}</a>
}

export default function FundraisingEventsPage() {
  return (
    <>
      <PageBanner title="Fundraising & Events" eyebrow="Get Involved">
        <p>
          While individual donations are extremely beneficial to supporting the work we do, there
          are more fun ways to fundraise for Orchard OCD.
        </p>
      </PageBanner>

      <PageSection heading="FUNDRAISE FOR ORCHARD OCD" className={CAPS_HEADING}>
        <Prose>
          <ul>
            <li>
              Baking: Want to put your baking skills to the test? Bake anything (but make sure you
              label ingredients to help people with allergies!) and sell your baked goods at school,
              workplace, outside your house or community centre.
            </li>
            <li>
              Sponsored event: If you’re a sports enthusiast investigate any local runs (5ks, 10ks,
              half marathons or even a marathon) or other exercise events. Set up a <JustGiving />{' '}
              page and ask friends and family to donate in support of your event. Make sure to keep
              your supporters updated on your journey (training, 1 day before, on the day and day
              after).
            </li>
            <li>
              Dinner: Invite friends, family or colleagues over for a dinner and ask them all to
              donate to Orchard. This means a catch up with friends and an easy way to fundraise.
            </li>
            <li>Car wash: Offer your cleaning skills by doing a fundraising car wash event.</li>
            <li>Coffee morning: Get friends and family involved by hosting a coffee morning.</li>
            <li>
              Dog walking: Get your steps in and walk cute pooches by dog walking for charity. This
              means asking for a donation for each dog walk.
            </li>
            <li>
              Online selling: Use sites like{' '}
              <a href="https://www.vinted.co.uk/" rel="noreferrer">
                Vinted
              </a>
              ,{' '}
              <a href="https://www.depop.com/" rel="noreferrer">
                Depop
              </a>
              ,{' '}
              <a href="https://www.ebay.co.uk/" rel="noreferrer">
                eBay
              </a>{' '}
              to sell anything online and give all (or some) of the profits to Orchard OCD.
            </li>
            <li>
              Hair shave: Treat this like a sponsored event. Set up a <JustGiving /> page for
              friends and family to donate and pick a day where you will shave your hair or dye your
              hair a funky colour.
            </li>
            <li>
              Work out session: Host a workout session either virtually or in-person and ask for
              donations for anyone attending.
            </li>
            <li>
              Quiz night: Create a fun quiz for friends and family and ask for donations to anyone
              wanting to participate. Make sure to think of fun prizes!
            </li>
            <li>
              Raffle: If you have access to gifts to give away then host a raffle and charge for
              raffle tickets.
            </li>
            <li>
              Skydive: Again, this is a sponsored event where you set up a <JustGiving /> page and
              look for local places where you can do a charity skydive.
            </li>
          </ul>
          <p>Don’t forget to ask your workplace if they can match fund any donations you raise.</p>
        </Prose>
      </PageSection>

      <PageSection heading="ORCHARD OCD EVENTS" tone="mist" className={CAPS_HEADING}>
        <Prose>
          <p>If we have any upcoming events, we will post them here. Keep an eye out!</p>
        </Prose>
      </PageSection>

      <PageSection
        heading="CONTACT US FOR IDEAS AND/OR FUNDRAISING ADVICE"
        className={CAPS_HEADING}
      >
        <Prose>
          <p>
            Whether you’re into sports, music, baking, comedy, or just socialising with your
            friends, we have lots of fun-filled fundraising events which you and your friends can
            take part in to raise money for Orchard OCD. We are always looking for new events and
            challenges to organise so if you have any ideas, please get in touch by emailing{' '}
            <FundraisingEmail />.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="CORPORATE PARTNERSHIPS" tone="mist" className={CAPS_HEADING}>
        <Prose>
          <p>
            Here at Orchard OCD, we would love to partner with companies to help us achieve our{' '}
            <Link href="/about-orchard">mission</Link>. OCD is the fourth most common mental
            disorder and the World Health Organization named OCD as one of the most disabling of all
            medical disorders. It is likely your workplace has employees with OCD.
          </p>
          <p>
            A partnership with Orchard OCD would mean being part of our vision where we see a world
            where all patients suffering with OCD receive effective treatment for their condition.
          </p>
          <p>
            If you would like to set up a corporate partnership then please email{' '}
            <FundraisingEmail />.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
