import { forwardRef } from "react";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { Link, type LinkProps } from "react-router-dom";
import { cn } from "../../lib/cn";

/**
 * Button — components.md "Foundations > Button"
 *
 * Only the variants/sizes needed for the Landing Page are implemented here.
 * Rules applied from components.md:
 *  - Only one Primary button per action group (enforced by usage, not by code)
 *  - Radius 14px (design.md "Border Radius")
 *  - Min height 44px (accessibility touch target)
 *  - Hover: scale 1.02 + brightness, 180ms — Press: scale 0.98, 120ms
 *  - Focus: visible 2px ring, never removed
 *  - Disabled: opacity 40%, no hover, cursor not-allowed
 *  - Font weight 600, no uppercase, no letter-spacing
 */

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-button font-semibold " +
  "transition-[transform,background-color,filter,opacity] duration-fast ease-out " +
  "active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 " +
  "select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover hover:scale-[1.02] shadow-card",
  secondary:
    "bg-surface-light-muted text-foreground-light border border-border-light hover:scale-[1.02]",
  ghost:
    "bg-transparent text-foreground-light-muted hover:text-primary hover:scale-[1.02]",
  danger:
    "bg-danger text-white hover:brightness-110 hover:scale-[1.02] shadow-card",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[15px]", // 44px
  lg: "h-[52px] px-8 text-base", // design.md Button Sizes: Large = 52px
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button"; to?: undefined };
type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string; to?: undefined };
// Internal SPA navigation — client-side routed via react-router-dom,
// no full page reload, no hash-only href. Preferred for any destination
// inside this app (use `as="a" href=...` only for genuine external links).
type ButtonAsLink = CommonProps &
  Omit<LinkProps, "className" | "children"> & { as?: undefined; to: string; className?: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  (props, ref) => {
    const {
      variant = "primary",
      size = "md",
      fullWidth = false,
      className,
      children,
      as: _as,
      to,
      ...rest
    } = props;

    const classes = cn(
      base,
      variants[variant],
      sizes[size],
      fullWidth && "w-full",
      className
    );

    if (to !== undefined) {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={classes}
          {...(rest as Omit<LinkProps, "to" | "className" | "children">)}
        >
          {children}
        </Link>
      );
    }

    if (props.as === "a") {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={classes}
          {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
