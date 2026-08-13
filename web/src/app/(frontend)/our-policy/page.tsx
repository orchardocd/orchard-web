import type { Metadata } from 'next'

import { PageBanner } from '@/components/site'

export const metadata: Metadata = {
  title: 'Our Policy',
}

export default function OurPolicyPage() {
  return <PageBanner title="Our Policy" />
}
