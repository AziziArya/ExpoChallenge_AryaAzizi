import { useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  ShieldCheck,
  Smile,
  Frown,
  Siren,
  ListTree,
  GitMerge,
  Check,
  RotateCcw,
} from "lucide-react";
import type { FusionContribution } from "../../types/conversation";
import type { ConversationDetail } from "../../types/conversationDetail";
import { RISK_CONFIG } from "../ui/Badge";
import { cn } from "../../lib/cn";

type TabId = "fusion" | "risk" | "emotion" | "heatmap" | "pipeline";

const TABS: { id: TabId; label: string }[] = [
  { id: "fusion", label: "Fusion" },
  { id: "risk", label: "Risk Timeline" },
  { id: "emotion", label: "Emotion Timeline" },
  { id: "heatmap", label: "Heatmap" },
  { id: "pipeline", label: "Pipeline" },
];

export function AnalysisTabs({ data }: { data: ConversationDetail }) {
  const [active, setActive] = useState<TabId>("fusion");

  return (
    <div className="flex h-full flex-col rounded-card border border-border-light bg-surface-light">
      <div className="flex border-b border-border-light px-2">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={cn(
              "relative h-11 px-3 text-sm font-medium transition-colors duration-fast",
              active === tab.id
                ? "text-primary"
                : "text-foreground-light-muted hover:text-foreground-light"
            )}
          >
            {tab.label}
            {active === tab.id && (
              <motion.span
                layoutId="tab-underline"
                className="absolute inset-x-0 -bottom-px h-[2px] bg-primary"
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {active === "fusion" && <FusionPanel fusion={data.fusion} riskLevel={data.riskLevel} />}
        {active === "risk" && <RiskTimelinePanel points={data.riskTimeline} />}
        {active === "emotion" && <EmotionTimelinePanel data={data.emotionTimeline} trend={data.trend} />}
        {active === "heatmap" && <HeatmapPanel messages={data.messages} />}
        {active === "pipeline" && <PipelinePanel />}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Fusion Engine — dashboard_spec.md §13                             */
/* ---------------------------------------------------------------- */
function FusionPanel({
  fusion,
  riskLevel,
}: {
  fusion: FusionContribution;
  riskLevel: ConversationDetail["riskLevel"];
}) {
  const rows: { key: keyof FusionContribution; label: string }[] = [
    { key: "emotion", label: "Emotion" },
    { key: "distress", label: "Distress" },
    { key: "crisis", label: "Crisis" },
    { key: "pattern", label: "Pattern" },
  ];
  const { label: riskLabel, icon: Icon } = RISK_CONFIG[riskLevel];

  return (
    <div>
      <p className="mb-4 text-sm text-foreground-light-muted">
        How each AI module contributed to the final decision.
      </p>
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.key}>
            <div className="mb-1 flex items-center justify-between text-xs text-foreground-light-muted">
              <span>{row.label}</span>
              <span className="tabular-nums">{fusion[row.key]}%</span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-surface-light-muted">
              <motion.div
                className="h-full rounded-full bg-secondary"
                initial={{ width: 0 }}
                animate={{ width: `${fusion[row.key]}%` }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                style={{ opacity: 0.45 + i * 0.15 }}
              />
            </div>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="mt-5 flex items-center justify-center gap-2 rounded-card border border-border-light bg-surface-light-muted py-3"
      >
        <Icon size={16} aria-hidden="true" />
        <span className="text-sm font-semibold text-foreground-light">
          Final Decision: {riskLabel}
        </span>
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Risk Timeline — dashboard_spec.md §9 Middle Zone tab               */
/* ---------------------------------------------------------------- */
function RiskTimelinePanel({
  points,
}: {
  points: ConversationDetail["riskTimeline"];
}) {
  return (
    <div>
      <p className="mb-6 text-sm text-foreground-light-muted">
        How the AI's risk decision evolved as the conversation progressed.
      </p>

      {points.length === 0 ? (
        <div className="rounded-card border border-border-light bg-surface-light-muted p-4 text-sm text-foreground-light-muted">
          No risk timeline data available.
        </div>
      ) : (
        <div className="overflow-x-auto pb-3">
          <div className="flex min-w-max items-start">
            {points.map((p, i) => {
              const config = RISK_CONFIG[p.level];

              const Icon = config.icon;

              return (
                <div
                  key={p.index}
                  className="flex items-start"
                >
                  <div className="flex flex-col items-center gap-2">

                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border",
                        config.classes
                      )}
                    >
                      <Icon size={16} />
                    </span>


                    <span className="text-[11px] text-foreground-light-muted">
                      Message {p.index + 1}
                    </span>


                    <span className="text-xs font-semibold text-foreground-light">
                      {config.label}
                    </span>

                  </div>


                  {i < points.length - 1 && (
                    <div className="mt-5 h-px w-12 bg-border-light" />
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Emotion Timeline — dashboard_spec.md §14                          */
/* ---------------------------------------------------------------- */
const TREND_BADGE = {
  improving: { label: "Improving", classes: "text-success bg-success/10" },
  stable: { label: "Stable", classes: "text-foreground-light-muted bg-surface-light-muted" },
  worsening: { label: "Worsening", classes: "text-danger bg-danger/10" },
};

function EmotionTimelinePanel({
  data,
  trend,
}: {
  data: ConversationDetail["emotionTimeline"];
  trend: ConversationDetail["trend"];
}) {
  const badge = TREND_BADGE[trend];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-foreground-light-muted">Sadness, fear, anger, and hope over time.</p>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-medium", badge.classes)}>
          {badge.label}
        </span>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="index" hide />
            <Tooltip
              contentStyle={{ borderRadius: 10, borderColor: "#E4E4E7", fontSize: 12 }}
            />
            <Line type="monotone" dataKey="sadness" stroke="#2563EB" strokeWidth={2} dot={false} name="Sadness" />
            <Line type="monotone" dataKey="fear" stroke="#7C3AED" strokeWidth={2} dot={false} name="Fear" />
            <Line type="monotone" dataKey="anger" stroke="#EA580C" strokeWidth={2} dot={false} name="Anger" />
            <Line type="monotone" dataKey="hope" stroke="#16A34A" strokeWidth={2} dot={false} name="Hope" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-foreground-light-muted">
        <LegendDot color="#2563EB" label="Sadness" />
        <LegendDot color="#7C3AED" label="Fear" />
        <LegendDot color="#EA580C" label="Anger" />
        <LegendDot color="#16A34A" label="Hope" />
      </div>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* Heatmap — dashboard_spec.md §15                                   */
/* ---------------------------------------------------------------- */
function HeatmapPanel({ messages }: { messages: ConversationDetail["messages"] }) {
  return (
    <div>
      <p className="mb-4 text-sm text-foreground-light-muted">
        Emotional intensity across the conversation — spot escalation at a glance.
      </p>
      <div className="flex h-16 gap-0.5 overflow-hidden rounded-[10px]">
        {messages.map((m) => (
          <div
            key={m.id}
            className="flex-1"
            title={`${m.speaker} · ${new Date(m.timestamp).toLocaleTimeString()} · ${
              m.emotionIntensity > 0.6 ? "High" : m.emotionIntensity > 0.35 ? "Medium" : "Low"
            } intensity`}
            style={{
              backgroundColor: `rgba(220,38,38,${0.12 + m.emotionIntensity * 0.75})`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-foreground-light-muted">
        <span>Start of conversation</span>
        <span>Most recent</span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* Pipeline (compact state) — dashboard_spec.md §12                  */
/* ---------------------------------------------------------------- */
const PIPELINE_STAGES = [
  { label: "Privacy Guard", icon: ShieldCheck },
  { label: "Emotion Analysis", icon: Smile },
  { label: "Distress Detection", icon: Frown },
  { label: "Crisis Detection", icon: Siren },
  { label: "Pattern Analysis", icon: ListTree },
  { label: "Context Fusion", icon: GitMerge },
];

function PipelinePanel() {
  const [key, setKey] = useState(0);
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-foreground-light-muted">
          Every stage completed for this analysis.
        </p>
        <button
          onClick={() => setKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground-light-muted hover:text-primary"
        >
          <RotateCcw size={12} aria-hidden="true" /> Replay Analysis
        </button>
      </div>
      <div key={key} className="flex flex-wrap items-center gap-2" aria-live="polite">
        {PIPELINE_STAGES.map((stage, i) => (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/5 px-3 py-1.5 text-xs font-medium text-success"
          >
            <Check size={12} aria-hidden="true" />
            {stage.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
