import type { Metadata } from 'next'
import Image from 'next/image'
import type { ReactNode } from 'react'

import { PageBanner, PageSection, Prose, Table } from '@/components/site'
import { cn } from '@/lib/cn'

export const metadata: Metadata = {
  title: 'Our Research Strategy',
  description:
    'The full Orchard OCD research strategy: the burden of OCD, the state of the science, the clinical and research challenges, and the seven work packages that make up our five-year plan.',
}

const STRATEGY_PDF_URL =
  'https://www.orchardocd.org/wp-content/uploads/2024/08/Orchard_Research_Strategy.pdf'

const DOC_PROSE = [
  '[&_h5]:mt-8 [&_h5]:mb-3 [&_h5]:text-base md:[&_h5]:text-lg [&_h5]:font-bold [&_h5]:text-brand-strong',
  '[&_h6]:mt-8 [&_h6]:mb-2 [&_h6]:text-base md:[&_h6]:text-lg [&_h6]:font-bold [&_h6]:text-ink',
  '[&_:is(h2,h3,h4,h5,h6)+:is(h5,h6)]:mt-4',
  '[&_ul_ul]:my-2 [&_ul_ol]:my-2 [&_ol_ol]:my-2 [&_ol_ul]:my-2',
  '[&_li_li+li]:mt-2',
  '[&_td_ul]:my-0 [&_td_ol]:my-0 [&_td_li+li]:mt-2',
].join(' ')

const FIGURE_SIZES = '(min-width: 768px) 40rem, calc(100vw - 3rem)'
const WIDE_FIGURE_SIZES = '(min-width: 1280px) 70.5rem, calc(100vw - 3rem)'
const PORTRAIT_SIZES = '10rem'

function DocFigure({
  file,
  alt,
  caption,
  width,
  height,
  wide = false,
}: {
  file: string
  alt: string
  caption?: string
  width: number
  height: number
  wide?: boolean
}) {
  return (
    <figure className={cn('my-8 w-full', wide ? undefined : 'max-w-measure')}>
      <div className="flex w-full items-center justify-center overflow-hidden rounded-lg bg-mist p-4 md:p-6">
        <Image
          src={`/strategy/${file}`}
          alt={alt}
          width={width}
          height={height}
          sizes={wide ? WIDE_FIGURE_SIZES : FIGURE_SIZES}
          style={{ maxWidth: `min(100%, ${width}px)` }}
          className="h-auto w-full rounded-lg"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-measure text-sm text-faint">{caption}</figcaption>
      ) : null}
    </figure>
  )
}

function Person({
  file,
  alt,
  width,
  height,
  children,
}: {
  file: string
  alt: string
  width: number
  height: number
  children: ReactNode
}) {
  return (
    <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start">
      <Image
        src={`/strategy/${file}`}
        alt={alt}
        width={width}
        height={height}
        sizes={PORTRAIT_SIZES}
        className="w-40 shrink-0 rounded-lg bg-mist"
      />
      <Prose className={cn(DOC_PROSE, 'flex-1')}>{children}</Prose>
    </div>
  )
}

const CONTENTS: { href: string; label: string; children?: { href: string; label: string }[] }[] = [
  { href: '#executive-summary', label: 'Executive Summary' },
  {
    href: '#overview-of-ocd',
    label: 'Overview of OCD',
    children: [
      { href: '#background', label: 'Background' },
      { href: '#social-and-economic-burden', label: 'Social and Economic burden of OCD' },
      { href: '#how-is-it-treated', label: 'OCD: How is it treated?' },
    ],
  },
  {
    href: '#about-orchard',
    label: 'About Orchard',
    children: [
      { href: '#vision-and-mission', label: 'Vision and Mission' },
      { href: '#orchards-activities', label: "Orchard's activities" },
      { href: '#wider-ocd-community', label: 'Orchard’s role in the wider OCD community' },
    ],
  },
  {
    href: '#current-state-of-ocd-research',
    label: 'Current state of OCD research',
    children: [
      { href: '#neural-basis-of-ocd', label: 'Neural basis of OCD' },
      { href: '#causation', label: 'Causation' },
      { href: '#animal-models', label: 'Animal models' },
      { href: '#mechanisms-of-existing-treatments', label: 'Mechanisms of existing treatments' },
    ],
  },
  {
    href: '#current-challenges',
    label: 'Current Challenges',
    children: [
      { href: '#clinical-challenges', label: 'Clinical Challenges' },
      { href: '#research-challenges', label: 'Research Challenges' },
    ],
  },
  { href: '#future-plan', label: 'Future Plan' },
  { href: '#work-package-1', label: 'Work Package 1: Consortium Programme' },
  {
    href: '#work-package-2',
    label: 'Work Package 2: Neurobehavioural Basis of Obsessive-Compulsive Disorder',
  },
  {
    href: '#work-package-3',
    label:
      'Work Package 3: Physical Exercise as an Anti-inflammatory intervention for Patients with Obsessive-Compulsive Disorder - a randomised, blinded, placebo-controlled pilot study (PEA-POD)',
  },
  { href: '#work-package-4', label: 'Work Package 4: Open Treatment Accelerator Programme' },
  {
    href: '#work-package-5',
    label:
      'Work Package 5: Smartphone app to improve cognitive flexibility and reduce contamination fears in OCD',
  },
  { href: '#work-package-6', label: 'Work Package 6: OCD Patient Registry' },
  {
    href: '#work-package-7',
    label:
      'Work Package 7: Proposal for a Randomised Double-blind Placebo-controlled study of Tolcapone for OCD',
  },
  { href: '#reference', label: 'Reference' },
  { href: '#appendix-1', label: 'Appendix 1 – The Team' },
  {
    href: '#appendix-2',
    label: 'Appendix 2 – Table of existing and experimental treatments for OCD',
  },
  { href: '#appendix-3', label: 'Appendix 3 - What the patients want' },
  { href: '#appendix-4', label: 'Appendix 4 - Existing research projects' },
  { href: '#appendix-5', label: 'Appendix 5 - Financial Projections' },
]

export default function ResearchStrategyPage() {
  return (
    <>
      <PageBanner title="Our Research Strategy" />

      <PageSection heading="Contents" id="contents" tone="mist">
        <nav aria-label="Research strategy contents">
          <Prose>
            <ul>
              {CONTENTS.map((entry) => (
                <li key={entry.href}>
                  <a href={entry.href}>{entry.label}</a>
                  {entry.children ? (
                    <ul>
                      {entry.children.map((child) => (
                        <li key={child.href}>
                          <a href={child.href}>{child.label}</a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
          </Prose>
        </nav>
      </PageSection>
      <PageSection heading="Executive Summary" id="executive-summary">
        <Prose className={DOC_PROSE}>
          <p>
            Orchard OCD is a not-for-profit medical charity that works with academia, clinicians,
            pharmaceutical/biotech companies, government agencies, patients and other charities.
            Orchard aims to fast-track the development of new and innovative treatments for
            obsessive-compulsive disorder (OCD) to deliver unique value for professionals and,
            ultimately, for patients suffering from OCD. Orchard OCD serves as a catalyst to create
            collaborative and multidisciplinary platforms in order to foster translational research
            and drive the quest for new and effective treatments for OCD.
          </p>
          <h3>Operating Principles</h3>
          <p>
            <strong>Unmet need</strong> OCD is a severely disabling mental health disorder. With
            2-3% of the world population affected (1m to 1.5m people in the UK alone). Existing
            treatments for OCD are unsatisfactory and inefficient in a large proportion of patients.
            Patients are left with out-dated medications initially developed for other mental health
            conditions, and 30%-40% of patients don’t respond to any available treatments. There is
            a significant unmet patient need and the Covid-19 pandemic has made this worse. It is
            reported that Covid-19 is associated with the clinical worsening of OCD severity, as
            well as the emergence of new obsessions and compulsions.
          </p>
          <p>
            <strong>Collaboration and partnership</strong> Orchard OCD fosters collaboration between
            research scientists, clinicians, pharmaceutical and biotech companies, government
            agencies and patients and has built an OCD research community (OCD-R-Us) of over 100
            people. The bridge between research scientists and clinicians on one side, and patients
            on the other is critical because it facilitates and runs research on OCD by bridging
            fundamental research and clinical practices and ensures future research programmes are
            grounded in patient experiences and unmet needs.
          </p>
          <p>
            <strong>Innovation catalyst</strong> With the strong backing of key professional
            national and international actors in OCD, Orchard OCD initiates, drives, supports, and
            funds activities in multidisciplinary translational research, clinical trials, drug
            development, dissemination, and scholarly activities to ensure on-going innovation in
            treatment development for OCD.
          </p>
          <p>
            <strong>Team</strong> We are experienced professionals (see appendix 1 – the team)
            driven by social impact and optimal solutions. We have complementary expertise in
            business and healthcare. Team members have backgrounds in neuroscience, R&amp;D, drug
            development, clinical trials, clinical psychiatry, charity development, fundraising and
            social enterprise.
          </p>
          <p>
            <strong>Opportunity</strong> OCD is under-researched, yet it has distinctive features
            that make it an excellent topic of study. Modern neuroscientific techniques – studying
            brain structure, genetics and receptors – provide an exceptional opportunity to
            significantly boost our ability to develop new treatments.
          </p>
          <p>
            <strong>Activities</strong> We focus on three key activities
          </p>
          <ol>
            <li>
              <strong>Research.</strong> Funding, facilitating, and running research on OCD.
            </li>
            <li>
              <strong>Hubs and Platforms.</strong> Sharing knowledge. Providing services and
              resources for research scientists and clinicians working on OCD.
            </li>
            <li>
              <strong>Engagement and dissemination.</strong> Raising awareness about the condition
              and communicating research results, treatments and translational science
              opportunities.
            </li>
          </ol>
          <p>
            <strong>Outcomes</strong> With a target budget of £4,246,127, we will carry out the
            following over the first five years:
          </p>
          <ol>
            <li>
              <strong>
                Annual pre-clinical/clinical studies of potential treatments identified by our
                consortium (one/year for the first three years, then two/year for years 4 and 5).
              </strong>{' '}
              These will answer the questions set out in ‘Future Plan - Objective A’, such as what
              is the role of immune function in OCD and can we successfully target immune function
              therapeutically; do novel psychological therapies work and how; what non-invasive
              neuro-stimulation is most successful (see’ Future Plan - Work Package 1’).
            </li>
            <li>
              <strong>
                A multi-disciplinary programme by our consortium to increase our understanding of
                the neuroscience of OCD (£500,000/year, 3 years).
              </strong>{' '}
              This will answer questions from the section ‘Future Plan - Objective A’, such as which
              neural networks are most affected in OCD; what is the role of animal models for
              treatment development in OCD; which neural circuitry is most important for targeting
              therapeutically? (see’ Future Plan - Work Package 2’)
            </li>
            <li>
              <strong>
                A project aims to understand physical exercise as an anti-inflammatory intervention
                for patients with OCD (£68,500 for the first year, £118,500 for the second year and
                £251,500 for the third year)
              </strong>{' '}
              (see’ Future Plan - Work Package 3’)
            </li>
            <li>
              <strong>
                An Open Treatment Accelerator Programme (one/year at £150,000/year for the first
                three years, then two/year for years 4 and 5).
              </strong>{' '}
              This will be open to any OCD researchers anywhere in the world in order to accelerate
              their development of potential new treatments (see’ Future Plan - Work Package 4’).
            </li>
            <li>
              <strong>
                A project aims to test the use of a smartphone-based app to improve contamination
                fears and excessive washing behaviours (£60,500 for 16 months)
              </strong>{' '}
              (see’ Future Plan - Work Package 5’).
            </li>
            <li>
              <strong>An international registry of OCD patients (£40,000/year)</strong> This is to
              increase understanding of the disease and recruit patients into clinical trials (see’
              Future Plan - Work Package 6’).
            </li>
            <li>
              <strong>
                A project proposal to characterise the efficacy of tolcapone in OCD (£743,500 for 3
                years)
              </strong>{' '}
              (see’ Future Plan - Work Package 7’).
            </li>
            <li>
              <strong>
                Project management, engagement, dissemination, workshops and networking
                (£180,000/year for first three years, £250,000/year for years 4 and 5).
              </strong>{' '}
              This will cover salaries, travel expenses, costs of organising meetings, workshops,
              symposiums in the programmes above and activities to raise public awareness of OCD.
            </li>
          </ol>
        </Prose>
      </PageSection>

      <PageSection heading="Overview of OCD" id="overview-of-ocd" tone="ruled">
        <DocFigure
          file="ocd-the-facts.png"
          width={1156}
          height={1400}
          alt="OCD: The Facts. 1 in 40 adults have OCD. More than 25% of adults have suffered from OCD at some point in their lives. It is estimated that OCD costs the US $8.4 billion annually. For every £1 spent on research into OCD, £5,078 is lost due to the disease."
        />
        <Prose className={DOC_PROSE}>
          <h3 id="background">Background</h3>
          <p>
            Obsessive-Compulsive Disorder (OCD) is a common, chronic and long-lasting mental health
            condition. Patients living with OCD experience uncontrollable, intrusive and reoccurring
            thoughts (obsessions) and behaviours (compulsions) that they feel the urge to repeat
            over and over, in the attempt to temporarily relieve the unpleasant feelings brought on
            by the obsessive thought. Common sets of obsessions and compulsions in patients with OCD
            include<sup>1</sup>:
          </p>
          <ul>
            <li>Concerns about contamination</li>
            <li>Concerns about harm to self or others</li>
            <li>Intrusive aggressive or sexual thoughts</li>
            <li>Concerns about symmetry</li>
          </ul>
          <p>
            <strong>Table 1. Common OCD obsessions and compulsions.</strong>
          </p>
          <Table
            className="[&_table]:text-sm [&_td]:px-2 [&_th]:px-2"
            caption="Table 1. Common OCD obsessions and compulsions."
            head={['Dimension', 'Obsessions', 'Compulsions']}
            rows={[
              [
                'Contamination symptoms',
                'Concerns about dirt, germs, viruses etc.',
                'Washing, showering, cleaning',
              ],
              ['Harm-related symptoms', 'Concerns about harm', 'Checking'],
              [
                'Unacceptability symptoms',
                'Intrusive, aggressive, sexual or religious thoughts',
                'Mental rituals or praying',
              ],
              [
                'Symmetry symptoms',
                'Concerns about symmetry',
                'Ordering, straightening. repeating or counting',
              ],
              ['Hoarding symptoms', 'Concerns about hoarding', 'Hoarding behaviours'],
            ]}
          />
          <p>
            OCD is the fourth most common mental disorder after depression, alcohol/substance
            misuse, and social phobia/anxiety<sup>2</sup>. The World Health Organisation named OCD
            as one of the most disabling of all medical disorders. OCD is ubiquitous in both males
            and females of all age groups and across all socioeconomic classes and countries
            <sup>3,4</sup>. OCD has a lifetime prevalence of 2–3%, although figures vary across
            regions, and OCD is strongly associated with comorbidity (the presence of two or more
            medical conditions) and morbidity. OCD typically starts during adolescence and early
            adulthood, although symptoms can develop at any age. There are also a substantial number
            of “sub-clinical” cases of OCD (around 5% of the global? population), where symptoms
            lead to impairment but are either not disturbing or not disruptive enough to meet full
            criteria <sup>5</sup>. Diagnosis of OCD is often missed in primary care settings and
            frequently undertreated; therefore the number of cases is thought to be much greater
            than is reported.
          </p>
          <h3 id="social-and-economic-burden">Social and Economic burden of OCD</h3>
          <p>
            OCD has been shown to interfere significantly with the person&apos;s life (or with the
            development of a child). It puts a great social and economic burden on the person and
            their environment, with considerable economic burden on family and society. The World
            Health Organisation (WHO) has ranked OCD as the tenth most disabling illness of any
            kind, in terms of lost earnings and diminished quality of life<sup>6</sup>. According to
            the charity OCD UK and the Health Technology Assessment (2016), OCD presents a
            considerable burden to the individual, family, health services, and society as a whole.
            Almost all people with OCD report that their obsessions cause them significant distress
            and anxiety<sup>7</sup>. In terms of quality of life, people with OCD have worse quality
            of life relative to their peers. Adolescents show problematic peer relations, academic
            difficulties, sleep problems, and participate in fewer recreational activities than
            their peers. When compared to other anxiety disorders and unipolar mood disorders, a
            person with OCD is less likely to be married, more likely to be unemployed, and more
            likely to report impaired social and occupational functioning<sup>8</sup>. The quality
            of life of people with OCD have been further decreased due to COVID-19 and for some, its
            impact will last long after the public health crisis passes. Up to 1 in 4 OCD patients
            will attempt to commit suicide at least once in their lifetime.
          </p>
          <p>
            The total cost accrued as a result of OCD is difficult to measure; the direct costs to
            health services and patients of medical care represents only one aspect of the total
            burden. Indirect costs to patients and society as a result of lost productivity and
            wider impacts on informal care from friends and family members are also substantial
            <sup>9</sup>. OCD, compared with other anxiety related disorders, is associated with
            more work-related occupational impairment. According to OCD UK, a US report suggested
            that the economic impact of OCD in the US is at $8.4 billion every year, yet the USA
            spends less than a tenth of this on research into all mental health diseases
            <sup>9</sup>. One report estimated that, on average, a person with OCD loses three years
            of wages over their lifetime. This equates to losses of £483.04 for every week they are
            absent and amount to a total of £75,354 due to unemployment over this 3-year period.
            This does not account for lost opportunities for career advancement and the cost to
            families and carers over their respective working lifetimes<sup>6</sup>. The long-term
            social and economic costs are still likely to be greatly underestimated, but this
            highlights the importance of providing early intervention and the highest quality of
            care and treatment for people with OCD.
          </p>
        </Prose>
        <DocFigure
          file="figure-1-research-funding.png"
          width={1246}
          height={870}
          caption="Figure 1. Funding into research areas in the USA."
          alt="Bar chart of United States research funding in billions of dollars across twenty disease areas. Respiratory research is by far the largest at about £15.5 billion, followed by enteric at 6.5, paediatrics at 5.7, behavioural or social science at 5.4, mental health at 4.2, antimicrobial resistance at 3.9, sexually transmitted infections at 3.8, hepatology and oncology at about 3.4 each, neurology at 3.3, drug use and addiction at 2.1, obstetrics at 1.9, sepsis at 1.1, and chronic respiratory, skin and soft tissue infections, gerontology, neglected tropical diseases, ophthalmology, prison health and urinary tract infections all below 1."
        />
        <Prose className={DOC_PROSE}>
          <p>
            In 2017, Orchard OCD worked with the Cambridge Consulting Network to estimate the
            economic burden of OCD. They found that the amount of money lost due to a disease per £1
            of research money spent on it (higher education costs/research spend) is £485 for
            diabetes and £18 for cancer. For OCD, this number is £5,078, highlighting how little
            money is spent on OCD research compared to its economic cost. (The full report is
            available on request.)
          </p>
          <h3 id="how-is-it-treated">OCD: How is it treated?</h3>
          <p>
            OCD symptoms can range from mild to severe. Some people with OCD may spend a couple of
            hours a day engaged in obsessive-compulsive thinking and behaviour, for others the
            condition can completely take over their lives. Currently there are both pharmacological
            and psychological treatments to alleviate symptoms of OCD. The most common
            pharmacological approach is to inhibit presynaptic reuptake of serotonin through
            clomipramine, a tricyclic antidepressant (TCA) or through serotonin reuptake inhibitors
            (SRIs). Use of SRIs show large effect sizes in adults, but only moderate effect sizes in
            youth. Even with effective medication, most treatment responders show residual symptoms
            and impairments. There is also a very high relapse rate seen across studies (between
            24%-89%)<sup>9</sup>. SRIs can be successfully supplemented with adjunctive
            antipsychotics, but only a third of patients will show improvements and there are
            serious health concerns with their long-term usage. In conjunction with pharmacology
            psychological treatments are also used. The psychological treatment of choice for OCD,
            in both adults and children and backed by clinical trials, is cognitive-behavioural
            therapy (CBT). However, up to 25% of patients will drop out prior to completion of
            treatment due to increased anxiety symptoms during difficult exposure tasks.
          </p>
          <p>
            About 40–60% of patients do not adequately respond to pharmacotherapy and CBT.
            Neuromodulation has shown increasing promise in the treatment of OCD. In August 2018 the
            FDA approved the use of deep Transcranial Magnetic Stimulation (dTMS) as a treatment
            option for OCD. TMS uses magnetic waves to stimulate particular areas and structures in
            the brain that show overactivity. Recently, six weeks of daily dTMS therapy has been
            shown to be safe and effective in OCD patients who had insufficient response to
            pharmacology and/or CBT. This presents a novel treatment option for OCD, but many
            important clinical questions still remain unanswered such as: how efficacious is dTMS in
            OCD patients with unsatisfactory symptom reduction?
          </p>
          <p>
            Existing treatments (medication and psychotherapeutic) are out-dated and usually only
            partially successful. Up to 30%–40% of patients do not respond to any available
            treatment options<sup>10</sup>. Given the chronic nature of the condition with a
            significant life-long impact and economic burden there is an urgent need to develop new
            and effective treatments and improve early detection<sup>11</sup>. However, research and
            treatment development in OCD is underfunded. Fundamental research is vital to understand
            the causative factors (e.g. is it hereditary or learned) and neurobiological bases
            (chemical, structural and functional abnormalities) are the cause of the disorder.
            Translational clinical research is critical for the evaluation and adoption of new
            treatment avenues.
          </p>
          <blockquote>
            “My OCD has certainly waxed and waned over the years but the torturer in my brain rarely
            goes on holiday for long. Instead, it raises my hopes by abating for a brief time but
            then morphs, choosing an obsession to spike me with . . . harm coming to my loved ones,
            worries about germs and virus, fear that I’ve run over someone whilst driving . . . the
            torturer in my brain has many instruments”
          </blockquote>
        </Prose>
      </PageSection>
      <PageSection heading="About Orchard" id="about-orchard" tone="ruled">
        <DocFigure
          file="vision-and-mission.png"
          width={1086}
          height={608}
          alt="Diagram of Orchard’s vision, mission and three activities. Vision: improving the quality of life of OCD patients by developing new and effective treatments. Mission: concerted collective action, resources, knowledge and people. Both feed into the Orchard OCD logo, which in turn branches into research, hubs and dissemination."
        />
        <Prose className={DOC_PROSE}>
          <h3 id="vision-and-mission">Vision and Mission</h3>
          <p>
            Our vision is a world where all patients suffering from OCD receive effective treatment
            for their condition.
          </p>
          <p>
            Our mission is to drive the quest for new, innovative and effective treatments (both
            medication and psychotherapy) for patients suffering from OCD by bringing together
            researchers, clinicians and patients and building a community of interdisciplinary
            professionals to foster translational research.
          </p>
          <p>
            Orchard’s team consists of a board of trustees and a scientific advisory board with many
            experienced professionals with passion for health care and mental health. (See Appendix
            1 for further details)
          </p>
          <h3 id="orchards-activities">Orchard&apos;s activities</h3>
          <p>
            Orchard&apos;s three pillar approach comprises Research, Hubs and Dissemination.
          </p>
        </Prose>
        <DocFigure
          file="three-pillar-approach.png"
          width={1280}
          height={856}
          alt="Diagram of Orchard’s three pillar approach: research, to fund and run clinical studies; hubs, an OCD research database and repository; and dissemination, awareness campaigns and conferences."
        />
        <Prose className={DOC_PROSE}>
          <h4>Research</h4>
          <p>
            Orchard facilitates and runs research on OCD by bridging fundamental research and
            clinical practices and building a consortium of interdisciplinary professionals to plan
            and implement new treatment development programmes. Examples include:
          </p>
          <ul>
            <li>
              Fostering drug repurposing by working closely with researchers, pharmaceutical and
              biotech companies
            </li>
            <li>
              Initiating and running clinical trials with new treatments by collaborating with
              scientists and industry leaders
            </li>
            <li>
              Stimulating patient engagement and organising patient recruitment for on-going
              research studies
            </li>
          </ul>
          <p>
            Orchard is also involved in fundraising for OCD research through crowdsourcing
            campaigns, leveraging philanthropic funding and partnering with mental health charities
            such as Mental Quotient (a major UK-based mental health charity) and Foundation for OCD
            Research.
          </p>
          <p>Existing Projects include:</p>
          <h5>1. Psilocybin</h5>
          <p>
            According to a research study in 2006, psilocybin has been reported to significantly
            reduce OCD symptoms in all treatment resistant patients enrolled in the study. Despite
            positive results, no further research has been carried out due to the lack of funding.
            Orchard collaborated with Professor David Nutt, Imperial College, London, and Professor
            Naomi Fineberg, Queen Elizabeth II Hospital, Welwyn Garden City to run a pilot clinical
            trial with the compound psilocybin. This study will start in the autumn of 2021 and will
            last 18 months, recruiting and following up 15 patients. If successful, Orchard will
            launch a larger clinical trial to obtain enough data for a license.
          </p>
          <h5>2. Transcranial Direct Current Stimulation (TDCS)</h5>
          <p>
            Research at the University of Hertfordshire involves working on a promising new
            treatment that involves passing a small, almost imperceptible electric current into
            brain areas connected to OCD. This may help people with OCD think and behave differently
            and could help treatments work better. This type of brain stimulation is new and
            experimental, so this project aims to answer basic questions, including if this
            stimulation shows signs of working, what are the side effects and if doctors and
            patients are willing to use it. The project also looks at which areas of the brain
            should be targeted and how long the effects last. This information would help design and
            implement larger clinical trials.
          </p>
          <p>(See Appendix 4 for further details)</p>
          <h4>Hubs</h4>
          <p>
            Orchard aims to provide services and resources for research scientists and clinicians
            and foster knowledge exchange and efficient collaboration by
          </p>
          <ul>
            <li>Establishing national and international fora and conferences on OCD</li>
            <li>Building an OCD research database and study repository</li>
            <li>Building a secure patient registry and recruitment portal</li>
          </ul>
          <h4>Dissemination</h4>
          <p>
            Orchard actively disseminates research results, treatments and translational science
            opportunities in order to raise public awareness around the condition and its
            debilitating and stigmatising nature.
          </p>
          <p>
            Orchard has built an OCD research community (OCD-R-Us) of over 100 people, bringing
            together OCD patients and carers, researchers, OCD charities (OCD Action, Orchard,
            Triumph over Phobia (TOP)), clinicians (OCD clinical expert Prof. Naomi Fineberg (NF))
            to raise public awareness and generate high quality. Orchard has constructed a web-based
            questionnaire to improve the understanding of OCD patients of different ages. With the
            knowledge acquired, Orchard aims to ensure future research programmes are grounded in
            the living experience of the disorder. The platform serves as effective engagement
            between different parties to enhance understanding and reduce stigma about OCD.
          </p>
          <h3 id="wider-ocd-community">Orchard’s role in the wider OCD community</h3>
          <h4>Collaborations</h4>
          <p>Orchard is in regular contact with the following charities:</p>
          <ul>
            <li>OCD UK</li>
            <li>OCD Action</li>
            <li>International OCD Foundation&apos;s (US)</li>
            <li>Foundation for OCD Research (US)</li>
          </ul>
          <p>
            Orchard is discussing ways to collaborate and co-fund research projects with Foundation
            for OCD Research, an organisation with values most in line with Orchard’s goals.
          </p>
          <h4>Timeliness</h4>
          <p>
            According to the 2015 report of Mental Quotient, very little research funding is going
            into OCD treatment development along with disease prevention, screening, and diagnosis
            and disease management. OCD is the most underfunded mental health disorder even though
            it is listed by the World Health Organization among the 10 most debilitating conditions.
            There is an important unmet need both on the patient and research sides.
          </p>
          <p>
            There are few organisations focused on OCD research (three of the four aforementioned
            charities focus on patient support rather than research). Orchard OCD fills a major gap
            in one of the most debilitating and neglected mental health conditions.
          </p>
        </Prose>
      </PageSection>

      <PageSection
        heading="Current state of OCD research"
        id="current-state-of-ocd-research"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <h3 id="neural-basis-of-ocd">Neural basis of OCD</h3>
          <p>
            OCD is a serious and common neuropsychiatric disorder which is associated with impaired
            neural circuitry in the brain<sup>1</sup>. Further research into the neural basis of OCD
            is essential for a deeper understanding of the condition and has the potential to spawn
            many possible therapeutics.
          </p>
          <p>
            Impaired neural circuitry has been revealed in OCD patients by brain imaging
            methodology, including structural imaging, measuring grey and white matter of the human
            brain and functional brain imaging (e.g. measuring metabolism or neurochemical changes).
            There have been enormous advances in the last decade, but the definitive picture in OCD
            is still emerging. One position suggests that the normal balance in activity is lost in
            cortical circuits (the thin layer of neural tissue covering the surface of the brain) and
            especially prefrontal circuits (circuits in the frontal lobe of the brain)<sup>12</sup>.
          </p>
          <p>
            OCD is a heterogeneous neuropsychiatric disorder and symptoms can present themselves in
            several forms. One type of OCD that often appears in popular depictions of OCD is
            excessive cleanliness (contamination OCD) but some of the insidious manifestations of
            the condition such as intrusive thoughts (e.g. anxiety about acting on violent thoughts)
            that are no less debilitating are less well known by the general public. All these
            conditions are labelled with the same clinical diagnosis but can have different
            physiological bases underlying them. The current one-size-fits-all approach is
            ill-equipped to deal with the different ways OCD affects patients and not only does this
            lower the success rates for some treatments, but this creates a problem for clinical
            trial recruitment. If different forms of OCD are found to have different neural
            signatures, then treatment can be personalised, and patients can be stratified into more
            homogenous groups for clinical trials increasing the amount of meaningful data that can
            be gained.
          </p>
          <p>
            Research that correlates the development of new laboratory (or online) psychological
            tests and computational modelling of the underlying processes provides steps towards
            understanding how symptoms of OCD arise. The importance of this approach is that it
            helps to identify possible molecular targets (i.e. chemical neurotransmitters) or
            particular neural circuit targets for treatment. The molecular targets may lead to new
            drug treatments, for example to curtail excess activity in specific circuits. With prior
            knowledge of the psychological roles of neural circuits new cognitive-behavioural
            therapies may be developed to target the abnormal physiologies.
          </p>
          <p>
            In addition to identifying molecular targets, uncovering the relevant circuit targets
            may allow interventions such as deep brain stimulation or &apos;neuromodulatory&apos;
            interventions such as the non-invasive transcranial magnetic stimulation (TMS), which
            exerts effects on neurotransmitter functioning in the cortex. These methods are in their
            infancy and there may be some major problems. For example, TMS cannot be used easily to
            affect subcortical circuits (circuits that lie below the thin outer layer), but new
            techniques such as repetitive TMS may solve this problem<sup>13</sup>. Current progress
            in neuroscience research reveals that specific circuits can now be targeted in the
            brain, which may ultimately have implications for treating humans as unwanted
            side-effects produced by existing medications can be avoided.
          </p>
          <h3 id="causation">Causation</h3>
          <p>
            Research into the causation of OCD is important because it presents opportunities for
            future cases to be prevented. This may be through identifying at-risk
            patients,monitoring patients before symptoms present themselves, or removing causal
            factors present in the environment. Harnessing understanding of causation is a powerful means to
            prevent and treat cases early and this is especially important because for many, OCD
            becomes more complex and difficult to treat with increased duration of illness. With
            chronicity, depression and demoralisation supervene and the risk of suicide increases
            yet patients normally present for treatment roughly 10 years after illness onset
            <sup>14</sup>.
          </p>
          <p>
            An exciting area for OCD research is expected to be in adolescent brain imaging.
            Adolescence is often the time when symptoms first emerge and tracking the physiology of
            OCD over the course of young adulthood may yield insight into how OCD entrenches itself.
            OCD is almost certainly heritable, but the genes involved have not yet definitively been
            established. The likelihood is that there will be many risk genes that each contribute
            <sup>15</sup>. Some of the genetic research is suggesting effects related to the
            neurotransmitter glutamate and its receptors, consistent with some neuroimaging
            evidence. It is also likely that environmental factors play a large part in the induction
            of OCD. For example, the non-specific effects of stress, especially early in life after
            increasingly being shown to produce changes in brain and behaviour possibly relevant to
            OCD and other mental health disorders<sup>16</sup>.
          </p>
          <p>
            Another large growth area is neuroimmunology, especially given the evidence that some
            forms of OCD follow staphylococcus infections in children (PANDAS)<sup>17</sup>. This
            could lead to a new range of drug treatments. The interaction between the gut microbiome
            and OCD is another promising area for research, and a runner-up in Orchard’s 2019 call
            for proposals planned to investigate the effect of probiotics on OCD symptoms.
            Unfortunately, we were not able to award this study any funding due to our own financial
            constraints.
          </p>
          <h3 id="animal-models">Animal models</h3>
          <p>
            Animal models of disease are important for exploring new concepts for treatment of
            clinical disorders. This is difficult in the case of mental health disorders, including
            OCD because it is harder to assess the psychological outcomes but there are some useful
            animal models of OCD. For example, focusing on some candidate genes for OCD expressed in
            mice, it does appear that compulsive behaviours may develop (such as compulsive grooming)
            <sup>18</sup>. Moreover, more complex cognitive parallels to OCD may be present in
            rodents and monkeys; for example, cognitive rigidity or inflexibility that is also seen
            in OCD patients and may relate to obsessional thinking, and excessive checking behaviour
            in conditions of uncertainty. These models may be helpful in the initial stages of
            testing new treatment approaches, including the neural circuit approaches described
            above.
          </p>
          <p>
            Because of the challenges of animal models, trials with human subjects play an even
            greater role in OCD research. Critical to smooth and efficient running of clinical trials
            is patient recruitment, and Orchard plans to facilitate easy access to volunteers by
            setting up an international patient registry (see section on Future Plans).
          </p>
          <h3 id="mechanisms-of-existing-treatments">Mechanisms of existing treatments</h3>
          <p>
            A parallel research activity to developing new treatments is to determine the mechanisms
            of action of existing treatments. OCD is unusual among neuropsychiatric disorders in
            having at least four distinct modes of treatment: medication such as selective serotonin
            reuptake inhibitors (SSRIs), cognitive behavioural therapy with response prevention,
            non-invasive neuromodulation (e.g TMS) or, for severe cases, surgery or deep brain
            stimulation (DMS). However, like many psychiatric treatments, it is not known how and
            why exactly these treatments work. Understanding these mechanisms will provide new clues
            for developing novel treatments.
          </p>
        </Prose>
      </PageSection>
      <PageSection heading="Current Challenges" id="current-challenges" tone="ruled">
        <Prose className={DOC_PROSE}>
          <h3 id="clinical-challenges">Clinical Challenges</h3>
          <p>
            OCD is a common, chronic or relapsing neuropsychiatric disorder, usually appearing
            between 10 and 25 years of age. As aforementioned, OCD often becomes more complex and
            difficult to treat with increased duration of illness, possibly because the associated
            brain and psychological mechanisms change and become more complex as time passes.
            However, patients don’t normally present for treatment until roughly 10 years after
            illness onset.
          </p>
          <p>In order to improve OCD treatment outcomes, several clinical challenges must be addressed:</p>
          <ol>
            <li>Early intervention to limit progression of the disorder</li>
            <li>Staged treatment approaches to maximise patient benefit</li>
            <li>Improved access to treatment</li>
          </ol>
          <h4>1. Early intervention to limit progression of the disorder</h4>
          <p>
            This requires the development of methods for early detection of at-risk individuals and
            interventions for prodromal cases, i.e. those who have developed some initial symptoms
            but do not yet have fully-developed OCD. So far, no such interventions have been
            identified, though CBT appears to be a possible option. This treatment would largely
            target childhood, adolescence, and perinatal states.
          </p>
          <h4>2. Staged treatment approaches to maximise patient benefit</h4>
          <h5>I. First-line treatments</h5>
          <p>
            Current first-line interventions for managing OCD across the age range usually include
            one or both of the below:
          </p>
          <ul>
            <li>
              Pharmacological treatments such as serotonin reuptake inhibitors (SRIs), clomipramine,
              or selective SRIs (SSRIs)
            </li>
            <li>CBT typically involving exposure and response prevention (ERP)</li>
          </ul>
          <p>
            However, these treatments only benefit ~50% of patients. Moreover, the degree of
            improvement is usually only partial. We need reliable predictive markers to help
            identify who will respond well to either, or both forms of treatment, in order to guide
            treatment allocation.
          </p>
          <p>
            50% of patients who respond go on to relapse. We need reliable predictors of relapse as
            few are known. Consultation with people with lived experience of OCD has identified the
            need for new, more efficacious treatments that continue to work in the long term.
          </p>
          <h5>II. Second-line treatments</h5>
          <p>
            For non-responders to first-line treatments, augmentation of SRI treatment with low-dose
            dopamine antagonists (aka antipsychotics) is an evidence-based second-line strategy and
            is efficacious in ~33% of such cases. For the majority of the remainder of patients
            there are no convincing evidence-based treatments available, though there are several
            candidate treatments currently at an experimental stage of development:
          </p>
          <ul>
            <li>
              Pharmacotherapy - stimulants, opiate agonist/antagonists, mirtazapine, sodium or
              calcium channel blockers, glutamate agonist/antagonists, serotonin receptor
              agonist/antagonists including psilocybin
            </li>
            <li>
              Psychotherapy - acceptance commitment therapy, habit reversal therapy, cognitive
              remediation therapy
            </li>
            <li>Neurostimulation - both invasive and non-invasive</li>
          </ul>
          <p>
            Most of these treatments were originally developed as treatments for other mental
            disorders and ‘repurposed’ for OCD. The strength of evidence supporting these treatments
            varies, with some appearing more convincing than others, but none appear to have a large
            effect size, i.e. the therapeutic benefits appear relatively small. Outcomes are usually
            described in terms of the group as a whole, rather than the chances that an individual
            patient will benefit. New candidate interventions built upon valid illness models are
            needed with a strong chance of success at the level of the individual patient.
          </p>
          <h5>III. Further treatments</h5>
          <p>
            For patients whose symptoms resist both first- and second-line treatments, options are
            non-pharmacological in nature. For a minority of these cases, ablative neurosurgery is
            available as an NHS-commissioned treatment, whereas deep brain stimulation remains
            experimental in the UK owing to ongoing limitations in the scientific evidence base.
            These surgical forms of treatment appear to benefit ~50% of cases and produce a
            relatively large effect size, which must be balanced against their considerable cost and
            burden. This means that their use is likely to remain limited to a small proportion of
            the most extreme cases. Non-surgical approaches such as non-invasive forms of
            neurostimulation, if found to be efficacious, would have potential for scaling up to
            tackle a greater proportion of cases at the previous two stages.
          </p>
        </Prose>
        <DocFigure
          file="figure-2-staged-treatment.png"
          width={932}
          height={424}
          caption="Figure 2: Summary of staged treatment approaches and approximate proportion of non-responders at each stage."
          alt="Four-stage treatment ladder. Stage one, patients with early-stage cases, treated with CBT (marked with a question mark). Stage two, patients with full-blown symptoms, treated with SSRIs and CBT; 50% do not respond. Stage three, patients with full-blown symptoms resisting first-line treatments, treated with antipsychotics, alternative pharmacotherapies, psychotherapies and neurostimulation; 66% do not respond. Stage four, patients with full-blown symptoms resisting first- and second-line treatments, treated with neurosurgery, deep brain stimulation or non-invasive brain stimulation; 50% do not respond."
        />
        <Prose className={DOC_PROSE}>
          <h4>3. Improved access to treatment</h4>
          <p>
            There are numerous factors currently limiting OCD patients’ access to treatment. These
            include but are not limited to:
          </p>
          <ul>
            <li>A lack of awareness of OCD within both the general public and healthcare settings</li>
            <li>A stigma around OCD</li>
            <li>A lack of access to healthcare providers specialising in OCD treatment</li>
            <li>A lack of collaborations and patient cohorts</li>
          </ul>
          <p>
            This highlights a need for greater education of the general population and healthcare
            providers on OCD, and the establishment of better networks for treatment and research
            collaborations. Orchard plans to address the latter point by building a consortium of
            interdisciplinary professionals to plan and implement new treatment development
            programmes (see Future Plans).
          </p>
          <h3 id="research-challenges">Research Challenges</h3>
          <h4>1. Trial design</h4>
          <p>
            The gold standard model for determining efficacy for a candidate treatment is the
            randomised controlled trial (RCT), which tests the experimental treatment against a
            matched comparator (control) treatment – either a neutral treatment (e.g. drug or
            psychological placebo or sham stimulation/ablation) or an active treatment with an
            established effect. OCD is well-suited to RCT research, since the placebo effect is
            traditionally quite small, so if a treatment is effective this can usually be detected
            readily without needing extremely large sample sizes. To date, most RCTs in OCD have
            been short in duration and the long-term outcomes are not well understood. Running
            studies scaled up to last at least 12 months is entirely possible and would give a
            better approximation to naturalistic outcomes.
          </p>
          <h4>2. Patient recruitment</h4>
          <p>
            Systems for efficiently recruiting people with OCD to treatment trials are at a
            rudimentary level. Moreover, some forms of treatment such as trials of investigational
            medicinal products or somatic treatments are generally considered less acceptable by the
            public and are therefore harder to recruit to. For some people with OCD, the uncertainty
            around treatment allocation associated specifically with an RCT is another obstacle to
            recruitment. A patient registry would help overcome some of these barriers and
            streamline the recruitment process by identifying patients interested in participating
            in research.
          </p>
          <h4>3. Patient selection</h4>
          <p>
            Conventional methods for selecting people with OCD for RCTs rely on a clinical diagnosis
            that depends on clinical symptoms. However, even using standardised methods, the
            clinical diagnosis captures a broad spectrum of individuals with different
            psycho-patho-physiologies. This situation is further complicated as these pathologies may
            also change over the course of illness. Currently, we have scarce and relatively
            unreliable information about those intrinsic factors that could predict a good or poor
            outcome for an individual patient. Candidate factors include duration of untreated
            illness, presence of family history of OCD, tic, hoarding, obsessive compulsive
            personality traits, cognitive inflexibility, and genes coding for certain liver enzymes
            metabolising medications. We need better methods for stratification of patients into
            more homogeneous groups based on likely treatment response, as these are likely to aid
            trial design and produce more clinically meaningful information about treatment-related
            outcomes at the level of the individual patient.
          </p>
          <h4>4. Outcome measures</h4>
          <p>
            OCD severity is usually measured using the observer-rated Yale Brown
            Obsessive-Compulsive Scale, which is a relatively sensitive way of measuring treatment
            related changes in OC symptoms. However, OCD is a disorder with a broad profile of
            clinically-relevant impairments other than obsessive-compulsive symptoms, including
            mood, thinking (cognitive) problems, functional impairment, and wellbeing. We need
            scales that sensitively capture all of these aspects of OCD - some generic scales (e.g.
            the Sheehan Disability Scale) or prototypes of more OCD-specific scales (e.g. CAIOC-13)
            already exist. It is also possible that specific neurocognitive tasks that tap into
            thinking problems known to be associated with OCD, such as attentional set shifting and
            motor impulse control, may represent additional clinically useful outcome measures with
            predictive validity. More developmental work is required in this area.
          </p>
          <h4>5. Plausible candidate interventions based on reliable illness models</h4>
          <p>
            Because of the lack of robust unifying biological or psychological models of either the
            disorder or the mechanism of effect of existing treatments, there is a shortage of new
            candidate treatments entering the treatment development pipeline.
          </p>
          <p>Ideally, such interventions need to:</p>
          <ul>
            <li>Have a strong prospect of being well tolerated</li>
            <li>
              Work better and more precisely than existing treatments, in terms of increasing the
              proportion of patients responding well and the magnitude of response
            </li>
            <li>
              Be scalable either for the majority of people with OCD taking into account the special
              needs of those in different age groups, or be designed for specific subgroups of
              patients defined a priori according to factors such as those described in Section 3
              above
            </li>
          </ul>
          <p>
            Identification of these candidate interventions requires investment in preclinical
            research (genetic, immunological, neurological including brain imaging,
            neuropsychological) to increase our understanding of the brain-based mechanisms upon
            which the candidate treatments act, taking account of different stages of OCD and
            subgroups. Preclinical research must also focus on developing a better understanding of
            the mechanisms underlying the effects of treatments (existing and candidate) as models
            that can be built upon to develop more efficacious forms of treatment - and which are
            still remarkably poorly understood.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Future Plan" id="future-plan" tone="ruled">
        <Prose className={DOC_PROSE}>
          <p>
            We are proposing two objectives – objective A is for this five year programme, with a
            view to raising more funds in order to carry out objective B subsequently:
          </p>
          <p>
            <strong>Objective A:</strong> Building upon existing knowledge, developing a programme of
            individual, but inter-linked preclinical and clinical experiments aimed at developing
            our understanding of some of the key aspects of the underpinning pathophysiology of OCD
            and of the efficacy of candidate treatments from a variety of different perspectives.
            Whereas each individual constituent study would contribute something positive but modest
            to the overall advancement of knowledge, the overall programme would produce greater
            gains through complementarity. The programme would address some of the following
            overarching research questions:
          </p>
          <ul>
            <li>Which neural networks are most affected in OCD?</li>
            <li>
              What is the role of animal models for treatment development in OCD and how can we get
              best use out of them?
            </li>
            <li>
              What is the role of immune dysfunction in causing OCD, how does it link with genetic
              risk and can we successfully target it therapeutically?
            </li>
            <li>
              Which neural circuitry is most important for targeting therapeutically via new forms
              of psychological or pharmacological intervention or neurostimulation?
            </li>
            <li>Do novel psychological therapies work and how?</li>
            <li>
              For non-invasive neurostimulation, which kind of patient, brain target, treatment
              protocol is likely to be most successful?
            </li>
          </ul>
          <p>
            <strong>Objective B:</strong> An altogether more visionary approach will be to address
            the fundamental un-answered question that lies at the heart of all the above – i.e. what
            causes OCD? This is also a key question asked by OCD patients (see appendix 3). The
            concept would be to prospectively identify and follow-up, under controlled conditions,
            large ‘at risk’ cohorts of individuals (e.g. the children of parents with OCD) over the
            period when OCD is known to develop (e.g. prenatal-30 years of age), gathering
            comprehensive datasets including environmental, genetic and developmental factors
            thought to provoke or protect against the incidence of OCD, and the neural,
            physiological, psychological and social changes that develop alongside symptoms of the
            illness. This project represents a major undertaking, requiring considerable investment
            in networked interdisciplinary effort, but is likely to radically change our
            understanding of the disorder and lead to more effective interventions that are more
            thoroughly grounded in science.
          </p>
        </Prose>
      </PageSection>
      <PageSection
        heading="Work Package 1: Consortium Programme"
        id="work-package-1"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <p>
            Research into OCD is often challenging due to research and cognitive science becoming
            further removed from the people those research studies are intended to help; OCD
            patients and the clinicians/therapists who treat them. Orchard aims to establish a
            consortium to facilitate multidisciplinary collaboration between research scientists,
            clinicians, pharmaceutical and biotech companies, government agencies and patients in
            order to promote and facilitate long-term translational research into OCD.
          </p>
          <p>
            The goals of the consortium will be to help develop treatments for OCD patients and to
            better understand the biological and psychological mechanisms of OCD. The consortium
            will collectively take a multidisciplinary approach and work together using their
            specialties to identify promising, novel pre-clinical/clinical studies that could lead
            to potential treatments for OCD and to fund the research areas with the potential to
            have the highest impact for therapeutic development. These will answer the questions set
            out in ‘Objective A’, such as what is the role of immune function in OCD and can we
            successfully target it therapeutically; do novel psychological therapies work and how;
            what non-invasive neuro-stimulation is most successful.
          </p>
          <p>
            The Orchard OCD consortium will enable cognitive scientists and practitioners to work
            closely together with the shared and defined goal of providing better treatment for
            people living with OCD by focusing on the domains of OCD research that could be useful
            to clinicians.
          </p>
          <h3>Past Experience</h3>
          <p>
            Orchard is in a strong position to establish the consortium as members of the team and
            scientific advisory board are partnered with a) academic institutes (University of
            Pittsburgh/ University of Cambridge/Imperial College London/University of
            Hertfordshire/Stanford University), b) clinical institutes (Hertfordshire Partnerships
            Mental Health Trust, Queen Elizabeth II Hospital/South West London and St George’s NHS
            Mental Health Trust) and c) industry (AstraZENECA/Sosei-Heptares)
          </p>
          <h3>Expected Outcomes</h3>
          <ul>
            <li>Bridging fundamental research and clinical practices</li>
            <li>
              Building a consortium of interdisciplinary professionals (academics, clinicians,
              psychologists, patients, industry and charities) to plan and implement new treatment
              development programmes
            </li>
            <li>
              Fostering drug repurposing by working closely with researchers, pharmaceutical and
              biotech companies
            </li>
            <li>
              Initiating and running clinical trials with new treatments by collaborating with
              scientists and industry leaders
            </li>
          </ul>
          <h3>Work plan</h3>
          <Table
            caption="Work Package 1 identification"
            rows={[
              ['Work package number', 'WP1'],
              ['Start Date or Starting Event', 'September 2022'],
              ['Work package title', 'Consortium Programme'],
            ]}
          />
          <h4>Management Team</h4>
          <Table
            caption="Work Package 1 management team roles"
            rows={[
              [
                'Head',
                'Oversees programme, coordinates logistics, leads annual meetings of the consortium',
              ],
              [
                'Deputy Head',
                'Assists Head in his responsibilities, communication with the members of the consortium',
              ],
              ['Marketing Lead', 'Actively recruits new members, advertises events and activities'],
            ]}
          />
          <h4>Participating Partners</h4>
          <Table
            caption="Work Package 1 participating partners"
            rows={[
              [
                'Confirmed Partners',
                <ul key="confirmed">
                  <li>Scientific Advisory Board of Orchard</li>
                  <li>University of Hertfordshire</li>
                  <li>University of Cambridge</li>
                  <li>
                    International College of Obsessive Compulsive Spectrum Disorders (ICOCS)
                  </li>
                  <li>Foundation for OCD Research</li>
                </ul>,
              ],
              [
                'Potential Partners',
                <ul key="potential">
                  <li>
                    Academic institutes (University of Pittsburgh/Imperial College London/Stanford
                    University)
                  </li>
                  <li>
                    Clinical institutes (Hertfordshire Partnerships Mental Health Trust, Queen
                    Elizabeth II Hospital/South West London and St George’s NHS Mental Health Trust)
                  </li>
                  <li>
                    Pharmaceutical and Biotechnology companies (AstraZENECA/Sosei-Heptares)
                  </li>
                  <li>Government agencies</li>
                </ul>,
              ],
            ]}
          />
          <h4>Objectives:</h4>
          <ul>
            <li>
              To set up an international consortium which will promote global collaboration for OCD
              research (task 1)
            </li>
            <li>
              To identify promising pre-clinical/clinical studies for OCD and to fund key research
              questions that could lead to the long-term development of therapeutics (Objective A -
              developing our understanding of some of the key aspects of the underpinning
              pathophysiology of OCD and of the efficacy of candidate treatments) (task 2)
            </li>
            <li>To promote scientific engagement to researchers and the wider public (task 3)</li>
          </ul>
          <h4>Description of work:</h4>
          <p>
            We will set up an international consortium based around our emerging partnerships with
            the University of Hertfordshire and the University of Cambridge. We will build the
            consortium through the members of our Scientific Advisory Board, who have access to
            other universities and clinical centres, and through networks such as the International
            College of Obsessive Compulsive Spectrum Disorders (ICOCS) and the Foundation for OCD
            Research. The consortium will organise a kick-off workshop to bring together potential
            partners, definite the research objectives and agree a plan and milestones.
          </p>
          <h5>TASK 1 - Establishing an international OCD consortium</h5>
          <p>
            Positions to become a member of the consortium will be through recommendations by
            Orchard and their affiliates, or through application. Members will be chosen through the
            following criteria: experience, expert knowledge, time commitment and discipline. The
            total number of members, diversity, research scientists, physicians, industrial
            specialists and patient representatives are to be determined by the scientific advisory
            board and the management team. There will be a strong emphasis on selecting individuals
            that focus on different aspects of OCD research. Orchard aims to have a diverse
            representation of individuals on the consortium with regards to age/gender/ethnicity.
          </p>
          <p>
            <strong>Task 1.1 - Selection of the members of the consortium (Months 1-3)</strong>
          </p>
          <p>
            Orchard will identify possible candidates by a) networking with Orchard through
            recommendation by the Scientific Advisory Board’s contacts or b) Social media (e.g.
            Twitter)/ scientific campaign. Potential candidates (scientists, physicians,
            industrialists and patient representatives) for the consortium will be invited to apply
            through an online application format. Applications will be reviewed by the Management
            Team and Scientific Advisory Board and interviews will be held to determine whether
            candidates would be a good fit for the consortium. 10 successful applicants will be
            selected to become members of the consortium. Applicants will be selected based on
            diversity and meritocratic achievements.
          </p>
          <p>
            <strong>Task 1.2 - Initial and triannual meetings (Months 3-60)</strong>
          </p>
          <p>
            This will be enacted by a kick-off meeting during the first month after the consortium
            has been established. We will amend the management structure, and methods of decision
            making and communication between participants, as well as ethical guidelines,
            publication policy and intellectual property rights (IPR). The Consortium Agreement will
            be the basis of the relations and dealings between the participants. The initial meeting
            will enable members of the consortium to bring together potential partners and to
            network with one another. The consortium will subsequently meet triannually to discuss
            any progress/issues.
          </p>
          <p>
            <strong>
              Task 1.3 - Hiring/Appointment of a qualified and motivated communications manager (1
              month)
            </strong>
          </p>
          <p>
            <strong>Deliverables</strong>: Creation of the Orchard OCD consortium, definite the
            research objectives of the consortium and agree on a plan and milestones
          </p>
          <h5>TASK 2 - Pre-clinical/clinical studies for OCD</h5>
          <p>
            <strong>
              Task 2.1 - Pre-clinical/clinical studies of potential treatments (5 years)
            </strong>
          </p>
          <p>
            Annual pre-clinical/clinical studies of potential treatments identified by our
            consortium (one/year for the first three years, then two/year for years 4 and 5). These
            will answer the questions set out in ‘Next Steps for Research – Objective A’, such as
            what is the role of immune function in OCD and can we successfully target it
            therapeutically; do novel psychological therapies work and how; what non-invasive
            neuro-stimulation is most successful.
          </p>
          <p>
            <strong>Task 2.2 Monthly Meetings and Ongoing Communication</strong>
          </p>
          <p>
            Monthly meetings will be organised by the consortium to monitor progression of the
            studies funded by Orchard. The meetings will enable Orchard to track whether projects
            are on track, are still working towards Orchard&apos;s defined goals and share the same
            vision. The meetings will share the format of an individual presentation which will
            promote discussion about the topic. New goals will be set (quarterly, yearly and
            3-yearly goals) and existing ones reviewed. These may relate to research, funding
            strategies, outreach, and advertisement. Orchard will also enable ongoing communication
            to members of the consortium by monthly email newsletters. These may include updates
            about Orchard projects, blog articles, invitations to events, and also represent an
            opportunity for members/partners to share their projects. In addition, Orchard will
            develop an online portal which will require members of the consortium to login with
            their account details and access features such as private messaging, notifications about
            news and events, a forum to discuss literature, research challenges and opportunities,
            etc.
          </p>
          <h5>TASK 3 - Engagement</h5>
          <p>
            <strong>Task 3.1 Annual Symposium</strong>
          </p>
          <p>
            Orchard will organise an annual symposium to increase awareness into OCD research, to
            increase communication and collaboration between researchers and to enable networking in
            order to promote multidisciplinary translational research. Members and partners are
            encouraged to promote the symposium and be invited for speeches and proposals. The
            organisation of the event is facilitated by the management team.
          </p>
          <p>
            <strong>Task 3.2 Webinars</strong>
          </p>
          <p>
            Once a quarter, the consortium organises online webinars, in which partners and other
            scientists may be invited to speak. This encourages collaboration and communication
            between scientists, policy makers and other officials.
          </p>
          <h4>Deliverables:</h4>
          <ul>
            <li>
              To establish an international consortium for OCD research, definite the research
              objectives of the consortium and agree on a plan and milestones (Task 1) Months 1-3
            </li>
            <li>
              To develop pre-clinical/clinical studies of potential treatments for OCD identified by
              our consortium (Task 2) Months 4-60
            </li>
            <li>
              To design and produce a platform where OCD researchers communicate efficiently and
              share resources (Task 2.2). Months 4-12
            </li>
            <li>
              Create the Orchard OCD annual symposium for researchers to share and discuss their
              work (Task 3) Months 12-60
            </li>
            <li>
              Publication 1: What is the role of immune function in OCD and can we successfully
              target it therapeutically? (Task 2.1). Months 12-24
            </li>
            <li>
              Publication 2: Do novel psychological therapies work and how do they work? (Task 2.1).
              Months 16-36
            </li>
            <li>
              Publication 3: Which non-invasive neuro-stimulation is most successful? (Task 2.1)
              Months 36-60
            </li>
          </ul>
          <h4>Milestones</h4>
          <ul>
            <li>
              Applicants interested in being a part of the consortium will be invited to apply (Task
              1) Months 1-3
            </li>
            <li>Consortium members conduct initial meeting (Task 1.2) Month 3</li>
            <li>Inaugural consortium study begins (Task 2) Month 4</li>
            <li>
              One study will be funded per year for the first three years, then two per year for
              years 4 and 5
            </li>
          </ul>
          <h3>Gantt Chart</h3>
        </Prose>
        <DocFigure
          wide
          file="gantt-work-package-1.png"
          width={918}
          height={373}
          alt="Gantt chart for Work Package 1 across five years of quarters. Subtask 1.1 runs in quarter 1 of year 1; subtask 1.2 runs from quarter 1 of year 1 to the end of year 5; subtask 1.3 runs in quarter 1 of year 1. Subtasks 2.1 and 2.2 run for the whole five years. Subtask 3.1 starts in quarter 2 of year 1 and runs to the end; subtask 3.2 starts in quarter 3 of year 1 and runs to the end."
        />
        <Prose className={DOC_PROSE}>
          <h3>Financial projections</h3>
        </Prose>
        <Table
          caption="Work Package 1 financial projection by year"
          head={[
            'Financial Projection',
            'Year 1',
            'Year 2',
            'Year 3',
            'Year 4',
            'Year 5',
            'Total',
          ]}
          rows={[
            [<strong key="engagement">Engagement</strong>, '', '', '', '', '', ''],
            ['Kick-off workshop', '£10,000', '', '', '', '', '£10,000'],
            ['Annual Symposium', '£30,000', '£30,000', '£30,000', '£30,000', '£30,000', '£150,000'],
            [
              'Secretary/Engagement manager',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£125,000',
            ],
            [<strong key="other">Other</strong>, '', '', '', '', '', ''],
            [
              'Data storage servers',
              '£500.00',
              '£500.00',
              '£500.00',
              '£500.00',
              '£500.00',
              '£2500.00',
            ],
            [
              'Literature/open-access publication fees',
              '£8,000',
              '£8,000',
              '£8,000',
              '£8,000',
              '£8,000',
              '£40,000',
            ],
            ['Travel expenses', '£20,000', '£20,000', '£20,000', '£20,000', '£20,000', '£100,000'],
            [
              <strong key="total">Total</strong>,
              '£393,500',
              '£383,500',
              '£383,500',
              '£683,500',
              '£683,500',
              '£2,527,500',
            ],
          ]}
        />
      </PageSection>
      <PageSection
        heading="Work Package 2: Neurobehavioural Basis of Obsessive-Compulsive Disorder"
        id="work-package-2"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <p>
            Obsessive-compulsive disorder is a common, severe and disabling psychiatric illness
            which is treated with limited effectiveness by pharmacological medication and
            behavioural therapy, as well as by neurosurgical procedures in severe cases. Although
            brain imaging studies show evidence of brain changes in OCD, it is unclear how these
            changes produce its distinctive symptoms, and nor is it clear how neurosurgical and
            novel &apos;neuromodulatory&apos; treatments actually work. The main goals of this
            research will help to address these questions. This proposal continues to test our
            hypothesis that OCD results in part from an imbalance between brain circuits including
            portions of the frontal lobes controlling goal-directed behaviour and habits, in both
            adult and adolescent OCD patients, while modelling these impairments in experimental
            animals. We are focusing on how decision-making in uncertain situations provides special
            challenges for OCD patients and results in the compulsive symptom of checking behaviour,
            thought to be an aberrant form of exploration.
          </p>
          <h3>Work plan</h3>
          <Table
            caption="Work Package 2 identification"
            rows={[
              ['Work package number', 'WP2'],
              ['Start Date or Starting Event', 'September 2022'],
              [
                'Work package title',
                'Neurobehavioural Basis of Obsessive-Compulsive Disorder',
              ],
            ]}
          />
          <h4>Objectives:</h4>
          <p>
            <strong>In humans:</strong>
          </p>
          <ul>
            <li>
              Test further our original hypothesis of imbalanced cortico-striatal pathways in OCD
              mediating a bias away from goal-directed to maladaptive habitual control that
              underlies core compulsive symptoms, using a cross-species, translational approach.
            </li>
            <li>
              Address recent computational findings of decision-making under uncertainty producing
              aberrant response switching tendencies in OCD which hypothetically relate to the
              symptom of compulsive checking.
            </li>
          </ul>
          <p>
            <strong>In marmosets:</strong>
          </p>
          <ul>
            <li>
              Explore further the interaction between OFC regions and the rACC-24 when the OFC
              region is over-activated, as occurs in OCD.
            </li>
            <li>Confirm the relevant output circuitry from rACC-24 to the striatum.</li>
          </ul>
          <p>
            <strong>In rats, investigate the following:</strong>
          </p>
          <ul>
            <li>
              The neural correlates of differences between sign-trackers and goal-trackers in terms
              of excessive checking.
            </li>
            <li>
              The relationship between checking and reduced response ‘stickiness’ under uncertainty.
            </li>
            <li>Whether excessive checking is habitual or goal-directed.</li>
            <li>
              The neural basis of excessive checking for comparison with human studies implicating
              the ACC and striatum.
            </li>
          </ul>
          <h4>Description of work:</h4>
          <p>
            The human study will involve the neuroimaging of human OCD patients and measurement of
            glutamate/GABA levels in cortex. The overarching goals are to provide a neuro-behavioural
            account of obsessive-compulsive disorder (OCD), whilst also enhancing our understanding
            of fronto-striatal function and new &apos;circuit -based&apos; therapies. We will test
            the hypothesis that increased switching and compulsive checking of OCD are related and
            depend on anterior cingulate cortex (ACC) hyperactivity, possibly arising from
            glutamatergic/GABAergic imbalance in OCD.
          </p>
          <p>
            The marmoset study will involve investigation of neural circuitry in a marmoset model of
            loss of control over goal-directed behavior in OCD. A paradigm of potential importance
            for OCD is the distinction between goal-directed behavior and habits, which use
            different fronto-striatal systems in the brain. We hypothesise that OCD is associated
            with a bias to using the habit-based system, which may underlie compulsive behavior. One
            way of testing this degrades the normal causal connection that might exist between
            actions and their consequences (contingency degradation), in other words, the control
            exerted by voluntary or instrumental behavior. If actions and outcomes are uncoupled
            (the rewarding events still occurring but no longer in relation to responding) it would
            be expected that voluntary actions would diminish (as they are no longer effective in
            producing the goal/reward). Their persistence, however, implicates habitual control over
            behavior. Pavlovian stimuli are known to provoke symptoms in OCD via activation of the
            ACC and OFC (orbitofrontal cortex - a region in the prefrontal cortex), structures
            implicated in the cortical mediation of Pavlovian conditioning. Specific aims of the
            planned work are to explore further the interaction between OFC regions and the rACC-24
            when the OFC region is over-activated, as occurs in OCD, and to confirm the relevant
            output circuitry from rACC-24 to the striatum.
          </p>
          <p>
            The rat study will involve investigation of the effects of mGluR2 receptors on excessive
            checking behaviour in rats as a valid model of OCD. The main mouse models to date have
            focused on excessive grooming after manipulation of single genes that may contribute to
            OCD phenotypes. The purpose of this project is to validate a more realistic rat model of
            excessive checking behaviour which we have already shown translates into our human
            studies of checking in OCD.
          </p>
          <p>The main tasks will be as follows:</p>
          <h5>Human study:</h5>
          <h6>TASK 1 - Introductory setup and preparation</h6>
          <p>
            <strong>Task 1.1 - Introduction and recruitment (Months 1-3)</strong>
          </p>
          <ul>
            <li>
              All those involved with the administration of the experiments meet to discuss and
              clarify the research timeline.
            </li>
            <li>
              The clarified research methodology and timelines are shared with Orchard and Orchard
              patient registry.
            </li>
            <li>
              A list of recruitment criteria for the human trials is created and shared with the
              Orchard patient registry. 40 adult patients (20 of whom are unmedicated) and 30
              adolescent patients with IQ, age and gender-matched controls.
            </li>
            <li>
              Materials promoting the trial through other sources e.g. Orchard’s website is created
              and distributed.
            </li>
          </ul>
          <p>
            <strong>
              Task 1.2 - Patients who have applied for the experiment will be screened to ensure
              they match the criteria (Months 3-9)
            </strong>
          </p>
          <h6>TASK 2 - Administration</h6>
          <p>
            <strong>Task 2.1 - Patient data collection (Months 12-36)</strong>
          </p>
          <ul>
            <li>
              Selected patients will receive a test battery including PRL and two forms of checking,
              one similar to the rodent observing response &apos;checking&apos; task in terms of
              contingencies, and the other based on perceptual decision-making.
            </li>
            <li>Behavioural data on contingency degradation will be collected.</li>
            <li>
              Questionnaires to test hypotheses concerning the relationship of reduced stickiness
              (and other parameters) to state anxiety, intolerance of uncertainty, compulsivity and
              habit traits, including automatisation, will be administered.
            </li>
          </ul>
          <p>
            <strong>Task 2.2 - Patient attend labs (Months 12-36)</strong>
          </p>
          <ul>
            <li>
              Patients will attend the lab to undergo a 7Tesla MRS scan to measure NAA, glutamate,
              glutamine and GABA levels in the ACC, with control voxels in the visual cortex and the
              Supplementary Motor Area.
            </li>
            <li>
              Patients will attend the lab to undergo a fMRI study of contingency degradation in OCD
              to determine the neural basis of the behavioural deficits detected earlier:
              participants will be trained to respond for rewards outside the scanner and then
              subjected to a partial degradation of contingency before being scanned with partial
              and full degradation analogous to a previous block design in healthy volunteers.
            </li>
          </ul>
          <h6>TASK 3 - Analysis and presentation (Months 36-48)</h6>
          <p>
            <strong>Task 3.1 - Analysis (Months 36-42)</strong>
          </p>
          <ul>
            <li>
              Employment of Bayesian computational modelling to fit the best model to PRL
              responding, including parameters of learning rate, inverse temperature (to index
              &apos;exploit:explore&apos; tendencies) and outcome-independent stimulus stickiness.
            </li>
            <li>Calculation of NAA and altered glutamate:glutamine and glutamate:GABA ratios.</li>
            <li>
              Calculation of the statistical relationships of the glutamate:GABA ratios to
              behavioural measures of contingency degradation, checking and reductions in
              &apos;stimulus stickiness&apos; in PRL.
            </li>
            <li>
              Calculate BOLD contrast for the partial and full degradation conditions in OCD
              patients in ACC.
            </li>
            <li>
              Relate the changes in BOLD response to the ACC glutamate:GABA ratios in the study of
              7Tesla MRS scans above.
            </li>
            <li>Scientific paper published.</li>
          </ul>
          <p>
            <strong>Task 3.2 - Writing and publication (Months 42-48)</strong>
          </p>
          <ul>
            <li>Scientific paper published.</li>
            <li>Findings published and presented.</li>
          </ul>
          <h5>Marmoset study:</h5>
          <h6>TASK 1 - Introductory setup and preparation</h6>
          <p>
            <strong>Task 1.1 - Introduction (Months 1-6)</strong>
          </p>
          <ul>
            <li>
              All those involved with the administration of the experiments meet to discuss and
              clarify the research timeline.
            </li>
            <li>The clarified research methodology and timelines are shared with Orchard.</li>
          </ul>
          <p>
            <strong>
              Task 1.2 - Housing, feeding and other infrastructure for 6 marmosets are secured
              (Months 1-6)
            </strong>
          </p>
          <h6>TASK 2 - Administration</h6>
          <p>
            <strong>Task 2.1 - Animal experiments (Months 6-24)</strong>
          </p>
          <ul>
            <li>
              Paradigm animals are trained to make two different responses on a touch-sensitive
              screen for their two most preferred, but discriminable, fruit juices. On two different
              test probe trials they then receive either free presentations of the same juice (thus
              uncoupling the response from its consequences) or of the alternative juice (control),
              according to an established procedure which controls for juice satiety, preference and
              frustrative effects of extinction.
            </li>
            <li>
              Marmosets will be implanted with cannulae in rACC-24 and eDREADDs in A-11 (central
              orbitofrontal cortex, n=6) or A-14 (medial orbitofrontal cortex, n=6).
            </li>
            <li>
              Implement viral transduction of a specific evolved muscarinic receptor (an excitatory
              DREADD, coupled to Gq) into A-11 or A-14 and then infuse its high affinity ligand
              clozapine-N-oxide (CNO) or control vehicle) into the target region of rACC-24: only
              those receptors in that region on afferents from either A-11 or A-14 will be
              (reversibly) activated.
            </li>
            <li>
              A retrograde CRE virus will be used and injected into the target caudate nucleus and
              an anterograde CRE-dependent eDREADD (hM3Dq) and iDREADD (KORD) into rACC-24.
              Subsequent systemic administration of either CNO, (activator of hM3Dq) and SalvinorinB
              (activator of KORD) will excite or inhibit the rACC-24-caudate pathway, respectively.
            </li>
          </ul>
          <h6>TASK 3 - Analysis and presentation</h6>
          <p>
            <strong>Task 3.1 - Analysis (Months 24-30)</strong>
          </p>
          <ul>
            <li>
              The relevant circuitry activity will be measured using PET, task-based functional
              magnetic resonance imaging (fMRI) and resting state functional connectivity.
            </li>
          </ul>
          <p>
            <strong>Task 3.2 - Writing and publication (Months 30-36)</strong>
          </p>
          <ul>
            <li>Scientific paper published.</li>
            <li>Findings published and presented.</li>
          </ul>
          <h5>Rat study:</h5>
          <h6>TASK 1 - Introductory setup and preparation</h6>
          <p>
            <strong>Task 1.1 - Introduction (Months 1-3)</strong>
          </p>
          <ul>
            <li>
              All those involved with the administration of the experiments meet to discuss and
              clarify the research timeline.
            </li>
          </ul>
          <h6>TASK 2 - Administration</h6>
          <p>
            <strong>Task 2.1 - Animal experiments (Months 3-27)</strong>
          </p>
          <ul>
            <li>
              Rats will initially be screened and classified as sign-trackers or goal-trackers using
              Pavlovian autoshaping procedures. 12 sign-trackers and 12 goal-trackers will be
              scanned at 9.4T MRS with an ACC voxel. All rats will subsequently be trained and
              assessed for ‘stickiness’ of responding on PRL (touch-screen context) while also
              undergoing training on the Observing Response Task (ORT). We hypothesise that
              differences in ACC Glu:GABA ratio will predict excessive checking that correlates with
              response switching on PRL. Once excessive checkers have been identified, all rats will
              undergo contingency degradation for observing, to determine whether checking is
              goal-directed or habitual in nature (Months 3-15).
            </li>
            <li>
              Then we will causally determine the involvement of ACC in functional and excessive
              checking in sign-trackers and goal-trackers by testing effects of overactivation
              (using DHK61) and inactivation (using baclofen/muscimol62) to assess excessive
              checking on ORT and PRL performance (using computational modelling, as for the human
              study). We predict DHK will reduce stickiness (PRL) in goal-trackers and induce
              excessive checking. By contrast, in sign-trackers either inactivation or infusions of
              a mGluR2/3 agonist (reducing excitatory transmission) are hypothesised to reduce
              excessive checking and normalise stickiness. The effect of ACC overactivation on its
              striatal projections will be assessed using fibre photometry (Month 15-27).
            </li>
            <li>
              The neural correlates of the hypothesised habitual nature of excessive checking will
              be investigated using fibre photometry to measure striatal dopamine activity.
              Sign-trackers and goal-trackers will be transfected with a virus expressing the
              dopamine sensor dLight, in the nucleus accumbens, dorsomedial or dorsolateral
              striatum, and subsequently implanted with an optical probe to measure dopaminergic
              signalling. We predict enhanced signalling within the nucleus accumbens or dorsomedial
              striatum in functional forms of checking and in dorsolateral striatum when checking
              becomes excessive, paralleling an hypothesised transition from information-gathering,
              functional checking to excessive, habitual checking (Month 3-27).
            </li>
            <li>
              In a further group of sign-trackers, we will define the activity (calcium transients)
              in cingulate-striatal fibres while the rats are performing the ORT, focusing on
              functional versus excessive checking (Month 3-27).
            </li>
            <li>
              To test the causal role of ACC-striatal circuitry in excessive checking we will employ
              DREADDS inhibition of ACC projections to striatum after infusion of adeno-associated
              vectors carrying hM4Di- mCherry transgenes into ACC. Co-infusion of GCaMP6s will allow
              tracking of event-related calcium transients (Month 3-27).
            </li>
          </ul>
          <h6>TASK 3 - Analysis and presentation</h6>
          <p>
            <strong>Task 3.1 - Analysis (Month 27-33)</strong>
          </p>
          <ul>
            <li>Findings are collated, quantified, and analysed.</li>
          </ul>
          <p>
            <strong>Task 3.2 - Writing and publication (Months 33-36)</strong>
          </p>
          <ul>
            <li>Scientific paper published.</li>
            <li>Findings published and presented.</li>
          </ul>
          <h4>Main role of participants:</h4>
          <ul>
            <li>
              Professor Trevor Robbins, Dept of Psychology, University of Cambridge. Joint
              investigator who will be primarily overseeing human and marmoset studies.
            </li>
            <li>
              Professor Naomi Fineberg, Hertfordshire Partnership University NHS Foundation Trust
              and University of Hertfordshire. She will continue to refer OCD patients and provide
              clinical advice
            </li>
            <li>
              One Research Associate, one Research Assistant and two PhD students will work on the
              human studies. The Research Associate and Research Assistant will additionally be
              involved in patient recruitment and arrangements for their visits; they maintain
              contacts with referring clinicians and our panel of OCD patients, as well as advertise
              for healthy participants. They also interact with the staff of the Wolfson Brain
              Imaging Centre, including administrative staff, physicists and radiographers and data
              managers. Behavioural testing occurs in the nearby Herchel-Smith Building involving
              liaison with the manager of the clinical neuroscience testing suites.
            </li>
            <li>
              Two Research Associates, one Research Assistant and two PhD students will work on the
              marmoset and rat studies.
            </li>
          </ul>
          <h4>Deliverables:</h4>
          <h5>Human study:</h5>
          <ul>
            <li>
              The following hypotheses will be accepted or rejected:
              <ul>
                <li>
                  H1: Both adult and adolescent OCD patients will show reduced NAA and altered
                  glutamate:glutamine and glutamate:GABA ratios.
                </li>
                <li>
                  H2: There will be significant relationships of the glutamate:GABA ratios to
                  behavioural measures of contingency degradation, checking and reductions in
                  &apos;stimulus stickiness&apos; in PRL.
                </li>
                <li>
                  H3: There will be a reduced BOLD contrast for the partial and full degradation
                  conditions in OCD patients in ACC.
                </li>
              </ul>
            </li>
            <li>
              To generate data outputs of three different types: 1) behavioural data; 2)
              self-reported questionnaires measuring anxiety, intolerance of uncertainty and
              compulsivity traits; 3) neuroimaging data (fMRI and MRS), in healthy humans and OCD
              patients. These datasets are most relevant to psychiatry but have also clear value for
              wider research re-use in other domains e.g. the MRS data will be collected using a
              brand-new high-resolution 7T scanner.
            </li>
          </ul>
          <h5>Marmoset study:</h5>
          <ul>
            <li>
              To investigate the interaction between OFC regions and the rACC-24 when the OFC region
              is over-activated, as occurs in OCD.
            </li>
            <li>To confirm the relevant output circuitry from rACC-24 to the striatum.</li>
            <li>
              To examine the evidence collected in the experiment as to whether the specific
              projection from the rACC-24 to the anterior caudate nucleus mediates the effects of
              contingency degradation.
            </li>
            <li>
              To test effects of over-activation of this pathway, which hypothetically may occur in
              OCD, using excitatory DREADDs in the same animals.
            </li>
            <li>
              Ultimately, it is hoped that knowledge from this experiment will investigate whether
              OCD is associated with a bias to using the habit-based system, which may underlie
              compulsive behavior.
            </li>
            <li>Ultimately, knowledge of this circuitry may help to design drugs.</li>
          </ul>
          <h5>Rat study:</h5>
          <ul>
            <li>
              The following hypotheses will be accepted or rejected:
              <ul>
                <li>
                  H1: Differences in ACC Glu:GABA ratio will predict excessive checking that
                  correlates with response switching on PRL.
                </li>
                <li>
                  H2: In goal-trackers, DHK will induce excessive checking, while in sign-trackers,
                  infusions of a mGluR2/3 agonist will reduce excessive checking.
                </li>
                <li>
                  H3: Enhanced signalling will be observed within the nucleus accumbens or
                  dorsomedial striatum in functional forms of checking, and in dorsolateral striatum
                  when checking becomes excessive.
                </li>
              </ul>
            </li>
            <li>
              To investigate the neural basis in rats of excessive checking, allowing for comparison
              with human studies implicating the ACC and striatum.
            </li>
            <li>
              To validate a realistic rat model of excessive checking behaviour, which translates
              into human studies of checking behaviour in OCD.
            </li>
            <li>
              If rat model is successfully validated, the model will expedite future research into
              the neural basis of checking behaviour in OCD and potentially other OCD symptoms,
              which can then be exploited for therapeutic benefit.
            </li>
          </ul>
          <h4>Milestones:</h4>
          <h5>Human study:</h5>
          <ul>
            <li>Patients are recruited and screened for suitability. Months 1-12</li>
            <li>
              Selected patients receive a test battery, questionnaire, MRS scan, and fMRI scan.
              Months 12-36
            </li>
            <li>Write-up and submission of paper/s for publication. Months 42-48</li>
          </ul>
          <h5>Marmoset study:</h5>
          <ul>
            <li>Experiments executed. Months 6-24</li>
            <li>Write-up and submission of paper/s for publication. Months 30-36</li>
          </ul>
          <h5>Rat study:</h5>
          <ul>
            <li>Experiments executed. Months 3-27</li>
            <li>Write-up and submission of paper/s for publication. Months 33-36</li>
          </ul>
          <h3>Gantt chart</h3>
        </Prose>
        <DocFigure
          wide
          file="gantt-work-package-2.png"
          width={608}
          height={505}
          alt="Gantt chart for Work Package 2 across four years of quarters, split into three studies. Human study: subtask 1.1 in the first quarter, subtask 1.2 from quarter 1 to quarter 3 of year 1, subtasks 2.1 and 2.2 through years 2 and 3, subtask 3.1 in quarters 1 and 2 of year 3 and subtask 3.2 in quarters 3 and 4 of year 3. Marmoset study: subtasks 1.1 and 1.2 in the first two quarters, subtask 2.1 from quarter 2 of year 1 to quarter 2 of year 2, subtask 3.1 in quarters 2 and 3 of year 2 and subtask 3.2 in quarters 3 and 4 of year 2. Rat study: subtask 1.1 in the first quarter, subtask 2.1 from quarter 1 of year 1 to quarter 3 of year 2, subtask 3.1 in quarters 2 and 3 of year 2 and subtask 3.2 in quarter 4 of year 2."
        />
        <Prose className={DOC_PROSE}>
          <h3>Financial projections</h3>
        </Prose>
        <Table
          caption="Work Package 2 financial projection by year"
          head={['Financial Projections', 'Year 1', 'Year 2', 'Year 3', 'Total']}
          rows={[
            [<strong key="salaries">Salaries</strong>, '', '', '', ''],
            ['Senior Research Associate, full-time', '£65,458', '£65,458', '£65,458', '£196,373'],
            ['Technician, full-time', '£49,232', '£49,232', '£49,232', '£147,695'],
            ['Research Associate, full-time', '£55,207', '£55,207', '£55,207', '£165,622'],
            ['Research Associate, full-time', '£50,929', '£50,929', '£50,929', '£152,787'],
            ['Research Assistant, full-time', '£38,833', '£38,833', '£38,833', '£116,498'],
            ['Senior Research Associate, part-time', '£4,588', '£4,588', '£4,588', '£13,763'],
            [<strong key="materials">Materials and Consumables</strong>, '', '', '', ''],
            ['Marmoset studies', '£6,216', '£6,216', '£6,216', '£18,648'],
            ['Human studies', '£7,267', '£7,267', '£7,267', '£21,801'],
            ['Rodent studies', '£7,340', '£7,340', '£7,340', '£22,020'],
            [<strong key="equipment">Equipment</strong>, '', '', '', ''],
            ['Computers for research staff', '£7,500', '', '', '£7,500'],
            ['High spec computer for marmoset behavioural testing', '£1,500', '', '', '£1,500'],
            [<strong key="animals">Animals and Associated Costs</strong>, '', '', '', ''],
            ['Marmosets', '£105,747', '£105,747', '£105,747', '£317,241'],
            ['Rats, Lister Hooded', '£20,752', '£20,752', '£20,752', '£62,257'],
            ['Research Associate PIL training and security clearance', '£1,002', '', '', '£1,002'],
            ['PIL licence fees for animal researchers', '£900', '£900', '£900', '£2,700'],
            [<strong key="access">Access Charges</strong>, '', '', '', ''],
            [
              'Wolfson Brain Imaging Centre 7T MRI scanner',
              '£26,640',
              '£26,640',
              '£26,640',
              '£79,920',
            ],
            [
              'Wolfson Brain Imaging Centre 3T MRI scanner',
              '£21,600',
              '£21,600',
              '£21,600',
              '£64,800',
            ],
            [<strong key="travel">Travel and Subsistence</strong>, '', '', '', ''],
            ['Human participant travel expenses', '£2,400', '£2,400', '£2,400', '£7,200'],
            ['Travel to US conference', '', '', '£9,000', '£9,000'],
            ['Carbon offsetting for conference travel', '', '', '£315', '£315'],
            [
              <strong key="total">Total</strong>,
              '£473,110',
              '£463,108',
              '£472,423',
              '£1,408,642',
            ],
          ]}
        />
      </PageSection>
      <PageSection
        heading="Work Package 3: Physical Exercise as an Anti-inflammatory intervention for Patients with Obsessive-Compulsive Disorder - a randomised, blinded, placebo-controlled pilot study (PEA-POD)"
        id="work-package-3"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <p>
            There are currently only a few treatment options for OCD which exist and their
            effectiveness are limited. Better treatments are needed. Factors related to brain
            inflammation may be a contributory cause of OCD in some people. High Intensity Exercise
            (HIE) has systematic anti-inflammatory effects with the potential to impact
            neuroinflammation. HIE has the potential to enhance cognitive flexibility and inhibitory
            control in mental health patients with impaired cognition. Various lines of research
            suggest that exercise can help OCD patients, yet no adequately controlled trials have
            been performed.
          </p>
          <p>
            The only randomised controlled trial performed compared the acute effects of 12-week
            exercise to a ‘health education’ control. However, this study had small participant
            numbers, used non-blinded and self-rated scales with no standardisation of the mode,
            duration and intensity of the exercise. A definitive study is therefore needed to
            confirm the effects of exercise on OCD patients and the mechanisms that produce such
            effects.
          </p>
          <p>
            Our aim is to establish whether HIE is an effective treatment for adults with OCD,
            whether it improves symptoms via anti-inflammatory actions and whether it is most
            effective for those with OCD with evidence of brain inflammation. As the existing data
            for whether HIE provides relief to sufferers of OCD is inadequate to support a
            full-scale trial, a randomised, blinded, placebo-controlled pilot study (PEA-POD) will
            be conducted. PEA-POD addresses key research questions and knowledge gaps to enable the
            design of the most efficient, cost-effective study. The outcomes of this study will
            determine whether HIE has any therapeutic potential in patients with OCD, and if
            successful, will aid in the progression to a full clinical trial.
          </p>
          <h3>Work plan</h3>
          <Table
            caption="Work Package 3 identification"
            rows={[
              ['Work package number', 'WP3'],
              ['Start Date or Starting Event', 'September 2022'],
              [
                'Work package title',
                'Physical Exercise as an Anti-inflammatory intervention for Patients with Obsessive-Compulsive Disorder - a randomised, blinded, placebo-controlled pilot study (PEA-POD)',
              ],
            ]}
          />
          <h4>Objectives:</h4>
          <ul>
            <li>
              To establish whether high intensity exercise (HIE) is an effective treatment for
              adults with OCD
            </li>
            <li>To determine whether HIE improves symptoms via anti-inflammatory actions</li>
            <li>
              To determine whether HIE is most effective for those with OCD with evidence of brain
              inflammation
            </li>
            <li>
              To measure inflammatory markers and perform neurocognitive tests
              <ul>
                <li>
                  To search for preliminary evidence supporting the hypotheses that HIE is
                  associated with greater improvements in OCD vs. the control and acts by altering
                  inflammatory and neurocognitive mechanisms of relevance to OCD
                </li>
              </ul>
            </li>
            <li>To identify potential mechanisms as targets for treatment development</li>
          </ul>
          <h4>Description of work:</h4>
          <p>
            The study will run in the UK, benefitting from the NIHR support infrastructure
            (www.nihr.ac.uk) at no extra cost and will be led by an established consortium with
            expertise in OCD, exercise science), immunology, trial design, cognitive science, PPI
            and lived experience of OCD, overseen by the University of Hertfordshire Clinical Trials
            Support Network led by an experienced Clinical Trials Specialist.
          </p>
          <p>The main tasks will be as follows:</p>
          <h5>TASK 1 - Set Up</h5>
          <p>
            <strong>Task 1.1 - Internal set-up (Months 1-3)</strong>
          </p>
          <ul>
            <li>All parties involved to meet and identify goals and objectives.</li>
          </ul>
          <p>
            <strong>Task 1.2 - External set-up (Months 1-3)</strong>
          </p>
          <ul>
            <li>Communication with NHS, Orchard OCD to establish plans for recruitment.</li>
            <li>
              Preparing promotional materials to recruit OCD patients via Orchard OCD and other
              consumer groups.
            </li>
          </ul>
          <h5>TASK 2 - Recruitment</h5>
          <p>
            <strong>Task 2.1 - Promotion of project (Months 4-18)</strong>
          </p>
          <ul>
            <li>
              Promotion via NHS referrals, recruitment from collaborators, Orchard OCD registry and
              other consumer groups.
            </li>
          </ul>
          <p>
            <strong>Task 2.2 - Receiving application from patients (Months 4-18)</strong>
          </p>
          <ul>
            <li>Interested patients to apply online.</li>
          </ul>
          <p>
            <strong>Task 2.3 - Screening of applicants (Months 19-23)</strong>
          </p>
          <ul>
            <li>
              Screening of 200 patients to seek 60 adults (aged 18-65) with over 12 months duration
              of OCD.
            </li>
          </ul>
          <p>
            <strong>Task 2.4 - Finalising list of patients (Month 24-26)</strong>
          </p>
          <ul>
            <li>Finalised list of patients to be shortlisted for the study.</li>
            <li>Applicants to be informed of the outcome of their application.</li>
          </ul>
          <h5>TASK 3 - Follow Up</h5>
          <p>
            <strong>Task 3.1 - Delivery of HIE to patients (Months 27-31)</strong>
          </p>
          <ul>
            <li>
              Patients will undergo detailed BL assessment and allocation-concealed randomisation,
              in a ratio of 1:1, to HIE or relaxation (N=30 per group).
            </li>
            <li>
              HIE standardised in duration and intensity, delivered online as live or pre-recorded
              sessions x3 per week by a registered exercise professional.
            </li>
          </ul>
          <p>
            <strong>Task 3.2 - Assessment of patients</strong>
          </p>
          <ul>
            <li>
              Patients will be assessed by raters blinded to treatment allocation, with outcomes
              compared between treatment arms at weeks 6, 12 (end of acute treatment) and 26 (study
              endpoint).
            </li>
            <li>
              Inflammatory markers between exercise and control arms and time dependent changes in
              the Y-BOCS and explanatory cytokine and IED scores will be considered using standard
              paired comparisons (t-test).
            </li>
          </ul>
          <h5>TASK 4 - Analysis</h5>
          <p>
            <strong>Task 4.1 - Summary of research findings (Months 32-35)</strong>
          </p>
          <ul>
            <li>
              Data from neurocognitive tests and inflammatory markers will be collated and analysed
            </li>
            <li>Drafting a scientific report detailing the outcomes of the project.</li>
          </ul>
          <p>
            <strong>Task 4.2 - Dissemination (Month 36)</strong>
          </p>
          <ul>
            <li>
              Findings presented at international conferences, published in open-access journals and
              actively shared with stakeholders including OCD consumer groups, health professionals
              and policy makers.
            </li>
          </ul>
          <h4>Main role of participants:</h4>
          <ul>
            <li>
              Professor Naomi A Fineberg will lead the PEA-POD pilot study. She will use her
              expertise in both translational (bench-bedside) investigation and clinical management
              of OCD to oversee the project. Naomi leads the NHS England, Highly Specialised Service
              for Obsessive Compulsive and Related Disorders (OCRDS) in developing and delivering
              psychopharmacological, psychological and somatic treatment for the most severely ill
              patients nationwide. Through her leadership roles in OCD research networks and as
              trustee and medical adviser to OCD consumer charities, she has developed strong
              research relationships with several participants of the HIE OCD PEA-POD study and has
              previously successfully conducted OCD studies and published joint findings together.
              She is well placed to lead and deliver this project and to disseminate findings for
              maximum impact among scientists and the public.
            </li>
            <li>
              Dr Lindsay Bottoms specialises in exercise and health physiology and heads the
              Research Centre for Psychology and Sport Science at the University of Hertfordshire.
              She has prior experience investigating high intensity and moderate intensity exercise
              in adults with Crohn’s disease, which was funded by Crohn’s and Colitis UK. Lindsay
              will help to design, manage and conduct this clinical research study, recruit
              participants and conduct the data collection and analysis.
            </li>
            <li>
              Dr David Stewart Baldwin will aid the study through his clinical and research
              experience by investigating the role of neurobiological and psychological factors in
              causing and maintaining illness; through improving trial design when evaluating
              efficacy and tolerability of treatment interventions; by assessing the effectiveness
              and acceptability of treatment interventions in wider clinical practice; through
              identifying more accurately those patient groups at particular risk of poor outcomes.
            </li>
            <li>
              Dr Samuel Robin Chamberlain has been involved in projects that involve large-scale
              population research (&gt;300,000 participants) examining the effects of the Covid-19
              pandemic and lockdown on mental health. His research and clinical background focuses
              on the neurobiology and treatment of impulsive, compulsive, and
              behaviourally-addictive symptoms and traits. In particular, this involves three main
              aims: (1) developing and validating clinical tools; (2) measuring cognitive problems
              and brain circuits that contribute (including vulnerability and chronicity markers);
              and (3) improving existing treatments and developing new ones.
            </li>
            <li>
              Dr David Wellsted has led the Health Research Methods Unit (part of the Centre for
              Health Services and Clinical Research) since 2007, and before that was an active
              member and lead advisor for the Hertfordshire Research and Development Support Group
              from 2004. He will aid the study by providing expertise in the design and delivery of
              clinical trials.
            </li>
            <li>
              Dr Ruihua Hou is an Associate Professor of Biological Psychiatry in the faculty of
              medicine at the university of Southampton. She will contribute to the study by
              uncovering how HIE promotes interactions between the central nervous system and the
              immune system, and how they contribute to neuropsychiatric function.
            </li>
            <li>
              Dr Charlotte Lawson will help with measuring inflammatory markers in the study due to
              her expertise in inflammation and intercellular communication. She will analyse the
              ways in which inflamed cells communicate via release of extracellular vesicles (EV) in
              HIE trained and control group OCD patients.
            </li>
            <li>
              Dr Lynne M Drummond is an Honorary Consultant Psychiatrist at the National Service for
              OCD and BDD based at South West London and St George&apos;s NHs Trust. She is also a
              visiting Professor in the Department of Life and Medical Sciences at the University of
              Hertfordshire. She specialises in OCD as well as Cognitive Behaviour Therapy and will
              help the study by performing neurocognitive tests for participants.
            </li>
            <li>
              Dr Nick Sireau co-founded the UK charity Orchard OCD in order to accelerate the
              development of research into new and better treatments for OCD. As a sufferer of OCD
              he will bring personal and professional experience to the project and enable close
              collaborations between academia, clinical settings and patients.
            </li>
            <li>
              Dr Luca Pellegrini is a Psychiatrist and Clinical Research Fellow with particular
              interest in Obsessive Compulsive and Related Disorders (OCRDs). He will use his
              expertise and skills gained through clinical practice, research activity and academic
              courses/training to help generate the initial study and future clinical trial. He will
              also use methodological and statistical skills for to analyse data and perform
              meta-analyses.
            </li>
            <li>
              Dr Oliver Fox has previously demonstrated the benefits of exercise on inflammation and
              immune cell function in older adults. He will help determine the effects on
              inflammation in both physical and mental health conditions.
            </li>
          </ul>
          <h4>Deliverables:</h4>
          <h5>Clinical outcomes</h5>
          <ul>
            <li>To determine the standard deviation (SD) of the outcome measures</li>
            <li>To inform sample size</li>
            <li>To duration of effect of HIE and to apply intervention efficiently</li>
            <li>
              To identify usefulness &amp; limitations of specific inflammatory markers and
              neurocognitive tests to determine a definitive test battery
            </li>
          </ul>
          <h5>Feasibility outcomes</h5>
          <ul>
            <li>To increase acceptability, tolerability and safety of HIE</li>
            <li>To improve feasibility of recruitment of participants</li>
            <li>To increase willingness of clinicians to recruit participants</li>
            <li>To apply HIE in a non-clinical setting</li>
          </ul>
          <p>The ultimate goal is progression to a full trial, if the following criterias are met:</p>
          <ul>
            <li>Indication that the effect size for HIE versus placebo is &gt;.2</li>
            <li>HIE and study assessments are acceptable to patients</li>
            <li>Clinicians are willing to recruit sufficient patients are willing to take part</li>
          </ul>
          <h4>Milestones:</h4>
          <ul>
            <li>Completed set-up of study Month 3</li>
            <li>Application received from over 200 OCD patients Month 21</li>
            <li>Finalised list of 60 patients involved in study Month 27</li>
            <li>HIE delivered to patients Month 28</li>
            <li>Conclusion of HIE PEA-POD trial Month 30</li>
            <li>Assessment of patients Month 29,30,33</li>
            <li>Dissemination of research outcomes Month 36</li>
          </ul>
          <h3>Gantt chart</h3>
        </Prose>
        <DocFigure
          wide
          file="gantt-work-package-3.png"
          width={600}
          height={402}
          alt="Gantt chart for Work Package 3 across three years of quarters. Subtasks 1.1 and 1.2 run in quarter 1 of year 1. Subtasks 2.1 and 2.2 run from quarter 2 to quarter 4 of year 1 and into quarter 1 of year 2; subtask 2.3 runs in quarters 3 and 4 of year 2; subtask 2.4 runs in quarter 4 of year 2 and quarter 1 of year 3. Subtask 3.1 runs from quarter 1 to quarter 3 of year 3 and subtask 3.2 in quarters 2 and 3 of year 3. Subtask 4.1 runs in quarters 3 and 4 of year 3 and subtask 4.2 in quarter 4 of year 3."
        />
        <Prose className={DOC_PROSE}>
          <h3>Financial projections</h3>
        </Prose>
        <Table
          caption="Work Package 3 financial projection by year"
          head={['Financial Projection', 'Year 1', 'Year 2', 'Year 3', 'Total']}
          rows={[
            [<strong key="engagement">Engagement</strong>, '', '', '', ''],
            ['Patient Recruitment', '£10,000', '', '', '£10,000.00'],
            ['Research Engagement', '£1,000', '£1,000', '£1,000', '£3,000.00'],
            [<strong key="research">Research</strong>, '', '', '', ''],
            ['Research consumables', '£30,000', '£90,000', '£100,000', '£220,000.00'],
            ['Compensation for participants', '', '', '£120,000', '£120,000.00'],
            [<strong key="other">Other</strong>, '', '', '', ''],
            [
              'Staff (e.g. personal trainers, cameraman etc.)',
              '£5,000',
              '£5,000',
              '',
              '£10,000.00',
            ],
            ['Data storage servers', '£500.00', '£500.00', '£500.00', '£1,500.00'],
            ['Literature/open-access publication fees', '£2,000', '£2,000', '£10,000', '£14,000.00'],
            ['Travel expenses/Courier Services', '£20,000', '£20,000', '£20,000', '£60,000.00'],
            [
              <strong key="total">Total</strong>,
              '£68,500',
              '£118,500',
              '£251,500',
              '£438,500.00',
            ],
          ]}
        />
      </PageSection>

      <PageSection
        heading="Work Package 4: Open Treatment Accelerator Programme"
        id="work-package-4"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <p>
            Undertaking research in OCD can be challenging and requires additional support. There is
            a real lack of funding in this area and consequently a lack of treatments and an acute
            unmet patient need.
          </p>
          <p>
            The Open Treatment Accelerator Programme ties in with Orchard’s Objective A, which is to
            develop a programme of individual interlinked preclinical and clinical studies aimed at
            furthering our understanding of OCD. These studies will investigate both the underlying
            pathophysiology of OCD and the efficacy of candidate treatments from a variety of
            perspectives. Orchard aims to maximise impact by ensuring complementarity between
            projects.
          </p>
          <p>
            The Open Treatment Accelerator Programme aims to address Objective A by finding,
            reviewing, and funding hard-to-fund OCD research projects. Candidate projects will be
            judged by Orchard’s Scientific Advisory Board (SAB) according to predefined criteria.
            The SAB is comprised primarily of a group of scientists with diverse expertise in
            psychiatry, neuropsychopharmacology, and cognitive neuroscience, and is therefore
            well-placed to identify the most-cutting edge research with the highest probability of
            success. The best project will receive a grant of £120,000.
          </p>
          <h3>Past Experience</h3>
          <p>Orchard has a record of success in fundraising for promising OCD research projects:</p>
          <ul>
            <li>
              In 2020, Orchard raised over £120,000 through a combination of crowdfunding and
              charitable trust grants to fund research on psilocybin as a potential OCD treatment.
              This study was delayed due to Covid-19, but will start in the autumn of 2021 and will
              last 18 months, recruiting and following up 15 patients.
            </li>
          </ul>
          <h3>Expected Outcomes</h3>
          <ul>
            <li>
              Promising research projects will be identified, with the best project being funded.
              Due to the careful selection process, this is likely to translate to effective
              treatments for OCD patients.
            </li>
            <li>Increased general awareness of OCD research and potential future treatments.</li>
            <li>Increased momentum and discussion within the OCD research space.</li>
          </ul>
          <h3>Work plan</h3>
          <Table
            caption="Work Package 4 identification"
            rows={[
              ['Work package number', 'WP4'],
              ['Start Date or Starting Event', 'September 2022'],
              ['Work package title', 'Open Treatment Accelerator Programme'],
            ]}
          />
          <h4>Objectives:</h4>
          <ul>
            <li>To encourage research on hard-to-fund OCD treatment.</li>
            <li>To crowdfund one of the best projects.</li>
            <li>
              To develop our understanding of the underpinning pathophysiology of OCD and of the
              efficacy of candidate treatments.
            </li>
          </ul>
          <h4>Description of work:</h4>
          <p>
            The programme will involve a global call of proposals every 18 months in order to find
            hard-to-fund projects. During each cycle, various research teams from around the world
            will pitch their research ideas and plans to Orchard. The Scientific Advisory Board of
            Orchard will be responsible for judging and finding the best project, based on the
            following criteria:
          </p>
          <ol>
            <li>Scientific validity: how strong is the science?</li>
            <li>
              Clinical opportunity: does the project have potential to get a treatment for OCD
              rapidly into the clinic?
            </li>
            <li>Team track record: how credible is the team implementing the project?</li>
          </ol>
          <p>
            A grant of £120,000 will be awarded to the selected research team to continue their
            research or progress it to a higher level. For each grant, half of the total value of
            the grant will be crowdfunded and half will be provided by Orchard (£60,000 each).
          </p>
          <p>The main tasks will be as follows:</p>
          <h5>TASK 1 - Drafting call for proposals</h5>
          <p>
            <strong>Task 1.1 - Drafting call for proposals documents (Month 1, Weeks 1-2)</strong>
          </p>
          <ul>
            <li>
              Documents may include information on the application process, candidate requirements
              and timeline, and will be drafted by the Communications and Fundraising Officer.
            </li>
          </ul>
          <p>
            <strong>Task 1.2 - Designing promotional material (Month 1, Weeks 3-4)</strong>
          </p>
          <ul>
            <li>Promotional material will be designed by outsourced graphic designers.</li>
          </ul>
          <h5>TASK 2 - Opening call for proposals</h5>
          <p>
            <strong>Task 2.1 - Distribution of promotional materials (Month 2)</strong>
          </p>
          <ul>
            <li>
              Materials will be distributed through direct email communication with research
              institutes, Orchard’s website, and social media.
            </li>
          </ul>
          <p>
            <strong>Task 2.2 - Accepting proposal submissions from research teams (Months 2-5)</strong>
          </p>
          <ul>
            <li>
              The Communications and Fundraising Officer will be responsible for tracking and
              acknowledging receipt of all applications as well as fielding any queries from
              applicants. He/she will sort applications into a convenient format for the SAB to
              review.
            </li>
          </ul>
          <h5>TASK 3 - Review and judging</h5>
          <p>
            <strong>
              Task 3.1 - SAB junior members review all proposals and prepare shortlist (Months 6-7)
            </strong>
          </p>
          <ul>
            <li>
              Around one-third of applications will be shortlisted for the next round based on the
              aforementioned criteria. A brief report/summary to be produced for each shortlisted
              application for SAB senior members to review.
            </li>
          </ul>
          <p>
            <strong>
              Task 3.2 - SAB senior members review shortlisted proposals and pick top three (Months
              7-8)
            </strong>
          </p>
          <ul>
            <li>
              Senior members will review all shortlisted applications and reports from junior
              members to select the three best proposals.
            </li>
          </ul>
          <p>
            <strong>Task 3.3 - Entire SAB select grant recipient from top three (Months 8-9)</strong>
          </p>
          <ul>
            <li>
              Entire SAB along with representatives from Orchard will meet to review the final three
              proposals and select the grant recipient.
            </li>
          </ul>
          <p>
            <strong>Task 3.4 - Orchard announce final decision (Months 9)</strong>
          </p>
          <ul>
            <li>
              The grant recipient along with the two runners-up will be published on Orchard’s
              website and social media by the Communications and Fundraising Officer. All grant
              applicants will also be notified of the decision via email.
            </li>
          </ul>
          <h5>TASK 4 - Follow up</h5>
          <p>
            <strong>
              Task 4.1 - Orchard request a report and presentation from grant recipient six months
              after award of grant to keep track of research progress (Month 15, Weeks 1-2)
            </strong>
          </p>
          <ul>
            <li>
              The report and presentation should include the progress of the research since
              receiving the grant, any challenges or scientific difficulties encountered, and an
              estimation of the future research direction and developments.
            </li>
          </ul>
          <p>
            <strong>Task 4.2 - Orchard issue research update (Month 15, Weeks 3-4)</strong>
          </p>
          <ul>
            <li>
              A brief research update accessible to a layman will be provided to Orchard by the
              grant recipient. This will be published on Orchard’s website and social media by the
              Communications and Fundraising Officer.
            </li>
          </ul>
          <h4>Main role of participants:</h4>
          <ul>
            <li>
              The research teams will need to pitch their research ideas/projects to Orchard and its
              Scientific Advisory Board. They will be required to:
              <ul>
                <li>Provide documentation and scientific reports on their past/current projects</li>
                <li>Meet with representatives from Orchard to discuss their research progress</li>
              </ul>
            </li>
          </ul>
          <h4>Deliverables:</h4>
          <ul>
            <li>
              To provide funding for the best research project, hopefully translating to effective
              treatments for OCD patients.
            </li>
            <li>To raise awareness on the topic of OCD research and treatment.</li>
            <li>
              To increase activity and drive in the OCD research space by providing a new funding
              opportunity.
            </li>
          </ul>
          <h4>Milestones:</h4>
          <ul>
            <li>
              Key milestones described in detail above but listed briefly here for convenience:
              <ul>
                <li>Task 1 - Drafting call for proposals. Month 1</li>
                <li>Task 2 - Opening call for proposals. Months 2-5</li>
                <li>Task 3 - Review and judging. Months 6-9</li>
                <li>Task 4 - Follow up. Month 15</li>
              </ul>
            </li>
            <li>
              For the first three years, one grant will be awarded per year; for years 4 and 5, two
              grants will be awarded per year.
            </li>
          </ul>
          <h3>Gantt chart</h3>
        </Prose>
        <DocFigure
          wide
          file="gantt-work-package-4.png"
          width={759}
          height={403}
          alt="Gantt chart for Work Package 4 across two years by month. Subtasks 1.1 and 1.2 run in September of year 1. Subtask 2.1 runs in October and subtask 2.2 from October to January. Subtask 3.1 runs in February and March, subtask 3.2 in March and April, subtask 3.3 in April and May and subtask 3.4 in May. Subtask 4.1 runs in November of year 2 and subtask 4.2 in November and December of year 2."
        />
        <Prose className={DOC_PROSE}>
          <h3>Financial projections</h3>
          <p>Costs specific to Open Treatment Accelerator Programme:</p>
        </Prose>
        <Table
          caption="Work Package 4 financial projection by year"
          head={[
            'Financial Projection',
            'Year 1',
            'Year 2',
            'Year 3',
            'Year 4',
            'Year 5',
            'Total',
          ]}
          rows={[
            [<strong key="staff">Staff/Admin</strong>, '', '', '', '', '', ''],
            [
              'Communication Officer',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£125,000',
            ],
            [<strong key="marketing">Marketing</strong>, '', '', '', '', '', ''],
            ['Design', '£600', '£600', '£600', '£600', '£600', '£3,000'],
            [<strong key="research">Research</strong>, '', '', '', '', '', ''],
            [
              'Research Funding',
              '£120,000',
              '£120,000',
              '£120,000',
              '£240,000',
              '£240,000',
              '£840,000',
            ],
            [
              <strong key="total">Total</strong>,
              '£145,600',
              '£145,600',
              '£145,600',
              '£265,600',
              '£265,600',
              '£968,000',
            ],
          ]}
        />
      </PageSection>
      <PageSection
        heading="Work Package 5: Smartphone app to improve cognitive flexibility and reduce contamination fears in OCD"
        id="work-package-5"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <p>
            Treatment options for OCD are limited. The most common interventions include selective
            serotonin reuptake inhibitors (SSRI), designed for other mental disorders, and cognitive
            behavioural therapy (CBT). However, SSRI’s are often associated with side-effects and as
            many as 40% of OCD patients do not respond to CBT. Moreover, these treatments are often
            costly and labour intensive. Innovative technology-based therapies have the potential to
            transform OCD treatment. We aim to test the use of a smartphone-based app, tailored to
            the individual, to improve contamination fears and excessive washing behaviours. The app
            has previously been successfully used in individuals with contamination fears but
            without an OCD diagnosis.
          </p>
          <h3>Work plan</h3>
          <Table
            caption="Work Package 5 identification"
            rows={[
              ['Work package number', 'WP5'],
              ['Start Date or Starting Event', 'September 2022'],
              [
                'Work package title',
                'Smartphone app to improve cognitive flexibility and reduce contamination fears in OCD',
              ],
            ]}
          />
          <h4>Objectives:</h4>
          <ul>
            <li>
              To determine the efficacy of a smartphone-based app at alleviating OCD symptoms,
              contamination fears and enhancing mood.
            </li>
            <li>To test whether smartphone interventions are able to improve cognitive flexibility.</li>
            <li>
              To create an easily accessible smartphone app with the potential to be rapidly
              introduced into clinical practice.
            </li>
          </ul>
          <h4>Description of work:</h4>
          <p>
            Participants will be randomised into one of three conditions: the washing condition
            (smartphone intervention I), contamination condition (smartphone intervention II), or
            the control (hand-movement) condition. Participants in the three groups will be actively
            matched for age, gender, years of education and level of contamination fear.
            Participants will be asked to watch a video recording of themselves four times a day for
            the duration of three weeks. In the smartphone intervention I, participants will watch
            themselves engaging in hand washing (N=50); smartphone intervention II participants will
            watch themselves repeatedly touching a disgust-inducing object (N=50); and the control
            condition (N=50) will require participants to watch themselves performing sequential
            hand movements.
          </p>
          <p>
            Before and after the interventions, participants will be asked to complete five
            questionnaires assessing contamination fears, OCD symptomatology and mood. The
            post-intervention will be collected via web-based testing.
          </p>
          <p>
            Before and after the intervention, participants will be asked to complete two
            neuropsychological tests assessing cognitive flexibility. The post-intervention will be
            collected via web-based testing.
          </p>
          <p>The main tasks will be as follows:</p>
          <h5>TASK 1 - Preparation for the app</h5>
          <p>
            <strong>Task 1.1 - App development and review (Months 1-2)</strong>
          </p>
          <ul>
            <li>App development is led by Thomas Piercy, in cooperation with the project team.</li>
            <li>Videos, questionnaires and app interface are prepared.</li>
            <li>Review by other relevant scientists and participants.</li>
            <li>
              Possibly, a feedback questionnaire sent to a small number of participants about ease
              of use and practical/technical issues.
            </li>
          </ul>
          <h5>TASK 2 - Patients Recruitment</h5>
          <p>
            <strong>
              Task 2.1 - Identification and recruitment of suitable participants (Months 3-10)
            </strong>
          </p>
          <ul>
            <li>
              Recruitment criteria: aged 18 to 60, confirmed primary diagnosis of OCD and elevated
              levels of contamination fears, as defined by a minimum score of 10 on the Padua
              Inventory Contamination Fear Subscale.
            </li>
            <li>
              Recruitment from the local community via online forums, charity websites, flyers,
              newspaper adverts, mailing lists and volunteer databases.
            </li>
            <li>Recruitment via Orchard patient registry.</li>
          </ul>
          <h5>TASK 3 - Conduction of Trial (over a maximum of 6 months if necessary)</h5>
          <p>
            <strong>
              Task 3.1 - Pre-Intervention Questionnaires &amp; Neuropsychological Tests (Months 5-8)
            </strong>
          </p>
          <ul>
            <li>
              Introduction, pre-intervention questionnaires and neuropsychological tests will be
              conducted on dedicated testing sites.
            </li>
            <li>
              Participants are grouped depending on their time availability and time of signing up
              for the trial.
            </li>
          </ul>
          <p>
            <strong>
              Task 3.2 - App Usage (3 weeks per participants, with a total duration of up to 4
              months if necessary) (Months 6-9)
            </strong>
          </p>
          <ul>
            <li>Technical support via email and messaging function in app for any technical queries.</li>
            <li>
              To prevent participants from discontinuing the trial, reminder emails or app
              notifications may be used.
            </li>
            <li>
              If they choose to withdraw participation from the study, participants may contact the
              project team at any time.
            </li>
          </ul>
          <p>
            <strong>
              Task 3.3 - Post-Intervention Questionnaires &amp; Neuropsychological Tests (Months
              7-10)
            </strong>
          </p>
          <ul>
            <li>
              Upon completing the 3 weeks, participants complete the questionnaires and
              neuropsychological tests online.
            </li>
            <li>Technical assistance is provided if necessary.</li>
            <li>
              Should these or any other issues prevent completion, specific participants may be
              allowed to repeat the questionnaires and tests.
            </li>
          </ul>
          <p>
            <strong>Task 3.4 - Participant Feedback Survey (Months 7-10)</strong>
          </p>
          <ul>
            <li>
              An online anonymous feedback form is sent to all participants: feedback on the app
              (ease of use and design of interface), emotional reactions, perceived outcomes of the
              trials
            </li>
          </ul>
          <h5>TASK 4 - Analysis and presentation</h5>
          <p>
            <strong>Task 4.1 - Analysis &amp; Interpretation (Months 11-14)</strong>
          </p>
          <ul>
            <li>
              Results from the trial are analysed and interpreted by the postdoctoral research
              associate and the primary investigator.
            </li>
          </ul>
          <p>
            <strong>Task 4.2 - Publishing and Presentations (Month 15)</strong>
          </p>
          <ul>
            <li>Results are published in a relevant journal.</li>
            <li>
              Presentations may be given in Orchard conferences, as well as in external scientific
              conferences and OCD patient talks.
            </li>
          </ul>
          <h5>TASK 5 - Outlook</h5>
          <p>
            <strong>Task 5.1 - Meetings to discuss the future outlook of the results (Month 16)</strong>
          </p>
          <ul>
            <li>
              Potential topics to be discussed:
              <ul>
                <li>Reflection on the trial and the effectiveness of the app</li>
                <li>Further research trials necessary</li>
                <li>
                  Further app development and adjustment, based on participants feedback and
                  consulting with experts
                </li>
                <li>
                  Any partners/scientists/investors to reach out to for collaboration/expansion
                </li>
                <li>Strategies to reach out to patients and introduce the app into clinical practice</li>
              </ul>
            </li>
          </ul>
          <h4>Main role of participants:</h4>
          <ul>
            <li>
              Professor Barbara J. Sahakian (Primary Investigator): oversees the research associate
              (substantial performance history)
            </li>
            <li>
              Thomas Piercy (Programmer): dedicated programmer and technology expert, with an
              extensive track record in this domain. Responsible for smartphone app development
            </li>
            <li>Psychiatrist (Medical Advisor)</li>
            <li>
              Dr Christelle Langley (Postdoctoral Research Associate): oversees the study, collect
              and analyse the data
            </li>
          </ul>
          <h4>Deliverables:</h4>
          <ul>
            <li>
              To generate results on the effectiveness of the app on alleviating OCD symptoms,
              contamination fears and enhancing mood.
            </li>
            <li>
              To generate results on the effectiveness of the app on improving cognitive
              flexibility.
            </li>
            <li>
              To collect feedbacks from the participants on app interface and videos for improved
              app experience
            </li>
          </ul>
          <h4>Milestones:</h4>
          <ul>
            <li>App is fully developed. Months 1-2</li>
            <li>Patients are recruited and screened for suitability. Months 3-10</li>
            <li>
              Pre-intervention surveys and questionnaires are administered and data is collected.
              Months 5-8
            </li>
            <li>
              Participants complete the 3 week smartphone app individualised therapy and app usage
              is monitored. Months 6-9
            </li>
            <li>
              Post-intervention surveys and questionnaires are administered and data is collected.
              Months 7-10
            </li>
            <li>Overall collation of data, data analysis and interpretation. Months 11-14</li>
            <li>Results are written up, published and presented. Month 15</li>
            <li>Future plans are discussed and organised. Month 16</li>
          </ul>
          <h3>Gantt chart</h3>
        </Prose>
        <DocFigure
          wide
          file="gantt-work-package-5.png"
          width={760}
          height={403}
          alt="Gantt chart for Work Package 5 across two years by month. Subtask 1.1 runs in September and October of year 1. Subtask 2.1 runs from November of year 1 to June of year 2. Subtask 3.1 runs from January to April, subtask 3.2 from February to May, subtask 3.3 from March to June and subtask 3.4 from March to June of year 2. Subtask 4.1 runs from July to October and subtask 4.2 in November of year 2. Subtask 5.1 runs in December of year 2."
        />
        <Prose className={DOC_PROSE}>
          <h3>Financial projections (for 16 months)</h3>
        </Prose>
        <Table
          caption="Work Package 5 financial projection over 16 months"
          head={['Financial Projections', 'Costs for 16 Months']}
          rows={[
            [<strong key="salaries">Salaries</strong>, ''],
            ['Postdoctoral salary', '£48,860.25'],
            [<strong key="research">Research</strong>, ''],
            ['Participant Remuneration', '£3,000'],
            ['Web-Based Testing', '£1,000'],
            ['App Development Related Costs', '£1,626'],
            [<strong key="others">Others</strong>, ''],
            ['Equipment *', '£1,000'],
            ['Travel (Participant and Research Team)', '£5,000'],
            [<strong key="total">Total</strong>, '£60,486.25'],
          ]}
        />
        <Prose className={DOC_PROSE}>
          <p>
            * Purchasing of a small number of equipment to ensure participants are not excluded
            based on the technology they own. These devices will be returned to the research team
            upon completion of the study and will only be able to host the app and will have no
            other functionality.
          </p>
        </Prose>
      </PageSection>

      <PageSection
        heading="Work Package 6: OCD Patient Registry"
        id="work-package-6"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <p>
            High quality data from long-term clinical trials is essential for developing new
            treatments for OCD because of the limited use of animal models in testing
            psychotherapies and the lack of complex OCD correlates between humans and lab animals.
          </p>
          <p>
            This task is complicated by the heterogeneity of OCD symptoms. The different
            manifestations of OCD from excessive cleanliness to intrusive thoughts may have
            different treatment outcomes. For example, high dose SSRIs show lower success rates as a
            result of different manifestations of OCD.
          </p>
          <p>
            The aim of the OCD patient registry is to Facilitate research into OCD by decreasing
            effort and time spent recruiting patients for trials and to gather more systematic data
            and a pool of more committed volunteers which may improve long-term trial outcomes. In
            addition, patients feel part of a community by having the opportunity to contribute to
            research and therefore to aid the development of new knowledge and new treatment for OCD
          </p>
          <h3>Work plan</h3>
          <Table
            caption="Work Package 6 identification"
            rows={[
              ['Work package number', 'WP6'],
              ['Start Date or Starting Event', 'September 2022'],
              ['Work package title', 'International Patient Registry'],
            ]}
          />
          <Table
            caption="Work Package 6 team roles"
            rows={[
              [
                'Head',
                'Oversees programme, coordinates logistics, leads annual meetings of the consortium',
              ],
              [
                'Registry Steering Committee',
                'Committee that mediates access of studies to the database',
              ],
              [
                'Communications Lead',
                'Lists of current studies with participant characteristics and study team contact details will be made available. Registrants will be contacted as a reminder to update their details',
              ],
              [
                'Clinical Trials Support Network',
                'Provide access to facilities and infrastructure required to produce and maintain the database for the registry',
              ],
            ]}
          />
          <h4>Participating Partners</h4>
          <Table
            caption="Work Package 6 participating partners"
            rows={[
              [
                'Confirmed Partners',
                <ul key="confirmed">
                  <li>Scientific Advisory Board of Orchard</li>
                  <li>University of Hertfordshire CTSN (Clinical Trials Support Network)</li>
                </ul>,
              ],
              [
                'Potential Partners',
                <ul key="potential">
                  <li>
                    Academic institutes (University of Pittsburgh/Imperial College London/Stanford
                    University)
                  </li>
                  <li>
                    Clinical institutes (Hertfordshire Partnerships Mental Health Trust, Queen
                    Elizabeth II Hospital/South West London and St George’s NHS Mental Health Trust)
                  </li>
                  <li>Pharmaceutical and Biotechnology companies (AstraZENECA/Sosei-Heptares)</li>
                  <li>Government agencies</li>
                  <li>Foundation for OCD Research</li>
                </ul>,
              ],
            ]}
          />
          <h4>Objectives:</h4>
          <ul>
            <li>
              To set up an OCD patient registry designed to facilitate clinical trials for OCD
              therapeutics (Task 1)
            </li>
            <li>To mediate access between study teams and patients (Task 2)</li>
            <li>To maintain the database and ensure that patients’ details are up-to-date (Task 3)</li>
          </ul>
          <h4>Description of work:</h4>
          <p>
            We will set up an OCD patient registry with the database created by CTSN. Participants
            will enter details relevant to their medical status and condition, and regular
            communication with the patients will ensure that details will be kept current and
            relevant. Studies that wish to access the registry will do so through the registry
            steering committee and will submit details of participants required and study timelines.
            If approved, study details will be provided to relevant participants. Patients will also
            have access to a list of current studies with participant requirements. Maintenance will
            be provided by the CTSN on a yearly contract basis.
          </p>
          <h5>TASK 1 - Creating an OCD patient registry</h5>
          <p>
            <strong>Task 1.1 - Gauge interest in patient registry (Month 1)</strong>
          </p>
          <p>
            Orchard will gauge interest in a patient registry from stakeholders to ensure that a
            patient registry is an effective solution to the problems of clinical trial recruitment.
            Orchard will contact patients to ensure that there is sufficient demand for a registry
            and hence increase uptake by asking if patients like the idea, see the benefits and
            would be likely to sign up. Orchard will contact the teams of current, past and future
            studies to determine if a registry is beneficial from a scientists’ points of view, and
            whether teams would be willing to recruit study participants through a registry. If
            sufficient interest is found, Orchard can proceed with task 1.2.
          </p>
          <p>
            <strong>
              Task 1.2 - Pilot model created and tested with limited pool of patients (Months 2-4)
            </strong>
          </p>
          <p>
            CTSN will create a pilot model of the database, where patients can enter the following
            details: registry ID (generated by database), demographic information, clinical status
            at registration, nature of diagnosis, time of diagnosis, time of first symptoms, current
            treatment, availability, contact details. The pilot model will be disseminated to a
            limited number of patients which fit the criteria for a certain OCD trial about to take
            place, and that OCD study will be invited to contact the patients through the database.
          </p>
          <p>
            <strong>
              Task 1.3 - Pilot model improved and patient registry is publicised (Month 5-7)
            </strong>
          </p>
          <p>
            If the pilot model is deemed sufficiently suitable, the registry can be given the green
            light. Feedback is gathered from patients and the study team is gathered and
            improvements to the database are made on the basis of this feedback. After the database
            is improved, Orchard publicises the new registry by contacting patients and scientific
            teams. This is done by leveraging the wide networks of the journalists and scientists on
            Orchard’s team.
          </p>
          <h5>TASK 2 - Mediate access between study teams and patients</h5>
          <p>
            <strong>Task 2.1 - Selection of the Registry Steering Committee (Months 8-9)</strong>
          </p>
          <p>
            The registry steering committee is selected and assembled. The committee members must be
            able to evaluate clinical trials and hence will be selected for their experience with
            OCD clinical trials.
          </p>
          <p>
            <strong>
              Task 2.2 - Registry Steering Committee allow select studies access to the database
              (continuous, Months 10-48)
            </strong>
          </p>
          <p>
            After the database has been set up, Orchard can continue to contact studies that may be
            interested in using the registry but eventually the registry will be sufficiently
            well-known that studies wishing to use the database will contact the Registry Steering
            Committee. Study teams will submit a request for support identifying the characteristics
            of the patients required for a study, the study aims and timelines. If the request is
            supported, the registry would provide study details directly to the relevant registrants
            via their chosen communication method. The registrants can then choose whether to
            contact the study team for further information about the study.
          </p>
          <h5>TASK 3 - Database maintenance</h5>
          <p>
            <strong>
              Task - 3.1 - Robustness and user testing throughout the process (continuous, Months
              10-48)
            </strong>
          </p>
          <p>
            The CTSN will be employed on a yearly contract basis to ensure the robustness and the
            integrity of the database. This will include continuously evaluating the security of the
            database and including the required security defences to prevent the leak of patient
            details. Any technical problems with using the database will be monitored and solved by
            the CTSN and patients will be contacted regarding their experience of using the
            database.
          </p>
          <p>
            <strong>Task - 3.2 Regular communication with registry patients (Months 16-48)</strong>
          </p>
          <p>
            In order to fulfill the important aim of involving patients in OCD research and
            fulfilling their desires to contribute to research and to the OCD community, a list of
            trials and their criteria will be made widely available. Registrants will be regularly
            contacted to remind them to update their statuses and preferences.
          </p>
          <h4>Deliverables:</h4>
          <ul>
            <li>To gauge interest in a registry from stakeholders, patients and scientists. Months 1-2</li>
            <li>
              To make pilot model created by CTSN with a limited pool of patients and publicises the
              registry through awareness raising campaigns Months 2-7
            </li>
            <li>
              To make the registry open to study teams to access the services of the OCD registry
              (supported by Registry Steering Committee) Month 8
            </li>
            <li>To provide ongoing maintenance on a yearly contract with CTSN Months 8-60</li>
            <li>
              To make patients feel more involved in OCD research (assessed via a survey each year)
              Months 8-60
            </li>
          </ul>
          <h4>Milestones</h4>
          <ul>
            <li>
              Orchard will create a pilot model with CTSN and will test the model with a limited
              pool of patients Months 1-7
            </li>
            <li>Registry Steering Committee will be selected Month 8</li>
            <li>
              Registry will be open to study teams to access the services of the OCD registry. Months
              7-12
            </li>
          </ul>
          <h3>Gantt Chart</h3>
        </Prose>
        <DocFigure
          wide
          file="gantt-work-package-6.png"
          width={919}
          height={411}
          alt="Gantt chart for Work Package 6 across five years of quarters. Subtask 1.1 runs in quarter 1 of year 1, subtask 1.2 in quarter 2 and subtask 1.3 in quarter 3. Subtask 2.1 runs in quarter 3 of year 1 and subtask 2.2 from quarter 4 of year 1 to the end of year 5. Subtask 3.1 runs from quarter 4 of year 1 to the end of year 5 and subtask 3.2 from quarter 1 of year 2 to the end of year 5."
        />
        <Prose className={DOC_PROSE}>
          <h3>Financial projections</h3>
        </Prose>
        <Table
          caption="Work Package 6 financial projection by year"
          head={[
            'Financial Projection',
            'Year 1',
            'Year 2',
            'Year 3',
            'Year 4',
            'Year 5',
            'Total',
          ]}
          rows={[
            [<strong key="team">Project Team</strong>, '', '', '', '', '', ''],
            ['Staff', '£20,000', '£20,000', '£20,000', '£20,000', '£20,000', '£100,000'],
            [
              'IT (collaboration with CTSN)',
              '£10,000',
              '£10,000',
              '£10,000',
              '£10,000',
              '£10,000',
              '£50,000',
            ],
            [<strong key="engagement">Project Engagement</strong>, '', '', '', '', '', ''],
            ['Kick-off meeting', '£2,000', '', '', '', '', '£2,000'],
            ['Public engagement', '£3,000', '£2,000', '£2,000', '£2,000', '£2,000', '£10,000'],
            [<strong key="monitoring">Project Monitoring</strong>, '', '', '', '', '', ''],
            ['Website maintenance', '£1,000', '£2,000', '£2,000', '£2,000', '£2,000', '£9,000'],
            ['Annual assessment', '£2,000', '£3,000', '£3,000', '£3,000', '£3,000', '£14,000'],
            [<strong key="others">Others</strong>, '', '', '', '', '', ''],
            ['Travel expenses', '£2,000', '£3,000', '£3,000', '£3,000', '£3,000', '£15,000'],
            [
              <strong key="total">Total</strong>,
              '£40,000',
              '£40,000',
              '£40,000',
              '£40,000',
              '£40,000',
              '£200,000',
            ],
          ]}
        />
      </PageSection>
      <PageSection
        heading="Work Package 7: Proposal for a Randomised Double-blind Placebo-controlled study of Tolcapone for OCD"
        id="work-package-7"
        tone="ruled"
      >
        <Prose className={DOC_PROSE}>
          <p>
            Current first-line treatments for obsessive-compulsive disorder (OCD) include cognitive
            behavioral therapy using exposure and response prevention, or serotonin reuptake
            inhibitors (SRIs) (Skapinakis et al., 2016). While helpful for many, not everyone can
            tolerate these interventions (e.g. SRIs often have intolerable sexual side effects), or
            find trained therapists, and up to 35% of people do not experience adequate symptom
            relief (Grant, 2014). Other pharmacological agents are therefore needed.
          </p>
          <p>
            Tolcapone, a catechol-O-methyl-transferase (COMT) inhibitor, is used in some countries
            (including the UK and USA) as an add-on agent for the management of Parkinson’s Disease.
            The enzyme COMT serves to break down free dopamine in the prefrontal cortex; by blocking
            this enzyme, tolcapone enhances dopamine signaling in the cortex. In the frontal cortex,
            optimal dopamine modulation of prefrontal cortical networks is necessary for a variety
            of cognitive functions, including planning, inhibition, attention, and response
            flexibility (Tunbridge et al., 2004). Importantly, dysfunction of many of these
            cognitive domains has been implicated in OCD (Chamberlain et al., 2005).
          </p>
          <p>
            We recently conducted a proof of concept pilot study using tolcapone in patients with
            OCD using a double-blind, cross-over two-week design (Grant et al., 2021). Two weeks of
            tolcapone was associated with significant improvement in OCD versus two weeks of placebo
            (t=2.194, p=0.0409). The mean percentage decreases in total symptom severity scores for
            the entire sample over the corresponding two-week periods were 16.4% for tolcapone and
            3.6% for placebo. These data strongly support the need for formal treatment trial of
            appropriate sample size and duration to characterize the efficacy of tolcapone in OCD.
          </p>
          <h3>SIGNIFICANCE</h3>
          <p>
            Current pharmacological treatment of OCD relies on the use of an SRI which is then
            augmented when ineffective. SRIs are often not tolerated by people with OCD due to side
            effects, or are ineffective. We propose testing a novel pharmacological approach,
            independent of SRIs, which has the potential to broaden our intervention options for
            OCD. We also explore whether this novel pharmacological approach can help with cognitive
            problems people with OCD often experience, and whether this relates to therapeutic
            response. Existing first-line treatments do not ameliorate the cognitive difficulties
            associated with OCD, yet these problems can impede quality of life and everyday
            functioning.
          </p>
          <h3>Work plan</h3>
          <Table
            caption="Work Package 7 identification"
            rows={[
              ['Work package number', 'WP7'],
              ['Start Date or Starting Event', 'September 2022'],
              [
                'Project Title',
                'Double-blind Randomised Placebo-controlled study of Tolcapone for OCD',
              ],
              [
                'Investigators: Professor Sam Chamberlain, Professor David Baldwin, Professor Jon Grant',
                'Oversee programme, coordinate logistics, design and conduct the trial, publication and dissemination of findings.',
              ],
              [
                'Confirmed Partners',
                <ul key="confirmed">
                  <li>University of Southampton, UK</li>
                  <li>University of Chicago, USA</li>
                  <li>Scientific Advisory Board of Orchard</li>
                </ul>,
              ],
            ]}
          />
          <h4>Objectives:</h4>
          <p>
            Based on the mechanism of action and our previous pilot data, the primary aim of the
            present study is to examine the efficacy and safety of 12-week treatment with tolcapone
            vs. placebo in adults with moderate to severe OCD, as indicated by a score of at least
            21 on the Yale Brown Obsessive Compulsive Scale (YBOCS), a scale of illness severity, at
            the baseline visit. We hypothesize that tolcapone will significantly improve symptoms of
            OCD compared to placebo.
          </p>
          <p>
            A secondary aim of the proposed study is to examine the cognitive effects of tolcapone
            in OCD, by conducting objective neuropsychological tasks pre- and post-pharmacological
            trial. The rationale for this approach is that: dopamine plays a key role in cognition;
            cognitive effects of tolcapone are likely to be relevant in explaining symptomatic
            effects; and cognitive dysfunction constitutes an important treatment target in OCD that
            is not generally ameliorated by current first-line interventions. We hypothesize that any
            symptomatic benefit with tolcapone would also be associated with improvement in
            executive functions including cognitive flexibility. Another secondary aim of the
            proposed study is to evaluate whether the single nucleotide polymorphism (SNP)
            Val-158-Met polymorphism significantly relates to changes in symptoms and cognition
            observed with tolcapone. Prior data indicate cognitive effects of tolcapone are affected
            by this SNP. We hypothesize that the val/val COMT variant will be associated with
            significantly higher tolcapone-related improvements in cognition and symptoms, since
            this is linked to lower cortical dopamine function.
          </p>
          <h4>Description of work:</h4>
          <h5>TASK 1 - Preparation</h5>
          <p>
            <strong>
              Task 1.1 - Finalise the study protocol and submit it for regulatory approval (Month
              1-6)
            </strong>
          </p>
          <p>
            We will contact experts and patients for their views on the study to finalise the study
            protocol. This will then be submitted for pre-registration and for regulatory (including
            ethics) approvals.
          </p>
          <h5>TASK 2 - Recruitment and data collection</h5>
          <p>
            <strong>Task 2.1 - Patient recruitment (Month 6-18)</strong>
          </p>
          <p>
            100 individuals with OCD will be recruited for a parallel, double-blind, randomised
            placebo-controlled study in which tolcapone or placebo is administered in a 1:1 fashion.
            All 100 participants will have current OCD per DSM-5 criteria. Half will be recruited
            from each research site (~50 from University of Southampton, ~50 from University of
            Chicago).
          </p>
          <p>
            <strong>Task 2.2 - Outpatient recruitment (Month 6-18)</strong>
          </p>
          <p>
            100 male and female outpatients aged 18-65 with a current primary diagnosis of OCD will
            be enrolled. Inclusion criteria: 1) Men and women age 18-65; 2) Primary diagnosis of
            OCD; 3) YBOCS score of at least 21 at baseline (moderate or higher severity); 4) Ability
            to understand and sign the consent form. Exclusion criteria: 1) Unstable medical
            illness; 2) Current pregnancy or lactation, or inadequate contraception in women of
            childbearing potential; 3) Subjects considered an immediate suicide risk; 4) History of
            psychosis or bipolar disorder based on DSM-5 criteria; 5) Alcohol/substance use disorder
            and/or illegal substance use based on urine toxicology; 6) Initiation of psychological
            interventions within 3 months of screening (those who are continuing with CBT will be
            included); 7) Use of any new psychotropic medication within 3 months of study entry
            (stable doses of psychotropics will be allowed); 8) Major cognitive impairment that
            interferes with the capacity to understand and self-administer medication or provide
            written informed consent; 9) abnormal liver function tests at baseline; 10) MADRS &gt;30
            at baseline.
          </p>
          <p>
            <strong>Task 2.3 - Treatment and assessment (Month 18-30)</strong>
          </p>
          <p>
            Following baseline measures, subjects will receive tolcapone (initially 100mg twice per
            day) or inactive placebo. Dose will be increased, if tolerated, from 100mg twice daily
            to 200mg twice daily at week 6. Participants will be seen every 2 weeks during the
            12-week period. At week 12, subjects will start a 1-week taper off the medication.
            Efficacy and safety measures will be performed at each visit.
          </p>
          <p>
            Assessments at each visit: Those subjects who appear appropriate for the study, based on
            telephone screening, will be invited for a baseline assessment. The duration of the
            baseline assessment will be last between 90-120 minutes and will include the following:
            Informed consent, Demographic data, Concomitant medications, Family history data,
            Medical evaluation including physical examination, weight, and vital signs, Urine
            pregnancy test and urine drug screen, and a psychiatric evaluation (using the MINI
            International Neuropsychiatric Interview); Depressive symptoms will be rated with the
            Montgomery-Asberg Depression Rating Scale (MADRS); Anxiety symptoms will be assessed
            using the Hamilton Anxiety Rating Scale; Psychosocial functioning will be evaluated using
            the Sheehan Disability Scale; Quality of Life Inventory; and the Columbia Suicide
            Severity Rating Scale (C-SSRS)). The COMT polymorphism will be quantified using a
            convenient saliva sample collected from participants during the study.
          </p>
          <p>
            The primary outcome measure will be the change from baseline using the YBOCS. Cognitive
            Assessments will be performed as secondary outcomes: Participants will undergo cognitive
            assessments at baseline and at study endpoint. Assessments of executive functions shall
            be comprised of several extensively validated paradigms. The choice of cognitive
            challenges was based on the clinical features of OCD, knowledge from animal and human
            literature regarding the likely role of the prefrontal dopamine system in cognition, and
            previous research (including meta-analysis) has found that individuals with OCD often
            exhibit significant deficits of executive functioning and cognitive flexibility (Bora,
            2020; Chamberlain et al., 2021). The order of the tasks will be fixed and participants
            will complete the tasks at first visit (baseline) and endpoint.
          </p>
          <p>
            The study will monitor for adverse events and undertake reporting of serious adverse
            events per standard procedures. Liver function tests (LFTs) shall be measured at
            baseline, and after 6- and 12-weeks of treatment.
          </p>
          <h5>TASK 3 - Data analysis and publication</h5>
          <p>
            <strong>
              Task 3.1 - Analysis of findings using statistical methodology (Month 30-33)
            </strong>
          </p>
          <p>
            Data analysis will involve all visits during the 12-week double-blind treatment phase
            (up until week 12). Data from the tapering phase (weeks 12-13), although collected, will
            not be included for purposes of the primary goal of this study. All enrolled
            participants will be included in the analyses of baseline demographics and safety
            according to an intent-to-treat (ITT) principle. For statistical analysis, the
            full-analysis set will be defined as all participants who took at least 1 dose of the
            study drug and had at least 1 post-baseline primary efficacy assessment. The
            safety-analysis set will be defined as all randomised participants who took at least 1
            dose of the study drug and completed at least 1 follow-up safety assessment. The
            statistical model will be a rigorous linear mixed-effects regression model (LME) that
            includes terms for treatment group, time, and treatment-by-time interaction. The
            analyses will run using the nlme package on R for Windows. Literature suggests LME
            without imputation may provide more accurate and stable results than LME models using
            fixed and multiple imputation methods for handling missing data. All tests of hypotheses
            will be performed using a two-sided significance level of 0.05.
          </p>
          <p>
            The sample size was calculated for the primary endpoint (YBOCS) of change from baseline.
            Assuming a similar magnitude of effect seen in other studies of medications for OCD, and
            assuming a 20% attrition rate, it was determined that 50 participants would be needed in
            each treatment group at entry (resulting in 40 completers in each arm) to detect a
            difference with an overall 5% type-I error risk. Given the low rates of adverse events
            expected with tolcapone (Grant et al., 2021), we anticipate few drop-outs from the study
            and therefore a smaller sample is needed as compared some other classes of
            pharmacological treatment.
          </p>
          <p>
            <strong>Task 3.2 - Write up and publication (Month 33-36)</strong>
          </p>
          <p>
            We will write up all the findings from the data analysis and submit them for
            publication. We will disseminate the findings through clinical networks and
            international symposia.
          </p>
          <h4>References</h4>
          <p>
            Bora E. Meta-analysis of neurocognitive deficits in unaffected relatives of
            obsessive-compulsive disorder (OCD): comparison with healthy controls and patients with
            OCD. Psychol Med. 2020 Jun;50(8):1257-1266. doi: 10.1017/S0033291720001634. Epub 2020
            Jun 1. PMID: 32476632.
          </p>
          <p>
            Chamberlain SR, Blackwell AD, Fineberg NA, Robbins TW, Sahakian BJ. (2005). The
            neuropsychology of obsessive compulsive disorder: the importance of failures in
            cognitive and behavioural inhibition as candidate endophenotypic markers. Neurosci
            Biobehav Rev. 29(3):399-419. doi: 10.1016/j.neubiorev.2004.11.006. PMID: 15820546.
          </p>
          <p>
            Chamberlain SR, Solly JE, Hook RW, Vaghi MM, Robbins TW. Cognitive Inflexibility in OCD
            and Related Disorders. Curr Top Behav Neurosci. 2021;49:125-145. doi:
            10.1007/7854_2020_198. PMID: 33547598.
          </p>
          <p>Grant JE (2014). Obsessive-Compulsive Disorder. N Engl J Med. 371(7):646-53.</p>
          <p>
            Grant JE, Hook R, Valle S, Chesivoir E, Chamberlain SR (2021). Tolcapone in Obsessive
            Compulsive disorder: A Randomized Double-Blind Placebo-Controlled Crossover Trial. In
            Clin Psychopharmacol
          </p>
          <p>
            Skapinakis P, Papatheodorou T, Mavreas V (2007). Antipsychotic augmentation of
            serotonergic antidepressants in treatment-resistant obsessive-compulsive disorder: a
            meta-analysis of the randomized controlled trials. Eur Neuropsychopharmacol.
            17(2):79-93.
          </p>
          <p>
            Tunbridge EM, Bannerman DM, Sharp T, Harrison PJ. (2004). Catechol-o-methyltransferase
            inhibition improves set-shifting performance and elevates stimulated dopamine release in
            the rat prefrontal cortex. J Neurosci. 24(23):5331-5. doi:
            10.1523/JNEUROSCI.1124-04.2004. PMID: 15190105; PMCID: PMC6729311.
          </p>
          <p>
            Grant JE, Hook R, Valle S, Chesivoir E, Chamberlain SR. Tolcapone in
            obsessive-compulsive disorder: a randomized double-blind placebo-controlled crossover
            trial. Int Clin Psychopharmacol. 2021 Sep 1;36(5):225-229. doi:
            10.1097/YIC.0000000000000368. PMID: 34310432; PMCID: PMC7611531.
          </p>
          <h4>Deliverables:</h4>
          <ul>
            <li>Finalise the study protocol and pre-register the study (D1)</li>
            <li>Complete data collection for the clinical trial (D2)</li>
            <li>Undertake data analysis (D3)</li>
            <li>Submit findings for peer-reviewed publication(s) (D4)</li>
          </ul>
          <h4>Milestones</h4>
          <ul>
            <li>
              We will write and finalise the study protocol taking into account expert and patient
              views. This will then be submitted for pre-registration and for regulatory (including
              ethics) approvals. Months 1-6
            </li>
            <li>
              We will commence participant recruitment and data collection following approvals.
              Months 6-30.
            </li>
            <li>
              We will complete data collection, and analyse findings using rigorous statistical
              methodology. Months 30-33
            </li>
            <li>We will write up findings and submit them for publication. Months 33-36</li>
            <li>
              We will disseminate the findings through clinical networks and international symposia.
              Months 33-36 (and after completion)
            </li>
          </ul>
          <h3>Gannt Chart</h3>
        </Prose>
        <DocFigure
          wide
          file="gantt-work-package-7.png"
          width={798}
          height={380}
          alt="Gantt chart for Work Package 7 across three years of quarters. Subtask 1.1 runs in quarters 1 and 2 of year 1. Subtasks 2.1 and 2.2 run from quarter 3 of year 1 to quarter 2 of year 2, and subtask 2.3 from quarter 3 of year 2 to quarter 2 of year 3. Subtask 3.1 runs in quarter 3 of year 3 and subtask 3.2 in quarter 4 of year 3."
        />
        <Prose className={DOC_PROSE}>
          <h3>Financial projections</h3>
          <p>
            Costs will be divided between the two study sites as appropriate. Estimated costs are
            shown in GBP. Subject to confirmation of potential funding interest, formal costings
            shall be generated and provided from host institutions.
          </p>
        </Prose>
        <Table
          caption="Work Package 7 financial projection by year"
          head={['Financial Projection', 'Year 1', 'Year 2', 'Year 3', 'Total']}
          rows={[
            [<strong key="team">Project Team</strong>, '', '', '', ''],
            [
              'Staff (admin, clinical trial coordinator, research assistant, contribution towards investigator time)',
              '£175,000',
              '£175,000',
              '£175,000',
              '£525,000',
            ],
            [<strong key="engagement">Project Engagement</strong>, '', '', '', ''],
            ['Public and Patient engagement', '£2,000', '£2,000', '£2,000', '£6,000'],
            [
              <strong key="recruitment">Recruitment and data collection</strong>,
              '',
              '',
              '',
              '',
            ],
            ['Study advertisements', '£4,000', '£4,000', '£3,000', '£11,000'],
            ['Participant payments', '£15,000', '£15,000', '£15,000', '£45,000'],
            [<strong key="others">Others</strong>, '', '', '', ''],
            [
              'Travel expenses, site co-ordination visits, and dissemination activities',
              '£12,000',
              '£12,000',
              '£12,000',
              '£36,000',
            ],
            ['Medication production and blinding', '£30,000', '£30,000', '£30,000', '£90,000'],
            [
              'Consumables, including objective neurocognitive tasks',
              '£20,000',
              '£20,000',
              '£20,000',
              '£30,000',
            ],
            [<strong key="total">Total</strong>, '', '', '', '£743,000'],
          ]}
        />
      </PageSection>
      <PageSection heading="Reference" id="reference" tone="ruled">
        <Prose className={DOC_PROSE}>
          <ol>
            <li>
              Stein DJ, Costa DLC, Lochner C, et al. Obsessive-compulsive disorder. Nat Rev Dis
              Primers. 2019;5(1):52. Published 2019 Aug 1. doi:10.1038/s41572-019-0102-3
            </li>
            <li>
              Bobes J, Gonzalez MP, Bascaran MT, Arango C, Saiz PA, Bousono M. (2001). Quality of
              life and disability in patients with obsessive-compulsive disorder. Eur Psychiatry
              2001;16:239-45.
            </li>
            <li>
              Heyman, I et al. “Prevalence of obsessive-compulsive disorder in the British
              nationwide survey of child mental health.” International review of psychiatry
              (Abingdon, England) vol. 15,1-2 (2003): 178-84. doi:10.1080/0954026021000046146
            </li>
            <li>
              Nicolini H, Salin-Pascual R, Cabrera B, Lanzagorta N. Influence of Culture in
              Obsessive-compulsive Disorder and Its Treatment. Curr Psychiatry Rev.
              2017;13(4):285-292. doi:10.2174/2211556007666180115105935
            </li>
            <li>
              Okasha A, Saad A, Khalil AH, el Dawla AS, Yehia N / Compr Psychiatry. 1994 May-Jun;
              35(3):191-7., Fontenelle LF, Mendlowicz MV, Marques C, Versiani MJ Psychiatr Res. 2004
              Jul-Aug; 38(4):403-11.
            </li>
            <li>
              <a href="http://ocduk.org/">http://ocduk.org/</a>
            </li>
            <li>
              Alvarenga, Victoria Fogaça Doretto, Afonso Mazine Tiago Fumo, Marcelo C. Batistuzzo,
              Pedro Macul Ferreira de Barros, Kiara R. Timpano, Vanessa K. Ota, Luis Augusto Rohde,
              Euripedes Constantino Miguel, James F. Leckman, André Zugman Front Psychiatry. 2021;
              12: 673595. Published online 2021 Jun 7. doi: 10.3389/fpsyt.2021.673595
            </li>
            <li>
              Eisen JL, Mancebo MA, Pinto A, Coles ME, Pagano ME, Stout R, Rasmussen SA Compr
              Psychiatry. 2006 Jul-Aug; 47(4):270-5.)
            </li>
            <li>
              Skapinakis P, Caldwell D, Hollingworth W, Bryden P, Fineberg N, Salkovskis P, et al. A
              systematic review of the clinical effectiveness and cost-effectiveness of
              pharmacological and psychological interventions for the management of
              obsessive-compulsive disorder in children/adolescents andadults. Health Technol Assess
              2016;20(43).
            </li>
            <li>
              Saxena, S., Bota, R.G., Brody, A.L., (2001). Brain–behavior relationships in obsessive–
              compulsive disorder. Semin. Clin. Neuropsychiatry 6 (2), 82–101.
            </li>
            <li>
              Atmaca, M. (015). Treatment-refractory obsessive compulsive disorder. Progress in
              Neuro-Psychopharmacology and Biological Psychiatry 2016 Oct 3;70:127–33.
            </li>
            <li>
              Ahmari SE, Dougherty DD. DISSECTING OCD CIRCUITS: FROM ANIMAL MODELS TO TARGETED
              TREATMENTS. Depress Anxiety. 2015;32(8):550-562. doi:10.1002/da.22367
            </li>
            <li>
              Lusicic A, Schruers KR, Pallanti S, Castle DJ. Transcranial magnetic stimulation in
              the treatment of obsessive-compulsive disorder: current perspectives. Neuropsychiatr
              Dis Treat. 2018;14:1721-1736. Published 2018 Jun 29. doi:10.2147/NDT.S121140
            </li>
            <li>
              <a href="https://www.advancedinterventions.org.uk/index.php/en/the-service/blog/how-long-does-someone-with-ocd-have-symptoms-before-getting-help.html">
                https://www.advancedinterventions.org.uk/index.php/en/the-service/blog/how-long-does-someone-with-ocd-have-symptoms-before-getting-help.html
              </a>
            </li>
            <li>
              Nestadt G, Grados M, Samuels JF. Genetics of obsessive-compulsive disorder. Psychiatr
              Clin North Am. 2010;33(1):141-158. doi:10.1016/j.psc.2009.11.001
            </li>
            <li>
              Adams TG, Kelmendi B, Brake CA, Gruner P, Badour CL, Pittenger C. The role of stress
              in the pathogenesis and maintenance of obsessive-compulsive disorder. Chronic Stress
              (Thousand Oaks).
            </li>
            <li>
              Vogel L. Growing consensus on link between strep and obsessive-compulsive disorder.
              CMAJ. 2018;190(3):E86-E87. doi:10.1503/cmaj.109-5545
            </li>
            <li>
              Alonso P, López-Solà C, Real E, Segalàs C, Menchón JM. Animal models of
              obsessive-compulsive disorder: utility and limitations. Neuropsychiatr Dis Treat.
              2015;11:1939-1955. Published 2015 Aug 4. doi:10.2147/NDT.S62785
            </li>
          </ol>
        </Prose>
      </PageSection>

      <PageSection heading="Appendix 1 – The Team" id="appendix-1" tone="ruled">
        <Prose className={DOC_PROSE}>
          <h3>The board of trustees</h3>
          <p>
            Our board of trustees comprises five experienced professionals with a passion for
            healthcare and mental health, as well as personal connections with OCD. Our collective
            scientific expertise in neuroscience, drug development, clinical trials, clinical
            psychiatry and healthcare is complemented by abundant experience in business,
            communications, charity development, fundraising and social enterprise.
          </p>
        </Prose>
        <Person
          file="nick-sireau.jpg"
          width={274}
          height={411}
          alt="Nick Sireau, wearing a dark jacket, looking to camera outdoors"
        >
          <p>
            Dr Nick Sireau is founder and chair of Orchard OCD. Nick is a serial social entrepreneur
            with 20 years experience in medical charities. Most recently, he founded and is now
            leading a successful consortium developing a treatment for Black Bone Disease, an ultra
            rare genetic disease affecting his children. Nick is also an OCD patient.
          </p>
        </Person>
        <Person
          file="sean-fletcher.jpg"
          width={339}
          height={339}
          alt="Sean Fletcher, smiling to camera in front of a city skyline"
        >
          <p>
            Sean Fletcher has been broadcasting on the BBC, ITV and Sky for more than 15 years. His
            journalism includes the Panorama investigation, Kids in Crises, which examined whether
            the Child and Adolescent Mental Health Services are fit for purpose. He also presents on
            Countryfile, Inside Out and Good Morning Britain. Sean’s son has OCD.
          </p>
        </Person>
        <Person
          file="vincenzo-garzya.jpg"
          width={287}
          height={430}
          alt="Vincenzo Garzya in a suit and tie, looking to camera"
        >
          <p>
            Vincenzo Garzya is project director in Global Medical Affairs at AstraZeneca, with 20
            years&apos; pharmaceutical experience in patient centricity, business development and
            neuroscience.
          </p>
        </Person>
        <Person
          file="naomi-fineberg.jpg"
          width={280}
          height={280}
          alt="Naomi Fineberg, smiling to camera against a plain background"
        >
          <p>
            Prof Naomi Fineberg is a consultant psychiatrist with 30 years&apos; experience in
            systematic investigation and treatment of OCD. Naomi serves on the UK National Institute
            for Clinical Excellence Guidelines Committee for OCD. She is also running an OCD
            specialist centre at the Hertfordshire Partnerships Mental Health Trust, Queen Elisabeth
            II Hospital.
          </p>
        </Person>
        <Person
          file="neil-balmer.jpg"
          width={329}
          height={347}
          alt="Neil Balmer, looking off to one side in a gallery interior"
        >
          <p>
            Neil Balmer has worked in healthcare strategy and external affairs for nearly 20 years,
            liaising with charities, professional medical organisations and businesses. Most
            recently, he launched and established MQ, the UK&apos;s leading mental health research
            charity, as a member of the organisation’s founding Executive team. He has personal
            experience of OCD.
          </p>
        </Person>
        <Prose className={cn(DOC_PROSE, 'mt-14')}>
          <h3>Scientific Advisory Board</h3>
          <p>
            Our scientific advisory board is made up of world-leading experts in the science and
            treatment of OCD.
          </p>
        </Prose>
        <Person
          file="stuart-montgomery.jpg"
          width={456}
          height={456}
          alt="Stuart Montgomery in a suit, standing in a garden"
        >
          <h4>STUART MONTGOMERY, MD</h4>
          <p>Chair</p>
          <p>
            Stuart Montgomery is an emeritus professor of Psychiatry at Imperial College London. He
            is a former President of the European College of Neuropsychopharmacology (ECNP) and of
            the British Association of Psychopharmacology (BAP). His research in OCD has been
            seminal, as were his efforts in establishing educational charities in OCD such as OCD
            Action. His rating scale in depression, the MADRS, is regarded as the most sensitive
            instrument and is widely used. He was a founding editor of European
            Neuropsychopharmacology and worked as an editor of International Clinical
            Psychopharmacology for 25 years.
          </p>
        </Person>
        <Person
          file="trevor-robbins.jpg"
          width={388}
          height={388}
          alt="Trevor Robbins, smiling to camera in front of a bookshelf"
        >
          <h4>TREVOR ROBBINS, CBE, FRS, FMEDSCI, PHD</h4>
          <p>
            Prof Trevor Robbins is a professor of cognitive neuroscience with an international
            reputation in the fields of cognitive neuroscience, behavioural neuroscience and
            psychopharmacology. He is Director of the University of Cambridge’s Behavioural and
            Clinical Neuroscience Institute (BCNI) and is leading a major research study into the
            neuroscience of OCD.
          </p>
        </Person>
        <Person
          file="david-adam.jpg"
          width={365}
          height={365}
          alt="David Adam, looking to camera against a brick wall"
        >
          <h4>DAVID ADAM, PHD</h4>
          <p>
            David Adam is an experienced journalist and best-selling author. In 2014 he published
            The Man Who Couldn’t Stop, a book that discussed his own experiences of OCD, as well as
            discussing the science, history and treatments of the disorder. He has since been
            invited to speak on the topic around the world. His second book, The Genius Within, on
            the subject of intelligence and cognitive enhancement, was published in 2018. David was
            an editor at the science journal Nature and was previously a special correspondent at
            the Guardian, writing on science and the environment.
          </p>
        </Person>
        <Person
          file="susanne-ahmari.jpg"
          width={370}
          height={370}
          alt="Susanne Ahmari, smiling to camera in a patterned top"
        >
          <h4>SUSANNE AHMARI, MD, PHD</h4>
          <p>
            Dr Susanne Ahmari is assistant professor of Psychiatry at University of Pittsburgh, and
            Director of the Translational OCD Laboratory. Dr Ahmari’s research programme integrates
            basic neuroscience approaches and cutting-edge technology in animal models with clinical
            and post-mortem studies of OCD patients. Her ultimate goal is to identify molecular,
            cellular, and circuit-level changes that underlie the onset and persistence of abnormal
            repetitive and compulsive behaviors, and use this information to develop
            neuroscientifically-based treatments for OCD and other related disorders.
          </p>
        </Person>
        <Person
          file="sabine-bahn.jpg"
          width={311}
          height={354}
          alt="Sabine Bahn, looking to camera in a dark jacket"
        >
          <h4>SABINE BAHN, MD, PHD, MRCPSYCH</h4>
          <p>
            Dr Sabine Bahn is a practising psychiatrist, Chair in Neurotechnology and Director of
            the Cambridge Centre for Neuropsychiatric Research at the University of Cambridge. Her
            main research interests are the molecular basis of neuropsychiatric disorders and
            developing novel diagnostics and therapeutics for psychiatric disorders, with a focus on
            schizophrenia and mood disorders. Sabine has published over 200 research articles and
            has co-founded 2 spin-out companies. Since 2015, Sabine has been a fellow of the Royal
            Society of Biology. She is also a fellow of Lucy Cavendish College, Cambridge.
          </p>
        </Person>
        <Person
          file="lynne-drummond.jpg"
          width={366}
          height={349}
          alt="Lynne Drummond, wearing glasses and a dark jacket, looking to camera"
        >
          <h4>LYNNE DRUMMOND, MBCHB, MRCP, FRCPSYCH</h4>
          <p>
            Lynne Drummond was Consultant Psychiatrist with the National and Trustwide Services for
            OCD and BDD at South West London and St George’s NHS Mental Health Trust from 1985 until
            August 2020. Since then, she has been Honorary Consultant Psychiatrist in South West
            London and Visiting Professor at the University of Hertfordshire. Her research interests
            include OCD, anxiety disorders, CBT, the role exercise plays in mental health and the
            education of healthcare professionals. Lynne’s latest book is “Obsessive-Compulsive
            Disorders: All you want to know about OCD for those living with OCD, carers and
            clinicians&apos;&apos;.
          </p>
          <p>
            She is on the Board of Directors of the International College for Obsessive Compulsive
            Spectrum Disorders and chairs the Obsessive Compulsive and related Disorders network at
            the Royal College of Psychiatrists.
          </p>
        </Person>
        <Prose className={cn(DOC_PROSE, 'mt-10')}>
          <h4>JIM HAGAN, PHD</h4>
          <p>
            Dr. Jim Hagan is a Senior Research Fellow in Neurosciences at Sosei-Heptares, working on
            drug discovery programmes for neuropsychiatric indications. Previously, he was the CEO
            at GMEC, a not-for-profit company formed by the Universities of Oxford and Cambridge,
            Imperial College, UCL, King’s College London and Queen Mary College London to foster
            biomedical translational research. He was Vice President and Head of Biology in the
            Psychiatry Centre of Excellence in Drug Discovery at GSK.
          </p>
        </Prose>
        <Person
          file="carolyn-rodriguez.jpg"
          width={456}
          height={456}
          alt="Carolyn Rodriguez, smiling to camera with long dark hair"
        >
          <h4>CAROLYN RODRIGUEZ, MD, PHD</h4>
          <p>
            Dr Carolyn Rodriguez is assistant professor in the Department of Psychiatry and
            Behavioural Science at Stanford University, School of Medicine. She utilises her
            training as a psychiatrist, neuroscientist, and clinical researcher to innovate
            rapid-acting treatments such as ketamine to relieve the suffering of patients with
            severe mental illnesses, including OCD.
          </p>
        </Person>
      </PageSection>

      <PageSection
        heading="Appendix 2 – Table of existing and experimental treatments for OCD"
        id="appendix-2"
        tone="ruled"
      >
        <Table
          caption="Existing and experimental treatments for OCD, with efficacy, side effects, on-going studies and references"
          head={['Category', 'Name', 'Efficacy', 'Side effects', 'On-going studies', 'References']}
          rows={[
            [
              'Medications',
              'Selective Serotonin Reuptake Inhibitors (SSRIs): Sertraline, Fluoxetine, Citalopram. Serotonin Reuptake Inhibitors (SRIs): Clomipramine',
              'Reduces symptoms by only 30% to 50%.',
              'Heightened anxiety, sexual dysfunction, weight gain, etc.',
              'SSRI studies are on-going and are coupled with other new treatments (e.g.: CBT, etc.)',
              'E.g.: https://clinicaltrials.gov/ct2/show/NCT00994786?term=ocd+ssri&rank=12',
            ],
            [
              'Electro-convulsive therapy (ECT)',
              'Deep brain stimulation (DBS) for severely treatment resistant patients',
              'Effective in 50% of cases.',
              'Seizure, infection, heart problems, etc.',
              'University College London.',
              'E.g.: https://clinicaltrials.gov/ct2/show/NCT01879254?term=ocd+dbs&rank=4',
            ],
            [
              'Psychological therapies',
              'Cognitive and behavioural therapy (CBT): Acceptance and commitment therapy (ACT)',
              'Has shown some efficacy. Further studies needed.',
              'None.',
              'Shanghai Mental Health Centre.',
              'E.g.: https://clinicaltrials.gov/ct2/show/NCT02955654?term=OCD+act&rank=5',
            ],
            [
              'Psychological therapies',
              'Cognitive and behavioural therapy (CBT): Eye movement desensitisation and reprocessing (EMDR)',
              'Undetermined. Studies on-going.',
              'None.',
              'None on-going.',
              '',
            ],
            [
              'Psychological therapies',
              'Cognitive and behavioural therapy (CBT): Exposure and response prevention (ERP)',
              'Can be effective in children and adults. Evidence is scarce for the elderly.',
              'None.',
              'Studies on-going adding CBT to other therapies',
              'E.g.: https://clinicaltrials.gov/ct2/show/NCT02136953?term=ocd+cbt&rank=3',
            ],
            [
              'Psychological therapies',
              'Transcranial magnetic stimulation (TMS)',
              'Contradictory. Studies on-going.',
              'Headache, seizure, general pain.',
              'Duke University.',
              'E.g.: https://clinicaltrials.gov/ct2/show/NCT02528331?term=ocd+tms&rank=2',
            ],
            [
              'Experimental therapies',
              'Drugs: Ketamine',
              'Some positive early effects. Studies on-going.',
              'Body-mind dissociation.',
              'Stanford University; New York State Psychiatric Institute.',
              'E.g.: https://clinicaltrials.gov/ct2/show/NCT02422290?term=ocd+ketamine&rank=1',
            ],
            [
              'Experimental therapies',
              'Drugs: Psilocybin',
              'Some positive early results. More studies needed.',
              'Hallucinations.',
              'Imperial College.',
              'E.g.: http://www.maps.org/research-archive/psilo/azproto.html',
            ],
            [
              'Experimental therapies',
              'Drugs: Bitopertin',
              'Not known.',
              'Not known.',
              'Roche, Phase II clinical study.',
              'E.g.: https://clinicaltrials.gov/ct2/show/NCT01674361?term=OCD+ssri&rank=10',
            ],
          ]}
        />
      </PageSection>

      <PageSection heading="Appendix 3 - What the patients want" id="appendix-3" tone="ruled">
        <Prose className={DOC_PROSE}>
          <p>
            In 2021, Orchard OCD worked with the Cambridge Consulting Network to carry out an
            insight gathering exercise to find out what research is important for OCD patients. More
            than 220 patients responded to the survey and in-depth interviews were carried out with
            nine of these. (The full report is available on request). Their responses correspond well
            to the research questions being asked by scientists and clinicians and will form the
            basis of our research approach.
          </p>
          <p>Survey questions included:</p>
          <ul>
            <li>How has OCD impacted your life?</li>
            <li>Have you accessed any treatments and have they been effective?</li>
            <li>What problems have you faced with your treatments?</li>
            <li>What do you think would be the most important areas to research for OCD? Why?</li>
            <li>What is the most important out of the list of issues you gave?</li>
            <li>
              What has motivated you to decide this issue(s) in your response were the most
              important to raise?
            </li>
          </ul>
          <p>
            The majority of the participants of the survey (66%) had questions regarding the
            treatment of OCD, summarised as follows: What is the best treatment for OCD?
          </p>
          <p>
            The second most common subcategory of questions within the theme of treatment of OCD was
            about recovery from OCD and whether OCD could be cured, deeply intertwined with the
            theme of the prognosis of OCD. Examples of questions within this subcategory include:
          </p>
          <ul>
            <li>Is there a way to make OCD go away forever?</li>
            <li>Will I ever be fully okay again?</li>
            <li>What does recovery look like?</li>
          </ul>
          <h3>Pathology:</h3>
          <p>
            More than half (~64.5%) of the respondents expressed concerns around the pathological
            nature of OCD, which could be sub-categorised into concerns around the causes of OCD,
            comorbidity of OCD, diagnosis and methods of prevention available. The general
            representations of this type of concern are:
          </p>
          <ul>
            <li>Does OCD present from a genetic component, environmental or both?</li>
            <li>How likely is it that your kid will have OCD if you have it?</li>
            <li>
              What is the main difference in brain structure of people with OCD versus people
              without?
            </li>
          </ul>
          <p>The second subcategory is about the diagnosis:</p>
          <ul>
            <li>How well does the diagnostic label of OCD fit the broad range of symptoms?</li>
            <li>
              Does OCD as we know it encompass a spectrum of disorders or has lack of understanding
              led to an umbrella term for multiple discrete conditions?
            </li>
            <li>
              How can people with very specific or rare intrusive thoughts be categorised as OCD and
              not some other disorder?
            </li>
            <li>
              How and why does it appear? Why are there so many subtypes that switch all the time?
            </li>
          </ul>
          <h3>Prognosis:</h3>
          <p>
            16% of the respondents expressed concerns around prognosis, including whether the
            symptoms will improve or worsen, and how OCD relates to age and periods of life:
          </p>
          <ul>
            <li>Why does OCD tend to ebb and flow, or come out in full force in other times?</li>
            <li>Does puberty relate to the onset of OCD?</li>
            <li>Why doesn’t treatment work long-term?</li>
            <li>Why is my OCD getting much worse the older I get?</li>
          </ul>
          <h3>Social aspects</h3>
          <p>30% of the respondents expressed concerns around social aspects, including:</p>
          <ul>
            <li>
              How can we develop better coping strategies for families and relatives of those with
              OCD?
            </li>
            <li>What is the best way to raise awareness?</li>
            <li>Why isn’t OCD recognised in schools?</li>
            <li>Why are children with OCD not given the same help as other disorders?</li>
            <li>Why is OCD portrayed so inaccurately in the media?</li>
            <li>How can we change public perception?</li>
          </ul>
        </Prose>
      </PageSection>

      <PageSection heading="Appendix 4 - Existing research projects" id="appendix-4" tone="ruled">
        <Prose className={DOC_PROSE}>
          <h3>First research project - psilocybin</h3>
          <p>
            Our first existing research project focuses on drug development in collaboration with
            Professor David Nutt, Imperial College, London, and Professor Naomi Fineberg, Queen
            Elizabeth II Hospital, Welwyn Garden City. Following fundraising of over £120,000
            through crowdfunding and charitable trust grants, we are preparing to run a pilot
            clinical trial with the compound psilocybin. In a small experimental study, published in
            2006<sup>1</sup>, psilocybin was reported to significantly reduce OCD symptoms in all
            treatment-resistant patients enrolled in the study.
          </p>
          <p>
            <sup>1</sup> Moreno FA1, Wiegand CB, Taitano EK, Delgado PL. (2006).Safety,
            tolerability, and efficacy of psilocybin in 9 patients with obsessive-compulsive
            disorder. Journal of Clinical Psychiatry. 2006 Nov;67(11):1735-40.
          </p>
          <p>
            However, despite the positive results and ample subjective positive reports among OCD
            patients, no further study was carried out, due to lack of funding. It is thus crucial
            to follow it up and understand further how effective psilocybin can be in treating OCD.
          </p>
          <p>
            This study will start in the autumn of 2021 and will last 18 months, recruiting and
            following up 15 patients. If successful, we will launch a larger clinical trial, for
            which we will require further funding, to obtain enough data for a license.
          </p>
          <p>
            The potential for an enduring effect of psilocybin, independent of its psychedelic
            effect, is particularly interesting and may reflect its central actions as a 5HT2A
            agonist. The research team intends to test the hypothesis that psilocybin exerts an
            enduring effect on OCD symptoms by activating the 5HT2A receptor mechanisms in the
            relevant brain circuitry. They predict they might additionally restore key OCD-related
            cognitive deficits that may be sensitive to serotonin manipulation, including deficits
            in behavioural inhibition (attentional set shift, reversal learning) and the balance
            between goal-directed behaviour and habit. To this end, they plan to conduct a
            single-dose pharmacological challenge study.
          </p>
          <p>
            They will use a similar dose to the low dose used in Moreno, et al., [J Clin Psychiatry,
            2006. 67:1735], of 100 μg/kg ≈ 10 mg. This dose is unlikely to induce a psychedelic
            effect. Participants will be tested at baseline and then at regular intervals over the
            first 8 hours, and at 1, 7, 30, and 90 days post-psilocybin ingestion. The researchers
            will measure in detail the effects of this psilocybin-mediated 5HT2A receptor modulation
            on laboratory-based tasks. Additionally, they will perform a symptom provocation
            challenge tailored to the individual’s OCD symptoms at baseline and 24 hours
            post-psilocybin ingestion, to examine the effect that this 5HT2A receptor modulation has
            on clinically relevant obsessive-compulsive symptoms.
          </p>
          <h3>Second research project - transcranial direct current stimulation</h3>
          <p>
            Our second existing research project was at the University of Hertfordshire and funded
            entirely by the NHS, working on a promising new treatment that involves passing a small,
            almost imperceptible electric current into brain areas connected to OCD. This may help
            people with OCD think and behave differently and could help treatments work better.
          </p>
          <p>
            This study was designed to test whether small electrical currents applied to the scalp
            (called transcranial direct current stimulation, or tDCS) can help treat OCD. Some
            current passes into the brain where it may change brain functioning. Evidence suggests
            this could help ease OCD symptoms. This type of brain stimulation is new and
            experimental, so this study aimed to answer basic questions, including whether this
            stimulation shows signs of working, what the side effects are, and whether doctors and
            patients are willing to use it. The study also investigated which areas of the brain
            should be targeted, and duration of effects. This information will help design and
            implement larger-scale clinical trials.
          </p>
          <p>
            In this study, patients with OCD visited a clinic for six days over a three-month
            period. On some visits, patients had a region of the brain stimulated twice with very
            small amounts of electric current; on other visits, they were told that they were
            receiving the stimulation, but the current was turned off (placebo). On each occasion,
            the same assessments of thinking, OCD symptoms, and wellbeing were conducted. Comparing
            assessment outcomes over time will provide information on the duration of the effects of
            stimulation. Comparing assessment outcomes between the different treatment sessions
            (including the placebo) will provide information on the efficacy of the stimulation in
            reducing OCD symptoms, changing thinking, and improving wellbeing.
          </p>
          <p>
            Upon completion of this study, we will have collected valuable information on whether
            this form of stimulation is a useful treatment for people with OCD, and how this
            stimulation might be best used on a wider scale in clinical practice. The information
            collected will be used to design a larger-scale study, for which we will require further
            funding.
          </p>
          <p>
            The clinical portion of this study has now been conducted successfully, with analysed
            data and outcomes available in December.
          </p>
        </Prose>
      </PageSection>
      <PageSection heading="Appendix 5 - Financial Projections" id="appendix-5" tone="ruled">
        <Table
          caption="Financial projections for all seven work packages across five years"
          head={[
            'Financial Projection',
            'Year 1',
            'Year 2',
            'Year 3',
            'Year 4',
            'Year 5',
            'Total',
          ]}
          rows={[
            [
              <strong key="wp1">WP1: Consortium Programme</strong>,
              '',
              '',
              '',
              '',
              '',
              <strong key="wp1t">Total (WP1)</strong>,
            ],
            [<strong key="wp1-engagement">Engagement</strong>, '', '', '', '', '', ''],
            ['Kick-off workshop', '£10,000', '', '', '', '', '£10,000'],
            ['Annual Symposium', '£30,000', '£30,000', '£30,000', '£30,000', '£30,000', '£150,000'],
            [
              'Secretary/Engagement manager',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£125,000',
            ],
            [<strong key="wp1-other">Other</strong>, '', '', '', '', '', ''],
            [
              'Data storage servers',
              '£500.00',
              '£500.00',
              '£500.00',
              '£500.00',
              '£500.00',
              '£2,500.00',
            ],
            [
              'Literature/open-access publication fees',
              '£8,000',
              '£8,000',
              '£8,000',
              '£8,000',
              '£8,000',
              '£40,000',
            ],
            ['Travel expenses', '£20,000', '£20,000', '£20,000', '£20,000', '£20,000', '£100,000'],
            [
              <strong key="wp1-total">Total</strong>,
              '£93,500',
              '£83,500',
              '£83,500',
              '£83,500',
              '£83,500',
              '£427,500',
            ],
            [
              <strong key="wp2">WP2: Neurobehavourial Basis of OCD</strong>,
              '',
              '',
              '',
              '',
              '',
              <strong key="wp2t">Total (WP2)</strong>,
            ],
            [<strong key="wp2-salaries">Salaries</strong>, '', '', '', '', '', ''],
            [
              'Senior Research Associate, full-time',
              '£65,458',
              '£65,458',
              '£65,458',
              '',
              '',
              '£196,374',
            ],
            ['Technician, full-time', '£49,232', '£49,232', '£49,232', '', '', '£147,696'],
            ['Research Associate, full-time', '£55,207', '£55,207', '£55,207', '', '', '£165,621'],
            ['Research Associate, full-time', '£50,929', '£50,929', '£50,929', '', '', '£152,787'],
            ['Research Assistant, full-time', '£38,833', '£38,833', '£38,833', '', '', '£116,499'],
            [
              'Senior Research Associate, part-time',
              '£4,588',
              '£4,588',
              '£4,588',
              '',
              '',
              '£13,764',
            ],
            [<strong key="wp2-materials">Materials and Consumables</strong>, '', '', '', '', '', ''],
            ['Marmoset studies', '£6,216', '£6,216', '£6,216', '', '', '£18,648'],
            ['Human studies', '£7,267', '£7,267', '£7,267', '', '', '£21,801'],
            ['Rodent studies', '£7,340', '£7,340', '£7,340', '', '', '£22,020'],
            [<strong key="wp2-equipment">Equipment</strong>, '', '', '', '', '', ''],
            ['Computers for research staff', '£7,500', '', '', '', '', '£7,500'],
            ['High spec computer for marmoset behavioural testing', '£1,500', '', '', '', '', '£1,500'],
            [<strong key="wp2-animals">Animals and Associated Costs</strong>, '', '', '', '', '', ''],
            ['Marmosets', '£105,747', '£105,747', '£105,747', '', '', '£317,241'],
            ['Rats, Lister Hooded', '£20,752', '£20,752', '£20,752', '', '', '£62,257'],
            [
              'Research Associate PIL training and security clearance',
              '£1,002',
              '',
              '',
              '',
              '',
              '£1,002',
            ],
            ['PIL licence fees for animal researchers', '£900', '£900', '£900', '', '', '£2,700'],
            [<strong key="wp2-access">Access Charges</strong>, '', '', '', '', '', ''],
            [
              'Wolfson Brain Imaging Centre 7T MRI scanner',
              '£26,640',
              '£26,640',
              '£26,640',
              '',
              '',
              '£79,920',
            ],
            [
              'Wolfson Brain Imaging Centre 3T MRI scanner',
              '£21,600',
              '£21,600',
              '£21,600',
              '',
              '',
              '£64,800',
            ],
            [<strong key="wp2-travel">Travel and Subsistence</strong>, '', '', '', '', '', ''],
            ['Human participant travel expenses', '£2,400', '£2,400', '£2,400', '', '', '£7,200'],
            ['Travel to US conference', '', '', '£9,000', '', '', '£9,000'],
            ['Carbon offsetting for conference travel', '', '', '£315', '', '', '£315'],
            [
              <strong key="wp2-total">Total</strong>,
              '£473,110',
              '£463,108',
              '£472,423',
              '',
              '',
              '£1,408,642',
            ],
            [
              <strong key="wp3">
                WP3: Physical Exercise as an Anti-inflammatory intervention for Patients with OCD
              </strong>,
              '',
              '',
              '',
              '',
              '',
              <strong key="wp3t">Total (WP3)</strong>,
            ],
            [<strong key="wp3-engagement">Engagement</strong>, '', '', '', '', '', ''],
            ['Patient Recruitment', '£10,000', '', '', '', '', '£10,000.00'],
            ['Research Engagement', '£1,000', '£1,000', '£1,000', '', '', '£3,000.00'],
            [<strong key="wp3-research">Research</strong>, '', '', '', '', '', ''],
            ['Research consumables', '£30,000', '£90,000', '£100,000', '', '', '£220,000.00'],
            ['Compensation for participants', '', '', '£120,000', '', '', '£120,000.00'],
            [<strong key="wp3-other">Other</strong>, '', '', '', '', '', ''],
            [
              'Staff (e.g. personal trainers, cameraman etc.)',
              '£5,000',
              '£5,000',
              '',
              '',
              '',
              '£10,000.00',
            ],
            ['Data storage servers', '£500.00', '£500.00', '£500.00', '', '', '£1,500.00'],
            [
              'Literature/open-access publication fees',
              '£2,000',
              '£2,000',
              '£10,000',
              '',
              '',
              '£14,000.00',
            ],
            [
              'Travel expenses/Courier Services',
              '£20,000',
              '£20,000',
              '£20,000',
              '',
              '',
              '£60,000.00',
            ],
            [
              <strong key="wp3-total">Total</strong>,
              '£68,500',
              '£118,500',
              '£251,500',
              '',
              '',
              '£438,500.00',
            ],
            [
              <strong key="wp4">WP4: Open Treatment Accelerator Programme</strong>,
              '',
              '',
              '',
              '',
              '',
              <strong key="wp4t">Total (WP4)</strong>,
            ],
            [<strong key="wp4-staff">Staff/Admin</strong>, '', '', '', '', '', ''],
            [
              'Communication Officer',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£25,000',
              '£125,000',
            ],
            [<strong key="wp4-marketing">Marketing</strong>, '', '', '', '', '', ''],
            ['Design', '£600', '£600', '£600', '£600', '£600', '£3,000'],
            [<strong key="wp4-research">Research</strong>, '', '', '', '', '', ''],
            [
              'Research Funding',
              '£120,000',
              '£120,000',
              '£120,000',
              '£240,000',
              '£240,000',
              '£840,000',
            ],
            [
              <strong key="wp4-total">Total</strong>,
              '£145,600',
              '£145,600',
              '£145,600',
              '£265,600',
              '£265,600',
              '£968,000',
            ],
            [
              <strong key="wp5">
                WP5: Smartphone app to improve cognitive flexibility and reduce contamination fears
                in OCD (Costs estimated for 16 months)
              </strong>,
              '',
              '',
              '',
              '',
              '',
              <strong key="wp5t">Total (WP5)</strong>,
            ],
            [<strong key="wp5-salaries">Salaries</strong>, '', '', '', '', '', ''],
            ['Postdoctoral salary', '£48,860.25', '', '', '', '', '£48,860.25'],
            [<strong key="wp5-research">Research</strong>, '', '', '', '', '', ''],
            ['Participant Remuneration', '£3,000', '', '', '', '', '£3,000'],
            ['Web-Based Testing', '£1,000', '', '', '', '', '£1,000'],
            ['App Development Related Costs', '£1,626', '', '', '', '', '£1,626'],
            [<strong key="wp5-others">Others</strong>, '', '', '', '', '', ''],
            ['Equipment *', '£1,000', '', '', '', '', '£1,000'],
            ['Travel (Participant and Research Team)', '£5,000', '', '', '', '', '£5,000'],
            [<strong key="wp5-total">Total</strong>, '£60,486.25', '', '', '', '', '£60,486.25'],
            [
              <strong key="wp6">WP6: OCD Patient Registry</strong>,
              '',
              '',
              '',
              '',
              '',
              <strong key="wp6t">Total (WP6)</strong>,
            ],
            [<strong key="wp6-team">Project Team</strong>, '', '', '', '', '', ''],
            ['Staff', '£20,000', '£20,000', '£20,000', '£20,000', '£20,000', '£100,000'],
            [
              'IT (collaboration with CTSN)',
              '£10,000',
              '£10,000',
              '£10,000',
              '£10,000',
              '£10,000',
              '£50,000',
            ],
            [<strong key="wp6-engagement">Project Engagement</strong>, '', '', '', '', '', ''],
            ['Kick-off meeting', '£2,000', '', '', '', '', '£2,000'],
            ['Public engagement', '£3,000', '£2,000', '£2,000', '£2,000', '£2,000', '£10,000'],
            [<strong key="wp6-monitoring">Project Monitoring</strong>, '', '', '', '', '', ''],
            ['Website maintenance', '£1,000', '£2,000', '£2,000', '£2,000', '£2,000', '£9,000'],
            ['Annual assessment', '£2,000', '£3,000', '£3,000', '£3,000', '£3,000', '£14,000'],
            [<strong key="wp6-others">Others</strong>, '', '', '', '', '', ''],
            ['Travel expenses', '£2,000', '£3,000', '£3,000', '£3,000', '£3,000', '£15,000'],
            [
              <strong key="wp6-total">Total</strong>,
              '£40,000',
              '£40,000',
              '£40,000',
              '£40,000',
              '£40,000',
              '£200,000',
            ],
            [
              <strong key="wp7">
                WP7: Proposal for a Randomised Double-blind Placebo-controlled study of Tolcapone for
                OCD
              </strong>,
              '',
              '',
              '',
              '',
              '',
              <strong key="wp7t">Total (WP7)</strong>,
            ],
            [<strong key="wp7-team">Project Team</strong>, '', '', '', '', '', ''],
            [
              'Staff (admin, clinical trial coordinator, research assistant, contribution towards investigator time)',
              '£175,000',
              '£175,000',
              '£175,000',
              '',
              '',
              '£525,000',
            ],
            [<strong key="wp7-engagement">Project Engagement</strong>, '', '', '', '', '', ''],
            ['Public and Patient engagement', '£2,000', '£2,000', '£2,000', '', '', '£6,000'],
            [
              <strong key="wp7-recruitment">Recruitment and data collection</strong>,
              '',
              '',
              '',
              '',
              '',
              '',
            ],
            ['Study advertisements', '£4,000', '£4,000', '£3,000', '', '', '£11,000'],
            ['Participant payments', '£15,000', '£15,000', '£15,000', '', '', '£45,000'],
            [<strong key="wp7-others">Others</strong>, '', '', '', '', '', ''],
            [
              'Travel expenses, site co-ordination visits, and dissemination activities',
              '£12,000',
              '£12,000',
              '£12,000',
              '',
              '',
              '£36,000',
            ],
            [
              'Medication production and blinding',
              '£30,000',
              '£30,000',
              '£30,000',
              '',
              '',
              '£90,000',
            ],
            [
              'Consumables, including objective neurocognitive tasks',
              '£20,000',
              '£20,000',
              '£20,000',
              '',
              '',
              '£30,000',
            ],
            [
              <strong key="wp7-total">Total</strong>,
              '£ 248,000',
              '£ 248,000',
              '£ 247,000',
              '',
              '',
              '£743,000',
            ],
            [
              <strong key="grand">Total (WP1-7)</strong>,
              '£1,129,196',
              '£1,098,708',
              '£1,240,023',
              '£389,100',
              '£389,100',
              '£4,246,127',
            ],
          ]}
        />
      </PageSection>

      <PageSection heading="Download the full document" id="download" tone="mist">
        <Prose>
          <p>
            This page reproduces the Orchard OCD Research Strategy in full. The original 66-page
            document is also available as a PDF.
          </p>
          <p>
            <a href={STRATEGY_PDF_URL}>Download the Orchard OCD Research Strategy (PDF)</a>
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
