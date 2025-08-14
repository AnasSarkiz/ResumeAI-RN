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

// NEW: Unified persisted resume entity. Stores final HTML. Metadata is embedded inside the HTML
// (for example within a <script type="application/json" id="resume-metadata">{...}</script> block).
export interface SavedResume {
  id: string;
  userId: string;
  title: string;
  html: string; // Final rendered HTML
  createdAt: Date;
  updatedAt: Date;
}

// LEGACY: Kept for backward compatibility with existing UI flows and DB entries.
// The app will continue to use this shape in form editors, but persistence will
// store HTML in SavedResume format and mirror minimal legacy fields for compatibility.
export interface ManualResumeInput {
  id: string;
  userId: string;
  title: string;
  // Discriminator for storage/rendering strategy. Defaults to 'manual' if missing
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
  temp?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Deprecated in the new storage model, but kept for backward compatibility.
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

// NEW: Input types for generation flows
export interface AIResumeInput {
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  dateOfBirth?: string;
  country?: string;
  summary?: string;
  jobTitle?: string;
  experience: string[];
  education: string[];
  skills: string[];
  targetRole?: string;
  industry?: string;
  designInstructions?: string;
  links?: { label: string; url: string }[];
  aiPrompt?: string;
  aiModel?: string; // e.g., gemini-2.0-flash-lite
}

