import { cn } from "../../lib/cn";

/**
 * ThinkingOrb — a small animated glowing orb with orbiting dots,
 * shown while the chatbot is generating a reply (and, implicitly,
 * while the safety pipeline is analyzing the message in the
 * background). Pure CSS animation, no canvas/WebGL dependency, so it
 * stays cheap and themeable via the existing CSS variables.
 */
export function ThinkingOrb({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? 28 : 40;
  const dotCount = 5;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: box, height: box }}
      role="status"
      aria-label="Thinking"
    >
      {/* soft glowing core */}
      <div
        className="absolute rounded-full orb-core"
        style={{
          width: box * 0.55,
          height: box * 0.55,
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--color-primary) 75%, white) 0%, color-mix(in srgb, var(--color-primary) 35%, transparent) 60%, transparent 100%)",
        }}
      />

      {/* orbiting dots */}
      <div className="absolute inset-0 orb-spin">
        {Array.from({ length: dotCount }).map((_, i) => {
          const angle = (360 / dotCount) * i;
          const radius = box * 0.42;
          return (
            <span
              key={i}
              className="absolute rounded-full orb-dot"
              style={{
                width: box * 0.1,
                height: box * 0.1,
                top: "50%",
                left: "50%",
                background: "var(--color-primary)",
                transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`,
                animationDelay: `${i * 0.12}s`,
              }}
            />
          );
        })}
      </div>

      <style>{`
        .orb-core {
          animation: orb-pulse 1.6s ease-in-out infinite;
        }
        .orb-spin {
          animation: orb-rotate 3.2s linear infinite;
        }
        .orb-dot {
          animation: orb-dot-pulse 1.6s ease-in-out infinite;
        }
        @keyframes orb-pulse {
          0%, 100% { transform: scale(0.85); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes orb-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes orb-dot-pulse {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .orb-core, .orb-spin, .orb-dot { animation: none; }
        }
      `}</style>
    </div>
  );
}

/** Inline "thinking" row for a chat transcript: orb + subtle label. */
export function ThinkingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <ThinkingOrb size="sm" />
      <span className="text-sm text-foreground-light-muted">Thinking…</span>
    </div>
  );
}
