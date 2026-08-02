/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    // Grid tiers per design.md "Grid System" + frontend_architecture.md §3
    screens: {
      mobile: "0px",
      tablet: "768px",
      laptop: "1024px",
      desktop: "1280px",
    },
    extend: {
      colors: {
        // Color System — design.md "Color System"
        // Exact hex values are an implementation necessity: the source docs name
        // the roles (Primary Blue / Secondary Purple / Accent Cyan / Success Green /
        // Warning Amber / Danger Red, two-step High vs Critical) but do not fix hex
        // codes anywhere in the provided documents. Values below are conservative,
        // WCAG-AA-safe picks for the named roles only — no new colors, roles, or
        // usage rules are introduced beyond what design.md specifies.
        primary: {
          DEFAULT: "#2563EB", // Trust / AI / Technology / Professionalism
          hover: "#1D4ED8",
        },
        secondary: {
          DEFAULT: "#7C3AED", // Explainability / AI Processing / Fusion Engine
        },
        accent: {
          DEFAULT: "#0891B2", // Interactive Elements / Highlights / Information
        },
        success: {
          DEFAULT: "#16A34A", // Safe / Completed / Healthy
        },
        warning: {
          DEFAULT: "#D97706", // Attention Required / Moderate Risk
        },
        danger: {
          high: "#EA580C", // High Risk (distinguishable step below Critical)
          DEFAULT: "#DC2626", // Critical Emergency (soft-glow border reserved for this level only)
        },
        surface: {
          light: "rgb(var(--surface) / <alpha-value>)",
          "light-muted": "rgb(var(--surface-muted) / <alpha-value>)",
          dark: "#18181B",
          "dark-muted": "#212126",
        },
        border: {
          light: "rgb(var(--border) / <alpha-value>)",
          dark: "#2E2E33",
        },
        foreground: {
          light: "rgb(var(--foreground) / <alpha-value>)",
          "light-muted": "rgb(var(--foreground-muted) / <alpha-value>)",
          dark: "#F4F4F5",
          "dark-muted": "#9CA3AF",
        },
      },
      fontFamily: {
        // Typography — design.md "Typography": Inter, fallback Segoe UI/Helvetica/Arial
        sans: ["Inter", "Segoe UI", "Helvetica", "Arial", "sans-serif"],
      },
      // Spacing — design.md "Spacing System": strict 8-point scale
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
        20: "80px",
        24: "96px",
        32: "128px",
      },
      // Border Radius — design.md "Border Radius", fixed per Ratification FD-1
      borderRadius: {
        card: "20px",
        button: "14px",
        input: "14px",
        modal: "24px",
        chart: "20px",
        image: "20px",
      },
      // Motion — design.md "Global Motion Rules", locked scale
      transitionDuration: {
        fast: "120ms",
        normal: "220ms",
        slow: "350ms",
        max: "600ms",
      },
      maxWidth: {
        content: "1440px",
        reading: "720px",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(0 0 0 / 0.04), 0 1px 3px 0 rgb(0 0 0 / 0.06)",
        "card-hover": "0 4px 8px -2px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
      },
    },
  },
  plugins: [],
};
