import type { SeedContent } from '@/seed/types'

const SITE = /^https?:\/\/(?:www\.)?orchardocd\.org/i

export type LinkMap = Map<string, string>

export function buildLinkMap(content: SeedContent): LinkMap {
  const map: LinkMap = new Map()
  for (const page of content.pages) {
    map.set(page.slug, page.slug === 'home' ? '/' : `/${page.slug}`)
  }
  for (const post of content.posts) {
    map.set(post.slug, `/blog/${post.slug}`)
  }
  for (const study of content.studies) {
    map.set(study.slug, `/participate-research/${study.slug}`)
  }
  map.set('the-work-we-do', '/the-work-we-do')
  map.set('blog', '/blog')
  return map
}

export function rewriteHref(href: string, map: LinkMap): string {
  if (!href || !SITE.test(href)) return href
  const url = new URL(href)
  const segments = url.pathname.split('/').filter(Boolean)
  if (segments.length === 0) return '/'
  const slug = segments[segments.length - 1]
  const mapped = map.get(slug)
  if (mapped) return `${mapped}${url.hash}`
  if (url.pathname.startsWith('/wp-content/')) return href
  return `/${segments.join('/')}${url.hash}`
}

export function rewriteHtml(html: string, map: LinkMap): string {
  return html.replace(/href="([^"]+)"/g, (match, href: string) => {
    const rewritten = rewriteHref(href, map)
    return rewritten === href ? match : `href="${rewritten}"`
  })
}
