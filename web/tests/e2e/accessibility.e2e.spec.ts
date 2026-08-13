import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const WCAG_22_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

const WIDTHS = [
  ['desktop', { width: 1440, height: 900 }],
  ['a small screen', { width: 390, height: 844 }],
] as const

const ROUTES = [
  ['home', '/'],
  ['about ocd', '/about-ocd'],
  ['about', '/about'],
  ['about orchard', '/about-orchard'],
  ['become a trustee', '/become-a-trustee'],
  ['beyond first line therapy', '/beyond-first-line-therapy'],
  ['blog index', '/blog'],
  ['blog post', '/blog/yanns-ocd-story'],
  ['brain stimulation', '/brain-stimulation'],
  ['complementary and alternative therapies', '/complementary-and-alternative-therapies'],
  ['conference', '/conference'],
  ['conference 2', '/conference-2'],
  ['cookies and privacy', '/cookies-privacy'],
  ['first line treatment', '/first-line-treatment'],
  ['fundraising events', '/fundraising-events'],
  ['get involved', '/get-involved'],
  ['join our mailing list', '/join-our-mailing-list'],
  ['not found', '/this-route-does-not-exist'],
  ['orchard ocd college', '/orchard-ocd-college'],
  ['our coi policy', '/our-coi-policy'],
  ['our funding policy', '/our-funding-policy'],
  ['our policy', '/our-policy'],
  ['our research strategy', '/our-research-strategy'],
  ['psilocybin crowdfunding campaign', '/psilocybin-crowdfunding-campaign'],
  ['research', '/research'],
  ['studies index', '/participate-research'],
  ['study', '/participate-research/ocd-exercise-study'],
  ['terms of use', '/terms-of-use'],
  ['the work we do', '/the-work-we-do'],
  ['volunteer', '/volunteer'],
  ['webinars', '/webinars'],
  ['work with us', '/work-with-us'],
] as const

async function violationsOn(page: Page, path: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport)
  await page.goto(path)
  const results = await new AxeBuilder({ page })
    .withTags([...WCAG_22_AA])
    // YouTube renders its own markup inside the embed; we cannot change it.
    .exclude('iframe')
    .analyze()
  return results.violations.map((violation) => ({
    id: violation.id,
    nodes: violation.nodes.map((node) => node.target).slice(0, 3),
  }))
}

test('every video player names the webinar it plays', async ({ page }) => {
  await page.goto('/webinars')
  const players = page.getByRole('button', { name: /Watch Now/i })
  const count = await players.count()
  expect(count).toBeGreaterThan(10)
  for (let index = 0; index < count; index += 1) {
    // The visible label is generic, so the accessible name carries the webinar title.
    await expect(players.nth(index)).toHaveAccessibleName(/Watch Now: .{8,}/)
  }
})

for (const [name, path] of ROUTES) {
  for (const [label, viewport] of WIDTHS) {
    test(`${name} has no WCAG 2.2 AA violations on ${label}`, async ({ page }) => {
      expect(await violationsOn(page, path, viewport)).toEqual([])
    })
  }
}
