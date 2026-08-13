import type { Metadata } from 'next'

import { Figure, PageBanner, PageSection, Photo, Prose, TextWithFigure } from '@/components/site'
import { ButtonLink } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Research',
}

export default function ResearchPage() {
  return (
    <>
      <PageBanner title="Research" />

      <PageSection heading="Participate in Research">
        <TextWithFigure
          figure={
            <Figure
              file="2022-04-reaserch-second-img.svg"
              alt="A magnifying glass over a questionnaire with charts and ticked boxes"
            />
          }
        >
          <Prose>
            <p>
              Want to participate in brand new OCD research? Please have a look at the current OCD
              studies looking for participants.
            </p>
          </Prose>
          <div className="mt-8">
            <ButtonLink href="/participate-research" detail="about taking part in research">
              LEARN MORE
            </ButtonLink>
          </div>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="Psilocybin Campaign" tone="mist">
        <TextWithFigure
          figure={
            <Photo
              file="2020-11-Psilocybin-study-continues-to-aim-for-launch-in-early-2021-1.png"
              alt="A researcher speaking behind the chemical structure of psilocybin"
            />
          }
        >
          <Prose>
            <p>
              In 2020 we ran a 5-week crowdfunding campaign and raised £60,130 for our psilocybin
              project. Thank you to everyone who contributed and supported us.
            </p>
          </Prose>
          <div className="mt-8">
            <ButtonLink href="/psilocybin-crowdfunding-campaign">learn more</ButtonLink>
          </div>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="OCD Survey">
        <TextWithFigure
          figure={
            <Figure
              file="2022-05-ee.svg"
              alt="Researchers around a giant lightbulb with charts, gears and a clock"
            />
          }
        >
          <Prose>
            <p>
              Here at Orchard, we work to develop new treatments for OCD, however we have repeatedly
              heard from researchers that recruitment for OCD studies is difficult. We have worked
              in partnership with the{' '}
              <a href="https://www.herts.ac.uk/" rel="noreferrer">
                University of Hertfordshire
              </a>{' '}
              and have launched an OCD survey on new or alternative forms of OCD therapy. Those
              participating must be 18 or over and self identify with having OCD. Survey
              participants are extremely important to the development of OCD treatments, which could
              help many others in the future.
            </p>
            <p>Please use the link below to find out more and participate:</p>
          </Prose>
          <div className="mt-8">
            <ButtonLink href="https://redcap.herts.ac.uk/surveys/?s=LETKTCCJPM">
              Take part
            </ButtonLink>
          </div>
        </TextWithFigure>
      </PageSection>

      <PageSection heading="Foundation of OCD Research (FFOR)" tone="ruled">
        <TextWithFigure
          figure={
            <Figure
              file="2022-06-FFOR-Logo-Website.png"
              alt="FFOR, the Foundation for OCD Research"
            />
          }
        >
          <Prose>
            <p>
              Our friends at the Foundation for OCD Research(FFOR) provide grants to support
              innovative research that will advance the understanding and/or treatment of obsessive
              compulsive disorder. Detailed information is available at:{' '}
              <a href="https://www.ffor.org/grants" rel="noreferrer">
                www.ffor.org/grants
              </a>
            </p>
          </Prose>
        </TextWithFigure>
      </PageSection>
    </>
  )
}
