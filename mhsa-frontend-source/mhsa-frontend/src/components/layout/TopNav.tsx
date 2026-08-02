import { Bell, Moon, Sun, ChevronDown, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";

/**
 * Top Navigation — dashboard_spec.md §5. 72px, sticky, solid (never
 * transparent inside the Shell — that's Landing-only).
 */
export function TopNav() {
  const { theme, toggle } = useTheme();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 h-[72px] shrink-0 border-b border-border-light bg-surface-light">
      <div className="flex h-full items-center justify-between gap-4 px-5 laptop:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-foreground-light">
          <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-white">
            <LayoutDashboard size={16} aria-hidden="true" />
          </span>
          <span className="hidden text-sm laptop:inline">Mental Health Safety Analyzer</span>
        </Link>

        <button
          type="button"
          className="hidden w-80 items-center justify-between rounded-input border border-border-light bg-surface-light-muted px-3 py-2 text-sm text-foreground-light-muted transition-colors hover:border-primary/40 tablet:flex"
        >
          Search or jump to...
          <kbd className="rounded border border-border-light bg-surface-light px-1.5 py-0.5 text-[11px]">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative flex h-10 w-10 items-center justify-center rounded-[10px] text-foreground-light-muted transition-colors hover:bg-surface-light-muted hover:text-foreground-light"
            >
              <Bell size={18} aria-hidden="true" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 rounded-card border border-border-light bg-surface-light p-4 shadow-card-hover">
                <p className="text-sm font-medium text-foreground-light">Notifications</p>
                <p className="mt-2 text-sm text-foreground-light-muted">
                  1 conversation is Critical and still pending review.
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle theme"
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-[10px] text-foreground-light-muted transition-colors hover:bg-surface-light-muted hover:text-foreground-light"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            type="button"
            className="ml-1 flex items-center gap-1.5 rounded-[10px] py-1.5 pl-1.5 pr-2 hover:bg-surface-light-muted"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/15 text-xs font-semibold text-secondary">
              DR
            </span>
            <ChevronDown size={14} className="text-foreground-light-muted" />
          </button>
        </div>
      </div>
    </header>
  );
}
