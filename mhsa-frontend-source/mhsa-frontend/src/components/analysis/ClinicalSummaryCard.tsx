import { Download, Clock } from "lucide-react";
import { Button } from "../ui/Button";
import { RiskBadge } from "../ui/Badge";
import type { ConversationDetail } from "../../types/conversationDetail";

const TREND_TEXT: Record<string, string> = {
  improving:
    "Emotional tone has been improving across the conversation.",

  stable:
    "Emotional tone has remained broadly stable.",

  worsening:
    "Emotional tone has been worsening across the conversation.",

  "Negative Escalation":
    "Negative emotional patterns increased across the conversation.",

  "Positive Improvement":
    "Emotional state shows signs of improvement.",

  Increasing:
    "Risk indicators increased throughout the conversation.",

  Decreasing:
    "Risk indicators decreased throughout the conversation.",
};


export function ClinicalSummaryCard({
  data,
}: {
  data: ConversationDetail;
}) {

  const trendText =
    TREND_TEXT[data.trend] ??
    "Emotional trend analysis completed based on conversation signals.";


  return (
    <div className="rounded-card border border-border-light bg-surface-light p-6">

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

        <h2 className="text-lg font-semibold text-foreground-light">
          Clinical Summary
        </h2>


        <Button size="md" variant="secondary">
          <Download size={15} />
          Export Report
        </Button>

      </div>



      <div className="grid gap-4 tablet:grid-cols-2">


        <SummaryRow label="Conversation Summary">

          {data.label} — {data.participantCount} participants,{" "}
          {data.messageCount} messages reviewed.

        </SummaryRow>



        <SummaryRow label="Emotional Trend">

          {trendText}

        </SummaryRow>




        <SummaryRow label="Main Concerns">

          <div className="flex flex-wrap gap-1.5">

            {data.signals.length > 0 ? (

              data.signals.map((s) => (

                <span
                  key={s.id}
                  className="rounded-full border border-border-light bg-surface-light-muted px-2.5 py-1 text-xs text-foreground-light"
                >
                  {s.label}
                </span>

              ))

            ) : (

              <span className="text-sm text-foreground-light-muted">
                No major concerns detected.
              </span>

            )}

          </div>

        </SummaryRow>





        <SummaryRow label="Detected Risk">

          <RiskBadge level={data.riskLevel} />

        </SummaryRow>





        <SummaryRow label="Recommended Human Review">

          {data.recommendation}

        </SummaryRow>





        <SummaryRow label="Time Saved">

          <span className="inline-flex items-center gap-1.5 text-foreground-light-muted">

            <Clock
              size={13}
              aria-hidden="true"
            />

            Estimated review time saved: ~14 minutes

          </span>

        </SummaryRow>



      </div>

    </div>
  );
}





function SummaryRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {

  return (

    <div>

      <p className="text-xs font-medium uppercase tracking-wide text-foreground-light-muted">

        {label}

      </p>


      <div className="mt-1 text-sm leading-relaxed text-foreground-light">

        {children}

      </div>


    </div>

  );
}