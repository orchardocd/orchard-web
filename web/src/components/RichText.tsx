import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/cn'

const PROSE = [
  'max-w-measure text-base leading-relaxed text-body md:text-lg',
  '[&_p]:my-6',
  '[&_h2]:mt-14 [&_h2]:mb-4 [&_h2]:text-2xl md:[&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-brand-deep [&_h2]:leading-tight',
  '[&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand-link',
  '[&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-base md:[&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-ink',
  '[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li]:my-2',
  '[&_a]:font-semibold [&_a]:text-brand-link [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-link-hover',
  '[&_blockquote]:my-7 [&_blockquote]:border-l-4 [&_blockquote]:border-lime [&_blockquote]:pl-5 [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-ink',
  '[&_strong]:font-bold [&_strong]:text-ink [&_a_strong]:text-inherit',
  // A file link is a download, and it reads as one everywhere it appears.
  "[&_a[href$='.pdf']]:inline-flex [&_a[href$='.pdf']]:items-center [&_a[href$='.pdf']]:gap-2",
  "[&_a[href$='.pdf']]:rounded-full [&_a[href$='.pdf']]:border-2 [&_a[href$='.pdf']]:border-brand",
  "[&_a[href$='.pdf']]:px-5 [&_a[href$='.pdf']]:py-2 [&_a[href$='.pdf']]:no-underline",
  "hover:[&_a[href$='.pdf']]:bg-mist",
  '[&>*:last-child]:mb-0',
].join(' ')

export function RichText({
  data,
  className,
}: {
  data: SerializedEditorState
  className?: string
}) {
  return <LexicalRichText data={data} className={cn(PROSE, className)} />
}
