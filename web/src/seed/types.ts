import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type ContentBlock =
  | { type: 'paragraph'; html: string }
  | { type: 'heading'; level: number; text: string }
  | { type: 'list'; ordered: boolean; items: string[] }
  | { type: 'quote'; html: string; cite?: string }
  | { type: 'image'; image: string; caption?: string; href?: string }
  | { type: 'video'; url: string }
  | { type: 'button'; label: string; href: string }
  | { type: 'embed'; url: string }
  | { type: 'table'; rows: string[][] }
  | { type: 'accordion-item'; title: string; blocks: ContentBlock[] }

export type SeedLayoutBlock =
  | { blockType: 'richText'; content: SerializedEditorState }
  | { blockType: 'imageBlock'; image: number; caption?: string }
  | { blockType: 'videoBlock'; url: string; title?: string }
  | { blockType: 'buttonBlock'; label: string; href: string; variant: string }
  | { blockType: 'embedBlock'; url: string }
  | { blockType: 'tableBlock'; rows: { cells: { value: string }[] }[] }
  | { blockType: 'accordionBlock'; items: { title: string; content: SerializedEditorState }[] }

export type SeedAsset = {
  id: string
  url: string
  file: string
  asset: string
  alt?: string
}

export type SeedHeroSlide = {
  title: string
  body: string[]
  links: { label: string; href: string }[]
  image?: string
}

export type SeedPage = {
  slug: string
  title: string
  description: string
  featuredImage: string | null
  hero: SeedHeroSlide[]
  blocks: ContentBlock[]
}

export type SeedPost = {
  slug: string
  title: string
  date: string
  categories: string[]
  description: string
  featuredImage: string | null
  byline: string | null
  blocks: ContentBlock[]
}

export type SeedStudy = {
  slug: string
  title: string
  date: string
  description: string
  featuredImage: string | null
  blocks: ContentBlock[]
}

export type SeedResearchSlide = {
  slug: string
  title: string
  image: string | null
  blocks: ContentBlock[]
}

export type SeedSpeaker = {
  slug: string
  name: string
  role: string
  photo: string | null
}

export type SeedPerson = {
  slug: string
  name: string
  excerpt: string
  photo: string | null
  website: string | null
  group: string | null
  order: number
  bio: ContentBlock[]
}

export type SeedWebinar = {
  title: string
  url: string
}

export type SeedContent = {
  pages: SeedPage[]
  posts: SeedPost[]
  studies: SeedStudy[]
  researchSlides: SeedResearchSlide[]
  speakers: SeedSpeaker[]
  people: SeedPerson[]
  webinars: SeedWebinar[]
  conferenceSpeakers: { name: string; page: string }[]
  images: SeedAsset[]
  documents: SeedAsset[]
}
