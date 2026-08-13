import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

const WIDE_COLUMNS = 4

export function Table({
  caption,
  head,
  rows,
  className,
}: {
  caption: string
  head?: ReactNode[]
  rows: ReactNode[][]
  className?: string
}) {
  if (rows.length === 0) return null
  const wide = [head ?? [], ...rows].some((row) => row.length >= WIDE_COLUMNS)
  const cell = cn('px-4 py-2', wide ? undefined : 'first:pl-0')

  return (
    <div
      className={cn(
        'my-6 w-full overflow-x-auto',
        wide ? 'rounded-lg border border-line' : undefined,
        className,
      )}
      role={wide ? 'region' : undefined}
      aria-label={wide ? caption : undefined}
      tabIndex={wide ? 0 : undefined}
    >
      <table
        className={cn(
          'w-full border-collapse text-left',
          wide ? 'text-sm md:text-base' : 'text-base',
        )}
      >
        <caption className="sr-only">{caption}</caption>
        {head ? (
          <thead>
            <tr>
              {head.map((value, index) => (
                <th
                  key={index}
                  scope="col"
                  className={cn(cell, 'border-b-2 border-brand font-bold text-ink')}
                >
                  {value}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-line">
              {row.map((value, index) => (
                <td key={index} className={cn(cell, 'text-body')}>
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
