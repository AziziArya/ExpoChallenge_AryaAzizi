import { Link } from "react-router-dom";
import { Button } from "../ui/Button";

/**
 * Marketing Nav — the Landing-only nav variant.
 * Source: frontend_architecture.md §2.1 ("Landing is explicitly outside the
 * Shell... uses the lighter marketing-nav variant, with no Sidebar"), §2.3
 * ("transparency-on-scroll is a Landing-only treatment").
 * UX-Wireframe-Specification.md §3: "Secondary link to API Documentation
 * for the Developer persona" alongside the single primary CTA.
 */
export function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-border-light/0 bg-surface-light/80 backdrop-blur-sm transition-colors duration-normal">
      <div className="mx-auto flex h-[72px] max-w-content items-center justify-between px-5 tablet:px-10 desktop:px-16">
        <Link
          to="/"
          className="flex items-center gap-3 font-semibold text-foreground-light"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-primary text-white"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2v6M12 16v6M4.9 4.9l4.2 4.2M14.9 14.9l4.2 4.2M2 12h6M16 12h6M4.9 19.1l4.2-4.2M14.9 9.1l4.2-4.2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="text-[15px] leading-tight">
            Mental Health
            <br />
            Safety Analyzer
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/documentation"
            className="hidden text-sm text-foreground-light-muted transition-colors hover:text-foreground-light tablet:inline"
          >
            Documentation
          </Link>
          <Button to="/dashboard" variant="primary" size="md">
            Open Dashboard
          </Button>
        </nav>
      </div>
    </header>
  );
}
