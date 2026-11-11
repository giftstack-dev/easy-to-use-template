/**
 * Frontdoor HTML Templates - Graduate Portfolio Template
 * =======================================================
 * A clean, typography-led personal portfolio template designed for
 * graduates, software developers, and job seekers in Nigeria and worldwide.
 *
 * Key Highlights:
 * - Pure HTML5 + inline CSS + small vanilla script
 * - Google Fonts: Fraunces (Headings) and Inter (Body)
 * - Layered image fallback with monogram artwork
 * - CSS-only entrance animation (hero text never hides behind JS)
 * - Complete @media print rules for instant one-page CV generation
 * - Person Schema.org JSON-LD structured data
 */

import { TemplateConfig } from './types.ts';
import {
  escapeHtml,
  validateUrl,
  normalizePhone,
  normalizeWhatsApp,
  getInitials,
  getSharedScript,
} from './shared.ts';

/**
 * Default demo configuration for the Graduate template.
 */
export const graduateDefaultConfig: TemplateConfig = {
  id: 'graduate',
  name: 'Graduate',
  category: 'Portfolio',
  businessType: 'Graduates & developers',
  businessName: 'Chinedu Okafor',
  headline: 'Junior Software Developer',
  shortBio:
    'Software engineering graduate who builds reliable web apps and enjoys turning messy processes into simple tools.',
  location: 'Asaba, Delta State, Nigeria',
  school: 'Your University, Nigeria',
  degree: 'B.Sc. Computer Science',
  classOfDegree: 'Second Class Upper',
  availability: 'Open to graduate and junior roles',
  phone: '07060725593',
  whatsapp: '2347060725593',
  email: 'hello@example.com',
  github: 'https://github.com/yourname',
  linkedin: 'https://www.linkedin.com/in/yourname',
  cvUrl: '',

  primaryColor: '#101828',
  accentColor: '#0F766E',
  accentSoftColor: '#E6F4F1',
  backgroundColor: '#FBFAF7',
  surfaceColor: '#FFFFFF',
  borderColor: '#E6E2D9',
  textColor: '#101828',
  textSecondaryColor: '#4B5563',

  skillGroups: [
    {
      title: 'Languages',
      items: ['Python', 'Java', 'JavaScript'],
    },
    {
      title: 'Web',
      items: ['HTML', 'CSS', 'React'],
    },
    {
      title: 'Tools',
      items: ['Git & GitHub', 'SQL', 'Linux'],
    },
  ],

  projects: [
    {
      title: 'Student Result Portal',
      description:
        'Secure web portal for managing undergraduate semester grades, GP calculations, and department transcripts.',
      tags: ['Python', 'Flask', 'PostgreSQL'],
      repoUrl: 'https://github.com/yourname/student-result-portal',
      liveUrl: 'https://student-result-demo.example.com',
      imageUrl: 'https://picsum.photos/seed/grad-p1/800/500',
    },
    {
      title: 'Market Price Tracker',
      description:
        'Real-time tracker monitoring essential commodity and foodstuffs prices across major Nigerian local markets.',
      tags: ['JavaScript', 'React', 'REST API'],
      repoUrl: 'https://github.com/yourname/market-price-tracker',
      liveUrl: 'https://market-tracker-demo.example.com',
      imageUrl: 'https://picsum.photos/seed/grad-p2/800/500',
    },
    {
      title: 'Campus Marketplace',
      description:
        'Peer-to-peer peer marketplace for university students to trade textbooks, dorm electronics, and essentials.',
      tags: ['HTML', 'CSS', 'Firebase'],
      repoUrl: 'https://github.com/yourname/campus-marketplace',
      liveUrl: '',
      imageUrl: 'https://picsum.photos/seed/grad-p3/800/500',
    },
  ],

  experience: [
    {
      role: 'Software Engineering Intern',
      organization: 'Apex Digital Solutions, Lagos',
      period: 'Jun 2024 - Dec 2024',
      points: [
        'Built RESTful APIs supporting customer billing and transaction history queries.',
        'Wrote unit test suites and improved database query performance by 28%.',
      ],
    },
    {
      role: 'Freelance Web Developer',
      organization: 'Self-Employed',
      period: 'Jan 2024 - May 2024',
      points: [
        'Designed and deployed responsive portfolio and business websites for 4 local SMEs.',
        'Maintained 100% on-time client delivery with cross-browser compatibility.',
      ],
    },
  ],

  education: [
    {
      degree: 'B.Sc. Computer Science',
      school: 'Your University, Nigeria',
      period: '2020 - 2024',
      note: 'Graduated with Second Class Upper Division (CGPA 4.2/5.0). Final Year Project: Automated Student Result Processing System.',
    },
  ],

  certifications: [
    'Certified Cloud Practitioner (In Progress)',
    'Foundations of Software Engineering - ALX / Holberton',
  ],

  seoTitle: 'Chinedu Okafor | Junior Software Developer & Computer Science Graduate',
  seoDescription:
    'Software engineering graduate who builds reliable web apps. Open to graduate, junior developer, and tech roles in Nigeria and remote.',
};

/**
 * Builds the complete, self-contained HTML string for the Graduate template.
 */
export function buildGraduateHtml(userConfig: Partial<TemplateConfig> = {}): string {
  const config: TemplateConfig = { ...graduateDefaultConfig, ...userConfig };

  const name = config.businessName || 'Chinedu Okafor';
  const headline = config.headline || 'Junior Software Developer';
  const shortBio =
    config.shortBio ||
    'Software engineering graduate who builds reliable web apps and enjoys turning messy processes into simple tools.';
  const location = config.location || 'Asaba, Delta State, Nigeria';
  const degree = config.degree || 'B.Sc. Computer Science';
  const school = config.school || 'Your University, Nigeria';
  const classOfDegree = config.classOfDegree || 'Second Class Upper';
  const availability = config.availability || 'Open to graduate and junior roles';

  const rawPhone = config.phone || '07060725593';
  const phoneDigits = normalizePhone(rawPhone);
  const waNumber = normalizeWhatsApp(config.whatsapp || rawPhone);
  const email = config.email || 'hello@example.com';
  const github = validateUrl(config.github || 'https://github.com/yourname');
  const linkedin = validateUrl(config.linkedin || 'https://www.linkedin.com/in/yourname');
  const cvUrl = validateUrl(config.cvUrl || '');

  const skillGroups = config.skillGroups || graduateDefaultConfig.skillGroups || [];
  const projects = config.projects || graduateDefaultConfig.projects || [];
  const experience = config.experience || graduateDefaultConfig.experience || [];
  const education = config.education || graduateDefaultConfig.education || [];
  const certifications = config.certifications || graduateDefaultConfig.certifications || [];

  const initials = getInitials(name);
  const heroPhoto = 'https://picsum.photos/seed/chinedu-portrait/800/1000';

  // Social SameAs links for Schema.org JSON-LD
  const sameAsList: string[] = [];
  if (github) sameAsList.push(github);
  if (linkedin) sameAsList.push(linkedin);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    jobTitle: headline,
    email: `mailto:${email}`,
    telephone: phoneDigits ? `tel:${phoneDigits}` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: location,
    },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: school,
    },
    sameAs: sameAsList.length > 0 ? sameAsList : undefined,
  };

  // CV button target: if cvUrl exists, open cvUrl; otherwise pre-fill WhatsApp message
  const cvButtonHref = cvUrl
    ? cvUrl
    : `https://wa.me/${waNumber}?text=${encodeURIComponent(
        `Hello ${name}, I reviewed your portfolio and would like to request a copy of your CV.`
      )}`;
  const cvButtonText = cvUrl ? 'Download CV' : 'Request my CV';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.seoTitle || `${name} | ${headline}`)}</title>
  <meta name="description" content="${escapeHtml(
    config.seoDescription || `${name} - ${headline} based in ${location}. View projects and CV.`
  )}">
  <meta property="og:title" content="${escapeHtml(config.seoTitle || `${name} | ${headline}`)}">
  <meta property="og:description" content="${escapeHtml(
    config.seoDescription || shortBio
  )}">
  <meta property="og:type" content="profile">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>">

  <!-- Google Fonts: Fraunces (Headings) & Inter (Body) with robust fallbacks -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
  </script>

  <style>
    /* ==========================================================================
       EDIT YOUR BRAND HERE (CSS Custom Properties)
       ========================================================================== */
    :root {
      --primary: ${config.primaryColor || '#101828'};
      --accent: ${config.accentColor || '#0F766E'};
      --accent-soft: ${config.accentSoftColor || '#E6F4F1'};
      --bg: ${config.backgroundColor || '#FBFAF7'};
      --surface: ${config.surfaceColor || '#FFFFFF'};
      --border: ${config.borderColor || '#E6E2D9'};
      --text: ${config.textColor || '#101828'};
      --text-secondary: ${config.textSecondaryColor || '#4B5563'};

      --font-heading: 'Fraunces', Georgia, 'Times New Roman', serif;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      --nav-height: 72px;
      --container-max: 1120px;
    }

    /* ==========================================================================
       CSS RESET & BASE STYLES
       ========================================================================== */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    html {
      scroll-behavior: smooth;
      scroll-padding-top: calc(var(--nav-height) + 20px);
      color-scheme: light;
    }

    body {
      font-family: var(--font-body);
      font-size: 1rem;
      line-height: 1.6;
      color: var(--text);
      background-color: var(--bg);
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    a {
      color: inherit;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    button, input, textarea {
      font: inherit;
    }

    .container {
      width: 100%;
      max-width: var(--container-max);
      margin-left: auto;
      margin-right: auto;
      padding-left: 24px;
      padding-right: 24px;
    }

    /* Headings */
    h1, h2, h3, h4 {
      font-family: var(--font-heading);
      color: var(--primary);
      font-weight: 700;
      line-height: 1.25;
      letter-spacing: -0.015em;
    }

    /* ==========================================================================
       BUTTONS & CHIPS
       ========================================================================== */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      font-weight: 600;
      font-size: 0.9375rem;
      border-radius: 8px;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }

    .btn:hover {
      transform: translateY(-2px);
    }

    .btn:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 3px;
    }

    .btn-primary {
      background-color: var(--accent);
      color: #FFFFFF;
      border-color: var(--accent);
    }
    .btn-primary:hover {
      background-color: #0d645d;
      box-shadow: 0 4px 14px rgba(15, 118, 110, 0.25);
    }

    .btn-outline {
      background-color: transparent;
      color: var(--primary);
      border-color: var(--border);
    }
    .btn-outline:hover {
      background-color: var(--surface);
      border-color: var(--accent);
      color: var(--accent);
    }

    .btn-sm {
      padding: 8px 16px;
      font-size: 0.8125rem;
    }

    /* Section Header */
    .section-header {
      margin-bottom: 48px;
    }
    .section-tag {
      display: inline-block;
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
      color: var(--accent);
      margin-bottom: 8px;
    }
    .section-title {
      font-size: clamp(1.875rem, 3.5vw, 2.5rem);
      margin-bottom: 12px;
    }
    .section-desc {
      color: var(--text-secondary);
      max-width: 620px;
      font-size: 1.0625rem;
    }

    /* ==========================================================================
       FIXED TOP NAVIGATION BAR
       ========================================================================== */
    .top-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: var(--nav-height);
      background-color: rgba(251, 250, 247, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border);
      z-index: 1000;
      display: flex;
      align-items: center;
    }

    .nav-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }

    .brand-logo {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .brand-dot {
      color: var(--accent);
    }

    .nav-menu {
      display: flex;
      align-items: center;
      list-style: none;
      gap: 32px;
    }

    .nav-link {
      font-size: 0.9375rem;
      font-weight: 500;
      color: var(--text-secondary);
      position: relative;
      padding: 6px 0;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--accent);
    }
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--accent);
      border-radius: 2px;
    }

    .nav-cta {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    /* Mobile hamburger toggle using checkbox */
    .nav-toggle {
      display: none;
    }
    .nav-toggle-label {
      display: none;
      flex-direction: column;
      gap: 5px;
      cursor: pointer;
      padding: 8px;
    }
    .nav-toggle-label span {
      display: block;
      width: 24px;
      height: 2px;
      background-color: var(--primary);
      border-radius: 2px;
      transition: all 0.25s ease;
    }

    /* ==========================================================================
       HERO SECTION (CSS-Only Entrance - Content Always Visible)
       ========================================================================== */
    .hero-section {
      padding-top: calc(var(--nav-height) + 56px);
      padding-bottom: 64px;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      gap: 60px;
      align-items: center;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 30px;
      background-color: var(--accent-soft);
      color: var(--accent);
      font-size: 0.8125rem;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--accent);
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.2);
    }

    .hero-name {
      font-size: clamp(2.5rem, 5vw, 4rem);
      margin-bottom: 12px;
      color: var(--primary);
      line-height: 1.1;
    }

    .hero-headline {
      font-size: clamp(1.25rem, 2.2vw, 1.625rem);
      color: var(--accent);
      font-family: var(--font-body);
      font-weight: 600;
      margin-bottom: 20px;
    }

    .hero-bio {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin-bottom: 32px;
      max-width: 540px;
      line-height: 1.7;
    }

    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 32px;
    }

    .hero-socials {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .social-link {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      border: 1px solid var(--border);
      background-color: var(--surface);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: all 0.2s ease;
    }
    .social-link:hover {
      border-color: var(--accent);
      color: var(--accent);
      transform: translateY(-2px);
    }
    .social-link svg {
      width: 20px;
      height: 20px;
    }

    /* Portrait & Layered Monogram Frame */
    .portrait-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
    }

    .portrait-glow {
      position: absolute;
      inset: -15px;
      background: radial-gradient(circle at center, rgba(15, 118, 110, 0.25) 0%, rgba(230, 244, 241, 0) 70%);
      filter: blur(24px);
      z-index: 0;
      animation: pulseGlow 6s ease-in-out infinite alternate;
    }

    @keyframes pulseGlow {
      0% { transform: scale(0.95); opacity: 0.6; }
      100% { transform: scale(1.05); opacity: 1; }
    }

    .portrait-frame {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 360px;
      aspect-ratio: 4 / 5;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: 0 20px 40px rgba(16, 24, 40, 0.08);
      background-color: var(--surface);
    }

    .layered-photo-box {
      width: 100%;
      height: 100%;
      position: relative;
      background: linear-gradient(135deg, #101828 0%, #0F766E 100%);
    }

    .layered-art {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      position: absolute;
      inset: 0;
    }
    .layered-art text {
      fill: #E6F4F1;
    }

    .layered-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.4s ease;
    }
    .layered-img.loaded {
      opacity: 1;
    }

    /* ==========================================================================
       QUICK FACTS BAR
       ========================================================================== */
    .facts-bar {
      margin-top: 40px;
      margin-bottom: 72px;
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px 32px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
      box-shadow: 0 4px 16px rgba(16, 24, 40, 0.03);
    }

    .fact-item {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .fact-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background-color: var(--accent-soft);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .fact-icon svg {
      width: 22px;
      height: 22px;
    }
    .fact-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .fact-value {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--primary);
    }

    /* ==========================================================================
       ABOUT SECTION
       ========================================================================== */
    .about-section {
      padding: 72px 0;
      border-top: 1px solid var(--border);
    }

    .about-card {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 48px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }
    .about-text p {
      margin-bottom: 16px;
      color: var(--text-secondary);
      line-height: 1.8;
      font-size: 1.0625rem;
    }
    .about-text p:last-child {
      margin-bottom: 0;
    }

    .about-quote {
      border-left: 3px solid var(--accent);
      padding-left: 24px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .about-quote blockquote {
      font-family: var(--font-heading);
      font-size: 1.375rem;
      color: var(--primary);
      font-weight: 600;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    .about-quote cite {
      font-style: normal;
      font-size: 0.875rem;
      color: var(--accent);
      font-weight: 600;
    }

    /* ==========================================================================
       SKILLS SECTION (Grouped Chips - No Percentage Bars)
       ========================================================================== */
    .skills-section {
      padding: 72px 0;
      border-top: 1px solid var(--border);
    }

    .skills-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .skill-card {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: transform 0.2s ease, border-color 0.2s ease;
    }
    .skill-card:hover {
      transform: translateY(-3px);
      border-color: var(--accent);
    }
    .skill-card-title {
      font-size: 1.25rem;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .skill-badge {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--accent);
    }

    .chip-container {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .skill-chip {
      display: inline-block;
      padding: 8px 16px;
      background-color: var(--bg);
      border: 1px solid var(--border);
      border-radius: 30px;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text);
      transition: all 0.2s ease;
    }
    .skill-chip:hover {
      background-color: var(--accent-soft);
      border-color: var(--accent);
      color: var(--accent);
    }

    /* ==========================================================================
       PROJECTS SECTION (16:10 Screenshot Slot + Code/Live Buttons)
       ========================================================================== */
    .projects-section {
      padding: 72px 0;
      border-top: 1px solid var(--border);
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;
    }

    .project-card {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
    }
    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 32px rgba(16, 24, 40, 0.08);
      border-color: var(--accent);
    }

    .project-thumb {
      aspect-ratio: 16 / 10;
      position: relative;
      background: linear-gradient(135deg, #101828 0%, #0F766E 100%);
      overflow: hidden;
    }
    .project-art {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: #E6F4F1;
      padding: 16px;
      text-align: center;
    }
    .project-art svg {
      width: 40px;
      height: 40px;
      margin-bottom: 8px;
      opacity: 0.85;
    }
    .project-art span {
      font-size: 0.8125rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 600;
    }

    .project-thumb img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .project-thumb img.loaded {
      opacity: 1;
    }

    .project-body {
      padding: 24px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: space-between;
    }

    .project-title {
      font-size: 1.25rem;
      margin-bottom: 10px;
    }
    .project-desc {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 18px;
    }

    .project-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 24px;
    }
    .project-tag {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      background-color: var(--accent-soft);
      color: var(--accent);
    }

    .project-actions {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
    }

    /* ==========================================================================
       EXPERIENCE & EDUCATION TIMELINE
       ========================================================================== */
    .experience-section {
      padding: 72px 0;
      border-top: 1px solid var(--border);
    }

    .experience-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 48px;
    }

    .timeline-wrapper {
      position: relative;
      padding-left: 32px;
    }
    .timeline-wrapper::before {
      content: '';
      position: absolute;
      left: 7px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background-color: var(--border);
    }

    .timeline-item {
      position: relative;
      margin-bottom: 40px;
    }
    .timeline-item:last-child {
      margin-bottom: 0;
    }

    .timeline-dot {
      position: absolute;
      left: -32px;
      top: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background-color: var(--surface);
      border: 3px solid var(--accent);
    }

    .timeline-header {
      margin-bottom: 8px;
    }
    .timeline-role {
      font-size: 1.1875rem;
      font-weight: 700;
      color: var(--primary);
    }
    .timeline-org {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--accent);
    }
    .timeline-period {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-top: 2px;
    }

    .timeline-bullets {
      list-style: none;
      margin-top: 10px;
    }
    .timeline-bullets li {
      font-size: 0.9375rem;
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 6px;
      position: relative;
      padding-left: 18px;
    }
    .timeline-bullets li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--accent);
      font-weight: bold;
    }

    /* Education & Certs Side Column */
    .edu-card {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      margin-bottom: 24px;
    }
    .edu-degree {
      font-size: 1.1875rem;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 4px;
    }
    .edu-school {
      font-size: 0.9375rem;
      color: var(--accent);
      font-weight: 600;
      margin-bottom: 4px;
    }
    .edu-period {
      font-size: 0.8125rem;
      color: var(--text-secondary);
      margin-bottom: 12px;
    }
    .edu-note {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }

    .certs-list {
      list-style: none;
      margin-top: 12px;
    }
    .certs-list li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.875rem;
      color: var(--text);
      margin-bottom: 8px;
    }
    .certs-list li svg {
      width: 16px;
      height: 16px;
      color: var(--accent);
      flex-shrink: 0;
    }

    /* ==========================================================================
       CONTACT SECTION (Cards + Pre-filled WhatsApp Form)
       ========================================================================== */
    .contact-section {
      padding: 72px 0 96px;
      border-top: 1px solid var(--border);
    }

    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
    }

    .contact-channels {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .channel-card {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .channel-card:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 24, 40, 0.05);
    }
    .channel-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background-color: var(--accent-soft);
      color: var(--accent);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .channel-icon svg {
      width: 20px;
      height: 20px;
    }
    .channel-title {
      font-size: 0.8125rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .channel-val {
      font-size: 0.9375rem;
      font-weight: 600;
      color: var(--primary);
      word-break: break-all;
    }

    .contact-form-card {
      background-color: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
    }
    .form-title {
      font-size: 1.25rem;
      margin-bottom: 6px;
    }
    .form-desc {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 18px;
    }
    .form-group label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--text);
      margin-bottom: 6px;
    }
    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border);
      border-radius: 8px;
      background-color: var(--bg);
      color: var(--text);
      font-size: 0.9375rem;
      transition: border-color 0.2s ease, background-color 0.2s ease;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--accent);
      background-color: #FFFFFF;
      box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
    }
    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    /* ==========================================================================
       FOOTER & FLOATING WHATSAPP BUTTON
       ========================================================================== */
    .site-footer {
      background-color: var(--surface);
      border-top: 1px solid var(--border);
      padding: 32px 0;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .footer-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .back-to-top {
      font-weight: 600;
      color: var(--accent);
    }
    .back-to-top:hover {
      text-decoration: underline;
    }

    .floating-whatsapp {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #25D366;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 24px rgba(37, 211, 102, 0.4);
      z-index: 999;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      animation: gentlePulse 3s infinite;
    }
    .floating-whatsapp:hover {
      transform: scale(1.08);
      box-shadow: 0 14px 30px rgba(37, 211, 102, 0.5);
    }
    .floating-whatsapp svg {
      width: 32px;
      height: 32px;
      fill: currentColor;
    }

    @keyframes gentlePulse {
      0%, 100% { box-shadow: 0 10px 24px rgba(37, 211, 102, 0.4); }
      50% { box-shadow: 0 10px 30px rgba(37, 211, 102, 0.7); }
    }

    /* ==========================================================================
       MOTION & SCROLL REVEAL (Progressive Enhancement)
       ========================================================================== */
    /* Content is visible by default so no user is locked out */
    .reveal-on-scroll {
      opacity: 1;
      transform: none;
    }

    /* Only when js-ready is active do we arm entrance transitions */
    .js-ready .reveal-on-scroll {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .js-ready .reveal-on-scroll.revealed {
      opacity: 1;
      transform: translateY(0);
    }

    /* Hero elements have CSS-only entrance */
    .hero-entrance {
      animation: heroFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes heroFadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
      .js-ready .reveal-on-scroll {
        opacity: 1 !important;
        transform: none !important;
      }
    }

    /* ==========================================================================
       RESPONSIVE BREAKPOINTS (Mobile & Tablet)
       ========================================================================== */
    @media (max-width: 992px) {
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }
      .hero-bio {
        margin-left: auto;
        margin-right: auto;
      }
      .hero-actions, .hero-socials {
        justify-content: center;
      }
      .portrait-wrapper {
        order: -1;
      }
      .portrait-frame {
        max-width: 260px;
      }
      .facts-bar {
        grid-template-columns: repeat(2, 1fr);
      }
      .about-card {
        grid-template-columns: 1fr;
        gap: 32px;
        padding: 32px;
      }
      .skills-grid, .projects-grid {
        grid-template-columns: 1fr;
      }
      .experience-grid {
        grid-template-columns: 1fr;
      }
      .contact-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .nav-menu {
        display: none;
        position: absolute;
        top: var(--nav-height);
        left: 0;
        right: 0;
        background-color: var(--surface);
        flex-direction: column;
        align-items: flex-start;
        padding: 24px;
        border-bottom: 1px solid var(--border);
        box-shadow: 0 16px 32px rgba(16, 24, 40, 0.08);
        gap: 16px;
      }
      .nav-toggle:checked ~ nav .nav-menu {
        display: flex;
      }
      .nav-toggle-label {
        display: flex;
      }
      .nav-cta {
        display: none;
      }
      .facts-bar {
        grid-template-columns: 1fr;
        padding: 20px;
        gap: 16px;
      }
      .contact-channels {
        grid-template-columns: 1fr;
      }
    }

    /* ==========================================================================
       PRINT LAYOUT: ONE-PAGE RESUME / CV
       ========================================================================== */
    @media print {
      body {
        background-color: #FFFFFF !important;
        color: #000000 !important;
        font-size: 10pt;
        line-height: 1.4;
      }

      /* Hide interactive navigation, buttons, forms, floating CTA */
      .top-nav,
      .floating-whatsapp,
      .hero-actions,
      .hero-socials,
      .project-actions,
      .contact-form-card,
      .site-footer,
      .portrait-glow,
      .facts-bar,
      .about-section {
        display: none !important;
      }

      .container {
        max-width: 100% !important;
        padding: 0 !important;
      }

      .hero-section {
        padding-top: 0 !important;
        padding-bottom: 16px !important;
      }

      .hero-grid {
        display: block !important;
      }

      .portrait-wrapper {
        display: none !important;
      }

      .hero-name {
        font-size: 20pt !important;
        color: #000000 !important;
        margin-bottom: 2pt;
      }

      .hero-headline {
        font-size: 12pt !important;
        color: #333333 !important;
        margin-bottom: 6pt;
      }

      .hero-bio {
        font-size: 10pt !important;
        color: #444444 !important;
        margin-bottom: 10pt;
      }

      /* Printable Contact Line */
      .print-contact-line {
        display: block !important;
        font-size: 9pt;
        color: #333333;
        margin-bottom: 16pt;
        border-bottom: 1pt solid #CCCCCC;
        padding-bottom: 6pt;
      }

      .section-header {
        margin-bottom: 12pt !important;
      }
      .section-title {
        font-size: 14pt !important;
        border-bottom: 1pt solid #000000;
        padding-bottom: 2pt;
        margin-bottom: 8pt;
      }
      .section-tag, .section-desc {
        display: none !important;
      }

      .skills-section, .projects-section, .experience-section {
        padding: 12pt 0 !important;
        border: none !important;
      }

      .skills-grid {
        grid-template-columns: repeat(3, 1fr) !important;
        gap: 12pt !important;
      }
      .skill-card {
        border: none !important;
        padding: 0 !important;
        background: transparent !important;
      }
      .skill-chip {
        border: 1pt solid #CCCCCC !important;
        padding: 2pt 6pt !important;
        font-size: 8.5pt !important;
      }

      .projects-grid {
        grid-template-columns: 1fr !important;
        gap: 10pt !important;
      }
      .project-card {
        border: none !important;
        box-shadow: none !important;
        break-inside: avoid;
        page-break-inside: avoid;
      }
      .project-thumb {
        display: none !important;
      }
      .project-body {
        padding: 0 !important;
      }
      .project-title {
        font-size: 11pt !important;
      }

      .experience-grid {
        display: block !important;
      }
      .timeline-wrapper::before {
        display: none !important;
      }
      .timeline-item {
        break-inside: avoid;
        page-break-inside: avoid;
        margin-bottom: 12pt !important;
        padding-left: 0 !important;
      }
      .timeline-dot {
        display: none !important;
      }
      .edu-card {
        border: none !important;
        padding: 0 !important;
        margin-top: 12pt !important;
        break-inside: avoid;
        page-break-inside: avoid;
      }

      .contact-section {
        display: none !important;
      }
    }
  </style>
</head>
<body id="top">

  <!-- =======================================================================
       1. FIXED TOP NAVIGATION BAR
       ======================================================================= -->
  <header class="top-nav">
    <div class="container nav-wrapper">
      <a href="#top" class="brand-logo" aria-label="${escapeHtml(name)} Portfolio">
        ${escapeHtml(name)}<span class="brand-dot">.</span>
      </a>

      <!-- Hidden Checkbox for Mobile Hamburger Toggle -->
      <input type="checkbox" id="nav-toggle" class="nav-toggle" aria-label="Toggle navigation menu">
      <label for="nav-toggle" class="nav-toggle-label">
        <span></span>
        <span></span>
        <span></span>
      </label>

      <!-- Navigation Links -->
      <nav aria-label="Main Navigation">
        <ul class="nav-menu">
          <li><a href="#about" class="nav-link">About</a></li>
          <li><a href="#skills" class="nav-link">Skills</a></li>
          <li><a href="#projects" class="nav-link">Projects</a></li>
          <li><a href="#experience" class="nav-link">Experience</a></li>
          <li><a href="#contact" class="nav-link">Contact</a></li>
        </ul>
      </nav>

      <!-- Header Action Button -->
      <div class="nav-cta">
        <a href="${escapeHtml(cvButtonHref)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
          ${escapeHtml(cvButtonText)}
        </a>
      </div>
    </div>
  </header>

  <main>
    <!-- =====================================================================
         2. HERO SECTION
         ===================================================================== -->
    <section class="hero-section" aria-labelledby="hero-name">
      <div class="container">
        <div class="hero-grid">
          <div class="hero-content hero-entrance">
            <div class="hero-badge">
              <span class="status-dot"></span>
              <span>${escapeHtml(availability)}</span>
            </div>

            <h1 id="hero-name" class="hero-name">${escapeHtml(name)}</h1>
            <div class="hero-headline">${escapeHtml(headline)}</div>
            <p class="hero-bio">${escapeHtml(shortBio)}</p>

            <div class="hero-actions">
              <a href="#projects" class="btn btn-primary">View projects</a>
              <a href="${escapeHtml(cvButtonHref)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">
                ${escapeHtml(cvButtonText)}
              </a>
            </div>

            <!-- Social Links -->
            <div class="hero-socials">
              ${
                github
                  ? `<a href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </a>`
                  : ''
              }
              ${
                linkedin
                  ? `<a href="${escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn Profile">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>`
                  : ''
              }
              <a href="mailto:${escapeHtml(email)}" class="social-link" aria-label="Send Email">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>

            <!-- Print Only Contact Line (Hidden on Screen) -->
            <div class="print-contact-line" style="display: none;">
              📍 ${escapeHtml(location)} &nbsp;|&nbsp; 
              ✉️ ${escapeHtml(email)} &nbsp;|&nbsp; 
              📞 ${escapeHtml(rawPhone)} &nbsp;|&nbsp; 
              ${github ? `GitHub: ${escapeHtml(github)} &nbsp;|&nbsp; ` : ''}
              ${linkedin ? `LinkedIn: ${escapeHtml(linkedin)}` : ''}
            </div>
          </div>

          <!-- Hero Portrait Frame with Layered Art System -->
          <div class="portrait-wrapper hero-entrance">
            <div class="portrait-glow"></div>
            <div class="portrait-frame">
              <div class="layered-photo-box">
                <!-- Layer 1: Art & Monogram fallback (always visible) -->
                <div class="layered-art" aria-hidden="true">
                  <svg viewBox="0 0 200 200" width="140" height="140" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="90" fill="rgba(15, 118, 110, 0.4)" stroke="rgba(230, 244, 241, 0.4)" stroke-width="2" />
                    <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle" font-family="'Fraunces', Georgia, serif" font-weight="700" font-size="56" letter-spacing="2">
                      ${escapeHtml(initials)}
                    </text>
                  </svg>
                  <span style="font-size: 0.8125rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; margin-top: 12px; color: #E6F4F1;">
                    ${escapeHtml(name)}
                  </span>
                </div>
                <!-- Layer 2: Real portrait photo -->
                <img src="${heroPhoto}" data-photo="${heroPhoto}" alt="${escapeHtml(name)} portrait" class="layered-img" onload="this.classList.add('loaded')" onerror="this.style.display='none'">
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Facts Bar -->
        <div class="facts-bar reveal-on-scroll">
          <div class="fact-item">
            <div class="fact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div class="fact-label">Location</div>
              <div class="fact-value">${escapeHtml(location)}</div>
            </div>
          </div>

          <div class="fact-item">
            <div class="fact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div>
              <div class="fact-label">Degree</div>
              <div class="fact-value">${escapeHtml(degree)}</div>
            </div>
          </div>

          <div class="fact-item">
            <div class="fact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            </div>
            <div>
              <div class="fact-label">Class of Degree</div>
              <div class="fact-value">${escapeHtml(classOfDegree)}</div>
            </div>
          </div>

          <div class="fact-item">
            <div class="fact-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
            </div>
            <div>
              <div class="fact-label">Availability</div>
              <div class="fact-value">${escapeHtml(availability)}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         3. ABOUT SECTION
         ===================================================================== -->
    <section id="about" class="about-section reveal-on-scroll" aria-labelledby="about-title">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">About Me</span>
          <h2 id="about-title" class="section-title">Background & Philosophy</h2>
          <p class="section-desc">Practical engineering discipline grounded in solid computer science fundamentals.</p>
        </div>

        <div class="about-card">
          <div class="about-text">
            <p>
              I recently graduated with a ${escapeHtml(degree)} from ${escapeHtml(school)}, finishing with ${escapeHtml(classOfDegree)}. During my studies, I focused on building practical, test-driven web applications that solve tangible problems for users across Nigeria and emerging markets.
            </p>
            <p>
              I believe great software is defined by clarity, maintainability, and empathy for the end user. Whether writing resilient backend services, designing accessible user interfaces, or profiling database queries, I enjoy turning messy workflows into elegant, intuitive tools.
            </p>
          </div>

          <div class="about-quote">
            <blockquote>
              "Simple tools built with care compound in value every single day."
            </blockquote>
            <cite>— ${escapeHtml(name)}, ${escapeHtml(headline)}</cite>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         4. SKILLS SECTION (Grouped Chips)
         ===================================================================== -->
    <section id="skills" class="skills-section reveal-on-scroll" aria-labelledby="skills-title">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Technical Proficiency</span>
          <h2 id="skills-title" class="section-title">Skills & Core Technologies</h2>
          <p class="section-desc">Categorized by domain without arbitrary percentage ratings.</p>
        </div>

        <div class="skills-grid">
          ${skillGroups
            .map(
              (group) => `
            <div class="skill-card">
              <h3 class="skill-card-title">
                <span class="skill-badge"></span>
                ${escapeHtml(group.title)}
              </h3>
              <div class="chip-container">
                ${group.items
                  .map((item) => `<span class="skill-chip">${escapeHtml(item)}</span>`)
                  .join('')}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    </section>

    <!-- =====================================================================
         5. PROJECTS SECTION (16:10 Screenshot Slot + Code / Live Links)
         ===================================================================== -->
    <section id="projects" class="projects-section reveal-on-scroll" aria-labelledby="projects-title">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Featured Work</span>
          <h2 id="projects-title" class="section-title">Selected Projects</h2>
          <p class="section-desc">Production-ready applications demonstrating full-stack engineering, API design, and responsive interfaces.</p>
        </div>

        <div class="projects-grid">
          ${projects
            .map((proj, idx) => {
              const safeRepo = validateUrl(proj.repoUrl);
              const safeLive = validateUrl(proj.liveUrl);
              const seedId = `grad-p${idx + 1}`;
              const fallbackPhoto = `https://picsum.photos/seed/${seedId}/800/500`;
              const photoUrl = proj.imageUrl ? validateUrl(proj.imageUrl) || fallbackPhoto : fallbackPhoto;

              return `
            <article class="project-card">
              <div class="project-thumb">
                <div class="project-art">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  <span>${escapeHtml(proj.title)}</span>
                </div>
                <img src="${escapeHtml(photoUrl)}" data-photo="${escapeHtml(photoUrl)}" alt="${escapeHtml(proj.title)} Preview" loading="lazy" onload="this.classList.add('loaded')" onerror="this.style.display='none'">
              </div>

              <div class="project-body">
                <div>
                  <h3 class="project-title">${escapeHtml(proj.title)}</h3>
                  <p class="project-desc">${escapeHtml(proj.description)}</p>
                  <div class="project-tags">
                    ${proj.tags
                      .map((t) => `<span class="project-tag">${escapeHtml(t)}</span>`)
                      .join('')}
                  </div>
                </div>

                <div class="project-actions">
                  ${
                    safeRepo
                      ? `<a href="${escapeHtml(safeRepo)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                          View code
                        </a>`
                      : ''
                  }
                  ${
                    safeLive
                      ? `<a href="${escapeHtml(safeLive)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-sm">
                          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                          Live site
                        </a>`
                      : ''
                  }
                </div>
              </div>
            </article>
          `;
            })
            .join('')}
        </div>
      </div>
    </section>

    <!-- =====================================================================
         6. EXPERIENCE & EDUCATION SECTION
         ===================================================================== -->
    <section id="experience" class="experience-section reveal-on-scroll" aria-labelledby="exp-title">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Career History</span>
          <h2 id="exp-title" class="section-title">Experience & Education</h2>
          <p class="section-desc">Hands-on internships, freelance achievements, and academic foundations.</p>
        </div>

        <div class="experience-grid">
          <!-- Left: Experience Timeline -->
          <div class="timeline-column">
            <h3 style="font-size: 1.375rem; margin-bottom: 24px;">Professional Work</h3>
            <div class="timeline-wrapper">
              ${experience
                .map(
                  (exp) => `
                <div class="timeline-item">
                  <div class="timeline-dot"></div>
                  <div class="timeline-header">
                    <div class="timeline-role">${escapeHtml(exp.role)}</div>
                    <div class="timeline-org">${escapeHtml(exp.organization)}</div>
                    <div class="timeline-period">${escapeHtml(exp.period)}</div>
                  </div>
                  <ul class="timeline-bullets">
                    ${exp.points
                      .map((p) => `<li>${escapeHtml(p)}</li>`)
                      .join('')}
                  </ul>
                </div>
              `
                )
                .join('')}
            </div>
          </div>

          <!-- Right: Education & Certifications -->
          <div class="edu-column">
            <h3 style="font-size: 1.375rem; margin-bottom: 24px;">Academic Degree</h3>
            ${education
              .map(
                (edu) => `
              <div class="edu-card">
                <div class="edu-degree">${escapeHtml(edu.degree)}</div>
                <div class="edu-school">${escapeHtml(edu.school)}</div>
                <div class="edu-period">${escapeHtml(edu.period)}</div>
                ${edu.note ? `<p class="edu-note">${escapeHtml(edu.note)}</p>` : ''}
              </div>
            `
              )
              .join('')}

            ${
              certifications.length > 0
                ? `
              <div class="edu-card">
                <h4 style="font-size: 1.0625rem; margin-bottom: 12px; color: var(--primary);">Certifications</h4>
                <ul class="certs-list">
                  ${certifications
                    .map(
                      (cert) => `
                    <li>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <span>${escapeHtml(cert)}</span>
                    </li>
                  `
                    )
                    .join('')}
                </ul>
              </div>
            `
                : ''
            }
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================================
         7. CONTACT SECTION (Large Cards + Pre-filled WhatsApp Form)
         ===================================================================== -->
    <section id="contact" class="contact-section reveal-on-scroll" aria-labelledby="contact-title">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">Let's Connect</span>
          <h2 id="contact-title" class="section-title">Get in Touch</h2>
          <p class="section-desc">Open for software engineering positions, junior developer mandates, and technical freelance projects.</p>
        </div>

        <div class="contact-grid">
          <!-- Left: 4 Direct Contact Cards -->
          <div class="contact-channels">
            <!-- Email Card -->
            <a href="mailto:${escapeHtml(email)}" class="channel-card">
              <div class="channel-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div class="channel-title">Email Direct</div>
              <div class="channel-val">${escapeHtml(email)}</div>
            </a>

            <!-- WhatsApp Card -->
            <a href="https://wa.me/${escapeHtml(waNumber)}?text=${encodeURIComponent(
              `Hello ${name}, I saw your portfolio and would like to connect!`
            )}" target="_blank" rel="noopener noreferrer" class="channel-card">
              <div class="channel-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              </div>
              <div class="channel-title">WhatsApp Chat</div>
              <div class="channel-val">${escapeHtml(rawPhone)}</div>
            </a>

            <!-- LinkedIn Card -->
            ${
              linkedin
                ? `<a href="${escapeHtml(linkedin)}" target="_blank" rel="noopener noreferrer" class="channel-card">
                    <div class="channel-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                    </div>
                    <div class="channel-title">LinkedIn</div>
                    <div class="channel-val">Connect on LinkedIn</div>
                  </a>`
                : ''
            }

            <!-- GitHub Card -->
            ${
              github
                ? `<a href="${escapeHtml(github)}" target="_blank" rel="noopener noreferrer" class="channel-card">
                    <div class="channel-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    </div>
                    <div class="channel-title">GitHub</div>
                    <div class="channel-val">github.com/yourname</div>
                  </a>`
                : ''
            }
          </div>

          <!-- Right: Pre-filled WhatsApp Message Form -->
          <div class="contact-form-card">
            <h3 class="form-title">Send a Quick Message</h3>
            <p class="form-desc">Fills and launches a direct WhatsApp conversation immediately.</p>

            <form id="quick-wa-form" data-wa-num="${escapeHtml(waNumber)}">
              <div class="form-group">
                <label for="wa-sender-name">Your Full Name</label>
                <input type="text" id="wa-sender-name" class="form-control" placeholder="e.g. Tunde Adebayo" required>
              </div>

              <div class="form-group">
                <label for="wa-sender-msg">Your Message / Role Details</label>
                <textarea id="wa-sender-msg" class="form-control" rows="3" placeholder="Hi Chinedu, we have an opening for a junior web developer..." required></textarea>
              </div>

              <button type="submit" class="btn btn-primary" style="width: 100%;">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                Send Message via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- =======================================================================
       8. FOOTER
       ======================================================================= -->
  <footer class="site-footer">
    <div class="container footer-wrapper">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(name)}. All rights reserved. Built with Frontdoor HTML Templates.</p>
      <a href="#top" class="back-to-top">Back to top ↑</a>
    </div>
  </footer>

  <!-- =======================================================================
       9. FLOATING WHATSAPP BUTTON (Fixed Bottom-Right)
       ======================================================================= -->
  <a href="https://wa.me/${escapeHtml(waNumber)}?text=${encodeURIComponent(
    `Hello ${name}, I am reaching out from your online portfolio.`
  )}" target="_blank" rel="noopener noreferrer" class="floating-whatsapp" aria-label="Chat with ${escapeHtml(
    name
  )} on WhatsApp">
    <svg viewBox="0 0 24 24">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.67 12.05 3.67Z"/>
    </svg>
  </a>

  <!-- =======================================================================
       10. CLIENT SCRIPT (Vanilla Progressive Enhancement)
       ======================================================================= -->
  <script>
${getSharedScript()}
  </script>
</body>
</html>`;
}
