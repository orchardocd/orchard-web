import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Work With Us',
}

export default function WorkWithUsPage() {
  return (
    <>
      <PageBanner title="Work With Us" />

      <PageSection heading="Fundraising Officer">
        <Prose>
          <p>
            <strong>Position:</strong> £14,000
          </p>
          <p>
            <strong>Status</strong> : Part time
          </p>
          <p>
            <strong>Reports to</strong> : Head of Fundraising and Communications
          </p>
          <p>
            <strong>Based</strong> : Remote
          </p>
          <p>
            <strong>Hours </strong> : 20.5/week
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="About Orchard OCD" tone="mist">
        <Prose>
          <p>
            Orchard OCD is a UK-based charity dedicated to advancing research and treatment for
            obsessive- compulsive disorder (OCD), focusing on innovative solutions to improve the
            lives of those affected by the condition.
          </p>
          <p>
            The organization collaborates with researchers, people with live experience, and
            clinicians to support the development of novel OCD therapies, bridging the gap between
            scientific breakthroughs and patient care.
          </p>
          <p>
            Orchard OCD advocates for increased awareness and funding for OCD research, emphasizing
            the urgent need for better treatment options for this often-debilitating mental health
            disorder. With a mission rooted in hope and scientific progress, Orchard OCD empowers
            patients and families by offering education, support, and access to cutting-edge
            developments in OCD care.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="About this position">
        <Prose>
          <p>
            This exciting opportunity will allow you to raise and shape the profile of an innovative
            patient support charity. As the Fundraising Officer, you will be responsible for
            building upon years of successful fundraising. You will lead on applications to trusts
            and foundations, establishing new relationships with corporate partners, building our
            individual donor fundraising, managing the stewardship of existing partnerships and
            maintain our fundraising database. This role is vital to support the ground-breaking
            work of Orchard OCD
          </p>
          <p>
            You will also assist the Head of Head of Fundraising and Communications with the running
            of our social media channels, along with ongoing social media analytics, e-news mail
            outs and the writing on our website.
          </p>
          <p>
            This varied position will be ideal for someone who is looking to build upon fundraising
            experience and take their skills to the next level.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Responsibilities of the role" tone="ruled">
        <Prose>
          <p>The Fundraising Officer will work in the following areas:</p>

          <h3>Fundraising</h3>
          <p>
            Work with the Head of Fundraising and Communications on fundraising projects in four
            main categories
          </p>

          <h4>Trusts and foundations</h4>
          <ul>
            <li>Research and identify potential trusts and foundations</li>
            <li>Write and submit proposals to relevant trusts and foundations.</li>
            <li>
              Maintain relationships with grant-making bodies and assist the rest of the team with
              reports to existing funders.
            </li>
            <li>Maintain an up-to-date calendar for application deadlines.</li>
          </ul>

          <h4>Fundraising Events</h4>
          <ul>
            <li>Develop new ideas for events.</li>
            <li>Organise and run fundraising events.</li>
            <li>Work on new digital fundraising campaigns.</li>
          </ul>

          <h4>Individual donations</h4>
          <ul>
            <li>Build our donor base of individual donors.</li>
            <li>Develop online and offline fundraising.</li>
          </ul>

          <h4>Corporate fundraising</h4>
          <ul>
            <li>Research and identify potential corporate partners.</li>
            <li>
              Develop existing and pitch for new corporate relationships to maximise staff
              fundraising, Corporate Social Responsibility (CSR), gifts in kind and other forms of
              donated services.
            </li>
            <li>Work with companies to receive pro-bono support for the charity.</li>
          </ul>

          <h3>Individual Giving &amp; Managing the fundraising and patient database</h3>
          <ul>
            <li>
              Update records of past fundraising campaigns, donors and patient contact information.
            </li>
            <li>Use the database to generate new funding from historic supporters.</li>
            <li>
              Maintain stewardship of new individual givers and continue stewardship with regular
              givers.
            </li>
          </ul>

          <h3>Communications</h3>
          <ul>
            <li>
              Be the social media expert, monitoring and developing a presence on Facebook,
              Instagram and other sites as required. Use AI to support this work. Work with the Head
              of Fundraising and Communications to produce blogs, and e-newsletters to promote our
              work.
            </li>
            <li>
              Work closely with other team members in dissemination and promotion of their projects.
            </li>
            <li>
              Work with the trustees and patients to collect patient, carer and family stories for
              use in Orchard OCD’s dissemination.
            </li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="Benefits" tone="mist">
        <Prose>
          <ul>
            <li>4% pension contribution.</li>
            <li>25 days holiday per year, plus 8 bank holiday days.</li>
            <li>On the job training and external training provided.</li>
            <li>Exposure to all aspects of charity work through varied role.</li>
            <li>
              Frequent opportunities to meet with people with lived experience and other
              beneficiaries, to experience first-hand the impact of Orchard OCD.
            </li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="Person Specification – qualifications/ knowledge/experience">
        <Prose>
          <h3>Essential</h3>
          <ul>
            <li>
              Interpersonal skills – communicates clearly &amp; works well as a part of a varied
              team. Experience in fundraising.
            </li>
            <li>Excellent IT literacy.</li>
            <li>Excellent social media skills.</li>
            <li>Basic understanding of social media analytics and good practice.</li>
            <li>Excellent written and verbal communication skills.</li>
            <li>Ability to handle multiple tasks and prioritise workload.</li>
          </ul>

          <h3>Desirable</h3>
          <ul>
            <li>Understanding/experience of working in the non-profit or rare disease world.</li>
            <li>Copywriting skills.</li>
            <li>Basic understanding of medical research terms &amp; processes.</li>
            <li>Basic understanding of design platforms e.g. Adobe Photoshop.</li>
            <li>Basic understanding of WordPress CMS.</li>
            <li>Basic understanding of CRM platforms</li>
          </ul>

          <p>
            Orchard OCD will support individuals who are able to show strong essential skills and
            passion to develop the desirable skills.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
