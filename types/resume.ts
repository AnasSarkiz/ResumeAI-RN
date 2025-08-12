export type ResumeSection = 'experience' | 'education' | 'skills' | 'summary';

export interface Experience {
  id: string;
  jobTitle: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category?: string;
}

export interface LinkItem {
  id: string;
  label: string; // e.g., LinkedIn, GitHub, Portfolio, ResearchGate
  url: string;
}

export interface PhoneItem {
  id: string;
  dial: string; // e.g., +1
  number: string; // local/national number part
  countryCode?: string; // e.g., US
  label?: string; // e.g., Mobile, Work
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  // Discriminator for storage/rendering strategy. Defaults to 'manual' if missing
  kind?: 'manual' | 'ai';
  fullName: string;
  email: string;
  phone?: string; // legacy single phone, kept for backward compat
  // New optional personal details
  dateOfBirth?: string; // ISO date or free-text (e.g., 1995-07-30)
  country?: string; // e.g., Germany
  website?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  links?: LinkItem[];
  phones?: PhoneItem[];
  // Selected HTML template ID for rendering/printing (free plan templates)
  template?: string;
  // Flag: using a pre-built template from the app (free plan)
  temp?: boolean;
  // When kind === 'ai', the full HTML for the resume is stored here.
  // Manual resumes should leave this undefined.
  aiHtml?: string;
  // Optional AI generation metadata for audit/debug.
  aiPrompt?: string;
  aiModel?: string; // e.g., gemini-2.0-flash-lite
  aiTemplateName?: string; // human-friendly template label if AI picked a style
  createdAt: Date;
  updatedAt: Date;
}

export interface CoverLetter {
  id: string;
  resumeId: string;
  content: string;
  company?: string;
  position?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type AIAction =
  | 'generate-bullet-points'
  | 'reword-text'
  | 'draft-cover-letter'
  | 'tailor-resume'
  | 'improve-summary';

export interface AIResponse {
  id: string;
  action: AIAction;
  input: string;
  output: string;
  createdAt: Date;
}
