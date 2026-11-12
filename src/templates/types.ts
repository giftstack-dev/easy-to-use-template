/**
 * Frontdoor HTML Templates - Template Configuration & Types
 * ========================================================
 * Defines the configuration schema for all templates in the collection,
 * with additive extensions for Graduate and University Portal (Varsity) templates.
 */

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface ProjectItem {
  title: string;
  description: string;
  tags: string[];
  repoUrl: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface ExperienceEntry {
  role: string;
  organization: string;
  period: string;
  points: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
  note?: string;
}

export interface NewsItem {
  date: string;
  title: string;
  text: string;
}

export interface CalendarItem {
  date: string;
  title: string;
  detail?: string;
}

export interface ContactOffice {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours?: string;
}

export interface DepartmentInfo {
  name: string;
  programmes: string[];
}

export interface FacultyInfo {
  name: string;
  departments: DepartmentInfo[];
}

export interface UniversityGradeBand {
  grade: string;
  min: number;
  max: number;
  point: number;
  remark: string;
}

export interface DegreeClassBand {
  label: string;
  min: number;
  max: number;
}

export interface AcademicStandingRules {
  goodStandingMin: number;
  senateThreshold: number;
}

export type GradingPresetId = '5-point' | '4-point';
export type RepeatPolicy = 'latest_replaces' | 'count_all';

export interface EncryptedStudentRecord {
  salt: string;
  iv: string;
  data: string;
}

export interface PortalDataBundle {
  mode: 'single' | 'sharded';
  schoolSalt: string;
  sessions: string[];
  students: Record<string, EncryptedStudentRecord>;
  shards?: Record<string, Record<string, EncryptedStudentRecord>>;
  stats: {
    students: number;
    faculties: number;
    departments: number;
    sessions: number;
    rows: number;
  };
  generatedAt: string;
  isDemo?: boolean;
}

export interface GalleryPhotoSlot {
  url: string;
  label: string;
  seed?: string;
}

export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  businessType: string;

  // Base business / personal details
  businessName: string;
  headline?: string;
  shortBio?: string;
  phone: string;
  whatsapp: string;
  email: string;
  city?: string;
  location?: string;

  // Color palette
  primaryColor: string;
  accentColor: string;
  accentSoftColor?: string;
  backgroundColor: string;
  surfaceColor: string;
  borderColor: string;
  textColor: string;
  textSecondaryColor?: string;
  successColor?: string;
  warningColor?: string;
  dangerColor?: string;

  // Social & external links
  github?: string;
  linkedin?: string;
  cvUrl?: string;

  // Profile details (Graduate & Developer)
  school?: string;
  degree?: string;
  classOfDegree?: string;
  availability?: string;

  // Dynamic portfolio collections
  skillGroups?: SkillGroup[];
  projects?: ProjectItem[];
  experience?: ExperienceEntry[];
  education?: EducationEntry[];
  certifications?: string[];

  // University Portal (Varsity) optional fields (additive only)
  motto?: string;
  established?: string;
  address?: string;
  openingHours?: string;
  aboutText?: string;
  logoUrl?: string;
  institutionWebsite?: string;
  helpdesk?: ContactOffice;
  registry?: ContactOffice;
  bursary?: ContactOffice;
  faculties?: FacultyInfo[];
  news?: NewsItem[];
  calendar?: CalendarItem[];
  admissionsSteps?: string[];
  galleryImages?: GalleryPhotoSlot[];
  gradingPreset?: GradingPresetId;
  caMax?: number;
  examMax?: number;
  passMark?: number;
  gradeBands?: UniversityGradeBand[];
  degreeBands?: DegreeClassBand[];
  standingRules?: AcademicStandingRules;
  repeatPolicy?: RepeatPolicy;
  requiredUnits?: number;
  portalData?: PortalDataBundle;

  // SEO & Metadata
  seoTitle?: string;
  seoDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  category: string;
  businessType: string;
  file: string;
  createdAt: string;
  featureTags: string[];
  description: string;
  demoBrand: string;
}
