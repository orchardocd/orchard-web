import type { Metadata } from 'next'

import { PageBanner } from '@/components/site'

export const metadata: Metadata = {
  title: 'Orchard OCD college',
}

export default function OrchardOcdCollegePage() {
  return (
    <PageBanner
      title="Orchard OCD college"
      image="2025-06-1-1.jpg"
      imageAlt="The Orchard OCD College emblem: a brain drawn as a leafy tree"
    />
  )
}
