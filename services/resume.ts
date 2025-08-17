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
  onSnapshot,
  updateDoc,
  serverTimestamp,
  orderBy,
  limit as fbLimit,
  startAfter,
} from 'firebase/firestore';
import { ManualResumeInput, SavedResume, AIResumeInput } from '../types/resume';

// Shared error map type and helpers
export type ErrorMap = Record<string, string>;
export const getError = (errors: ErrorMap, path: string): string | undefined => errors[path];

// Centralized required fields per flow/step
export const RequiredConfig = {
  manual: {
    step0: new Set(['title', 'fullName', 'email']),
    experienceItem: new Set(['jobTitle', 'company', 'startDate']),
    educationItem: new Set(['institution', 'startDate']),
    skillsItem: new Set(['name']),
  },
  ai: {
    step0: new Set(['fullName', 'email']),
  },
} as const;

export const isManualRequired = (field: string, step: number): boolean => {
  if (step === 0) return RequiredConfig.manual.step0.has(field);
  return false;
};

export const isAIRequired = (field: string, step: number): boolean => {
  if (step === 0) return RequiredConfig.ai.step0.has(field);
  return false;
};

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
    const u = new URL(v);
    return !!u.host;
  } catch {
    return false;
  }
};

// Reusable link-row validator: returns an ErrorMap for a single row
export const validateLinkRow = (label?: string, url?: string, keyPrefix = ''): ErrorMap => {
  const errs: ErrorMap = {};
  const hasAny = isNonEmpty(label) || isNonEmpty(url);
  if (!hasAny) return errs;
  if (!isNonEmpty(label)) errs[`${keyPrefix}label`] = 'Platform/Domain label is required';
  if (!isNonEmpty(url) || !isValidUrl(url!)) errs[`${keyPrefix}url`] = 'Valid URL is required';
  return errs;
};

export const validateManualResume = (resume: ManualResumeInput): ValidationResult => {
  const errors: Record<string, string> = {};

  // Required top-level fields
  if (!isNonEmpty(resume.title)) errors['title'] = 'Title is required';
  if (!isNonEmpty(resume.fullName)) errors['fullName'] = 'Full name is required';
  if (!isNonEmpty(resume.email)) errors['email'] = 'Email is required';

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

  // Flexible links validation using util
  if (Array.isArray(resume.links)) {
    resume.links.forEach((l, idx) => {
      const rowErrors = validateLinkRow(l.label, l.url, `links.${idx}.`);
      Object.assign(errors, rowErrors);
    });
  }

  // Phones optional in full validation; if provided and filled, no strict requirement here

  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateAIResume = (resume: AIResumeInput): ValidationResult => {
  const errors: Record<string, string> = {};
  if (!isNonEmpty(resume.fullName)) errors['fullName'] = 'Full name is required';
  if (!isNonEmpty(resume.email)) errors['email'] = 'Email is required';
  return { valid: Object.keys(errors).length === 0, errors };
};

// Per-step validators to gate step navigation in UI
// Manual steps order in UI: ['Info', 'Links', 'Summary', 'Experience', 'Education', 'Skills']
export const validateManualResumeStep = (
  resume: ManualResumeInput,
  step: number
): ValidationResult => {
  const errors: Record<string, string> = {};
  switch (step) {
    case 0: // Info (minimal requirements)
      if (!isNonEmpty(resume.title)) errors['title'] = 'Title is required';
      if (!isNonEmpty(resume.fullName)) errors['fullName'] = 'Full name is required';
      if (!isNonEmpty(resume.email)) errors['email'] = 'Email is required';
      break;
    case 3: // Experience
      if (Array.isArray(resume.experience)) {
        resume.experience.forEach((e, idx) => {
          if (!isNonEmpty(e.jobTitle))
            errors[`experience.${idx}.jobTitle`] = 'Job title is required';
          if (!isNonEmpty(e.company)) errors[`experience.${idx}.company`] = 'Company is required';
          if (!isNonEmpty(e.startDate))
            errors[`experience.${idx}.startDate`] = 'Start date is required';
        });
      }
      break;
    case 4: // Education
      if (Array.isArray(resume.education)) {
        resume.education.forEach((e, idx) => {
          if (!isNonEmpty(e.institution))
            errors[`education.${idx}.institution`] = 'Institution is required';
          if (!isNonEmpty(e.startDate))
            errors[`education.${idx}.startDate`] = 'Start date is required';
        });
      }
      break;
    case 5: // Skills
      if (Array.isArray(resume.skills)) {
        resume.skills.forEach((s, idx) => {
          if (!isNonEmpty(s.name)) errors[`skills.${idx}.name`] = 'Skill name is required';
        });
      }
      break;
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

// AI steps order in UI: ['Info', 'Summary', 'Education', 'Experience', 'Skills', 'Design']
export const validateAIResumeStep = (resume: AIResumeInput, step: number): ValidationResult => {
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (!isNonEmpty(resume.fullName)) errors['fullName'] = 'Full name is required';
    if (!isNonEmpty(resume.email)) errors['email'] = 'Email is required';
  }
  return { valid: Object.keys(errors).length === 0, errors };
};

export const saveResume = async (resume: SavedResume): Promise<SavedResume> => {
  const id =
    resume.id && resume.id.trim().length > 0 ? resume.id : doc(collection(db, 'resumes')).id;
  const toSave: SavedResume = {
    ...resume,
    id,
    // stamp times; Firestore will set actual server time
    createdAt: (resume as any).createdAt || (serverTimestamp() as any),
    updatedAt: serverTimestamp() as any,
  } as any;
  const cleaned = cleanForFirestore(toSave);
  // merge so that we don't overwrite fields unintentionally
  await setDoc(doc(db, 'resumes', id), cleaned, { merge: true });
  return { ...(toSave as any) } as SavedResume;
};

// Prefer partial updates for small edits to avoid rewriting the whole doc
export const updateResumeFields = async (
  resumeId: string,
  updates: Partial<SavedResume>
): Promise<void> => {
  const toUpdate: any = cleanForFirestore({ ...updates, updatedAt: serverTimestamp() as any });
  await updateDoc(doc(db, 'resumes', resumeId), toUpdate);
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
  const q = query(
    collection(db, 'resumes'),
    where('userId', '==', userId),
    // keep list stable and allow incremental sync by updatedAt
    orderBy('updatedAt', 'desc')
  );
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

// Paged list to reduce reads for large lists
export const getResumesPage = async (
  userId: string,
  pageSize: number,
  cursorUpdatedAt?: Date
): Promise<{ items: SavedResume[]; nextCursor?: Date }> => {
  let q = query(
    collection(db, 'resumes'),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc'),
    fbLimit(pageSize)
  );
  if (cursorUpdatedAt) {
    q = query(
      collection(db, 'resumes'),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc'),
      startAfter(cursorUpdatedAt as any),
      fbLimit(pageSize)
    );
  }
  const snap = await getDocs(q);
  const items = snap.docs.map((docSnap) => {
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
    } as SavedResume;
  });
  const last = items[items.length - 1];
  return { items, nextCursor: last?.updatedAt };
};

export const deleteResume = async (resumeId: string) => {
  await deleteDoc(doc(db, 'resumes', resumeId));
};

export const subscribeToUserResumes = (
  userId: string,
  onChange: (resumes: SavedResume[]) => void,
  onError?: (e: any) => void,
  options?: { limit?: number }
) => {
  const q = options?.limit
    ? query(
        collection(db, 'resumes'),
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc'),
        fbLimit(options.limit)
      )
    : query(collection(db, 'resumes'), where('userId', '==', userId), orderBy('updatedAt', 'desc'));
  return onSnapshot(
    q,
    (snap) => {
      const items: SavedResume[] = snap.docs.map((docSnap) => {
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
      });
      onChange(items);
    },
    onError
  );
};

// Real-time subscriptions (use sparingly)
export const subscribeToResume = (
  resumeId: string,
  onChange: (resume: SavedResume) => void,
  onError?: (e: any) => void
) => {
  const ref = doc(db, 'resumes', resumeId);
  return onSnapshot(
    ref,
    (docSnap) => {
      if (!docSnap.exists()) return;
      const data = docSnap.data();
      const toJsDate = (v: any): Date => {
        try {
          if (v && typeof v.toDate === 'function') return v.toDate();
          if (typeof v === 'string' || typeof v === 'number') return new Date(v);
        } catch {}
        return new Date();
      };
      onChange({
        id: docSnap.id,
        userId: data.userId,
        title: data.title || '',
        html: data.html,
        createdAt: toJsDate(data.createdAt),
        updatedAt: toJsDate(data.updatedAt),
      });
    },
    onError
  );
};
