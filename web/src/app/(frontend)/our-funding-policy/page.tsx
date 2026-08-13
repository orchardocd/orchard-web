import type { Metadata } from 'next'
import Link from 'next/link'

import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Our Funding Policy',
  description:
    'Orchard OCD Funding Policy outlines the organisation’s approach to financially support research projects dedicated to better understanding, managing, and treating Obsessive-Compulsive Disorder (OCD).',
}

const POLICY_URL =
  'https://www.orchardocd.org/wp-content/uploads/2024/08/Orchard_Funding_Policy_doc.pdf'

export default function FundingPolicyPage() {
  return (
    <>
      <PageBanner title="Our Funding Policy" />

      <PageSection heading="1. Introduction:">
        <Prose>
          <p>
            Orchard OCD Funding Policy outlines the organisation’s approach to financially support
            research projects dedicated to better understanding, managing, and treating
            Obsessive-Compulsive Disorder (OCD). The funding avenues available at Orchard OCD are
            primarily through Calls for Proposals (CFPs) and Collaborations with Academics, as we
            explain in this document.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="2. Objectives:" tone="mist">
        <Prose>
          <ol>
            <li>To promote cutting-edge research in the field of OCD.</li>
            <li>
              To encourage interdisciplinary collaboration among researchers, academics, and Orchard
              OCD.
            </li>
            <li>To ensure transparency, efficiency, and fairness in the allocation of funds.</li>
          </ol>
        </Prose>
      </PageSection>

      <PageSection heading="3. Funding Routes:">
        <Prose>
          <h3>3.1. Calls for Proposals (CFPs):</h3>

          <h4>Objective:</h4>
          <p>
            Orchard OCD periodically releases Calls for Proposals, inviting researchers and
            organisations worldwide to submit their innovative OCD-related projects.
          </p>

          <h4>Process:</h4>
          <ol>
            <li>
              <strong>Announcement:</strong> A Call for Proposals will be announced on the{' '}
              <Link href="/">Orchard OCD website</Link>, social media platforms, and relevant
              research forums.
            </li>
            <li>
              <strong>Submission:</strong> Applicants will submit their proposals through the
              specified online portal or as directed.
            </li>
            <li>
              <strong>Review:</strong> Proposals will undergo a rigorous peer review process by a
              panel of experts, i.e., the Orchard&apos;s Scientific Advisory Board (SAB).
            </li>
            <li>
              <strong>Selection:</strong> Successful proposals will be selected based on key
              criteria, i.e., relevance, innovation, applicant’s track record, feasibility, and
              potential impact.
            </li>
          </ol>

          <h4>Eligibility:</h4>
          <ol>
            <li>
              Researchers, academics, institutions, or teams with a proven track record in relevant
              fields.
            </li>
            <li>
              Proposals should align with{' '}
              <Link href="/the-work-we-do">Orchard OCD’s research priorities</Link>.
            </li>
            <li>
              Must adhere to ethical guidelines and demonstrate respect for patient confidentiality
              and rights.
            </li>
          </ol>

          <h4>Funding Allocation:</h4>
          <ul>
            <li>
              The maximum and minimum funding limits will be specified in each Call for Proposals.
            </li>
            <li>
              Funding will be released in phases or milestones based on the project&apos;s progress.
            </li>
          </ul>

          <h3>3.2. Collaborations with Academics:</h3>

          <h4>Objective:</h4>
          <p>
            To establish partnerships with academic institutions, professors, and researchers to
            jointly develop and execute research projects.
          </p>

          <h4>Process:</h4>
          <ol>
            <li>
              <strong>Identification:</strong> Orchard OCD identifies potential collaborators or
              institutions based on their work and reputation. Requests or enquiries for
              collaboration by academic and research institutions, professors, and departments are
              also welcomed.
            </li>
            <li>
              <strong>Outreach:</strong> Orchard OCD approaches the potential collaborator for a
              partnership, or the potential collaborator approaches Orchard OCD.
            </li>
            <li>
              <strong>Discussion:</strong> Both parties discuss the project’s scope, objectives, and
              modalities of the collaboration.
            </li>
            <li>
              <strong>Agreement:</strong> Once a consensus is reached, a formal collaboration
              agreement is signed.
            </li>
            <li>
              <strong>Funding Application:</strong> Orchard OCD and its partner work together to
              apply for funding from a third party, i.e., research funding bodies such as the
              Medical Research Council (MRC), the National Institute for Health and Care Research
              (NIHR), the Wellcome, the Economic and Social Research Council (ESRC), or any other
              relevant body.
            </li>
          </ol>

          <h4>Eligibility:</h4>
          <ol>
            <li>
              Recognised academic and research institutions, departments, and researchers with
              expertise in OCD or related fields.
            </li>
            <li>Willingness to co-share resources, data, results, and authorship.</li>
          </ol>

          <h4>Funding Allocation:</h4>
          <ul>
            <li>
              Funding will be determined based on the project’s needs and the terms of the
              collaboration agreement.
            </li>
            <li>
              Release of funds will be milestone-based or as agreed upon in the collaboration
              agreement.
            </li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="4. Monitoring and Reporting:" tone="mist">
        <Prose>
          <p>For both funding routes, recipients are required to:</p>
          <ol>
            <li>Provide regular progress reports.</li>
            <li>Adhere to Orchard OCD’s reporting guidelines and templates.</li>
            <li>Be open to periodic reviews and audits.</li>
          </ol>
        </Prose>
      </PageSection>

      <PageSection heading="5. Ethics and Compliance:">
        <Prose>
          <p>All funded projects should:</p>
          <ol>
            <li>Ensure the highest ethical standards in research.</li>
            <li>Prioritise patient safety, dignity, and rights.</li>
            <li>Comply with local and international research regulations.</li>
          </ol>
        </Prose>
      </PageSection>

      <PageSection heading="6. Conclusion:" tone="mist">
        <Prose>
          <p>
            Orchard OCD is committed to advancing research in the field of OCD through its two
            primary funding avenues. We invite all eligible researchers and institutions to engage
            with us in our endeavour to uncover new knowledge and create a positive impact in the
            OCD community.
          </p>
          <p>
            For any queries related to the funding policy, please contact{' '}
            <a href="mailto:margherita@orchardocd.org">margherita@orchardocd.org</a> or visit our{' '}
            <Link href="/">website</Link>.
          </p>
          <p>
            This document is subject to revisions and updates as deemed necessary by Orchard OCD.
          </p>
        </Prose>
      </PageSection>

      <PageSection label="Funding policy document" className="py-10 md:py-12">
        <Prose>
          <p>
            <a href={POLICY_URL}>Download the Funding Policy (PDF)</a>
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
