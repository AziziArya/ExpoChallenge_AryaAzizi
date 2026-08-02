import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Download, Printer, Share2, Link as LinkIcon, Copy } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ClinicalSummaryCard } from "../components/analysis/ClinicalSummaryCard";
import { getConversationDetail } from "../services/conversationDetail.service";
import type { ConversationDetail } from "../types/conversationDetail";

// Mock clinical notes — no persistence layer exists yet (Open Question
// 18.2 / DR-5), so notes tied to a real review session aren't retrievable
// here; illustrative content only, matching the documented empty-state
// copy for cases with no notes yet.
const MOCK_NOTES: Record<string, string> = {
  "c-4821": "Escalating due to repeated high-risk language across recent messages. Recommend contacting the patient's care team today.",
  "c-4815": "Reviewed — emotional tone has stabilized compared to last week. Continue routine check-ins.",
  "c-4802": "Reviewed — no concerns. Patient reports improved sleep and mood.",
};

export default function ReportDetail() {
  const { id = "" } = useParams();
  const [data, setData] = useState<ConversationDetail | null | undefined>(undefined);
  const [exporting, setExporting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setData(undefined);
    getConversationDetail(id).then(setData);
  }, [id]);

  async function handleExport() {
    setExporting(true);
    await new Promise((r) => setTimeout(r, 700));
    setExporting(false);
    window.print();
  }

  function handleCopyLink() {
    navigator.clipboard?.writeText(`${window.location.origin}/reports/${id}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const notes = MOCK_NOTES[id];

  return (
    <ShellLayout>
      <div className="mx-auto max-w-reading">
        <Link
          to="/reports"
          className="mb-4 inline-flex items-center gap-1 text-sm text-foreground-light-muted hover:text-foreground-light"
        >
          <ChevronLeft size={16} /> Back to Reports
        </Link>

        {data === undefined && (
          <div className="space-y-4">
            <div className="h-8 w-64 animate-pulse rounded bg-surface-light-muted" />
            <div className="h-64 animate-pulse rounded-card bg-surface-light-muted" />
          </div>
        )}

        {data === null && (
          <Card className="py-12 text-center text-foreground-light-muted">
            This report couldn't be loaded.
          </Card>
        )}

        {data && (
          <>
            <p className="mb-1 text-sm text-foreground-light-muted">Reports / {data.label}</p>
            <h1 className="mb-6 text-2xl font-bold text-foreground-light">{data.label}</h1>

            {/* Clinical Summary Card — reused verbatim from Analysis Workspace */}
            <ClinicalSummaryCard data={data} />

            {/* Explainability — condensed, reading-oriented, no Reason Graph */}
            <div className="mt-6 rounded-card border border-border-light bg-surface-light p-6">
              <h2 className="text-lg font-semibold text-foreground-light">Explainability</h2>

              <p className="mt-4 text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
                Detected Signals
              </p>
              <ul className="mt-1 list-inside list-disc text-sm text-foreground-light">
                {data.signals.map((s) => (
                  <li key={s.id}>{s.label}</li>
                ))}
              </ul>

              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
                Reasoning
              </p>
              <div className="mt-2 space-y-3">
                {data.signals.map((s) => (
                  <p key={s.id} className="text-sm leading-relaxed text-foreground-light">
                    • {s.label}.
                  </p>
                ))}
              </div>

              <p className="mt-5 text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
                Confidence
              </p>
              <p className="mt-1 text-sm text-foreground-light">
                {Math.round(data.confidence * 100)}% — reflects how strongly the detected signals
                agreed with one another across the pipeline's independent modules.
              </p>
            </div>

            {/* Human Notes — read-only */}
            <div className="mt-6">
              <h2 className="text-base font-semibold text-foreground-light">Clinical Notes</h2>
              {notes ? (
                <div className="mt-2">
                  <p className="text-xs text-foreground-light-muted">
                    Dr. Reviewer · {new Date(data.updatedAt).toLocaleDateString()}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-light">{notes}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-foreground-light-muted">
                  No clinical notes have been added to this case yet.
                </p>
              )}
            </div>

            {/* Export / Print / Share — closing action row */}
            <div className="relative mt-8 flex flex-wrap gap-2 border-t border-border-light pt-6">
              <Button variant="primary" size="md" onClick={handleExport} disabled={exporting}>
                <Download size={15} /> {exporting ? "Exporting..." : "Export (PDF)"}
              </Button>
              <Button variant="secondary" size="md" onClick={() => window.print()}>
                <Printer size={15} /> Print
              </Button>
              <Button variant="ghost" size="md" onClick={() => setShareOpen((v) => !v)}>
                <Share2 size={15} /> Share
              </Button>

              {shareOpen && (
                <div className="absolute left-0 top-full z-20 mt-2 w-80 rounded-card border border-border-light bg-surface-light p-4 shadow-card-hover">
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-foreground-light">
                    <LinkIcon size={14} /> Share this report
                  </p>
                  <p className="mb-3 text-xs text-foreground-light-muted">
                    Anyone with this link and appropriate access can view this report.
                  </p>
                  <div className="flex items-center gap-2 rounded-input border border-border-light bg-surface-light-muted px-2 py-1.5">
                    <span className="flex-1 truncate text-xs text-foreground-light-muted">
                      {window.location.origin}/reports/{id}
                    </span>
                    <button
                      onClick={handleCopyLink}
                      className="shrink-0 text-foreground-light-muted hover:text-primary"
                      aria-label="Copy link"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  {copied && <p className="mt-1.5 text-xs text-success">Copied to clipboard.</p>}
                </div>
              )}
            </div>
            <p className="mt-3 text-xs text-foreground-light-muted">
              AI-generated decision support. Not a diagnostic tool. Reviewed by{" "}
              {notes ? "Dr. Reviewer" : "Pending Review"}.
            </p>
          </>
        )}
      </div>
    </ShellLayout>
  );
}
