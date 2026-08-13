import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

import { PeopleSections } from '@/components/content/PeopleSections'
import { Figure, PageBanner, PageSection, Prose, TextWithFigure } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About Orchard',
  description:
    'We built a community of interdisciplinary professionals and work with them closely to progress together in developing new and better treatments for patients suffering from OCD.',
}

const IMPACT_REPORT =
  'https://www.orchardocd.org/wp-content/uploads/2022/06/Orchard-2021-Impact-Report.pdf'

const PILLAR_SIZES = '(min-width: 57rem) 22rem, (min-width: 768px) 40rem, calc(100vw - 3rem)'

function Pillar({
  file,
  alt,
  heading,
  children,
}: {
  file: string
  alt: string
  heading: string
  children: ReactNode
}) {
  return (
    <li className="flex flex-col gap-5">
      <Figure file={file} alt={alt} sizes={PILLAR_SIZES} className="flow:h-80" />
      <h3 className="text-xl font-bold text-brand-link">{heading}</h3>
      <div className="text-base leading-relaxed text-body">{children}</div>
    </li>
  )
}

export default function AboutOrchardPage() {
  return (
    <>
      <PageBanner
        title="About Orchard"
        image="2022-08-about-orchard-banner-img.svg"
        imageAlt="Two hands lifting a lime green heart carrying the Orchard OCD logo"
      >
        <p>
          At Orchard, we believe that breakthrough happens when collaboration and information
          exchange is granted.
        </p>
        <p>
          In order to facilitate and foster an open and collaborative platform, we built a community
          of interdisciplinary professionals and work with them closely to progress together in
          developing new and better treatments for patients suffering from OCD.
        </p>
      </PageBanner>

      <PageSection heading="About Orchard OCD">
        <Prose>
          <p>
            We built a community of interdisciplinary professionals and work with them closely to
            progress together in developing new and better treatments for patients suffering from
            OCD.
          </p>
        </Prose>
        <ul className="mt-8 grid gap-10 flow:grid-cols-3">
          <Pillar
            file="2022-03-Group12980.svg"
            alt="A brain in bloom forming one half of a heart"
            heading="Our Vision"
          >
            <p>
              is a world where all patients suffering from OCD receive effective treatment for their
              condition.
            </p>
          </Pillar>
          <Pillar
            file="2022-04-aboutorchard-img.svg"
            alt="A tangled line unravelling into a lit lightbulb"
            heading="Our Mission"
          >
            <p>
              is to build that world by advancing collaborative translational research and driving
              the quest for new and better treatments for OCD.
            </p>
          </Pillar>
          <Pillar
            file="2022-03-home-about.svg"
            alt="An arrow in the center of a target"
            heading="Our Goals"
          >
            <p>We have a three-pillar approach,</p>
            <ol className="mt-2 list-decimal pl-5">
              <li>Research (fund and run clinical trials)</li>
              <li>Hubs (OCD research database and repository)</li>
              <li>Dissemination (awareness campaigns and conferences)</li>
            </ol>
          </Pillar>
        </ul>
      </PageSection>

      <PageSection heading="2021 Impact Report" tone="ruled">
        <Prose>
          <p>
            We have been hard at work producing our first impact report. Please take a look below to
            find out what we got up to in 2021 and our impact on OCD research &amp; more.
          </p>
          <p>
            <a href={IMPACT_REPORT}>Download Report</a>
          </p>
        </Prose>
      </PageSection>

      <PeopleSections only={['team']} />

      <PageSection heading="The Work We Do">
        <TextWithFigure
          figure={
            <Figure
              file="2022-05-Group-14645.svg"
              alt="A person in profile between a staircase and a bridge"
            />
          }
        >
          <Prose>
            <p>
              <strong>Psilocybin</strong>: According to a research project in 2006, psilocybin has
              been reported to significantly reduce OCD symptoms in OCD patients. Despite positive
              results, no further research has been carried out due to lack of funding.
            </p>
            <p>
              Orchard collaborated with Professor David Nutt, Imperial College London, and Professor
              Naomi Fineberg, Queen Elizabeth II Hospital, to run a pilot clinical trial using
              psilocybin to treat OCD. We raised £60,000 from a crowdfunding campaign in 2020 which
              was match funded by a foundation. The study has now started and will last 18 months,
              recruiting and following up 15 patients.
            </p>
            <p>
              <strong>Transcranial Direct Current Stimulation (TDCS)</strong>: We received funding
              for our second research project in September 2020. Research at the University of
              Hertfordshire involves working on a promising new treatment that involves passing a
              small, almost imperceptible electric current into brain areas connected to OCD.
            </p>
          </Prose>
          <p className="mt-8">
            <ButtonLink href="/the-work-we-do" variant="secondary" detail="about the work we do">
              read more
            </ButtonLink>
          </p>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="Patients’ Involvement in Medical Research" tone="ruled">
        <Prose>
          <p>
            At Orchard OCD, we recognise that the advancement of medical research, particularly in
            the field of Obsessive-Compulsive Disorder (OCD), requires more than just scientific
            rigour – it demands the inclusion of those directly impacted by the condition. Founded
            by and led by individuals with OCD, our organisation is uniquely positioned to
            understand the profound importance of involving people with lived experience in the
            research process. We see these individuals not merely as participants but as invaluable
            partners whose insights are crucial for driving research towards outcomes that genuinely
            matter to those affected.
          </p>
          <p>
            Our commitment to patient involvement is woven into every stage of our research
            endeavours, from the initial conceptualisation of study designs to the final analysis
            and dissemination of findings. By engaging those with firsthand experience of OCD, we
            ensure that our research transcends theoretical exploration and is deeply rooted in the
            practical realities of living with the disorder. This approach helps us identify and
            prioritise the most pressing challenges faced by the OCD community, enabling us to focus
            on solutions that can make a tangible difference.
          </p>
          <p>
            Furthermore, involving patients in research fosters a sense of empowerment and ownership
            within the OCD community, as their voices and experiences directly influence the
            direction and relevance of the studies. This collaborative model not only enriches the
            research but also builds a stronger, more informed community that is actively engaged in
            the quest for better understanding and treatment of OCD.
          </p>
          <p>
            Through this inclusive and patient-centred approach, Orchard OCD is dedicated to making
            a lasting and meaningful impact on the field, ultimately striving to improve the lives
            of those affected by OCD. We believe that by working together with the OCD community, we
            can uncover insights that lead to a deeper understanding of the condition and,
            ultimately, more effective treatments.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Position Towards Animal Research" tone="ruled">
        <Prose>
          <p>
            Orchard OCD fully endorses the Association of Medical Research Charities (AMRC) position
            statement regarding the use of animals in research. As an organisation dedicated to
            improving patient lives and outcomes through rigorous research, we recognise the
            importance of employing various research methods, including the use of animals when
            necessary. All research approaches, including those involving animals, are vital in
            advancing our understanding and treatment of severe health conditions.
          </p>
          <p>
            We take the decision to fund medical research very seriously. We are committed to
            conducting high-quality research that is ethically justified, well-designed, and subject
            to rigorous expert review. The welfare of animals involved in research is of the utmost
            importance to us, and we fund only research adhering to high animal welfare standards,
            ensuring appropriate housing conditions and well-trained animal technologists.
          </p>
          <p>
            When funding animal research, we are guided by the principles of reduction, replacement,
            and refinement (3Rs), which are fundamental to humane animal research. We expect our
            applicants to actively employ these principles to improve animal welfare. Additionally,
            we are committed to openness and transparency, recognising that not everyone may be
            comfortable with the use of animals in research. We continuously review our funding
            practices and engage with the scientific community to promote better practices and the
            development of alternatives to animal research. We will fund animal research only if no
            valid alternative is pursuable.
          </p>
          <p>
            By endorsing the AMRC position statement, Orchard OCD aligns itself with the highest
            animal welfare and scientific integrity standards and reaffirms its commitment to
            conducting responsible and impactful research.
          </p>
        </Prose>
      </PageSection>

      <PeopleSections only={['scientific-advisory-board']} />

      <PageSection heading="Orchard’s Peer Review Process">
        <Prose>
          <p>
            At Orchard OCD, we are committed to a robust peer review process that aligns with the
            AMRC’s principles of expert review. We aim to ensure that the research applications we
            assess for funding undergo a rigorous and fair evaluation. Here is the peer review
            process that Orchard OCD follows:
          </p>
          <ul>
            <li>
              <strong>Proportionality:</strong> our review process seeks to be appropriate for the
              scale and significance of the research award. The expertise we seek to review
              applications aims to be as best as possible to provide relevant and effective
              evaluations. In cases where expertise is lacking in specific areas or for substantial
              funding requests, we will seek additional external expert reviews.
            </li>
            <li>
              <strong>Independence:</strong> we consider the advice provided by experts who are
              independent of Orchard OCD’s staff and trustees. This ensures an unbiased evaluation
              of research applications.
            </li>
            <li>
              <strong>Diversity:</strong> we actively seek recommendations from a diverse range of
              experts who possess relevant knowledge or experience. We aim to include experts who
              reflect various perspectives and stakeholder views, and we also consider diversity
              regarding gender, ethnicity, and other relevant factors.
            </li>
            <li>
              <strong>Rotation:</strong> Orchard OCD is committed to implementing a rotation system
              to involve different experts in the decision-making process regarding research
              funding. This practice allows for the inclusion of fresh ideas and new perspectives,
              ensuring that a wide range of voices is considered. However, we recognise that the
              pool of experts specialising in OCD is more limited compared to other psychiatric
              conditions. Consequently, it is only sometimes possible to completely renew the
              composition of our research review committee(s). To address this, we are fortunate to
              have OCD world-leading experts who serve as an “ever-green” point of reference for our
              charity. Their ongoing involvement provides invaluable continuity and expertise,
              helping to guide our research strategy with their deep understanding of the field.
              While we strive to periodically review and update our committee composition, these
              experts remain a steadfast and essential component of our research review process.
            </li>
            <li>
              <strong>Impartiality:</strong> we developed and routinely adhere to a{' '}
              <Link href="/our-coi-policy">Conflicts-Of-Interest (COI) Policy</Link> specific to
              research funding. This policy clearly outlines the types of conflicts that may arise
              and specifies the actions conflicted experts should take to avoid influencing funding
              decisions.
            </li>
            <li>
              <strong>Transparency:</strong> Orchard OCD is committed to transparency in our
              research funding decisions. We published our research strategy and expert review
              process online, allowing external audiences to understand our rigorous methods. We
              also disclose the names of the experts involved in the decision-making process,
              recognising their valuable contributions. Additionally, we will transparently
              communicate our approach to using animals in research, considering the 3Rs (reduction,
              replacement, and refinement) through expert review.
            </li>
          </ul>
          <p>
            By implementing the above peer review process, Orchard OCD seeks to uphold the highest
            evaluation, integrity, and transparency standards in its research funding decisions.
            This process will ensure we effectively identify and support impactful research projects
            aligning with our mission of advancing understanding and treating OCD.
          </p>
        </Prose>
      </PageSection>

      <PeopleSections only={['partners', 'ambassadors']} />

      <PageSection label="Our research network" tone="ruled">
        <TextWithFigure
          figure={
            <Figure
              file="2022-06-download.png"
              alt="National Institute for Health Research"
              href="https://www.nihr.ac.uk/"
            />
          }
        >
          <Prose>
            <p>
              Orchard is a{' '}
              <a href="https://www.nihr.ac.uk/">National Institute for Health Research (NIHR)</a>{' '}
              non–commercial Partner. This means the studies that we fund may be eligible to access
              the NIHR Study Support Service which is provided by the NIHR Clinical Research
              Network.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>
    </>
  )
}
