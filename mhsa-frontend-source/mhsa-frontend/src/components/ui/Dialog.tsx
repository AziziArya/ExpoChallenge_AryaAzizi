import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

/**
 * Confirmation Dialog — components.md "Feedback > Dialog / Confirmation".
 * Used only for genuinely consequential actions (Override/Escalate), per
 * frontend_architecture.md §17.5: requires a note before Confirm enables.
 */
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: (note: string) => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  danger,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) setNote("");
  }, [open]);

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
          <button onClick={onCancel} aria-label="Close" className="text-foreground-light-muted hover:text-foreground-light">
            <X size={16} />
          </button>
        </div>
        <p className="text-sm text-foreground-light-muted">{description}</p>

        <label className="mt-4 block text-xs font-medium text-foreground-light-muted">
          Notes (required)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Explain the reason for this decision..."
          className="mt-1 w-full rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light outline-none focus-visible:border-primary"
        />

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="md" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={danger ? "danger" : "primary"}
            size="md"
            disabled={note.trim().length === 0}
            onClick={() => onConfirm(note)}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
