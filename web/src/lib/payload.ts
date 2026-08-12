import type { CollectionSlug, DataFromCollectionSlug, GlobalSlug, Where } from 'payload'
import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

export const getClient = cache(async () => getPayload({ config }))

const findGlobal = cache(async <T extends GlobalSlug>(slug: T) => {
  const payload = await getClient()
  return payload.findGlobal({ slug, depth: 1 })
})

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

export const getNavigation = () => findGlobal('navigation')
export const getSiteSettings = () => findGlobal('site-settings')

export const getPageBySlug = (slug: string) => findBySlug('pages', slug)
export const getPostBySlug = (slug: string) => findBySlug('posts', slug)
export const getStudyBySlug = (slug: string) => findBySlug('studies', slug)

export const getPosts = (limit = 12, page = 1) =>
  findList('posts', { limit, page, sort: '-publishedAt' })

export const getStudies = async () =>
  (await findList('studies', { sort: '-publishedAt' })).docs

export const getWebinars = async () => (await findList('webinars')).docs
export const getPeople = async () => (await findList('people', { limit: 200, depth: 2 })).docs
export const getSpeakers = async () => (await findList('speakers', { limit: 200 })).docs
