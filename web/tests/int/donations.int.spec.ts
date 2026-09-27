import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GET, POST } from '@/app/api/donations/checkout/route'

const REQUEST_ID = 'a1f7ed92-c45b-4e7d-a123-21f5b019cb0f'
const CHECKOUT_URL = 'https://checkout.stripe.com/c/pay/cs_test_donation'

function checkoutRequest(amount: unknown = '25', requestId: unknown = REQUEST_ID) {
  return new Request('http://localhost:3000/api/donations/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
    body: JSON.stringify({ amount, requestId }),
  })
}

function statusRequest(sessionId = 'cs_test_donation') {
  return new Request(`http://localhost:3000/api/donations/checkout?session_id=${sessionId}`)
}

function stripeSession(overrides: Record<string, unknown> = {}) {
  return {
    metadata: { source: 'orchard-web-donation' },
    mode: 'payment',
    currency: 'gbp',
    amount_total: 2500,
    status: 'complete',
    payment_status: 'paid',
    ...overrides,
  }
}

beforeEach(() => {
  vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fixture')
  vi.stubEnv('SITE_URL', 'http://localhost:3000')
  vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Unexpected network request'))
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllEnvs()
})

describe('donation checkout HTTP endpoints', () => {
  it.each(['1', '5', '10', '25', '50', '100', '12.34', '10000'])(
    'creates a GBP donation for £%s',
    async (amount) => {
      vi.mocked(fetch).mockImplementation(async (url, options) => {
        const parameters = new URLSearchParams(String(options?.body))
        const headers = new Headers(options?.headers)
        expect(url).toBe('https://api.stripe.com/v1/checkout/sessions')
        expect(parameters.get('line_items[0][price_data][unit_amount]')).toBe(
          String(Math.round(Number(amount) * 100)),
        )
        expect(parameters.get('line_items[0][price_data][currency]')).toBe('gbp')
        expect(parameters.get('mode')).toBe('payment')
        expect(parameters.get('submit_type')).toBe('donate')
        expect(parameters.get('payment_method_types[0]')).toBe('card')
        expect(parameters.get('metadata[source]')).toBe('orchard-web-donation')
        expect(parameters.get('success_url')).toBe(
          'http://localhost:3000/donate/thanks?session_id={CHECKOUT_SESSION_ID}',
        )
        expect(parameters.get('cancel_url')).toBe('http://localhost:3000/donate?canceled=1')
        expect(headers.get('Idempotency-Key')).toBe(`orchard-web-donation-${REQUEST_ID}`)
        return Response.json({ url: CHECKOUT_URL })
      })
      const response = await POST(checkoutRequest(amount))
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({ url: CHECKOUT_URL })
    },
  )

  it.each(['0', '0.99', '-10', '10000.01', '12.345', '1e2', '5foo', '', ' 5 ', 500, null, {}])(
    'rejects invalid donation amount %j',
    async (amount) => {
      expect((await POST(checkoutRequest(amount))).status).toBe(400)
    },
  )

  it('rejects malformed request bodies and missing request IDs', async () => {
    const request = new Request('http://localhost:3000/api/donations/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{',
    })
    expect((await POST(request)).status).toBe(400)
    expect((await POST(checkoutRequest('25', null))).status).toBe(400)
  })

  it('rejects unsupported request formats', async () => {
    const request = new Request('http://localhost:3000/api/donations/checkout', {
      method: 'POST',
      body: 'amount=25',
    })
    expect((await POST(request)).status).toBe(415)
  })

  it('rejects requests originating on another site', async () => {
    const request = checkoutRequest()
    request.headers.set('Origin', 'https://example.com')
    expect((await POST(request)).status).toBe(403)
  })

  it.each(['STRIPE_SECRET_KEY', 'SITE_URL'])('handles missing %s configuration', async (key) => {
    vi.stubEnv(key, '')
    expect((await POST(checkoutRequest())).status).toBe(503)
    expect((await GET(statusRequest())).status).toBe(503)
  })

  it.each(['not a URL', 'http://orchardocd.org', 'https://orchardocd.org/path'])(
    'rejects unusable site configuration %s',
    async (siteUrl) => {
      vi.stubEnv('SITE_URL', siteUrl)
      expect((await POST(checkoutRequest())).status).toBe(503)
    },
  )

  it('handles Stripe and network failures', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(Response.json({}, { status: 500 }))
    expect((await POST(checkoutRequest())).status).toBe(502)
    expect((await POST(checkoutRequest())).status).toBe(502)
  })

  it.each([{}, { url: 'https://example.com' }, { url: 'invalid' }])(
    'rejects unusable Stripe responses %j',
    async (body) => {
      vi.mocked(fetch).mockResolvedValueOnce(Response.json(body))
      expect((await POST(checkoutRequest())).status).toBe(502)
    },
  )

  it('confirms a paid donation without exposing donor details', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      Response.json(
        stripeSession({
          customer_details: { email: 'donor@example.com', name: 'Donor' },
        }),
      ),
    )
    const response = await GET(statusRequest())
    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(await response.json()).toEqual({ status: 'paid', amount: 2500 })
  })

  it.each([
    ['complete', 'unpaid', 'pending'],
    ['open', 'unpaid', 'unpaid'],
    ['expired', 'unpaid', 'canceled'],
  ])('reports %s/%s as %s', async (status, payment_status, expected) => {
    vi.mocked(fetch).mockResolvedValueOnce(Response.json(stripeSession({ status, payment_status })))
    const response = await GET(statusRequest())
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ status: expected })
  })

  it.each(['', 'invalid', '../other'])('rejects invalid session identifiers %s', async (id) => {
    expect((await GET(statusRequest(id))).status).toBe(400)
  })

  it.each([{ metadata: {} }, { currency: 'usd' }, { mode: 'subscription' }])(
    'rejects sessions from unrelated payments %j',
    async (overrides) => {
      vi.mocked(fetch).mockResolvedValueOnce(Response.json(stripeSession(overrides)))
      expect((await GET(statusRequest())).status).toBe(404)
    },
  )

  it('handles missing and malformed Stripe sessions', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(Response.json({}, { status: 404 }))
    expect((await GET(statusRequest())).status).toBe(404)
    vi.mocked(fetch).mockResolvedValueOnce(Response.json(stripeSession({ amount_total: 1.5 })))
    expect((await GET(statusRequest())).status).toBe(502)
  })
})
