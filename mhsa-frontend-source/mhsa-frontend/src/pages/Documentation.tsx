import { Link } from "react-router-dom";
import {
  ShieldCheck,
  GitMerge,
  Brain,
  FlaskConical,
  FileJson,
  ArrowRight,
} from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Card } from "../components/ui/Card";

const TOPICS = [
  {
    icon: GitMerge,
    title: "System Architecture",
    body: "Conversation Input → Privacy Guard → Emotion / Distress / Crisis Detection → Conversation Pattern Analysis → Context Fusion Engine → Risk Decision Engine → Explainable AI Report.",
  },
  {
    icon: Brain,
    title: "AI Pipeline & Models",
    body: "Multiple independent analysis modules (Emotion, Distress, Crisis, Pattern) feed a Context Fusion Engine, which produces a single, confidence-scored risk decision rather than relying on one model.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy & Safety",
    body: "Personally identifiable information (names, phone numbers, emails, addresses) is detected and can be anonymized before any text reaches an analysis model.",
  },
  {
    icon: FlaskConical,
    title: "Testing & Evaluation",
    body: "Unit, integration, and API-level tests validate the pipeline, privacy layer, and risk-scoring logic (see the project's README for current coverage).",
  },
];

/**
 * Documentation — a simple, single-page overview. This intentionally does
 * not attempt the full multi-section Documentation/API template from
 * documentation-api_spec.md; it exists to give "Documentation" and "API"
 * links (Landing, Footer) a real, working destination instead of a dead
 * '#documentation' hash.
 */
export default function Documentation() {
  return (
    <ShellLayout>
      <div className="mx-auto max-w-reading">
        <h1 className="text-2xl font-bold text-foreground-light">Documentation</h1>
        <p className="mt-1 text-foreground-light-muted">
          A short overview of how Mental Health Safety Analyzer works.
        </p>

        <div className="mt-8 space-y-4">
          {TOPICS.map((t) => (
            <Card key={t.title}>
              <div className="flex items-start gap-3">
                <t.icon size={20} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="text-base font-semibold text-foreground-light">{t.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-light-muted">{t.body}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div id="api" className="mt-10 scroll-mt-8">
          <h2 className="text-lg font-semibold text-foreground-light">API</h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground-light-muted">
            The backend exposes a small REST surface — <code className="rounded bg-surface-light-muted px-1.5 py-0.5 text-xs">GET /health</code>{" "}
            and <code className="rounded bg-surface-light-muted px-1.5 py-0.5 text-xs">POST /analyze</code> — which
            accepts a conversation and returns a risk level, confidence score, and detected signals.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-card border border-border-light bg-surface-light-muted p-4">
            <FileJson size={16} className="shrink-0 text-foreground-light-muted" aria-hidden="true" />
            <pre className="overflow-x-auto text-xs text-foreground-light">
{`{
  "risk_level": "moderate",
  "confidence": 0.82,
  "detected_signals": ["negative emotion", "hopelessness indicators"]
}`}
            </pre>
          </div>
        </div>

        <div className="mt-10 border-t border-border-light pt-6">
          <Link
            to="/about"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            About this project <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </ShellLayout>
  );
}
