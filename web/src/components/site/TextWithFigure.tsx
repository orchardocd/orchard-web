import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export function TextWithFigure({
  figure,
  className,
  children,
}: {
  figure: ReactNode
  className?: string
  children: ReactNode
}) {
  return (
    <div
      className={cn(
        'flex w-full flex-col flow:grid flow:grid-cols-[40rem_1fr] flow:gap-x-12',
        className,
      )}
    >
      <div className="w-full max-w-measure">{children}</div>
      <div className="-order-1 mb-6 w-full flow:order-none flow:mb-0">
        <div className="flex w-full flex-col gap-6 flow:sticky flow:top-24">{figure}</div>
      </div>
    </div>
  )
}
