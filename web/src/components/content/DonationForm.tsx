'use client'

import { useRef, useState } from 'react'

import { buttonClasses } from '@/components/ui/Button'
import { DONATION_PRESETS, donationPence } from '@/lib/donation-amount'

export function DonationForm({ canceled }: { canceled: boolean }) {
  const [amount, setAmount] = useState('25')
  const [custom, setCustom] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const attempt = useRef<{ amount: string; id: string } | null>(null)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (sending) return
    if (donationPence(amount) === null) {
      setError('Enter an amount between £1 and £10,000, with no more than two decimal places.')
      return
    }
    if (attempt.current?.amount !== amount) {
      attempt.current = { amount, id: crypto.randomUUID() }
    }
    setSending(true)
    setError('')
    try {
      const response = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, requestId: attempt.current.id }),
      })
      if (response.status === 503) {
        setError(
          'Online donations are temporarily unavailable. Please contact info@orchardocd.org.',
        )
        return
      }
      if (!response.ok) throw new Error('Checkout unavailable')
      const body: unknown = await response.json()
      if (
        typeof body !== 'object' ||
        body === null ||
        !('url' in body) ||
        typeof body.url !== 'string' ||
        new URL(body.url).origin !== 'https://checkout.stripe.com'
      ) {
        throw new Error('Checkout unavailable')
      }
      window.location.assign(body.url)
    } catch {
      setError('We could not open the payment page. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={submit} className="max-w-measure rounded-lg bg-mist p-6 sm:p-8">
      {canceled ? (
        <p role="status" className="mb-6">
          Your checkout was canceled. You can try again below.
        </p>
      ) : null}
      <fieldset disabled={sending}>
        <legend className="mb-4 text-lg font-bold text-ink">Choose a one-off donation</legend>
        <div className="flex flex-wrap gap-3">
          {DONATION_PRESETS.map((preset) => (
            <label
              key={preset}
              className="flex cursor-pointer items-center gap-2 rounded border-2 border-line bg-white px-4 py-3 has-checked:border-brand"
            >
              <input
                type="radio"
                name="donation-amount"
                checked={!custom && amount === String(preset)}
                onChange={() => {
                  setCustom(false)
                  setAmount(String(preset))
                }}
              />
              £{preset}
            </label>
          ))}
          <label className="flex cursor-pointer items-center gap-2 rounded border-2 border-line bg-white px-4 py-3 has-checked:border-brand">
            <input
              type="radio"
              name="donation-amount"
              checked={custom}
              onChange={() => {
                setCustom(true)
                setAmount('')
              }}
            />
            Other amount
          </label>
        </div>
        {custom ? (
          <label className="mt-6 flex flex-col gap-2">
            <span className="font-bold text-ink">Amount in pounds (£)</span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              maxLength={8}
              aria-describedby="donation-limits"
              className="rounded border-2 border-line bg-white px-4 py-3 text-base text-ink focus:border-brand focus:outline-none"
            />
            <span id="donation-limits" className="text-sm text-body">
              £1 to £10,000. Use up to two decimal places.
            </span>
          </label>
        ) : null}
        <p className="my-6 text-body">
          You’ll complete your donation securely on Stripe’s payment page.
        </p>
        <button
          type="submit"
          disabled={sending}
          className={buttonClasses('donate', 'disabled:opacity-60')}
        >
          {sending ? 'Opening payment page…' : 'Continue to payment'}
        </button>
      </fieldset>
      {error ? (
        <p role="alert" className="mt-4 text-body">
          {error}
        </p>
      ) : null}
    </form>
  )
}
