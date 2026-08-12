import type { Metadata } from 'next'
import { Exo } from 'next/font/google'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { getNavigation, getSiteSettings } from '@/lib/payload'
import './styles.css'

const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Orchard OCD — Advancing global OCD research',
    template: '%s — Orchard OCD',
  },
  description:
    'Orchard OCD is a UK charity that finds, filters and funds research to develop better treatments for Obsessive Compulsive Disorder (OCD).',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [navigation, settings] = await Promise.all([getNavigation(), getSiteSettings()])

  return (
    <html lang="en-GB" className={exo.variable}>
      <body className="flex min-h-screen flex-col">
        <Header navigation={navigation} settings={settings} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer navigation={navigation} settings={settings} />
      </body>
    </html>
  )
}
