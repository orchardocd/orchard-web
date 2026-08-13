import type { Metadata } from 'next'

import { PageBanner, PageSection, Prose, Table } from '@/components/site'

export const metadata: Metadata = {
  title: 'Psilocybin Crowdfunding Campaign',
  description:
    'Psilocybin Crowdfunding Campaign We closed our crowdfunding campaign (05/05-10/06 2020) with the amount of £60,130. Gift Aids amount to £6,000 making it to £66,130 in total donation. We have previously raised £60,000 from a charitable trust and that makes a total of £126,130 for the study of psilocybin! This would not have been possible without the generous donations […]',
}

const CAMPAIGN_URL = 'https://www.chuffed.org/project/orchardocd#/'
const FAQ_URL = 'https://www.orchardocd.org/wp-content/uploads/2022/06/FAQ-Psilocybn.pdf'

const DONORS = [
  ['Louisa Ackermann', 'Brendan Kindlon'],
  ['Didier Ah-Lone Chan', 'Edna Kissmann'],
  ['Sandy Aird', 'Gillian Knight'],
  ['Michelle Anderson', 'Norman Lamb'],
  ['Allana Angus', 'Jeremy Leggett'],
  ['Andrew Begley', 'Barbara Lewis'],
  ['Margaret Bell', 'Margaret MacIntosh'],
  ['Rudy Ben', 'Alan & Annie Magee'],
  ['Barbara Best', 'Richard McKenna'],
  ['Craig Best', 'David McKillop'],
  ['Fiona Best', 'Robin Moore'],
  ['Garry Best', 'Bryan Morgan'],
  ['John Best', 'Trudi Murray'],
  ['Karen Best', 'Annie Naughton'],
  ['Kyle Best', 'Matthew Neivens'],
  ['Mark Best', 'John Nicholas'],
  ['Olivia Best', 'Pippa Palmer'],
  ['Rebecca Best', 'Karen Patterson'],
  ['Simon Best', 'Andrew Pearson'],
  ['Christopher Best', 'Clare Pepler'],
  ['Billy Bhasin', 'Victoria Phillips'],
  ['Colin Black', 'Vanessa Pinfold'],
  ['Michelle Bourlet', 'Jo Pisani'],
  ['Giulia Bovolenta', 'Louise Plank'],
  ['Robert Bowden', 'Ros & Jan Ponder'],
  ['Louisa Boyles', 'Vanessa Pooley'],
  ['Graham Bradley', 'Victoria Randall'],
  ['Trilby Breckman', 'Lakshminarayan Ranganath'],
  ['David Brown', 'Maryanna Rann'],
  ['Adam Burt', 'Glenda Rapaport'],
  ['Chris Burt', 'Ilana Rapaport'],
  ['Nicola Butcher', 'Gabrielle Reason'],
  ['F C', 'Roger Roberts'],
  ['Jane Calne', 'Roger Roberts'],
  ['Barry Carter', 'Wendy Roberts'],
  ['Andrew Casserly', 'Mary Rose Roberts'],
  ['Jane Catford', 'Cathy Rowe'],
  ['Julie Charlton', 'Juliet Rowe'],
  ['Eduardo Cinosi', 'Dov Rubinstein'],
  ['Robert Cooper', 'David Russell'],
  ['Alli Cowling', 'Thomas Scharenheuvel-Lewitt'],
  ['John Dalby', 'Celia Scott Warren'],
  ['Rhodri Davies', 'Eleonora Serra'],
  ['Jennifer Denee', 'Jo Shaw'],
  ['Adama Djalo', 'Alan Shenkin'],
  ['Peter Downes', 'Sarah Sillars'],
  ['Neil Dugdale', 'Philip Simmons'],
  ['Peter Dunbar', 'The Simmons family'],
  ['Reece Edmends', 'Jean-Yves Sireau'],
  ['C Edmondson', 'Nicolas Sireau'],
  ['Anne B Ergbaum', 'Serge Sireau'],
  ['Caroline Farnsworth', 'Simone Sireau'],
  ['Bill Fellows', 'Sonya Sireau'],
  ['Sean Fletcher', 'Anna Smith'],
  ['Windsor Flynn', 'David Smith'],
  ['Matthew Ford', 'Mark Smith'],
  ['Linda Fraser', 'Nigel Smith'],
  ['Petya Galabova', 'Patrick Smith'],
  ['Heather Gardner', 'Paul Smith'],
  ['Christine Gayler', 'Sheena Smith'],
  ['Danielle Goodwin', 'Anthony Smyth'],
  ['Alexander Gubb', 'Colman Stephenson'],
  ['Will Gubb', 'Simon Stewart'],
  ['Anthony Hall', 'Alex Story'],
  ['Felice Hardy', 'Karen Sykes'],
  ['Sara Higgins', 'Jon Tancock'],
  ['RICHARD Hills', 'Rosaleen Tancock'],
  ['Rosie Hodge', 'Richard Thompson'],
  ['Simon Hodge', 'John trouw'],
  ['Nicholas Holford', 'Ana Tsifouti'],
  ['Simon Horseman', 'Richard Turner'],
  ['Ed Howe', 'Juliana Uhart'],
  ['Paul Howland', 'Thomas Uhart'],
  ['Dennis Huang', 'Luciano Ursache'],
  ['Elaine Hussey', 'Colleen Veal'],
  ['Max Illis', 'David Veale'],
  ['Angela J', 'Phillip Weaver'],
  ['Maurice James', 'Daniel Whiston'],
  ['Penelope Jeffreys', 'Emma Wilson'],
  ['Mike Johnson', 'Jenny'],
  ['David Jones', 'Pete and Ali'],
  ['Milad Khedr', ''],
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

      <PageSection label="Our donors">
        <Prose>
          <p>
            This would not have been possible without the generous donations of the following
            donors*. We are grateful for their kind donations.
          </p>
          <Table
            caption="Donors who gave £25 and above to the psilocybin crowdfunding campaign"
            rows={DONORS}
          />
          <p>
            *As per one of our campaign perks, this list comprises only those who donated £25 and
            above. We are nonetheless infinitely grateful to all donors!
          </p>
        </Prose>
      </PageSection>

      <PageSection label="Questions and answers about the campaign" tone="mist">
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
