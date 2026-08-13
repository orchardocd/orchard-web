import type { Metadata } from 'next'

import { Figure, PageBanner, PageSection, Prose, Table, TextWithFigure } from '@/components/site'

export const metadata: Metadata = {
  title: 'First line treatment',
}

const CAPS_HEADING = '[&_h2]:leading-none [&_h2]:tracking-[-0.02em]'

export default function FirstLineTreatmentPage() {
  return (
    <>
      <PageBanner
        title="First Line Treatment"
        eyebrow="About OCD"
        image="2022-08-about-ocd-slider1-1.png"
        imageAlt="Three people in distress: one bent double, one curled up with a hand over their face, and one standing with their arms raised"
      >
        <p>
          The reader must be aware that the following information about treatment options is
          intended only as a range of treatment approaches available for people with OCD. The goal
          is to provide an overall understanding of these therapies sufficient to enable more
          informed interactions with physicians and therapists. The numerous OCD treatment options
          currently available, and the variability of specific OCD characteristics, are taken into
          account by physicians and therapists when making treatment recommendations. Better
          insights into these factors will, hopefully, allow patients and families to be more active
          participants in discussions and treatment decision-making with their OCD specialists.
        </p>
      </PageBanner>

      <PageSection heading="What Is OCD?" tone="mist">
        <Prose>
          <p>
            OCD is one of the most commonly occurring mental health disorders. It affects about 2%
            to 3% of people in Western general populations. It is characterised by recurring
            intrusive thoughts that are very hard to prevent or control (the obsessions).
          </p>
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

      <PageSection
        heading="FIRST LINE TREATMENT WITH COGNITIVE BEHAVIOURAL THERAPY"
        className={CAPS_HEADING}
      >
        <TextWithFigure
          figure={
            <Figure
              file="2022-06-flti3.jpg"
              alt="A head in profile with a question mark and looping lines drawn inside it"
            />
          }
        >
          <Prose>
            <p>
              The two principal types of OCD treatment are cognitive behavioural therapy (CBT) and
              medication. Evidence of clinical effectiveness has been amply demonstrated for both
              and each has a role in OCD symptom control. Whether to begin treatment with CBT,
              medication, or both, depends on the assessment of the type and severity of the OCD,
              practitioner experience and preference, and patient health and coexisting medical
              problems. The latter must be considered carefully in order to minimise the risk of
              treatment noncompliance.
            </p>
            <p>
              Cognitive therapy and behavioural therapy are separate but complementary treatment
              methods.
            </p>
            <p>
              Cognitive therapies help patients to understand their dysfunctional thoughts or
              beliefs. These insights help to develop greater familiarity and objectivity about the
              nature of their obsessions.
            </p>
            <p>
              The behavioural therapy part of CBT most often used for those with OCD is referred to
              as Exposure and Response Prevention (ERP). ERP is based on the observation that when
              patients can resist or delay a particular compulsion, even for a short time, the
              magnitude of their obsessive thoughts may decrease or disappear (<em>habituation</em>
              ). The typical ERP procedure involves deliberate and incremental exposure to those
              situations or thoughts that are fearful and cause anxiety and requires patients to
              resist performing any compulsive actions. Conducting ERP therapy can be an extremely
              stressful exercise, and some whose obsessions are embarrassing and humiliating are
              unwilling to undergo treatment. When patients complete their ERP treatment course, it
              has been unequivocally proven to be an effective and often sustainable first line
              therapy, with as many as 50% to 60% having an initial response.
            </p>
            <p>
              It is not yet completely clear whether CBT or medication (usually SSRIs – see below)
              is the first line treatment of choice. In general, although both CBT/ERP treatment and
              first line drug therapy have been effective in OCD, it appears that the reported
              levels of improvement from ERP are more consistent than drug treatment. For patients
              eligible for either approach, ERP may be more attractive, and will avoid undesirable
              drug side effects.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection
        heading="NEUROTRANSMITTERS AS TARGETS FOR DRUG THERAPY"
        tone="mist"
        className={CAPS_HEADING}
      >
        <TextWithFigure
          figure={
            <Figure
              file="2022-06-flti2.jpg"
              alt="A line drawing of a molecule, a ringed structure with branches"
            />
          }
        >
          <Prose>
            <p>
              Imbalances of certain neurotransmitters are thought to play important roles in OCD.
              Most current and emerging drug treatments for OCD, in different ways, are intended to
              mitigate the abnormal balance.
            </p>
            <p>
              Numerous types of neurotransmitters have functional roles in the brain that are
              critically essential to all aspects of brain function. Neurotransmitters function by
              facilitating, inhibiting, or otherwise altering the nerve-signalling pathways for any
              or all brain functions.
            </p>
            <p>Abnormalities of neurotransmitter function appear to have central roles in OCD.</p>
            <p>
              Genetic, functional brain imaging, and clinical analyses of OCD patients point to
              several neurotransmitters as likely contributors to the development of the disorder.
              These are{' '}
              <em>glutamate, gamma-aminobutyric acid (GABA), serotonin (5-HT), and dopamine.</em>
            </p>
            <p>
              <em>Glutamate</em>, the most abundant neurotransmitter, acts to increase the
              excitability of nerves. Excessive brain nerve excitability from elevated levels of
              glutamate and dopamine is thought to be central to OCD behaviours. In fact, when
              otherwise normal laboratory animals have glutamate levels artificially increased, they
              exhibit OCD-like behaviour.
            </p>
            <p>
              There also are findings to support an important role for dopamine in OCD. Among its
              neurotransmitter functions, <em>dopamine</em> mediates compulsions, and the sense of
              satisfaction and pleasure from a particular experience. In a sense, compulsions can be
              thought of as attempts to relieve the extreme anxiety that results from obsessive
              thoughts. One hypothesis is that excess dopamine reinforces the sense of relief (the
              “pleasurable” experience) when a compulsion offsets the distress of a particular
              obsession.
            </p>
            <p>
              <em>Gamma-aminobutyric acid (GABA)</em> is the second most abundant neurotransmitter,
              and has a role opposite to glutamate, acting to reduce nerve excitability throughout
              the nervous system including the brain. The levels of GABA in OCD patients tend to be
              low and insufficient to offset neurostimulation. In addition, low brain{' '}
              <em>serotonin</em> levels are regularly seen. Serotonin and several other
              neurotransmitters play important roles in response inhibition which is particularly
              poor in OCD. When serotonin availability is increased with drug therapy, glutamate
              levels decrease and GABA levels rise, with a net effect of diminished
              neurostimulation. Serotonin appears to be a modulator of excitatory nerve transmission
              – acting as one investigator describes, as a nerve transmission “brake”.
            </p>
            <p>
              Current gene research has identified several abnormalities that may result in abnormal
              neurotransmitter structure or function. An understanding of the different forms of
              neurotransmitter dysfunction that likely play roles in OCD enables a more focused
              approach to developing new drugs and therapies to prevent those specific
              neurotransmitter disturbances responsible for OCD symptoms.
            </p>
            <p>
              Considering OCD as a group of similar disorders with somewhat different manifestations
              also may explain why there is so much variability of drug treatment effectiveness, and
              why trial and error and combination therapy are often needed.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="FIRST LINE DRUG TREATMENT OF OCD" className={CAPS_HEADING}>
        <TextWithFigure figure={<Figure file="2022-06-flti1.jpg" alt="A capsule and a tablet" />}>
          <Prose>
            <p>
              Selected drugs that are commonly used, or show promise, in OCD management are included
              in this section, and the information will be updated as progress demands. Most people
              with OCD are initially managed as outpatients, although hospitalisation may become
              necessary if a patient becomes dysfunctional with a severe relapse, is causing
              significant disruption at home or at work, and certainly if there appears to be a risk
              of suicide. Despite a great deal of research, the results of a great many studies show
              mixed or even conflicting results for the drugs used in OCD. While this can cause
              great frustration for patients and their health professionals, an effective treatment
              strategy is eventually found for most.
            </p>
            <p>
              The reader must be aware that the information that follows for all types of treatments
              is intended to provide an overall understanding of potentially useful treatment
              approaches for people with OCD. Beyond this, there are numerous other aspects of every
              patient’s case that will be considered by your OCD specialist in order to make
              tailored treatment recommendations.
            </p>
            <p>
              The majority of published guidelines for treatment of OCD recommend using a selective
              serotonin reuptake inhibitor (SSRI), cognitive behavioural therapy (CBT), or a
              combination of the two, as initial treatment. SSRIs are best known for the treatment
              of depression and there are a number of SSRIs currently available. In general, the
              actions of these drugs result in increased availability of serotonin. As already
              stated, increased serotonin levels lead to reduced glutamate and increased GABA in
              many parts of the brain. This is thought to be the action responsible for its
              effectiveness in OCD.
            </p>
          </Prose>
        </TextWithFigure>

        <Prose className="mt-6">
          <p>
            The results of treatment with different SSRIs are essentially comparable and there is no
            current consensus about which SSRI is most effective for OCD treatment. There are,
            however, differences in their side effect profiles that may be of some importance in
            individual patients. Although clomipramine (a tricyclic antidepressant) has usually
            shown equivalent to somewhat better treatment results compared to SSRIs, its side effect
            profile makes it a generally less preferred choice as first line therapy. Overall, about
            40% to 60% of patients treated with SSRIs have satisfactory improvement of their
            symptoms. Investigations of effectiveness using SSRI and CBT combination therapy have
            also shown greater benefit compared to SSRI alone.
          </p>
          <p>
            There is existing evidence that those who are unresponsive to a particular SSRI may
            benefit from substituting a different one. There also is a solid consensus that for
            greatest effect, patients with OCD generally require SSRI doses in the upper to near
            maximal range, if tolerated. This observation is not restricted to any one SSRI drug
            and, unfortunately, many OCD patients receiving SSRI turn out to be undertreated. A
            treatment period of <em>at least 8 to 12 weeks</em> is recommended before concluding
            that there is lack of efficacy. Numerous patients will prematurely consider their SSRI
            treatment ineffective and discontinue treatment too soon.
          </p>
        </Prose>

        <div className="mt-10">
          <Table
            caption="Serotonin reuptake inhibitor doses for OCD, in milligrams per day"
            head={[
              'Serotonin reuptake inhibitor',
              <>
                Starting dose (mg / day)<sup>a</sup>
              </>,
              'Usual target',
              'Usual maximum',
            ]}
            rows={[
              ['Clomipramine', '25', '100-250', '250'],
              ['Escitalopram', '10', '20', '40'],
              ['Fluoxetine', '20', '40-60', '80'],
              ['Fluvoxamine', '50', '200', '300'],
              ['Paroxetine', '20', '40-60', '60'],
              [
                <>
                  Sertraline<sup>d</sup>
                </>,
                '50',
                '200',
                '200',
              ],
            ]}
          />
          <Prose className="max-w-none">
            <p>
              *From Seibel P &amp; Hollander E (2014). <em>F1000 Prime Rep, 6, 68</em>. (41)
            </p>
          </Prose>
        </div>

        <Prose className="mt-10">
          <p>
            As already stated, clomipramine has demonstrated effectiveness as first line therapy for
            OCD. This medication is in a different drug class (tricyclic antidepressant) but also
            causes serotonin levels to increase. It has been tested head-to-head with different
            SSRIs with little to no consistent differences in results. Many of clomipramine’s side
            effects are similar to those of the SSRIs. However, they tend to be more severe and
            cause more treatment dropouts than the SSRIs. The most frequent side effects rated by
            patients as obstacles to treatment were sexual dysfunction (males more than females),
            weight gain, and sleep disturbances. Serious heart rhythm disturbances and seizures,
            while uncommon with clomipramine, are much less likely with SSRIs. Given the frequency
            and degrees of side effects with clomipramine, an SSRI is usually preferred for the
            initial medication trial, particularly if long-term therapy is anticipated.
          </p>
          <p>
            *The Y-BOCS is a scale that rates severity of OCD and is the most widely used assessment
            tool for OCD. It can be used to measure change of OCD severity such as before and after
            a treatment, and also to compare treatments. Its OCD scores are: 0-7 subclinical; 8-15
            mild; 16-23 moderate; 24-31 severe, and 32-40 extreme.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
