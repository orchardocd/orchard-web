import { cache } from 'react'

import { getClient } from '@/lib/payload'
import type { Media } from '@/payload-types'

const mediaByFilename = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'media', depth: 0, pagination: false })
  const index = new Map<string, Media>()
  for (const doc of result.docs) {
    if (doc.filename) index.set(doc.filename, doc)
  }
  return index
})

export async function siteImage(file: string): Promise<Media> {
  const media = (await mediaByFilename()).get(file)
  if (!media) throw new Error(`No upload named "${file}" in the media collection`)
  return media
}

export async function siteImageWithAlt(file: string, alt?: string): Promise<Media> {
  const media = await siteImage(file)
  return alt === undefined ? media : { ...media, alt }
}
