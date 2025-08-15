import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SavedResume } from '../types/resume';
import {
  getResumes,
  getResumeById,
  saveResume,
  deleteResume as deleteResumeApi,
  updateResumeFields,
} from '../services/resume';

interface ResumeContextType {
  resumes: SavedResume[];
  currentResume: SavedResume | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  loadResumes: (userId: string) => Promise<void>;
  loadResume: (resumeId: string) => Promise<void>;
  createResume: (resume: SavedResume) => Promise<SavedResume>;
  updateResume: (resumeId: string, updates: Partial<SavedResume>) => Promise<void>;
  deleteResume: (resumeId: string) => Promise<void>;
  saveNow: (resume: SavedResume) => Promise<void>;
  subscribeResumes: (userId: string) => () => void;
  subscribeResume: (resumeId: string) => () => void;
}

const ResumeContext = createContext<ResumeContextType>({
  resumes: [],
  currentResume: null,
  loading: false,
  saving: false,
  error: null,
  loadResumes: async () => {},
  loadResume: async () => {},
  createResume: async () => ({
    id: '',
    userId: '',
    title: '',
    html: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  updateResume: async () => {},
  deleteResume: async () => {},
  saveNow: async () => {},
  subscribeResumes: () => () => {},
  subscribeResume: () => () => {},
});

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [currentResume, setCurrentResume] = useState<SavedResume | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce timers per resumeId to batch saves
  const saveTimers = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
  const currentResumeRef = useRef<SavedResume | null>(null);
  useEffect(() => {
    currentResumeRef.current = currentResume;
  }, [currentResume]);

  // Simple in-memory caches and request coalescing
  const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
  const cacheResumesByUser = useRef<Record<string, { ts: number; data: SavedResume[] }>>({});
  const cacheResumeById = useRef<Record<string, { ts: number; data: SavedResume }>>({});
  const inflightResumesByUser = useRef<Record<string, Promise<SavedResume[]>>>({});
  const inflightResumeById = useRef<Record<string, Promise<SavedResume>>>({});

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

  // Immediate save that bypasses debounce, used for explicit Save buttons
  const saveNow = async (resume: SavedResume) => {
    const resumeId = resume.id;
    try {
      setSaving(true);
      // Cancel any pending debounced save for this resume
      if (saveTimers.current[resumeId]) {
        clearTimeout(saveTimers.current[resumeId]);
        saveTimers.current[resumeId] = undefined;
      }
      const saved = await saveResume(resume);
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
      setError('Failed to save resume');
      console.error(err);
      throw err;
    } finally {
      setSaving(false);
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

  const createResume = async (resume: SavedResume) => {
    setLoading(true);
    try {
      const newResume = await saveResume(resume);
      setResumes((prev) => [...prev, newResume]);
      // update caches
      cacheResumeById.current[newResume.id] = { ts: Date.now(), data: newResume };
      if (newResume.userId) {
        const curr = cacheResumesByUser.current[newResume.userId]?.data || [];
        cacheResumesByUser.current[newResume.userId] = {
          ts: Date.now(),
          data: [...curr, newResume],
        };
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

  const updateResume = async (resumeId: string, updates: Partial<SavedResume>) => {
    // Optimistic update to keep UI responsive without global loading spinner
    const optimistic: SavedResume = {
      ...(currentResume as SavedResume),
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
    const updatesForWrite = { ...updates } as Partial<SavedResume>;
    saveTimers.current[resumeId] = setTimeout(async () => {
      try {
        // Partial update: only send changed fields to Firestore
        await updateResumeFields(resumeId, updatesForWrite);
        // Locally we already applied optimistic updates; refresh cache timestamps
        const latest = currentResumeRef.current as SavedResume;
        if (latest) {
          const refreshed = { ...latest, updatedAt: new Date() } as SavedResume;
          cacheResumeById.current[resumeId] = { ts: Date.now(), data: refreshed };
          const owner = refreshed.userId;
          if (owner) {
            const list = cacheResumesByUser.current[owner]?.data || [];
            const exists = list.some((r) => r.id === resumeId);
            cacheResumesByUser.current[owner] = {
              ts: Date.now(),
              data: exists
                ? list.map((r) => (r.id === resumeId ? refreshed : r))
                : [...list, refreshed],
            };
          }
        }
      } catch (err) {
        setError('Failed to update resume');
        console.error(err);
      } finally {
        setSaving(false);
      }
    }, 800);
  };

  const deleteResume = async (resumeId: string) => {
    setLoading(true);
    try {
      await deleteResumeApi(resumeId);
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

  // Real-time subscriptions (scoped to screens; remember to unsubscribe on unmount/blur)
  const subscribeResumes = (userId: string) => {
    // Lazy import from services to avoid circular types here
    const { subscribeToUserResumes } = require('../services/resume');
    const unsub = subscribeToUserResumes(
      userId,
      (items: SavedResume[]) => {
        setResumes(items);
        cacheResumesByUser.current[userId] = { ts: Date.now(), data: items };
        // prime individual cache entries
        items.forEach((r) => (cacheResumeById.current[r.id] = { ts: Date.now(), data: r }));
      },
      (e: any) => {
        console.error('Resumes subscription error', e);
        setError('Realtime resumes failed');
      },
      { limit: 50 }
    );
    return unsub;
  };

  const subscribeResume = (resumeId: string) => {
    const { subscribeToResume } = require('../services/resume');
    const unsub = subscribeToResume(
      resumeId,
      (item: SavedResume) => {
        setCurrentResume(item);
        cacheResumeById.current[resumeId] = { ts: Date.now(), data: item };
        const owner = item.userId;
        if (owner) {
          const list = cacheResumesByUser.current[owner]?.data || [];
          const exists = list.some((r) => r.id === item.id);
          cacheResumesByUser.current[owner] = {
            ts: Date.now(),
            data: exists ? list.map((r) => (r.id === item.id ? item : r)) : [...list, item],
          };
        }
      },
      (e: any) => {
        console.error('Resume subscription error', e);
        setError('Realtime resume failed');
      }
    );
    return unsub;
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        currentResume,
        loading,
        saving,
        error,
        loadResumes,
        loadResume,
        createResume,
        updateResume,
        deleteResume,
        saveNow,
        subscribeResumes,
        subscribeResume,
      }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
