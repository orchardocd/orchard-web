import type { Metadata } from 'next'

import { PageBanner } from '@/components/site'

export const metadata: Metadata = {
  title: 'Our COI Policy',
}

export default function CoiPolicyPage() {
  return <PageBanner title="Our Conflict of Interest Policy" />
}
