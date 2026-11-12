/**
 * Frontdoor HTML Templates - Registry of All 10 Templates
 * =======================================================
 */

import { TemplateMetadata, TemplateConfig } from './types.ts';
import { graduateDefaultConfig, buildGraduateHtml } from './graduate.ts';
import { universityportalDefaultConfig, buildUniversityPortalHtml } from './universityportal.ts';

export * from './types.ts';
export * from './shared.ts';
export * from './graduate.ts';
export * from './universityportalEngine.ts';
export * from './universityportal.ts';
export * from './universityportalDemoData.ts';
export * from './zipBuilder.ts';

export const TEMPLATES_LIST: TemplateMetadata[] = [
  {
    id: 'atelier',
    name: 'Atelier',
    category: 'Fashion',
    businessType: 'Fashion designers & tailors',
    file: '/atelier/index.html',
    createdAt: '2026-11-10',
    featureTags: ['CSS Lookbook Filter', ':target Lightbox', 'Fitting Booking'],
    description: 'Bespoke fashion couture & tailoring with 12-item lookbook, CSS category filter, and :target lightbox.',
    demoBrand: 'Adaeze Couture',
  },
  {
    id: 'glow',
    name: 'Glow',
    category: 'Beauty',
    businessType: 'Salons & luxury spas',
    file: '/glow/index.html',
    createdAt: '2026-11-10',
    featureTags: ['Naira Price Tabs', 'Therapist Team', 'Hours Schedule'],
    description: 'Spa and beauty studio with price list tabs in Naira, therapist profiles, and direct WhatsApp bookings.',
    demoBrand: 'Glow Sanctuary Spa & Studio',
  },
  {
    id: 'spice',
    name: 'Spice',
    category: 'Food',
    businessType: 'Catering & restaurants',
    file: '/spice/index.html',
    createdAt: '2026-11-10',
    featureTags: ['5 Menu Tabs', 'Party Packages', 'WhatsApp Orders'],
    description: 'Gourmet catering and firewood jollof with 5 menu tabs, party packages in Naira, and order workflow.',
    demoBrand: 'Mama Put & Co Gourmet Catering',
  },
  {
    id: 'covenant',
    name: 'Covenant',
    category: 'Church',
    businessType: 'Churches & ministries',
    file: '/covenant/index.html',
    createdAt: '2026-11-10',
    featureTags: ['Event Cards', 'Bank Giving Block', 'Prayer WhatsApp'],
    description: 'Faith community template with service times, upcoming conferences, giving bank details, and prayer request button.',
    demoBrand: 'Covenant Grace Chapel',
  },
  {
    id: 'estate',
    name: 'Estate',
    category: 'Real Estate',
    businessType: 'Real estate agents & brokers',
    file: '/estate/index.html',
    createdAt: '2026-11-10',
    featureTags: ['Naira Listings', 'Title Guarantees', 'Virtual Inspections'],
    description: 'Luxury property advisory with featured listings in Naira, title verification guarantees, and 4-step buying process.',
    demoBrand: 'Lekki Prime Estates',
  },
  {
    id: 'launch',
    name: 'Launch',
    category: 'Tech Startup',
    businessType: 'SaaS & software products',
    file: '/launch/index.html',
    createdAt: '2026-11-10',
    featureTags: ['CSS App Mockup', 'Dark Mode', '3-Tier Pricing'],
    description: 'Futuristic dark-mode SaaS page with a pure CSS-drawn dashboard mockup, 3-tier pricing table, and waitlist.',
    demoBrand: 'Launchpad',
  },
  {
    id: 'folio',
    name: 'Folio',
    category: 'Portfolio',
    businessType: 'Designers & creatives',
    file: '/folio/index.html',
    createdAt: '2026-11-10',
    featureTags: ['Work Showcase', 'Skills Matrix', 'Career Timeline'],
    description: 'Personal brand & product designer portfolio with case study cards, skills matrix, and career timeline.',
    demoBrand: 'Damilola Vance',
  },
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'Fitness',
    businessType: 'Gyms & fitness trainers',
    file: '/pulse/index.html',
    createdAt: '2026-11-10',
    featureTags: ['Timetable Table', 'Membership Tiers', 'Free Trial CTA'],
    description: 'High-voltage athletic gym with weekly class schedule table, membership passes in Naira, and free trial CTA.',
    demoBrand: 'Pulse Fitness Lekki',
  },
  {
    id: 'graduate',
    name: 'Graduate',
    category: 'Portfolio',
    businessType: 'Graduates & developers',
    file: '/src/templates/graduate.ts',
    createdAt: '2026-11-11',
    featureTags: ['Projects with GitHub links', 'Printable CV layout', 'WhatsApp contact'],
    description: 'A clean personal portfolio for graduates, developers, and job seekers, with a projects showcase, experience timeline, education, and a printable one-page CV layout.',
    demoBrand: 'Chinedu Okafor',
  },
  {
    id: 'universityportal',
    name: 'Varsity',
    category: 'School & Education',
    businessType: 'Universities & colleges',
    file: '/src/templates/universityportal.ts',
    createdAt: '2026-11-12',
    featureTags: ['GPA and CGPA', 'Pickers, not filters', 'Statement of result'],
    description: 'A university website with a student results portal: pick a session and semester, see GPA, CGPA, carryovers, and academic standing, and print a statement of result.',
    demoBrand: 'Greenfield State University',
  },
];

export const TEMPLATE_COUNT = TEMPLATES_LIST.length;

export const TEMPLATE_BUILDERS: Record<string, (config?: Partial<TemplateConfig>) => string> = {
  graduate: buildGraduateHtml,
  universityportal: buildUniversityPortalHtml,
};

export { graduateDefaultConfig, universityportalDefaultConfig };
