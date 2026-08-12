import { getPayload, type Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

let payload: Payload

describe('content', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('has every page from the old site', async () => {
    const pages = await payload.find({ collection: 'pages', limit: 200 })
    expect(pages.totalDocs).toBeGreaterThanOrEqual(28)
    const slugs = pages.docs.map((page) => page.slug)
    for (const slug of ['about-ocd', 'about-orchard', 'get-involved', 'the-work-we-do']) {
      expect(slugs).toContain(slug)
    }
    // The landing page is the Home page global, so it is not an editable blocks page.
    expect(slugs).not.toContain('home')
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

  it('exposes navigation, site settings and the home page', async () => {
    const [navigation, settings, home] = await Promise.all([
      payload.findGlobal({ slug: 'navigation' }),
      payload.findGlobal({ slug: 'site-settings' }),
      payload.findGlobal({ slug: 'home-page' }),
    ])
    expect(home.hero.title).toMatch(/Obsessive Compulsive Disorder/)
    expect(home.about.pillars?.length).toBe(2)
    expect(navigation.main?.length).toBeGreaterThan(0)
    expect(settings.donateUrl).toMatch(/^https:\/\//)
    expect(settings.contact.charityNumber).toBe('1174480')
  })

  it('never stores an unusable link', async () => {
    const pages = await payload.find({ collection: 'pages', limit: 200, depth: 0 })
    const hrefs = JSON.stringify(pages.docs).match(/"url":"([^"]+)"/g) ?? []
    for (const href of hrefs) {
      expect(href).not.toMatch(/"url":"\s*"/)
    }
  })
})
