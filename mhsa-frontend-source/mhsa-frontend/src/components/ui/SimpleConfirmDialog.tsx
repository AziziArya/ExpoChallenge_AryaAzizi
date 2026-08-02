import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

/**
 * Plain Confirmation Dialog — settings_spec.md §22: "Confirmation Dialogs
 * are reserved exclusively for genuinely consequential actions" but,
 * unlike Override/Escalate, these don't require a note — just deliberate
 * confirmation (enabling raw-conversation-deletion, disabling anonymization,
 * signing out all sessions).
 */
interface SimpleConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function SimpleConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  danger,
  onCancel,
  onConfirm,
}: SimpleConfirmDialogProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-md rounded-modal border border-border-light bg-surface-light p-6 shadow-card-hover"
      >
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-base font-semibold text-foreground-light">{title}</h3>
          <button
            onClick={onCancel}
            aria-label="Close"
            className="text-foreground-light-muted hover:text-foreground-light"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-sm leading-relaxed text-foreground-light-muted">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} size="md" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
