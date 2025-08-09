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

export interface Resume {
  id: string;
  userId: string;
  title: string;
  fullName: string;
  email: string;
  phone?: string;
  website?: string;
  linkedIn?: string;
  github?: string;
  summary?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
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
