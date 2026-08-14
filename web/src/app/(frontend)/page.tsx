import { ArticleCards } from '@/components/content/ArticleCard'
import { SocialLinks } from '@/components/content/SocialLinks'
import { CARD_TITLE_CLASSES } from '@/components/layout/Banner'
import { PageBanner, PageSection, Photo, TextWithFigure, Video } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { getPosts } from '@/lib/payload'
import { DONATE_URL, NEWSLETTER, REGISTRY_URL, SOCIAL } from '@/lib/site'

const CARD_SIZES = '(min-width: 1024px) 18rem, (min-width: 768px) 45vw, calc(100vw - 3rem)'
const CARD_CLASSES = 'flex flex-col overflow-hidden rounded-lg border border-line'
const LEAD = 'max-w-measure text-lg leading-relaxed text-body md:text-xl'
const DARK_LEAD = 'max-w-measure text-lg leading-relaxed text-pretty text-white/92'
const SOCIAL_LINK =
  'inline-block rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-link no-underline hover:bg-brand-strong hover:text-white'

function Highlight({
  file,
  alt,
  title,
  href,
}: {
  file: string
  alt: string
  title: string
  href: string
}) {
  return (
    <li className={CARD_CLASSES}>
      <Photo
        file={file}
        alt={alt}
        sizes={CARD_SIZES}
        className="aspect-[5/4] rounded-none border-b border-line bg-mist object-contain p-5"
      />
      <div className="flex flex-1 flex-col gap-4 p-6">
        <h2 className={cn(CARD_TITLE_CLASSES, 'line-clamp-4 text-ink')}>{title}</h2>
        <ButtonLink
          href={href}
          variant="secondary"
          className="mt-auto self-start px-5 py-2.5 text-sm"
          detail={`about ${title}`}
        >
          Read More
        </ButtonLink>
      </div>
    </li>
  )
}

export default async function HomePage() {
  const posts = await getPosts(3)

  return (
    <>
      <PageBanner
        title="Help us develop better treatments for OCD"
        image="2022-04-hm-bnrr-1.png"
        imageAlt="A person with leafy plants growing from their head, watered from a can"
        actions={
          <>
            <ButtonLink href={DONATE_URL} variant="donate" className="px-8 py-4 text-lg">
              Donate Now
            </ButtonLink>
            <ButtonLink href="/about-orchard" variant="ghost" className="px-8 py-4 text-lg">
              Learn About Orchard OCD
            </ButtonLink>
          </>
        }
      >
        <p>
          We build a community of interdisciplinary professionals and work with them closely to
          progress together in developing new and better treatments for patients suffering from OCD.
        </p>
      </PageBanner>

      <PageSection label="Highlights">
        <ul className="grid items-stretch gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
          <Highlight
            file="2023-02-Screenshot-2023-02-09-at-13-40-19.png"
            alt="The Orchard OCD Registry wordmark"
            title="Join our Orchard OCD Registry Community"
            href={REGISTRY_URL}
          />
          <Highlight
            file="2022-04-slider-image2.png"
            alt="Four people talking around a tablet"
            title="Participate in our brand-new OCD survey on new & alternative forms of OCD treatment"
            href="https://redcap.herts.ac.uk/surveys/?s=LETKTCCJPM"
          />
          <Highlight
            file="2022-03-homecallfor.svg"
            alt="A team gathered around a giant lightbulb full of ideas"
            title="New Blog Post: 2022 Call for Proposals Winner"
            href="/blog/call-for-proposals-2022"
          />
          <Highlight
            file="2021-06-sliderbrain.png"
            alt="A smiling cartoon brain wearing glasses, sitting cross-legged in meditation"
            title="Participate in exciting new OCD research"
            href="/participate-research"
          />
        </ul>
      </PageSection>

      <PageSection heading="About Orchard OCD" tone="mist">
        <p className={LEAD}>
          Watch our short film to hear why Orchard OCD exists, and how we are working to bring new
          and better treatments to everyone living with the condition.
        </p>
        <ButtonLink href="/about-orchard" variant="secondary" className="mt-8">
          About us
        </ButtonLink>
        <Video
          url="https://player.vimeo.com/video/306831655?h=924cbb2311"
          title="Learn About Orchard OCD"
          poster="2022-05-Untitled-1.png"
          className="mt-12"
        />
      </PageSection>

      <PageSection heading="Want To Participate In Brand New OCD Research?">
        <p className={LEAD}>
          Please have a look at the current OCD studies looking for participants.
        </p>
        <ButtonLink
          href="/participate-research"
          className="mt-8"
          detail="about current OCD studies looking for participants"
        >
          Learn more
        </ButtonLink>
      </PageSection>

      <PageSection heading="Follow Us On Social Media" tone="mist">
        <TextWithFigure
          figure={
            <div className="w-full max-w-sm">
              <Photo
                file="2022-04-Group-14643-1.png"
                alt="A person reading Orchard OCD updates on their phone"
                sizes="(min-width: 57rem) 24rem, calc(100vw - 3rem)"
              />
            </div>
          }
        >
          <p className={LEAD}>
            If you want to keep up-to-date on the latest work Orchard is doing then please follow us
            on our social media platforms.
          </p>
          <SocialLinks items={SOCIAL} className="mt-8" linkClassName={SOCIAL_LINK} />
        </TextWithFigure>
      </PageSection>

      <PageSection heading="From The Blog">
        <ArticleCards
          headingLevel={3}
          articles={posts.docs}
          basePath="/blog"
          className="md:grid-cols-3"
          accents={['#00655C', '#00655C']}
          showImages={false}
          placeholder={false}
        />
        <div className="mt-12 flex flex-col items-start gap-6 rounded-lg bg-brand-deep px-9 py-7 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <Photo
            file="2022-04-Registry-socials-copy-2.png"
            alt="The two speakers on the webinar title card"
            sizes="(min-width: 768px) 144px, calc(100vw - 6rem)"
            className="aspect-video w-full rounded object-cover object-top md:w-36"
          />
          <h3 className="flex-1 text-lg font-semibold text-white">
            Our latest Webinar: Everything you need to know about OCD
          </h3>
          <ButtonLink href="https://www.youtube.com/watch?v=6x59KTFuRZ4" variant="light">
            Watch Now
          </ButtonLink>
        </div>
      </PageSection>

      <PageSection heading={NEWSLETTER.heading} tone="strong">
        <TextWithFigure
          figure={
            <div className="w-full max-w-sm">
              <Photo
                file="2022-03-Group14629.svg"
                alt="An open envelope with an Orchard OCD letter inside"
                sizes="(min-width: 57rem) 24rem, calc(100vw - 3rem)"
                className="rounded-none"
              />
            </div>
          }
        >
          <p className={DARK_LEAD}>{NEWSLETTER.body}</p>
          <ButtonLink href={NEWSLETTER.signupUrl} variant="light" className="mt-8">
            {NEWSLETTER.ctaLabel}
          </ButtonLink>
        </TextWithFigure>
      </PageSection>
    </>
  )
}
