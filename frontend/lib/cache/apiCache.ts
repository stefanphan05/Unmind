type CacheEntry<T> = {
  data: T;
  fetchedAt: number;
};

const memory = new Map<string, CacheEntry<unknown>>();
const STORAGE_PREFIX = "unmind:cache:";

function storageKey(key: string) {
  return `${STORAGE_PREFIX}${key}`;
}

export const CACHE_KEYS = {
  sessions: "sessions",
  messages: (sessionId: number) => `messages:${sessionId}`,
  voice: "voice",
} as const;

export const STALE_MS = {
  sessions: 60_000,
  messages: 60_000,
  voice: 5 * 60_000,
} as const;

export function getCacheEntry<T>(key: string): CacheEntry<T> | null {
  const mem = memory.get(key);
  if (mem) return mem as CacheEntry<T>;

  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(storageKey(key));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    memory.set(key, entry as CacheEntry<unknown>);
    return entry;
  } catch {
    return null;
  }
}

export function setCacheEntry<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = { data, fetchedAt: Date.now() };
  memory.set(key, entry as CacheEntry<unknown>);

  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(storageKey(key), JSON.stringify(entry));
  } catch {
    // sessionStorage full or unavailable
  }
}

export function isCacheFresh(key: string, staleMs: number): boolean {
  const entry = getCacheEntry(key);
  if (!entry) return false;
  return Date.now() - entry.fetchedAt < staleMs;
}

export function invalidateCache(...keys: string[]): void {
  for (const key of keys) {
    memory.delete(key);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(storageKey(key));
    }
  }
}

export function clearApiCache(): void {
  memory.clear();

  if (typeof window === "undefined") return;

  const keysToRemove: string[] = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => sessionStorage.removeItem(k));
}
