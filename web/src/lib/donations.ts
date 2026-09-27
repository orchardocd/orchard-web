import { MAX_DONATION_PENCE, MIN_DONATION_PENCE } from '@/lib/donation-amount'

const SOURCE = 'orchard-web-donation'

export class DonationError extends Error {
  constructor(public readonly status: number) {
    super('Donation request failed')
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function donationConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const siteUrl = process.env.SITE_URL
  if (!secretKey || !siteUrl) throw new DonationError(503)

  let url: URL
  try {
    url = new URL(siteUrl)
  } catch {
    throw new DonationError(503)
  }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if (
    (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new DonationError(503)
  }
  return { secretKey, origin: url.origin }
}

async function stripeRequest(path: string, init: RequestInit = {}) {
  const { secretKey } = donationConfig()
  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions${path}`, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${secretKey}`,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) throw new DonationError(response.status === 404 ? 404 : 502)
    const body: unknown = await response.json()
    if (!isRecord(body)) throw new DonationError(502)
    return body
  } catch (error) {
    if (error instanceof DonationError) throw error
    throw new DonationError(502)
  }
}

export async function createDonationCheckout(amount: number, requestId: string) {
  const { origin } = donationConfig()
  const session = await stripeRequest('', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Idempotency-Key': `${SOURCE}-${requestId}`,
    },
    body: new URLSearchParams({
      mode: 'payment',
      submit_type: 'donate',
      'payment_method_types[0]': 'card',
      'line_items[0][quantity]': '1',
      'line_items[0][price_data][currency]': 'gbp',
      'line_items[0][price_data][unit_amount]': String(amount),
      'line_items[0][price_data][product_data][name]': 'Donation to Orchard OCD',
      'metadata[source]': SOURCE,
      'payment_intent_data[metadata][source]': SOURCE,
      success_url: `${origin}/donate/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate?canceled=1`,
    }),
  })
  if (typeof session.url !== 'string') throw new DonationError(502)
  let url: URL
  try {
    url = new URL(session.url)
  } catch {
    throw new DonationError(502)
  }
  if (url.origin !== 'https://checkout.stripe.com' || url.username || url.password) {
    throw new DonationError(502)
  }
  return url.href
}

export async function donationStatus(sessionId: string) {
  const session = await stripeRequest(`/${encodeURIComponent(sessionId)}`)
  if (
    !isRecord(session.metadata) ||
    session.metadata.source !== SOURCE ||
    session.mode !== 'payment' ||
    session.currency !== 'gbp'
  ) {
    throw new DonationError(404)
  }
  const amount = session.amount_total
  if (
    typeof amount !== 'number' ||
    !Number.isSafeInteger(amount) ||
    amount < MIN_DONATION_PENCE ||
    amount > MAX_DONATION_PENCE
  ) {
    throw new DonationError(502)
  }
  if (session.status === 'complete' && session.payment_status === 'paid') {
    return { status: 'paid' as const, amount }
  }
  if (session.status === 'complete' && session.payment_status === 'unpaid') {
    return { status: 'pending' as const }
  }
  if (session.status === 'expired') return { status: 'canceled' as const }
  if (session.status === 'open') return { status: 'unpaid' as const }
  throw new DonationError(502)
}
