import type { Metadata } from 'next'

import { PageBanner, PageSection, Photo, Prose, TextWithFigure } from '@/components/site'

export const metadata: Metadata = {
  title: 'Brain Stimulation',
}

export default function BrainStimulationPage() {
  return (
    <>
      <PageBanner
        title="Brain Stimulation"
        eyebrow="About OCD"
        image="2022-08-about-ocd-slider1-1.png"
        imageAlt="Three people in distress posed inside the letters O, C and D"
      >
        <p>
          Among the treatments presented below, transcranial magnetic stimulation and transcranial
          direct current stimulation are non-invasive procedures, meaning that they require no cut
          or break in the skin and no penetration into body cavities beyond their natural borders.
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

      <PageSection heading="REPETITIVE TRANSCRANIAL MAGNETIC STIMULATION (RTMS)">
        <TextWithFigure figure={<Photo file="2022-06-bs2.jpg" alt="A horseshoe magnet" />}>
          <Prose>
            <p>
              <em>Repetitive Transcranial Magnetic Stimulation</em> is a promising option for those
              whose OCD has not responded well to CBT and/or drug treatment.
            </p>
            <h3>INTRODUCTION</h3>
            <p>
              <em>Repetitive Transcranial Magnetic Stimulation</em> is a promising option for those
              whose OCD has not responded well to CBT and/or drug treatment. It is a method that has
              been used with some success in the treatment of several other types of mood disorders.
              The procedure uses an electromagnetic coil that is placed on the scalp over those
              specific areas of the brain suspected to play a role in several neuropsychiatric
              disorders, including anxiety and obsessive-compulsive disorder. The coil emits
              repetitive magnetic pulses that pass into the brain directly underlying the coil. The
              magnetic pulses are thought to work by creating tiny electric currents that stimulate
              or inhibit nerve cell activity in the area under the magnetic coil. With the
              exceptions of headaches, and pain or discomfort at the site where the coil is placed,
              the procedure is generally well tolerated by the majority of patients.
            </p>
            <p>
              Serious side effects are rare and include episodes of fainting and, even less common,
              seizures. Other risks are predominantly transient, including hypomania, hearing loss,
              cognitive changes and short-term memory impairment. There are numerous drugs that
              should be used with caution in conjunction with rTMS, primarily because of increased
              seizure risks. Before beginning rTMS, drug regimens should be carefully reviewed by a
              specialist physician.
            </p>
            <h3>RTMS FOR OCD</h3>
            <p>
              Contributing to the interest in rTMS for OCD is the finding of specific regions of
              overactivity in the brain. Repetitive TMS is typically administered as add-on therapy
              for both CBT and drug treatment. Like most OCD treatments, the results from rTMS vary.
              Some studies have found no clinically important improvement from rTMS, while others
              describe rather satisfactory results. It appears that these results are dependent on
              the frequency of the magnetic pulse, and the precise location of the coil on the
              scalp. In the case of anxiety disorders, improvement occurs when rTMS is administered
              over regions of the brain distinctly different from OCD. When rTMS treatment for OCD
              is applied over the locations used for anxiety, no effect is seen.
            </p>
            <p>
              The frequency of the energy emitted from the coil also appears to be important.
              Repetitive TMS at two different pulse frequencies was administered to patients with
              moderate to severe OCD, and the result tested at the conclusion of treatment and after
              three months. There was a significant (44%) decline of the average Y-BOCS score in the
              1Hz group but not the 10Hz or control groups. Other studies show that the degree of
              improvement from low frequency rTMS varies from study to study, with most in a range
              from 35% to 40%. Small and nil effects have also been reported in others. The response
              rates (the percent of treated patients who respond) range from about 30 to 60%,
              although this is not borne out in other reports. Some of the variability between
              studies may be the result of the criteria used to define response.
            </p>
            <p>
              Overall, the potential value of rTMS as add-on therapy to drug or CBT management is as
              yet controversial. Current clinical trials of rTMS treatment methods and efficacy will
              likely better clarify its value. In the meanwhile, significant side effects are very
              rare, and the options for patients refractory to treatment are limited. Those who do
              respond to rTMS appear to have more sustained remissions.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="TRANSCRANIAL DIRECT CURRENT (OR ELECTRIC) STIMULATION" tone="ruled">
        <TextWithFigure
          figure={
            <Photo
              file="2022-06-bs4.jpg"
              alt="A head in profile with two lightning bolts drawn inside the brain"
            />
          }
        >
          <Prose>
            <p>
              While <em>transcranial direct current stimulation</em> (tDCS) and rTMS are distinctly
              different methods, both are able to increase (enhance) or decrease (inhibit) neuron
              activity in specific areas of the brain. Which functional effect occurs depends on how
              the treatment is set up; in the case of rTMS it is a type of magnetic pulse, while
              tDCS actions are largely dictated by the direction of the delivered current.
            </p>
            <h3>INTRODUCTION</h3>
            <p>
              Research into the effects of tDCS on brain nerve cell activity has evolved over more
              than 50 years. From this work, it is now known that weak electrical current can be
              delivered to the brain through the scalp in order to alter nerve activity. Of great
              importance is the discovery that placing the anode of the circuit (the positive
              terminal) over the target area heightens the excitability of the underlying brain,
              while applying the cathode (the negative terminal) at the site inhibits excitability.
              Nerve cell excitability or inhibition can be manipulated by the direction of the
              current. The treatment benefits of tDCS have been tested in a number of diseases among
              which are depression, fibromyalgia, multiple sclerosis, pain control and Alzheimer’s
              disease with, at best, mixed results.
            </p>
            <h3>TDCS IN OCD</h3>
            <p>
              Data about effectiveness of tDCS for OCD is rather scant, particularly compared to
              rTMS. The findings in almost all of the published reports are based on several or
              fewer patients. However, more and better information may soon be available from
              several larger and better-designed research studies-in-progress.
            </p>
            <p>
              Several anecdotal published reports have interesting findings. One of these described
              the results of tDCS in two multi-drug and CBT-resistant patients with severe OCD. It
              appears that both patients had the mental rituals subtype of OCD in which both had
              obsessional thoughts with aggressive/harmful and strong sexual themes. The mental
              compulsions in one were comprised of silent repetitions of prayers. Successful
              treatment of such patients can be a greater challenge when compared to most other OCD
              subtypes. Both patients received a course of tDCS while continuing their drug
              treatment. Their baseline Y-BOCS scores were 25 and 30. Following treatment, both of
              their scores diminished by around 50%. Notably, one of these individuals, who had been
              unable to undergo ERP due to extreme anxiety, was able to re-enter CBT following tDCS.
            </p>
            <p>
              A separate report described tDCS treatment of two patients with multi-treatment
              resistant OCD (one with symmetry and the other contamination subtype). One of the
              patients experienced a 45% improved Y-BOCS score that was sustained on re-evaluation
              six months later. However, the other patient had no significant change. Several other
              studies report similar findings; there is wide variability of both response and
              sustainability using tDCS. Also, no patient characteristics have yet been found that
              help to predict the likelihood of benefit of tDCS as add-on treatment.
            </p>
            <p>
              Despite the inconsistent findings, tDCS is usually well tolerated, with side effects
              that include mild headache, and tingling and redness in the area under the electrode.
              In addition to its good side effect profile, tDCS is also a rather straightforward and
              comparatively inexpensive method that may be suitable for home use.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="ELECTROCONVULSIVE THERAPY (ECT)" tone="ruled">
        <TextWithFigure figure={<Photo file="2022-06-bs1.jpg" alt="A lightning bolt" />}>
          <Prose>
            <p>
              ECT is a procedure by which a small and precise pulse of electricity is passed into
              the brain from the scalp.
            </p>
            <h3>INTRODUCTION</h3>
            <p>
              ECT is a procedure by which a small and precise pulse of electricity is passed into
              the brain from the scalp. Patients and families’ anxiety or fear when ECT therapy is
              raised may arise from public perception of it being an archaic procedure. The current
              ECT protocols are anything but horrifying, although many still remember the images of
              Jack Nicolson undergoing ECT treatment in the 1975 movie{' '}
              <u>One Flew Over the Cuckoo’s Nest</u>.
            </p>
            <p>
              Unlike tDCS, ECT effects require that the electrical pulse results in a brief
              convulsion (seizure). Since those who undergo ECT usually receive general anaesthesia
              and muscle relaxants, the convulsion is not seen physically, but it is monitored using
              an <em>electroencephalogram (a.k.a. “EEG”) </em>(134). ECT has undergone a substantial
              amount of research and has been used to treat several types of mental illnesses for
              decades. The procedure results in altered balances of neurotransmitters and/or other
              chemical substances in the brain. However, it remains unclear how these changes modify
              clinical symptoms in several mental health disorders. Among these, ECT has
              consistently shown safety and effectiveness in depressive and bipolar disorders and
              schizophrenia.
            </p>
            <p>
              From a safety standpoint, ECT is considered to be generally safe, but potential
              adverse effects may occur. There are always risks associated with anaesthesia. This
              risk varies with the type of anaesthetics used, ongoing treatment with other drugs,
              and other individual health problems.
            </p>
            <p>
              Other possible side effects following ECT include short-term confusion, loss of memory
              of events occurring days or weeks before the procedure (referred to as retrograde
              amnesia), and nausea, headaches, or muscle pain immediately following the procedure.
              ECT safety in recent years was studied in a group of 107 patients who underwent more
              than 1,000 ECT procedures. There were no deaths, life-threatening events, or permanent
              injuries attributable to ECT. Approximately 67% of patients 60 years old or younger,
              and 42% of these aged more than 60 experienced no side effects. The most frequent side
              effect in the younger group was headache (13%), while in the older group it was memory
              loss (23%). ECT does not cause epilepsy.
            </p>
            <h3>ECT IN OCD</h3>
            <p>
              Largely because of its effectiveness in the treatment of mood disorders, ECT has been
              used for OCD patients, but quite uncommonly. Although some specialists consider ECT to
              have potential benefit in patients with treatment-resistant OCD, there is considerable
              uncertainty surrounding its direct benefit. There have been no formal studies of ECT
              in OCD and virtually all of the data is based on case reports or small case series.
              Almost all of the patients in these reports, including those whose OCD symptoms
              appeared to improve following ECT, had severe and treatment unresponsive conditions.
              However, the vast majority of these patients also had coexistent and significant mood
              disorders, mostly depressive. Other reports describe improvement of OCD symptoms that
              often arise in primary bipolar disorder and schizophrenia.
            </p>
            <p>
              At this time, most clinical scientists believe that there is little evidence that ECT
              is effective for treating primary OCD. The complex relationships between OCD and
              several other important mental disorders, and the lack of quality data, make
              conclusions about effectiveness unrealistic. Since experienced specialists can
              administer ECT with relative safety, it may be an option for those who remain ill
              despite numerous other therapies.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="DEEP BRAIN STIMULATION" tone="ruled">
        <TextWithFigure figure={<Photo file="2022-06-bs3.jpg" alt="A brain" />}>
          <Prose>
            <p>
              A growing number of DBS studies focus on treating OCD. The typical patient treated
              with DBS has severe…
            </p>
            <h3>INTRODUCTION</h3>
            <p>
              Like transcranial magnetic and direct current brain stimulation techniques, Deep Brain
              Stimulation (DBS) uses intermittent signaling to specific brain areas as the method of
              treatment. In contrast to transcranial procedures, DBS requires a minimally invasive
              neurosurgical procedure to insert precisely the electrodes into specific locations in
              the brain. Unlike other and more permanent neurosurgical options, DBS does not destroy
              brain tissue. This procedure is often described as akin to a heart pacemaker. The high
              frequency electrical pulses that are transmitted to the electrodes are able to alter
              specific nerve circuits in the immediately surrounding areas. The locations targeted
              for optimal electrode placement are selected based on extensive basic and clinical
              research. The guidance for electrode insertion by the neurosurgeon uses
              three-dimensional electronic mapping based on imaging studies of the patient’s brain.
            </p>
            <p>
              DBS has a successful track record for treatment of neurological and neuropsychiatric
              disorders including Parkinson’s disease, bipolar disorder and depression.
              Complications of DBS were documented in a report based on results from more than 30
              clinical studies. The most serious complication was bleeding into the brain cavity
              post-operatively. This occurred in 2.6% of the cases, and some resulted in permanent
              neurological injury of varying degree. Side effects from the DBS procedure were
              generally reported as minor and transient. Those often seen include worsening of
              anxiety, sensing the wires under the skin, flushing and hypomanic symptoms.
            </p>
            <h3>DBS IN OCD</h3>
            <p>
              A growing number of DBS studies focus on treating OCD. The typical patient treated
              with DBS has severe, intractable OCD that has not responded to multiple drug and
              behavioural therapies. Some also have failed to benefit from transcranial therapies.
              Short of permanent neurosurgical intervention, this is considered one of the last
              treatment options. Keeping in mind that DBS is performed in the cases of high
              severity, the results are quite encouraging. One representative report summarised the
              reported DBS outcomes from 25 previously published investigations. The averaged
              results showed:
            </p>
            <ul>
              <li>Patient improvement 55% (includes only those improved by at least 35%)</li>
              <li>Y-BOCS score reduction of 43%</li>
              <li>Length of follow up 31 months</li>
            </ul>
            <p>
              DBS appears to be a relatively safe and robust treatment option for OCD
              non-responders. Several target sites in the brain have shown good results, although
              the optimal site is yet to be determined.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>
    </>
  )
}
