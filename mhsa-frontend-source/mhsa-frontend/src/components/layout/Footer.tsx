import { Link } from "react-router-dom";

/**
 * Footer — UX-Wireframe-Specification.md §3: "Footer (docs, API, license, about)".
 * Retained on Landing per frontend_architecture.md §2.6 (Footer exception:
 * Landing and Documentation are the pages that keep a persistent Footer).
 *
 * Real routes, not hash anchors: "API" and "Documentation" both point to
 * the Documentation page (its own API section is reached via #api, an
 * in-page anchor on that page — not a dead cross-page hash). "License"
 * points to About, which already contains the Version & License section.
 */
const links = [
  { label: "Documentation", to: "/documentation" },
  { label: "API", to: "/documentation#api" },
  { label: "About", to: "/about" },
  { label: "License", to: "/about" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-light bg-surface-light">
      <div className="mx-auto flex max-w-content flex-col gap-6 px-5 py-10 tablet:flex-row tablet:items-center tablet:justify-between tablet:px-10 desktop:px-16">
        <p className="text-sm text-foreground-light-muted">
          Mental Health Safety Analyzer — MIT License, © 2026 Arya Azizi
        </p>
        <nav className="flex flex-wrap gap-6">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="text-sm text-foreground-light-muted transition-colors hover:text-foreground-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
