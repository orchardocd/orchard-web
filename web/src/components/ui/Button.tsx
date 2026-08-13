import Link from 'next/link'
import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

type ButtonVariant = 'primary' | 'secondary' | 'donate' | 'ghost' | 'light'

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand-strong text-white hover:bg-brand-hover',
  secondary: 'border-2 border-brand text-brand-link hover:bg-mist',
  donate: 'bg-lime text-ink-on-lime hover:bg-lime-hover',
  ghost: 'border-2 border-white/85 text-white hover:bg-white/12',
  // For dark surfaces, where lime is reserved for the donate action.
  light: 'bg-white text-brand-link hover:bg-mist',
}

// Every variant carries the border so a filled button and an outlined one stand the same height.
const BASE =
  'inline-flex items-center justify-center gap-2 rounded border-2 border-transparent px-7 py-3.5 text-base font-bold no-underline uppercase transition-colors'

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string) {
  return cn(BASE, VARIANTS[variant], className)
}

export function ButtonLink({
  href,
  variant = 'primary',
  className,
  children,
  detail,
}: {
  href: string
  variant?: ButtonVariant
  className?: string
  children: ReactNode
  detail?: string
}) {
  const external = /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
  const classes = buttonClasses(variant, className)
  const body = (
    <>
      {children}
      {detail ? <span className="sr-only"> {detail}</span> : null}
    </>
  )

  if (external) {
    return (
      <a href={href} className={classes} rel="noreferrer">
        {body}
      </a>
    )
  }

  return (
    <Link href={href} className={classes}>
      {body}
    </Link>
  )
}
