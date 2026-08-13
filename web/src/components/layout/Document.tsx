import { Exo } from 'next/font/google'
import type { ReactNode } from 'react'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'

const exo = Exo({
  subsets: ['latin'],
  variable: '--font-exo',
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
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
