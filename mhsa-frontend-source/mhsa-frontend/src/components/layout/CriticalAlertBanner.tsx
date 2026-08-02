import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Critical Alert Banner — dashboard_spec.md §6. Session-scoped dismiss
 * only; no pulsing/flashing motion (design.md prohibition, even for
 * Critical states).
 */
export function CriticalAlertBanner({ count }: { count: number }) {
  const [dismissed, setDismissed] = useState(false);
  if (count <= 0 || dismissed) return null;

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-danger/30 bg-danger/5 px-5 laptop:px-6">
      <div className="flex items-center gap-2 text-sm text-danger">
        <AlertTriangle size={16} aria-hidden="true" />
        <span>
          {count} conversation{count > 1 ? "s" : ""} require urgent review
        </span>
        <Link to="/dashboard" className="ml-1 font-medium underline underline-offset-2">
          Review now →
        </Link>
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => setDismissed(true)}
        className="text-danger/70 hover:text-danger"
      >
        <X size={16} />
      </button>
    </div>
  );
}
