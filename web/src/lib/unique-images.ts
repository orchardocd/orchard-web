import type { MediaValue } from '@/components/ui/Media'

function mediaKey(value: MediaValue): string | null {
  if (typeof value === 'number') return String(value)
  if (value && typeof value === 'object') return String(value.id)
  return null
}

/**
 * Blanks out an illustration that the page has already shown. The old site repeated the
 * same artwork across slider slides and cards; showing it once reads as intended.
 */
export function withoutRepeats<T extends { image?: MediaValue }>(
  items: T[] | null | undefined,
  alreadyShown: MediaValue[] = [],
): T[] {
  const seen = new Set(alreadyShown.map(mediaKey).filter((key): key is string => key !== null))
  return (items ?? []).map((item) => {
    const key = mediaKey(item.image)
    if (key === null) return item
    if (seen.has(key)) return { ...item, image: undefined }
    seen.add(key)
    return item
  })
}
