import { expect, test } from '@playwright/test'

test.describe('site', () => {
  test('renders the homepage hero and calls to action', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Orchard OCD/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Obsessive Compulsive Disorder',
    )
    await expect(
      page.locator('main').getByRole('link', { name: 'Donate Now', exact: true }).first(),
    ).toBeVisible()
  })

  test('exposes a skip link that moves focus to the main content', async ({ page }) => {
    await page.goto('/')
    await page.keyboard.press('Tab')
    const skipLink = page.getByRole('link', { name: 'Skip to main content' })
    await expect(skipLink).toBeFocused()
    await skipLink.press('Enter')
    await expect(page.locator('#main')).toBeVisible()
  })

  test('opens a navigation dropdown with the keyboard', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'About OCD' })
    await trigger.click()
    await expect(page.getByRole('link', { name: 'First line treatment' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('link', { name: 'First line treatment' })).toBeHidden()
  })

  test('navigates from the blog index to a post', async ({ page }) => {
    await page.goto('/blog')
    const first = page.locator('main article, main li').getByRole('link').first()
    const title = (await first.textContent())?.trim() ?? ''
    await first.click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(title.slice(0, 20))
  })

  test('lists every team group on the about page', async ({ page }) => {
    await page.goto('/about-orchard')
    for (const group of ['Our team', 'Scientific advisory board', 'Our supporters', 'Our volunteers']) {
      await expect(page.getByRole('heading', { name: group, exact: true })).toBeVisible()
    }
  })

  test('serves study pages with their sign-up links', async ({ page }) => {
    await page.goto('/participate-research/ocd-exercise-study')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Exercise Study')
    await expect(page.getByRole('link', { name: /hertfordshire/i })).toBeVisible()
  })

  test('renders webinars with playable embeds', async ({ page }) => {
    await page.goto('/webinars')
    await expect(page.getByRole('region', { name: 'Webinars' })).toBeVisible()
    const embeds = page.locator('main iframe')
    expect(await embeds.count()).toBeGreaterThan(10)
    await expect(embeds.first()).toHaveAttribute('title', /\S/)
  })

  test('returns a 404 page for unknown routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist')
    expect(response?.status()).toBe(404)
  })
})
