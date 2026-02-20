export const ROUTES = {
  home: '/',
  terms: '/terms',
  privacy: '/privacy-policy',
  blog: '/blog',
  caseStudies: '/case-studies',
  start: '/start',
  team: '/team',
  changelog: '/changelog',
  nonprofit: '/pro-neziskovky',
  comparisonGoogleForms: '/echo-pulse-vs-google-forms',
  forCeos: '/for-ceos',
  forHr: '/for-hr',
  forTeamLeads: '/for-team-leads',
} as const;

export const HOME_SECTION_IDS = {
  radar: 'radar',
  caseStudies: 'case-studies',
  pricing: 'pricing',
  faq: 'faq',
} as const;

export const NAV_ITEMS = [
  HOME_SECTION_IDS.radar,
  HOME_SECTION_IDS.caseStudies,
  HOME_SECTION_IDS.pricing,
] as const;

export type HomeSectionId = (typeof NAV_ITEMS)[number] | (typeof HOME_SECTION_IDS)[keyof typeof HOME_SECTION_IDS];

export function blogPostPath(slug: string): string {
  return `${ROUTES.blog}/${slug}`;
}

export function caseStudyPath(slug: string): string {
  return `${ROUTES.caseStudies}/${slug}`;
}

export function homeAnchor(id: HomeSectionId | string): string {
  const clean = id.startsWith('#') ? id.slice(1) : id;
  return `/#${clean}`;
}
