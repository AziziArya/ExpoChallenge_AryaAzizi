/**
 * Generic localStorage helpers.
 *
 * No backend exists yet, so this is the persistence layer for anything
 * that needs to survive a refresh (Settings, theme preference, etc.).
 * Deliberately generic and reusable — not tied to any one feature's shape.
 */

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Read a JSON value from localStorage. Returns `fallback` if missing or invalid. */
export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    // Corrupt or non-JSON value — fall back rather than throw.
    return fallback;
  }
}

/** Write a JSON value to localStorage. Silently no-ops if storage is unavailable (e.g. private mode quota errors). */
export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or disabled — settings simply won't persist this write.
  }
}
