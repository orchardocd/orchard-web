import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'donate' | 'ghost'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-strong text-white hover:bg-brand-hover',
  secondary: 'border-2 border-brand text-brand-link hover:bg-mist',
  donate: 'bg-lime text-ink-on-lime hover:bg-lime-hover',
  ghost: 'border-2 border-white/85 text-white hover:bg-white/12',
}

const BASE =
  'inline-flex items-center justify-center gap-2 rounded px-7 py-3.5 text-base font-bold no-underline transition-colors'

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string) {
  return cn(BASE, VARIANTS[variant], className)
}

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
}: {
  href: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
}) {
  const external = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
  const classes = buttonClasses(variant, className)

  if (external) {
    return (
      <a href={href} className={classes} rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  )
}
