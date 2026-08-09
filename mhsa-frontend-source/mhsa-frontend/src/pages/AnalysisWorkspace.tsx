import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Card } from "../components/ui/Card";
import { RISK_CONFIG } from "../components/ui/Badge";
import { ConversationViewer } from "../components/analysis/ConversationViewer";
import { AnalysisTabs } from "../components/analysis/AnalysisTabs";
import { ExplainabilityPanel } from "../components/analysis/ExplainabilityPanel";
import { HumanReviewPanel } from "../components/analysis/HumanReviewPanel";
import { PrivacyPanel } from "../components/analysis/PrivacyPanel";
import { ClinicalSummaryCard } from "../components/analysis/ClinicalSummaryCard";
import { getConversationDetail } from "../services/conversationDetail.service";
import type { ConversationDetail, Trend } from "../types/conversationDetail";
import type { RiskLevel } from "../types/conversation";

/**
 * Analysis Workspace — dashboard_spec.md §9-10.
 * Top Zone: Risk Card (dominant) + Confidence (nested/adjacent, never
 * equal weight) + Detected Signals (chips) + Recommendation Preview strip.
 * Information Priority (frontend_architecture.md §15): Risk first, always
 * largest/loudest; Confidence always immediately adjacent, never isolated.
 */

// Illustrative severity-within-band placeholder — real numeric risk score
// is a backend output not yet available (no live /analyze pipeline);
// used only to fill the Risk Card's supplementary progress bar.
const SEVERITY_WITHIN_BAND: Record<RiskLevel, number> = {
  safe: 15,
  mild: 35,
  moderate: 55,
  high: 78,
  critical: 95,
};

const TREND_CONFIG: Record<Trend, { label: string; icon: typeof TrendingUp; classes: string }> = {
  improving: { label: "Improving", icon: TrendingDown, classes: "text-success" },
  stable: { label: "Stable", icon: Minus, classes: "text-foreground-light-muted" },
  worsening: { label: "Worsening", icon: TrendingUp, classes: "text-danger" },
};

export default function AnalysisWorkspace() {
  const { id = "" } = useParams();
  const [data, setData] = useState<ConversationDetail | null | undefined>(undefined);

  useEffect(() => {
    setData(undefined);
    getConversationDetail(id).then(setData);
  }, [id]);

  return (
    <ShellLayout>
      <Link
        to="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-foreground-light-muted hover:text-foreground-light"
      >
        <ChevronLeft size={16} /> Back to Dashboard
      </Link>

      {data === undefined && (
        <div className="space-y-4">
          <div className="h-8 w-64 animate-pulse rounded bg-surface-light-muted" />
          <div className="grid gap-6 laptop:grid-cols-[2fr_1fr_1fr]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-card bg-surface-light-muted" />
            ))}
          </div>
        </div>
      )}

      {data === null && (
        <Card className="py-12 text-center text-foreground-light-muted">
          Conversation not found.
        </Card>
      )}

      {data && (
        <>
          <p className="mb-1 text-sm text-foreground-light-muted">
            Dashboard / {data.label}
          </p>
          <h1 className="mb-6 text-2xl font-bold text-foreground-light">{data.label}</h1>

          {/* TOP ZONE */}
          <div className="grid gap-6 laptop:grid-cols-[2fr_1fr_1fr]">
            {/* Risk Card — dominant, per §10 */}
            <RiskCard riskLevel={data.riskLevel} trend={data.trend} />

            {/* Confidence — nested/adjacent, subordinate-but-present */}
            <Card>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
                Confidence
              </p>
              <p className="mt-2 text-3xl font-bold tabular-nums text-foreground-light">
                {Math.round(data.confidence * 100)}%
              </p>
              <p className="mt-1 text-xs text-foreground-light-muted">
                {data.confidence >= 0.8 ? "High confidence" : "Review recommended"}
              </p>
            </Card>

            {/* Detected Signals — top-line, chips */}
            <Card>
              <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
                Detected Signals
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {data.signals.slice(0, 3).map((s) => (
                  <span
                    key={s.id}
                    className="rounded-full border border-border-light bg-surface-light-muted px-2.5 py-1 text-xs text-foreground-light"
                  >
                    {s.label}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Recommendation Preview strip — full width, one line */}
          <div className="mt-4 flex items-center gap-2 rounded-card border border-border-light bg-secondary/5 px-5 py-3 text-sm text-foreground-light">
            <span className="font-medium text-secondary">AI Recommendation:</span>
            {data.recommendation}
          </div>

          {/* MIDDLE ZONE — Split View: Conversation Viewer (hero) + Tab group */}
          <div className="mt-6 grid gap-6 laptop:h-[600px] laptop:grid-cols-[1.5fr_1fr]">
            <ConversationViewer messages={data.messages} />
            <AnalysisTabs data={data} />
          </div>

          {/* BOTTOM ZONE — Explainability + Human Review, then Clinical Summary */}
          <div className="mt-6 grid gap-6 laptop:grid-cols-2">
            <ExplainabilityPanel data={data} />
            <HumanReviewPanel recommendation={data.recommendation} initialStatus={data.reviewStatus} />
          </div>

          {/* Privacy Guard — first-class panel, not buried in a tab */}
          <div className="mt-6 grid gap-6 laptop:grid-cols-2">
            <PrivacyPanel data={data} />
          </div>

          <div className="mt-6">
            <ClinicalSummaryCard data={data} />
          </div>
        </>
      )}
    </ShellLayout>
  );
}

function RiskCard({ riskLevel, trend }: { riskLevel: RiskLevel; trend: Trend }) {
  const { label, icon: Icon, classes } = RISK_CONFIG[riskLevel];
  const { label: trendLabel, icon: TrendIcon, classes: trendClasses } = TREND_CONFIG[trend];
  const severity = SEVERITY_WITHIN_BAND[riskLevel];

  return (
    <Card className={riskLevel === "critical" ? "border-danger/40" : undefined}>
      <div className="flex items-center gap-2">
        <Icon size={22} className={classes.split(" ")[1]} aria-hidden="true" />
        <h2 className="text-xl font-bold text-foreground-light">{label}</h2>
      </div>
      <p className={`mt-1 flex items-center gap-1 text-sm ${trendClasses}`}>
        <TrendIcon size={14} aria-hidden="true" />
        {trendLabel}
      </p>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-light-muted">
        <div
          className={`h-full rounded-full ${classes.split(" ")[1].replace("text-", "bg-")}`}
          style={{ width: `${severity}%`, opacity: 0.6 }}
        />
      </div>
    </Card>
  );
}
