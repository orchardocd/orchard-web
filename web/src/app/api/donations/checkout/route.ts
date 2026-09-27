import { donationPence } from '@/lib/donation-amount'
import {
  createDonationCheckout,
  donationConfig,
  DonationError,
  donationStatus,
  isRecord,
} from '@/lib/donations'

function failure(status: number) {
  return Response.json(
    { error: 'Unable to process the donation request.' },
    {
      status,
      headers: { 'Cache-Control': 'no-store' },
    },
  )
}

export async function POST(request: Request) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return failure(415)
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return failure(400)
  }
  if (!isRecord(body)) return failure(400)
  const amount = donationPence(body.amount)
  if (
    amount === null ||
    typeof body.requestId !== 'string' ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.requestId)
  ) {
    return failure(400)
  }
  try {
    const { origin } = donationConfig()
    const requestOrigin = request.headers.get('origin')
    if (requestOrigin && requestOrigin !== origin) return failure(403)
    const url = await createDonationCheckout(amount, body.requestId)
    return Response.json({ url }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return failure(error instanceof DonationError ? error.status : 502)
  }
}

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get('session_id')
  if (!sessionId || !/^cs_(?:test_|live_)?[a-zA-Z0-9]{1,200}$/.test(sessionId)) {
    return failure(400)
  }
  try {
    return Response.json(await donationStatus(sessionId), {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (error) {
    return failure(error instanceof DonationError ? error.status : 502)
  }
}
