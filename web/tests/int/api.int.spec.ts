import { getPayload, type Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

let payload: Payload

describe('content', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('keeps content only, never layout', () => {
    expect(payload.config.globals).toEqual([])
    expect(payload.config.collections.map((collection) => collection.slug).sort()).toEqual([
      'categories',
      'documents',
      'media',
      'payload-kv',
      'payload-locked-documents',
      'payload-migrations',
      'payload-preferences',
      'people',
      'posts',
      'speakers',
      'studies',
      'subscribers',
      'users',
      'videos',
      'webinars',
    ])
    for (const collection of payload.config.collections) {
      expect(collection.flattenedFields.map((field) => field.type)).not.toContain('blocks')
    }
  })

  it('has every post, study and webinar', async () => {
    const [posts, studies, webinars] = await Promise.all([
      payload.find({ collection: 'posts', limit: 0 }),
      payload.find({ collection: 'studies', limit: 0 }),
      payload.find({ collection: 'webinars', limit: 0 }),
    ])
    expect(posts.totalDocs).toBe(84)
    expect(studies.totalDocs).toBe(32)
    expect(webinars.totalDocs).toBe(15)
  })

  it('gives every post and study a body, and never repeats the picture above it', async () => {
    const [posts, studies] = await Promise.all([
      payload.find({ collection: 'posts', limit: 200, depth: 0 }),
      payload.find({ collection: 'studies', limit: 200, depth: 0 }),
    ])
    const documents = [...posts.docs, ...studies.docs]
    expect(
      documents.filter(
        (document) => !document.featuredImage && !document.body?.root.children.length,
      ),
    ).toEqual([])

    let pictures = 0
    for (const document of documents) {
      const featured =
        typeof document.featuredImage === 'object'
          ? document.featuredImage?.id
          : document.featuredImage
      for (const node of document.body?.root.children ?? []) {
        if (node.type !== 'upload') continue
        pictures += 1
        expect(node.value).not.toBe(featured)
      }
    }
    expect(pictures).toBe(55)
  })

  it('groups every person into a listed group', async () => {
    const people = await payload.find({ collection: 'people', limit: 200 })
    expect(people.totalDocs).toBe(85)
    const groups = new Set(people.docs.map((person) => person.group))
    expect(groups).toEqual(
      new Set(['team', 'scientific-advisory-board', 'partners', 'ambassadors', 'college']),
    )
  })

  it('gives every uploaded image alt text', async () => {
    const media = await payload.find({ collection: 'media', limit: 500 })
    const missing = media.docs.filter((item) => !item.alt?.trim())
    expect(missing.map((item) => item.filename)).toEqual([])
  })

  it('never stores an unusable link', async () => {
    const [posts, studies] = await Promise.all([
      payload.find({ collection: 'posts', limit: 200, depth: 0 }),
      payload.find({ collection: 'studies', limit: 200, depth: 0 }),
    ])
    const hrefs = JSON.stringify([...posts.docs, ...studies.docs]).match(/"url":"([^"]*)"/g) ?? []
    expect(hrefs.length).toBeGreaterThan(50)
    for (const href of hrefs) {
      expect(href).not.toMatch(/"url":"\s*"/)
    }
  })
})
