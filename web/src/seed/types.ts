import type { Person, Post } from '@/payload-types'

export type SeedBody = NonNullable<Post['body']>
export type PersonGroup = Person['group']

export type ContentBlock =
  | { type: 'paragraph'; html: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; html: string; cite?: string }
  | { type: 'image'; image: string; caption?: string; href?: string }
  | { type: 'video'; url?: string; file?: string; poster?: string }
  | { type: 'document'; document: string }
  | { type: 'button'; label: string; href: string }
  | { type: 'embed'; url: string }
  | { type: 'table'; rows: string[][] }
  | { type: 'accordion-item'; title: string; blocks: ContentBlock[] }

type SeedAsset = {
  id: string
  url: string
  file: string
  asset: string
  alt?: string
}

type SeedPost = {
  slug: string
  title: string
  date: string
  categories: string[]
  description: string
  featuredImage: string | null
  byline: string | null
  blocks: ContentBlock[]
}

type SeedStudy = {
  slug: string
  title: string
  date: string
  description: string
  featuredImage: string | null
  blocks: ContentBlock[]
}

export type SeedAssetIds = {
  media: Map<string, number>
  documents: Map<string, number>
  videos: Map<string, number>
}

type SeedSpeaker = {
  slug: string
  name: string
  role: string
  photo: string | null
}

type SeedPerson = {
  slug: string
  name: string
  excerpt: string
  photo: string | null
  website: string | null
  group: string | null
  order: number
}

type SeedWebinar = {
  title: string
  description: string | null
  url: string
  image: string | null
}

export type SeedContent = {
  pages: { slug: string }[]
  posts: SeedPost[]
  studies: SeedStudy[]
  speakers: SeedSpeaker[]
  people: SeedPerson[]
  webinars: SeedWebinar[]
  images: SeedAsset[]
  documents: SeedAsset[]
  videos: SeedAsset[]
}
