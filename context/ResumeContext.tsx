import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Resume, CoverLetter } from '../types/resume';
import {
  getResumes,
  getResumeById,
  saveResume,
  deleteResume,
  getCoverLetter,
} from '../services/resume';

interface ResumeContextType {
  resumes: Resume[];
  currentResume: Resume | null;
  currentCoverLetter: CoverLetter | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadResumes: (userId: string) => Promise<void>;
  loadResume: (resumeId: string) => Promise<void>;
  createResume: (userId: string, title: string) => Promise<Resume>;
  updateResume: (resumeId: string, updates: Partial<Resume>) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  loadCoverLetter: (resumeId: string) => Promise<void>;
  generateCoverLetter: (
    resumeId: string,
    company?: string,
    position?: string
  ) => Promise<CoverLetter>;
}

const ResumeContext = createContext<ResumeContextType>({
  resumes: [],
  currentResume: null,
  currentCoverLetter: null,
  loading: false,
  saving: false,
  error: null,
  loadResumes: async () => {},
  loadResume: async () => {},
  createResume: async () => ({
    id: '',
    userId: '',
    title: '',
    fullName: '',
    email: '',
    experience: [],
    education: [],
    skills: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  updateResume: async () => {},
  deleteResume: async () => {},
  loadCoverLetter: async () => {},
  generateCoverLetter: async () => ({
    id: '',
    resumeId: '',
    content: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
});

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [currentCoverLetter, setCurrentCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce timers per resumeId to batch saves
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
  const currentResumeRef = useRef<Resume | null>(null);
  useEffect(() => {
    currentResumeRef.current = currentResume;
  }, [currentResume]);

  // Simple in-memory caches and request coalescing
  const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes
  const cacheResumesByUser = useRef<Record<string, { ts: number; data: Resume[] }>>({});
  const cacheResumeById = useRef<Record<string, { ts: number; data: Resume }>>({});
  const inflightResumesByUser = useRef<Record<string, Promise<Resume[]>>>({});
  const inflightResumeById = useRef<Record<string, Promise<Resume>>>({});

  const loadResumes = async (userId: string) => {
    // Try cached
    const cached = cacheResumesByUser.current[userId];
    const now = Date.now();
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      setResumes(cached.data);
      return;
    }

    // Coalesce inflight request
    if (!inflightResumesByUser.current[userId]) {
      setLoading(true);
      inflightResumesByUser.current[userId] = (async () => {
        try {
          const userResumes = await getResumes(userId);
          cacheResumesByUser.current[userId] = { ts: Date.now(), data: userResumes };
          return userResumes;
        } finally {
          setLoading(false);
        }
      })();
    }
    try {
      const data = await inflightResumesByUser.current[userId];
      setResumes(data);
    } catch (err) {
      setError('Failed to load resumes');
      console.error(err);
    } finally {
      delete inflightResumesByUser.current[userId];
    }
  };

  const loadResume = async (resumeId: string) => {
    // Try cached
    const cached = cacheResumeById.current[resumeId];
    const now = Date.now();
    if (cached && now - cached.ts < CACHE_TTL_MS) {
      setCurrentResume(cached.data);
      return;
    }

    // Coalesce inflight request
    if (!inflightResumeById.current[resumeId]) {
      setLoading(true);
      inflightResumeById.current[resumeId] = (async () => {
        try {
          const resume = await getResumeById(resumeId);
          cacheResumeById.current[resumeId] = { ts: Date.now(), data: resume };
          return resume;
        } finally {
          setLoading(false);
        }
      })();
    }
    try {
      const data = await inflightResumeById.current[resumeId];
      setCurrentResume(data);
    } catch (err) {
      setError('Failed to load resume');
      console.error(err);
    } finally {
      delete inflightResumeById.current[resumeId];
    }
  };

  const createResume = async (userId: string, title: string) => {
    setLoading(true);
    try {
      const newResume = await saveResume({
        userId,
        title,
        kind: 'manual',
        fullName: '',
        email: '',
        experience: [],
        education: [],
        skills: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        id: '',
      });
      setResumes((prev) => [...prev, newResume]);
      // update caches
      cacheResumeById.current[newResume.id] = { ts: Date.now(), data: newResume };
      if (userId) {
        const curr = cacheResumesByUser.current[userId]?.data || [];
        cacheResumesByUser.current[userId] = { ts: Date.now(), data: [...curr, newResume] };
      }
      return newResume;
    } catch (err) {
      setError('Failed to create resume');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateResume = async (resumeId: string, updates: Partial<Resume>) => {
    // Optimistic update to keep UI responsive without global loading spinner
    const optimistic: Resume = {
      ...(currentResume as Resume),
      ...updates,
      id: resumeId,
      updatedAt: new Date(),
    };

    setCurrentResume(optimistic);
    setResumes((prev) => prev.map((r) => (r.id === resumeId ? optimistic : r)));
    // update caches optimistically
    cacheResumeById.current[resumeId] = { ts: Date.now(), data: optimistic };
    const ownerId = optimistic.userId;
    if (ownerId) {
      const list = cacheResumesByUser.current[ownerId]?.data || [];
      cacheResumesByUser.current[ownerId] = {
        ts: Date.now(),
        data: list.map((r) => (r.id === resumeId ? optimistic : r)),
      };
    }

    // Debounced save to Firestore
    if (saveTimers.current[resumeId]) {
      clearTimeout(saveTimers.current[resumeId]);
    }
    // indicate a save is pending
    setSaving(true);
    saveTimers.current[resumeId] = setTimeout(async () => {
      try {
        const latest = currentResumeRef.current as Resume;
        if (!latest) return;
        const saved = await saveResume(latest);
        setCurrentResume(saved);
        setResumes((prev) => prev.map((r) => (r.id === resumeId ? saved : r)));
        // refresh caches with saved
        cacheResumeById.current[resumeId] = { ts: Date.now(), data: saved };
        const owner = saved.userId;
        if (owner) {
          const list = cacheResumesByUser.current[owner]?.data || [];
          const exists = list.some((r) => r.id === resumeId);
          cacheResumesByUser.current[owner] = {
            ts: Date.now(),
            data: exists ? list.map((r) => (r.id === resumeId ? saved : r)) : [...list, saved],
          };
        }
      } catch (err) {
        setError('Failed to update resume');
        console.error(err);
      } finally {
        setSaving(false);
      }
    }, 400);
  };

  const deleteResume = async (resumeId: string) => {
    setLoading(true);
    try {
      await deleteResume(resumeId);
      setResumes((prev) => prev.filter((r) => r.id !== resumeId));
      if (currentResume?.id === resumeId) {
        setCurrentResume(null);
      }
      // drop from caches
      delete cacheResumeById.current[resumeId];
      // Best effort: remove from any user cache lists
      Object.keys(cacheResumesByUser.current).forEach((uid) => {
        const entry = cacheResumesByUser.current[uid];
        if (entry) {
          cacheResumesByUser.current[uid] = {
            ts: Date.now(),
            data: entry.data.filter((r) => r.id !== resumeId),
          };
        }
      });
    } catch (err) {
      setError('Failed to delete resume');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loadCoverLetter = async (resumeId: string) => {
    setLoading(true);
    try {
      const coverLetter = await getCoverLetter(resumeId);
      setCurrentCoverLetter(coverLetter);
    } catch (err) {
      setError('Failed to load cover letter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateCoverLetter = async (resumeId: string, company?: string, position?: string) => {
    setLoading(true);
    try {
      // const { generateCoverLetter } = await import('../services/ai');
      const resume = currentResume || (await getResumeById(resumeId));
      // const content = await generateCoverLetter(resume, company, position);
      const content = `Cover letter content for ${resume.fullName} applying to ${position || 'a position'} at ${company || 'the company'}.`; // Placeholder for actual AI generation logic

      const coverLetter: CoverLetter = {
        id: `${resumeId}-${Date.now()}`,
        resumeId,
        content,
        company,
        position,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      setCurrentCoverLetter(coverLetter);
      return coverLetter;
    } catch (err) {
      setError('Failed to generate cover letter');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        currentCoverLetter,
        loading,
        saving,
        error,
        loadResumes,
        loadResume,
        createResume,
        updateResume,
        deleteResume,
        loadCoverLetter,
        generateCoverLetter,
      }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
