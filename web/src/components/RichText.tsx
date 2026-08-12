import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

import { cn } from '@/lib/cn'

const PROSE = [
  'max-w-measure text-lg leading-relaxed text-body',
  '[&_p]:my-5',
  '[&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-ink [&_h2]:leading-tight [&>h2:first-child]:mt-0',
  '[&_h3]:mt-9 [&_h3]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-brand-link',
  '[&_h4]:mt-7 [&_h4]:mb-2 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:text-ink',
  '[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-6',
  '[&_li]:my-2',
  '[&_a]:font-semibold [&_a]:text-brand-link [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-link-hover',
  '[&_blockquote]:my-7 [&_blockquote]:border-l-4 [&_blockquote]:border-lime [&_blockquote]:pl-5 [&_blockquote]:text-xl [&_blockquote]:italic [&_blockquote]:text-ink',
  '[&_strong]:font-bold [&_strong]:text-ink',
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
