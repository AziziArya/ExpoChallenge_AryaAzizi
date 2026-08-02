import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Section Reveal — design.md "Section Reveal":
 *   "Each section appears progressively while scrolling.
 *    Animation: Fade, TranslateY 20px, Duration 300ms, Stagger 80ms"
 *
 * Implemented with Framer Motion per frontend_requirements.md's mandated
 * "Animations: Framer Motion" tech-stack entry. Fires once per element.
 * Framer Motion's `useReducedMotion`-aware defaults + our global
 * prefers-reduced-motion CSS rule (tokens.css) keep this compliant with
 * frontend_architecture.md §12.4.
 */
interface RevealProps {
  children: ReactNode;
  delay?: number; // ms — used for the 80ms stagger between siblings
  className?: string;
}

export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.3, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
