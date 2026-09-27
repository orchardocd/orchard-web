import type { Metadata } from 'next'

import { DonationStatus } from '@/components/content/DonationStatus'
import { PageBanner, PageSection } from '@/components/site'

export const metadata: Metadata = {
  title: 'Your donation',
  robots: { index: false, follow: false },
}

export default async function DonationThanksPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams
  return (
    <>
      <PageBanner title="Your donation" />
      <PageSection label="Donation status">
        <DonationStatus sessionId={session_id ?? ''} />
      </PageSection>
    </>
  )
}
