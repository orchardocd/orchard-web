import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { Document } from '@/components/layout/Document'
import './styles.css'

export const metadata: Metadata = {
  title: {
    default: 'Orchard OCD — Advancing global OCD research',
    template: '%s — Orchard OCD',
  },
  description:
    'Orchard OCD is a UK charity that finds, filters and funds research to develop better treatments for Obsessive Compulsive Disorder (OCD).',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return <Document>{children}</Document>
}
