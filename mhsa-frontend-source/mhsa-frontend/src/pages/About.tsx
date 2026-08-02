import { Link2, Globe, ExternalLink } from "lucide-react";
import { ShellLayout } from "../components/layout/ShellLayout";
import { Footer } from "../components/layout/Footer";
import { Reveal } from "../components/ui/Reveal";

const PHILOSOPHY_CHIPS = ["Explainable", "Transparent", "Privacy-aware", "Human-supervised", "Safe"];
const PRINCIPLE_CHIPS = ["Professional", "Calm", "Minimal", "Trustworthy", "Accessible", "Readable"];

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border-light bg-surface-light-muted px-3 py-1 text-sm text-foreground-light">
      {label}
    </span>
  );
}

/**
 * About — about_spec.md. Static, single-column, no zoning, reading-width
 * (720px). Six sections in fixed order: Mission → Core Philosophy →
 * Product Principles → Non-Diagnostic Disclaimer → Project & Author →
 * Version & License. Content sourced directly from ProjectVision.md and
 * README.md — no new claims introduced.
 */
export default function About() {
  return (
    <ShellLayout>
      <Reveal>
      <div className="mx-auto max-w-reading">
        <h1 className="text-2xl font-bold text-foreground-light">About</h1>
        <p className="mt-1 text-foreground-light-muted">
          Why this product exists, and the principles it is built on.
        </p>

        {/* Mission */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground-light">Mission</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-light">
            Mental Health Safety Analyzer is an AI-powered decision-support platform designed to
            help professionals identify emotional distress, psychological deterioration, and
            potential crisis situations during text conversations. It is not intended to replace
            psychologists, psychiatrists, or mental health professionals — it serves as an
            intelligent assistant that helps experts understand conversations, prioritize risky
            cases, and make faster, more informed decisions.
          </p>
        </section>

        {/* Core Philosophy */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground-light">Core Philosophy</h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-light">
            Artificial Intelligence should support professionals, not replace them.
          </p>
          <p className="mt-3 text-sm text-foreground-light-muted">
            Every AI decision in this system is designed to be:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PHILOSOPHY_CHIPS.map((c) => (
              <Chip key={c} label={c} />
            ))}
          </div>
        </section>

        {/* Product Principles */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground-light">How the interface should feel</h2>
          <p className="mt-3 text-sm text-foreground-light-muted">The interface must always feel:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRINCIPLE_CHIPS.map((c) => (
              <Chip key={c} label={c} />
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground-light-muted">
            The application should never feel like a social media platform. It should feel like
            professional software built for serious, high-stakes work.
          </p>
        </section>

        {/* Non-Diagnostic Disclaimer — visually isolated, spacing not alarm color */}
        <div className="my-10 border-t border-border-light" />
        <section>
          <h2 className="text-lg font-semibold text-foreground-light">
            What this system is — and is not
          </h2>
          <p className="mt-3 text-base leading-relaxed text-foreground-light">
            Mental Health Safety Analyzer does not provide medical diagnosis. It does not replace
            psychologists, psychiatrists, or licensed mental health professionals. It is designed
            solely as an AI-assisted conversation safety analysis and decision-support tool.
            Medium- and high-risk conversations always require human professional review, and the
            final clinical decision always remains with a qualified professional.
          </p>
        </section>
        <div className="my-10 border-t border-border-light" />

        {/* Project & Author */}
        <section>
          <h2 className="text-lg font-semibold text-foreground-light">About this project</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground-light-muted">
            Mental Health Safety Analyzer is a research prototype exploring how AI can responsibly
            support — never replace — mental health professionals. Version 1.1.0 is a stable
            research release.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary/15 text-sm font-semibold text-secondary">
              AA
            </span>
            <div>
              <p className="text-sm font-medium text-foreground-light">Arya Azizi</p>
              <div className="mt-0.5 flex gap-3">
                <a
                  href="https://github.com/AziziArya"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Link2 size={12} /> GitHub (opens in new tab)
                </a>
                <a
                  href="https://aryahub.ir"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <Globe size={12} /> Portfolio (opens in new tab)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Version & License */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-foreground-light">Version &amp; License</h2>
          <span className="mt-3 inline-block rounded-full border border-border-light bg-surface-light-muted px-2.5 py-1 text-xs font-medium text-foreground-light">
            v1.1.0
          </span>
          <p className="mt-2 text-xs text-foreground-light-muted">Released July 2026.</p>
          <p className="mt-2 text-sm text-foreground-light-muted">
            Licensed under the MIT License. © 2026 Arya Azizi.
          </p>
          <a
            href="https://github.com/AziziArya/Mental-Health-Safety-Analyzer/blob/main/LICENSE"
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View full license <ExternalLink size={12} />
          </a>
        </section>
      </div>
      </Reveal>

      <div className="-mx-5 mt-16 tablet:-mx-10 laptop:-mx-16">
        <Footer />
      </div>
    </ShellLayout>
  );
}
