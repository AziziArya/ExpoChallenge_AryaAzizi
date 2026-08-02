import { useCallback } from "react";
import { useSettings } from "./useSettings";
import type { ThemePreference } from "../lib/settingsStore";

export type { ThemePreference };
type ResolvedTheme = "light" | "dark";

function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref !== "system") return pref;
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * useTheme — settings_spec.md §6: Top Nav toggle and Settings' Segmented
 * Control (Light/Dark/System) are the same underlying state, never two
 * independent theme states. Backed by the shared settings store
 * (src/lib/settingsStore.ts) via useSettings(), so every component using
 * this hook re-renders in sync the instant the theme changes anywhere,
 * and the choice persists across refreshes (mhsa-settings in localStorage).
 */
export function useTheme() {
  const { settings, update } = useSettings();
  const preference = settings.appearance.theme;
  const resolved = resolveTheme(preference);

  const setPreference = useCallback(
    (pref: ThemePreference) => update("appearance", { theme: pref }),
    [update]
  );

  // Fast two-state shortcut (Top Nav icon) — toggles the resolved theme
  // directly and pins it as an explicit (non-"system") preference.
  const toggle = useCallback(() => {
    const current = resolveTheme(preference);
    setPreference(current === "light" ? "dark" : "light");
  }, [preference, setPreference]);

  return { theme: resolved, preference, setPreference, toggle };
}
