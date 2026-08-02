import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Smile,
  Frown,
  Siren,
  ListTree,
  GitMerge,
  Scale,
  MessageSquareQuote,
  Send,
  Check,
} from "lucide-react";
import { cn } from "../../lib/cn";

const STAGES = [
  { label: "Privacy Guard", icon: ShieldCheck },
  { label: "Emotion Analysis", icon: Smile },
  { label: "Distress Detection", icon: Frown },
  { label: "Crisis Detection", icon: Siren },
  { label: "Pattern Analysis", icon: ListTree },
  { label: "Context Fusion", icon: GitMerge },
  { label: "Decision Engine", icon: Scale },
  { label: "Explainability", icon: MessageSquareQuote },
  { label: "Safe Response", icon: Send },
];

const STAGE_DURATION_MS = 420;

/**
 * AI Pipeline Progress (Full state) — the mandatory loading pattern for
 * the analysis operation (frontend_architecture.md §9.4): never a generic
 * spinner. Sequential activation, aria-live announces each transition
 * (frontend_architecture.md §12.2).
 */
export function PipelineProgress({ onComplete }: { onComplete: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= STAGES.length) {
      const t = setTimeout(onComplete, 500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setActiveIndex((i) => i + 1), STAGE_DURATION_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const currentLabel =
    activeIndex < STAGES.length ? STAGES[activeIndex].label : "Finishing up";

  return (
    <div className="rounded-card border border-border-light bg-surface-light p-8">
      <p className="mb-6 text-center text-sm text-foreground-light-muted" aria-live="polite">
        {activeIndex < STAGES.length
          ? `Currently processing: ${currentLabel}`
          : "Analysis complete — preparing report..."}
      </p>
      <div className="flex flex-col items-center gap-4 tablet:flex-row tablet:justify-between">
        {STAGES.map((stage, i) => {
          const status = i < activeIndex ? "complete" : i === activeIndex ? "active" : "pending";
          return (
            <div key={stage.label} className="flex flex-1 flex-col items-center gap-2 tablet:flex-row">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={
                    status === "active"
                      ? { opacity: [0.6, 1, 0.6] }
                      : { opacity: 1 }
                  }
                  transition={
                    status === "active" ? { duration: 0.9, repeat: Infinity } : { duration: 0.22 }
                  }
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2",
                    status === "complete" && "border-success bg-success/10 text-success",
                    status === "active" && "border-secondary bg-secondary/10 text-secondary",
                    status === "pending" && "border-border-light text-foreground-light-muted"
                  )}
                >
                  {status === "complete" ? (
                    <Check size={16} aria-hidden="true" />
                  ) : (
                    <stage.icon size={16} aria-hidden="true" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-center text-xs",
                    status === "pending" ? "text-foreground-light-muted" : "font-medium text-foreground-light"
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div className="hidden h-px flex-1 bg-border-light tablet:block" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
