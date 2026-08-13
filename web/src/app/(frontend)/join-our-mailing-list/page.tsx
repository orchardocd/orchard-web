import type { Metadata } from 'next'
import Link from 'next/link'

import { NewsletterSignup } from '@/components/content/NewsletterSignup'
import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Join our mailing list',
  description:
    'Here at Orchard OCD, we are focusing on developing treatments for patients suffering from obsessive-compulsive disorder (OCD), a serious mental illness.',
}

export default function JoinOurMailingListPage() {
  return (
    <>
      <PageBanner
        title="Join our mailing list"
        image="2022-07-image2.png"
        imageAlt="An open envelope holding a card with the Orchard OCD logo"
      >
        <p>
          Here at Orchard OCD, we are focusing on developing treatments for patients suffering from
          obsessive-compulsive disorder (OCD), a serious mental illness. You can help us treat this
          debilitating disorder, through taking part in research, donating towards crowdfunding
          campaigns and promoting our work. All of this information will be sent to you through our
          E-News. Sign up today and you will be part of the future of OCD treatment.
        </p>
      </PageBanner>

      <PageSection label="Sign up for our E-News">
        <NewsletterSignup />
        <Prose className="mt-10">
          <p>
            The data you provide will be stored by Orchard OCD and on MailChimp. We won’t share your
            information with any other third parties and you can opt out at any time. Further
            information on our <Link href="/cookies-privacy">privacy policy can be found here</Link>
            .
          </p>
          <p>
            By subscribing to our newsletter, you are consenting to receive regular emails from
            Orchard OCD sharing our latest news, events and projects.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
