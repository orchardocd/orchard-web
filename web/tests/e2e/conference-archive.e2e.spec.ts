import { expect, test } from '@playwright/test'

test.describe('conference archive', () => {
  test('opens the 2026 programme and a talk with its resources', async ({ page }) => {
    await page.goto('/past-conferences')
    await page.getByRole('link', { name: 'Explore the 2026 conference' }).click()
    await expect(page).toHaveURL('/past-conferences/2026')
    await expect(
      page.getByRole('region', { name: 'Session recordings' }).locator('video'),
    ).toHaveCount(8)

    const talk = page
      .locator('details')
      .filter({ has: page.locator('summary').filter({ hasText: 'OCD Genetic Predisposition' }) })
    await talk.locator('summary').click()
    await expect(talk.getByText('Nora Strom', { exact: true })).toBeVisible()
    await expect(talk.getByRole('link', { name: /View infographic/ })).toHaveAttribute(
      'href',
      /^https:\/\//,
    )
    await talk.getByRole('link', { name: /Listen to podcast/ }).click()
    await expect(page).toHaveURL(/#podcast-/)
    await expect(page.getByLabel('OCD Genetic Predisposition', { exact: true })).toBeVisible()
  })

  test('keeps talks without resources usable and loads media only on demand', async ({ page }) => {
    const mediaRequests: string[] = []
    page.on('request', (request) => {
      if (request.resourceType() === 'media') mediaRequests.push(request.url())
    })
    await page.goto('/past-conferences/2026')
    const talk = page
      .locator('details')
      .filter({ has: page.locator('summary').filter({ hasText: 'Opening Remarks' }) })
    await talk.locator('summary').click()
    await expect(talk.getByText('Max Ahmed', { exact: true })).toBeVisible()
    await expect(talk.getByRole('link')).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Day 2 · 5 June 2026' })).toBeVisible()
    expect(mediaRequests).toHaveLength(0)
  })

  test('returns 404 for an unavailable conference year', async ({ page }) => {
    const response = await page.goto('/past-conferences/2024')
    expect(response?.status()).toBe(404)
  })
})
