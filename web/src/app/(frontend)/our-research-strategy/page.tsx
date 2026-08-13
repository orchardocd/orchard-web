import type { Metadata } from 'next'

import { PageBanner } from '@/components/site'

export const metadata: Metadata = {
  title: 'Our Research Strategy',
}

export default function ResearchStrategyPage() {
  return <PageBanner title="Our Research Strategy" />
}
