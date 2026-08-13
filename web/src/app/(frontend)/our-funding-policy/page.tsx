import type { Metadata } from 'next'

import { PageBanner } from '@/components/site'

export const metadata: Metadata = {
  title: 'Our Funding Policy',
}

export default function FundingPolicyPage() {
  return <PageBanner title="Our Funding Policy" />
}
