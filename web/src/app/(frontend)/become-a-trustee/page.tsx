import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Become A Trustee',
}

export default function BecomeATrusteePage() {
  return (
    <>
      <PageBanner title="Become A Trustee" eyebrow="Get Involved" />

      <PageSection heading="Trustee Job Description">
        <Prose>
          <dl>
            <dt>Position</dt>
            <dd>Trustee</dd>
            <dt>Organization</dt>
            <dd>Orchard OCD</dd>
            <dt>Location</dt>
            <dd>Remote (with occasional in-person meetings)</dd>
            <dt>Time Commitment</dt>
            <dd>Approximately 3-6 hours per month</dd>
          </dl>
        </Prose>
      </PageSection>

      <PageSection heading="About Orchard OCD" tone="mist">
        <Prose>
          <p>
            Orchard OCD is a UK charity dedicated to advancing research and developing innovative
            treatments for obsessive-compulsive disorder (OCD). Our mission is to accelerate
            progress in OCD care, improve patient outcomes, and provide hope to those affected by
            this life- impacting condition. We work at the intersection of science, patient
            advocacy, and healthcare delivery to drive meaningful change.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Role Overview">
        <Prose>
          <p>
            As a Trustee, you will play a pivotal role in shaping the strategic direction of Orchard
            OCD and ensuring the charity achieves its mission. Trustees provide governance,
            oversight, and leadership, leveraging their skills and experience to guide the charity’s
            development and impact.
          </p>
          <p>
            This is an exciting opportunity to contribute to a growing organisation that aims to
            revolutionise the understanding and treatment of OCD through collaboration, innovation,
            and advocacy.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Key Responsibilities" tone="ruled">
        <Prose>
          <h3>1. Strategic Leadership</h3>
          <ul>
            <li>
              Contribute to the development and implementation of the charity’s strategic goals and
              objectives.
            </li>
            <li>
              Provide oversight and ensure Orchard OCD remains aligned with its mission and values.
            </li>
          </ul>

          <h3>2. Governance</h3>
          <ul>
            <li>
              Ensure compliance with legal, regulatory, and ethical requirements, including those
              set by the Charity Commission.
            </li>
            <li>Monitor financial performance and ensure resources are managed effectively.</li>
          </ul>

          <h3>3. Advocacy and Networking</h3>
          <ul>
            <li>
              Act as an ambassador for Orchard OCD, representing the charity at events and with
              stakeholders.
            </li>
            <li>
              Leverage personal and professional networks to build relationships with funders,
              researchers, and partners.
            </li>
          </ul>

          <h3>4. Support and Oversight:</h3>
          <ul>
            <li>
              Provide guidance to the leadership team, including the CEO, ensuring effective
              management and decision-making.
            </li>
            <li>Contribute to fundraising initiatives, grant applications, and partnerships.</li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="Person Specification" tone="mist">
        <Prose>
          <p>
            We are seeking individuals who are passionate about mental health and committed to
            advancing research and care for OCD. Ideal candidates will have experience in one or
            more of the following areas:
          </p>
          <ul>
            <li>Research, particularly in mental health, neuroscience, or psychiatry.</li>
            <li>Healthcare, clinical practice, or patient advocacy.</li>
            <li>Charity governance, fundraising, or nonprofit leadership.</li>
            <li>Lived experience of OCD</li>
            <li>Legal, financial, or compliance expertise.</li>
            <li>Communications, marketing, or public relations.</li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="Key Attributes">
        <Prose>
          <ul>
            <li>Strong strategic thinking and decision-making skills.</li>
            <li>A collaborative mindset and ability to work effectively in a team.</li>
            <li>Excellent communication and interpersonal abilities.</li>
            <li>Commitment to Orchard OCD’s mission and values.</li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="What We Offer" tone="ruled">
        <Prose>
          <ul>
            <li>
              The opportunity to contribute to transformative change in the field of mental health.
            </li>
            <li>The chance to work with a passionate and dedicated team.</li>
            <li>
              Personal and professional development through meaningful contributions to a growing
              charity.
            </li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="How to Apply" tone="mist">
        <Prose>
          <p>
            If you are interested in joining Orchard OCD as a Trustee, please send your CV and a
            brief statement (maximum 500 words) outlining your interest and how your skills align
            with the role to Dr Nick Sireau, Chair,{' '}
            <a href="mailto:nick@orchardocd.org">nick@orchardocd.org</a>
          </p>
          <p>
            <strong>Deadline :</strong> 20 th January 2025
          </p>
          <p>
            For more information about Orchard OCD, visit{' '}
            <a href="https://www.orchardocd.org/">www.orchardocd.og</a>
          </p>
          <p>
            Orchard OCD is committed to diversity and inclusion. We welcome applications from
            individuals of all backgrounds and experiences.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
