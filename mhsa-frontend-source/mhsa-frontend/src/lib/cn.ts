import clsx, { type ClassValue } from "clsx";

/**
 * Merge conditional class names. Kept intentionally minimal —
 * no new styling abstraction beyond simple concatenation, since
 * the design system's tokens (Tailwind config + tokens.css) are
 * the single source of truth for values.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
