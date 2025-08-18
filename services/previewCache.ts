// Simple in-memory cache for passing large preview HTML between screens without URL params
// Note: This is process-local and non-persistent. It resets on app reload.

export type PreviewEntry = {
  html: string;
  wm?: string;
  ts: number;
};

const store: Record<string, PreviewEntry> = {};
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function gc() {
  const now = Date.now();
  for (const k of Object.keys(store)) {
    if (now - store[k].ts > TTL_MS) delete store[k];
  }
}

export function putPreview(html: string, wm?: string): string {
  gc();
  const key = Math.random().toString(36).slice(2) + Date.now().toString(36);
  store[key] = { html, wm, ts: Date.now() };
  return key;
}

export function takePreview(key: string): PreviewEntry | undefined {
  gc();
  const v = store[key];
  // Do not delete immediately to allow re-renders; keep until GC clears by TTL
  return v;
}
