import { readJSON, writeJSON } from "./storage";

/**
 * Shared Settings Store.
 *
 * This is the single source of truth referenced by settings_spec.md §6
 * ("these two controls [Top Nav toggle and Settings' Segmented Control]
 * are the same underlying state... never two independent theme states").
 *
 * Plain external store (subscribe/getSnapshot), consumed via
 * useSyncExternalStore in src/hooks/useSettings.ts — this guarantees every
 * component reading it (TopNav, Settings, ShellLayout) re-renders
 * immediately and in sync the instant any one of them calls setSettings,
 * with no prop drilling and no risk of two components disagreeing.
 *
 * No backend exists yet, so the whole object is persisted to
 * localStorage under a single key on every change.
 */

export type ThemePreference = "light" | "dark" | "system";
export type TextSize = "default" | "large" | "xl";
export type RetentionPeriod = "30" | "90" | "365" | "indefinite";

export interface SettingsState {
  profile: {
    fullName: string;
    title: string;
  };
  appearance: {
    theme: ThemePreference;
    reducedMotion: boolean;
    language: string;
  };
  notifications: {
    pendingReminders: boolean;
    newAnalysisCompleted: boolean;
    escalationUpdates: boolean;
  };
  privacy: {
    avoidRawStorage: boolean;
    anonymousProcessing: boolean;
    retention: RetentionPeriod;
  };
  accessibility: {
    contrast: boolean;
    underlineLinks: boolean;
    textSize: TextSize;
  };
}

export const DEFAULT_SETTINGS: SettingsState = {
  profile: {
    fullName: "Dr. Reviewer",
    title: "Licensed Clinical Psychologist",
  },
  appearance: {
    theme: "system",
    reducedMotion: false,
    language: "en-US",
  },
  notifications: {
    pendingReminders: true,
    newAnalysisCompleted: true,
    escalationUpdates: false,
  },
  privacy: {
    avoidRawStorage: false,
    anonymousProcessing: true,
    retention: "90",
  },
  accessibility: {
    contrast: false,
    underlineLinks: false,
    textSize: "default",
  },
};

const STORAGE_KEY = "mhsa-settings";

function resolveTheme(pref: ThemePreference): "light" | "dark" {
  if (pref !== "system") return pref;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Applies every instant-apply setting to the DOM. Called on init and on every change. */
function applyDomEffects(settings: SettingsState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.theme = resolveTheme(settings.appearance.theme);
  root.dataset.reducedMotion = String(settings.appearance.reducedMotion);
  root.dataset.contrast = String(settings.accessibility.contrast);
  root.dataset.underlineLinks = String(settings.accessibility.underlineLinks);
  root.dataset.textSize = settings.accessibility.textSize;
}

const stored = readJSON<Partial<SettingsState>>(STORAGE_KEY, {});
let state: SettingsState = {
  profile: { ...DEFAULT_SETTINGS.profile, ...stored.profile },
  appearance: { ...DEFAULT_SETTINGS.appearance, ...stored.appearance },
  notifications: { ...DEFAULT_SETTINGS.notifications, ...stored.notifications },
  privacy: { ...DEFAULT_SETTINGS.privacy, ...stored.privacy },
  accessibility: { ...DEFAULT_SETTINGS.accessibility, ...stored.accessibility },
};
const listeners = new Set<() => void>();

// Apply immediately on module load (covers first paint / full reload).
applyDomEffects(state);

// Keep "system" theme live if the OS preference changes mid-session.
if (typeof window !== "undefined") {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (state.appearance.theme === "system") {
      applyDomEffects(state);
      listeners.forEach((l) => l());
    }
  });
}

export function getSettings(): SettingsState {
  return state;
}

/** Shallow-merges a partial patch into one settings section, persists, applies, and notifies all subscribers synchronously. */
export function updateSettings<K extends keyof SettingsState>(
  section: K,
  patch: Partial<SettingsState[K]>
): void {
  state = { ...state, [section]: { ...state[section], ...patch } };
  writeJSON(STORAGE_KEY, state);
  applyDomEffects(state);
  listeners.forEach((l) => l());
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
