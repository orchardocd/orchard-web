import type { NavigationData, SiteSettingsData } from '@/seed/types'

export const DONATE_URL = 'https://checkout.justgiving.com/c/2633482'
export const REGISTRY_URL = 'https://orchardocdregistry.org/'

export const siteSettings: SiteSettingsData = {
  announcement: {
    enabled: true,
    text: 'Donate today to help OCD research',
    linkLabel: 'Donate now',
    linkHref: DONATE_URL,
  },
  donateUrl: DONATE_URL,
  registryUrl: REGISTRY_URL,
  contact: {
    email: 'info@orchardocd.org',
    address: '66 Devonshire Road, Cambridge, Cambridgeshire, CB1 2BL, UK',
    mapUrl: 'https://www.google.com/maps?q=66+Devonshire+Road,+Cambridge,+Cambridgeshire,+CB1+2BL',
    charityNumber: '1174480',
    charityRegisterUrl:
      'https://register-of-charities.charitycommission.gov.uk/charity-search/-/charity-details/5098022',
  },
  social: [
    { platform: 'facebook', url: 'https://www.facebook.com/OrchardOCD' },
    { platform: 'instagram', url: 'https://www.instagram.com/orchardocd/' },
    { platform: 'twitter', url: 'https://twitter.com/OrchardOCD' },
    { platform: 'linkedin', url: 'https://www.linkedin.com/company/orchard-ocd' },
    { platform: 'youtube', url: 'https://www.youtube.com/@orchardocd5099' },
  ],
  newsletter: {
    heading: 'Subscribe to our newsletter',
    body: 'Here at Orchard OCD, we are focusing on developing treatments for patients suffering from obsessive-compulsive disorder (OCD), a serious mental illness. You can help us treat this debilitating disorder, through taking part in research, donating towards crowdfunding campaigns and promoting our work. All of this information will be sent to you through our E-News. Sign up today and you will be part of the future of OCD treatment.',
    signupUrl: '/join-our-mailing-list',
  },
}

export const navigation: NavigationData = {
  main: [
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
  ],
  footer: [
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
  ],
}
