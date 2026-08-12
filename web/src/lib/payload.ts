import { getPayload } from 'payload'
import { cache } from 'react'

import config from '@/payload.config'

export const getClient = cache(async () => getPayload({ config }))

export const getNavigation = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'navigation', depth: 1 })
})

export const getSiteSettings = cache(async () => {
  const payload = await getClient()
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})

export const getPageBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
})

export const getPosts = cache(async (limit = 12, page = 1) => {
  const payload = await getClient()
  return payload.find({
    collection: 'posts',
    depth: 1,
    limit,
    page,
    sort: '-publishedAt',
  })
})

export const getPostBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
})

export const getStudies = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'studies',
    depth: 1,
    limit: 100,
    sort: '-publishedAt',
  })
  return result.docs
})

export const getStudyBySlug = cache(async (slug: string) => {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'studies',
    where: { slug: { equals: slug } },
    depth: 2,
    limit: 1,
  })
  return result.docs[0] ?? null
})

export const getWebinars = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'webinars', limit: 100, sort: 'order' })
  return result.docs
})

export const getPeople = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'people', depth: 2, limit: 200, sort: 'order' })
  return result.docs
})

export const getSpeakers = cache(async () => {
  const payload = await getClient()
  const result = await payload.find({ collection: 'speakers', depth: 1, limit: 200, sort: 'order' })
  return result.docs
})
