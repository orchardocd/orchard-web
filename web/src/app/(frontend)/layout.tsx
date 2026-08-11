import React from 'react'
import type { Metadata } from 'next'
import { Exo } from 'next/font/google'
import './styles.css'

const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

export const metadata: Metadata = {
  title: {
    default: 'Orchard OCD — Advancing Global OCD Research',
    template: '%s — Orchard OCD',
  },
  description:
    'Orchard OCD is a UK charity funding research to develop better treatments for Obsessive Compulsive Disorder (OCD).',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en-GB" className={exo.variable}>
      <body>{children}</body>
    </html>
  )
}
