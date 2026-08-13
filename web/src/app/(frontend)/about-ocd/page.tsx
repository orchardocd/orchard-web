import type { Metadata } from 'next'

import { Figure, PageBanner, PageSection, Prose, TextWithFigure, Video } from '@/components/site'

export const metadata: Metadata = {
  title: 'About OCD',
}

export default function AboutOcdPage() {
  return (
    <>
      <PageBanner
        title="What Is OCD?"
        eyebrow="About OCD"
        image="2022-08-about-ocd-slider1-1.png"
        imageAlt="Three people in distress: one bent double, one curled up with a hand over their face, and one standing with their arms raised"
      >
        <p>
          OCD is one of the most commonly occurring mental health disorders. It affects about 2% to
          3% of people in Western general populations. It is characterised by recurring intrusive
          thoughts that are very hard to prevent or control (the obsessions).
        </p>
      </PageBanner>

      <PageSection>
        <TextWithFigure
          figure={
            <Video
              url="https://www.youtube.com/watch?v=rrmHvlfLFh8"
              title="What is OCD?"
              poster="2024-09-video-image.png"
            />
          }
        >
          <Prose>
            <p>
              These lead to irresistible and recurring behaviours (the compulsions or rituals).
              Compulsions are actions taken to negate or resolve the disruptive, anxiety provoking
              and disturbing thoughts. A familiar example are those individuals so fearful of
              “contamination” from everyday activities, such as using a keyboard, touching a
              doorknob, or handling a notebook, that they feel compelled to scrub their hands with
              soap and water or a disinfectant many dozens of times a day and despite raw skin from
              the cleansers.
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
              The themes of the intrusive thoughts in people without OCD may be quite similar to
              those occurring in OCD. It is not necessarily the nature of the obsessive thought that
              defines OCD, but rather how that thought is interpreted and acted upon by the patient.
            </p>
            <p>
              Regrettably, OCD is usually a lifelong condition that waxes and wanes in intensity and
              frequency. Treatment can help manage the obsessions and compulsions, so that they are
              less disruptive. However, existing treatments for OCD are often ineffective, which is
              why we are pushing for the development of new and better treatments for this
              devastating condition.
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="What Causes OCD?" tone="mist">
        <TextWithFigure
          figure={<Figure file="2022-04-about-ocd-first-sec.svg" alt="A large question mark" />}
        >
          <Prose>
            <p>
              As with numerous other diseases and disorders, there are multiple factors that
              contribute to the development of OCD. Genetic abnormalities appear to be important;
              DNA research has found a number of genes that may play roles in OCD. Also,
              first-degree family members of OCD patients have an increased risk of OCD.
              Environmental factors, socioeconomic status and level of education also have been
              statistically linked to OCD.{' '}
              <strong>A single causative factor has not been found in OCD</strong>. Rather, it is
              likely that the above factors and other biological features contribute to OCD
              behaviours, and also determine the types of symptoms, severity, response to
              treatments, and course of the illness.
            </p>
            <p>
              While genetic differences and environmental factors may explain some of the “why”
              about OCD, the “how” – the mechanisms and biological pathways through which OCD
              symptoms manifest – is just as important to understand, particularly in the
              development of better and more focused treatment strategies.
            </p>
            <p>
              The typical dysfunctional thoughts and actions in OCD appear to result from abnormal
              levels of or defective neurotransmitters in the brain. Neurotransmitters, derived from
              amino acids, are the signalling molecules used by nerve cells to communicate and
              coordinate their activities. They mediate all aspects of brain activities, including
              things like thought formation, memory, emotion, learning, physical movement, and
              virtually all other brain functions.
            </p>
            <p>
              Imbalances or disturbances of several of these neurotransmitters appear to be central
              in the development of OCD. The neurotransmitters that play important roles in OCD
              include <em>glutamate, gamma-aminobutyric acid (GABA), serotonin (5-HT), dopamine</em>
              , and to a lesser extent, norepinephrine.{' '}
              <strong>
                These neurotransmitters are the targets for many of the drugs that have been a
                cornerstone of OCD treatment.
              </strong>
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="OCD Subtypes">
        <Prose>
          <p>
            Although patients with OCD share some clinical characteristics, they frequently have
            symptoms that are distinctive. Grouping patients according to their principal symptom
            profile is useful for:
          </p>
          <ul>
            <li>Scientific inquiry</li>
            <li>Clinical information exchange</li>
            <li>Specific treatment effectiveness</li>
            <li>Providing patients and their families with realistic long-term expectations</li>
          </ul>
        </Prose>

        <div className="mt-10 flex flex-col gap-10">
          <TextWithFigure
            figure={
              <Figure
                file="2022-04-Group-13562.png"
                alt="A person wearing rubber gloves scrubbing a surface, a germ crossed out in a thought bubble above them"
              />
            }
          >
            <Prose>
              <h3>Obsessive Thoughts About Contamination, Washing And Cleaning Compulsions</h3>
              <p>
                Patients with this subtype have obsessive thoughts that they are contaminated, often
                from their environment. The person with contamination obsessions can be very fearful
                and anxious, feelings only relieved by washing and/or decontamination compulsions.
                These rituals may consume many hours throughout the day.
              </p>
            </Prose>
          </TextWithFigure>

          <TextWithFigure
            figure={
              <Figure
                file="2022-04-Group-13752.png"
                alt="A person holding their head while lining up pencils and stacked books"
              />
            }
          >
            <Prose>
              <h3>Obsessive Thoughts About Symmetry, Compulsions Of Ordering And Arranging</h3>
              <p>
                People in this group suffer from intrusive thoughts that if you fail to properly
                sort or balance objects something bad will happen. Examples include the strong need
                to have pencils all sharpened to exactly the same height, organizing clothing by
                colour, or to be obsessive about arranging and rearranging the items on your desk in
                a precise and inflexible manner. Even finding a message or file that was out of
                place on your desk can cause distress.
              </p>
            </Prose>
          </TextWithFigure>

          <TextWithFigure
            figure={
              <Figure
                file="2022-04-Group-13667.png"
                alt="A person with a hand pressed to their forehead, their other arm repeated as if reaching again and again"
              />
            }
          >
            <Prose>
              <h3>Obsessive Thoughts About Doing Harm, Checking Compulsions</h3>
              <p>
                This subtype is associated with great anxiety and distress from strong yet
                irrational beliefs that you failed to do something or made a mistake that could
                result in harm to yourself or others. Checking compulsions are rituals undertaken
                repeatedly for reassurance and to relieve the fear and anxiety. Depending on the
                content of the obsessions, checking can take many forms. Someone might constantly
                worry that because they did not lock their door, intruders would get in and harm
                their family. Even if, rationally, they know they locked it, they are still
                compelled to return to the door and repeatedly check to be sure.
              </p>
            </Prose>
          </TextWithFigure>

          <TextWithFigure
            figure={
              <Figure
                file="2022-04-Group-14133.png"
                alt="A person sitting with their hands over their mouth, surrounded by scribbles, storm clouds and speech bubbles"
              />
            }
          >
            <Prose>
              <h3>Obsessive Disturbing Thoughts, Mental Compulsions</h3>
              <p>
                In this group, the obsessive thoughts usually have unacceptable (“taboo”),
                religious, sexual, violent, offensive, or impulsive/aggressive themes.
              </p>
            </Prose>
          </TextWithFigure>

          <TextWithFigure
            figure={
              <Figure
                file="2022-04-Group14040.png"
                alt="A person holding their head, surrounded by question marks, exclamation marks and tangled scribbles"
              />
            }
          >
            <Prose>
              <h3>
                Obsessions with excessive attachments to physical objects; Hoarding compulsions
              </h3>
              <p>
                In this subgroup, individuals usually fear discarding things that might be useful to
                them someday, or have difficulty deciding whether to keep or discard items. They
                typically collect, often in tremendous excess, items such as old newspapers and
                magazines, bottles and containers, mail, and many more that usually are considered
                by others to have little to no value. The clutter may accumulate to the point that
                it can cause fires, unsanitary conditions, loss of a great deal of living space, and
                accident risks.
              </p>
              <p>
                Compared to other OCD subgroups, hoarders tend to have greater levels of anxiety and
                are comparatively difficult to treat. At least one-half of hoarders have
                first-degree family members who demonstrate hoarding-like behaviour. Compared to
                other forms of OCD, depression and indecisiveness also tend to occur in family
                members.
              </p>
              <p>
                There also are several other important differences between hoarding and other OCD
                subgroups. Although the obsessions of other OCD subgroups are typically
                uncontrollable and unwanted, patients are quite aware of the extent to which their
                behaviours are abnormal. By contrast, hoarders usually do not perceive their
                compulsions as problematic or dangerous. This lack of insight is an obstacle to
                effective cognitive-behavioural therapy (CBT). Research studies have also shown that
                the areas of the brain associated with the other subgroups are distinctly different
                to those in the hoarder form. Finally, clinical research studies of the
                effectiveness of 3 conventional OCD drugs or CBT have shown mixed results, although
                recent data show superior outcomes when drug and cognitive-behavioural therapies are
                combined.
              </p>
            </Prose>
          </TextWithFigure>
        </div>
      </PageSection>

      <PageSection heading="First line treatment" tone="mist">
        <Prose>
          <p>
            The reader must be aware that the following information about treatment options is
            intended only as a range of treatment approaches available for people with OCD. The goal
            is to provide an overall understanding of these therapies sufficient to enable more
            informed interactions with physicians and therapists. The numerous OCD treatment options
            currently available, and the variability of specific OCD characteristics, are taken into
            account by physicians and therapists when making treatment recommendations. Better
            insights into these factors will, hopefully, allow patients and families to be more
            active participants in discussions and treatment decision-making with their OCD
            specialists.
          </p>
          <p>
            The two principal types of OCD treatment are cognitive behavioural therapy (CBT) and
            medication. Evidence of clinical effectiveness has been amply demonstrated for both and
            each has a role in OCD symptom control. Whether to begin treatment with CBT, medication,
            or both, depends on the assessment of the type and severity of the OCD, practitioner
            experience and preference, and patient health and coexisting medical problems. The
            latter must be considered carefully in order to minimise the risk of treatment
            noncompliance.
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
