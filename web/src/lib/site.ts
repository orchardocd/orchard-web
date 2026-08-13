type SiteLink = { label: string; href: string }

export type NavItem = SiteLink & { children: SiteLink[] }

type FooterColumn = { heading: string; links: SiteLink[] }

export type SocialProfile = { label: string; url: string }

export const DONATE_URL = 'https://checkout.justgiving.com/c/2633482'

export const REGISTRY_URL = 'https://orchardocdregistry.org/'

export const SITE_NAME = 'Orchard OCD'

export const SITE_TAGLINE = 'Advancing global OCD research'

export const SITE_STRAPLINE = 'Find · Filter · Fund'

export const LOGO_ALT = 'Orchard OCD, advancing global OCD research'

export const ANNOUNCEMENT: SiteLink & { text: string } = {
  text: 'Donate today to help OCD research',
  label: 'Donate now',
  href: DONATE_URL,
}

export const MAIN_NAV: NavItem[] = [
  {
    label: 'About OCD',
    href: '/about-ocd',
    children: [
      { label: 'First line treatment', href: '/first-line-treatment' },
      { label: 'Beyond first line therapy', href: '/beyond-first-line-therapy' },
      {
        label: 'Complementary and alternative therapies',
        href: '/complementary-and-alternative-therapies',
      },
      { label: 'Brain stimulation', href: '/brain-stimulation' },
    ],
  },
  {
    label: 'Our research',
    href: '/the-work-we-do',
    children: [
      { label: 'Our funded studies', href: '/the-work-we-do' },
      { label: 'Participate in research', href: '/participate-research' },
      { label: 'Our research strategy', href: '/our-research-strategy' },
      { label: 'Our funding policy', href: '/our-funding-policy' },
      { label: 'Our COI policy', href: '/our-coi-policy' },
    ],
  },
  {
    label: 'Get involved',
    href: '/get-involved',
    children: [
      { label: 'OCD registry', href: REGISTRY_URL },
      { label: 'Volunteer', href: '/volunteer' },
      { label: 'Fundraising & events', href: '/fundraising-events' },
      { label: 'Work with us', href: '/work-with-us' },
      { label: 'Become a trustee', href: '/become-a-trustee' },
    ],
  },
  {
    label: 'News & events',
    href: '/blog',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Webinars', href: '/webinars' },
      { label: 'Conference', href: '/conference' },
    ],
  },
  { label: 'About us', href: '/about-orchard', children: [] },
]

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Explore',
    links: [
      { label: 'About OCD', href: '/about-ocd' },
      { label: 'Our funded studies', href: '/the-work-we-do' },
      { label: 'Our research strategy', href: '/our-research-strategy' },
      { label: 'Participate in research', href: '/participate-research' },
      { label: 'Conference', href: '/conference' },
      { label: 'Webinars', href: '/webinars' },
    ],
  },
  {
    heading: 'Help & support',
    links: [
      { label: 'Join our mailing list', href: '/join-our-mailing-list' },
      { label: 'Volunteer', href: '/volunteer' },
      { label: 'Fundraising & events', href: '/fundraising-events' },
      { label: 'Cookies & privacy', href: '/cookies-privacy' },
      { label: 'Terms of use', href: '/terms-of-use' },
    ],
  },
]

export const CONTACT = {
  email: 'info@orchardocd.org',
  address: '66 Devonshire Road, Cambridge, Cambridgeshire, CB1 2BL, UK',
  mapUrl: 'https://www.google.com/maps?q=66+Devonshire+Road,+Cambridge,+Cambridgeshire,+CB1+2BL',
  charityNumber: '1174480',
  charityRegisterUrl:
    'https://register-of-charities.charitycommission.gov.uk/charity-search/-/charity-details/5098022',
}

export const SOCIAL: SocialProfile[] = [
  { label: 'Facebook', url: 'https://www.facebook.com/OrchardOCD' },
  { label: 'Instagram', url: 'https://www.instagram.com/orchardocd/' },
  { label: 'X / Twitter', url: 'https://twitter.com/OrchardOCD' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/orchard-ocd' },
  { label: 'YouTube', url: 'https://www.youtube.com/@orchardocd5099' },
]

export const NEWSLETTER = {
  heading: 'Subscribe to our newsletter',
  body: 'Here at Orchard OCD, we are focusing on developing treatments for patients suffering from obsessive-compulsive disorder (OCD), a serious mental illness. You can help us treat this debilitating disorder, through taking part in research, donating towards crowdfunding campaigns and promoting our work. All of this information will be sent to you through our E-News. Sign up today and you will be part of the future of OCD treatment.',
  signupUrl: '/join-our-mailing-list',
  ctaLabel: 'Join Our Mailing List',
}
