import { useState } from "react";
import { Check, ShieldAlert, Flag, HelpCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { ReviewStatusBadge } from "../ui/Badge";
import { ConfirmDialog } from "../ui/Dialog";
import type { ReviewStatus } from "../../types/conversation";

/**
 * Human Review Panel — dashboard_spec.md §16. Visually distinct container
 * from Explainability (subtle elevation step) — "AI Recommendation and
 * Human Decision are never the same object" (dashboard_spec.md, verbatim).
 * Approve is single-click (low consequence); Override/Escalate require
 * Confirmation with a mandatory note (frontend_architecture.md §17.5).
 * State here is session-only — no persistence layer exists yet (Open
 * Question 18.2) — surfaced honestly rather than hidden.
 */
export function HumanReviewPanel({
  recommendation,
  initialStatus,
}: {
  recommendation: string;
  initialStatus: ReviewStatus;
}) {
  const [status, setStatus] = useState<ReviewStatus>(initialStatus);
  const [notes, setNotes] = useState("");
  const [dialog, setDialog] = useState<"override" | "escalate" | null>(null);
  const [reviewed, setReviewed] = useState(initialStatus === "reviewed" || initialStatus === "escalated");

  function handleApprove() {
    setStatus("reviewed");
    setReviewed(true);
  }

  function handleRequestInfo() {
    setStatus("awaiting_info");
  }

  function handleConfirm(note: string) {
    setNotes(note);
    setStatus(dialog === "escalate" ? "escalated" : "reviewed");
    setReviewed(true);
    setDialog(null);
  }

  return (
    <div className="rounded-card border border-border-light bg-surface-light-muted p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground-light">Human Review</h2>
        <ReviewStatusBadge status={status} />
      </div>

      {!reviewed ? (
        <>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
            AI Recommendation
          </p>
          <p className="mt-1 rounded-[10px] border border-border-light bg-surface-light p-3 text-sm text-foreground-light">
            {recommendation}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="md" variant="primary" onClick={handleApprove}>
              <Check size={16} /> Approve
            </Button>
            <Button size="md" variant="secondary" onClick={() => setDialog("override")}>
              <ShieldAlert size={16} /> Override
            </Button>
            <Button size="md" variant="secondary" onClick={() => setDialog("escalate")}>
              <Flag size={16} /> Escalate
            </Button>
            <Button size="md" variant="ghost" onClick={handleRequestInfo}>
              <HelpCircle size={16} /> Request More Info
            </Button>
          </div>
        </>
      ) : (
        <div className="grid gap-4 tablet:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
              AI Recommendation
            </p>
            <p className="mt-1 rounded-[10px] border border-border-light bg-surface-light p-3 text-sm text-foreground-light">
              {recommendation}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
              Human Decision
            </p>
            <p className="mt-1 rounded-[10px] border border-border-light bg-surface-light p-3 text-sm text-foreground-light">
              {status === "escalated" ? "Escalated" : "Approved / Reviewed"}
              {notes && <span className="mt-1 block text-foreground-light-muted">"{notes}"</span>}
            </p>
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-foreground-light-muted">
        Review actions are session-only in this build and reset on reload — persistence requires
        the authentication system (not yet built).
      </p>

      <ConfirmDialog
        open={dialog !== null}
        title={dialog === "escalate" ? "Escalate this conversation?" : "Override the AI recommendation?"}
        description={
          dialog === "escalate"
            ? "This will flag the conversation for urgent, pinned review across the Dashboard and History."
            : "You are recording a clinical decision that differs from the AI's recommendation."
        }
        confirmLabel={dialog === "escalate" ? "Escalate" : "Override"}
        danger={dialog === "escalate"}
        onCancel={() => setDialog(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
