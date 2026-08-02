import { cn } from "../../lib/cn";

/**
 * Segmented Control — Ratification doc DSA-1: "horizontal, mutually-
 * exclusive control for 2–3 always-visible options... radio-group for
 * keyboard purposes (Arrow Left/Right)." Used for New Analysis's
 * Paste Text / Upload File toggle (new-analysis_spec.md §3) and reused
 * verbatim later for Settings' Theme control.
 */
interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  "aria-label": string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  ...rest
}: SegmentedControlProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowRight") {
      onChange(options[(activeIndex + 1) % options.length].value);
    } else if (e.key === "ArrowLeft") {
      onChange(options[(activeIndex - 1 + options.length) % options.length].value);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label={rest["aria-label"]}
      onKeyDown={onKeyDown}
      className="inline-flex rounded-input border border-border-light bg-surface-light-muted p-1"
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          tabIndex={opt.value === value ? 0 : -1}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-[10px] px-4 py-2 text-sm font-medium transition-colors duration-fast",
            opt.value === value
              ? "bg-surface-light text-foreground-light shadow-card"
              : "text-foreground-light-muted hover:text-foreground-light"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
