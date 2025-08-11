import { db } from './firebase';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from 'firebase/firestore';
import { Resume, CoverLetter } from '../types/resume';

// Recursively remove undefined values (Firestore does not allow undefined)
const cleanForFirestore = (value: any): any => {
  if (value === undefined) return undefined; // signal to caller to omit
  if (value === null) return null;
  if (value instanceof Date) return value; // Dates are fine; SDK converts to Timestamp
  if (Array.isArray(value)) {
    const cleanedArray = value
      .map((item) => cleanForFirestore(item))
      .filter((item) => item !== undefined);
    return cleanedArray;
  }
  if (typeof value === 'object') {
    const result: Record<string, any> = {};
    Object.keys(value).forEach((key) => {
      const cleaned = cleanForFirestore(value[key]);
      if (cleaned !== undefined) {
        result[key] = cleaned;
      }
    });
    return result;
  }
  return value;
};

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

const isNonEmpty = (v?: string) => typeof v === 'string' && v.trim().length > 0;
const isValidUrl = (v?: string) => {
  if (!v) return false;
  try {
    const u = new URL(v.startsWith('http') ? v : `https://${v}`);
    return !!u.host;
  } catch {
    return false;
  }
};

export const validateResume = (resume: Resume): ValidationResult => {
  const errors: Record<string, string> = {};

  // Allow AI resumes to skip structural validation; they store full HTML.
  if (resume.kind === 'ai') {
    if (!isNonEmpty(resume.title)) errors['title'] = 'Title is required';
    if (!isNonEmpty(resume.aiHtml)) errors['aiHtml'] = 'AI HTML is required';
    return { valid: Object.keys(errors).length === 0, errors };
  }

  // Required top-level fields
  if (!isNonEmpty(resume.title)) errors['title'] = 'Title is required';
  if (!isNonEmpty(resume.fullName)) errors['fullName'] = 'Full name is required';
  if (!isNonEmpty(resume.email)) errors['email'] = 'Email is required';
  // Phone requirement: either phones[0].number or legacy phone
  if (Array.isArray((resume as any).phones) && (resume as any).phones.length > 0) {
    const first = (resume as any).phones[0];
    if (!isNonEmpty(first?.number)) errors['phones.0.number'] = 'Phone number is required';
  } else if (!isNonEmpty((resume as any).phone)) {
    errors['phone'] = 'Phone is required';
  }

  // Experience: if provided, each item must have required fields
  if (Array.isArray(resume.experience)) {
    resume.experience.forEach((e, idx) => {
      if (!isNonEmpty(e.jobTitle)) errors[`experience.${idx}.jobTitle`] = 'Job title is required';
      if (!isNonEmpty(e.company)) errors[`experience.${idx}.company`] = 'Company is required';
      if (!isNonEmpty(e.startDate)) errors[`experience.${idx}.startDate`] = 'Start date is required';
    });
  }

  // Education: if provided, each item must have required fields
  if (Array.isArray(resume.education)) {
    resume.education.forEach((e, idx) => {
      if (!isNonEmpty(e.institution)) errors[`education.${idx}.institution`] = 'Institution is required';
      if (!isNonEmpty(e.startDate)) errors[`education.${idx}.startDate`] = 'Start date is required';
    });
  }

  // Flexible links validation
  if (Array.isArray(resume.links)) {
    resume.links.forEach((l, idx) => {
      if (!isNonEmpty(l.label)) errors[`links.${idx}.label`] = 'Platform/Domain label is required';
      if (!isNonEmpty(l.url) || !isValidUrl(l.url)) errors[`links.${idx}.url`] = 'Valid URL is required';
    });
  }

  // Phones validation (if provided)
  if (Array.isArray((resume as any).phones)) {
    (resume as any).phones.forEach((p: any, idx: number) => {
      if (!isNonEmpty(p?.number)) errors[`phones.${idx}.number`] = 'Phone number is required';
    });
  }

  return { valid: Object.keys(errors).length === 0, errors };
};

export const saveResume = async (resume: Resume): Promise<Resume> => {
  const id = resume.id && resume.id.trim().length > 0 ? resume.id : doc(collection(db, 'resumes')).id;
  const toSave: Resume = { ...resume, id };
  const cleaned = cleanForFirestore(toSave);
  await setDoc(doc(db, 'resumes', id), cleaned);
  return cleaned as Resume;
};

export const getResumeById = async (resumeId: string): Promise<Resume> => {
  const docRef = doc(db, 'resumes', resumeId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error('Resume not found');
  }

  const data = docSnap.data();
  const toJsDate = (v: any): Date => {
    try {
      if (v && typeof v.toDate === 'function') return v.toDate();
      if (typeof v === 'string' || typeof v === 'number') return new Date(v);
    } catch {}
    return new Date();
  };
  return {
    id: docSnap.id,
    userId: data.userId,
    title: data.title,
    kind: data.kind,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    website: data.website,
    linkedIn: data.linkedIn,
    github: data.github,
    summary: data.summary,
    template: data.template,
    temp: data.temp,
    experience: (data.experience || []).map((exp: any) => ({
      id: exp.id,
      jobTitle: exp.jobTitle,
      company: exp.company,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
    })),
    education: (data.education || []).map((edu: any) => ({
      id: edu.id,
      institution: edu.institution,
      degree: edu.degree,
      fieldOfStudy: edu.fieldOfStudy,
      startDate: edu.startDate,
      endDate: edu.endDate,
      current: edu.current,
      description: edu.description,
    })),
    skills: (data.skills || []).map((skill: any) => ({
      id: skill.id,
      name: skill.name,
      proficiency: skill.proficiency,
      category: skill.category,
    })),
    links: data.links,
    phones: data.phones,
    aiHtml: data.aiHtml,
    aiPrompt: data.aiPrompt,
    aiModel: data.aiModel,
    aiTemplateName: data.aiTemplateName,
    createdAt: toJsDate(data.createdAt),
    updatedAt: toJsDate(data.updatedAt),
  };
};

export const getResumes = async (userId: string): Promise<Resume[]> => {
  const q = query(collection(db, 'resumes'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    const toJsDate = (v: any): Date => {
      try {
        if (v && typeof v.toDate === 'function') return v.toDate();
        if (typeof v === 'string' || typeof v === 'number') return new Date(v);
      } catch {}
      return new Date();
    };
    return {
      id: doc.id,
      userId: data.userId,
      title: data.title,
      kind: data.kind,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      website: data.website,
      linkedIn: data.linkedIn,
      github: data.github,
      summary: data.summary,
      template: data.template,
      temp: data.temp,
      experience: data.experience || [],
      education: data.education || [],
      skills: data.skills || [],
      links: data.links,
      phones: data.phones,
      aiHtml: data.aiHtml,
      aiPrompt: data.aiPrompt,
      aiModel: data.aiModel,
      aiTemplateName: data.aiTemplateName,
      createdAt: toJsDate(data.createdAt),
      updatedAt: toJsDate(data.updatedAt),
    };
  });
};

export const deleteResume = async (resumeId: string) => {
  await deleteDoc(doc(db, 'resumes', resumeId));
};

export const saveCoverLetter = async (coverLetter: CoverLetter): Promise<CoverLetter> => {
  await setDoc(doc(db, 'coverLetters', coverLetter.id), coverLetter);
  return coverLetter;
};

export const getCoverLetter = async (resumeId: string): Promise<CoverLetter> => {
  const q = query(collection(db, 'coverLetters'), where('resumeId', '==', resumeId));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    throw new Error('Cover letter not found');
  }

  const doc = querySnapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    resumeId: data.resumeId,
    content: data.content,
    company: data.company,
    position: data.position,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
};
