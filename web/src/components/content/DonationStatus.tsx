'use client'

import { useEffect, useState } from 'react'

import { ButtonLink, buttonClasses } from '@/components/ui/Button'

type Status = 'loading' | 'paid' | 'pending' | 'canceled' | 'unpaid' | 'failed'

export function DonationStatus({ sessionId }: { sessionId: string }) {
  const [status, setStatus] = useState<Status>('loading')
  const [amount, setAmount] = useState(0)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    async function check() {
      try {
        const response = await fetch(
          `/api/donations/checkout?session_id=${encodeURIComponent(sessionId)}`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error('Unable to confirm donation')
        const body: unknown = await response.json()
        if (typeof body !== 'object' || body === null || !('status' in body)) {
          throw new Error('Unable to confirm donation')
        }
        if (body.status === 'paid' && 'amount' in body && typeof body.amount === 'number') {
          setAmount(body.amount)
          setStatus('paid')
        } else if (
          body.status === 'pending' ||
          body.status === 'canceled' ||
          body.status === 'unpaid'
        ) {
          setStatus(body.status)
        } else {
          throw new Error('Unable to confirm donation')
        }
      } catch {
        if (!controller.signal.aborted) setStatus('failed')
      }
    }
    void check()
    return () => controller.abort()
  }, [sessionId, attempt])

  const messages: Record<Status, string> = {
    loading: 'Checking your donation…',
    paid: `Thank you for your donation of £${(amount / 100).toFixed(2)}. Your support helps fund OCD research.`,
    pending: 'Your payment is still processing. Please check again before making another donation.',
    canceled: 'This checkout has expired. You can start a new donation.',
    unpaid: 'Your payment has not been completed.',
    failed:
      'We could not confirm your donation. Please check again or contact info@orchardocd.org before making another payment.',
  }

  return (
    <div className="max-w-measure">
      <p role="status" className="mb-6 text-lg text-body">
        {messages[status]}
      </p>
      {status === 'pending' || status === 'failed' ? (
        <button
          className={buttonClasses()}
          onClick={() => {
            setStatus('loading')
            setAttempt(attempt + 1)
          }}
        >
          Check again
        </button>
      ) : null}
      {status === 'canceled' || status === 'unpaid' ? (
        <ButtonLink href="/donate">Return to donations</ButtonLink>
      ) : null}
      {status === 'paid' ? <ButtonLink href="/">Back to Orchard OCD</ButtonLink> : null}
    </div>
  )
}
