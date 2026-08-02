import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Circle } from "lucide-react";
import type { ConversationDetail } from "../../types/conversationDetail";
import { RISK_CONFIG } from "../ui/Badge";

/**
 * Explainability Report — dashboard_spec.md §11. Fixed section order,
 * never reordered. Reason Graph is Tier 3 (frontend_architecture.md §1.5):
 * collapsed by default, expand is a deliberate action.
 */
export function ExplainabilityPanel({ data }: { data: ConversationDetail }) {
  const [graphOpen, setGraphOpen] = useState(false);
  const { label: riskLabel } = RISK_CONFIG[data.riskLevel];

  return (
    <div className="rounded-card border border-border-light bg-surface-light p-6">
      <h2 className="text-lg font-semibold text-foreground-light">Explainability Report</h2>

      {/* 1. Detected Signals */}
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
          Detected Signals
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {data.signals.map((s) => (
            <span
              key={s.id}
              className="rounded-full border border-border-light bg-surface-light-muted px-2.5 py-1 text-xs text-foreground-light"
            >
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Reasoning — natural language, sequential reveal */}
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
          Reasoning
        </p>
        <div className="mt-2 space-y-2.5">
          {data.signals.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.22 }}
              className="flex items-start gap-2 text-[15px] leading-relaxed text-foreground-light"
            >
              <Circle size={6} className="mt-2 shrink-0 fill-secondary text-secondary" aria-hidden="true" />
              {s.label}.
            </motion.div>
          ))}
        </div>
      </div>

      {/* 3. Confidence */}
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
          Confidence
        </p>
        <p className="mt-1 text-sm text-foreground-light">
          The AI is <span className="font-semibold">{Math.round(data.confidence * 100)}%</span>{" "}
          confident in this assessment, based on the strength and consistency of the signals
          detected above.
        </p>
      </div>

      {/* 4. Recommendation */}
      <div className="mt-5">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
          Recommendation
        </p>
        <p className="mt-1 text-sm text-foreground-light">{data.recommendation}</p>
      </div>

      {/* 5. AI Reason Graph — collapsed by default */}
      <div className="mt-5 border-t border-border-light pt-4">
        <button
          onClick={() => setGraphOpen((v) => !v)}
          aria-expanded={graphOpen}
          className="flex items-center gap-1.5 text-sm font-medium text-secondary hover:opacity-80"
        >
          <ChevronDown
            size={14}
            className={`transition-transform duration-fast ${graphOpen ? "rotate-180" : ""}`}
          />
          {graphOpen ? "Hide" : "View"} AI Reason Graph
        </button>

        <AnimatePresence>
          {graphOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {[...data.signals.map((s) => s.label), riskLabel].map((node, i, arr) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-xs font-medium text-secondary">
                      {node}
                    </span>
                    {i < arr.length - 1 && (
                      <span className="text-secondary/50" aria-hidden="true">
                        →
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
