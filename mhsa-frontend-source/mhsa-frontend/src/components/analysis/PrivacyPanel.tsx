import { motion } from "framer-motion";
import { ShieldCheck, ShieldOff, User, MapPin, Building2, Mail, Phone, Link2 } from "lucide-react";
import type { ConversationDetail } from "../../types/conversationDetail";

/**
 * Privacy Panel — shows that the Privacy Guard ran before any message
 * reached the analysis models, and summarizes what kind of personal
 * information was found and anonymized. This is deliberately shown
 * as a first-class panel (not buried in a tab) since privacy is one
 * of the project's core pillars, not a side detail.
 */

const CATEGORY_CONFIG: Record<string, { label: string; icon: typeof User }> = {
  PERSON: { label: "Names", icon: User },
  LOCATION: { label: "Locations", icon: MapPin },
  ORGANIZATION: { label: "Organizations", icon: Building2 },
  EMAIL: { label: "Emails", icon: Mail },
  PHONE: { label: "Phone Numbers", icon: Phone },
  URL: { label: "Links", icon: Link2 },
  IP: { label: "IP Addresses", icon: Link2 },
};

export function PrivacyPanel({ data }: { data: ConversationDetail }) {
  const privacy = data.privacy;

  const active = privacy?.active ?? false;
  const total = privacy?.totalEntitiesRemoved ?? 0;
  const messagesWithPii = privacy?.messagesWithPii ?? 0;
  const categories = privacy?.categories ?? {};

  const categoryEntries = Object.entries(categories).filter(([, count]) => count > 0);

  return (
    <div className="rounded-card border border-border-light bg-surface-light p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground-light">Privacy Guard</h2>

        <span
          className={
            "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium " +
            (active
              ? "bg-success/10 text-success"
              : "bg-surface-light-muted text-foreground-light-muted")
          }
        >
          {active ? <ShieldCheck size={12} aria-hidden="true" /> : <ShieldOff size={12} aria-hidden="true" />}
          {active ? "Active" : "Not Available"}
        </span>
      </div>

      <p className="mt-2 text-sm text-foreground-light-muted">
        Before any message reached the analysis models, personal information was
        automatically detected and replaced with category placeholders (e.g.{" "}
        <code className="rounded bg-surface-light-muted px-1 py-0.5 text-xs">[PERSON]</code>).
        Only the anonymized text is analyzed.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-[10px] border border-border-light bg-surface-light-muted p-3">
          <p className="text-xs text-foreground-light-muted">Entities Removed</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground-light">{total}</p>
        </div>
        <div className="rounded-[10px] border border-border-light bg-surface-light-muted p-3">
          <p className="text-xs text-foreground-light-muted">Messages with PII</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-foreground-light">
            {messagesWithPii}
            <span className="text-sm font-normal text-foreground-light-muted">
              {" "}
              / {data.messageCount}
            </span>
          </p>
        </div>
      </div>

      {categoryEntries.length > 0 ? (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">
            Detected Categories
          </p>
          <div className="mt-2 space-y-2">
            {categoryEntries.map(([category, count], i) => {
              const config = CATEGORY_CONFIG[category] ?? { label: category, icon: ShieldCheck };
              const Icon = config.icon;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  className="flex items-center justify-between rounded-[8px] bg-surface-light-muted px-3 py-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-foreground-light">
                    <Icon size={14} className="text-foreground-light-muted" aria-hidden="true" />
                    {config.label}
                  </span>
                  <span className="tabular-nums font-medium text-foreground-light">{count}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="mt-5 text-sm text-foreground-light-muted">
          No personal information was detected in this conversation.
        </p>
      )}
    </div>
  );
}
