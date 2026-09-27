export const DONATION_PRESETS = [5, 10, 25, 50, 100]
export const MIN_DONATION_PENCE = 100
export const MAX_DONATION_PENCE = 1_000_000

export function donationPence(amount: unknown): number | null {
  if (typeof amount !== 'string' || !/^\d{1,5}(?:\.\d{1,2})?$/.test(amount)) return null
  const [pounds, fraction = ''] = amount.split('.')
  const pence = Number(pounds) * 100 + Number(fraction.padEnd(2, '0'))
  return pence >= MIN_DONATION_PENCE && pence <= MAX_DONATION_PENCE ? pence : null
}
