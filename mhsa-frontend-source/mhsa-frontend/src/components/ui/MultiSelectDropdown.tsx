import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/cn";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
}

/**
 * Multi-select dropdown — history_spec.md §5: "Risk Level filter — multi-
 * select checklist inside the dropdown", same pattern for Review Status.
 */
export function MultiSelectDropdown({ label, options, selected, onChange }: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function toggle(value: string) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
      >
        {label}
        {selected.length > 0 && (
          <span className="rounded-full bg-primary/10 px-1.5 text-xs font-medium text-primary">
            {selected.length}
          </span>
        )}
        <ChevronDown size={14} className="text-foreground-light-muted" />
      </button>
      {open && (
        <div className="absolute left-0 top-11 z-20 w-56 rounded-card border border-border-light bg-surface-light p-2 shadow-card-hover">
          {options.map((opt) => (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-[8px] px-2 py-1.5 text-sm text-foreground-light hover:bg-surface-light-muted"
              )}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => toggle(opt.value)}
                className="accent-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
