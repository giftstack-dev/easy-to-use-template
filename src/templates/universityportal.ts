/**
 * Frontdoor HTML Templates - Varsity (University Portal) Template
 * ===============================================================
 * Generates a single self-contained HTML5 + CSS3 + vanilla JS file
 * containing the university website and the encrypted student results portal.
 */

import { TemplateConfig } from './types.ts';
import {
  escapeHtml,
  getBrandColorTokens,
  getInitials,
  normalizePhone,
  normalizeWhatsApp,
  validateImageUrl,
  validateUrl,
} from './shared.ts';
import {
  DEMO_CREDENTIALS,
  PRESET_5_POINT,
} from './universityportalEngine.ts';
import { DEMO_UNIVERSITY_PORTAL_DATA } from './universityportalDemoData.ts';

export const universityportalDefaultConfig: TemplateConfig = {
  id: 'universityportal',
  name: 'Varsity',
  category: 'School & Education',
  businessType: 'Universities & colleges',
  businessName: 'Greenfield State University',
  motto: 'Knowledge for Service',
  established: '2014',
  headline: 'Academic excellence with a calm, reliable student results portal.',
  shortBio:
    'Greenfield State University prepares graduates for leadership across technology, economics, and the humanities through rigorous scholarship and practical research.',
  aboutText:
    'Established in Asaba, Delta State in 2014, Greenfield State University combines NUC-accredited undergraduate programmes with modern laboratories, dedicated faculty mentorship, and a zero-downtime student results portal built to remain responsive even on result-release day.',
  phone: '0800 000 0000',
  whatsapp: 'https://wa.me/2348000000000',
  email: 'ict@example.com',
  city: 'Asaba, Delta State, Nigeria',
  address: 'Km 8 Okpanam Express Road, Asaba, Delta State, Nigeria',
  openingHours: 'Mon – Fri: 8:00 AM – 4:00 PM',
  institutionWebsite: 'https://portal.greenfieldstate.example.edu.ng',
  logoUrl: '',

  primaryColor: '#1B3A6B',
  accentColor: '#D4A017',
  accentSoftColor: '#FEF7E0',
  backgroundColor: '#F6F8FC',
  surfaceColor: '#FFFFFF',
  borderColor: '#E2E8F0',
  textColor: '#0F172A',
  textSecondaryColor: '#475569',
  successColor: '#15803D',
  warningColor: '#B45309',
  dangerColor: '#B91C1C',

  helpdesk: {
    name: 'ICT Helpdesk',
    phone: '0800 000 0000',
    whatsapp: 'https://wa.me/2348000000000',
    email: 'ict@example.com',
    hours: 'Mon – Fri: 8:00 AM – 4:00 PM',
  },
  registry: {
    name: 'Academic Registry',
    phone: '0800 000 0000',
    whatsapp: 'https://wa.me/2348000000000',
    email: 'registry@example.com',
    hours: 'Mon – Fri: 8:00 AM – 4:00 PM',
  },
  bursary: {
    name: 'University Bursary',
    phone: '0800 000 0000',
    whatsapp: 'https://wa.me/2348000000000',
    email: 'bursary@example.com',
    hours: 'Mon – Fri: 8:30 AM – 3:30 PM',
  },

  faculties: [
    {
      name: 'Faculty of Science',
      departments: [
        {
          name: 'Department of Computer Science',
          programmes: ['B.Sc. Computer Science'],
        },
      ],
    },
    {
      name: 'Faculty of Social Sciences',
      departments: [
        {
          name: 'Department of Economics',
          programmes: ['B.Sc. Economics'],
        },
      ],
    },
    {
      name: 'Faculty of Arts',
      departments: [
        {
          name: 'Department of English',
          programmes: ['B.A. English'],
        },
      ],
    },
  ],

  admissionsSteps: [
    'Select Greenfield State University as First Choice in UTME or apply for Direct Entry.',
    'Upload O-Level results (minimum five credits including English and Mathematics) on the Admissions Desk.',
    'Attend faculty screening and verify original credentials with the Academic Registry.',
    'Pay acceptance fee via Bursary and collect your Matriculation Number & Portal Access Slip.',
  ],

  news: [
    {
      date: '15 Mar 2026',
      title: '2025/2026 First Semester Results Published',
      text: 'Approved First Semester results across all faculties are now live on the Student Portal. Log in with your matriculation number and access slip to view GPA, CGPA, and carryovers.',
    },
    {
      date: '02 Apr 2026',
      title: 'Carryover & Repeat Course Registration Window',
      text: 'Students with unresolved carryovers are reminded to register outstanding courses first when registration opens for the upcoming session.',
    },
    {
      date: '18 Apr 2026',
      title: 'Annual Senate Lecture & Innovation Exhibition',
      text: 'Final-year projects from the Faculty of Science and Faculty of Arts will be showcased at the Senate Auditorium starting at 10:00 AM.',
    },
  ],

  calendar: [
    { date: '12 Jan 2026', title: 'Resumption & Lectures Begin (First Semester)', detail: 'All returning and fresh students' },
    { date: '15 Mar 2026', title: 'Release of First Semester Results', detail: 'Available on Student Portal' },
    { date: '04 May 2026', title: 'Second Semester Lectures Commence', detail: 'Course registration closes 18 May' },
    { date: '24 Aug 2026', title: 'Second Semester Examinations Begin', detail: 'Three-week examination window' },
  ],

  galleryImages: [
    { url: '', label: 'Senate & Administrative Complex', seed: 'SEN' },
    { url: '', label: 'Computer Science Computing Lab', seed: 'CSC' },
    { url: '', label: 'University Central Library', seed: 'LIB' },
    { url: '', label: 'Main Lecture Theatre', seed: 'LTH' },
  ],

  gradingPreset: '5-point',
  caMax: PRESET_5_POINT.caMax,
  examMax: PRESET_5_POINT.examMax,
  passMark: PRESET_5_POINT.passMark,
  gradeBands: PRESET_5_POINT.gradeBands,
  degreeBands: PRESET_5_POINT.degreeBands,
  standingRules: PRESET_5_POINT.standingRules,
  repeatPolicy: 'latest_replaces',
  requiredUnits: PRESET_5_POINT.requiredUnits,
  portalData: DEMO_UNIVERSITY_PORTAL_DATA,

  seoTitle: 'Greenfield State University — Official Website & Student Results Portal',
  seoDescription:
    'Official website and student results portal for Greenfield State University, Asaba, Delta State. View GPA, CGPA, carryovers, and printable statements of result.',
};

function serializeJsonForScript(obj: unknown): string {
  return JSON.stringify(obj).replace(/<\/script/gi, '<\\/script');
}

export function buildUniversityPortalHtml(
  partial?: Partial<TemplateConfig>,
  options: { previewLimit?: number } = {}
): string {
  const cfg: TemplateConfig = {
    ...universityportalDefaultConfig,
    ...(partial || {}),
    helpdesk: { ...universityportalDefaultConfig.helpdesk!, ...(partial?.helpdesk || {}) },
    registry: { ...universityportalDefaultConfig.registry!, ...(partial?.registry || {}) },
    bursary: { ...universityportalDefaultConfig.bursary!, ...(partial?.bursary || {}) },
    faculties:
      partial?.faculties && partial.faculties.length > 0
        ? partial.faculties
        : universityportalDefaultConfig.faculties,
    admissionsSteps:
      partial?.admissionsSteps && partial.admissionsSteps.length > 0
        ? partial.admissionsSteps
        : universityportalDefaultConfig.admissionsSteps,
    news:
      partial?.news && partial.news.length > 0
        ? partial.news
        : universityportalDefaultConfig.news,
    calendar:
      partial?.calendar && partial.calendar.length > 0
        ? partial.calendar
        : universityportalDefaultConfig.calendar,
    galleryImages:
      partial?.galleryImages && partial.galleryImages.length > 0
        ? partial.galleryImages
        : universityportalDefaultConfig.galleryImages,
    gradeBands:
      partial?.gradeBands && partial.gradeBands.length > 0
        ? partial.gradeBands
        : universityportalDefaultConfig.gradeBands,
    degreeBands:
      partial?.degreeBands && partial.degreeBands.length > 0
        ? partial.degreeBands
        : universityportalDefaultConfig.degreeBands,
    standingRules: partial?.standingRules || universityportalDefaultConfig.standingRules,
    portalData: partial?.portalData || universityportalDefaultConfig.portalData,
  };

  const primaryTokens = getBrandColorTokens(cfg.primaryColor || '#1B3A6B');
  const accentTokens = getBrandColorTokens(cfg.accentColor || '#D4A017');
  const successTokens = getBrandColorTokens(cfg.successColor || '#15803D');
  const warningTokens = getBrandColorTokens(cfg.warningColor || '#B45309');
  const dangerTokens = getBrandColorTokens(cfg.dangerColor || '#B91C1C');

  const instName = cfg.businessName || 'Greenfield State University';
  const motto = cfg.motto || 'Knowledge for Service';
  const established = cfg.established || '2014';
  const headline = cfg.headline || universityportalDefaultConfig.headline!;
  const shortBio = cfg.shortBio || universityportalDefaultConfig.shortBio!;
  const aboutText = cfg.aboutText || universityportalDefaultConfig.aboutText!;
  const address = cfg.address || cfg.city || 'Asaba, Delta State, Nigeria';
  const city = cfg.city || 'Asaba, Delta State, Nigeria';
  const initials = getInitials(instName);
  const logoUrl = validateImageUrl(cfg.logoUrl);

  const helpdesk = cfg.helpdesk!;
  const registry = cfg.registry!;
  const bursary = cfg.bursary!;

  const helpWaNum = normalizeWhatsApp(helpdesk.whatsapp || helpdesk.phone || cfg.whatsapp || cfg.phone);
  const helpWaHref = validateUrl(`https://wa.me/${helpWaNum}`) || 'https://wa.me/2348000000000';
  const helpEmail = helpdesk.email || cfg.email || 'ict@example.com';

  const facultiesList = cfg.faculties || [];
  const totalFaculties = facultiesList.length;
  const totalProgrammes = facultiesList.reduce(
    (sum, f) => sum + f.departments.reduce((dSum, d) => dSum + d.programmes.length, 0),
    0
  );

  // Build embedded #portal-data cleanly (NEVER expose plaintext names/matric/scores!)
  const pData = cfg.portalData || DEMO_UNIVERSITY_PORTAL_DATA;
  let embeddedStudents = pData.students || {};
  let embeddedMode: 'single' | 'sharded' = pData.mode || 'single';

  // In customizer preview, limit embedded data to first N students if sharded
  if (options.previewLimit && options.previewLimit > 0) {
    embeddedMode = 'single';
    const limited: Record<string, typeof embeddedStudents[string]> = {};
    if (pData.mode === 'sharded' && pData.shards) {
      let count = 0;
      for (const prefix of Object.keys(pData.shards)) {
        const bucket = pData.shards[prefix];
        for (const k of Object.keys(bucket)) {
          if (count >= options.previewLimit) break;
          limited[k] = bucket[k];
          count++;
        }
        if (count >= options.previewLimit) break;
      }
      embeddedStudents = limited;
    } else {
      const keys = Object.keys(embeddedStudents).slice(0, options.previewLimit);
      for (const k of keys) limited[k] = embeddedStudents[k];
      embeddedStudents = limited;
    }
  } else if (embeddedMode === 'sharded') {
    embeddedStudents = {};
  }

  const maxGradePoint = Math.max(
    ...(cfg.gradeBands || PRESET_5_POINT.gradeBands).map((g) => g.point),
    1
  );

  const embeddedPortalPayload = {
    mode: embeddedMode,
    schoolSalt: pData.schoolSalt || '',
    sessions: pData.sessions || [],
    students: embeddedStudents,
    stats: pData.stats,
    generatedAt: pData.generatedAt,
    isDemo: Boolean(pData.isDemo),
    demoHint: pData.isDemo ? DEMO_CREDENTIALS : null,
    instName,
    motto,
    address,
    logoUrl,
    initials,
    helpWaNum,
    helpEmail,
    helpPhone: helpdesk.phone || cfg.phone,
    caMax: cfg.caMax ?? 30,
    examMax: cfg.examMax ?? 70,
    passMark: cfg.passMark ?? 40,
    requiredUnits: cfg.requiredUnits ?? 120,
    maxGradePoint,
    repeatPolicy: cfg.repeatPolicy || 'latest_replaces',
    gradeBands: cfg.gradeBands || PRESET_5_POINT.gradeBands,
    degreeBands: cfg.degreeBands || PRESET_5_POINT.degreeBands,
    news: cfg.news || [],
    calendar: cfg.calendar || [],
  };

  const title = cfg.seoTitle || `${instName} — Official Website & Student Results Portal`;
  const desc =
    cfg.seoDescription ||
    `Official university website and student results portal for ${instName}. Check GPA, CGPA, carryovers, and printable statements of result.`;

  const gallerySlots = (cfg.galleryImages || []).slice(0, 4);
  while (gallerySlots.length < 4) {
    gallerySlots.push({ url: '', label: `Campus View ${gallerySlots.length + 1}`, seed: initials });
  }

  function renderOfficeCard(office: typeof helpdesk) {
    const oTel = `tel:${normalizePhone(office.phone)}`;
    const oWa = validateUrl(`https://wa.me/${normalizeWhatsApp(office.whatsapp || office.phone)}`) || helpWaHref;
    const oMail = validateUrl(`mailto:${office.email}`) || 'mailto:ict@example.com';
    return `
      <div class="contact-card">
        <h3>${escapeHtml(office.name)}</h3>
        ${office.hours ? `<p class="office-hours">${escapeHtml(office.hours)}</p>` : ''}
        <div class="contact-links">
          <a href="${escapeHtml(oTel)}" class="contact-row-link"><span>Call:</span> <strong>${escapeHtml(office.phone)}</strong></a>
          <a href="${escapeHtml(oWa)}" target="_blank" rel="noopener noreferrer" class="contact-row-link"><span>WhatsApp:</span> <strong>Message Office</strong></a>
          <a href="${escapeHtml(oMail)}" class="contact-row-link"><span>Email:</span> <strong>${escapeHtml(office.email)}</strong></a>
        </div>
      </div>
    `;
  }

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}" />
  <meta property="og:title" content="${escapeHtml(cfg.ogTitle || title)}" />
  <meta property="og:description" content="${escapeHtml(cfg.ogDescription || desc)}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* ========================================================
       VARSITY DESIGN SYSTEM TOKENS (WCAG AA 4.5:1 Contrast)
       ======================================================== */
    :root {
      --primary: ${escapeHtml(primaryTokens.base)};
      --primary-dark: ${escapeHtml(primaryTokens.dark)};
      --primary-light: ${escapeHtml(primaryTokens.light)};
      --primary-soft: ${escapeHtml(primaryTokens.soft)};
      --primary-contrast: ${escapeHtml(primaryTokens.contrast)};
      --primary-soft-text: ${escapeHtml(primaryTokens.softContrast)};

      --accent: ${escapeHtml(accentTokens.base)};
      --accent-dark: ${escapeHtml(accentTokens.dark)};
      --accent-soft: ${escapeHtml(cfg.accentSoftColor || accentTokens.soft)};
      --accent-contrast: ${escapeHtml(accentTokens.contrast)};

      --bg: ${escapeHtml(cfg.backgroundColor || '#F6F8FC')};
      --surface: ${escapeHtml(cfg.surfaceColor || '#FFFFFF')};
      --border: ${escapeHtml(cfg.borderColor || '#E2E8F0')};
      --text: ${escapeHtml(cfg.textColor || '#0F172A')};
      --text-secondary: ${escapeHtml(cfg.textSecondaryColor || '#475569')};

      --success: ${escapeHtml(successTokens.base)};
      --success-soft: ${escapeHtml(successTokens.soft)};
      --warning: ${escapeHtml(warningTokens.base)};
      --warning-soft: ${escapeHtml(warningTokens.soft)};
      --danger: ${escapeHtml(dangerTokens.base)};
      --danger-soft: ${escapeHtml(dangerTokens.soft)};

      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 18px;
      --shadow-sm: 0 2px 8px rgba(15, 23, 42, 0.05);
      --shadow-md: 0 12px 28px rgba(15, 23, 42, 0.08);
      --font-display: 'Plus Jakarta Sans', 'Segoe UI', system-ui, -apple-system, sans-serif;
      --font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      --max-w: 1160px;
      --nav-h: 70px;
    }

    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; scroll-padding-top: 84px; overflow-x: hidden; }
    body {
      margin: 0;
      padding-top: var(--nav-h);
      font-family: var(--font-body);
      background: var(--bg);
      color: var(--text);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    body.portal-active { padding-top: 0; }
    img { max-width: 100%; display: block; }
    a { color: inherit; }
    button, input, select { font-family: inherit; }
    :focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }

    .container { width: 100%; max-width: var(--max-w); margin: 0 auto; padding: 0 16px; }
    @media (min-width: 768px) { .container { padding: 0 24px; } }

    .btn {
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      min-height: 44px; padding: 10px 18px; border-radius: var(--radius-sm);
      font-weight: 600; font-size: 0.93rem; text-decoration: none;
      border: 1.5px solid transparent; cursor: pointer;
      transition: transform 0.16s ease, background-color 0.16s ease, border-color 0.16s ease;
    }
    .btn:active { transform: translateY(1px); }
    .btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
    .btn-primary { background: var(--primary); color: var(--primary-contrast); }
    .btn-primary:hover:not(:disabled) { background: var(--primary-dark); }
    .btn-accent { background: var(--accent); color: var(--accent-contrast); }
    .btn-accent:hover:not(:disabled) { background: var(--accent-dark); }
    .btn-outline { background: var(--surface); color: var(--primary); border-color: var(--border); }
    .btn-outline:hover:not(:disabled) { border-color: var(--primary); background: var(--primary-soft); color: var(--primary-soft-text); }
    .btn-sm { min-height: 36px; padding: 6px 12px; font-size: 0.84rem; }

    .brand-mark { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; min-width: 0; }
    .brand-logo-img { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); flex-shrink: 0; }
    .brand-monogram {
      width: 40px; height: 40px; border-radius: 10px;
      background: var(--primary); color: var(--primary-contrast);
      font-family: var(--font-display); font-weight: 800; font-size: 0.92rem;
      display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .brand-text-wrap { min-width: 0; }
    .brand-name {
      display: block; font-family: var(--font-display); font-weight: 800; font-size: 0.98rem;
      color: var(--text); line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .brand-motto {
      display: block; font-size: 0.72rem; color: var(--text-secondary);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    /* ========================================================
       FIXED NAVBAR & PUBLIC UNIVERSITY WEBSITE
       ======================================================== */
    .site-header {
      position: fixed; top: 0; left: 0; right: 0; z-index: 60;
      height: var(--nav-h);
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
      display: flex; align-items: center;
    }
    .header-inner { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; }
    .nav-toggle-check { display: none; }
    .nav-toggle-label {
      display: inline-flex; align-items: center; justify-content: center;
      width: 42px; height: 42px; border-radius: var(--radius-sm);
      border: 1px solid var(--border); background: var(--surface); cursor: pointer; flex-shrink: 0;
    }
    .nav-drawer {
      display: none; position: absolute; top: var(--nav-h); left: 0; right: 0;
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 16px; box-shadow: var(--shadow-md); flex-direction: column; gap: 6px;
    }
    .nav-toggle-check:checked ~ .nav-drawer { display: flex; }
    .nav-link {
      text-decoration: none; font-weight: 600; font-size: 0.9rem;
      color: var(--text-secondary); padding: 8px 10px; border-radius: var(--radius-sm);
    }
    .nav-link:hover, .nav-link.active { background: var(--primary-soft); color: var(--primary-soft-text); }
    @media (min-width: 960px) {
      .nav-toggle-label { display: none; }
      .nav-drawer {
        display: flex !important; position: static; flex-direction: row; align-items: center;
        background: transparent; border: none; box-shadow: none; padding: 0; gap: 4px;
      }
    }

    .hero {
      background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
      padding: 40px 0 48px; border-bottom: 1px solid var(--border);
    }
    @media (min-width: 900px) { .hero { padding: 64px 0; } }
    .hero-grid { display: grid; gap: 28px; align-items: center; }
    @media (min-width: 900px) { .hero-grid { grid-template-columns: 1.25fr 0.95fr; gap: 40px; } }
    .hero-kicker {
      display: inline-block; padding: 5px 12px; border-radius: 6px;
      background: var(--primary-soft); color: var(--primary-soft-text);
      font-weight: 700; font-size: 0.78rem; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 14px;
    }
    .hero h1 {
      font-family: var(--font-display); font-weight: 800;
      font-size: clamp(1.85rem, 4.3vw, 2.9rem); line-height: 1.12; margin: 0 0 14px; letter-spacing: -0.02em;
    }
    .hero-lead { font-size: 1.03rem; color: var(--text-secondary); margin: 0 0 24px; max-width: 58ch; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

    .hero-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 22px; box-shadow: var(--shadow-md);
    }
    .hero-card-head {
      display: flex; align-items: center; justify-content: space-between;
      gap: 10px; padding-bottom: 12px; border-bottom: 1px solid var(--border); margin-bottom: 12px;
    }
    .status-tag {
      padding: 4px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700;
      background: var(--success-soft); color: var(--success);
    }
    .hero-stat-list { display: grid; gap: 8px; }
    .hero-stat-item {
      display: flex; justify-content: space-between; gap: 10px; font-size: 0.89rem;
      padding: 8px 10px; border-radius: var(--radius-sm); background: var(--bg);
    }
    .hero-stat-label { color: var(--text-secondary); }
    .hero-stat-val { font-weight: 700; color: var(--text); text-align: right; }

    @keyframes heroFadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .hero-animate { animation: heroFadeUp 0.5s ease both; }
    @media (prefers-reduced-motion: reduce) {
      .hero-animate { animation: none; }
      html { scroll-behavior: auto; }
    }

    .section { padding: 50px 0; }
    .section-alt { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
    .section-head { margin-bottom: 26px; max-width: 680px; }
    .section-label {
      display: block; font-size: 0.78rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.06em; color: var(--primary); margin-bottom: 6px;
    }
    .section-title { font-family: var(--font-display); font-weight: 800; font-size: clamp(1.45rem, 3vw, 2rem); line-height: 1.2; margin: 0 0 8px; }
    .section-sub { margin: 0; color: var(--text-secondary); font-size: 0.96rem; }

    .js-ready .reveal-on-scroll { opacity: 0; transform: translateY(12px); transition: opacity 0.45s ease, transform 0.45s ease; }
    .js-ready .reveal-on-scroll.revealed { opacity: 1; transform: translateY(0); }
    @media (prefers-reduced-motion: reduce) { .js-ready .reveal-on-scroll { opacity: 1; transform: none; transition: none; } }

    .facts-grid { display: grid; gap: 14px; grid-template-columns: 1fr; }
    @media (min-width: 640px) { .facts-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 960px) { .facts-grid { grid-template-columns: repeat(4, 1fr); } }
    .fact-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-md); padding: 18px; box-shadow: var(--shadow-sm);
    }
    .fact-num { font-family: var(--font-display); font-weight: 800; font-size: 1.35rem; color: var(--primary); margin-bottom: 4px; }
    .fact-label { font-size: 0.87rem; color: var(--text-secondary); }

    .faculties-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
    @media (min-width: 768px) { .faculties-grid { grid-template-columns: repeat(3, 1fr); } }
    .faculty-card {
      background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px;
    }
    .faculty-card h3 { font-family: var(--font-display); font-size: 1.08rem; margin: 0 0 10px; color: var(--primary); }
    .dept-block { margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border); }
    .dept-name { font-weight: 700; font-size: 0.9rem; margin-bottom: 4px; }
    .prog-list { margin: 0; padding-left: 18px; font-size: 0.86rem; color: var(--text-secondary); }

    .steps-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
    @media (min-width: 700px) { .steps-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 1000px) { .steps-grid { grid-template-columns: repeat(4, 1fr); } }
    .step-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; }
    .step-num {
      width: 32px; height: 32px; border-radius: 8px; background: var(--primary); color: var(--primary-contrast);
      font-family: var(--font-display); font-weight: 800; font-size: 0.9rem;
      display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;
    }
    .step-card p { margin: 0; font-size: 0.92rem; }

    .news-calendar-split { display: grid; gap: 22px; grid-template-columns: 1fr; }
    @media (min-width: 900px) { .news-calendar-split { grid-template-columns: 1.3fr 0.9fr; } }
    .news-stack { display: grid; gap: 14px; }
    .news-card {
      background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 18px;
      display: grid; gap: 6px;
    }
    .news-date { font-size: 0.76rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.04em; }
    .news-card h3 { font-family: var(--font-display); font-size: 1.02rem; margin: 0; }
    .news-card p { margin: 0; font-size: 0.9rem; color: var(--text-secondary); }

    .calendar-card {
      background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px;
    }
    .calendar-list { display: grid; gap: 10px; margin-top: 12px; }
    .calendar-row {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm);
      padding: 10px 12px; display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;
    }
    .cal-date { font-size: 0.78rem; font-weight: 700; color: var(--primary); white-space: nowrap; }
    .cal-title { font-weight: 600; font-size: 0.88rem; }
    .cal-detail { font-size: 0.78rem; color: var(--text-secondary); }

    /* Layered Gallery */
    .gallery-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
    @media (min-width: 640px) { .gallery-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (min-width: 960px) { .gallery-grid { grid-template-columns: repeat(4, 1fr); } }
    .layered-image-box {
      position: relative; border-radius: var(--radius-md); overflow: hidden;
      border: 1px solid var(--border); aspect-ratio: 4 / 3;
      background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    }
    .layered-art-layer {
      position: absolute; inset: 0; display: flex; flex-direction: column;
      align-items: center; justify-content: center; padding: 14px; text-align: center;
      color: var(--primary-contrast);
    }
    .art-monogram { font-family: var(--font-display); font-weight: 800; font-size: 1.7rem; letter-spacing: 0.06em; margin-bottom: 4px; }
    .art-label { font-size: 0.84rem; font-weight: 600; opacity: 0.92; }
    .layered-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.35s ease; }
    .layered-photo.loaded { opacity: 1; }
    .gallery-caption { margin-top: 8px; font-size: 0.86rem; font-weight: 600; }

    /* Contact 3 Offices */
    .offices-grid { display: grid; gap: 16px; grid-template-columns: 1fr; }
    @media (min-width: 768px) { .offices-grid { grid-template-columns: repeat(3, 1fr); } }
    .contact-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px;
      box-shadow: var(--shadow-sm);
    }
    .contact-card h3 { font-family: var(--font-display); font-size: 1.05rem; margin: 0 0 4px; color: var(--primary); }
    .office-hours { margin: 0 0 12px; font-size: 0.8rem; color: var(--text-secondary); }
    .contact-links { display: grid; gap: 8px; }
    .contact-row-link {
      display: flex; justify-content: space-between; gap: 8px; padding: 8px 10px;
      border-radius: var(--radius-sm); background: var(--bg); text-decoration: none;
      font-size: 0.85rem; word-break: break-word;
    }
    .contact-row-link:hover { background: var(--primary-soft); color: var(--primary-soft-text); }

    .site-footer { background: var(--text); color: #E2E8F0; padding: 28px 0; font-size: 0.86rem; }
    .footer-inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
    .footer-links { display: flex; flex-wrap: wrap; gap: 16px; }
    .footer-links a { color: #CBD5E1; text-decoration: none; font-weight: 600; }
    .footer-links a:hover { color: #FFFFFF; text-decoration: underline; }

    @keyframes waPulse {
      0%, 100% { box-shadow: 0 6px 20px rgba(22, 163, 74, 0.35); }
      50% { box-shadow: 0 8px 28px rgba(22, 163, 74, 0.55); }
    }
    .floating-wa {
      position: fixed; right: 18px; bottom: 18px; z-index: 70;
      width: 54px; height: 54px; border-radius: 50%; background: #16A34A; color: #FFFFFF;
      display: inline-flex; align-items: center; justify-content: center; text-decoration: none;
      animation: waPulse 2.6s ease-in-out infinite;
    }
    .floating-wa:hover { background: #15803D; }

    /* ========================================================
       STUDENT PORTAL (#portal-view)
       ======================================================== */
    #portal-view { display: none; min-height: 100vh; background: var(--bg); }
    body.portal-active #public-site { display: none; }
    body.portal-active #portal-view { display: block; }

    .portal-topbar {
      background: var(--surface); border-bottom: 1px solid var(--border);
      padding: 12px 0; position: sticky; top: 0; z-index: 50;
    }
    .portal-topbar-inner { display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
    .portal-shell { padding: 22px 0 64px; }

    .login-wrap { max-width: 480px; margin: 16px auto; }
    .login-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius: var(--radius-lg); padding: 24px; box-shadow: var(--shadow-md);
    }
    .login-card h1 { font-family: var(--font-display); font-size: 1.45rem; margin: 0 0 6px; }
    .login-sub { margin: 0 0 18px; font-size: 0.91rem; color: var(--text-secondary); }
    .field { margin-bottom: 14px; }
    .field label { display: block; font-size: 0.84rem; font-weight: 600; margin-bottom: 6px; }
    .input-row { position: relative; display: flex; align-items: center; }
    .field input, .field select {
      width: 100%; min-height: 46px; padding: 10px 12px; border-radius: var(--radius-sm);
      border: 1.5px solid var(--border); background: var(--surface); color: var(--text); font-size: 0.96rem;
    }
    .field input:focus, .field select:focus { border-color: var(--primary); outline: none; }
    .toggle-secret-btn {
      position: absolute; right: 8px; background: var(--bg); border: 1px solid var(--border);
      border-radius: 6px; padding: 5px 10px; font-size: 0.78rem; font-weight: 600; cursor: pointer;
    }

    .alert-box { border-radius: var(--radius-sm); padding: 12px 14px; font-size: 0.88rem; margin-bottom: 14px; border: 1px solid transparent; }
    .alert-danger { background: var(--danger-soft); color: var(--danger); border-color: #FECACA; }
    .alert-warn { background: var(--warning-soft); color: var(--warning); border-color: #FDE68A; }
    .alert-info { background: var(--primary-soft); color: var(--primary-soft-text); border-color: #CBD5E1; }

    .demo-banner {
      margin-top: 16px; padding: 12px 14px; border-radius: var(--radius-sm);
      background: var(--primary-soft); border: 1px dashed var(--primary);
      font-size: 0.85rem; color: var(--primary-soft-text); display: grid; gap: 8px;
    }
    .lost-code-box { margin-top: 16px; border-top: 1px solid var(--border); padding-top: 14px; }
    .lost-code-box summary { cursor: pointer; font-weight: 600; font-size: 0.89rem; color: var(--primary); }
    .lost-code-inner { margin-top: 10px; display: grid; gap: 10px; }

    /* Authenticated Portal Header & Tabs */
    .profile-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 16px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
      gap: 12px; margin-bottom: 16px; box-shadow: var(--shadow-sm);
    }
    .student-badge { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .student-avatar {
      width: 46px; height: 46px; border-radius: 10px; background: var(--primary); color: var(--primary-contrast);
      font-family: var(--font-display); font-weight: 800; font-size: 1rem;
      display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .student-meta h2 { font-family: var(--font-display); font-size: 1.08rem; margin: 0; }
    .student-meta p { margin: 2px 0 0; font-size: 0.82rem; color: var(--text-secondary); }
    .standing-badge {
      display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700;
    }
    .standing-good { background: var(--success-soft); color: var(--success); }
    .standing-probation { background: var(--warning-soft); color: var(--warning); }
    .standing-senate { background: var(--danger-soft); color: var(--danger); }

    .portal-tabs {
      display: flex; flex-wrap: wrap; gap: 6px; border-bottom: 1px solid var(--border);
      margin-bottom: 18px; padding-bottom: 10px;
    }
    .portal-tab {
      min-height: 40px; padding: 8px 14px; border-radius: var(--radius-sm);
      border: 1px solid transparent; background: transparent;
      font-weight: 600; font-size: 0.88rem; color: var(--text-secondary); cursor: pointer;
    }
    .portal-tab:hover { background: var(--surface); color: var(--text); }
    .portal-tab.active { background: var(--primary); color: var(--primary-contrast); }

    .portal-panel { display: none; }
    .portal-panel.active { display: block; animation: heroFadeUp 0.2s ease both; }

    .stats-row { display: grid; gap: 14px; grid-template-columns: 1fr; margin-bottom: 18px; }
    @media (min-width: 640px) { .stats-row { grid-template-columns: repeat(3, 1fr); } }
    .stat-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 16px; box-shadow: var(--shadow-sm);
    }
    .stat-label { font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-secondary); margin-bottom: 4px; }
    .stat-value { font-family: var(--font-display); font-size: 1.55rem; font-weight: 800; color: var(--primary); line-height: 1.15; }
    .stat-sub { font-size: 0.82rem; color: var(--text-secondary); margin-top: 4px; }

    /* Pickers bar */
    .pickers-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 16px; margin-bottom: 18px; display: grid; gap: 14px;
    }
    @media (min-width: 768px) { .pickers-card { grid-template-columns: 1fr 1.2fr auto; align-items: end; } }
    .picker-label { display: block; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 6px; }
    .segmented-group { display: flex; flex-wrap: wrap; gap: 6px; }
    .seg-btn {
      min-height: 44px; padding: 8px 14px; border-radius: var(--radius-sm);
      border: 1.5px solid var(--border); background: var(--bg); color: var(--text);
      font-weight: 600; font-size: 0.86rem; cursor: pointer;
      display: inline-flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1.15;
    }
    .seg-btn:hover:not(:disabled) { border-color: var(--primary); }
    .seg-btn.active { background: var(--primary); color: var(--primary-contrast); border-color: var(--primary); }
    .seg-btn:disabled { opacity: 0.55; cursor: not-allowed; color: var(--text-secondary); }
    .seg-sub { font-size: 0.68rem; font-weight: 500; opacity: 0.9; }

    /* Report Sheet & Tables */
    .sheet-card {
      background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md);
      padding: 20px; box-shadow: var(--shadow-sm); margin-bottom: 18px;
    }
    .table-scroll { width: 100%; overflow-x: auto; }
    .scores-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; min-width: 600px; }
    .scores-table th, .scores-table td { padding: 10px 8px; text-align: left; border-bottom: 1px solid var(--border); }
    .scores-table th { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-secondary); background: var(--bg); }
    .scores-table td.num, .scores-table th.num { text-align: right; font-variant-numeric: tabular-nums; }
    .carryover-tag {
      display: inline-block; margin-left: 6px; padding: 2px 7px; border-radius: 4px;
      font-size: 0.7rem; font-weight: 700; background: var(--warning-soft); color: var(--warning);
    }
    .repeat-tag {
      display: inline-block; margin-left: 6px; padding: 2px 7px; border-radius: 4px;
      font-size: 0.7rem; font-weight: 700; background: var(--primary-soft); color: var(--primary-soft-text);
    }

    .summary-strip {
      display: grid; gap: 10px; grid-template-columns: repeat(2, 1fr);
      margin-top: 16px; padding: 14px; background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-sm);
    }
    @media (min-width: 640px) { .summary-strip { grid-template-columns: repeat(4, 1fr); } }
    .sum-item span { display: block; font-size: 0.74rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; }
    .sum-item strong { font-size: 1rem; color: var(--text); font-variant-numeric: tabular-nums; }

    /* Progress Bar Chart & CGPA Trend */
    .bar-chart { display: grid; gap: 10px; }
    .bar-row { display: grid; grid-template-columns: 145px 1fr 110px; align-items: center; gap: 10px; font-size: 0.82rem; }
    @media (max-width: 520px) { .bar-row { grid-template-columns: 112px 1fr 86px; font-size: 0.74rem; } }
    .bar-track { height: 14px; border-radius: 6px; background: var(--bg); border: 1px solid var(--border); overflow: hidden; }
    .bar-fill { height: 100%; background: var(--primary); border-radius: 5px; }
    .bar-val { font-weight: 700; text-align: right; font-variant-numeric: tabular-nums; }

    /* Carryover warning list */
    .carryover-card {
      background: var(--warning-soft); border: 1px solid #FDE68A; border-radius: var(--radius-md);
      padding: 16px; margin-bottom: 18px; color: var(--warning);
    }
    .carryover-card h3 { margin: 0 0 6px; font-family: var(--font-display); font-size: 1rem; }
    .carryover-list { margin: 8px 0; padding-left: 18px; font-size: 0.88rem; }

    /* Print Statement of Result */
    .print-only-header, .print-watermark, .print-signatures, .print-full-container { display: none; }
    @page { size: A4; margin: 12mm; }
    @media print {
      body { background: #FFFFFF !important; color: #0F172A !important; padding: 0 !important; }
      #public-site, .portal-topbar, .profile-card, .portal-tabs, .pickers-card,
      .no-print, .floating-wa, .progress-card, .carryover-card {
        display: none !important;
      }
      #portal-view, .portal-shell, .container, #panel-results {
        display: block !important; padding: 0 !important; margin: 0 !important; max-width: 100% !important;
      }
      .sheet-card { border: none !important; box-shadow: none !important; padding: 0 !important; }
      .scores-table { min-width: 100% !important; font-size: 10pt; }
      .print-only-header { display: flex !important; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--primary); padding-bottom: 10px; margin-bottom: 12px; }
      .print-watermark {
        display: block !important; position: fixed; top: 44%; left: 50%;
        transform: translate(-50%, -50%) rotate(-32deg);
        font-size: 2.2rem; font-weight: 800; color: rgba(15, 23, 42, 0.08);
        pointer-events: none; z-index: 999; white-space: nowrap; text-transform: uppercase;
      }
      .print-signatures { display: grid !important; grid-template-columns: 1fr 1fr; gap: 36px; margin-top: 24px; page-break-inside: avoid; }
      .sig-line { border-top: 1px solid #475569; padding-top: 5px; font-size: 0.82rem; color: #475569; }
      body.print-mode-full #single-semester-sheet { display: none !important; }
      body.print-mode-full .print-full-container { display: block !important; }
    }
  </style>
</head>
<body>

  <!-- ========================================================
       PUBLIC UNIVERSITY WEBSITE (#public-site)
       ======================================================== -->
  <div id="public-site">
    <header class="site-header">
      <div class="container header-inner">
        <a href="#top" class="brand-mark">
          ${
            logoUrl
              ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(instName)} logo" class="brand-logo-img" />`
              : `<span class="brand-monogram" aria-hidden="true">${escapeHtml(initials)}</span>`
          }
          <span class="brand-text-wrap">
            <span class="brand-name">${escapeHtml(instName)}</span>
            <span class="brand-motto">${escapeHtml(motto)}</span>
          </span>
        </a>

        <input type="checkbox" id="nav-toggle" class="nav-toggle-check" aria-label="Toggle menu" />
        <label for="nav-toggle" class="nav-toggle-label" aria-label="Open menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        </label>

        <nav class="nav-drawer" aria-label="Main navigation">
          <a href="#top" class="nav-link active">Home</a>
          <a href="#about" class="nav-link">About</a>
          <a href="#academics" class="nav-link">Academics</a>
          <a href="#admissions" class="nav-link">Admissions</a>
          <a href="#news" class="nav-link">News</a>
          <a href="#contact" class="nav-link">Contact</a>
          <a href="#/portal" class="btn btn-primary btn-sm">Student Portal</a>
        </nav>
      </div>
    </header>

    <main id="top">
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-animate">
            <span class="hero-kicker">${escapeHtml(motto)}</span>
            <h1>${escapeHtml(headline)}</h1>
            <p class="hero-lead">${escapeHtml(shortBio)}</p>
            <div class="hero-actions">
              <a href="#/portal" class="btn btn-primary">Check my results</a>
              <a href="#admissions" class="btn btn-outline">Admissions</a>
            </div>
          </div>

          <aside class="hero-card hero-animate" aria-label="University portal overview">
            <div class="hero-card-head">
              <strong>Academic Results Portal</strong>
              <span class="status-tag">Online &amp; Encrypted</span>
            </div>
            <div class="hero-stat-list">
              <div class="hero-stat-item">
                <span class="hero-stat-label">Grading System</span>
                <span class="hero-stat-val">${cfg.gradingPreset === '4-point' ? '4.00-Point Scale' : '5.00-Point Scale'} (CA ${cfg.caMax ?? 30} / Exam ${cfg.examMax ?? 70})</span>
              </div>
              <div class="hero-stat-item">
                <span class="hero-stat-label">Sessions Published</span>
                <span class="hero-stat-val">${escapeHtml((pData.sessions || ['2023/2024', '2024/2025', '2025/2026']).join(', '))}</span>
              </div>
              <div class="hero-stat-item">
                <span class="hero-stat-label">Campus Location</span>
                <span class="hero-stat-val">${escapeHtml(city)}</span>
              </div>
              <div class="hero-stat-item">
                <span class="hero-stat-label">Established</span>
                <span class="hero-stat-val">${escapeHtml(established)}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="facts-grid reveal-on-scroll">
            <div class="fact-card"><div class="fact-num">${totalFaculties} Faculties</div><div class="fact-label">Accredited academic faculties &amp; colleges</div></div>
            <div class="fact-card"><div class="fact-num">${totalProgrammes} Programmes</div><div class="fact-label">Undergraduate degrees &amp; diplomas</div></div>
            <div class="fact-card"><div class="fact-num">Est. ${escapeHtml(established)}</div><div class="fact-label">${escapeHtml(city)}</div></div>
            <div class="fact-card"><div class="fact-num">Zero Queues</div><div class="fact-label">Pick Session &amp; Semester, track GPA, CGPA &amp; carryovers</div></div>
          </div>
        </div>
      </section>

      <section id="about" class="section section-alt">
        <div class="container">
          <div class="section-head reveal-on-scroll">
            <span class="section-label">About ${escapeHtml(instName)}</span>
            <h2 class="section-title">Scholarship built for the digital age</h2>
            <p class="section-sub">${escapeHtml(aboutText)}</p>
          </div>

          <div class="gallery-grid reveal-on-scroll">
            ${gallerySlots
              .map((slot) => {
                const validPhoto = validateImageUrl(slot.url);
                return `
                  <figure style="margin:0;">
                    <div class="layered-image-box">
                      <div class="layered-art-layer" aria-hidden="true">
                        <span class="art-monogram">${escapeHtml(slot.seed || initials)}</span>
                        <span class="art-label">${escapeHtml(slot.label)}</span>
                      </div>
                      ${
                        validPhoto
                          ? `<img src="${escapeHtml(validPhoto)}" data-photo="${escapeHtml(validPhoto)}" alt="${escapeHtml(slot.label)}" loading="lazy" class="layered-photo" onload="this.classList.add('loaded')" onerror="this.style.display='none'" />`
                          : ''
                      }
                    </div>
                    <figcaption class="gallery-caption">${escapeHtml(slot.label)}</figcaption>
                  </figure>
                `;
              })
              .join('')}
          </div>
        </div>
      </section>

      <section id="academics" class="section">
        <div class="container">
          <div class="section-head reveal-on-scroll">
            <span class="section-label">Academics</span>
            <h2 class="section-title">Faculties, Departments &amp; Programmes</h2>
            <p class="section-sub">Explore accredited academic units across ${escapeHtml(instName)}.</p>
          </div>
          <div class="faculties-grid reveal-on-scroll">
            ${facultiesList
              .map(
                (fac) => `
              <article class="faculty-card">
                <h3>${escapeHtml(fac.name)}</h3>
                ${fac.departments
                  .map(
                    (dept) => `
                  <div class="dept-block">
                    <div class="dept-name">${escapeHtml(dept.name)}</div>
                    <ul class="prog-list">
                      ${dept.programmes.map((pr) => `<li>${escapeHtml(pr)}</li>`).join('')}
                    </ul>
                  </div>
                `
                  )
                  .join('')}
              </article>
            `
              )
              .join('')}
          </div>
        </div>
      </section>

      <section id="admissions" class="section section-alt">
        <div class="container">
          <div class="section-head reveal-on-scroll">
            <span class="section-label">Admissions</span>
            <h2 class="section-title">How to apply in 4 steps</h2>
          </div>
          <div class="steps-grid reveal-on-scroll">
            ${(cfg.admissionsSteps || [])
              .map(
                (step, idx) => `
              <div class="step-card">
                <span class="step-num">${idx + 1}</span>
                <p>${escapeHtml(step)}</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </section>

      <section id="news" class="section">
        <div class="container">
          <div class="news-calendar-split reveal-on-scroll">
            <div>
              <div class="section-head">
                <span class="section-label">News &amp; Notices</span>
                <h2 class="section-title">University Bulletins</h2>
              </div>
              <div class="news-stack">
                ${(cfg.news || [])
                  .map(
                    (item) => `
                  <article class="news-card">
                    <span class="news-date">${escapeHtml(item.date)}</span>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.text)}</p>
                  </article>
                `
                  )
                  .join('')}
              </div>
            </div>

            <div>
              <div class="section-head">
                <span class="section-label">Academic Calendar</span>
                <h2 class="section-title">Key Dates</h2>
              </div>
              <div class="calendar-card">
                <div class="calendar-list">
                  ${(cfg.calendar || [])
                    .map(
                      (cal) => `
                    <div class="calendar-row">
                      <div>
                        <div class="cal-title">${escapeHtml(cal.title)}</div>
                        ${cal.detail ? `<div class="cal-detail">${escapeHtml(cal.detail)}</div>` : ''}
                      </div>
                      <span class="cal-date">${escapeHtml(cal.date)}</span>
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="section section-alt">
        <div class="container">
          <div class="section-head reveal-on-scroll">
            <span class="section-label">University Offices</span>
            <h2 class="section-title">ICT Helpdesk, Registry &amp; Bursary</h2>
            <p class="section-sub">${escapeHtml(address)}</p>
          </div>
          <div class="offices-grid reveal-on-scroll">
            ${renderOfficeCard(helpdesk)}
            ${renderOfficeCard(registry)}
            ${renderOfficeCard(bursary)}
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div>&copy; ${new Date().getFullYear()} ${escapeHtml(instName)}. ${escapeHtml(motto)}.</div>
        <div class="footer-links">
          <a href="#top">Back to top</a>
          <a href="#/portal">Student Portal</a>
        </div>
      </div>
    </footer>
  </div>

  <!-- ========================================================
       STUDENT RESULTS PORTAL (#portal-view)
       ======================================================== -->
  <div id="portal-view">
    <div class="portal-topbar">
      <div class="container portal-topbar-inner">
        <a href="#/" class="brand-mark">
          ${
            logoUrl
              ? `<img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(instName)}" class="brand-logo-img" />`
              : `<span class="brand-monogram" aria-hidden="true">${escapeHtml(initials)}</span>`
          }
          <span class="brand-text-wrap">
            <span class="brand-name">${escapeHtml(instName)}</span>
            <span class="brand-motto">Student Results Portal</span>
          </span>
        </a>
        <a href="#/" class="btn btn-outline btn-sm">&larr; University Website</a>
      </div>
    </div>

    <div class="container portal-shell">
      <div id="portal-crypto-warning" class="alert-box alert-warn" style="display:none;" role="alert"></div>
      <div id="portal-inactivity-banner" class="alert-box alert-info" style="display:none;" role="status">
        You were signed out after 10 minutes of inactivity to protect your academic records.
      </div>

      <!-- LOGIN CARD -->
      <section id="portal-login-section" class="login-wrap" aria-label="Student Portal Login">
        <div class="login-card">
          <h1>Student Results Portal</h1>
          <p class="login-sub">Sign in with your Matriculation Number and your 10-character Access Code.</p>

          <div id="login-error-box" class="alert-box alert-danger" style="display:none;" role="alert"></div>

          <form id="portal-login-form" novalidate>
            <div class="field">
              <label for="login-matric">Matric Number</label>
              <input id="login-matric" type="text" autocomplete="off" spellcheck="false" placeholder="e.g. GSU/22/CSC/0001" required />
            </div>

            <div class="field">
              <label for="login-code">Access Code</label>
              <div class="input-row">
                <input id="login-code" type="password" autocomplete="off" spellcheck="false" placeholder="e.g. 23456-789AB" required style="padding-right:70px;" />
                <button type="button" id="toggle-code-vis" class="toggle-secret-btn">Show</button>
              </div>
            </div>

            <button type="submit" id="login-submit-btn" class="btn btn-primary" style="width:100%;">
              Open my results
            </button>
          </form>

          ${
            pData.isDemo
              ? `
          <div class="demo-banner" id="demo-account-banner">
            <div><strong>Trying the demo?</strong> Sign in with Matric <code>${escapeHtml(DEMO_CREDENTIALS.matricNumber)}</code> and Code <code>${escapeHtml(DEMO_CREDENTIALS.accessCode)}</code>.</div>
            <button type="button" id="use-demo-btn" class="btn btn-outline btn-sm">Use demo account</button>
          </div>
          `
              : ''
          }

          <details class="lost-code-box">
            <summary>Lost your code?</summary>
            <div class="lost-code-inner">
              <p style="margin:0; font-size:0.83rem; color:var(--text-secondary);">
                1. Enter your details below.<br/>
                2. Send a pre-filled verification message to the ICT Helpdesk.<br/>
                3. ICT/Registry verifies your student ID before sharing your slip code.
              </p>
              <div class="field" style="margin-bottom:0;"><label for="lost-name">Full Name</label><input id="lost-name" type="text" placeholder="e.g. Chinedu Okafor" /></div>
              <div class="field" style="margin-bottom:0;"><label for="lost-matric">Matric Number</label><input id="lost-matric" type="text" placeholder="e.g. GSU/22/CSC/0001" /></div>
              <div class="field" style="margin-bottom:0;"><label for="lost-dept">Department</label><input id="lost-dept" type="text" placeholder="e.g. Computer Science" /></div>
              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                <a id="lost-wa-link" href="${escapeHtml(helpWaHref)}" target="_blank" rel="noopener noreferrer" class="btn btn-accent btn-sm">WhatsApp ICT Helpdesk</a>
                <a id="lost-email-link" href="mailto:${escapeHtml(helpEmail)}" class="btn btn-outline btn-sm">Email ICT Helpdesk</a>
              </div>
            </div>
          </details>
        </div>
      </section>

      <!-- AUTHENTICATED PORTAL -->
      <section id="portal-app-section" style="display:none;" aria-label="Student Academic Workspace">
        <div class="profile-card">
          <div class="student-badge">
            <span class="student-avatar" id="st-initials">ST</span>
            <div class="student-meta">
              <h2 id="st-name">Student Name</h2>
              <p id="st-subline">Matric &bull; Faculty &bull; Department</p>
              <p id="st-progline">Programme &bull; Level &bull; Entry Session</p>
            </div>
          </div>
          <div style="display:flex; flex-wrap:wrap; align-items:center; gap:8px;">
            <span id="st-standing-badge" class="standing-badge standing-good">Good standing</span>
            <button type="button" id="portal-logout-btn" class="btn btn-outline btn-sm">Log out</button>
          </div>
        </div>

        <nav class="portal-tabs" aria-label="Student portal tabs">
          <button type="button" class="portal-tab active" data-tab="dashboard">Dashboard</button>
          <button type="button" class="portal-tab" data-tab="results">Results</button>
          <button type="button" class="portal-tab" data-tab="planner">Target Planner</button>
          <button type="button" class="portal-tab" data-tab="contact">Contact ICT</button>
        </nav>

        <!-- TAB 1: DASHBOARD -->
        <div id="panel-dashboard" class="portal-panel active">
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-label">Latest Semester GPA</div>
              <div class="stat-value" id="dash-gpa">—</div>
              <div class="stat-sub" id="dash-latest-term">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Cumulative CGPA</div>
              <div class="stat-value" id="dash-cgpa">—</div>
              <div class="stat-sub" id="dash-degree-class">—</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Units Earned</div>
              <div class="stat-value" id="dash-units">—</div>
              <div class="stat-sub" id="dash-units-sub">—</div>
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:10px; margin-bottom:20px;">
            <button type="button" id="qa-view-results" class="btn btn-primary">View results</button>
            <button type="button" id="qa-print-stmt" class="btn btn-outline">Statement of result</button>
            <button type="button" id="qa-planner" class="btn btn-outline">Target planner</button>
            <button type="button" id="qa-contact" class="btn btn-outline">Contact ICT</button>
          </div>

          <div class="news-calendar-split">
            <div class="sheet-card">
              <h3 style="margin:0 0 10px; font-family:var(--font-display); font-size:1.02rem;">Latest News</h3>
              <div id="dash-news" class="news-stack"></div>
            </div>
            <div class="sheet-card">
              <h3 style="margin:0 0 10px; font-family:var(--font-display); font-size:1.02rem;">Academic Calendar</h3>
              <div id="dash-calendar" class="calendar-list"></div>
            </div>
          </div>
        </div>

        <!-- TAB 2: RESULTS (Session & Semester PICKERS) -->
        <div id="panel-results" class="portal-panel">
          <div class="pickers-card no-print">
            <div>
              <span class="picker-label">Session</span>
              <div id="session-picker-wrap"></div>
            </div>
            <div>
              <span class="picker-label">Semester</span>
              <div id="semester-picker-wrap" class="segmented-group" role="group" aria-label="Semester picker"></div>
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:6px;">
              <button type="button" id="print-sem-btn" class="btn btn-primary btn-sm">Print this semester</button>
              <button type="button" id="print-full-btn" class="btn btn-outline btn-sm">Print full record</button>
            </div>
          </div>

          <div class="print-watermark" aria-hidden="true">Student copy: not an official transcript</div>

          <div class="sheet-card" id="single-semester-sheet">
            <div class="print-only-header">
              <div>
                <strong style="font-size:15pt; color:var(--primary);">${escapeHtml(instName)}</strong>
                <div style="font-size:9pt; color:#475569;">${escapeHtml(motto)} &bull; ${escapeHtml(address)}</div>
              </div>
              <div style="text-align:right; font-size:9pt; color:#475569;">
                <div><strong>STATEMENT OF RESULT</strong></div>
                <div id="print-sem-bio"></div>
              </div>
            </div>

            <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:8px; margin-bottom:12px;">
              <div>
                <h3 id="res-heading" style="margin:0; font-family:var(--font-display); font-size:1.15rem;">Semester Results</h3>
                <p id="res-subheading" style="margin:2px 0 0; font-size:0.86rem; color:var(--text-secondary);"></p>
              </div>
              <span id="res-standing-pill" class="standing-badge standing-good">Good standing</span>
            </div>

            <div class="table-scroll">
              <table class="scores-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th class="num">Units</th>
                    <th class="num">CA</th>
                    <th class="num">Exam</th>
                    <th class="num">Total</th>
                    <th>Grade</th>
                    <th class="num">GP</th>
                  </tr>
                </thead>
                <tbody id="res-courses-tbody"></tbody>
              </table>
            </div>

            <div class="summary-strip" id="res-summary-strip">
              <div class="sum-item"><span>TNU</span><strong id="sum-tnu">—</strong></div>
              <div class="sum-item"><span>TCP</span><strong id="sum-tcp">—</strong></div>
              <div class="sum-item"><span>Semester GPA</span><strong id="sum-gpa">—</strong></div>
              <div class="sum-item"><span>Level</span><strong id="sum-level">—</strong></div>
              <div class="sum-item"><span>CTNU</span><strong id="sum-ctnu">—</strong></div>
              <div class="sum-item"><span>CTCP</span><strong id="sum-ctcp">—</strong></div>
              <div class="sum-item"><span>Cumulative CGPA</span><strong id="sum-cgpa">—</strong></div>
              <div class="sum-item"><span>Class Standing</span><strong id="sum-class">—</strong></div>
            </div>

            <div style="margin-top:10px; font-size:0.8rem; color:var(--text-secondary);">
              Official transcripts are issued by the Registry.
            </div>
            <div class="print-signatures">
              <div class="sig-line">Head of Department &amp; Date</div>
              <div class="sig-line">Academic Registrar / Stamp</div>
            </div>
          </div>

          <div id="print-full-container" class="print-full-container sheet-card"></div>

          <!-- Carryovers Block -->
          <div id="carryovers-box" class="carryover-card" style="display:none;">
            <h3>Unresolved Carryover Courses</h3>
            <ul id="carryovers-list" class="carryover-list"></ul>
            <p style="margin:0; font-size:0.84rem; font-weight:600;">Register these courses again in the next available session.</p>
          </div>

          <!-- Progress Block -->
          <div class="sheet-card progress-card">
            <h3 style="margin:0 0 12px; font-family:var(--font-display); font-size:1.05rem;">Progress: Semester GPA &amp; CGPA Trend</h3>
            <div id="progress-bars" class="bar-chart"></div>
          </div>
        </div>

        <!-- TAB 3: TARGET PLANNER -->
        <div id="panel-planner" class="portal-panel">
          <div class="sheet-card">
            <h3 style="margin:0 0 6px; font-family:var(--font-display); font-size:1.15rem;">Target Class of Degree Planner</h3>
            <p style="margin:0 0 16px; font-size:0.88rem; color:var(--text-secondary);">
              Estimate the average GPA needed over your remaining degree units. Note: this is a mathematical estimate based on your current cumulative units and points.
            </p>
            <div class="field" style="max-width:340px;">
              <label for="planner-target-select">Target Class of Degree</label>
              <select id="planner-target-select"></select>
            </div>
            <div id="planner-result-box" class="alert-box alert-info" style="margin-top:12px;"></div>
          </div>
        </div>

        <!-- TAB 4: CONTACT ICT -->
        <div id="panel-contact" class="portal-panel">
          <div class="offices-grid">
            ${renderOfficeCard(helpdesk)}
            ${renderOfficeCard(registry)}
            ${renderOfficeCard(bursary)}
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- FLOATING WHATSAPP -->
  <a href="${escapeHtml(helpWaHref)}" target="_blank" rel="noopener noreferrer" class="floating-wa" aria-label="Chat with ${escapeHtml(instName)} ICT Helpdesk on WhatsApp">
    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.46 0 .08 5.38.08 11.98c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.62a11.9 11.9 0 0 0 5.86 1.5h.01c6.6 0 11.98-5.38 11.98-11.98 0-3.2-1.25-6.21-3.53-8.42zM12.07 21.86h-.01a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.68.96.98-3.58-.24-.37a9.87 9.87 0 0 1-1.52-5.3c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 7 2.9a9.83 9.83 0 0 1 2.9 7c0 5.46-4.44 9.9-9.93 9.88zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.05 1.02-1.05 2.49s1.07 2.89 1.22 3.09c.15.2 2.11 3.22 5.11 4.52.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/></svg>
  </a>

  <script type="application/json" id="portal-data">${serializeJsonForScript(embeddedPortalPayload)}</script>

  <script>
    (function () {
      'use strict';

      // 1. Progressive enhancement & reveal fallback
      try {
        document.documentElement.classList.add('js-ready');
        setTimeout(function () {
          document.querySelectorAll('.reveal-on-scroll:not(.revealed)').forEach(function (el) {
            el.classList.add('revealed');
          });
        }, 1500);
        if ('IntersectionObserver' in window) {
          var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
            });
          }, { threshold: 0.12 });
          document.querySelectorAll('.reveal-on-scroll').forEach(function (el) { obs.observe(el); });
        } else {
          document.querySelectorAll('.reveal-on-scroll').forEach(function (el) { el.classList.add('revealed'); });
        }
        var navToggle = document.getElementById('nav-toggle');
        document.querySelectorAll('.nav-drawer a').forEach(function (a) {
          a.addEventListener('click', function () { if (navToggle) navToggle.checked = false; });
        });
        document.querySelectorAll('img[data-photo]').forEach(function (img) {
          if (img.complete && img.naturalHeight > 0) img.classList.add('loaded');
        });
      } catch (e) {}

      // 2. Embedded metadata (never plaintext student data)
      var PORTAL = {};
      try {
        PORTAL = JSON.parse(document.getElementById('portal-data').textContent || '{}');
      } catch (e) {
        PORTAL = { mode: 'single', students: {}, sessions: [], degreeBands: [] };
      }

      var shardCache = {};
      var state = {
        student: null,          // decrypted UniversityStudentPayload (memory only!)
        activeTab: 'dashboard',
        selectedSession: '',
        selectedSemester: '',
        failedAttempts: 0,
        lockUntil: 0,
        cooldownTimer: null,
        inactivityTimer: null
      };
      var INACTIVITY_MS = 10 * 60 * 1000;
      var SEMESTERS = ['First', 'Second'];

      // 3. Routing (#/portal vs public website)
      function syncRoute() {
        var h = window.location.hash || '';
        var isPortal = h.indexOf('#/portal') === 0;
        if (isPortal) {
          document.body.classList.add('portal-active');
          window.scrollTo(0, 0);
          checkCrypto();
        } else {
          document.body.classList.remove('portal-active');
        }
      }
      window.addEventListener('hashchange', syncRoute);
      syncRoute();

      function checkCrypto() {
        var box = document.getElementById('portal-crypto-warning');
        if (!box) return true;
        if (!window.crypto || !window.crypto.subtle) {
          box.textContent = 'Secure portal login requires HTTPS on your institution website (window.crypto.subtle is unavailable in this preview context). Open this file from your https:// institution link.';
          box.style.display = 'block';
          return false;
        }
        box.style.display = 'none';
        return true;
      }

      // 4. Normalization & Crypto Decryption
      function normalizeMatric(m) {
        return String(m || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      }
      function normalizeCode(c) {
        return String(c || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      }
      function b64ToUint8(b64) {
        var bin = atob(b64);
        var u8 = new Uint8Array(bin.length);
        for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        return u8;
      }
      async function sha256Hex(str) {
        var digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(digest)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
      }

      async function fetchEncryptedRecord(lookupKey) {
        if (PORTAL.mode === 'sharded') {
          var prefix = lookupKey.slice(0, 2);
          if (!shardCache[prefix]) {
            var res = await fetch('data/' + prefix + '.json');
            if (!res.ok) return null;
            shardCache[prefix] = await res.json();
          }
          return shardCache[prefix][lookupKey] || null;
        }
        return PORTAL.students ? PORTAL.students[lookupKey] : null;
      }

      async function unlockStudent(rawMatric, rawCode) {
        if (!checkCrypto()) throw new Error('HTTPS_REQUIRED');
        var normM = normalizeMatric(rawMatric);
        var normC = normalizeCode(rawCode);
        if (!normM || !normC) throw new Error('INVALID_INPUT');

        var lookupKey = await sha256Hex(PORTAL.schoolSalt + ':' + normM);
        var rec = await fetchEncryptedRecord(lookupKey);
        if (!rec) throw new Error('INVALID_CREDENTIALS');

        var salt = b64ToUint8(rec.salt);
        var iv = b64ToUint8(rec.iv);
        var data = b64ToUint8(rec.data);

        var keyMat = await window.crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(normC),
          { name: 'PBKDF2' },
          false,
          ['deriveKey']
        );
        var aesKey = await window.crypto.subtle.deriveKey(
          { name: 'PBKDF2', salt: salt, iterations: 120000, hash: 'SHA-256' },
          keyMat,
          { name: 'AES-GCM', length: 256 },
          false,
          ['decrypt']
        );
        try {
          var plain = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, aesKey, data);
          return JSON.parse(new TextDecoder().decode(plain));
        } catch (err) {
          throw new Error('INVALID_CREDENTIALS');
        }
      }

      // 5. Inactivity Auto-Logout
      function resetInactivity() {
        if (state.inactivityTimer) clearTimeout(state.inactivityTimer);
        if (!state.student) return;
        state.inactivityTimer = setTimeout(function () { logout(true); }, INACTIVITY_MS);
      }
      ['click', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
        window.addEventListener(evt, function () { if (state.student) resetInactivity(); }, { passive: true });
      });

      function logout(dueToTimeout) {
        if (state.inactivityTimer) clearTimeout(state.inactivityTimer);
        state.student = null;
        state.selectedSession = '';
        state.selectedSemester = '';
        document.getElementById('portal-app-section').style.display = 'none';
        document.getElementById('portal-login-section').style.display = 'block';
        document.getElementById('login-matric').value = '';
        document.getElementById('login-code').value = '';
        document.getElementById('portal-inactivity-banner').style.display = dueToTimeout ? 'block' : 'none';
      }

      // 6. Exponential Retry Delay
      function startCooldown(btn) {
        state.failedAttempts += 1;
        var sec = Math.min(30, 1.5 * Math.pow(2, state.failedAttempts - 1));
        state.lockUntil = Date.now() + Math.round(sec * 1000);
        if (state.cooldownTimer) clearInterval(state.cooldownTimer);
        function tick() {
          var rem = state.lockUntil - Date.now();
          if (rem <= 0) {
            clearInterval(state.cooldownTimer);
            btn.disabled = false;
            btn.textContent = 'Open my results';
          } else {
            btn.disabled = true;
            btn.textContent = 'Wait ' + Math.ceil(rem / 1000) + 's before retrying...';
          }
        }
        tick();
        state.cooldownTimer = setInterval(tick, 250);
      }

      // 7. Login & Lost Code UI
      var visBtn = document.getElementById('toggle-code-vis');
      var codeEl = document.getElementById('login-code');
      if (visBtn && codeEl) {
        visBtn.addEventListener('click', function () {
          var isPwd = codeEl.type === 'password';
          codeEl.type = isPwd ? 'text' : 'password';
          visBtn.textContent = isPwd ? 'Hide' : 'Show';
        });
      }

      async function handleLogin(matric, code) {
        var errBox = document.getElementById('login-error-box');
        var btn = document.getElementById('login-submit-btn');
        document.getElementById('portal-inactivity-banner').style.display = 'none';
        errBox.style.display = 'none';
        if (Date.now() < state.lockUntil) return;

        btn.disabled = true;
        btn.textContent = 'Opening your results...';
        try {
          var student = await unlockStudent(matric, code);
          state.failedAttempts = 0;
          state.lockUntil = 0;
          btn.disabled = false;
          btn.textContent = 'Open my results';
          openStudentWorkspace(student);
        } catch (err) {
          var msg = "That matric number or code doesn't match. Check your slip, or message the ICT helpdesk.";
          if (err && err.message === 'HTTPS_REQUIRED') {
            msg = 'Please open this portal via https:// from the university website to unlock encrypted results.';
          } else if (err && err.message === 'INVALID_INPUT') {
            msg = 'Please enter both your Matric Number and Access Code.';
          }
          errBox.textContent = msg;
          errBox.style.display = 'block';
          if (err && err.message === 'INVALID_CREDENTIALS') {
            startCooldown(btn);
          } else {
            btn.disabled = false;
            btn.textContent = 'Open my results';
          }
        }
      }

      document.getElementById('portal-login-form').addEventListener('submit', function (e) {
        e.preventDefault();
        handleLogin(document.getElementById('login-matric').value, document.getElementById('login-code').value);
      });

      var demoBtn = document.getElementById('use-demo-btn');
      if (demoBtn && PORTAL.demoHint) {
        demoBtn.addEventListener('click', function () {
          document.getElementById('login-matric').value = PORTAL.demoHint.matricNumber;
          document.getElementById('login-code').value = PORTAL.demoHint.accessCode;
          handleLogin(PORTAL.demoHint.matricNumber, PORTAL.demoHint.accessCode);
        });
      }

      function syncLostCodeLinks() {
        var n = (document.getElementById('lost-name').value || '').trim();
        var m = (document.getElementById('lost-matric').value || '').trim();
        var d = (document.getElementById('lost-dept').value || '').trim();
        var msg = 'Hello, I lost my portal access code. Name: ' + (n || '...') + ' Matric number: ' + (m || '...') + ' Department: ' + (d || '...');
        var wa = document.getElementById('lost-wa-link');
        var em = document.getElementById('lost-email-link');
        if (wa) wa.href = 'https://wa.me/' + (PORTAL.helpWaNum || '2348000000000') + '?text=' + encodeURIComponent(msg);
        if (em) em.href = 'mailto:' + (PORTAL.helpEmail || 'ict@example.com') + '?subject=' + encodeURIComponent('Lost Portal Access Code Request') + '&body=' + encodeURIComponent(msg);
      }
      ['lost-name', 'lost-matric', 'lost-dept'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.addEventListener('input', syncLostCodeLinks);
      });
      syncLostCodeLinks();

      // 8. Authenticated Workspace Rendering
      function getLatestAvailable(student) {
        var chron = student.chronologicalSemesters || [];
        if (chron.length > 0) {
          var last = chron[chron.length - 1];
          return { session: last.session, semester: last.semester };
        }
        return { session: '', semester: '' };
      }

      function standingClass(standing) {
        if (standing === 'Good standing') return 'standing-good';
        if (standing === 'Referred to Senate') return 'standing-senate';
        return 'standing-probation';
      }

      function openStudentWorkspace(student) {
        state.student = student;
        var latest = getLatestAvailable(student);
        state.selectedSession = latest.session;
        state.selectedSemester = latest.semester;

        var parts = String(student.fullName || 'ST').trim().split(/\\s+/);
        var initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        document.getElementById('st-initials').textContent = initials;
        document.getElementById('st-name').textContent = student.fullName;
        document.getElementById('st-subline').textContent = student.matricNumber + ' • ' + student.faculty + ' • ' + student.department;
        document.getElementById('st-progline').textContent = student.programme + ' • ' + student.currentLevel + ' Level' + (student.entrySession ? ' • Entry ' + student.entrySession : '');

        var sum = student.latestSummary;
        var badge = document.getElementById('st-standing-badge');
        badge.textContent = sum ? sum.standing : 'Active Student';
        badge.className = 'standing-badge ' + standingClass(sum ? sum.standing : 'Good standing');

        document.getElementById('dash-gpa').textContent = sum ? sum.gpa.toFixed(2) : '—';
        document.getElementById('dash-latest-term').textContent = sum ? (sum.session + ' • ' + sum.semester + ' Semester') : 'No results yet';
        document.getElementById('dash-cgpa').textContent = sum ? sum.cgpa.toFixed(2) : '—';
        document.getElementById('dash-degree-class').textContent = sum ? sum.degreeClass : '—';
        document.getElementById('dash-units').textContent = sum ? (sum.unitsEarned + ' / ' + sum.requiredUnits) : ('0 / ' + (PORTAL.requiredUnits || 120));
        document.getElementById('dash-units-sub').textContent = sum ? ('CTNU ' + sum.ctnu + ' • CTCP ' + sum.ctcp.toFixed(2)) : 'No units recorded';

        renderDashboardFeeds();
        renderPickersAndResults();
        initTargetPlanner();

        document.getElementById('portal-login-section').style.display = 'none';
        document.getElementById('portal-app-section').style.display = 'block';
        switchTab('dashboard');
        resetInactivity();
      }

      function renderDashboardFeeds() {
        var dn = document.getElementById('dash-news');
        dn.innerHTML = '';
        (PORTAL.news || []).forEach(function (n) {
          var box = document.createElement('div');
          box.className = 'news-card';
          var d = document.createElement('span'); d.className = 'news-date'; d.textContent = n.date;
          var h = document.createElement('h4'); h.style.margin = '0'; h.textContent = n.title;
          var p = document.createElement('p'); p.textContent = n.text;
          box.appendChild(d); box.appendChild(h); box.appendChild(p);
          dn.appendChild(box);
        });
        var dc = document.getElementById('dash-calendar');
        dc.innerHTML = '';
        (PORTAL.calendar || []).forEach(function (c) {
          var row = document.createElement('div'); row.className = 'calendar-row';
          var left = document.createElement('div');
          var t = document.createElement('div'); t.className = 'cal-title'; t.textContent = c.title;
          left.appendChild(t);
          if (c.detail) {
            var det = document.createElement('div'); det.className = 'cal-detail'; det.textContent = c.detail;
            left.appendChild(det);
          }
          var dt = document.createElement('span'); dt.className = 'cal-date'; dt.textContent = c.date;
          row.appendChild(left); row.appendChild(dt);
          dc.appendChild(row);
        });
      }

      function switchTab(tab) {
        state.activeTab = tab;
        document.querySelectorAll('.portal-tab').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-tab') === tab);
        });
        document.querySelectorAll('.portal-panel').forEach(function (p) {
          p.classList.toggle('active', p.id === 'panel-' + tab);
        });
      }
      document.querySelectorAll('.portal-tab').forEach(function (b) {
        b.addEventListener('click', function () { switchTab(b.getAttribute('data-tab')); });
      });

      document.getElementById('qa-view-results').onclick = function () { switchTab('results'); };
      document.getElementById('qa-planner').onclick = function () { switchTab('planner'); };
      document.getElementById('qa-contact').onclick = function () { switchTab('contact'); };
      document.getElementById('qa-print-stmt').onclick = function () {
        switchTab('results');
        triggerPrint('semester');
      };
      document.getElementById('portal-logout-btn').onclick = function () { logout(false); };

      // 9. Pickers & Results View
      function renderPickersAndResults() {
        var student = state.student;
        if (!student) return;
        var sessions = (student.sessions || []).slice().sort();
        var sessWrap = document.getElementById('session-picker-wrap');
        sessWrap.innerHTML = '';

        function selectSession(sess) {
          state.selectedSession = sess;
          var semsMap = (student.semestersBySession && student.semestersBySession[sess]) || {};
          state.selectedSemester = semsMap.Second ? 'Second' : (semsMap.First ? 'First' : '');
          renderPickersAndResults();
        }

        if (sessions.length <= 4) {
          var grp = document.createElement('div');
          grp.className = 'segmented-group';
          sessions.forEach(function (s) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'seg-btn' + (s === state.selectedSession ? ' active' : '');
            btn.textContent = s;
            btn.onclick = function () { selectSession(s); };
            grp.appendChild(btn);
          });
          sessWrap.appendChild(grp);
        } else {
          var sel = document.createElement('select');
          sel.className = 'seg-btn';
          sel.style.width = '100%';
          sessions.forEach(function (s) {
            var opt = document.createElement('option');
            opt.value = s; opt.textContent = s;
            if (s === state.selectedSession) opt.selected = true;
            sel.appendChild(opt);
          });
          sel.onchange = function () { selectSession(sel.value); };
          sessWrap.appendChild(sel);
        }

        // Semester Picker (First Semester / Second Semester)
        var semWrap = document.getElementById('semester-picker-wrap');
        semWrap.innerHTML = '';
        var semsMap = (student.semestersBySession && student.semestersBySession[state.selectedSession]) || {};
        SEMESTERS.forEach(function (semName) {
          var hasData = Boolean(semsMap[semName]);
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'seg-btn' + (semName === state.selectedSemester && hasData ? ' active' : '');
          btn.disabled = !hasData;
          btn.setAttribute('data-semester', semName);

          var lbl = document.createElement('span');
          lbl.textContent = semName + ' Semester';
          btn.appendChild(lbl);
          if (!hasData) {
            var sub = document.createElement('span');
            sub.className = 'seg-sub';
            sub.textContent = 'No results yet';
            btn.appendChild(sub);
          }
          btn.onclick = function () {
            if (!hasData) return;
            state.selectedSemester = semName;
            renderPickersAndResults();
          };
          semWrap.appendChild(btn);
        });

        var report = semsMap[state.selectedSemester] || null;
        renderSemesterTable(student, report);
        renderCarryovers(student);
        renderProgressChart(student);
        renderFullPrintRecord(student);
      }

      function renderSemesterTable(student, rep) {
        document.getElementById('print-sem-bio').textContent = student.fullName + ' (' + student.matricNumber + ')';
        var tbody = document.getElementById('res-courses-tbody');
        tbody.innerHTML = '';
        if (!rep) {
          document.getElementById('res-heading').textContent = 'No results available';
          return;
        }
        document.getElementById('res-heading').textContent = rep.session + ' — ' + rep.semester + ' Semester Results';
        document.getElementById('res-subheading').textContent = student.programme + ' • ' + rep.level + ' Level';

        var pill = document.getElementById('res-standing-pill');
        pill.textContent = rep.standing;
        pill.className = 'standing-badge ' + standingClass(rep.standing);

        rep.courses.forEach(function (c) {
          var tr = document.createElement('tr');
          function cell(txt, cls) {
            var td = document.createElement('td');
            if (cls) td.className = cls;
            td.textContent = txt;
            return td;
          }
          var tdCode = document.createElement('td');
          tdCode.style.fontWeight = '700';
          tdCode.textContent = c.courseCode;
          if (c.isCarryover) {
            var tag = document.createElement('span');
            tag.className = 'carryover-tag';
            tag.textContent = 'Carryover';
            tdCode.appendChild(tag);
          } else if (c.isRepeat) {
            var rTag = document.createElement('span');
            rTag.className = 'repeat-tag';
            rTag.textContent = 'Repeated';
            tdCode.appendChild(rTag);
          }

          tr.appendChild(tdCode);
          tr.appendChild(cell(c.courseTitle));
          tr.appendChild(cell(String(c.units), 'num'));
          tr.appendChild(cell(c.ca === null ? '—' : String(c.ca), 'num'));
          tr.appendChild(cell(c.exam === null ? '—' : String(c.exam), 'num'));
          tr.appendChild(cell(String(c.total), 'num'));
          tr.appendChild(cell(c.grade));
          tr.appendChild(cell(c.gradePoint.toFixed(2), 'num'));
          tbody.appendChild(tr);
        });

        document.getElementById('sum-tnu').textContent = String(rep.tnu);
        document.getElementById('sum-tcp').textContent = rep.tcp.toFixed(2);
        document.getElementById('sum-gpa').textContent = rep.gpa.toFixed(2);
        document.getElementById('sum-level').textContent = rep.level + ' Level';
        document.getElementById('sum-ctnu').textContent = String(rep.ctnu);
        document.getElementById('sum-ctcp').textContent = rep.ctcp.toFixed(2);
        document.getElementById('sum-cgpa').textContent = rep.cgpa.toFixed(2);
        document.getElementById('sum-class').textContent = rep.degreeClass;
      }

      function renderCarryovers(student) {
        var box = document.getElementById('carryovers-box');
        var list = document.getElementById('carryovers-list');
        var items = student.unresolvedCarryovers || [];
        if (items.length === 0) {
          box.style.display = 'none';
          return;
        }
        box.style.display = 'block';
        list.innerHTML = '';
        items.forEach(function (co) {
          var li = document.createElement('li');
          li.textContent = co.courseCode + ' — ' + co.courseTitle + ' (' + co.units + ' units) • Failed in ' + co.failedSession + ' ' + co.failedSemester + ' Semester (Score: ' + co.score + ')';
          list.appendChild(li);
        });
      }

      function renderProgressChart(student) {
        var wrap = document.getElementById('progress-bars');
        wrap.innerHTML = '';
        var maxGp = PORTAL.maxGradePoint || 5;
        (student.chronologicalSemesters || []).forEach(function (s) {
          var row = document.createElement('div');
          row.className = 'bar-row';
          var lbl = document.createElement('span');
          lbl.textContent = s.session + ' ' + (s.semester === 'First' ? '1st' : '2nd');
          var track = document.createElement('div');
          track.className = 'bar-track';
          var fill = document.createElement('div');
          fill.className = 'bar-fill';
          fill.style.width = Math.max(4, Math.min(100, (s.gpa / maxGp) * 100)) + '%';
          track.appendChild(fill);
          var val = document.createElement('span');
          val.className = 'bar-val';
          val.textContent = 'GPA ' + s.gpa.toFixed(2) + ' | CGPA ' + s.cgpa.toFixed(2);
          row.appendChild(lbl); row.appendChild(track); row.appendChild(val);
          wrap.appendChild(row);
        });
      }

      function renderFullPrintRecord(student) {
        var container = document.getElementById('print-full-container');
        container.innerHTML = '';
        var hdr = document.createElement('div');
        hdr.className = 'print-only-header';
        hdr.innerHTML = '<div><strong style="font-size:15pt;">' + (PORTAL.instName || '') + '</strong><div style="font-size:9pt;">Full Academic Record Statement</div></div><div style="text-align:right;font-size:9pt;"><strong>' + student.fullName + '</strong><div>' + student.matricNumber + ' &bull; ' + student.programme + '</div></div>';
        container.appendChild(hdr);

        (student.chronologicalSemesters || []).forEach(function (ch) {
          var rep = student.semestersBySession[ch.session][ch.semester];
          if (!rep) return;
          var sec = document.createElement('div');
          sec.style.marginBottom = '14px';
          sec.style.pageBreakInside = 'avoid';
          var title = document.createElement('h4');
          title.style.margin = '0 0 6px';
          title.textContent = rep.session + ' — ' + rep.semester + ' Semester (' + rep.level + ' Level) | GPA: ' + rep.gpa.toFixed(2) + ' | CGPA: ' + rep.cgpa.toFixed(2);
          sec.appendChild(title);
          var tbl = document.createElement('table');
          tbl.className = 'scores-table';
          tbl.innerHTML = '<thead><tr><th>Code</th><th>Course</th><th class="num">Units</th><th class="num">Total</th><th>Grade</th><th class="num">GP</th></tr></thead>';
          var tb = document.createElement('tbody');
          rep.courses.forEach(function (c) {
            var r = document.createElement('tr');
            r.innerHTML = '<td>' + c.courseCode + '</td><td>' + c.courseTitle + '</td><td class="num">' + c.units + '</td><td class="num">' + c.total + '</td><td>' + c.grade + '</td><td class="num">' + c.gradePoint.toFixed(2) + '</td>';
            tb.appendChild(r);
          });
          tbl.appendChild(tb);
          sec.appendChild(tbl);
          container.appendChild(sec);
        });
        var note = document.createElement('div');
        note.style.marginTop = '10px';
        note.style.fontSize = '0.85rem';
        note.textContent = 'Official transcripts are issued by the Registry.';
        container.appendChild(note);
      }

      function triggerPrint(mode) {
        if (mode === 'full') {
          document.body.classList.add('print-mode-full');
        } else {
          document.body.classList.remove('print-mode-full');
        }
        window.print();
      }
      document.getElementById('print-sem-btn').onclick = function () { triggerPrint('semester'); };
      document.getElementById('print-full-btn').onclick = function () { triggerPrint('full'); };

      // 10. Target Planner
      function initTargetPlanner() {
        var sel = document.getElementById('planner-target-select');
        var out = document.getElementById('planner-result-box');
        sel.innerHTML = '';
        var bands = PORTAL.degreeBands || [];
        bands.forEach(function (b, idx) {
          var opt = document.createElement('option');
          opt.value = String(b.min);
          opt.textContent = b.label + ' (' + b.min.toFixed(2) + ' – ' + b.max.toFixed(2) + ')';
          if (idx === 0) opt.selected = true;
          sel.appendChild(opt);
        });

        function recompute() {
          var student = state.student;
          if (!student || !student.latestSummary) {
            out.textContent = 'No completed units available yet to calculate a target.';
            return;
          }
          var s = student.latestSummary;
          var targetMin = Number(sel.value) || 4.5;
          var remaining = Math.max(0, s.requiredUnits - s.unitsEarned);
          var maxGp = PORTAL.maxGradePoint || 5;

          if (remaining === 0) {
            out.textContent = s.cgpa >= targetMin
              ? 'Estimate: All required units (' + s.requiredUnits + ') are complete and your CGPA (' + s.cgpa.toFixed(2) + ') meets this target.'
              : 'Estimate: All required units are complete; reaching ' + targetMin.toFixed(2) + ' is not possible.';
            return;
          }
          var totalAtGrad = s.ctnu + remaining;
          var needed = Math.round((((targetMin * totalAtGrad) - s.ctcp) / remaining) * 100) / 100;
          if (needed <= 0) {
            out.textContent = 'Estimate: Your current cumulative credit points already keep you on track across the remaining ' + remaining + ' units.';
          } else if (needed > maxGp) {
            out.textContent = 'Not mathematically possible: reaching ' + targetMin.toFixed(2) + ' requires an average GPA of ' + needed.toFixed(2) + ' across ' + remaining + ' remaining units, which exceeds the ' + maxGp.toFixed(2) + ' maximum.';
          } else {
            out.textContent = 'Estimate: You need an average GPA of ' + needed.toFixed(2) + ' across your remaining ' + remaining + ' units to graduate with ' + targetMin.toFixed(2) + ' CGPA.';
          }
        }
        sel.onchange = recompute;
        recompute();
      }
    })();
  </script>
</body>
</html>
`;
}
