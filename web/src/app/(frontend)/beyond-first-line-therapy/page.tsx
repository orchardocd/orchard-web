import type { Metadata } from 'next'

import { Figure, PageBanner, PageSection, Prose, Table, TextWithFigure } from '@/components/site'

export const metadata: Metadata = {
  title: 'Beyond first line therapy',
}

const CAPS_HEADING = '[&_h2]:leading-none [&_h2]:tracking-[-0.02em]'

export default function BeyondFirstLineTherapyPage() {
  return (
    <>
      <PageBanner
        title="Beyond first line therapy"
        eyebrow="About OCD"
        image="2022-08-about-ocd-slider1-1.png"
        imageAlt="Three people in distress: one bent double, one curled up with a hand over their face, and one standing with their arms raised"
      >
        <p>
          OCD is one of the most commonly occurring mental health disorders. It affects about 2% to
          3% of people in Western general populations. It is characterised by recurring intrusive
          thoughts that are very hard to prevent or control (the obsessions).
        </p>
        <p>
          It is not an understatement to say that there is a tremendous amount of room for
          improvement for an effective and sustained treatment for OCD, especially for those with
          severe or debilitating conditions that are resistant to first line drugs and/or CBT. The
          erratic and often unsatisfactory results from first line therapy are the principal reasons
          that researchers continue efforts to identify promising new drugs and maximise the
          effectiveness of those currently available.
        </p>
      </PageBanner>

      <PageSection heading="What Is OCD?" tone="mist">
        <Prose>
          <p>
            These lead to irresistible and recurring behaviours (the compulsions or rituals).
            Compulsions are actions taken to negate or resolve the disruptive, anxiety provoking and
            disturbing thoughts. A familiar example are those individuals so fearful of
            “contamination” from everyday activities, such as using a keyboard, touching a doorknob,
            or handling a notebook, that they feel compelled to scrub their hands with soap and
            water or a disinfectant many dozens of times a day and despite raw skin from the
            cleansers.
          </p>
          <p>
            Other unwanted obsessive thoughts can have more disturbing and aggressive themes.
            Intrusive thoughts/obsessions/compulsions may occur so frequently that they disrupt
            personal relationships, work, sleep and almost all other aspects of daily life.
          </p>
          <p>
            Many people experience troubling, unwanted thoughts occasionally. However, in those
            without OCD, these thoughts are given little importance, do not necessarily compel any
            actions, and easily disappear. By comparison, in those with OCD, the thoughts or
            impulses are intense, relentless and can cause tremendous anxiety, guilt, and disgust.
          </p>
          <p>
            The themes of the intrusive thoughts in people without OCD may be quite similar to those
            occurring in OCD. It is not necessarily the nature of the obsessive thought that defines
            OCD, but rather how that thought is interpreted and acted upon by the patient.
          </p>
          <p>
            Regrettably, OCD is usually a lifelong condition that waxes and wanes in intensity and
            frequency. Treatment can help manage the obsessions and compulsions, so that they are
            less disruptive. However, existing treatments for OCD are often ineffective, which is
            why we are pushing for the development of new and better treatments for this devastating
            condition.
          </p>
        </Prose>
      </PageSection>

      <PageSection>
        <Prose>
          <p>
            At least 25 drugs have been tested or used for OCD treatment. Most of these are reserved
            for those patients with poor responses to first line therapies although the evidence
            supporting their effectiveness is often conflicting or insufficient. In the opinion of
            many experts, the combination of psychotherapeutic interventions with multi-drug therapy
            is more likely to be effective in patients with severe OCD.
          </p>
          <p>
            There also are non-drug treatments that have attracted attention. These include nutrient
            supplements, plant and herbal preparations, acupuncture, and alternative psychosocial
            interventions. For patients who do not have satisfactory results from numerous drugs and
            CBT, brain stimulation treatment methods are also presented.
          </p>
        </Prose>
      </PageSection>

      <PageSection
        heading="FACTORS THAT MAY PLAY A ROLE IN FAILED TREATMENT"
        tone="mist"
        className={CAPS_HEADING}
      >
        <TextWithFigure
          figure={
            <Figure file="2022-06-flt4.jpg" alt="A hand holding a single jigsaw puzzle piece" />
          }
        >
          <Prose>
            <h3>DRUG TRIAL AND ERROR</h3>
            <p>
              If optimal first line drug and/or behavioural therapies are not adequately effective,
              most specialists will prescribe second line treatment. Despite the large number of
              comparative drug studies done in groups of patients, no second line therapy (such as
              the combination of an atypical antipsychotic with an SSRI or similar drug) clearly
              emerges as a treatment of choice. The process of identifying the best treatment for a
              single individual frequently requires some trial and error.
            </p>
            <h3>DURATION OF DRUG TREATMENTS</h3>
            <p>
              Most of the drugs used for OCD require periods of as much as 12 weeks before the
              effect can be judged. It has been shown that as many as one-quarter to one-half of
              patients taking first line OCD medications will fail to complete the necessary period
              of treatment. As a result, there is a risk that a particular treatment may erroneously
              be considered evidence of failed therapy. A frequently cited reason for treatment
              discontinuation is the occurrence of intolerable side effects.
            </p>
            <h3>RELAPSING OCD – OTHER FACTORS</h3>
            <p>
              For those patients who fail various drug therapies, it is appropriate to consider
              other possible, and controllable, factors that might escape the attention of those who
              recommended treatment. Those occurring more commonly include erratic follow though of
              the ERP homework that is part of therapy, drug noncompliance or self-adjustments, or
              an unrecognised degree of anxiety. Some patients with more severe OCD may also develop
              a degree of skepticism about new treatment recommendations after several treatment
              failures. The depression that frequently coexists with OCD may also set the stage for
              non-compliance with treatment recommendations.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection
        heading="DRUG CLASS: ATYPICAL ANTIPSYCHOTIC DRUGS (AAP)"
        className={CAPS_HEADING}
      >
        <TextWithFigure
          figure={
            <Figure
              file="2022-04-Group-13752.png"
              alt="A person holding their head while lining up pencils and stacked books"
            />
          }
        >
          <Prose>
            <h3>AAP USE IN OCD</h3>
            <p>
              Drugs in this group are used to treat several serious psychiatric disorders. These
              medications, also referred to as <strong>neuroleptics</strong>, are in a class of
              compounds that can bind to dopamine receptors without triggering any downstream
              responses, therefore blocking the action of excess dopamine in OCD sufferers.
            </p>
            <p>
              The use of atypical antipsychotics as an augmentation therapy for SSRI resistance has
              been extensively tested with generally favourable results. In one of these studies,
              the addition of aripiprazole (ARI) to a SSRI or clomipramine resulted in better
              treatment responses. It is not clear from other individual studies which of the
              atypical antipsychotics, other than ARI, have satisfactory outcomes and drug side
              effect profiles. Several investigators have addressed this issue by pooling data from
              multiple antipsychotic treatment studies (using meta-analysis). These reports
              confirmed the positive results from ARI treatment and several additional atypical
              antipsychotics. These comparative analyses also showed that outcomes <em>do</em>{' '}
              improve with risperidone, quetiapine, and olanzapine. Although the reported results
              vary, as many as 60% of treated patients may have significant improvement.
            </p>
            <p>
              When considering an AAP as add-on therapy in the face of poor SSRI responders,
              consideration also should be given to ERP, especially given the combined risks of SSRI
              and AAP side effects. In a well-designed study comparing the addition of risperidone
              or ERP to an SSRI, there were significant improvements with both. This was most
              evident during the first 8 weeks of treatment, and the improvements were stable or
              even slightly improved with both over six months.
            </p>
            <h3>AAP SIDE EFFECTS</h3>
            <p>
              Many of the side effects of AAPs are similar, although the risks and degree vary
              considerably. ARI has demonstrated comparatively fewer serious side effects. These
              include lower risks or no risks of elevated lipids, sexual dysfunction, weight gain,
              diabetes, sedation, and drop of blood pressure when standing.
            </p>
            <p>
              Like all drugs and remedies described, information about the common and less serious
              side effects are readily available from drug package inserts or by way of a simple
              search on the Internet. Since the incidence of more serious side effects also varies
              among these agents, both the side effect risks, and effectiveness of these drugs
              should be taken into account when considering drug options. A potentially serious but
              uncommon side effect is a heart rhythm abnormality.
            </p>
          </Prose>
        </TextWithFigure>

        <div className="mt-10">
          <Prose className="max-w-none">
            <p>
              Table 2. Comparisons of side effects from atypical antipsychotic drugs frequently used
              for OCD treatment*
            </p>
          </Prose>
          <Table
            caption="Comparisons of side effects from atypical antipsychotic drugs frequently used for OCD treatment"
            head={[
              'AAP',
              'Brand name',
              'Weight Gain',
              'Nausea Vomiting',
              'Dizziness',
              'Sexual Dysfunction',
              'EPS 6',
              'Drowsiness',
            ]}
            rows={[
              ['aripiprazole', 'Abilify', '+', '++', '+', '+', '++', '++'],
              ['olanzapine', 'Zyprexa', '+++', '+', '++', '++', '+++', '++++'],
              ['quetiapine', 'Seroquel', '+++', '+', '++', '+', '++', '++++'],
              ['risperidone', 'Risperdal', '++', '+++', '++', '++++', '+++', '++++'],
              ['ziprasidone', 'Geodon', '+', '+', '++', '+', '+', '+++'],
            ]}
          />
          <Prose className="max-w-none">
            <p>
              * The indicators range from “+” = minimal to none up to “++++” which is at least a 30%
              risk
            </p>
          </Prose>
        </div>
      </PageSection>

      <PageSection
        heading="AMISULPRIDE & D-CYCLOSERINE (SEROMYCIN)"
        tone="mist"
        className={CAPS_HEADING}
      >
        <TextWithFigure
          figure={<Figure file="2022-06-flt3.jpg" alt="An outline drawing of a capsule" />}
        >
          <Prose>
            <p>
              Amisulpride is discussed separately since it shows promise as an AAP in OCD, but is as
              yet understudied and not a mainstream OCD drug. It is highly specific for certain
              dopamine receptors and blocks dopamine signal transmission. It is not currently
              available in the US, but is approved in the UK and throughout mainland Western Europe.
            </p>
            <p>
              The most commonly observed side effects included weight gain, mild sedation and
              asthenia, and like the other AAPs, there is an increased risk of developing extreme
              side effects. Sexual side effects were infrequently observed.
            </p>
            <h3>SPECIFIC NEUROTRANSMITTER MODULATORS</h3>
            <p>
              There is rapidly growing interest in the use of drugs that specifically target
              neurotransmitters in several distinct ways. Several show promise for OCD treatment
              and, in general, their side effect properties are quite modest.
            </p>
            <h3>D-CYCLOSERINE (SEROMYCIN)</h3>
            <p>
              D-cycloserine appears to alter neurotransmitter function in a manner that accelerates{' '}
              <em>extinction learning</em>. Extinction learning, or conditioning, occurs when a
              stimulus for a particular action (such as an obsession) is <em>not</em> followed by
              the conditioned response (the compulsion). Extinction learning is a fundamental part
              of ERP therapy.
            </p>
            <p>
              Although clinical research studies of D-cycloserine have been mixed, some show that
              the combination of ERP and D-cycloserine results in at least a doubling of the{' '}
              <em>rate</em> of improvement compared to ERP alone and may be considerably faster in
              the early part of ERP treatment. However, although treatment with D-cycloserine may
              accelerate progress, it appears that untreated ERP patients eventually “catch up” with
              the treatment group. There is little to no evidence that D-cycloserine significantly
              enhances the <em>effectiveness</em> of ERP. Rather, it appears to enhance extinction
              learning thereby enabling the patient to <em>more quickly improve</em> and, perhaps,
              even shorten the required duration of the ERP treatment course. Current guidelines
              from the American Psychological Association include the recommendation that to be an
              effective adjunct for ERP, D-cycloserine should be administered not more than 2 hours
              before ERP; little to no treatment effect is seen if it is given 4 or more hours
              before ERP.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection
        heading="MEMANTINE (NAMENDA), RILUZOLE (RILUTEK) & OTHER DRUGS"
        className={CAPS_HEADING}
      >
        <TextWithFigure
          figure={<Figure file="2022-06-flt1.jpg" alt="A circle filled in a little past halfway" />}
        >
          <Prose>
            <p>
              Memantine’s principal action results in suppression of glutamate activity. Several
              studies of the addition of memantine to SSRI have shown generally favourable responses
              in one-third to two-thirds of treated. Preliminary findings suggest that adjunctive
              memantine shows considerable promise in SSRI treatment resistant patients. The
              frequency and type of reported mild side effects did not differ between patient
              groups, suggesting that memantine might be better tolerated in patients intolerant to
              other agents.
            </p>
          </Prose>
        </TextWithFigure>

        <Prose className="mt-6">
          <h3>RILUZOLE (RILUTEK)</h3>
          <p>
            Riluzole is another glutamate-modulating drug for OCD that affords significant symptom
            improvements in about half of patients whose OCD was not controlled with SSRI treatment.
            As with most of the other drugs used to treat OCD it is, as yet, unknown why some
            patients respond to specific drugs and others do not. This also is why drug trial and
            error for treatment-resistant patients is highly advisable for those whose symptoms
            continue to be distressing.
          </p>
          <h3>UPDATE ON OTHER DRUGS</h3>
          <p>
            Among other drugs of several classes that have been used to treat OCD, several have
            attracted interest. Although limited in scope and still preliminary, current information
            about patients and /or data from recently completed clinical trials follows.
          </p>
          <h3>TOPIRAMATE (TOPAMAX)</h3>
          <p>
            This drug is an anti-seizure medication and is also used for bipolar disorder and the
            prevention of migraine headaches. The use of topiramate as an add-on treatment for OCD
            is based on several of its actions that result in diminished glutamate activity and
            increased GABA actions. There are, however, conflicting results from several recent
            controlled studies. Also, troublesome side effects include influenza-like symptoms,
            difficulties with memory, and distorted taste sensation. It is also worth noting that
            the average treatment time until full drug effect may take several months.
          </p>
          <h3>LAMOTRIGINE (LAMICTAL AND OTHER BRAND NAMES)</h3>
          <p>
            Lamotrigine is an anti-seizure drug and mood stabiliser. Its actions result in decreased
            glutamate levels and interference with glutamate neurotransmission. It has been used
            successfully in bipolar disorder. Reports of lamotrigine as an effective add-on
            treatment for OCD show mixed results. Side effects were observed in 5% to 20% of the
            patients. These were generally mild and transient, and included sedation, fatigue,
            headache, and skin rash.
          </p>
          <p>
            The optimal OCD lamotrigine doses remain unclear, although higher doses may result in
            better responses. Given the levels of overall improvement generally observed, and its
            modest side effect profile, lamotrigine appears to merit consideration when other drugs
            are ineffective.
          </p>
          <h3>ONDANSETRON (ZOFRAN)</h3>
          <p>
            This drug is mainly used to control nausea and vomiting, especially when associated with
            cancer chemotherapy, radiotherapy and other conditions. The interest in ondansetron as a
            possible OCD drug is due to its actions that result in reduced nerve transmission by
            dopamine. As an augmentation agent, several uncontrolled studies showed, at best, only
            modest improvement from the addition of ondansetron to an SSRI.
          </p>
          <p>
            Common side effects seen with treatment include headache, constipation, and abdominal
            pain. The high doses of ondansetron that have shown efficacy in clinical trials also
            increase the possibility of long QTc heart arrhythmias in at-risk patients.
          </p>
          <h3>GRANISETRON (SANCUSO, GRANISOL)</h3>
          <p>
            Although granisetron has actions similar to ondansetron, it differs in its ability to
            cross readily from the blood into the spinal fluid that bathes the brain. There appears
            to be only one study of granisetron in moderate to severe OCD in which one group of
            patients received granisetron and fluvoxamine and another fluvoxamine alone for eight
            week. At the end of the study period, a significant and substantial percentage of those
            receiving granisetron had complete responses (35% or greater reduction of Y-BOCS scores)
            and remission (Y-BOCS score 16 or less). More modestly improved scores were also seen in
            the fluvoxamine-only group.
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="BRIEF MENTIONS" tone="mist" className={CAPS_HEADING}>
        <TextWithFigure
          figure={<Figure file="2022-06-flt2.jpg" alt="A circle with a line struck through it" />}
        >
          <Prose>
            <h3>PREGABALIN (LYRICA)</h3>
            <p>
              This drug stimulates GABA production, thereby inhibiting glutamate release. Several
              case reports and case series have demonstrated improvement of OCD symptoms when
              combined with an SSRI with or without an atypical antipsychotic, suggesting a possible
              role for this drug in patients with resistance to multiple drugs. To date, however,
              recommendations would be very premature and based on insufficient data.
            </p>
            <h3>PINDOLOL (VISKEN AND GENERIC EQUIVALENTS)</h3>
            <p>
              A member of the beta-blocker class of medications, pindolol is primarily used to treat
              high blood pressure. It also promotes the release of serotonin in the brain, which is
              the basis for its inclusion in this report. Several small case studies have shown a
              statistically significant but rather modest improvement of Y-BOCS scores. Although its
              side-effect profile is very modest, any estimation of effectiveness in OCD treatment
              regimens needs considerably more study.
            </p>
            <h3>LITHIUM (LITHOBID, LITHANE)</h3>
            <p>
              Lithium is one of the principal drugs used for mood stabilisation in patients with
              mania and bipolar disorder. Lithium interacts with neurotransmitters in several
              complex ways, and results in reduced availability of dopamine and glutamate, the
              stimulatory neurotransmitters, while increasing GABA levels. Based on this mechanism
              of action, lithium has been evaluated for OCD treatment. Much of this interest comes
              from reports of improved OCD-like symptoms in bipolar disorder patients taking
              lithium. However, at least two clinical trials failed to show any clinically
              significant improvement using add-on lithium for patients with primary OCD. There is
              no convincing evidence to support its usefulness as OCD add-on treatment, and further
              raises the question of whether the OCD symptoms associated with bipolar-disorder, and
              those in primary OCD, occur as the result of different or unrelated mechanisms.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="THE INTERNET AS A CBT RESOURCE" className={CAPS_HEADING}>
        <Prose>
          <p>
            There is no question that the proper use of CBT is a key part, and in some cases the
            only necessary part, of OCD therapy. However, there are longstanding obstacles that
            interfere with efforts to access CBT. Among these are the limited availability of
            appropriately trained therapists, costs of therapy, time requirements, and therapist
            availability and response times.
          </p>
          <p>
            Given the extent of problems with access to conventional therapy, and with no solution
            in sight, clinician-investigators have pursued alternative treatment methods that have
            both clinical and cost effectiveness.
          </p>
          <p>
            Over the past few years use of the Internet as a vehicle to administer CBT has
            progressed from a mere idea to a robust new area of investigation. The methods used to
            conduct remote CBT, with or without drug therapy, continue to evolve and increasingly
            show promise as an alternative to face-to-face therapy. The feasibility and apparent
            effectiveness of internet-based CBT (iCBT) has already been demonstrated in other
            psychiatric conditions, including depression and anxiety disorders. Clinical studies of
            iCBT effectiveness for OCD demonstrate that, compared to non-intervention or unguided
            self-help (such as books or video), iCBT is significantly superior. However, when
            compared to conventional CBT, iCBT results in quantitative overall improvement that is
            inferior or equivalent to CBT. Nonetheless, the benefits of better access and improving
            treatment outcomes should not be underestimated. This approach to treatment also allows
            patients to be treated in the privacy of their own homes or anywhere else as long as a
            computer and online access are available.
          </p>
          <p>
            Among recent study data, substantial evidence indicates that a limited amount of online
            therapist involvement, mainly for monitoring compliance and progress, as well as support
            and motivation, enhances iCBT outcomes. A patient-therapist contact effect has been
            found with as little as 10 minutes per patient per week. Further, the gains from iCBT
            appear to last beyond the period of active therapy, and the cost of treatment is far
            less than conventional CBT. iCBT can be sustained for at least 24 months by the addition
            of booster sessions for treatment refreshment.
          </p>
          <p>
            Unguided self-help (such as books or video) is inferior to conventional skilled therapy
            and appears ill advised in most cases. Among future challenges to successful treatment
            are the level of poor adherence to iCBT homework and other forms of noncompliance in as
            many as one-third of participating patients.
          </p>
          <p>
            Considering that iCBT appears to be equal to or somewhat less effective than direct CBT,
            and that there are minimal associated complications (except for non-compliance),
            supporters of iCBT have proposed a step-wise treatment approach. Following an initial in
            person assessment, initial treatment of selected patients with mild to moderate OCD
            (with or without drug therapy) begins with iCBT. For those who fail to show the expected
            level of improvement, escalation of treatment can include face-to-face therapy with a
            cognitive-behavioural therapist.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
