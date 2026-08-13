import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Our COI Policy',
  description:
    'By adopting the present conflict-of-interest (COI) policy, Orchard OCD ensures that its funding decisions are made fairly, transparently, and without any undue influence.',
}

const POLICY_PDF =
  'https://www.orchardocd.org/wp-content/uploads/2024/08/Orchard_Conflict_of_Interest_policy-1.pdf'

const CLAUSE_LIST_CLASSES = '[&_ol_ol]:mb-0 [&_ol_ol_ol]:mb-0 [&_ol_ol_ol]:list-[lower-alpha]'

export default function CoiPolicyPage() {
  return (
    <>
      <PageBanner title="Our Conflict of Interest Policy" />

      <PageSection heading="Orchard OCD Funding Conflict of Interest Policy">
        <Prose>
          <p>
            By adopting the present conflict-of-interest (COI) policy, Orchard OCD ensures that its
            funding decisions are made fairly, transparently, and without any undue influence. More
            specifically, the reason for regulating conflicts of interest is to ensure that
            secondary interests do not subvert or unduly influence any of the organisation’s
            decisions and actions concerning Orchard’s primary interests and do not compromise trust
            in the organisation.
          </p>
          <p>
            This policy relates to all committees and funding panels of Orchard OCD, their chairs,
            and other members, including trustees.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="1. Elements of a conflict of interest" tone="ruled">
        <Prose>
          <p>
            <strong>Main/primary interest(s):</strong> these are Orchard OCD’s purpose and goals,
            that is, funding and conducting innovative scientific research to identify and develop
            new and better treatments for OCD, with the ultimate goal of making possible a world
            where all individuals with the disorder can access timely and effective treatment for
            their condition. Orchard OCD also aims to raise awareness around OCD and its impact on
            people with the condition and society, making the scientific community and the public
            aware of the importance of learning about it.
          </p>
          <p>
            <strong>Secondary interest(s):</strong> they may include financial gain, the desire for
            professional advancement, and recognition for personal achievement. Most secondary
            interests, including economic interests, are—within limits—legitimate and even desirable
            goals. The secondary interests are disagreeable only when they have greater weight than
            the primary interest in professional decision-making. For example, for a member of
            Orchard OCD’s Scientific Advisory Board (SAB), a secondary interest may arise when
            someone by whom they have financial or professional returns submits a project proposal
            to Orchard OCD.
          </p>
          <p>
            <strong>The conflict itself:</strong> a conflict of interest exists when a particular
            individual or institution is influenced by one or more secondary interests. It is not an
            occurrence in which primary interests are necessarily compromised but, rather, a set of
            circumstances or relationships that lead to or increase the risk that the primary
            interests will be neglected due to the pursuit of secondary interests.
          </p>
          <p>
            Considering the above, a conflict of interest is a set of circumstances that creates a
            risk that a secondary interest will unduly influence professional judgment or actions
            regarding one or more primary interests. Within Orchard OCD, this translates in
            situations where an individual trustee’s, employee’s, or volunteer’s personal,
            professional, or financial interests interfere with their ability to make impartial
            decisions in the best interest of the charity or when, driven by secondary interests,
            they engage in activities which may potentially affect Orchard OCD adversely.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="2. Conflict of Interest Assessment" tone="mist">
        <Prose className={CLAUSE_LIST_CLASSES}>
          <p>
            Within Orchard OCD, a conflict-of-interest assessment will be performed anytime relevant
            decisions are to be made about scientific research funding.
          </p>
          <ol>
            <li>
              <strong>Declaration:</strong> At the beginning of each SAB meeting involving a project
              evaluation and consideration for funding, a COI declaration form will be completed,
              signed, and submitted by each SAB member, trustee, and staff member.
            </li>
            <li>
              <strong>Identification:</strong> The early identification of conflict of interest is
              crucial to ensuring that any potential conflict of interest does not prevent SAB
              members and trustees from making decisions only in the best interests of Orchard OCD.
              All SAB and staff members, as well as the trustee body, must be able to identify any
              potential conflict of interest at an early stage to avoid putting themselves in a
              position where their duty to act in the best interests of Orchard OCD could conflict
              with any personal interest they may have. Therefore, the charity will train all its
              SAB and staff members, trustees, and volunteers on the content of the current policy,
              which will be reviewed, if necessary, every two years. Furthermore, since social
              science research suggests that, in some cases, secondary-interests-related influence
              may operate on decision-making processes without an individual being conscious of it,
              a third neutral party will annually evaluate the presence of any kind of COI among SAB
              and staff members, trustees, and affiliated professionals and volunteers. These
              documents will then be shared with the SAB Chair and Vice Chair, the staff, and
              Orchard’s CEO so they know the potential conflicts their colleague(s) might have and
              can act as outlined in the present document.
            </li>
            <li>
              <strong>Measurement:</strong> Conflicts of interest are often not binary; that is,
              they are not merely present or absent. They can be more or less severe. The severity
              of a conflict of interest depends on (1) the likelihood that a secondary interest
              would unduly influence professional decisions made under the relevant circumstances
              and (2) the seriousness of the harm or wrong that could result from such influence.
              The criterion of proportionality in conflict-of-interest policies provides that the
              expected benefits of a relationship may be considered, and conflicts of interest may
              be allowed to continue if those benefits outweigh the risks and safeguards instituted.
              <ol>
                <li>
                  <strong>Likelihood of undue influence:</strong> The measurement of the likelihood
                  of undue influence on the interested member’s decision-making process will be
                  guided by the following questions:
                  <ol>
                    <li>What is the value of the secondary interest?</li>
                    <li>What is the scope of the relationship?</li>
                    <li>What is the extent of discretion?</li>
                  </ol>
                </li>
                <li>
                  <strong>Potential Harm Seriousness:</strong> The measurement of the seriousness of
                  possible harm to Orchard OCD’s primary interests deriving from a member’s
                  secondary interest will be guided by the following questions:
                  <ol>
                    <li>What is the value of the primary interest?</li>
                    <li>What is the scope of the consequences?</li>
                    <li>What is the extent of accountability?</li>
                  </ol>
                </li>
              </ol>
            </li>
          </ol>
        </Prose>
      </PageSection>

      <PageSection heading="3. Conflict of Interest Management">
        <Prose>
          <ol>
            <li>
              <strong>Disclosure:</strong> All individuals involved in the funding decision-making
              process, including trustees, advisors, staff members, and volunteers, must disclose
              any potential conflicts of interest before the discussion about the funding decision
              begins or during the meeting as soon as a potential conflict becomes apparent. This
              includes any financial, personal, or professional direct or indirect relationships
              that may influence their decision-making. In cases where an individual is uncertain
              whether a conflict of interest exists, they should report this to nominated trustees.
              The trustees shall discuss the matter with the individual as necessary and report to
              the Chair, who will decide on a course of action. Orchard OCD will assess all
              potential conflicts of interest to determine their impact on the funding decision.
              This process will follow the procedure outlined in section 2 (i.e., Conflict of
              Interest Assessment) of the present document.
            </li>
            <li>
              <strong>Prevention:</strong> Following the COI assessment procedure, if a
              member&apos;s potential conflict might negatively impact decision-making or their
              loyalty to the charity, specific steps are taken to safeguard the integrity of the
              decision-making process.
            </li>
          </ol>
          <p>
            If a member has a potential conflict, they may be asked to distance themselves from
            certain activities or discussions related to the conflict. However, Orchard OCD also
            values the expertise of its members. In situations where a member has unique knowledge
            that would benefit the board or staff, they might be allowed to share pertinent
            information. Still, they would be expected to exit the meeting before any in-depth
            discussion or vote on the conflicting topic. Any discussion records related to the
            conflict will be excluded from the member&apos;s documents.
          </p>
          <p>
            The protocol also covers specific scenarios. For example, if a panel chair has a vested
            interest in a grant application, they are expected to declare that interest. They would
            then recuse themselves from the relevant meetings, allowing a vice chair to oversee
            proceedings to ensure no undue influence. If a committee member is approached by someone
            applying for technical advice on an application, while they can provide guidance, they
            are obliged to report this interaction to the committee chair.
          </p>
          <p>
            Additionally, members in positions that might be seen as in direct competition with an
            applicant or those who have had professional interactions with an applicant within the
            last five years need to declare their interest. Depending on the severity of the COI,
            they might be asked to withdraw from the meeting entirely or may be allowed to remain
            but not vote.
          </p>
          <p>
            Orchard OCD understands that most conflicts are specific to a particular issue and
            don&apos;t typically lead to lasting restrictions on a member’s involvement with the
            organization. However, in rare instances where major conflicts might jeopardize a
            member&apos;s position, the case will be referred to the entire committee, whose
            decision should be taken as final. If there&apos;s uncertainty about whether a conflict
            exists, the individual should consult with nominated trustees. The trustees will then
            communicate with the Chair for a final decision.
          </p>
        </Prose>
      </PageSection>

      <PageSection label="Documentation and revisions" tone="ruled">
        <Prose>
          <p>
            <strong>N.B.:</strong> Documentation is paramount. Orchard OCD maintains comprehensive
            records of all potential and actual conflicts, which can be accessed through our
            register of interests. Transparency is a cornerstone of our approach, with a commitment
            to clearly communicating the conflict-of-interest policy and the steps taken to mitigate
            potential conflicts to all stakeholders.
          </p>
          <p>
            This document is subject to revisions and updates as deemed necessary by Orchard OCD.
          </p>
        </Prose>
      </PageSection>

      <PageSection label="Conflict of interest policy document" tone="mist">
        <Prose>
          <p>
            <a href={POLICY_PDF}>Orchard OCD Funding Conflict of Interest Policy (PDF)</a>
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
