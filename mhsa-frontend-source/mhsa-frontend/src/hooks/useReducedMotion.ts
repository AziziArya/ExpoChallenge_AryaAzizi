import { useCallback } from "react";
import { useSettings } from "./useSettings";

/**
 * useReducedMotion — settings_spec.md §5, instant-apply. Backed by the
 * shared settings store so it stays in sync with the Settings page and
 * persists across refreshes, same as useTheme.
 */
export function useReducedMotion() {
  const { settings, update } = useSettings();

  const setEnabled = useCallback(
    (enabled: boolean) => update("appearance", { reducedMotion: enabled }),
    [update]
  );

  return { enabled: settings.appearance.reducedMotion, setEnabled };
}
