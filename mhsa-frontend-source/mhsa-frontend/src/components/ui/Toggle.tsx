import { cn } from "../../lib/cn";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  helperText?: string;
  disabled?: boolean;
}

/**
 * Toggle — components.md Inputs category. 180ms thumb slide
 * (settings_spec.md §20). Disabled toggles remain focusable and announce
 * "disabled" rather than being removed from tab order (§17).
 */
export function Toggle({ checked, onChange, label, helperText, disabled }: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div>
        <p className={cn("text-sm font-medium", disabled ? "text-foreground-light-muted" : "text-foreground-light")}>
          {label}
        </p>
        {helperText && <p className="mt-0.5 text-xs text-foreground-light-muted">{helperText}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-fast",
          checked ? "bg-primary" : "bg-border-light",
          disabled && "cursor-not-allowed opacity-40"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-fast",
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          )}
        />
      </button>
    </div>
  );
}
