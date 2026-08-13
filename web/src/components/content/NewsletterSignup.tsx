'use client'

import { useState } from 'react'

import { buttonClasses } from '@/components/ui/Button'

type State = 'idle' | 'sending' | 'done' | 'failed'

const FIELD =
  'w-full rounded border-2 border-line bg-white px-4 py-3 text-base text-ink placeholder:text-faint focus:border-brand focus:outline-none'

const FIELDS = [
  { name: 'name', label: 'Name', type: 'text', autoComplete: 'name', required: false },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email', required: true },
]

export function NewsletterSignup() {
  const [state, setState] = useState<State>('idle')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setState('sending')

    const response = await fetch('/api/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: String(data.get('email') ?? ''),
        name: String(data.get('name') ?? ''),
      }),
    }).catch(() => null)

    if (response?.ok) {
      form.reset()
      setState('done')
      return
    }
    setState('failed')
  }

  return (
    <form onSubmit={submit} className="max-w-measure rounded-lg bg-mist p-6 sm:p-8 lg:max-w-none">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIELDS.map((field) => (
          <label key={field.name} className="flex flex-col gap-2">
            <span className="text-sm font-bold text-ink">{field.label}</span>
            <input
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              required={field.required}
              className={FIELD}
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={state === 'sending'}
          className={buttonClasses('primary', 'mt-2 self-end sm:mt-0')}
        >
          Sign up
        </button>
      </div>
      <p aria-live="polite" className="mt-4 text-base text-body empty:mt-0">
        {state === 'done' ? 'Thank you, you are on the list.' : null}
        {state === 'failed' ? 'That did not go through. Please try again.' : null}
      </p>
    </form>
  )
}
