import type { Metadata } from 'next'

import { Document } from '@/components/layout/Document'
import { NotFound } from '@/components/layout/NotFound'
import './(frontend)/styles.css'

export const metadata: Metadata = {
  title: 'Page not found — Orchard OCD',
  description: 'The page you asked for is not here.',
}

export default function GlobalNotFound() {
  return (
    <Document>
      <NotFound />
    </Document>
  )
}
