import { db, storage } from './firebase';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';

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

// -------------------------
// Storage paths and hashing
// -------------------------
const storagePath = (userId: string, resumeId: string, version: number) =>
  `resumes/${userId}/${resumeId}/v${version}.html`;

const stablePathLatest = (userId: string, resumeId: string) =>
  `resumes/${userId}/${resumeId}/latest.html`;

// Small fast hash for change detection (not cryptographically secure)
const hashHtml = (html: string): string => {
  let h = 5381;
  for (let i = 0; i < html.length; i++) {
    h = (h * 33) ^ html.charCodeAt(i);
  }
  // convert to unsigned 32-bit and hex
  return (h >>> 0).toString(16);
};

const cacheKey = (resumeId: string, version: number) => `resume_html_${resumeId}_v${version}`;
const cacheMetaKey = (resumeId: string) => `resume_html_meta_${resumeId}`; // stores lastHash, lastVersion

export const getCachedHtml = async (
  resumeId: string,
  version: number,
  ttlMs: number
): Promise<string | undefined> => {
  try {
    const raw = await AsyncStorage.getItem(cacheKey(resumeId, version));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !parsed?.html) return undefined;
    if (Date.now() - parsed.ts > ttlMs) return undefined;
    return parsed.html as string;
  } catch {
    return undefined;
  }
};

export const setCachedHtml = async (
  resumeId: string,
  version: number,
  html: string
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      cacheKey(resumeId, version),
      JSON.stringify({ ts: Date.now(), html })
    );
    const lastHash = hashHtml(html);
    await AsyncStorage.setItem(cacheMetaKey(resumeId), JSON.stringify({ lastHash, version }));
  } catch {}
};

export const getLastHtmlHash = async (resumeId: string): Promise<string | undefined> => {
  try {
    const raw = await AsyncStorage.getItem(cacheMetaKey(resumeId));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    return parsed?.lastHash as string | undefined;
  } catch {
    return undefined;
  }
};

// Upload HTML to Storage (debounced by caller). Returns computed hash. Also upload to versioned path and update latest.html.
export const uploadResumeHtml = async (
  userId: string,
  resumeId: string,
  version: number,
  html: string
): Promise<{ hash: string; uploaded: boolean }> => {
  const htmlHash = hashHtml(html);
  const lastHash = await getLastHtmlHash(resumeId);
  if (lastHash && lastHash === htmlHash) {
    // unchanged: do not upload, do not touch cache here
    return { hash: htmlHash, uploaded: false }; // skip upload; unchanged
  }
  const versionRef = ref(storage, storagePath(userId, resumeId, version));
  const latestRef = ref(storage, stablePathLatest(userId, resumeId));
  await uploadString(versionRef, html, 'raw', { contentType: 'text/html; charset=utf-8' } as any);
  await uploadString(latestRef, html, 'raw', { contentType: 'text/html; charset=utf-8' } as any);
  await setCachedHtml(resumeId, version, html);
  return { hash: htmlHash, uploaded: true };
};

export const downloadResumeHtml = async (
  userId: string,
  resumeId: string,
  version: number
): Promise<string> => {
  // Prefer versioned path to avoid CDN caching issues
  const url = await getDownloadURL(ref(storage, storagePath(userId, resumeId, version)));
  const res = await fetch(url);
  const html = await res.text();
  await setCachedHtml(resumeId, version, html);
  return html;
};

// -------------------------
// Firestore metadata writes
// -------------------------
export const saveResume = async (resume: SavedResume): Promise<SavedResume> => {
  const id =
    resume.id && resume.id.trim().length > 0 ? resume.id : doc(collection(db, 'resumes')).id;
  const toSave: Partial<SavedResume> = {
    id,
    userId: resume.userId,
    title: resume.title,
    version: typeof resume.version === 'number' ? resume.version : 0,
    createdAt: (resume as any).createdAt || (serverTimestamp() as any),
    updatedAt: serverTimestamp() as any,
  } as any;
  const cleaned = cleanForFirestore(toSave);
  await setDoc(doc(db, 'resumes', id), cleaned, { merge: true });
  return { ...(toSave as any) } as SavedResume;
};

// Prefer partial updates for small edits to avoid rewriting the whole doc
export const updateResumeFields = async (
  resumeId: string,
  updates: Partial<SavedResume>
): Promise<void> => {
  // never write HTML to Firestore
  const { html, ...meta } = updates as any;
  const toUpdate: any = cleanForFirestore({ ...meta, updatedAt: serverTimestamp() as any });
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
  const meta: SavedResume = {
    id: docSnap.id,
    userId: data.userId,
    title: data.title || '',
    version: typeof data.version === 'number' ? data.version : 0,
    createdAt: toJsDate(data.createdAt),
    updatedAt: toJsDate(data.updatedAt),
  } as any;
  // Try hydrate from cache; do not fetch from Storage here (caller decides)
  const cachedHtml = await getCachedHtml(meta.id, meta.version, 5 * 60 * 1000);
  if (cachedHtml) return { ...meta, html: cachedHtml };
  // Legacy fallback: if Firestore still has html and no version, serve it and cache for v0
  if (!data.version && typeof data.html === 'string' && data.html.length > 0) {
    await setCachedHtml(meta.id, 0, data.html);
    return { ...meta, html: data.html } as SavedResume;
  }
  return meta;
};

export const getResumes = async (userId: string): Promise<SavedResume[]> => {
  const q = query(
    collection(db, 'resumes'),
    where('userId', '==', userId),
    // keep list stable and allow incremental sync by updatedAt
    orderBy('updatedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);

  const items: SavedResume[] = [];
  for (const d of querySnapshot.docs) {
    const data = d.data();
    const toJsDate = (v: any): Date => {
      try {
        if (v && typeof v.toDate === 'function') return v.toDate();
        if (typeof v === 'string' || typeof v === 'number') return new Date(v);
      } catch {}
      return new Date();
    };
    const meta: SavedResume = {
      id: d.id,
      userId: data.userId,
      title: data.title || '',
      version: typeof data.version === 'number' ? data.version : 0,
      createdAt: toJsDate(data.createdAt),
      updatedAt: toJsDate(data.updatedAt),
    } as any;
    const cachedHtml = await getCachedHtml(meta.id, meta.version, 5 * 60 * 1000);
    if (cachedHtml) {
      items.push({ ...meta, html: cachedHtml });
    } else if (!data.version && typeof data.html === 'string' && data.html.length > 0) {
      await setCachedHtml(meta.id, 0, data.html);
      items.push({ ...meta, html: data.html } as SavedResume);
    } else {
      items.push(meta);
    }
  }
  return items;
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
      version: typeof data.version === 'number' ? data.version : 0,
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
        const item: SavedResume = {
          id: docSnap.id,
          userId: data.userId,
          title: data.title || '',
          version: typeof data.version === 'number' ? data.version : 0,
          createdAt: toJsDate(data.createdAt),
          updatedAt: toJsDate(data.updatedAt),
        } as SavedResume;
        // Note: list snapshot is metadata only; no legacy html fallback here to keep payload small
        return item;
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
      const meta: SavedResume = {
        id: docSnap.id,
        userId: data.userId,
        title: data.title || '',
        version: typeof data.version === 'number' ? data.version : 0,
        createdAt: toJsDate(data.createdAt),
        updatedAt: toJsDate(data.updatedAt),
      } as SavedResume;
      // Legacy fallback for single doc subscription only (useful while migrating)
      if (!data.version && typeof data.html === 'string' && data.html.length > 0) {
        setCachedHtml(meta.id, 0, data.html).catch(() => {});
        onChange({ ...meta, html: data.html });
      } else {
        onChange(meta);
      }
    },
    onError
  );
};
