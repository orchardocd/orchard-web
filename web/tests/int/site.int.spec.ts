import { describe, expect, it } from 'vitest'

import { siteImage } from '@/components/site/media'
import { CONTACT, FOOTER_COLUMNS, MAIN_NAV, SOCIAL } from '@/lib/site'

describe('site kit', () => {
  it('finds an upload by its filename', async () => {
    const media = await siteImage('2017-04-The-D-in-OCD.png')
    expect(media.url).toBeTruthy()
    expect(media.alt.trim()).not.toBe('')
    expect(media.width).toBe(1200)
  })

  it('refuses to draw a picture that is not there', async () => {
    await expect(siteImage('not-a-real-upload.png')).rejects.toThrow(/not-a-real-upload/)
  })

  it('points every navigation link somewhere', () => {
    const hrefs = [
      ...MAIN_NAV.flatMap((item) => [item, ...item.children]),
      ...FOOTER_COLUMNS.flatMap((column) => column.links),
    ].map((link) => link.href)
    expect(hrefs.length).toBeGreaterThan(20)
    for (const href of hrefs) {
      expect(href).toMatch(/^(\/|https:\/\/)/)
    }
    for (const profile of SOCIAL) {
      expect(profile.url).toMatch(/^https:\/\//)
    }
    expect(CONTACT.email).toContain('@')
  })
})
