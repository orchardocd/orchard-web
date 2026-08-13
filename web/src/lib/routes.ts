import type { Metadata } from 'next'
import type { CollectionSlug } from 'payload'

import { getClient } from '@/lib/payload'

export type SlugParams = { params: Promise<{ slug: string }> }
export type PagedParams = { searchParams: Promise<{ page?: string }> }

export async function askedPage(searchParams: PagedParams['searchParams']): Promise<number> {
  const { page } = await searchParams
  return Math.max(1, Number(page) || 1)
}

export async function slugParams(collection: CollectionSlug) {
  const payload = await getClient()
  const result = await payload.find({ collection, limit: 500, select: { slug: true } })
  const slugs: string[] = []
  for (const doc of result.docs) {
    const slug = (doc as { slug?: unknown }).slug
    if (typeof slug === 'string') slugs.push(slug)
  }
  return slugs.map((slug) => ({ slug }))
}

type MetadataSource = {
  title?: string | null
  excerpt?: string | null
  meta?: { description?: string | null }
} | null

/** Builds the `generateMetadata` export for a slug-addressed document route. */
export function slugMetadata(load: (slug: string) => Promise<MetadataSource>) {
  return async ({ params }: SlugParams): Promise<Metadata> => {
    const { slug } = await params
    return documentMetadata(await load(slug))
  }
}

function documentMetadata(document: MetadataSource): Metadata {
  if (!document) return {}
  return {
    title: document.title ?? undefined,
    description: document.meta?.description || document.excerpt || undefined,
  }
}
