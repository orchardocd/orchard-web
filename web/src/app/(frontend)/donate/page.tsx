import type { Metadata } from 'next'

import { DonationForm } from '@/components/content/DonationForm'
import { PageBanner, PageSection } from '@/components/site'

export const metadata: Metadata = {
  title: 'Donate',
  description: 'Support Orchard OCD with a donation to help develop better treatments for OCD.',
}

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ canceled?: string }>
}) {
  const { canceled } = await searchParams
  return (
    <>
      <PageBanner title="Help fund better treatments for OCD">
        <p>
          Your donation supports Orchard OCD’s work to develop new and better treatments for
          obsessive-compulsive disorder.
        </p>
      </PageBanner>
      <PageSection heading="Make a donation">
        <DonationForm canceled={canceled === '1'} />
      </PageSection>
    </>
  )
}
