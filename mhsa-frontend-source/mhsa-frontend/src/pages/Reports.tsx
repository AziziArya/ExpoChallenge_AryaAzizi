import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, FileText } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Card } from "../components/ui/Card";
import { RiskBadge } from "../components/ui/Badge";
import { getConversations } from "../services/conversations.service";
import type { ConversationSummary } from "../types/conversation";

/**
 * Reports List — reports_spec.md §3. Reverse-chronological, single-column
 * card list (no table — the list is short and the container is
 * intentionally reading-width, per §1), no filter/sort controls
 * (that's History's job).
 */
export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ConversationSummary[] | null>(null);

  useEffect(() => {
    getConversations().then((list) =>
      setReports(
        [...list].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      )
    );
  }, []);

  return (
    <ShellLayout>
      <div className="mx-auto max-w-reading">
        <h1 className="text-2xl font-bold text-foreground-light">Reports</h1>
        <p className="mt-1 text-foreground-light-muted">
          Explainable summaries generated after each completed analysis.
        </p>

        <div className="mt-6 space-y-3">
          {!reports ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[72px] animate-pulse rounded-card bg-surface-light-muted" />
            ))
          ) : reports.length === 0 ? (
            <Card className="py-12 text-center text-foreground-light-muted">
              <FileText className="mx-auto mb-3" size={22} aria-hidden="true" />
              No reports yet — reports are generated after an analysis completes.
              <div className="mt-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Go to Dashboard
                </button>
              </div>
            </Card>
          ) : (
            reports.map((r) => (
              <Card key={r.id} interactive onClick={() => navigate(`/reports/${r.id}`)}>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground-light">{r.label}</p>
                    <p className="mt-0.5 text-xs text-foreground-light-muted">
                      Generated{" "}
                      {new Date(r.updatedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge level={r.riskLevel} />
                    <ChevronRight size={16} className="text-foreground-light-muted" />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </ShellLayout>
  );
}
