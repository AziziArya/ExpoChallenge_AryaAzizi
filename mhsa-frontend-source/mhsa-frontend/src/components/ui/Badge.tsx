import {
  CheckCircle2,
  CircleDot,
  AlertTriangle,
  Flame,
  Siren,
  Clock,
  CheckCheck,
  Flag,
  HelpCircle,
} from "lucide-react";
import type { RiskLevel, ReviewStatus } from "../../types/conversation";
import { cn } from "../../lib/cn";

/**
 * Risk color mapping — dashboard_spec.md §10, applied identically everywhere
 * Risk appears (Queue, History, Analysis Workspace):
 *   Safe → Green · Mild → Blue-gray · Moderate → Amber ·
 *   High → Orange-Red · Critical → Red (soft-glow reserved for Critical only)
 *
 * Rule: color is never the sole carrier of meaning — every badge pairs
 * an icon and explicit text with its color (design.md, frontend_architecture §12.2).
 */
export const RISK_CONFIG: Record<
  RiskLevel,
  { label: string; icon: typeof CheckCircle2; classes: string }
> = {
  safe: {
    label: "Safe",
    icon: CheckCircle2,
    classes: "bg-success/10 text-success border-success/30",
  },
  mild: {
    label: "Mild Concern",
    icon: CircleDot,
    classes: "bg-slate-500/10 text-slate-600 border-slate-500/30",
  },
  moderate: {
    label: "Moderate Risk",
    icon: AlertTriangle,
    classes: "bg-warning/10 text-warning border-warning/30",
  },
  high: {
    label: "High Risk",
    icon: Flame,
    classes: "bg-danger-high/10 text-danger-high border-danger-high/30",
  },
  critical: {
    label: "Critical Emergency",
    icon: Siren,
    classes: "bg-danger/10 text-danger border-danger/40 shadow-[0_0_0_3px_rgba(220,38,38,0.08)]",
  },
};

const REVIEW_CONFIG: Record<
  ReviewStatus,
  { label: string; icon: typeof Clock; classes: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    classes: "bg-transparent text-foreground-light-muted border-border-light",
  },
  reviewed: {
    label: "Reviewed",
    icon: CheckCheck,
    classes: "bg-foreground-light/5 text-foreground-light border-foreground-light/20",
  },
  escalated: {
    label: "Escalated",
    icon: Flag,
    classes: "bg-danger/10 text-danger border-danger/40",
  },
  awaiting_info: {
    label: "Awaiting Info",
    icon: HelpCircle,
    classes: "bg-warning/10 text-warning border-warning/30",
  },
};

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap";

export function RiskBadge({ level, className }: { level: RiskLevel; className?: string }) {
  const { label, icon: Icon, classes } = RISK_CONFIG[level];
  return (
    <span className={cn(badgeBase, classes, className)}>
      <Icon size={13} aria-hidden="true" />
      {label}
    </span>
  );
}

export function ReviewStatusBadge({
  status,
  className,
}: {
  status: ReviewStatus;
  className?: string;
}) {
  const { label, icon: Icon, classes } = REVIEW_CONFIG[status];
  return (
    <span className={cn(badgeBase, classes, className)}>
      <Icon size={13} aria-hidden="true" />
      {label}
    </span>
  );
}
