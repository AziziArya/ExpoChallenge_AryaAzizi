import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/cn";

/**
 * Card — components.md "Data Display > Card" (Default variant)
 *
 * Rules applied:
 *  - Radius 20px, fixed (design.md; Ratification FD-1 — not a 16–20px range)
 *  - 1px neutral border, soft shadow only (never heavy)
 *  - Padding: 24px desktop / 20px tablet / 16px mobile
 *  - Flat, stable, never decorative — no gradients
 *  - Static/informational cards never receive hover motion
 *    (frontend_architecture.md §13.3) — hover lift is opt-in via `interactive`
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export function Card({ children, interactive = false, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-light bg-surface-light shadow-card",
        "p-4 tablet:p-5 desktop:p-6",
        interactive &&
          "transition-[transform,box-shadow] duration-normal ease-out hover:-translate-y-1 hover:shadow-card-hover cursor-pointer",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
