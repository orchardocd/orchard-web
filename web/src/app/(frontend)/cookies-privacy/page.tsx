import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose } from '@/components/site'
import { getClient } from '@/lib/payload'

export const metadata: Metadata = {
  title: 'Cookies & Privacy',
  description:
    'Our Cookie Policy is intended to describe how your personal information is processed and used. Please note that by visiting our site you are accepting the practices described.',
}

const POLICY_FILE = '2022-06-Orchard-Privacy-Policy-1.pdf'

async function policyDocumentUrl() {
  const payload = await getClient()
  const found = await payload.find({
    collection: 'documents',
    where: { filename: { equals: POLICY_FILE } },
    depth: 0,
    limit: 1,
  })
  const url = found.docs[0]?.url
  if (!url) throw new Error(`No upload named "${POLICY_FILE}" in the documents collection`)
  return url
}

export default async function CookiesPrivacyPage() {
  const policy = await policyDocumentUrl()

  return (
    <>
      <PageBanner title="Cookies & Privacy">
        <p>
          Our Cookie Policy is intended to describe how your personal information is processed and
          used. Please note that by visiting our site you are accepting the practices described.
        </p>
      </PageBanner>

      <PageSection label="Privacy policy document" className="py-10 md:py-12">
        <Prose>
          <p>
            <a href={policy}>Orchard-Privacy-Policy-1</a>
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="VISITOR INFORMATION" tone="ruled">
        <Prose>
          <p>
            Every computer connected to the Internet is provided with a domain name and an IP
            Address. When a visitor requests a web page from within our website, our servers
            automatically identify and log the HTTP request that is made.
          </p>
          <p>
            This information reveals nothing personal about you. In fact, the only information that
            we automatically gather and log is as follows: the IP address of the site that may have
            referred you; your IP address; the web page that you may have linked to us from, if any;
            the product identifier for version and make of browser (e.g. Internet Explorer 8); the
            operating system platform that you may be running (e.g. Macintosh or Windows); search
            words or terms that are passed from a search engine (e.g. Google or Yahoo).
          </p>
          <p>
            We have has found it advantageous to examine visitor traffic so that we can ensure
            maximum compatibility for the various browsers and operating systems that visit our
            site. By analysing visitation patterns, referring URLs and search engine terms, we can
            strategically enhance our exposure across the Internet.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="COOKIES" tone="mist">
        <Prose>
          <p>
            When we provide services, we want to make them easy, useful and reliable. Where services
            are delivered on the internet, this sometimes involves placing small amounts of
            information on your device, for example, your computer or mobile phone. These include
            small files known as cookies. They cannot be used to identify you personally.
          </p>
          <p>
            These pieces of information are used to improve services for you through, for example:
          </p>
          <ul>
            <li>
              recognising that you may already have given a username and password so you don’t need
              to do it for every web page requested
            </li>
            <li>measuring how many people are using services so they can be made easier to use</li>
            <li>
              analysing anonymous data to help us understand how people interact with our website so
              we can make it better
            </li>
          </ul>
          <p>
            Learn how to{' '}
            <a href="http://www.aboutcookies.org/">remove cookies set on your device</a>
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="THIRD PARTY COOKIES">
        <Prose>
          <p>
            We use a number of suppliers who may also set cookies on their websites’ on its behalf.
            This website does not control the dissemination of these cookies. You should check the
            third party websites for more information about these.
          </p>
          <p>
            <strong>Provider</strong>: Google Analytics
          </p>
          <p>
            <strong>Name:</strong> _utma, _utmb, _utmc, _utmz
          </p>
          <p>
            <strong>Purpose:</strong> These cookies are used to collect information about how
            visitors use our site. We use the information to compile reports and to help us improve
            the site. The cookies collect information in an anonymous form, including the number of
            visitors to the site, where visitors have come to the site from and the pages they
            visited.
          </p>
          <p>
            <strong>More info:</strong>{' '}
            <a href="http://www.google.com/intl/en_uk/policies/privacy/">Google Privacy policy</a>
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="WHAT OTHER INFORMATION DO WE REQUEST?" tone="mist">
        <Prose>
          <p>
            We may also request your email address or mailing address for the purposes of conducting
            a survey or to add you to our mailing list, or by your request to have someone contact
            you for additional information. Whenever we request the identity of a visitor, we will
            clearly indicate the purpose of the inquiry before the information is requested.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="ANTI-SPAM POLICY">
        <Prose>
          <p>
            We enforce a strict ‘Anti-Spam’ policy that means we do not intend to sell, rent, or
            otherwise give your e-mail address to a third-party without your consent.
          </p>
          <p>
            In addition, we will not send you email that you have not agreed to receive. If you are
            a member of our mailing list, you may be contacted with announcements, news, portfolio
            additions, and new products or services.
          </p>
          <p>
            With each email sent, you have the option of ‘unsubscribing’ from our mailing list at
            any time, thereby disabling any further such email communication from being sent. If you
            wish to have specific communications with a member of our staff, you will be required to
            provide specific information that will be routed to the appropriate contact.
          </p>
          <p>
            Any changes to this Privacy Policy will be posted so that you are always aware of the
            information that we collect, how we use it, and under what circumstances we disclose it.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
