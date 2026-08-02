# About Page — High-Fidelity Design Specification
## Mental Health Safety Analyzer · Phase 3, Screen 8

**Document type:** Production design specification
**Target path:** `docs/design/about_spec.md`
**Audience:** Senior Frontend Engineer / Design Engineer implementation team
**Status:** Ready for build, pending final review
**Primary sources:** ProjectVision.md, README.md, design.md, frontend_requirements.md, components.md, frontend_architecture.md, landing_spec.md, dashboard_spec.md, history_spec.md, reports_spec.md, settings_spec.md, new-analysis_spec.md, documentation-api_spec.md

This document introduces **no new design tokens, colors, typography, spacing values, radii, shadows, motion durations, easing curves, or component types.** Every visual and behavioral element below reuses the system already locked across the prior specifications.

> **On this page's source basis:** `frontend_architecture.md` Section 5.9 defines About only briefly: "Static, single-column, no zoning, no Shell footer override needed — closest in spirit to a Documentation sub-page. Content sourced from ProjectVision.md's philosophy sections; this page is the human-readable expression of that document." Everything beyond that one-paragraph definition — the exact section breakdown, content ordering, and author/attribution treatment — is not specified anywhere else in the source documentation. Per instruction, this specification fills that gap using only ProjectVision.md's and README.md's actual documented content (Vision, Core Philosophy, Product Principles, Author, License), and flags the structural decisions themselves as `[ASSUMPTION]` rather than presenting them as already-settled.

No code, HTML, CSS, or React is included. All measurements and behaviors are specified precisely enough for direct implementation.

---

# 1. Overall Layout

About is architected exactly as `frontend_architecture.md` Section 5.9 describes: **static, single-column, no Top/Middle/Bottom zoning** (Section 4.7's zoning system does not apply here — there is no record to reason about, and no collection to scan). It is the calmest, quietest template in the entire authenticated product, sitting one register below even Settings, since it has no forms, no controls, and no data dependency of any kind.

```
┌─────────────────────────────────────────────────────────────┐
│ [ Page heading: "About" — H1 ]                                   │
├─────────────────────────────────────────────────────────────┤
│                                                                  │
│         MISSION SECTION (Section 4)                                │
│                                                                  │
│         CORE PHILOSOPHY SECTION (Section 5)                        │
│                                                                  │
│         PRODUCT PRINCIPLES SECTION (Section 6)                     │
│                                                                  │
│         NON-DIAGNOSTIC DISCLAIMER (Section 7)                      │
│                                                                  │
│         PROJECT & AUTHOR SECTION (Section 8)                       │
│                                                                  │
│         VERSION & LICENSE SECTION (Section 9)                      │
│                                                                  │
└─────────────────────────────────────────────────────────────┘
│ Footer (License, GitHub, Documentation, About)                     │
└─────────────────────────────────────────────────────────────┘
```

**Container width:** ~720px reading-width, centered — reusing the identical constraint already established for Settings (`settings_spec.md` Section 1) and New Analysis (`new-analysis_spec.md` Section 1), since About is prose-first content meant to be read linearly, not scanned. No Sub-Nav Rail exists on this page (unlike Settings/Documentation) — About has no sub-sections large enough to warrant one; a single continuous scroll is sufficient and matches this page's calm, non-navigational character.

**Footer retained:** per `frontend_architecture.md` Section 2.6's documented exception (Landing and Documentation both retain a Footer; About is added here as a third, consistent instance of the same exception, since it is equally static and long-form) — reusing Documentation's Footer content and treatment verbatim (`documentation-api_spec.md` Section 1), not a new footer design.

`[ASSUMPTION: the exact section list and ordering below (Mission → Philosophy → Principles → Disclaimer → Author → Version/License) is not explicitly specified anywhere in the source documentation. This ordering is the most conservative, content-faithful resolution: it follows ProjectVision.md's own internal ordering (Vision, then Core Philosophy, then Product Principles) rather than inventing a different narrative structure, and appends the Author/Version/License content from README.md at the end, consistent with About's role as "the human-readable expression of ProjectVision.md" plus the project's standard attribution content.]`

---

# 2. Visual Hierarchy

About has no single "hero" component in the way every analytical or transactional page does — this is consistent with Settings being "intentionally the one template without a single dominant element" (`settings_spec.md` Section 1), and About extends that same reasoning: its purpose is neither decision-support nor task-completion, so no element competes to be "the important one." Instead, hierarchy here is purely **sequential and typographic**: each section uses identical H2 section-title weight, identical body-text treatment, and identical vertical rhythm, so the page reads as one continuous, evenly-paced statement rather than a set of competing blocks.

The one deliberate exception: the **Non-Diagnostic Disclaimer** (Section 7) is set slightly apart — not louder in color or size (this page never uses Danger/Warning color treatment, since it is not a safety alert, it is a factual statement about the product's scope) — but visually isolated with a top and bottom Divider and slightly increased surrounding whitespace, so a reader's eye naturally pauses on it without the page resorting to alarming visual treatment. This mirrors the exact restraint principle already used for Settings' Account/danger-zone section (`settings_spec.md` Section 13: "visually calm... consequence communicated through confirmation friction... not alarming visual treatment") — here adapted from "friction" to "typographic pause," since there is no action to gate on this page, only a statement to make sure is read.

---

# 3. Information Architecture

Single-column, six sections, fixed order, no sub-navigation:

1. Mission (Section 4)
2. Core Philosophy (Section 5)
3. Product Principles (Section 6)
4. Non-Diagnostic Disclaimer (Section 7)
5. Project & Author (Section 8)
6. Version & License (Section 9)

No section is collapsible or tabbed — per the "static, single-column" instruction in `frontend_architecture.md` Section 5.9, this page is read top-to-bottom in one continuous scroll, with no progressive-disclosure gating anywhere on it. This is a deliberate departure from the Tier 1/2/3 disclosure system used on Analysis and Documentation pages (`frontend_architecture.md` Section 1.5) — that system exists to manage *decision-relevant* information density; About contains no decisions, so there is nothing to gate.

---

# 4. Mission Section

**Content, sourced directly from ProjectVision.md's "Vision" section, condensed to fit this page's calmer register (not reproduced verbatim at ProjectVision.md's full length, but not altered in meaning):**

```
[ H1: "About" ]
[ muted subline: "Why this product exists, and the principles it
  is built on." ]

[ H2: "Mission" ]
[ Body-large paragraph: Mental Health Safety Analyzer is an
  AI-powered decision-support platform designed to help
  professionals identify emotional distress, psychological
  deterioration, and potential crisis situations during text
  conversations. It is not intended to replace psychologists,
  psychiatrists, or mental health professionals — it serves as
  an intelligent assistant that helps experts understand
  conversations, prioritize risky cases, and make faster, more
  informed decisions. ]
```

**Typographic treatment:** Body-large scale throughout this section (the same scale used for Explainability's reasoning statements and Reports' Clinical Summary text, `dashboard_spec.md` Section 30) — About is meant to be read comfortably, not scanned, so its body copy never drops to standard Body scale the way a denser utility page would.

---

# 5. Core Philosophy Section

**Content, sourced directly from ProjectVision.md's "Core Philosophy" section:**

```
[ H2: "Core Philosophy" ]

[ Body-large: "Artificial Intelligence should support professionals,
  not replace them." — set as a standalone, slightly emphasized
  statement, not bolded or colored, simply given its own paragraph
  break for weight ]

[ Body: Every AI decision in this system is designed to be: ]

[ Chip list, five items, non-interactive — reusing the Chip
  component exactly as it appears for Detected Signals elsewhere
  (dashboard_spec.md Section 6), but here rendered as static,
  non-clickable labels since there is no underlying data to
  navigate to: ]
  Explainable · Transparent · Privacy-aware · Human-supervised · Safe
```

**Why Chips, not a bulleted list:** reusing an existing component (Chip) rather than introducing a new list-styling convention keeps this page within the "no new component types" constraint; the five-word list of qualities reads naturally as a Chip row exactly the way Detected Signals does elsewhere, even though here the Chips are inert and purely typographic.

---

# 6. Product Principles Section

**Content, sourced directly from ProjectVision.md's "Product Principles" section:**

```
[ H2: "How the interface should feel" ]

[ Body: The interface must always feel: ]

[ Chip list, reused identically to Section 5's pattern: ]
  Professional · Calm · Minimal · Trustworthy · Accessible · Readable

[ Body, closing line: "The application should never feel like a
  social media platform. It should feel like professional software
  built for serious, high-stakes work." ]
```

This section exists specifically so a visiting professional, researcher, or competition reviewer understands *why* the product looks and behaves the way it does — connecting the visual language they've just experienced throughout the rest of the app back to its stated design intent, without requiring them to read the full design.md source document.

---

# 7. Non-Diagnostic Disclaimer

**Purpose:** state, once, clearly, and permanently accessible, the same non-diagnostic scope statement that appears contextually elsewhere (Reports' PDF footer per `reports_spec.md` Section 6, the Landing Page's hero trust microcopy per `landing_spec.md` Section 3) — About is the canonical, most complete version of this statement, since a reader who wants the full context (not just a one-line reminder) comes here.

**Content:**
```
[ Divider ]

[ H2: "What this system is — and is not" ]

[ Body-large: "Mental Health Safety Analyzer does not provide
  medical diagnosis. It does not replace psychologists,
  psychiatrists, or licensed mental health professionals. It is
  designed solely as an AI-assisted conversation safety analysis
  and decision-support tool. Medium- and high-risk conversations
  always require human professional review, and the final clinical
  decision always remains with a qualified professional." ]

[ Divider ]
```

**Visual isolation:** bordered top and bottom by a Divider (reused component, no new styling), with 48px vertical padding above and below the paragraph itself (one step up from the section-to-section 32px rhythm used elsewhere on this page) — this is the one place on About where spacing itself, not color or size, signals "pause and read this carefully," consistent with the page's overall refusal to use alarm-toned visual treatment for a factual/ethical statement rather than a live safety signal.

---

# 8. Project & Author Section

**Content, sourced directly from README.md's "Author" section:**

```
[ H2: "About this project" ]

[ Body: "Mental Health Safety Analyzer is a research prototype
  exploring how AI can responsibly support — never replace —
  mental health professionals. Version [current release version,
  Section 9] is a stable research release." ]

[ Author sub-block: ]
  [ Avatar or initials, 48px — smaller than Settings' 72px Profile
    avatar, since this is a static attribution, not an editable
    profile ]
  [ Name: Arya Azizi ]
  [ Links, Ghost/Text buttons: "GitHub" · "Portfolio" ]
```

**Link behavior:** both links (GitHub, Portfolio) open in a new tab, consistent with the same external-link treatment already established for Documentation's "Open API Docs" action (`documentation-api_spec.md` Section 5) — this page never navigates the visiting professional away from the authenticated Shell without their explicit, deliberate click.

`[ASSUMPTION: no avatar image is specified anywhere in the source documentation for the project author; a simple initials-based avatar (matching the same Avatar foundation component used for the User Menu and Settings Profile section) is used as the conservative default rather than fabricating or sourcing an image.]`

---

# 9. Version & License Section

**Content, sourced directly from README.md's Release and License sections:**

```
[ H2: "Version & License" ]

[ Badge — neutral variant, reused from Documentation's HTTP-method
  badge treatment (documentation-api_spec.md Section 6) — same
  color-neutral, text-forward resolution, applied here to a version
  number instead of an HTTP method: ]
  v1.1.0

[ Body, caption scale: "Released July 2026." ]

[ Body: "Licensed under the MIT License. © 2026 Arya Azizi." ]

[ Ghost/Text link: "View full license →" — opens the License content
  within Documentation's existing content area (reusing Documentation's
  page template rather than introducing a new License-specific page) ]
```

**Why a neutral Badge for the version number, not a colored one:** exactly the same reasoning already established for Documentation's HTTP method badges — introducing a new color assignment for "version" would have no clear mapping to the existing five-color state system and risks diluting what color already means elsewhere in this clinical product (`documentation-api_spec.md` Section 6). Reusing the neutral/text-forward Badge resolution here, rather than inventing a second one, keeps the two pages' "informational, non-risk badge" pattern singular across the whole product.

---

# 10. Loading States

About's content is entirely static and bundled with the application (identical in nature to Documentation's non-remote content, `documentation-api_spec.md` Section 13) — **no loading state exists on this page under normal operation.** The page is interactive and fully rendered the instant it mounts.

The only theoretical loading scenario is a remotely-fetched version number (Section 9) if that value is ever sourced from a live release API rather than bundled at build time — in that case, a small inline skeleton (matching just the Badge's shape) appears in place of the version Badge only, reusing the exact localized-skeleton philosophy already established system-wide (`dashboard_spec.md` Section 21), never a full-page skeleton for a single inline value.

---

# 11. Empty States

**Not applicable.** About has no user-generated, collection, or data-dependent content anywhere on it — every section is fixed, authored copy. This mirrors Landing's own "not applicable" Empty State conclusion (`landing_spec.md` Section 9) exactly, for the same underlying reason: a page with no data has no empty condition to design for.

---

# 12. Error States

| Context | Presentation | Recovery |
|---|---|---|
| Version number fails to load (only relevant if Section 9's theoretical remote-fetch scenario applies) | The version Badge simply omits the number and shows "—" with a small tooltip: "Version unavailable" — the rest of the page is entirely unaffected, since this is the only fragment of the page with any data dependency at all | No explicit retry needed for such a minor, non-blocking value; a page refresh naturally retries it |
| External link (GitHub, Portfolio, License) fails to open | Same pattern already established for Documentation's "Open API Docs" failure (`documentation-api_spec.md` Section 15): an Inline Alert beneath the failed link with a plain copyable URL as fallback | Manual navigation via the provided link |

Same governing rule as every prior specification: **an error never removes access to content already rendered** — though on this page, given its fully static nature, there is effectively nothing to lose access to in the first place, which is itself the simplest possible expression of that rule.

---

# 13. Accessibility

- Heading structure is semantic and linear: one H1 ("About"), H2 for each of the six sections in fixed order — no skipped levels, matching the system-wide rule already enforced on every prior page.
- Chip lists (Sections 5, 6) are rendered as plain, non-interactive text content in the accessibility tree (not as a list of buttons or links, since they are not actionable) — screen readers announce them as a simple sequence of terms, not as a set of controls a user might expect to activate.
- The Non-Diagnostic Disclaimer (Section 7) is not conveyed through visual isolation alone — its heading ("What this system is — and is not") is itself descriptive enough that a screen reader user navigating by heading will not miss its significance purely because they can't perceive the surrounding whitespace change.
- All external links (Author, License) carry an explicit accessible label indicating they open in a new tab (e.g., "GitHub (opens in new tab)"), consistent with the same external-link labeling convention already used for Documentation's "Open API Docs" action.
- Minimum 44px touch target on every link and the version Badge's link (if interactive), matching the system-wide touch-target rule.
- Contrast: WCAG AA minimum throughout — no new color is introduced on this page, so no new contrast verification is required beyond confirming existing tokens' compliance, already established in prior specifications.

---

# 14. Responsive Behaviour

**Desktop/Laptop (≥1024px):** full layout as specified — 720px reading-width container, centered within the standard Shell.

**Tablet (768–1023px):** reading-width container relaxes to fill available width minus standard tablet outer margins (40px), identical fluid-within-a-range treatment already established for Reports (`reports_spec.md` Section 15) and New Analysis (`new-analysis_spec.md` Section 16) at this breakpoint.

**Mobile (≤767px):** container becomes full-width minus the standard 20px outer margin. Chip lists (Sections 5, 6) wrap naturally onto multiple lines rather than becoming horizontally scrollable — unlike Documentation's Code Blocks (which must preserve exact text and therefore scroll), these Chips are short standalone words that reflow gracefully with no loss of meaning, so wrapping is the correct, simpler behavior here.

Author avatar and links (Section 8) stack vertically on mobile (avatar and name on one line, GitHub/Portfolio links beneath, full-width tap targets) rather than remaining in a single horizontal row, consistent with the general mobile reflow principle applied everywhere else in the product (`frontend_architecture.md` Section 3.5).

---

# 15. Component Usage

Drawn only from the locked taxonomy (components.md) — no new component types introduced for this page.

| Component | About usage |
|---|---|
| Chip (non-interactive) | Core Philosophy qualities (Section 5), Product Principles qualities (Section 6) |
| Badge (neutral variant, reused from Documentation) | Version number (Section 9) |
| Avatar | Author attribution (Section 8) |
| Button (Ghost/Text) | GitHub, Portfolio, "View full license →" links |
| Divider | Isolating the Non-Diagnostic Disclaimer (Section 7) |
| Inline Alert | External link failure fallback only (Section 12) |
| Skeleton | Theoretical version-number remote-fetch only (Section 10) |

No Card, Table, Chart, Timeline, Toggle, Input, or Dialog appears anywhere on this page — About is the only template in the product with zero interactive form controls and zero AI-visualization components, consistent with its identity as pure, static, read-only prose.

---

# 16. Motion

All durations and easing draw from the single locked scale (Fast 120ms / Normal 220ms / Slow 350ms / Maximum 600ms hard ceiling; ease-out primary, ease-in-out secondary) — no new motion vocabulary introduced.

| Interaction | Duration | Easing |
|---|---|---|
| Page entrance | 250ms, 12px upward translate | ease-out |
| Section reveal on scroll (each of the six sections fades in as it enters viewport, reusing Landing's exact Section Reveal pattern, `landing_spec.md` Section 7) | 300ms, 80ms stagger between sections | ease-out |
| Link hover (Author, License, GitHub) | 180ms color shift, no scale | ease-out |

This is the **only authenticated page in the product that reuses Landing's scroll-triggered Section Reveal pattern** — justified because About shares Landing's calm, low-frequency, "arrival" register (a professional visits this page rarely, to read, not to work) rather than the Shell's denser "working" register used everywhere else. This is a deliberate, explicit exception, consistent with the precedent already established in `frontend_architecture.md` Section 17.6 (Landing's spacing rhythm being intentionally distinct from the Shell's) — extended here from spacing to motion, for the one authenticated page that shares Landing's actual purpose.

Nothing on this page loops, auto-plays repeatedly, or exceeds the 600ms Maximum tier.

---

# 17. Keyboard Navigation

Explicit tab order, top to bottom, matching visual layout:

1. Author section's GitHub link
2. Author section's Portfolio link
3. "View full license →" link

No other interactive elements exist on this page — the six content sections themselves (Mission, Philosophy, Principles, Disclaimer) contain no focusable controls, since they are pure reading content. This makes About, alongside Reports, one of the simplest keyboard surfaces in the product.

**Shortcuts specific to this page:** none beyond the global `⌘K`/`Ctrl+K` Command Palette, which remains available identically here as on every other authenticated page.

---

# 18. Interaction Rules

- **This page has no data-modifying actions of any kind** — no Confirmation dialogs, no Toasts, no forms — the simplest interaction model in the entire product, even simpler than Reports and Documentation, since it lacks even their read-only-but-structured content (report selectors, endpoint navigation).
- **All three interactive elements on this page are external links**, and all three behave identically (new tab, accessible "opens in new tab" labeling, Section 13) — there is no internal navigation logic unique to this page beyond the standard Sidebar/Top Navigation already shared system-wide.
- **The Non-Diagnostic Disclaimer's content is never abbreviated or hidden behind a "read more" affordance** — unlike other content on this page, which is deliberately condensed from its ProjectVision.md source for readability, this specific paragraph is the one place About prioritizes completeness over brevity, since it is the product's core ethical/legal scope statement and should never be truncated for the sake of a shorter page.

---

# 19. Premium UX Details

- **About reuses Landing's Section Reveal motion rather than the Shell's denser motion register** (Section 16) — a small, deliberate detail that makes this one authenticated page feel like a calm return to the product's "arrival" mood rather than another working screen, appropriate for content a professional reads occasionally rather than uses daily.
- **The Non-Diagnostic Disclaimer is given spacing-based emphasis instead of color-based alarm treatment** (Section 7) — consistent with the same restraint principle already applied to Settings' danger zone; a competition reviewer evaluating this product's ethical posture will notice that even its most legally/ethically important statement is treated with calm confidence rather than defensive-looking red boxes.
- **The Chip-based rendering of Core Philosophy and Product Principles** (Sections 5–6) turns two lists that could easily have been generic bullet points into something that visually rhymes with Detected Signals elsewhere in the product — a small, easily-missed detail that reinforces this page is still part of the same designed system, not a bolted-on "about us" template.
- **Every external link opens in a new tab and is labeled as such** — a small courtesy that respects a professional's current in-app context (an open conversation, an in-progress Settings edit) rather than silently navigating them away from the application entirely.
- **The Version Badge reuses Documentation's neutral HTTP-method badge resolution** rather than introducing a second "informational badge" pattern — a quiet but meaningful consistency discipline that keeps the number of ad hoc, page-specific micro-patterns in this product at zero.

---

**End of About Page High-Fidelity Specification.**
Ready for engineering handoff pending your review. This document, together with `frontend_architecture.md`, `landing_spec.md`, `dashboard_spec.md`, `history_spec.md`, `reports_spec.md`, `settings_spec.md`, `new-analysis_spec.md`, and `documentation-api_spec.md`, now covers the authenticated Shell and all eight of the product's core screens defined in the original Phase 1 UX Wireframe Specification's Information Architecture. Awaiting direction on any remaining gaps to resolve (the `[ASSUMPTION]`-flagged items across this document set) or the next phase of work.
