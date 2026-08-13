import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  RichText as LexicalRichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'

import { isVideoUrl, VideoEmbed, VideoPlayer } from '@/components/blocks/VideoEmbed'
import { Plate } from '@/components/site/Plate'
import { PROSE_CLASSES } from '@/components/site/Prose'
import { cn } from '@/lib/cn'

const MEDIA_CLASSES = 'my-8'
const MEDIA_SIZES = '(min-width: 768px) 37rem, calc(100vw - 6rem)'

type LinkedText = {
  type: string
  fields?: { url?: string | null }
  children?: { text?: string }[]
}

function loneVideoUrl(children: { type: string }[]): string | null {
  if (children.length !== 1) return null
  const link: LinkedText = children[0]
  const [label, ...rest] = link.children ?? []
  const url = link.fields?.url
  if (link.type !== 'link' || !url || rest.length > 0 || label?.text !== url) return null
  return isVideoUrl(url) ? url : null
}

export function RichText({
  data,
  className,
  videoTitle,
}: {
  data: SerializedEditorState
  className?: string
  videoTitle?: string
}) {
  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    upload: ({ node }) => {
      const upload = node.value
      if (typeof upload !== 'object' || upload === null) return null
      if ('alt' in upload)
        return <Plate media={upload} size="band" sizes={MEDIA_SIZES} className={MEDIA_CLASSES} />
      const video = 'mimeType' in upload && upload.mimeType?.startsWith('video')
      return video ? <VideoPlayer block={{ file: upload }} className={MEDIA_CLASSES} /> : null
    },
    paragraph: (args) => {
      const url = loneVideoUrl(args.node.children)
      if (url) return <VideoEmbed url={url} title={videoTitle} className={MEDIA_CLASSES} />
      const paragraph = defaultConverters.paragraph
      return typeof paragraph === 'function' ? paragraph(args) : paragraph
    },
  })

  return (
    <LexicalRichText
      data={data}
      converters={converters}
      className={cn(PROSE_CLASSES, '[&>*:first-child]:mt-0', className)}
    />
  )
}
