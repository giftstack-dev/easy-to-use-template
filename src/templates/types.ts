/**
 * Frontdoor HTML Templates - Template Configuration & Types
 * ========================================================
 * Defines the configuration schema for all templates in the collection,
 * with additive extensions for the Graduate portfolio template.
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
