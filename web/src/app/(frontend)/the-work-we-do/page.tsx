import type { Metadata } from 'next'
import Link from 'next/link'

import { PageBanner, PageSection, Prose } from '@/components/site'
import { REGISTRY_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'The work we do',
  description:
    'Orchard OCD is a registered charity that works to accelerate the development of new and better treatments for obsessive-compulsive disorder.',
}

export default function TheWorkWeDoPage() {
  return (
    <>
      <PageBanner title="The work we do">
        <p>
          Orchard OCD is a registered charity that works to accelerate the development of new and
          better treatments for obsessive-compulsive disorder. Our vision is a world where all
          patients suffering with OCD receive effective treatment for their condition.
        </p>
      </PageBanner>

      <PageSection label="Introduction">
        <Prose>
          <p>
            Orchard’s team consists of a board of trustees and a scientific advisory board with many
            experienced professionals with a passion for health care and mental health.
          </p>
          <p>
            We also aim to spread awareness around OCD, and we run OCD{' '}
            <Link href="/webinars">webinars</Link> in partnership with the charity{' '}
            <a href="https://www.madeofmillions.com/">Made of Millions</a>, hosted by Orchard OCD
            trustee &amp; journalist, Sean Fletcher.
          </p>
          <p>Our current funded research projects include:</p>
        </Prose>
      </PageSection>

      <PageSection heading="Psilocybin:" tone="mist">
        <Prose>
          <p>
            According to a research project in 2006, psilocybin has been reported to significantly
            reduce OCD symptoms in OCD patients. Despite positive results, no further research has
            been carried out due to lack of funding. Orchard OCD collaborated with Professor David
            Nutt, <a href="https://www.imperial.ac.uk/">Imperial College London</a>, and Professor
            Naomi Fineberg, <a href="https://www.newqeii.info/">Queen Elizabeth II Hospital</a>, to
            run a pilot clinical trial using psilocybin to treat OCD. We raised £60,000 from a{' '}
            <a href="https://www.chuffed.org/project/orchardocd#/">crowdfunding campaign</a> in 2020
            which was match funded by a foundation. The study has now started and will last 18
            months, recruiting and following up 15 patients.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Transcranial Direct Current Stimulation (TDCS):">
        <Prose>
          <p>
            We received funding for our second research project in September 2020. Research at the{' '}
            <a href="https://www.herts.ac.uk/">University of Hertfordshire</a> involves working on a
            promising new treatment that involves passing a small, almost imperceptible electric
            current into brain areas connected to OCD. This may help people with OCD think and
            behave differently and could help treatments work better.
          </p>
        </Prose>
      </PageSection>

      <PageSection
        heading="Double-Blind Randomised Placebo-controlled study of Tolcapone for OCD:"
        tone="mist"
      >
        <Prose>
          <p>
            Tolcapone is currently used to manage Parkinson’s disease. A team at the{' '}
            <a href="https://www.uchicago.edu/">University of Chicago</a> have test tolcapone out in
            a pilot study and found it improved OCD symptoms. They will test this drug out on
            patients for 8 weeks to see whether it improved OCD symptoms. 60 individuals with OCD
            will be recruited and will receive 100mg of Tolcapone twice per day against a placebo
            group. This will then be increased to 200mg twice daily at week two. This study is due
            to start in 2023 and will last 24 months in total including publicising the results.
          </p>
          <p>
            Find out more <Link href="/blog/call-for-proposals-2022">here</Link>.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="OCD Registry">
        <Prose>
          <p>
            Orchard OCD is very pleased to be receiving funding from the{' '}
            <a href="https://www.ballysfoundation.org/">Bally’s Foundation</a> for a two-year
            project to build an international registry of OCD patients.
          </p>
          <p>
            Registries are crucially important for medical research as they can accelerate
            recruitment into clinical trials of potential treatments and increase our understanding
            of a disorder such as OCD by asking patients to report their symptoms and current
            treatments.
          </p>
          <p>
            If you would like to participate in our registry then please click{' '}
            <a href={REGISTRY_URL}>here</a>.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
