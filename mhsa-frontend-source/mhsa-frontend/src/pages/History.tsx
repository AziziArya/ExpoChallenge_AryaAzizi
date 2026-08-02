import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, X } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Card } from "../components/ui/Card";
import { RiskBadge, ReviewStatusBadge } from "../components/ui/Badge";
import { MultiSelectDropdown } from "../components/ui/MultiSelectDropdown";
import { getConversations } from "../services/conversations.service";
import type { ConversationSummary, RiskLevel } from "../types/conversation";

type SortOption = "newest" | "oldest" | "risk-desc" | "risk-asc" | "confidence-desc";

const RISK_ORDER: Record<RiskLevel, number> = { safe: 0, mild: 1, moderate: 2, high: 3, critical: 4 };

const RISK_OPTIONS = [
  { value: "safe", label: "Safe" },
  { value: "mild", label: "Mild Concern" },
  { value: "moderate", label: "Moderate Risk" },
  { value: "high", label: "High Risk" },
  { value: "critical", label: "Critical Emergency" },
];

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "reviewed", label: "Reviewed" },
  { value: "escalated", label: "Escalated" },
  { value: "awaiting_info", label: "Awaiting Info" },
];

const DATE_PRESETS = [
  { value: "all", label: "All time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function History() {
  const navigate = useNavigate();
  const [all, setAll] = useState<ConversationSummary[] | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [datePreset, setDatePreset] = useState("all");
  const [sort, setSort] = useState<SortOption>("newest");

  useEffect(() => {
    getConversations().then(setAll);
  }, []);

  // Debounced search — history_spec.md §4: 300ms after last keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filtered = useMemo(() => {
    let list = [...(all ?? [])];
    if (search) list = list.filter((c) => c.label.toLowerCase().includes(search.toLowerCase()));
    if (riskFilter.length) list = list.filter((c) => riskFilter.includes(c.riskLevel));
    if (statusFilter.length) list = list.filter((c) => statusFilter.includes(c.reviewStatus));
    if (datePreset !== "all") {
      const days = Number(datePreset);
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      list = list.filter((c) => new Date(c.updatedAt).getTime() >= cutoff);
    }

    list.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        case "risk-desc":
          return RISK_ORDER[b.riskLevel] - RISK_ORDER[a.riskLevel];
        case "risk-asc":
          return RISK_ORDER[a.riskLevel] - RISK_ORDER[b.riskLevel];
        case "confidence-desc":
          return b.confidence - a.confidence;
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    // Escalated-case pinning — Ratification FD-4, identical to Dashboard Queue.
    const escalated = list.filter((c) => c.reviewStatus === "escalated");
    const rest = list.filter((c) => c.reviewStatus !== "escalated");
    return [...escalated, ...rest];
  }, [all, search, riskFilter, statusFilter, datePreset, sort]);

  const activeChips = [
    ...riskFilter.map((v) => ({ kind: "risk" as const, value: v, label: RISK_OPTIONS.find((o) => o.value === v)?.label ?? v })),
    ...statusFilter.map((v) => ({ kind: "status" as const, value: v, label: STATUS_OPTIONS.find((o) => o.value === v)?.label ?? v })),
    ...(datePreset !== "all" ? [{ kind: "date" as const, value: datePreset, label: DATE_PRESETS.find((d) => d.value === datePreset)?.label ?? "" }] : []),
  ];

  function removeChip(kind: "risk" | "status" | "date", value: string) {
    if (kind === "risk") setRiskFilter((v) => v.filter((x) => x !== value));
    if (kind === "status") setStatusFilter((v) => v.filter((x) => x !== value));
    if (kind === "date") setDatePreset("all");
  }

  function clearAll() {
    setRiskFilter([]);
    setStatusFilter([]);
    setDatePreset("all");
    setSearchInput("");
  }

  return (
    <ShellLayout>
      <h1 className="text-2xl font-bold text-foreground-light">History</h1>
      <p className="mt-1 text-foreground-light-muted">
        Every conversation you've reviewed, in one place.
      </p>

      {/* Filter / Search bar */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex w-full max-w-80 items-center gap-2 rounded-input border border-border-light bg-surface-light px-3 py-2 tablet:w-80">
          <Search size={15} className="text-foreground-light-muted" aria-hidden="true" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent text-sm text-foreground-light outline-none placeholder:text-foreground-light-muted"
            aria-label="Search conversations"
          />
          {searchInput && (
            <button onClick={() => setSearchInput("")} aria-label="Clear search">
              <X size={14} className="text-foreground-light-muted" />
            </button>
          )}
        </div>

        <MultiSelectDropdown label="Risk" options={RISK_OPTIONS} selected={riskFilter} onChange={setRiskFilter} />
        <MultiSelectDropdown label="Status" options={STATUS_OPTIONS} selected={statusFilter} onChange={setStatusFilter} />

        <select
          value={datePreset}
          onChange={(e) => setDatePreset(e.target.value)}
          aria-label="Date range"
          className="rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
        >
          {DATE_PRESETS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Applied filter chips */}
      {activeChips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {activeChips.map((chip) => (
            <span
              key={`${chip.kind}-${chip.value}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-light bg-surface-light-muted px-3 py-1 text-xs text-foreground-light"
            >
              {chip.label}
              <button onClick={() => removeChip(chip.kind, chip.value)} aria-label={`Remove ${chip.label} filter`}>
                <X size={12} />
              </button>
            </span>
          ))}
          <button onClick={clearAll} className="text-xs font-medium text-primary hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {/* Result count + sort */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-foreground-light-muted">
          {all ? `${filtered.length} conversation${filtered.length === 1 ? "" : "s"}` : "Loading…"}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          aria-label="Sort by"
          className="rounded-input border border-border-light bg-surface-light px-3 py-2 text-sm text-foreground-light"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="risk-desc">Risk: High to Low</option>
          <option value="risk-asc">Risk: Low to High</option>
          <option value="confidence-desc">Confidence: High to Low</option>
        </select>
      </div>

      {/* Conversation List */}
      <div className="mt-4">
        {!all ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-card bg-surface-light-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <Card className="py-12 text-center text-foreground-light-muted">
            {search ? `No matches for "${search}".` : "No conversations match your filters."}
          </Card>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-card border border-border-light bg-surface-light laptop:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-light text-left text-xs text-foreground-light-muted">
                    <th className="px-5 py-3 font-medium">Conversation</th>
                    <th className="px-5 py-3 font-medium">Risk</th>
                    <th className="px-5 py-3 font-medium">Confidence</th>
                    <th className="px-5 py-3 font-medium">Review Status</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/dashboard/${c.id}`)}
                      className="cursor-pointer border-b border-border-light last:border-0 transition-colors hover:bg-surface-light-muted"
                    >
                      <td className="px-5 py-4 font-medium text-foreground-light">{c.label}</td>
                      <td className="px-5 py-4">
                        <RiskBadge level={c.riskLevel} />
                      </td>
                      <td className="px-5 py-4 tabular-nums">{Math.round(c.confidence * 100)}%</td>
                      <td className="px-5 py-4">
                        <ReviewStatusBadge status={c.reviewStatus} />
                      </td>
                      <td className="px-5 py-4 text-foreground-light-muted" title={c.updatedAt}>
                        {formatDate(c.updatedAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ChevronRight size={16} className="inline text-foreground-light-muted" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-3 laptop:hidden">
              {filtered.map((c) => (
                <Card key={c.id} interactive onClick={() => navigate(`/dashboard/${c.id}`)}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-foreground-light">{c.label}</p>
                    <ChevronRight size={16} className="mt-1 shrink-0 text-foreground-light-muted" />
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <RiskBadge level={c.riskLevel} />
                    <ReviewStatusBadge status={c.reviewStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-foreground-light-muted">
                    <span>{Math.round(c.confidence * 100)}% confidence</span>
                    <span>{formatDate(c.updatedAt)}</span>
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
    </ShellLayout>
  );
}
