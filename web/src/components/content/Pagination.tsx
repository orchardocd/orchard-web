import Link from 'next/link'

import { cn } from '@/lib/cn'

const STEP =
  'flex h-11 min-w-11 items-center justify-center rounded border-2 px-3 text-base font-bold no-underline'

/** The pages of a listing, so a reader is never handed the whole archive at once. */
export function Pagination({
  current,
  total,
  basePath,
}: {
  current: number
  total: number
  basePath: string
}) {
  if (total <= 1) return null

  const pages = Array.from({ length: total }, (_, index) => index + 1)
  const href = (page: number) => (page === 1 ? basePath : `${basePath}?page=${page}`)

  return (
    <nav
      aria-label="Pages"
      className="mt-10 flex flex-wrap items-center justify-center gap-1 border-t border-line pt-10 sm:gap-2"
    >
      {pages.map((page) =>
        page === current ? (
          <span
            key={page}
            aria-current="page"
            className={cn(STEP, 'border-brand bg-brand-strong text-white')}
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            className={cn(STEP, 'border-line text-brand-link hover:border-brand hover:bg-mist')}
          >
            {page}
          </Link>
        ),
      )}
    </nav>
  )
}
