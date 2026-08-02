import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ArrowUpDown, TrendingDown, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Card } from "../components/ui/Card";
import { RiskBadge, ReviewStatusBadge } from "../components/ui/Badge";
import { getConversations } from "../services/conversations.service";
import type { ConversationSummary, RiskLevel, ReviewStatus } from "../types/conversation";

const RISK_ORDER: Record<RiskLevel, number> = {
  safe: 0,
  mild: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

type SortKey = "time" | "risk";

const emotionTrend = [
  { day: "Mon", value: 32 },
  { day: "Tue", value: 41 },
  { day: "Wed", value: 38 },
  { day: "Thu", value: 52 },
  { day: "Fri", value: 47 },
  { day: "Sat", value: 35 },
  { day: "Sun", value: 30 },
];

const crisisAlerts = [
  { day: "Mon", value: 0 },
  { day: "Tue", value: 1 },
  { day: "Wed", value: 0 },
  { day: "Thu", value: 2 },
  { day: "Fri", value: 1 },
  { day: "Sat", value: 0 },
  { day: "Sun", value: 1 },
];

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationSummary[] | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [riskFilter, setRiskFilter] = useState<RiskLevel | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");

  useEffect(() => {
    getConversations().then(setConversations);
  }, []);

  const criticalPendingCount = useMemo(
    () =>
      (conversations ?? []).filter(
        (c) => c.riskLevel === "critical" && c.reviewStatus !== "reviewed"
      ).length,
    [conversations]
  );

  const pendingCount = useMemo(
    () => (conversations ?? []).filter((c) => c.reviewStatus === "pending").length,
    [conversations]
  );

  const riskDistribution = useMemo(() => {
    const list = conversations ?? [];
    const highPlus = list.filter((c) => c.riskLevel === "high" || c.riskLevel === "critical").length;
    return list.length ? Math.round((highPlus / list.length) * 100) : 0;
  }, [conversations]);

  const filteredSorted = useMemo(() => {
    let list = [...(conversations ?? [])];
    if (riskFilter !== "all") list = list.filter((c) => c.riskLevel === riskFilter);
    if (statusFilter !== "all") list = list.filter((c) => c.reviewStatus === statusFilter);

    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "risk") return (RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel]) * dir;
      return (new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()) * dir;
    });

    // Escalated-case pinning — Ratification FD-4: pins above active sort/filter.
    const escalated = list.filter((c) => c.reviewStatus === "escalated");
    const rest = list.filter((c) => c.reviewStatus !== "escalated");
    return [...escalated, ...rest];
  }, [conversations, sortKey, sortDir, riskFilter, statusFilter]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  return (
    <ShellLayout criticalCount={criticalPendingCount}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground-light">Dashboard</h1>
        <p className="mt-1 text-foreground-light-muted">
          Welcome back — here's what needs your attention.
        </p>
      </div>

      {/* TOP ZONE — Summary Strip, dashboard_spec.md §7 */}
      <div className="grid gap-6 tablet:grid-cols-2 laptop:grid-cols-4">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
            Total Conversations
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground-light">
            {conversations ? conversations.length : "—"}
          </p>
        </Card>

        <Card
          interactive
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter("pending")}
          onKeyDown={(e) => e.key === "Enter" && setStatusFilter("pending")}
        >
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
            Pending Review
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground-light">
            {conversations ? pendingCount : "—"}
          </p>
          <p className="mt-1 text-xs text-primary">Click to filter queue →</p>
        </Card>

        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
            Risk Distribution
          </p>
          <p className="mt-2 text-2xl font-bold tabular-nums text-foreground-light">
            {conversations ? `${riskDistribution}%` : "—"}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs text-foreground-light-muted">
            High or Critical risk
          </p>
        </Card>

        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
            This Week's Trend
          </p>
          <p className="mt-2 flex items-center gap-1 text-2xl font-bold text-success">
            <TrendingDown size={20} aria-hidden="true" />
            <span className="text-sm font-medium">Improving</span>
          </p>
        </Card>
      </div>

      {/* MIDDLE ZONE — Conversation Queue, dashboard_spec.md §8 */}
      <div className="mt-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-foreground-light">Conversation Queue</h2>
          <div className="flex gap-2">
            <select
              aria-label="Filter by risk"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value as RiskLevel | "all")}
              className="rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
            >
              <option value="all">All risk levels</option>
              <option value="safe">Safe</option>
              <option value="mild">Mild Concern</option>
              <option value="moderate">Moderate Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Emergency</option>
            </select>
            <select
              aria-label="Filter by review status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ReviewStatus | "all")}
              className="rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="escalated">Escalated</option>
              <option value="awaiting_info">Awaiting Info</option>
            </select>
          </div>
        </div>

        {!conversations ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-card bg-surface-light-muted" />
            ))}
          </div>
        ) : filteredSorted.length === 0 ? (
          <Card className="py-12 text-center text-foreground-light-muted">
            No conversations match your filters.
          </Card>
        ) : (
          <>
            {/* Desktop/Laptop table — laptop breakpoint (1024px), per Ratification FD-2 */}
            <div className="hidden overflow-hidden rounded-card border border-border-light bg-surface-light laptop:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light text-left text-xs text-foreground-light-muted">
                    <th className="px-5 py-3 font-medium">Conversation</th>
                    <th className="px-5 py-3 font-medium">
                      <button
                        onClick={() => toggleSort("risk")}
                        className="inline-flex items-center gap-1 hover:text-foreground-light"
                      >
                        Risk <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-5 py-3 font-medium">Confidence</th>
                    <th className="px-5 py-3 font-medium">Review Status</th>
                    <th className="px-5 py-3 font-medium">
                      <button
                        onClick={() => toggleSort("time")}
                        className="inline-flex items-center gap-1 hover:text-foreground-light"
                      >
                        Time <ArrowUpDown size={12} />
                      </button>
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filteredSorted.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/dashboard/${c.id}`)}
                      className="cursor-pointer border-b border-border-light last:border-0 transition-colors hover:bg-surface-light-muted"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-foreground-light">{c.label}</p>
                        <p className="text-xs text-foreground-light-muted">
                          {c.participantCount} participants · {c.messageCount} messages
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <RiskBadge level={c.riskLevel} />
                      </td>
                      <td className="px-5 py-4 tabular-nums">{Math.round(c.confidence * 100)}%</td>
                      <td className="px-5 py-4">
                        <ReviewStatusBadge status={c.reviewStatus} />
                      </td>
                      <td className="px-5 py-4 text-foreground-light-muted">
                        {relativeTime(c.updatedAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ChevronRight size={16} className="inline text-foreground-light-muted" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tablet/Mobile card list — below 1024px, per Ratification FD-2 */}
            <div className="grid gap-3 laptop:hidden">
              {filteredSorted.map((c) => (
                <Card
                  key={c.id}
                  interactive
                  onClick={() => navigate(`/dashboard/${c.id}`)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-foreground-light">{c.label}</p>
                      <p className="text-xs text-foreground-light-muted">
                        {c.participantCount} participants · {c.messageCount} messages
                      </p>
                    </div>
                    <ChevronRight size={16} className="mt-1 shrink-0 text-foreground-light-muted" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <RiskBadge level={c.riskLevel} />
                    <ReviewStatusBadge status={c.reviewStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-foreground-light-muted">
                    <span>{Math.round(c.confidence * 100)}% confidence</span>
                    <span>{relativeTime(c.updatedAt)}</span>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-foreground-light-muted">
              <span>Page 1 of 1</span>
              <div className="flex gap-2">
                <button disabled className="rounded-input border border-border-light px-3 py-1.5 disabled:opacity-40">
                  Previous
                </button>
                <button disabled className="rounded-input border border-border-light px-3 py-1.5 disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* BOTTOM ZONE — Quick Insights, dashboard_spec.md §7 */}
      <div className="mt-8 grid gap-6 tablet:grid-cols-2">
        <Card>
          <p className="text-sm font-medium text-foreground-light">Emotion Trend (7 days)</p>
          <div className="mt-3 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={emotionTrend}>
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <p className="flex items-center justify-between text-sm font-medium text-foreground-light">
            Crisis Alerts this week
            <span className="flex items-center gap-1 text-xs font-normal text-foreground-light-muted">
              <TrendingUp size={12} /> 5 total
            </span>
          </p>
          <div className="mt-3 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crisisAlerts}>
                <Bar dataKey="value" fill="#DC2626" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </ShellLayout>
  );
}
