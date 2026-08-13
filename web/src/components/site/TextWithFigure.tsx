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
        'w-full flow:grid flow:grid-cols-[40rem_1fr] flow:items-start flow:gap-x-12',
        className,
      )}
    >
      <div className="w-full max-w-measure">{children}</div>
      <div className="mt-6 flex w-full flex-col gap-6 flow:mt-0">{figure}</div>
    </div>
  )
}
