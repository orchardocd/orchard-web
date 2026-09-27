import { expect, test } from '@playwright/test'

test('starts a donation from the site and opens Stripe Checkout', async ({ page }) => {
  await page.route('**/api/donations/checkout', async (route) => {
    const body = route.request().postDataJSON()
    expect(body.amount).toBe('10')
    await route.fulfill({ json: { url: 'https://checkout.stripe.com/c/pay/cs_test_browser' } })
  })
  await page.route('https://checkout.stripe.com/**', (route) =>
    route.fulfill({ body: '<main>Checkout</main>' }),
  )
  await page.goto('/donate')
  await page.getByRole('radio', { name: '£10', exact: true }).check()
  await page.getByRole('button', { name: 'Continue to payment' }).click()
  await expect(page).toHaveURL('https://checkout.stripe.com/c/pay/cs_test_browser')
})

test('supports custom amounts and retrying canceled checkout', async ({ page }) => {
  await page.route('**/api/donations/checkout', (route) => {
    expect(route.request().postDataJSON().amount).toBe('12.34')
    return route.fulfill({ json: { url: 'https://checkout.stripe.com/c/pay/cs_test_custom' } })
  })
  await page.route('https://checkout.stripe.com/**', (route) =>
    route.fulfill({ body: '<main>Checkout</main>' }),
  )
  await page.goto('/donate?canceled=1')
  await expect(page.getByRole('status')).toBeVisible()
  await page.getByRole('radio', { name: 'Other amount' }).check()
  await page.getByRole('textbox', { name: 'Amount in pounds (£)' }).fill('12.34')
  await page.getByRole('button', { name: 'Continue to payment' }).click()
  await expect(page).toHaveURL('https://checkout.stripe.com/c/pay/cs_test_custom')
})

test('confirms paid donations after retrieving the payment status', async ({ page }) => {
  await page.route('**/api/donations/checkout?*', (route) =>
    route.fulfill({ json: { status: 'paid', amount: 2500 } }),
  )
  await page.goto('/donate/thanks?session_id=cs_test_browser')
  await expect(page.getByRole('status')).toContainText('£25.00')
  await expect(page.getByRole('link', { name: 'Back to Orchard OCD' })).toBeVisible()
})

test('lets donors check payments that are still processing', async ({ page }) => {
  let paid = false
  await page.route('**/api/donations/checkout?*', (route) =>
    route.fulfill({
      json: paid ? { status: 'paid', amount: 1000 } : { status: 'pending' },
    }),
  )
  await page.goto('/donate/thanks?session_id=cs_test_browser')
  const checkAgain = page.getByRole('button', { name: 'Check again' })
  await expect(checkAgain).toBeVisible()
  paid = true
  await checkAgain.click()
  await expect(page.getByRole('status')).toContainText('£10.00')
})

test('rejects invalid donation requests through the public endpoint', async ({ request }) => {
  const response = await request.post('/api/donations/checkout', { data: { amount: '0' } })
  expect(response.status()).toBe(400)
  expect((await request.get('/api/donations/checkout?session_id=invalid')).status()).toBe(400)
})
