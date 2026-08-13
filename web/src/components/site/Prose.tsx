import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

export const PROSE_CLASSES = [
  'max-w-measure text-base leading-relaxed break-words text-body md:text-lg',
  '[&_p]:my-6',
  '[&_p:has(>strong:first-child)]:my-2',
  '[&_p:has(>strong:first-child):has(+p>strong:first-child)]:my-0 [&_p:has(>strong:first-child):has(+p>strong:first-child)]:bg-mist [&_p:has(>strong:first-child):has(+p>strong:first-child)]:px-5 [&_p:has(>strong:first-child):has(+p>strong:first-child)]:py-1.5',
  '[&_p:has(>strong:first-child)+p:has(>strong:first-child)]:my-0 [&_p:has(>strong:first-child)+p:has(>strong:first-child)]:bg-mist [&_p:has(>strong:first-child)+p:has(>strong:first-child)]:px-5 [&_p:has(>strong:first-child)+p:has(>strong:first-child)]:py-1.5',
  '[&_p:has(>strong:first-child):has(+p>strong:first-child):not(p:has(>strong:first-child)+p)]:pt-4 [&_p:has(>strong:first-child):has(+p>strong:first-child):not(p:has(>strong:first-child)+p)]:rounded-t-lg',
  '[&_p:has(>strong:first-child)+p:has(>strong:first-child):not(:has(+p>strong:first-child))]:pb-4 [&_p:has(>strong:first-child)+p:has(>strong:first-child):not(:has(+p>strong:first-child))]:rounded-b-lg',
  '[&_p:has(+ul)]:mb-2 [&_p:has(+ul)]:text-ink [&_p:has(+ol)]:mb-2 [&_p:has(+ol)]:text-ink',
  '[&_p>em:only-child]:not-italic [&_p>em:only-child]:text-ink',
  '[&_h2]:mt-10 md:[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-brand-deep [&_h2]:leading-[1.1] [&_h2]:text-balance',
  '[&_h3]:mt-8 md:[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-ink [&_h3]:text-balance',
  '[&_h4]:mt-6 md:[&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-base md:[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-ink',
  '[&_:is(h2,h3,h4)+:is(h2,h3,h4)]:mt-4',
  '[&_ul]:mt-2 [&_ul]:mb-8 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mt-2 [&_ol]:mb-8 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li+li]:mt-4',
  '[&_a]:font-semibold [&_a]:text-brand-link [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-link-hover',
  '[&_blockquote]:my-7 [&_blockquote]:border-l-4 [&_blockquote]:border-lime [&_blockquote]:pl-5 [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-ink',
  '[&_strong]:font-bold [&_strong]:text-ink [&_a_strong]:text-inherit',
  // A file link is a download, and it reads as one everywhere it appears.
  "[&_a[href$='.pdf']]:inline-flex [&_a[href$='.pdf']]:items-center [&_a[href$='.pdf']]:gap-2",
  "[&_a[href$='.pdf']]:before:content-['↓']",
  "[&_a[href$='.pdf']]:rounded [&_a[href$='.pdf']]:border-2 [&_a[href$='.pdf']]:border-brand",
  "[&_a[href$='.pdf']]:px-7 [&_a[href$='.pdf']]:py-3.5 [&_a[href$='.pdf']]:text-base",
  "[&_a[href$='.pdf']]:font-bold [&_a[href$='.pdf']]:no-underline",
  "hover:[&_a[href$='.pdf']]:bg-mist",
  '[&>*:last-child]:mb-0',
].join(' ')

export function Prose({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn(PROSE_CLASSES, '[&>*:first-child]:mt-0', className)}>{children}</div>
}
