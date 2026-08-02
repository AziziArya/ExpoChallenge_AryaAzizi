import { useSyncExternalStore, useCallback } from "react";
import { getSettings, subscribe, updateSettings } from "../lib/settingsStore";
import type { SettingsState } from "../lib/settingsStore";

/**
 * useSettings — the one hook every component reads/writes shared,
 * persisted settings through (Profile, Appearance, Notifications,
 * Privacy, Accessibility). Built on useSyncExternalStore so every
 * subscribed component (TopNav, Settings page, ShellLayout) re-renders
 * in the same tick whenever any one of them calls update(), and the
 * value is always exactly what's in localStorage after a refresh.
 */
export function useSettings() {
  const settings = useSyncExternalStore(subscribe, getSettings, getSettings);

  const update = useCallback(
    <K extends keyof SettingsState>(section: K, patch: Partial<SettingsState[K]>) => {
      updateSettings(section, patch);
    },
    []
  );

  return { settings, update };
}
