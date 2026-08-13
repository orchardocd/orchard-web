import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'By accessing this site, you agree to the following terms and conditions and other applicable laws. If you do not agree to be bound by these terms and conditions, please do not use this website.',
}

export default function TermsOfUsePage() {
  return (
    <>
      <PageBanner title="Terms of Use">
        <p>
          By accessing this site, you agree to the following terms and conditions and other
          applicable laws. If you do not agree to be bound by these terms and conditions, please do
          not use this website.
        </p>
      </PageBanner>

      <PageSection label="Terms and conditions">
        <Prose>
          <p>
            All the information and material provided on this web site is solely for illustrative
            purposes. It is not intended to, and does not create any business, contractual or
            employment relationship. All the information, content, text, images, html code,
            photography and graphics are the property of the Autolus, and may not be copied,
            reproduced, republished, posted, transmitted, or distributed in any way without our
            express, advance, written consent. All trademarks used or referred to in this site are
            the property of their respective owners.
          </p>
          <p>
            Links on this site may lead to services or external websites not operated by Autolus. No
            judgement or warranty is made with respect to such other services or sites and Autolus
            takes no responsibility for such other sites or services. A link to another site or
            service is not an endorsement of that site or service. Any use you make of the
            information provided on this site, or any site or service linked to by this site, is at
            your own risk. This site is provided “as is” and Autolus expressly disclaims all
            warranties of any kind, whether express or implied, including the warranties of
            merchantability and fitness for a particular purpose.
          </p>
          <p>
            In no event shall Autolus, or any of its employees or contractors, be liable for any
            damages whatsoever in connection with the information or material on this web site,
            including but not limited to actual, consequential, direct, exemplary, incidental,
            indirect, punitive or special damages.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
