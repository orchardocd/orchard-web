import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

type Doc = { slug?: unknown }

async function refresh(paths: string[]): Promise<void> {
  try {
    const { revalidatePath } = await import('next/cache')
    for (const path of paths) revalidatePath(path)
  } catch {
    return
  }
}

function slugOf(doc: unknown): string | null {
  const value = (doc as Doc)?.slug
  return typeof value === 'string' && value.length > 0 ? value : null
}

export function revalidates(indexes: string[], basePath?: string) {
  const pathsFor = (doc: unknown): string[] => {
    const slug = basePath ? slugOf(doc) : null
    return slug ? [...indexes, `${basePath}/${slug}`] : indexes
  }

  const afterChange: CollectionAfterChangeHook = async ({ doc, previousDoc }) => {
    const paths = new Set([...pathsFor(doc), ...pathsFor(previousDoc)])
    await refresh([...paths])
    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    await refresh(pathsFor(doc))
    return doc
  }

  return { afterChange: [afterChange], afterDelete: [afterDelete] }
}
