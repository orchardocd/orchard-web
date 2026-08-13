import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose } from '@/components/site'

export const metadata: Metadata = {
  title: 'Psilocybin Crowdfunding Campaign',
  description:
    'Psilocybin Crowdfunding Campaign We closed our crowdfunding campaign (05/05-10/06 2020) with the amount of £60,130. Gift Aids amount to £6,000 making it to £66,130 in total donation. We have previously raised £60,000 from a charitable trust and that makes a total of £126,130 for the study of psilocybin! This would not have been possible without the generous donations […]',
}

const CAMPAIGN_URL = 'https://www.chuffed.org/project/orchardocd#/'
const FAQ_URL = 'https://www.orchardocd.org/wp-content/uploads/2022/06/FAQ-Psilocybn.pdf'

const DONOR_INDEX =
  'mt-8 columns-2 gap-x-6 text-base leading-relaxed text-body sm:columns-3 lg:columns-4'

const DONORS = [
  'Louisa Ackermann',
  'Didier Ah-Lone Chan',
  'Sandy Aird',
  'Michelle Anderson',
  'Allana Angus',
  'Andrew Begley',
  'Margaret Bell',
  'Rudy Ben',
  'Barbara Best',
  'Craig Best',
  'Fiona Best',
  'Garry Best',
  'John Best',
  'Karen Best',
  'Kyle Best',
  'Mark Best',
  'Olivia Best',
  'Rebecca Best',
  'Simon Best',
  'Christopher Best',
  'Billy Bhasin',
  'Colin Black',
  'Michelle Bourlet',
  'Giulia Bovolenta',
  'Robert Bowden',
  'Louisa Boyles',
  'Graham Bradley',
  'Trilby Breckman',
  'David Brown',
  'Adam Burt',
  'Chris Burt',
  'Nicola Butcher',
  'F C',
  'Jane Calne',
  'Barry Carter',
  'Andrew Casserly',
  'Jane Catford',
  'Julie Charlton',
  'Eduardo Cinosi',
  'Robert Cooper',
  'Alli Cowling',
  'John Dalby',
  'Rhodri Davies',
  'Jennifer Denee',
  'Adama Djalo',
  'Peter Downes',
  'Neil Dugdale',
  'Peter Dunbar',
  'Reece Edmends',
  'C Edmondson',
  'Anne B Ergbaum',
  'Caroline Farnsworth',
  'Bill Fellows',
  'Sean Fletcher',
  'Windsor Flynn',
  'Matthew Ford',
  'Linda Fraser',
  'Petya Galabova',
  'Heather Gardner',
  'Christine Gayler',
  'Danielle Goodwin',
  'Alexander Gubb',
  'Will Gubb',
  'Anthony Hall',
  'Felice Hardy',
  'Sara Higgins',
  'RICHARD Hills',
  'Rosie Hodge',
  'Simon Hodge',
  'Nicholas Holford',
  'Simon Horseman',
  'Ed Howe',
  'Paul Howland',
  'Dennis Huang',
  'Elaine Hussey',
  'Max Illis',
  'Angela J',
  'Maurice James',
  'Penelope Jeffreys',
  'Mike Johnson',
  'David Jones',
  'Milad Khedr',
  'Brendan Kindlon',
  'Edna Kissmann',
  'Gillian Knight',
  'Norman Lamb',
  'Jeremy Leggett',
  'Barbara Lewis',
  'Margaret MacIntosh',
  'Alan & Annie Magee',
  'Richard McKenna',
  'David McKillop',
  'Robin Moore',
  'Bryan Morgan',
  'Trudi Murray',
  'Annie Naughton',
  'Matthew Neivens',
  'John Nicholas',
  'Pippa Palmer',
  'Karen Patterson',
  'Andrew Pearson',
  'Clare Pepler',
  'Victoria Phillips',
  'Vanessa Pinfold',
  'Jo Pisani',
  'Louise Plank',
  'Ros & Jan Ponder',
  'Vanessa Pooley',
  'Victoria Randall',
  'Lakshminarayan Ranganath',
  'Maryanna Rann',
  'Glenda Rapaport',
  'Ilana Rapaport',
  'Gabrielle Reason',
  'Roger Roberts',
  'Roger Roberts',
  'Wendy Roberts',
  'Mary Rose Roberts',
  'Cathy Rowe',
  'Juliet Rowe',
  'Dov Rubinstein',
  'David Russell',
  'Thomas Scharenheuvel-Lewitt',
  'Celia Scott Warren',
  'Eleonora Serra',
  'Jo Shaw',
  'Alan Shenkin',
  'Sarah Sillars',
  'Philip Simmons',
  'The Simmons family',
  'Jean-Yves Sireau',
  'Nicolas Sireau',
  'Serge Sireau',
  'Simone Sireau',
  'Sonya Sireau',
  'Anna Smith',
  'David Smith',
  'Mark Smith',
  'Nigel Smith',
  'Patrick Smith',
  'Paul Smith',
  'Sheena Smith',
  'Anthony Smyth',
  'Colman Stephenson',
  'Simon Stewart',
  'Alex Story',
  'Karen Sykes',
  'Jon Tancock',
  'Rosaleen Tancock',
  'Richard Thompson',
  'John trouw',
  'Ana Tsifouti',
  'Richard Turner',
  'Juliana Uhart',
  'Thomas Uhart',
  'Luciano Ursache',
  'Colleen Veal',
  'David Veale',
  'Phillip Weaver',
  'Daniel Whiston',
  'Emma Wilson',
  'Jenny',
  'Pete and Ali',
]

export default function PsilocybinCrowdfundingCampaignPage() {
  return (
    <>
      <PageBanner title="Psilocybin Crowdfunding Campaign">
        <p>
          We closed our <a href={CAMPAIGN_URL}>crowdfunding campaign</a> (05/05-10/06 2020) with the
          amount of £60,130. Gift Aids amount to £6,000 making it to £66,130 in total donation.
        </p>
        <p>
          We have previously raised £60,000 from a charitable trust and that makes a{' '}
          <strong>total of £126,130 for the study of psilocybin</strong>!
        </p>
      </PageBanner>

      <PageSection heading="Our donors">
        <Prose>
          <p>
            This would not have been possible without the generous donations of the following
            donors*. We are grateful for their kind donations.
          </p>
        </Prose>
        <ul
          aria-label="Donors who gave £25 and above to the psilocybin crowdfunding campaign"
          className={DONOR_INDEX}
        >
          {DONORS.map((donor, index) => (
            <li key={index} className="break-inside-avoid">
              {donor}
            </li>
          ))}
        </ul>
        <Prose className="mt-8">
          <p>
            *As per one of our campaign perks, this list comprises only those who donated £25 and
            above. We are nonetheless infinitely grateful to all donors!
          </p>
        </Prose>
      </PageSection>

      <PageSection heading="Questions and answers about the campaign" tone="mist">
        <Prose>
          <p>
            The PDF document below has questions &amp; answers about our crowdfunding campaign and
            psilocybin study.
          </p>
          <p>
            <a href={FAQ_URL}>FAQ-Psilocybn</a>
          </p>
        </Prose>
      </PageSection>
    </>
  )
}
