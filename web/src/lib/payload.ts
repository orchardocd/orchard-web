import type { CollectionSlug, DataFromCollectionSlug, Where } from 'payload'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

export const getClient = cache(async () => getPayload({ config }))

const findList = cache(
  async <T extends CollectionSlug>(
    collection: T,
    { limit = 100, page = 1, sort = 'order', depth = 1 } = {},
  ) => {
    const payload = await getClient()
    return payload.find({ collection, depth, limit, page, sort })
  },
)

const findBySlug = cache(async <T extends CollectionSlug>(collection: T, slug: string) => {
  const payload = await getClient()
  const where: Where = { slug: { equals: slug } }
  const result = await payload.find({ collection, where, depth: 2, limit: 1 })
  return (result.docs[0] ?? null) as DataFromCollectionSlug<T> | null
})

export const getPostBySlug = (slug: string) => findBySlug('posts', slug)
export const getStudyBySlug = (slug: string) => findBySlug('studies', slug)

export const getPosts = (limit = 12, page = 1) =>
  findList('posts', { limit, page, sort: '-publishedAt' })

export const getStudies = (limit = 12, page = 1) =>
  findList('studies', { limit, page, sort: '-publishedAt' })

export const getWebinars = async () => (await findList('webinars')).docs
export const getPeople = async () => (await findList('people', { limit: 200, depth: 2 })).docs
export const getSpeakers = async () => (await findList('speakers', { limit: 200 })).docs
