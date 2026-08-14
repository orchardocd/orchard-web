import localFont from 'next/font/local'
import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

const exo = localFont({
  src: [
    { path: './fonts/exo-latin.woff2', weight: '100 900', style: 'normal' },
    { path: './fonts/exo-latin-italic.woff2', weight: '100 900', style: 'italic' },
  ],
  variable: '--font-exo',
  display: 'swap',
})

export function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en-GB" className={exo.variable}>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main id="main" className="flex flex-1 flex-col [&>*:only-child]:grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
