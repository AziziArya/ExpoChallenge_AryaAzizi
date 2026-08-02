# Frontend Architecture
## Mental Health Safety Analyzer

**Document type:** Production Frontend Architecture (foundational — precedes all screen design)
**Status:** Locked baseline for all future UI work
**Source of truth:** ProjectVision.md, README.md, architecture.md, pipeline.md, models_and_ai.md, api_documentation.md, privacy_and_safety.md, design.md, frontend_requirements.md, components.md, dashboard_spec.md, future_improvements.md, release_notes.md, testing_and_evaluation.md, plus the approved Phase 1 UX Wireframe Specification, its Design Architecture Review, and the approved Landing Page High-Fidelity Specification.

This document is the single reference every future screen must be built from. Where the underlying documentation contained ambiguity or contradiction, the resolution is stated explicitly in **Section 17 (Architecture Decisions)** rather than silently assumed. Where no resolution could be responsibly made, it is recorded in **Section 18 (Open Questions)** instead of invented.

---

# 1. Frontend Philosophy

## 1.1 Overall UX Philosophy

The interface exists to make one thing effortless: **turning a long, emotionally heavy conversation into a decision a professional can trust in minutes, not hours.** Every screen, component, and interaction is subordinate to that goal. Nothing is built to be impressive for its own sake — impressiveness, where it exists, must come from clarity and restraint, not decoration (per design.md's explicit anti-decoration stance).

The product occupies a specific and unusual middle ground: it must feel as considered and modern as Linear or Vercel, while never once feeling like a consumer or entertainment product. Every visual and interaction decision is filtered through a single question: *does this help a professional trust the AI's reasoning, or does it just look good?* If a choice doesn't clearly serve the former, it is cut.

## 1.2 Interaction Philosophy

- Every interactive element provides feedback — hover, focus, press, loading, success, error. No interaction is ever "dead."
- Interactions are never surprising. No scroll-jacking, no auto-advancing carousels, no modals that appear unprompted, no destructive action available in a single accidental click.
- High-stakes actions (Override, Escalate) require deliberate confirmation. Low-stakes actions (navigation, filtering, expanding a card) do not — friction is applied selectively, proportional to consequence, not uniformly.
- The interface never pretends to know more than it does. Every AI output carries its confidence and reasoning inline; nothing is presented as a bare, unqualified conclusion.

## 1.3 Consistency Principles

- One spacing scale, one type scale, one motion scale, one radius scale, applied identically everywhere — Landing, Dashboard, Analysis, Settings, Documentation. A user should never feel they've moved into a different product between screens.
- Components are used exactly as defined in components.md. No screen invents a one-off variant of Button, Card, or Badge. If a screen seems to need a new variant, that is an architecture-level decision (Section 17), not a per-screen improvisation.
- The same information, when it appears on two different screens (e.g., a Risk badge on Dashboard and again on History), must look and behave identically. Divergence is a bug, not a design choice.

## 1.4 Cognitive Load Principles

- Every screen has exactly **one hero component** (per design.md's explicit rule). Everything else on that screen exists to support, explain, or act on the hero — never to compete with it.
- Default views are deliberately incomplete — advanced detail is opt-in via expansion, not opt-out via dense default rendering. This is the direct architectural fix for the "Card Explosion" risk identified in the Phase 1 Design Review: the Analysis Workspace does **not** render all seven AI visualizations simultaneously by default (see Section 4.6 and Section 17.1).
- Numbers are never shown without qualitative context (a risk score is never just "0.76" — it always carries a label, color, and one-line reasoning nearby).

## 1.5 Progressive Disclosure

Three tiers, applied consistently across the entire application:

1. **Tier 1 — Always visible:** Risk level, confidence, top signals, recommended action. This is what a professional sees without a single click.
2. **Tier 2 — One interaction away:** Emotion timeline, heatmap, fusion breakdown, conversation viewer detail. Reached by expanding a section or switching a tab within the same screen — never a full page navigation.
3. **Tier 3 — Deliberately gated:** AI Reason Graph, raw technical output, full pipeline replay, audit trail. These require an explicit expand/opt-in action specifically because they are the most likely to visually resemble a clinical verdict if shown by default (a direct carry-forward from the Phase 1 Review's finding on the Reason Graph).

## 1.6 Explainability-First Design

No screen may display a risk level, score, or flagged signal without a visible, reachable path to *why* — either inline (a one-line reason) or one interaction away (an Explainability Panel). This is a hard constraint, not a best-effort goal: a screen that fails this rule is not production-ready regardless of how polished it looks. Explainability is treated as a **first-class layout concern**, not a footnote panel — it always occupies a defined zone (Bottom Zone or equivalent) on any screen that presents an AI decision.

---

# 2. Application Shell

## 2.1 Shell Composition

```
┌─────────────────────────────────────────────────────────────┐
│ TOP NAVIGATION — fixed, 72px, always present in authenticated app │
├───────────┬─────────────────────────────────────────────────┤
│           │  CRITICAL ALERT BANNER (conditional — see 2.5)     │
│  SIDEBAR  │                                                     │
│  (fixed)  │  MAIN CONTENT AREA                                  │
│           │  (page templates render here — Section 5)            │
│           │                                                     │
│           │                                                     │
└───────────┴─────────────────────────────────────────────────┘
```

The Shell is the single persistent frame for every authenticated screen (Dashboard onward). Landing is explicitly outside the Shell — it uses the lighter marketing-nav variant defined in the Landing Page spec, with no Sidebar. The transition from Landing into the Shell (on "Open Dashboard") is the one place in the app where the chrome itself changes, and it should feel like arriving somewhere, not like a jump cut — handled with the same 220–250ms fade/translate vocabulary used elsewhere, not a hard reload feel.

## 2.2 Sidebar

- Persistent on desktop, icon-rail on tablet (expandable on hover/tap), full drawer on mobile — as defined in the Phase 1 spec, unchanged.
- Fixed item set, in fixed order, matching Information Priority (Section 15): Dashboard, New Analysis, History, Reports, Documentation, API, Settings.
- **Explainability is not a Sidebar item.** Per the Phase 1 Design Review's resolution (Section 17.3), Explainability is reachable only from within an open Conversation Analysis workspace, never as a standalone top-level destination. This keeps the Sidebar's item count fixed and predictable regardless of application state — no conditional items appear or disappear.
- Active item indicated by three redundant signals: filled icon, bold label, and a leading accent bar — never color alone.

## 2.3 Top Navigation

- Identical structural role to the Landing Page nav, but the authenticated variant always renders solid (never transparent — that treatment is a Landing-only luxury tied to the hero background).
- Contains: Logo/Home, Search (opens Command Palette), Notifications, Theme Switch, User Menu.
- Sticky at all times, all breakpoints, all scroll positions — the one place the Critical Alert Banner (2.5) attaches directly beneath it, so a professional can never scroll a Critical item out of reach.

## 2.4 Main Content Area

- Renders the active Page Template (Section 5).
- Always constrained to the 1440px max-width container with system-standard outer margins, with the sole documented exception of the Reports template, which uses a narrower reading-width container for document-style content (Section 5.4).
- Owns its own internal scroll; Sidebar and Top Navigation never scroll with it.

## 2.5 Critical Alert Banner

New shell-level element, introduced to resolve the Phase 1 Review's Critical Problem 1.2 (no cross-page delivery mechanism for Critical Emergency states). Structural rules:

- Renders directly beneath Top Navigation, above Main Content Area, on **every authenticated page**, whenever one or more conversations in the professional's queue are at Critical Emergency risk and still in Pending review status.
- Not a Toast (does not auto-dismiss) and not a modal (does not block interaction) — a persistent, calm, single-line banner: icon + "N conversation(s) require urgent review" + a single action link into the queue.
- Manually dismissible per-session only; reappears on next session/reload if the underlying condition is still true. It cannot be permanently silenced from the banner itself (silencing globally is a Settings-level action, not a one-click dismiss, to avoid accidental suppression of a safety signal).
- Uses the Danger/Critical color treatment already defined in the color system (soft red border/glow, never a flashing or pulsing animation — consistent with design.md's explicit prohibition on alarming effects even for Critical items).

## 2.6 Footer Behavior

- The authenticated application Shell has **no persistent footer**. Footer content (license, links, about) exists only on Landing and Documentation pages, where the page is otherwise static and benefits from a closing zone.
- Inside the Shell, footer-style utility links (License, Docs, API) are relocated to the Sidebar's lowest section or the User Menu, since a scrolling in-app footer would conflict with the fixed-Shell model and add no value during clinical work.

---

# 3. Layout System

## 3.1 Desktop Grid (≥1280px)
- 12-column grid, 24px gutter.
- Max content width: 1440px, centered.
- Outer margin: 64px.

## 3.2 Tablet Grid (768–1279px)
- 8-column grid, 24px gutter (gutter unchanged; column count reduces).
- Outer margin: 40px.

## 3.3 Mobile Grid (≤767px)
- 4-column grid, 16px gutter (tightened from 24px — at this width, 24px gutters consume too great a share of available width relative to content).
- Outer margin: 20px.

## 3.4 Spacing

All spacing — padding, margin, gap — draws exclusively from the locked 8-point scale: **4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 96, 128.** No arbitrary values are permitted anywhere in the application, including in third-party component integration (any imported component must be re-skinned to this scale, not left at its own defaults).

Standard applications of the scale across the app (extending the values already fixed in the Landing spec to the rest of the product):
- Card internal padding: 24px desktop / 20px tablet / 16px mobile.
- Card grid gutter: 24px.
- Section-to-section vertical gap within a page: 48–64px (denser than Landing's 96–128px, reflecting the Shell's working-density register versus Landing's arrival-density register — this distinction is intentional, see Section 17.6).
- Zone-to-zone gap within Dashboard/Analysis templates: 32px.

## 3.5 Responsive Behavior — General Rules

- Layouts **re-flow**, they do not **shrink**. A three-column desktop layout becomes a deliberately restructured one- or two-column tablet/mobile layout, never a scaled-down miniature of the same structure (this applies to charts and diagrams especially — per the Landing spec's Workflow diagram precedent).
- Tables become card lists below tablet width, system-wide — this rule, established in Phase 1, applies identically to every table in the app (Dashboard Queue, History) with no per-screen exceptions.
- Any component that cannot reflow gracefully (e.g., a graph with directional relationships) must have an explicitly designed alternate mobile representation, not an autoscaled version — the AI Reason Graph's vertical-stepped-list mobile form (established in Phase 1) is the model for how this should be handled elsewhere.

---

# 4. Dashboard Zoning

This section defines the **official, reusable zoning system**. It formalizes and slightly refines the zoning introduced informally in the Phase 1 spec, incorporating the Phase 1 Review's Critical Problem 1.1 resolution.

## 4.1 Top Zone
Purpose: immediate orientation — "what is the state of things right now." Always visible without scrolling. Contains the screen's most decision-critical, highest-priority information only (Section 15). Never contains secondary or exploratory content.

## 4.2 Middle Zone
Purpose: the reasoning/detail layer — "how did we get here." Scrollable. Where the bulk of a screen's substantive content lives.

## 4.3 Bottom Zone
Purpose: action/decision support — "what should happen next." Contains Explainability, Recommendation, and Human Review where applicable. Never appears above the Middle Zone — professionals must see the evidence before the recommendation, enforcing an evidence-before-verdict reading order structurally, not just by convention.

## 4.4 Right Panel
Purpose: a persistent, optionally-pinned companion to Middle/Bottom Zone content — used specifically for the Risk summary on the Analysis Workspace (Section 4.6), where dashboard_spec.md explicitly calls for a pinned-on-scroll Risk Panel on desktop. Not used on Dashboard (hub) or other list-style templates — Right Panel is reserved for single-record deep-dive contexts only.

## 4.5 Split View
Purpose: two related content areas shown side-by-side at equal or near-equal weight, used specifically for Conversation Viewer (left) beside its supporting analysis cards (right) in the Analysis Workspace. Split View collapses to a single stacked column at tablet width and below (Section 3.5).

## 4.6 Analysis Workspace (Refined Zoning)

This is the architecture-level fix for Phase 1 Review Critical Problem 1.1 (Card Explosion). The Analysis Workspace is **not** simply Middle Zone = seven stacked cards. It is redefined as:

```
TOP ZONE
  Risk Card (dominant, larger) + Confidence (nested within/beside it)
  + Detected Signals + Recommendation strip
  [ resolves Review 2.1 — Risk is no longer one of four equal cards ]

MIDDLE ZONE — Split View
  LEFT: Conversation Viewer (hero of this zone, always visible)
  RIGHT: Tabbed panel, ONE visualization visible at a time by default:
     [ Fusion Engine ] [ Risk Timeline ] [ Emotion Timeline ] [ Heatmap ] [ Pipeline ]
     Default tab: Fusion Engine (the clearest single proof of multi-signal reasoning)
     [ resolves Review Critical Problem 1.1 ]

BOTTOM ZONE
  Explainability (Tier 2, expanded by default) 
     └── AI Reason Graph (Tier 3, collapsed by default)
  Human Review Panel (adjacent, visually distinct container)
  Clinical Summary + Export (closing strip)
```

The right-hand tab group in the Middle Zone replaces the previously-stacked five-card column with a single-visualization-at-a-time pattern. This directly satisfies the "one hero per screen" rule at the *zone* level as well as the page level, while still making every visualization reachable within one click — satisfying progressive disclosure without hiding capability.

## 4.7 Zone Inheritance Rule

Every future screen that presents a single AI-analyzed record (a conversation, a report) must be built from Top/Middle/Bottom Zone in that order. Screens that present a **collection** of records (Dashboard hub, History) use a different, simpler template (Section 5) built from a summary strip + a list/table — they do not use the three-zone system, since there is no single record to reason about yet.

---

# 5. Page Templates

## 5.1 Landing Template
- No Shell (Section 2.1 exception). Marketing nav, five static zones, single scroll. Fully specified in the approved Landing Page High-Fidelity Specification — this architecture document defers to that spec for Landing's detail and does not restate it.

## 5.2 Dashboard Template (Hub)
- Structure: Summary strip (metric cards) → Filterable Queue (table/list) → Quick Insights strip.
- Hero component: the Queue — it is the single largest, most interactive element and the reason a professional opens this page.
- Information hierarchy: aggregate risk distribution first, individual queue items second, trend insights third (lowest priority, may be omitted first on smaller viewports if space is constrained).
- Navigation behavior: every queue row is a direct link into the Analysis Workspace template (5.3) for that conversation.

## 5.3 Analysis Template
- Structure: the Analysis Workspace zoning defined in Section 4.6.
- Hero component: Conversation Viewer.
- Navigation behavior: Explainability, when expanded to its full deep-dive form, may render as an in-page expanded section (preferred) or push into a dedicated Explainability sub-route for deep-linking/sharing purposes — see Open Question 18.4.

## 5.4 Reports Template
- Structure: Report selector (if multiple exist) → Clinical Summary (hero) → Export actions.
- Container width: narrower reading-width constraint (documented exception to Section 2.4), since this is document-style content meant to be read linearly, not scanned as a dashboard.
- Hero component: Clinical Summary Card.

## 5.5 History Template
- Structure: Filter/search bar → record list (table desktop, cards mobile).
- Hero component: the record list itself.
- No Top/Middle/Bottom zoning — this is a collection template (Section 4.7).

## 5.6 Settings Template
- Structure: two-column (sub-nav + form) desktop, stacked accordion mobile.
- Hero component: none by design — Settings is intentionally the one template without a single dominant element, since its purpose is utility, not comprehension of a decision.

## 5.7 Documentation Template
- Structure: left sub-nav rail (Architecture, Pipeline, Models, Privacy, API Reference, Release Notes) + content area.
- Hero component: the active document's content itself.
- Retains a Footer (Section 2.6 exception), consistent with Landing, since Documentation is long-form and benefits from a closing zone.

## 5.8 API Template
- A specialized child of the Documentation template — same shell treatment, adds a live endpoint reference (linking to or embedding FastAPI's generated `/docs`/`/redoc`, per api_documentation.md, rather than reimplementing an API explorer from scratch).

## 5.9 About Template
- Static, single-column, no zoning, no Shell footer override needed — closest in spirit to a Documentation sub-page. Content sourced from ProjectVision.md's philosophy sections; this page is the human-readable expression of that document.

---

# 6. Navigation Architecture

## 6.1 Primary Navigation
The Sidebar (Section 2.2) — fixed seven-item set, always identical regardless of page or state.

## 6.2 Secondary Navigation
Sub-navigation local to a template: Settings' section tabs, Documentation's content rail, Analysis Workspace's Middle Zone tab group (Section 4.6). Secondary navigation never leaves its parent template's Main Content Area — it does not appear in Sidebar or Top Navigation.

## 6.3 Context Navigation
Links that move a user *between* related records without going through Sidebar — e.g., clicking an Emotion Timeline point to jump within the Conversation Viewer, or a Dashboard Queue row into its Analysis Workspace. Context navigation is always same-tab, and always leaves a clear return path (breadcrumb or explicit "Back to —" link).

## 6.4 Breadcrumbs
Used only on templates nested more than one level deep from Sidebar (Analysis Workspace, Documentation sub-pages, Settings sub-sections). Format: `Section / Current Page`. Not used on top-level Sidebar destinations (Dashboard, History, Reports) — a breadcrumb there would be redundant with the Sidebar's own active-state indicator.

## 6.5 Back Navigation
Every deep-dive or expanded view (Explainability full view, Reason Graph expanded state) provides an explicit, visible "Back" affordance distinct from the browser's native back button — required because several of these are in-page expansions, not true route changes, where browser-back would behave unexpectedly.

## 6.6 Command Palette
- Global, available from any authenticated screen via Search (Top Nav) or keyboard shortcut.
- Actions: jump to any Sidebar destination, jump to a specific conversation by search, start New Analysis, jump to Settings.
- Modal overlay pattern; traps focus while open; returns focus to the triggering element on close (Section 12.3).

## 6.7 Keyboard Shortcuts
- A documented, discoverable shortcut set is required (Phase 1 Review Nice-to-Have 3, now promoted to an architecture requirement given the Raycast/Linear benchmark). Minimum set: open Command Palette, focus Search, navigate to New Analysis, close any open modal/panel (Escape universally).
- A shortcuts reference is reachable from the User Menu — this satisfies the "discoverable" requirement without adding a permanent on-screen affordance.

## 6.8 Search
- Top Navigation search opens the Command Palette pre-focused on its search field, rather than being a separate, differently-behaved search experience — one search implementation, two entry points, to avoid inconsistent search behavior across the app.

---

# 7. Responsive Strategy

| Breakpoint | Range | Sidebar | Grid | Zoning Behavior |
|---|---|---|---|---|
| Desktop | ≥1280px | Persistent, expanded | 12-col | Full Top/Middle/Bottom + Split View + pinned Right Panel |
| Laptop | 1024–1279px | Persistent, expanded (narrower content margins) | 12-col, tighter gutters | Same as Desktop; Right Panel pin behavior preserved but panel narrows |
| Tablet | 768–1023px | Icon-rail, expandable | 8-col | Split View stacks; Right Panel no longer pinned; Bottom Zone cards stack full-width in sequence |
| Mobile | ≤767px | Drawer | 4-col | Full vertical stack in documented reading order (Section 4.6's Top→Middle→Bottom becomes one continuous scroll); Top Zone metric cards become horizontally scrollable strip to preserve at-a-glance scanning without excessive vertical length |

Laptop is treated as a distinct tier from Desktop (a refinement beyond Phase 1) because the Right Panel pin + Split View combination is the single most likely part of the interface to feel cramped at 1024–1279px; giving it an explicit tier prevents that gap from being improvised later.

---

# 8. Empty States — Universal System

Resolves Phase 1 Review Critical Problem 1.4 (illustration-vs-anti-decoration contradiction).

**Resolution:** Empty states use **no illustration**. They use a single, small, muted line-icon (from the existing Icon foundation component — not a custom illustration asset), consistent with design.md's anti-decoration stance, while still giving components.md's empty-Card requirement something better than bare text to anchor on.

## 8.1 Structure (fixed, applies everywhere)
```
[ small muted line-icon ]
[ short message: why it's empty ]
[ optional one-line elaboration ]
[ single primary action ]
```

## 8.2 Hierarchy
- Message is never longer than one sentence plus one optional supporting sentence.
- Exactly one action — never a secondary/ghost action alongside it (empty states are a single-path moment, not a decision point).

## 8.3 Placement
- Full-zone empty states (e.g., empty Dashboard Queue) replace the entire zone content, matching the surrounding zone's padding exactly so no layout shift occurs when real content later populates it.
- Component-level empty states (e.g., a single chart with no data yet) stay contained within that component's Card, never breaking out to full-width.

---

# 9. Loading States

## 9.1 Skeletons
Default pattern for any page or zone load. Skeleton shape must match the real content's final shape exactly (card count, approximate line count) to prevent layout shift on resolution.

## 9.2 Spinners
Reserved for small, componentized, short-duration operations only (e.g., Save button in Settings). Never used for full-page loads and never used for AI analysis (Section 9.4).

## 9.3 Streaming
Where the backend can return partial results progressively (e.g., pipeline stages completing one at a time), the UI renders each result as it arrives rather than waiting for the full response — this is what makes the Pipeline Progress pattern (9.4) genuinely informative rather than a fake progress bar.

## 9.4 Progress Indicators — Long-Running AI Tasks
The **AI Pipeline Progress pattern** (fully specified in the Phase 1 spec, Section 8) is the mandatory pattern for any operation that runs the analysis pipeline — New Analysis submission and any full re-analysis. It is never substituted with a generic spinner or progress bar, system-wide, without exception. On completion, it collapses into the compact Pipeline tab within the Analysis Workspace's Middle Zone tab group (Section 4.6), preserving the reasoning trail permanently rather than discarding it once loading finishes.

---

# 10. Error States — Complete Philosophy

| Error Type | Presentation | Recovery |
|---|---|---|
| Network / connectivity | Inline banner, non-blocking where possible | Retry action; Shell-level offline indicator (Section 2 carryover from Phase 1) |
| Backend / server error | Card-level error state replacing only the affected content | Retry Analysis / Retry Load button |
| Validation | Inline, at the field, before submission is attempted | Correct and resubmit — never a blocking modal for form validation |
| AI timeout | Pipeline Progress pattern halts visibly at the stalled stage (Section 9.4), not a generic failure screen | "Retry" resumes or restarts the pipeline; partial results already streamed in remain visible, not discarded |
| Permission / auth | Full-page interrupt only for a genuinely invalid session; otherwise a Toast | Re-authenticate action |
| Unknown / unhandled | Generic, calm fallback message — never a raw stack trace or technical error string shown to a clinical user | Reload action + link to report the issue |

**Governing rule:** an error never removes a user's access to data they already had rendered. A failed refresh of one chart does not blank the whole page; a failed pipeline stage does not discard the stages that already completed. This is a direct, system-wide application of the "partial failure" handling first introduced in the Phase 1 Analysis Workspace spec, now generalized to the entire app.

---

# 11. Notifications

## 11.1 Toast
Transient, auto-dismissing, low-to-medium priority only (e.g., "Settings saved"). Never used for anything requiring an action or anything safety-relevant.

## 11.2 Banner
Persistent until manually dismissed or resolved. Used for page-scoped conditions (e.g., "This report is read-only"). Distinct from the Critical Alert Banner (11.5), which is Shell-scoped, not page-scoped.

## 11.3 Inline Alerts
Contextual, embedded directly within a card or section (e.g., a partial-failure notice inside one chart card). Never floats above content.

## 11.4 Critical Alerts
Reserved specifically for Critical Emergency risk conditions. Rendered exclusively via the Shell-level Critical Alert Banner (Section 2.5) — critical alerts are never delivered as a Toast, since a Toast can be missed and auto-dismisses.

## 11.5 Notification Hierarchy
```
Critical Alert (Shell banner, persistent, cross-page)
      >
Page Banner (persistent, page-scoped)
      >
Inline Alert (contextual, component-scoped)
      >
Toast (transient, low-priority confirmation only)
```
A condition is always represented at the *lowest* tier that still guarantees the professional will see it in time — Critical items are deliberately over-guaranteed (Shell-level, persistent) rather than risk under-delivery.

---

# 12. Accessibility Architecture

## 12.1 Keyboard Navigation
Every interactive element reachable via Tab/Shift+Tab in a logical, visually-matching order. Enter/Space activate; Escape closes any open overlay (Command Palette, expanded Reason Graph, Confirmation dialogs). Arrow keys navigate within composite widgets (tab groups, the Queue table).

## 12.2 ARIA
- Semantic HTML and native elements preferred over generic divs with ARIA bolted on, per frontend_requirements.md.
- The AI Pipeline Progress pattern uses an `aria-live="polite"` region to announce each stage transition to screen reader users — resolves Phase 1 Review Medium Problem 2.6. This is a mandatory implementation detail, not optional polish, given the Pipeline is otherwise a purely visual/motion pattern.
- Risk level, confidence, and signal chips all carry explicit text labels in the accessibility tree — never relying on an icon or color alone to convey their meaning to assistive technology, mirroring the visual "never color alone" rule.

## 12.3 Focus Order & Management
- Modals, the Command Palette, and Confirmation dialogs all trap focus while open and return focus to the exact triggering element on close — resolves Phase 1 Review Medium Problem 2.7.
- Expanding the Reason Graph (Tier 3 disclosure) moves focus to the graph's heading on open, and returns it to the toggle control on collapse.

## 12.4 Reduced Motion
A single, global `prefers-reduced-motion` check governs the entire application. When active: Pipeline sequential activation becomes an instant state list, Fusion particle flow is removed entirely, all section-reveal staggering becomes a simple opacity fade, and page-load entrance animation is skipped. No component implements its own independent reduced-motion logic — this is a single shell-level concern, applied consistently.

## 12.5 Screen Readers
Heading structure is semantic and linear on every template (one H1 per page, no skipped levels), matching the rule already established for Landing and extended app-wide.

## 12.6 Contrast
WCAG AA minimum, system-wide, including for the risk-state colors specifically flagged in the Phase 1 Review (Medium Problem 2.5) — Amber/Moderate and Red/High-Critical must remain distinguishable independent of hue perception, achieved through the mandatory icon+label pairing (never color alone), not through contrast alone.

## 12.7 Touch Targets
Minimum 44px on every interactive element at every breakpoint, including inside dense contexts like the Queue table's row actions and the Conversation Viewer's inline markers.

---

# 13. Motion Architecture

## 13.1 Global Token Reference
Duration tiers (unchanged from the locked system): Fast 120ms, Normal 220ms, Slow 350ms, Maximum 600ms (hard ceiling). Easing: ease-out primary, ease-in-out secondary, spring reserved only for high-significance moments (Fusion Engine pulse).

## 13.2 Page Transitions
Fade only, never slide, per the locked system. 250ms, small 12px upward translate on entrance.

## 13.3 Card Transitions
Entrance: opacity + 16px translateY, 250ms. Hover (Interactive Cards only): 4px lift + soft shadow increase. Static/informational Cards (e.g., Landing's Trust Zone, Settings sections) never receive hover motion — motion is reserved for genuinely interactive elements only, system-wide.

## 13.4 AI Reasoning Animations
The Pipeline sequence (Section 9.4) is the only place in the entire application where a multi-step, orchestrated animation sequence is permitted. It is not reused or echoed elsewhere as an ongoing loop — its Landing Page appearance (a one-time entrance draw-in) is the sole exception, and even that is explicitly one-time, not looping.

## 13.5 Loading Animations
Skeletons use a subtle shimmer, not a spinner sweep. Duration and easing match Card entrance (13.3) so a resolved skeleton-to-content swap feels continuous rather than jarring.

## 13.6 Hover / Press
Buttons: hover scale 1.02 + brightness increase (180ms); press scale 0.98 (120ms). Identical across every button instance in the app, including inside dense table rows — no context gets a "quieter" or "louder" variant of this base interaction.

## 13.7 Entrance / Exit
Entrance: fade + translate, 250–300ms, ease-out (as above). Exit (dismissing a Toast, closing a panel): fade + slight scale-down, 180–220ms — always faster than entrance, since exits should feel efficient, not lingering.

---

# 14. Component Placement Rules

| Component | Belongs To | Never Appears In |
|---|---|---|
| Conversation Viewer | Analysis Template, Middle Zone (Split View left) | Dashboard hub, Reports, any list template |
| Risk Gauge / Card | Top Zone of Analysis Template (dominant); mini form in Dashboard summary strip; badge form in Queue/History rows | Landing, Settings, Documentation |
| Fusion Engine | Analysis Template, Middle Zone tab group (default tab) | Any collection template |
| Explainability Panel | Bottom Zone of Analysis Template; summary form in Reports | Dashboard hub, History |
| Timeline (Emotion/Risk) | Analysis Template, Middle Zone tab group; mini trend in Dashboard summary strip | Settings, Documentation |
| Heatmap | Analysis Template, Middle Zone tab group only | Everywhere else |
| Reports (Clinical Summary) | Reports Template (hero); linked from Analysis Template's Bottom Zone closing strip | Dashboard, History |
| Human Review Panel | Bottom Zone of Analysis Template only | Any collection or static template |
| Cards (Default) | Universal — the base primitive for nearly every content block app-wide | N/A — this is the one component with no placement restriction |
| Charts | Middle Zone tab group (Analysis); Dashboard summary strip (compact form only) | Never full-size on Dashboard hub — only compact/trend forms belong there |
| Dialogs / Confirmation | Triggered contextually (Override/Escalate confirmation, destructive Settings actions) — never a page-level element, always an overlay | Never used for routine navigation or non-destructive actions |

---

# 15. Information Priority

**Global, non-negotiable order**, applied to every screen that presents an AI decision:

1. Risk Level (always first, always dominant)
2. Confidence (always adjacent to Risk, never separated from it)
3. Detected Signals (top-line, summarized)
4. Explanation / Reasoning
5. Conversation / Source content
6. Technical / raw detail (Reason Graph, raw scores, pipeline internals)

**Rules:**
- Nothing below tier 3 is ever visible without scrolling or an explicit interaction, on any screen, at any breakpoint.
- Tier 6 (technical detail) is never shown to a first-time viewer of a screen by default, anywhere in the app — this is the generalized, system-wide form of the Reason Graph's collapsed-by-default rule.
- No two elements at the same priority tier may compete for the same visual weight on one screen — if two things are both "tier 1," the architecture (Section 4.6) must resolve which is dominant (Risk) and which is subordinate-but-adjacent (Confidence), never leave them as true equals.

---

# 16. Future Scalability

## 16.1 Longitudinal Monitoring
The Analysis Template's tab group (Section 4.6) is structured so a future **Session Evolution** tab can be added to the existing tab set without restructuring the page — it becomes an eighth tab option alongside Fusion/Risk/Emotion/Heatmap/Pipeline, reusing the same Middle Zone container. This directly addresses Phase 1 Review Critical Problem 1.5 architecturally, even though the feature itself remains unbuilt pending backend support (Open Question 18.1).

## 16.2 Multiple Conversations / Multi-Session Patients
The Dashboard hub's Queue and the History template's list are both built as generic record collections (Section 5.2, 5.5), not conversation-specific — this means a future patient-level grouping (multiple conversations under one patient identity) can be introduced as a new filter/grouping dimension on the existing list components, rather than requiring new page templates.

## 16.3 Clinics (Multi-User)
The Shell's User Menu and Settings template are structured with clinic/workspace-level settings as a natural sibling section to personal settings (Section 5.6), without requiring shell restructuring, once multi-user auth exists (Open Question 18.2).

## 16.4 Researchers
The Documentation/API templates (Sections 5.7–5.8) already serve as the dedicated, separated surface for this persona — no clinical template needs modification to serve researchers, keeping the two audiences' interfaces cleanly decoupled.

## 16.5 Crisis Intervention Teams
The Critical Alert Banner (2.5) and Queue's risk-based filtering (Phase 1 Review Medium Problem 2.3) are the two structural hooks this persona depends on most; both are already part of this baseline architecture rather than deferred, since crisis-team usability was identified as a real gap in the Phase 1 Review and is treated here as a baseline requirement, not a future add-on.

---

# 17. Architecture Decisions

**17.1 — Analysis Workspace uses a single-visualization tab group instead of a stacked card column.**
*Why:* Directly resolves the Card Explosion violation (Phase 1 Review Critical 1.1) of design.md's "one hero per screen" and "avoid card explosion" rules. *Trade-off:* a professional must click to compare two visualizations side-by-side that were previously both visible at once; accepted because scannability and calm at first view outweighs simultaneous comparison, which is a secondary, occasional need better served by an explicit future "compare" action than by permanent density.

**17.2 — Critical Alert Banner added at the Shell level.**
*Why:* No cross-page delivery mechanism existed for the product's single highest-stakes state (Phase 1 Review Critical 1.2). *Trade-off:* adds a persistent, always-possible-to-render element to every authenticated screen, which slightly increases visual complexity of the Shell; accepted because the alternative — a safety signal that can go unseen — is not an acceptable trade for visual minimalism.

**17.3 — Explainability removed from Sidebar; reachable only within an open conversation.**
*Why:* Resolves the conditional-nav-item ambiguity (Phase 1 Review Medium 2.2) and keeps Sidebar structurally fixed regardless of app state. *Trade-off:* a professional cannot jump directly to "explainability in general" from anywhere — acceptable, since explainability is inherently about a specific decision, not an abstract destination.

**17.4 — Empty states use a muted line-icon, not an illustration.**
*Why:* Resolves the direct documentation contradiction between components.md (require illustration) and design.md (ban unnecessary illustration) — see Phase 1 Review Critical 1.4. *Trade-off:* slightly less warmth/personality in empty states than a full illustration would provide; accepted in favor of consistency with the stronger, more repeated anti-decoration principle found throughout design.md.

**17.5 — Confirmation required before Override/Escalate, with mandatory note.**
*Why:* Resolves Phase 1 Review Critical 1.3 — a clinical/legal-weight action must not be a single accidental click. *Trade-off:* adds one extra step to a high-frequency professional action; accepted because the action's consequence weight justifies deliberate friction, consistent with the stated interaction philosophy (Section 1.2) that friction should be proportional to consequence.

**17.6 — Landing uses wide, "arrival" spacing (96–128px section gaps); the authenticated Shell uses tighter "working" spacing (48–64px).**
*Why:* Landing is a one-time, low-frequency, calm threshold experience; the Shell is a high-frequency, working tool. Applying Landing's spacious rhythm throughout the whole app would slow down a professional's actual workflow and waste vertical space during repeated daily use. *Trade-off:* introduces two distinct spacing rhythms in one product; mitigated by keeping every other token (color, radius, motion, type) fully consistent, so the shift reads as intentional register-change, not inconsistency.

**17.7 — Laptop treated as its own responsive tier, distinct from Desktop.**
*Why:* The Right Panel + Split View combination is the layout most likely to feel cramped in the 1024–1279px range; giving it explicit rules now prevents ad hoc handling later. *Trade-off:* one more breakpoint to test and maintain; accepted given how central the Analysis Workspace is to the product's core value.

**17.8 — Audit Trail is architected as a nested view within Analysis, not a new top-level page.**
*Why:* Resolves Phase 1 Review Critical 1.6 without expanding the Sidebar's fixed seven-item set (consistent with 17.3's reasoning). *Trade-off:* audit history is not independently browsable across all cases from one place yet; acceptable for the current single-professional, pre-multi-user scope (Open Question 18.2), and revisitable once clinic-level accounts exist.

---

# 18. Open Questions

Carried forward, unresolved, and not invented an answer for:

**18.1** — No backend/API support exists yet for longitudinal, multi-session data (Session Evolution). The frontend architecture reserves a structural slot for it (Section 16.1), but the feature cannot be built end-to-end until a corresponding API is defined.

**18.2** — No authentication or multi-user system currently exists. This affects: Human Review Panel persistence, clinic-level Settings, and the Audit Trail's real-world usefulness (17.8). All three are currently designed as UI-complete but state-non-persistent until this is resolved.

**18.3** — Two documented API response shapes conflict (`risk_level`/`confidence`/`detected_signals` in api_documentation.md vs. `decision.final_level`/`xai.reasons`/`fusion.summary` in design.md's Backend Integration Rules). The frontend's service layer cannot be finalized until one contract is confirmed as authoritative.

**18.4** — Whether the expanded Explainability deep-dive should be an in-page expansion (current default assumption, Section 5.3) or a dedicated deep-linkable sub-route. This affects whether Explainability needs its own URL/breadcrumb entry at all.

**18.5** — Whether "Context Memory" and "Context Fusion Engine" are one pipeline stage or two remains inconsistent across the source documentation (architecture.md and models_and_ai.md diverge). This architecture currently treats them as a single combined stage/tab (Fusion Engine) pending clarification.

**18.6** — Whether a conversations *list* endpoint exists at all to power the Dashboard Queue and History templates — not present in the current api_documentation.md. Both templates are designed against an assumed shape that needs backend confirmation.

**18.7** — No defined behavior yet for re-analysis/versioning of a conversation (new messages arriving, resubmission). Whether this creates a new record or versions an existing one affects both the History template's data model and the Audit Trail's structure (17.8).

---

# 19. Implementation Guidelines

For every future UI designer or frontend engineer working from this document:

1. **Never introduce a new spacing, color, radius, or duration value.** If a screen seems to need one, that is an architecture-level gap — raise it against Section 17/18, do not improvise a one-off value locally.
2. **Build screens zone-first, component-second.** Determine which zone (Top/Middle/Bottom/Right Panel/Split View, or collection-template equivalent) a piece of content belongs to before deciding what component renders it. A component with no clear zone is a sign the screen's information hierarchy hasn't been thought through yet.
3. **Every new screen must pass the "three questions" test** (per design.md): what happened, why, what next — answerable within three seconds of landing on it, without scrolling for the first question.
4. **Any AI-derived number, label, or flag must ship with its explanation reachable within one interaction**, per Section 1.6. This is a code-review-blocking requirement, not a stylistic preference.
5. **Default to Tier 1/2 visibility (Section 1.5); require a deliberate reason to promote something to always-visible.** The bias should always be toward hiding-by-default and revealing-on-demand, not the reverse.
6. **Reuse the Pipeline Progress pattern for every long-running AI operation** — do not build a second, competing "loading" pattern for a new feature. If the existing pattern doesn't fit a new use case, that's a Section 17 architecture decision to make explicitly, not a local workaround.
7. **Treat Section 15 (Information Priority) as a linter, not a suggestion.** Before shipping a screen, check its rendered order against the six-tier list — any violation should be treated the same as a broken build.
8. **Every destructive or clinically consequential action requires Confirmation, per the 17.5 precedent** — apply the same proportional-friction logic to any new high-stakes action introduced later, rather than treating 17.5 as a one-off special case.
9. **All open questions in Section 18 must be resolved (or explicitly re-flagged as still-open) before the affected feature ships** — none of them are blocking for continued design work in the meantime, but all are blocking for production release of the specific feature they touch.
10. **This document is the dependency, not a reference.** Every future page-specific specification (Dashboard, Analysis, Reports, etc.) should cite the relevant sections of this document rather than restating them — keeping this file the single source of truth for structural and behavioral rules, with page specs focused purely on that page's unique content.

---

**End of frontend_architecture.md.**
This document is the required foundation for every subsequent screen specification. Dashboard is the next screen to be designed, built directly on Section 4.6 / 5.2's definitions, once you confirm this architecture is approved.
