import { ShieldCheck, Eye, HeartHandshake, ArrowRight, ArrowDown } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Reveal } from "../components/ui/Reveal";
import { MarketingNav } from "../components/layout/MarketingNav";
import { Footer } from "../components/layout/Footer";

/**
 * Landing Page
 *
 * Structure locked to UX-Wireframe-Specification.md §3:
 *   Top Nav (marketing variant) → Hero Zone → Trust Zone →
 *   Workflow Preview Zone → Footer
 *
 * No Shell, no Sidebar, no Top/Middle/Bottom zoning — Landing sits outside
 * the authenticated Shell entirely (frontend_architecture.md §2.1, §5.1).
 *
 * Content is drawn directly from ProjectVision.md ("Vision", "Human-Centered
 * AI", "Privacy First", "Future Clinical Workflow") and README.md
 * ("Limitations", "Author", "License") — no new claims or features invented.
 */

const workflowSteps = [
  "Patient",
  "Text Conversation",
  "AI Analysis",
  "Structured Report",
  "Mental Health Professional",
  "Final Clinical Decision",
];

const trustCards = [
  {
    icon: Eye,
    title: "Explainability-first",
    body: "Every AI decision includes a reason, not just a label — increased hopelessness, crisis-related language, or an escalating trend, stated in plain language.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first",
    body: "Personal information such as names, phone numbers, and addresses is detected and can be anonymized before any AI analysis takes place.",
  },
  {
    icon: HeartHandshake,
    title: "Not a diagnostic tool",
    body: "This system does not diagnose or replace psychologists, psychiatrists, or licensed mental health professionals. It supports human review — it does not decide.",
  },
];

export default function Landing() {
  return (
    <div id="top" className="min-h-full bg-surface-light">
      <MarketingNav />

      {/* HERO ZONE — UX-Wireframe-Specification.md §3 */}
      <section className="mx-auto max-w-content px-5 pb-16 pt-16 text-center tablet:px-10 tablet:pb-24 tablet:pt-24 desktop:px-16 desktop:pb-32 desktop:pt-32">
        <Reveal>
          <p className="mx-auto mb-4 inline-flex items-center rounded-full border border-border-light bg-surface-light-muted px-4 py-1.5 text-sm font-medium text-secondary">
            AI assists. Humans decide.
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-foreground-light tablet:text-5xl desktop:text-6xl">
            Mental Health Safety Analyzer
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground-light-muted tablet:text-xl">
            An AI-powered decision-support platform that helps professionals
            identify emotional distress, psychological deterioration, and
            potential crisis situations in text conversations — so they can
            prioritize risky cases and decide faster, with confidence.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 tablet:flex-row">
            <Button to="/dashboard" variant="primary" size="lg">
              Open Dashboard
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button to="/documentation" variant="ghost" size="lg">
              Read the documentation
            </Button>
          </div>
        </Reveal>
      </section>

      {/* TRUST ZONE — UX-Wireframe-Specification.md §3 */}
      <section className="border-y border-border-light bg-surface-light-muted">
        <div className="mx-auto max-w-content px-5 py-16 tablet:px-10 tablet:py-20 desktop:px-16">
          <Reveal>
            <h2 className="text-center text-2xl font-semibold text-foreground-light tablet:text-3xl">
              Built to support professionals, not replace them
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-6 tablet:grid-cols-3">
            {trustCards.map((card, i) => (
              <Reveal key={card.title} delay={80 * (i + 1)}>
                <Card className="h-full">
                  <card.icon
                    className="mb-4 text-primary"
                    size={28}
                    aria-hidden="true"
                    strokeWidth={1.75}
                  />
                  <h3 className="text-base font-semibold text-foreground-light">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-light-muted">
                    {card.body}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WORKFLOW PREVIEW ZONE — UX-Wireframe-Specification.md §3
          Desktop: horizontal flow diagram. Mobile: vertical flow diagram. */}
      <section className="mx-auto max-w-content px-5 py-16 tablet:px-10 tablet:py-20 desktop:px-16">
        <Reveal>
          <h2 className="text-center text-2xl font-semibold text-foreground-light tablet:text-3xl">
            How a conversation becomes a clinical decision
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-foreground-light-muted">
            The AI never makes the final call — it organizes information and
            highlights signals for a qualified professional to review.
          </p>
        </Reveal>

        {/* Desktop / tablet: horizontal */}
        <Reveal delay={120}>
          <div className="mt-12 hidden items-stretch justify-between tablet:flex">
            {workflowSteps.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center gap-3 text-center">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-foreground-light">
                    {step}
                  </span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight
                    className="mx-2 shrink-0 text-foreground-light-muted"
                    size={18}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        {/* Mobile: vertical */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-center gap-3 tablet:hidden">
            {workflowSteps.map((step, i) => (
              <div key={step} className="flex flex-col items-center">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium text-foreground-light">
                    {step}
                  </span>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowDown
                    className="my-2 text-foreground-light-muted"
                    size={16}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
