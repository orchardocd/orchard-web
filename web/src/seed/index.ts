import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Payload } from 'payload'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { buildLayout, createLexicalConverter } from '@/seed/blocks'
import { buildLinkMap, rewriteHref, rewriteHtml } from '@/seed/links'
import { navigation, siteSettings } from '@/seed/settings'
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
  'pages',
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

function stripMarkup(value: string | null | undefined): string {
  return (value ?? '')
    .replace(/<br\s*\/?>/g, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function assetPath(asset: { id: string; asset?: string }): string {
  if (!asset.asset) {
    throw new Error(
      `Asset ${asset.id} has no optimized file. Run "pnpm content" before seeding.`,
    )
  }
  return path.join(assetsDir, asset.asset)
}

function excerptFrom(blocks: SeedContent['posts'][number]['blocks'], limit = 220): string {
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
    if (text.length <= limit) return text
    const cut = text.slice(0, limit)
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

  for (const image of content.images) {
    const filePath = assetPath(image)
    const created = await payload.create({
      collection: 'media',
      data: { alt: image.alt?.trim() || titleFromFilename(image.id) },
      filePath,
    })
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
  const layoutOf = (blocks: SeedContent['pages'][number]['blocks']) =>
    buildLayout(blocks, assets, toLexical, links)

  // The landing page lives in the Home page global, not as an editable blocks page.
  const pages = content.pages.filter((page) => page.slug !== 'home')
  payload.logger.info(`Creating ${pages.length} pages`)
  for (const page of pages) {
    await payload.create({
      collection: 'pages',
      data: {
        title: page.title,
        slug: page.slug,
        hero: page.hero.map((slide) => ({
          title: slide.title,
          content: slide.body.length
            ? toLexical(rewriteHtml(slide.body.map((html) => `<p>${html}</p>`).join(''), links))
            : undefined,
          ctaLabel: slide.links[0]?.label,
          ctaHref: slide.links[0] ? rewriteHref(slide.links[0].href, links) : undefined,
          image: slide.image ? mediaIds.get(slide.image) : undefined,
        })),
        layout: layoutOf(page.blocks),
        meta: {
          description: page.description,
          image: page.featuredImage ? mediaIds.get(page.featuredImage) : undefined,
        },
      },
    })
  }

  payload.logger.info(`Creating ${content.posts.length} posts`)
  for (const post of content.posts) {
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
        excerpt: excerptFrom(post.blocks),
        featuredImage: mediaIds.get(post.featuredImage ?? firstImage(post.blocks) ?? ''),
        layout: layoutOf(post.blocks),
        meta: { description: post.description },
        },
      })
    } catch (error) {
      describeError(error, `post ${post.slug}`)
    }
  }

  payload.logger.info(`Creating ${content.studies.length} studies`)
  for (const study of content.studies) {
    await payload.create({
      collection: 'studies',
      data: {
        title: study.title,
        slug: study.slug,
        publishedAt: study.date,
        excerpt: excerptFrom(study.blocks),
        featuredImage: mediaIds.get(study.featuredImage ?? firstImage(study.blocks) ?? ''),
        layout: layoutOf(study.blocks),
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
        bio: layoutOf(person.bio),
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

  payload.logger.info('Writing the home page')
  const home = content.home
  const media = (key: string | null | undefined) => (key ? mediaIds.get(key) : undefined)
  const text = (value: string | null | undefined) => stripMarkup(value) || undefined
  const images = (keys: string[] = []) =>
    keys.map((key) => mediaIds.get(key)).filter((id): id is number => id !== undefined)
      .map((image) => ({ image }))
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: {
        title: stripMarkup(home.hero.title),
        ctaLabel: text(home.hero.ctaLabel),
        ctaHref: home.hero.ctaHref ? rewriteHref(home.hero.ctaHref, links) : undefined,
        image: media(home.hero.image),
      },
      highlights: home.highlights.map((item) => ({
        title: stripMarkup(item.title),
        ctaLabel: text(item.ctaLabel),
        ctaHref: item.ctaHref ? rewriteHref(item.ctaHref, links) : undefined,
        image: media(item.image),
      })),
      about: {
        heading: home.about.heading,
        intro: stripMarkup(home.about.intro),
        image: media(home.about.image),
        pillars: home.about.pillars.map((pillar) => ({
          title: pillar.title,
          body: stripMarkup(pillar.body),
          image: media(pillar.image),
        })),
        goalsTitle: home.about.goalsTitle,
        goalsIntro: stripMarkup(home.about.goalsIntro),
        goals: home.about.goals.map((goal) => ({ text: stripMarkup(goal) })),
        ctaHeading: text(home.about.ctaHeading),
        ctaLabel: text(home.about.ctaLabel),
        ctaHref: home.about.ctaHref ? rewriteHref(home.about.ctaHref, links) : undefined,
        ctaImages: images(home.about.ctaImages),
      },
      video: { url: home.video.url ?? undefined, poster: media(home.video.poster) },
      participate: {
        heading: home.participate.heading,
        body: stripMarkup(home.participate.body),
        ctaLabel: text(home.participate.ctaLabel),
        ctaHref: home.participate.ctaHref
          ? rewriteHref(home.participate.ctaHref, links)
          : undefined,
      },
      social: {
        heading: home.social.heading,
        body: stripMarkup(home.social.body),
        images: images(home.social.images),
      },
      proposals: {
        heading: home.proposals.heading,
        body: home.proposals.body.map((paragraph) => ({ text: stripMarkup(paragraph) })),
        quote: text(home.proposals.quote),
        image: media(home.proposals.image),
        ctaLabel: text(home.proposals.ctaLabel),
        ctaHref: home.proposals.ctaHref
          ? rewriteHref(home.proposals.ctaHref, links)
          : undefined,
      },
      blog: { heading: home.blog.heading, images: images(home.blog.images) },
      webinar: {
        title: text(home.webinar.title),
        image: media(home.webinar.image),
        ctaLabel: text(home.webinar.ctaLabel),
        ctaHref: home.webinar.ctaHref ? rewriteHref(home.webinar.ctaHref, links) : undefined,
      },
    },
  })

  payload.logger.info('Writing globals')
  await payload.updateGlobal({ slug: 'site-settings', data: siteSettings })
  await payload.updateGlobal({ slug: 'navigation', data: navigation })

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
