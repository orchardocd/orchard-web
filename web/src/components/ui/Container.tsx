import type { ElementType, ReactNode } from 'react'

import { cn } from '@/lib/cn'

export function Container({
  as: Component = 'div',
  className,
  children,
}: {
  as?: ElementType
  className?: string
  children: ReactNode
}) {
  return (
    <Component className={cn('mx-auto w-full max-w-[77.5rem] px-6 md:px-8', className)}>
      {children}
    </Component>
  )
}

export function Section({
  className,
  labelledBy,
  label,
  children,
}: {
  className?: string
  labelledBy?: string
  label?: string
  children: ReactNode
}) {
  return (
    <section
      aria-labelledby={labelledBy}
      aria-label={label}
      className={cn('py-16 md:py-20', className)}
    >
      {children}
    </section>
  )
}
