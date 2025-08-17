import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { SavedResume } from '../types/resume';
import {
  getResumes,
  getResumeById,
  saveResume,
  deleteResume as deleteResumeApi,
  updateResumeFields,
  uploadResumeHtml,
  downloadResumeHtml,
  getCachedHtml,
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
    version: 0,
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
  const htmlTimers = useRef<Record<string, ReturnType<typeof setTimeout> | undefined>>({});
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
          const items = await getResumes(userId);
          // Hydrate lazily using cache and background fetch
          const merged = await Promise.all(
            items.map(async (item) => {
              const cachedHtml = await getCachedHtml(item.id, item.version, CACHE_TTL_MS);
              if (cachedHtml) return { ...item, html: cachedHtml } as SavedResume;
              // background fetch
              (async () => {
                try {
                  if (item.userId) {
                    const html = await downloadResumeHtml(item.userId, item.id, item.version);
                    setResumes((prev) => prev.map((r) => (r.id === item.id ? { ...r, html } : r)));
                    cacheResumeById.current[item.id] = { ts: Date.now(), data: { ...item, html } };
                  }
                } catch {}
              })();
              return item;
            })
          );
          cacheResumesByUser.current[userId] = { ts: Date.now(), data: merged };
          return merged;
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
      if (htmlTimers.current[resumeId]) {
        clearTimeout(htmlTimers.current[resumeId]!);
        htmlTimers.current[resumeId] = undefined;
      }
      // Upload HTML first (if present) and bump version only if upload actually occurred
      let nextVersion = typeof resume.version === 'number' ? resume.version : 0;
      if (resume.html && resume.userId) {
        const { uploaded } = await uploadResumeHtml(
          resume.userId,
          resume.id,
          nextVersion + 1,
          resume.html
        );
        if (uploaded) {
          nextVersion = nextVersion + 1;
        }
      }
      const savedMeta = await saveResume({ ...resume, version: nextVersion } as SavedResume);
      const merged: SavedResume = { ...resume, ...savedMeta, version: nextVersion };
      setCurrentResume(merged);
      setResumes((prev) => prev.map((r) => (r.id === resumeId ? merged : r)));
      // refresh caches with saved
      cacheResumeById.current[resumeId] = { ts: Date.now(), data: merged };
      const owner = merged.userId;
      if (owner) {
        const list = cacheResumesByUser.current[owner]?.data || [];
        const exists = list.some((r) => r.id === resumeId);
        cacheResumesByUser.current[owner] = {
          ts: Date.now(),
          data: exists ? list.map((r) => (r.id === resumeId ? merged : r)) : [...list, merged],
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
          const meta = await getResumeById(resumeId);
          let result: SavedResume = meta;
          const cachedHtml = await getCachedHtml(meta.id, meta.version, CACHE_TTL_MS);
          if (cachedHtml) {
            result = { ...meta, html: cachedHtml };
          } else if (meta.userId) {
            // background fetch and update state
            (async () => {
              try {
                const html = await downloadResumeHtml(meta.userId!, meta.id, meta.version);
                const withHtml = { ...meta, html } as SavedResume;
                setCurrentResume(withHtml);
                cacheResumeById.current[resumeId] = { ts: Date.now(), data: withHtml };
              } catch {}
            })();
          }
          cacheResumeById.current[resumeId] = { ts: Date.now(), data: result };
          return result;
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
      // If html provided, upload first and start version at 1
      let initialVersion = 0;
      if (resume.html && resume.userId) {
        await uploadResumeHtml(resume.userId, resume.id || '', 1, resume.html);
        initialVersion = 1;
      }
      const newResume = await saveResume({ ...resume, version: initialVersion } as SavedResume);
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

    // Debounced metadata save to Firestore (excluding HTML)
    if (saveTimers.current[resumeId]) {
      clearTimeout(saveTimers.current[resumeId]);
    }
    setSaving(true);
    const { html: _omitHtml, ...metaUpdates } = updates as any;
    saveTimers.current[resumeId] = setTimeout(async () => {
      try {
        await updateResumeFields(resumeId, metaUpdates);
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
    }, 600);

    // Debounced HTML upload to Storage with version bump if html provided
    if (updates.html !== undefined) {
      if (htmlTimers.current[resumeId]) {
        clearTimeout(htmlTimers.current[resumeId]!);
      }
      htmlTimers.current[resumeId] = setTimeout(async () => {
        try {
          const latest = currentResumeRef.current as SavedResume;
          if (!latest?.userId || latest.html === undefined) return;
          const proposedVersion = (latest.version || 0) + 1;
          const { uploaded } = await uploadResumeHtml(
            latest.userId,
            resumeId,
            proposedVersion,
            latest.html || ''
          );
          if (uploaded) {
            await updateResumeFields(resumeId, { version: proposedVersion });
            const merged: SavedResume = { ...latest, version: proposedVersion };
            setCurrentResume(merged);
            cacheResumeById.current[resumeId] = { ts: Date.now(), data: merged };
            const owner = merged.userId;
            if (owner) {
              const list = cacheResumesByUser.current[owner]?.data || [];
              const exists = list.some((r) => r.id === resumeId);
              cacheResumesByUser.current[owner] = {
                ts: Date.now(),
                data: exists
                  ? list.map((r) => (r.id === resumeId ? merged : r))
                  : [...list, merged],
              };
            }
          }
        } catch (err) {
          console.error('Failed to upload HTML', err);
        }
      }, 3000);
    }
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
      async (items: SavedResume[]) => {
        // Hydrate HTML lazily: keep existing html if version unchanged
        const currentList = cacheResumesByUser.current[userId]?.data || resumes;
        const mergedList = await Promise.all(
          items.map(async (item) => {
            const existing = currentList.find((r) => r.id === item.id);
            if (existing && existing.version === item.version && existing.html) {
              return { ...item, html: existing.html } as SavedResume;
            }
            // Try cached html for this version
            const cached = await getCachedHtml(item.id, item.version, CACHE_TTL_MS);
            if (cached) return { ...item, html: cached } as SavedResume;
            // Fetch in background, update state when done
            (async () => {
              try {
                if (item.userId) {
                  const html = await downloadResumeHtml(item.userId, item.id, item.version);
                  setResumes((prev) => prev.map((r) => (r.id === item.id ? { ...r, html } : r)));
                  cacheResumeById.current[item.id] = {
                    ts: Date.now(),
                    data: { ...item, html },
                  };
                }
              } catch (e) {}
            })();
            return item;
          })
        );
        setResumes(mergedList);
        cacheResumesByUser.current[userId] = { ts: Date.now(), data: mergedList };
        mergedList.forEach((r) => (cacheResumeById.current[r.id] = { ts: Date.now(), data: r }));
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
      async (item: SavedResume) => {
        // Preserve current html if same version
        const existing = currentResumeRef.current;
        let withHtml: SavedResume = item;
        if (
          existing &&
          existing.id === item.id &&
          existing.version === item.version &&
          existing.html
        ) {
          withHtml = { ...item, html: existing.html };
        } else {
          const cached = await getCachedHtml(item.id, item.version, CACHE_TTL_MS);
          if (cached) withHtml = { ...item, html: cached };
          // background fetch to refresh
          (async () => {
            try {
              if (item.userId) {
                const html = await downloadResumeHtml(item.userId, item.id, item.version);
                setCurrentResume((prev) =>
                  prev && prev.id === item.id ? { ...item, html } : prev
                );
                cacheResumeById.current[item.id] = { ts: Date.now(), data: { ...item, html } };
              }
            } catch {}
          })();
        }
        setCurrentResume(withHtml);
        cacheResumeById.current[resumeId] = { ts: Date.now(), data: withHtml };
        const owner = withHtml.userId;
        if (owner) {
          const list = cacheResumesByUser.current[owner]?.data || [];
          const exists = list.some((r) => r.id === withHtml.id);
          cacheResumesByUser.current[owner] = {
            ts: Date.now(),
            data: exists
              ? list.map((r) => (r.id === withHtml.id ? withHtml : r))
              : [...list, withHtml],
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
