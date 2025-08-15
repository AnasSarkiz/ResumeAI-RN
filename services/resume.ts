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
import { ManualResumeInput, SavedResume, AIResumeInput } from '../types/resume';

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

export const validateManualResume = (resume: ManualResumeInput): ValidationResult => {
  const errors: Record<string, string> = {};

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
      if (!isNonEmpty(e.startDate))
        errors[`experience.${idx}.startDate`] = 'Start date is required';
    });
  }

  // Education: if provided, each item must have required fields
  if (Array.isArray(resume.education)) {
    resume.education.forEach((e, idx) => {
      if (!isNonEmpty(e.institution))
        errors[`education.${idx}.institution`] = 'Institution is required';
      if (!isNonEmpty(e.startDate)) errors[`education.${idx}.startDate`] = 'Start date is required';
    });
  }

  // Flexible links validation
  if (Array.isArray(resume.links)) {
    resume.links.forEach((l, idx) => {
      if (!isNonEmpty(l.label)) errors[`links.${idx}.label`] = 'Platform/Domain label is required';
      if (!isNonEmpty(l.url) || !isValidUrl(l.url))
        errors[`links.${idx}.url`] = 'Valid URL is required';
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

export const validateAIResume = (resume: AIResumeInput): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!isNonEmpty(resume.fullName)) errors['fullName'] = 'Full name is required';
  if (!isNonEmpty(resume.email)) errors['email'] = 'Email is required';
  if (!isNonEmpty(resume.countryCode)) errors['countryCode'] = 'Country code is required';
  if (!isNonEmpty(resume.phone)) errors['phone'] = 'Phone is required';
  if (!isNonEmpty(resume.aiPrompt)) errors['aiPrompt'] = 'AI Prompt is required';
  if (!isNonEmpty(resume.aiModel)) errors['aiModel'] = 'AI Model is required';
  return { valid: Object.keys(errors).length === 0, errors };
};

export const saveResume = async (resume: SavedResume): Promise<SavedResume> => {
  const id =
    resume.id && resume.id.trim().length > 0 ? resume.id : doc(collection(db, 'resumes')).id;
  const toSave: SavedResume = { ...resume, id };
  const cleaned = cleanForFirestore(toSave);
  await setDoc(doc(db, 'resumes', id), cleaned);
  return cleaned as SavedResume;
};

export const getResumeById = async (resumeId: string): Promise<SavedResume> => {
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
    title: data.title || '',
    html: data.html,
    createdAt: toJsDate(data.createdAt),
    updatedAt: toJsDate(data.updatedAt),
  };
};

export const getResumes = async (userId: string): Promise<SavedResume[]> => {
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
      title: data.title || '',
      html: data.html,
      createdAt: toJsDate(data.createdAt),
      updatedAt: toJsDate(data.updatedAt),
    };
  });
};

export const deleteResume = async (resumeId: string) => {
  await deleteDoc(doc(db, 'resumes', resumeId));
};
