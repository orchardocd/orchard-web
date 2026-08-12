import type { Page, Person, SiteSetting, Navigation } from '@/payload-types'

export type PayloadLayout = NonNullable<Page['layout']>
export type PersonGroup = Person['group']
export type SiteSettingsData = Omit<SiteSetting, 'id' | 'createdAt' | 'updatedAt'>
export type NavigationData = Omit<Navigation, 'id' | 'createdAt' | 'updatedAt'>

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

export type SeedLayoutBlock = PayloadLayout[number]

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

export type SeedAssetIds = {
  media: Map<string, number>
  documents: Map<string, number>
  videos: Map<string, number>
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
  description: string | null
  url: string
  image: string | null
}

export type SeedPromo = {
  title: string
  ctaLabel: string | null
  ctaHref: string | null
  image: string | null
}

export type SeedHome = {
  hero: SeedPromo
  highlights: SeedPromo[]
  about: {
    heading: string
    intro: string
    image: string | null
    pillars: { title: string; body: string; image: string | null }[]
    goalsTitle: string
    goalsIntro: string
    goals: string[]
    ctaHeading: string | null
    ctaLabel: string | null
    ctaHref: string | null
    ctaImages: string[]
  }
  video: { url: string | null; poster: string | null }
  participate: { heading: string; body: string; ctaLabel: string | null; ctaHref: string | null }
  social: { heading: string; body: string; images: string[] }
  proposals: {
    heading: string
    body: string[]
    quote: string | null
    ctaLabel: string | null
    ctaHref: string | null
    image: string | null
    images: string[]
  }
  blog: { heading: string }
  webinar: {
    title: string | null
    image: string | null
    ctaLabel: string | null
    ctaHref: string | null
  }
}

export type SeedContent = {
  home: SeedHome
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
  videos: SeedAsset[]
}
