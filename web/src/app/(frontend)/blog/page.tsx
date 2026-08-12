import type { Metadata } from 'next'

import { PostCards } from '@/components/content/ArticleCard'
import { Banner, BannerTitle } from '@/components/layout/Banner'
import { Container } from '@/components/ui/Container'
import { getPosts } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Blog',
}

export default async function BlogIndex() {
  const posts = await getPosts(100)

  return (
    <>
      <Banner>
        <BannerTitle>Blog</BannerTitle>
      </Banner>

      <Container className="py-14">
        <PostCards posts={posts.docs} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" />
      </Container>
    </>
  )
}
