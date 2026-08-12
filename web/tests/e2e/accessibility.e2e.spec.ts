import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

const WCAG_22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const ROUTES = [
  ['home', '/'],
  ['content page', '/about-ocd'],
  ['people page', '/about-orchard'],
  ['blog index', '/blog'],
  ['blog post', '/blog/yanns-ocd-story'],
  ['studies index', '/participate-research'],
  ['study', '/participate-research/ocd-exercise-study'],
  ['webinars', '/webinars'],
  ['policy page', '/terms-of-use'],
] as const

test('every video embed exposes an accessible name', async ({ page }) => {
  await page.goto('/webinars')
  const frames = page.locator('main iframe')
  for (let index = 0; index < (await frames.count()); index += 1) {
    await expect(frames.nth(index)).toHaveAttribute('title', /\S/)
  }
})

for (const [name, path] of ROUTES) {
  test(`${name} has no WCAG 2.2 AA violations`, async ({ page }) => {
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags([...WCAG_22_AA])
      // YouTube renders its own markup inside the embed; we cannot change it.
      .exclude('iframe')
      .analyze()
    expect(
      results.violations.map((violation) => ({
        id: violation.id,
        nodes: violation.nodes.map((node) => node.target).slice(0, 3),
      })),
    ).toEqual([])
  })

  test(`${name} has no WCAG 2.2 AA violations on a small screen`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(path)
    const results = await new AxeBuilder({ page })
      .withTags([...WCAG_22_AA])
      .exclude('iframe')
      .analyze()
    expect(results.violations.map((violation) => violation.id)).toEqual([])
  })
}
