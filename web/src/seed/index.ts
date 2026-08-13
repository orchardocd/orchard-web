import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { buildLinkMap } from '@/seed/links'
import { buildBody, createLexicalConverter } from '@/seed/richtext'
import type { PersonGroup, SeedContent } from '@/seed/types'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Payload blocks on an interactive prompt when a stale schema needs destructive changes,
// so the seed always starts from a fresh database file.
const databaseUrl = process.env.DATABASE_URL ?? ''
if (databaseUrl.startsWith('file:')) {
  const databaseFile = path.resolve(process.cwd(), databaseUrl.slice('file:'.length))
  await fs.rm(databaseFile, { force: true })
  await fs.rm(`${databaseFile}-shm`, { force: true })
  await fs.rm(`${databaseFile}-wal`, { force: true })
}
const assetsDir = path.join(dirname, 'assets')

const GROUP_SLUGS: Record<string, PersonGroup> = {
  'Our Team': 'team',
  'Scientific Advisory Board': 'scientific-advisory-board',
  'Our Supporters': 'partners',
  'Our Volunteers': 'ambassadors',
  'Our Members': 'college',
}

const COLLECTIONS = [
  'posts',
  'studies',
  'webinars',
  'people',
  'speakers',
  'categories',
  'media',
  'documents',
  'videos',
] as const

function assetPath(asset: { id: string; asset?: string }): string {
  if (!asset.asset) {
    throw new Error(
      `Asset ${asset.id} has no optimized file. Run "pnpm content" before seeding.`,
    )
  }
  return path.join(assetsDir, asset.asset)
}

function sameWords(left: string, right: string): boolean {
  const plain = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
  return plain(left) === plain(right)
}

function excerptFrom(
  blocks: SeedContent['posts'][number]['blocks'],
  title: string,
  limit = 220,
): string {
  for (const block of blocks) {
    if (block.type !== 'paragraph') continue
    const text = block.html
      .replace(/<br\s*\/?>/g, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/\s+/g, ' ')
      .trim()
    if (text.length < 40) continue
    // An opening line that only restates the title would print the title twice on the card.
    const opener = text.split(/(?<=[.!?])\s+/)[0]
    const body = sameWords(opener, title) ? text.slice(opener.length).trim() : text
    if (body.length < 40) continue
    if (body.length <= limit) return body
    const cut = body.slice(0, limit)
    const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('! '), cut.lastIndexOf('? '))
    return stop > 60 ? cut.slice(0, stop + 1) : `${cut.trimEnd()}…`
  }
  return ''
}

function firstImage(blocks: SeedContent['posts'][number]['blocks']): string | undefined {
  for (const block of blocks) {
    if (block.type === 'image') return block.image
  }
  return undefined
}

function titleFromFilename(id: string): string {
  const base = path.basename(id, path.extname(id))
  return base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()
}

async function wipe(payload: Payload) {
  for (const collection of COLLECTIONS) {
    await payload.db.deleteMany({ collection, where: {} })
  }
  // Upload files outlive their rows, and Payload renames around leftovers.
  for (const slug of ['media', 'documents', 'videos'] as const) {
    const directory = payload.collections[slug]?.config.upload?.staticDir
    if (typeof directory === 'string') {
      await fs.rm(directory, { recursive: true, force: true })
    }
  }
}

async function seedAssets(payload: Payload, content: SeedContent) {
  const mediaIds = new Map<string, number>()
  const documentIds = new Map<string, number>()
  const videoIds = new Map<string, number>()

  // Several uploads can share one file, and they are then one picture with one record.
  const byAsset = new Map<string, number>()
  for (const image of content.images) {
    const existing = byAsset.get(image.asset)
    if (existing !== undefined) {
      mediaIds.set(image.id, existing)
      continue
    }
    const created = await payload.create({
      collection: 'media',
      data: { alt: image.alt?.trim() || titleFromFilename(image.id) },
      filePath: assetPath(image),
    })
    byAsset.set(image.asset, created.id as number)
    mediaIds.set(image.id, created.id as number)
  }

  for (const doc of content.documents) {
    const filePath = assetPath(doc)
    const created = await payload.create({
      collection: 'documents',
      data: { title: titleFromFilename(doc.id) },
      filePath,
    })
    documentIds.set(doc.id, created.id as number)
  }

  for (const video of content.videos) {
    const filePath = assetPath(video)
    const created = await payload.create({
      collection: 'videos',
      data: { title: titleFromFilename(video.id) },
      filePath,
    })
    videoIds.set(video.id, created.id as number)
  }

  return { mediaIds, documentIds, videoIds }
}

async function seedCategories(payload: Payload, content: SeedContent) {
  const names = new Set<string>()
  for (const post of content.posts) {
    for (const name of post.categories) names.add(name)
  }
  const ids = new Map<string, number>()
  for (const name of [...names].sort()) {
    const created = await payload.create({
      collection: 'categories',
      data: {
        title: name,
        slug: name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      },
    })
    ids.set(name, created.id as number)
  }
  return ids
}

function describeError(error: unknown, label: string): never {
  const data = (error as { data?: { errors?: unknown[] } })?.data
  if (data?.errors) {
    console.error(`Validation failure for ${label}:`, JSON.stringify(data.errors, null, 2))
  }
  throw error
}

export async function seed(payload: Payload) {
  const raw = await fs.readFile(path.join(dirname, 'content.json'), 'utf8')
  const content = JSON.parse(raw) as SeedContent
  const toLexical = await createLexicalConverter(payload)
  const links = buildLinkMap(content)

  payload.logger.info('Clearing existing content')
  await wipe(payload)

  payload.logger.info(
    `Uploading ${content.images.length} images, ${content.documents.length} documents, ` +
      `${content.videos.length} videos`,
  )
  const { mediaIds, documentIds, videoIds } = await seedAssets(payload, content)
  const categoryIds = await seedCategories(payload, content)

  const assets = { media: mediaIds, documents: documentIds, videos: videoIds }
  const bodyOf = (blocks: SeedContent['posts'][number]['blocks'], featuredImage?: number) =>
    buildBody(blocks, assets, toLexical, links, featuredImage)

  payload.logger.info(`Creating ${content.posts.length} posts`)
  for (const post of content.posts) {
    const featuredImage = mediaIds.get(post.featuredImage ?? firstImage(post.blocks) ?? '')
    try {
      await payload.create({
        collection: 'posts',
        data: {
          title: post.title,
          slug: post.slug,
          publishedAt: post.date,
          byline: post.byline ?? undefined,
          categories: post.categories
            .map((name) => categoryIds.get(name))
            .filter((id): id is number => id !== undefined),
          excerpt: excerptFrom(post.blocks, post.title),
          featuredImage,
          body: bodyOf(post.blocks, featuredImage),
          meta: { description: post.description },
        },
      })
    } catch (error) {
      describeError(error, `post ${post.slug}`)
    }
  }

  payload.logger.info(`Creating ${content.studies.length} studies`)
  for (const study of content.studies) {
    const featuredImage = mediaIds.get(study.featuredImage ?? firstImage(study.blocks) ?? '')
    await payload.create({
      collection: 'studies',
      data: {
        title: study.title,
        slug: study.slug,
        publishedAt: study.date,
        excerpt: excerptFrom(study.blocks, study.title),
        featuredImage,
        body: bodyOf(study.blocks, featuredImage),
        meta: { description: study.description },
      },
    })
  }

  payload.logger.info(`Creating ${content.webinars.length} webinars`)
  for (const [index, webinar] of content.webinars.entries()) {
    await payload.create({
      collection: 'webinars',
      data: {
        title: webinar.title,
        slug: `webinar-${index + 1}`,
        url: webinar.url,
        description: webinar.description ?? undefined,
        image: webinar.image ? mediaIds.get(webinar.image) : undefined,
        order: index,
      },
    })
  }

  payload.logger.info(`Creating ${content.people.length} people`)
  for (const person of content.people) {
    await payload.create({
      collection: 'people',
      data: {
        name: person.name,
        slug: person.slug,
        group: GROUP_SLUGS[person.group ?? ''] ?? 'team',
        order: person.order,
        photo: person.photo ? mediaIds.get(person.photo) : undefined,
        website: person.website ?? undefined,
        excerpt: person.excerpt,
      },
    })
  }

  payload.logger.info(`Creating ${content.speakers.length} speakers`)
  for (const [index, speaker] of content.speakers.entries()) {
    await payload.create({
      collection: 'speakers',
      data: {
        name: speaker.name,
        slug: speaker.slug,
        role: speaker.role,
        photo: speaker.photo ? mediaIds.get(speaker.photo) : undefined,
        order: index,
      },
    })
  }

  const email = process.env.PAYLOAD_ADMIN_EMAIL
  const password = process.env.PAYLOAD_ADMIN_PASSWORD
  if (email && password) {
    const existing = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      limit: 1,
    })
    if (existing.docs.length === 0) {
      await payload.create({ collection: 'users', data: { email, password } })
      payload.logger.info(`Created admin user ${email}`)
    }
  }

  payload.logger.info('Seed complete')
}

const payload = await getPayload({ config })
await seed(payload)
process.exit(0)
