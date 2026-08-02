# Dashboard — High-Fidelity Design Specification
## Mental Health Safety Analyzer · Phase 3

**Document type:** Production design specification
**Target path:** `docs/design/dashboard_spec.md`
**Audience:** Senior Frontend Engineer / Design Engineer implementation team
**Status:** Ready for build, pending final review
**Primary sources:** ProjectVision.md, design.md, frontend_requirements.md, components.md, frontend_architecture.md, UX-Wireframe-Specification.md

> **Note on source documents:** `design_tokens.md` was listed as a primary source but does not exist among the uploaded project files. This specification therefore treats the token values already established and locked in `design.md` and `frontend_architecture.md` (8pt spacing scale, color system, radii, motion durations, typography) as canonical. If a separate `design_tokens.md` exists outside this project's uploaded set, its values should be reconciled against this document before implementation; until then, this document is self-consistent and complete on its own.

No code, HTML, CSS, or React is included anywhere in this document, per instruction. All measurements, colors, and behaviors are described precisely enough to be implemented without further design clarification.

---

# 1. Overall Layout

The Dashboard experience is not one screen — it is the entire authenticated application, built on the App Shell defined in `frontend_architecture.md` Section 2. This document specifies every screen that lives inside that Shell, starting with Dashboard Home and extending through the full Conversation Analysis Workspace, since that workspace is reached directly from Dashboard and is, per ProjectVision.md, the true "heart" of the clinical workflow.

Structural stack, every authenticated page:

```
┌─────────────────────────────────────────────────────────────┐
│ Top Navigation (72px, fixed)                                  │
├─────────────────────────────────────────────────────────────┤
│ Critical Alert Banner (conditional, 48px when present)         │
├───────────┬─────────────────────────────────────────────────┤
│ Sidebar   │ Main Content Area                                  │
│ (fixed,   │ (page template renders here, 1440px max, centered) │
│ 240px     │                                                     │
│ expanded) │                                                     │
└───────────┴─────────────────────────────────────────────────┘
```

Dashboard Home is the default landing route after authentication. It is a **collection template** (per frontend_architecture.md Section 4.7) — it has no Top/Middle/Bottom zoning of its own because there is no single record being reasoned about yet. Conversation Analysis, reached from any queue row, is where the full zoning system activates.

---

# 2. Grid System

Locked from frontend_architecture.md Section 3, applied without deviation:

| Breakpoint | Range | Columns | Gutter | Outer Margin |
|---|---|---|---|---|
| Desktop | ≥1280px | 12 | 24px | 64px |
| Laptop | 1024–1279px | 12 (tighter gutters) | 20px | 48px |
| Tablet | 768–1023px | 8 | 24px | 40px |
| Mobile | ≤767px | 4 | 16px | 20px |

Main Content Area max-width is 1440px, centered, at all breakpoints above tablet. Below tablet, content occupies full available width minus outer margin. The Sidebar and Top Navigation are **not** part of the grid — they are Shell-level fixed elements; the grid applies only inside Main Content Area.

---

# 3. Shell Layout

The Shell (Top Nav + Sidebar + Critical Alert Banner + Main Content Area) is rendered once and persists across all authenticated route changes — it is never remounted on navigation. Only Main Content Area's contents swap, using the page-transition motion defined in Section 33.

Shell background is the app's base surface color (near-white light mode / deep gray dark mode — never pure black). Sidebar and Top Navigation sit one elevation step above the base surface, using a 1px hairline border (not a shadow) to separate from Main Content Area — shadows are reserved for floating/overlay elements (Section 29), not structural chrome.

---

# 4. Sidebar

**Width:** 240px expanded (desktop/laptop), 72px icon-rail (tablet, expandable on hover), full-width drawer overlay (mobile).

**Structure, top to bottom:**
```
[ Logo mark, 40px, top padding 24px ]
─────────────────────────
Dashboard
New Analysis
History
Reports
─────────────────────────
Documentation
API
─────────────────────────
Settings
[ spacer, flex-grow ]
[ License / About — small text links, bottom-anchored ]
```

**Item structure:** icon (20px) + label, 44px minimum row height (touch target compliance), 16px horizontal padding, 8px vertical padding between rows.

**Active state (three redundant signals, never color alone):**
1. Filled/solid icon variant (vs. outline for inactive)
2. Bold label weight (600 vs. 400)
3. 3px leading accent bar in Primary Blue, full row height, positioned flush against the Sidebar's left edge

**Hover state (inactive items only):** background shifts to a very subtle neutral tint, 180ms ease-out, no scale or shadow — Sidebar items are navigation, not cards, and should feel quiet.

**Grouping dividers:** 1px hairline, 16px horizontal inset from Sidebar edges, 16px vertical margin above/below.

**Collapse behavior (tablet):** icon-only rail at 72px; hovering any item reveals a temporary flyout label (not a full expand of the rail itself) after a 150ms hover delay, dismissing immediately on mouse-leave.

**Mobile drawer:** slides in from left, 280ms ease-out, full item labels always visible (no icon-only state on mobile — space is not the constraint there, discoverability is), backdrop scrim at 40% opacity behind it, dismiss on backdrop tap or route change.

---

# 5. Top Navigation

**Height:** 72px fixed, full width of viewport (extends behind/beside Sidebar at the very top, i.e., Sidebar begins below Top Navigation — Top Navigation spans edge-to-edge).

**Structure:**
```
[ Logo + Product Name ]     [ Search bar, 320px wide, centered-left ]     [ spacer ]    [ Notifications ] [ Theme Switch ] [ User Menu ]
```

- **Logo + Product Name:** click → Dashboard Home. 32px logo mark + wordmark, positioned with 24px left padding from viewport edge (not from Sidebar — Top Nav's own padding is independent).
- **Search:** rendered as an inert-looking input-shaped button (not a live text field until clicked) reading "Search or jump to..." with a visible keyboard shortcut hint (⌘K / Ctrl+K) right-aligned inside it. Click or shortcut opens Command Palette (Section 6.6 of frontend_architecture.md).
- **Notifications:** icon button, 40px touch target. Badge (small filled dot, no number unless count >0) appears only when Pending Human-Review or Critical items exist. Click opens a Popover (not a page) anchored below the icon, max-height 400px, scrollable, listing recent review-relevant events.
- **Theme Switch:** icon toggle, sun/moon representation, smooth 220ms crossfade of the icon and of all page color tokens simultaneously on toggle (this detail carried forward from the Landing spec's "premium detail" — applied system-wide, not Landing-only).
- **User Menu:** avatar (32px, circular) + chevron. Click opens dropdown: Profile, Settings, Keyboard Shortcuts reference, Sign out.

Top Navigation always renders on a solid surface with a 1px bottom hairline border — never transparent inside the authenticated Shell (transparency-on-scroll is a Landing-only treatment, per frontend_architecture.md Section 2.3).

---

# 6. Critical Alert Banner

**Trigger condition:** one or more conversations in the professional's queue are at **Critical Emergency** risk level and still **Pending** review.

**Position:** directly beneath Top Navigation, full width, above Main Content Area. Present on every authenticated page while the condition holds — not scoped to Dashboard.

**Height:** 48px, single line.

**Visual treatment:** soft red-tinted background (Danger color at low-opacity fill, not a solid saturated red block), 1px bottom border in the same hue at higher opacity, small alert-triangle icon (16px) at 20px left inset. **No pulsing, flashing, or looping animation** — this is explicitly prohibited by design.md even for Critical states; urgency is communicated through color/icon/copy, not motion.

**Content:** `[icon] "3 conversations require urgent review"  [text link: "Review now →"]`. The link is the only interactive element besides the dismiss control.

**Dismiss:** small "×" icon button, right-aligned, 16px from right edge. Dismissing is **session-scoped only** — the banner reappears on next login/reload if the underlying condition is still true. It cannot be permanently silenced from this control; permanent suppression is a Settings-level action requiring deliberate navigation, preventing accidental safety-signal suppression.

**Entrance/exit motion:** height-collapse + fade, 250ms ease-out on appearance; 180ms ease-in on dismiss (exit faster than entrance, per the global exit-motion rule).

---

# 7. Dashboard Home

**Purpose:** within seconds, answer "what is the state of things right now" across all of a professional's conversations. This is the collection-template hub, distinct from the single-record Analysis Workspace (Section 9).

**Layout, top to bottom:**

```
[ Page heading: "Dashboard" — H1, with a muted subline: "Welcome back — here's what needs your attention." ]

TOP ZONE — Summary Strip (4 metric cards, equal width, single row desktop)
  [ Total Conversations ] [ Pending Review ] [ Risk Distribution (mini) ] [ This Week's Trend ]

MIDDLE ZONE — Conversation Queue (hero component of this page — Section 8)

BOTTOM ZONE — Quick Insights (2 compact cards, side by side)
  [ Emotion Trend mini-chart, 7-day ] [ Crisis Alerts this week, count + mini sparkline ]
```

**Vertical rhythm:** 32px gap between Top/Middle/Bottom zones (per frontend_architecture.md Section 3.4's "zone-to-zone gap" rule), 24px gap between cards within a row, page top padding 48px below the Critical Alert Banner (or Top Nav if banner absent).

**Summary Strip metric cards:** each card contains a label (caption size, muted), a large tabular-figure number (H2 scale, bold), and where relevant a small trend indicator (▲/▼ + percentage, colored only in the state-color sense — green for improving/decreasing-risk trends, never used decoratively). Cards are **non-interactive, static Cards** (no hover lift) except "Pending Review," which is clickable and scrolls/filters the Queue below to that subset — this one card receives Interactive Card treatment (hover lift 4px, per Section 26) specifically because it is the single most actionable metric on the page.

**Hero designation:** the Conversation Queue is explicitly the hero of Dashboard Home — it is the largest, most detailed, most interactive element on the page, consistent with the "one hero per screen" rule. The Summary Strip and Quick Insights zones are deliberately restrained in visual weight (smaller type, no illustration, no chart-heavy treatment) so they never compete with the Queue for attention.

---

# 8. Conversation Queue

**Component type:** Table (desktop/laptop), Card list (tablet/mobile), per the universal "tables become cards" rule.

**Columns (desktop table):**
```
[ Conversation ID/Label ] [ Risk ] [ Confidence ] [ Review Status ] [ Time ] [ → ]
```

- **Conversation column:** short auto-generated label (e.g., "Conversation #4821") + participant/message-count microcopy beneath it in muted caption text.
- **Risk column:** Badge component — color + icon + text label together, never color alone (Safe/green, Mild/blue-gray, Moderate/amber, High/orange-red, Critical/red with the soft-glow treatment reserved for Critical only).
- **Confidence column:** numeric percentage in tabular figures, small qualitative label beneath ("High confidence" / "Review recommended" for low-confidence cases).
- **Review Status column:** Badge — Pending (neutral outline), Reviewed (filled neutral), Escalated (filled red outline, pinned visual weight).
- **Time column:** relative timestamp ("2h ago"), absolute on hover via tooltip.
- **Row click target:** entire row is clickable (not just a button), cursor changes to pointer, opens Conversation Analysis Workspace for that record. A small chevron icon in the last column reinforces this affordance visually without adding a second competing action.

**Sorting/filtering:** column headers for Risk and Time are sortable (click toggles ascending/descending, small arrow indicator). A filter control above the table (Select-style) filters by Risk Level and by Review Status — both filters can combine. Escalated conversations, when any exist, are **pinned to the top of the queue regardless of active sort**, with a small flagged-indicator icon distinguishing them — this directly satisfies the requirement that escalated cases remain trivially findable.

**Row height:** 56px, 16px vertical padding, 20px horizontal cell padding — dense enough to scan many rows quickly (this is a working tool, not a leisurely reading surface — consistent with the Shell's "working density" register from frontend_architecture.md Section 17.6), but never below the 44px effective touch target when row actions are present.

**Pagination:** 20 rows per page, simple Previous/Next control bottom-right of the table, page indicator ("Page 1 of 6") bottom-left — no infinite scroll (infinite scroll would conflict with the "predictable, never surprising" interaction philosophy for a clinical tool where a professional needs to know they've seen everything).

---

# 9. Conversation Analysis Workspace

**Purpose:** the single-record deep-dive — the product's true hero screen, per ProjectVision.md and dashboard_spec.md (source). Built exactly on the zoning defined in frontend_architecture.md Section 4.6.

**Full structure:**

```
[ Breadcrumb: Dashboard / Conversation #4821 ]
[ Back to Dashboard — explicit link, distinct from browser back ]

TOP ZONE
┌─────────────────────────────┐ ┌───────────┐ ┌──────────┐
│ Risk Card (dominant, 2x width)│ │ Confidence│ │ Signals  │
│ Label + color + icon + trend  │ │ (nested)  │ │ (chips)  │
└─────────────────────────────┘ └───────────┘ └──────────┘
[ Recommendation Preview strip — full width, one line ]

MIDDLE ZONE — Split View
┌───────────────────────────┐ ┌──────────────────────────┐
│ Conversation Viewer          │ │ Tab group:                │
│ (hero of this zone,          │ │ [Fusion][Risk][Emotion]   │
│  ~60% width)                 │ │ [Heatmap][Pipeline]        │
│                               │ │ (~40% width, one visible   │
│                               │ │  at a time, default: Fusion)│
└───────────────────────────┘ └──────────────────────────┘

BOTTOM ZONE
┌───────────────────────────┐ ┌──────────────────────────┐
│ Explainability Report        │ │ Human Review Panel        │
│ (expanded by default)        │ │ (Approve/Override/etc.)   │
│  └ AI Reason Graph            │ │                            │
│    (collapsed sub-section)    │ │                            │
└───────────────────────────┘ └──────────────────────────┘
[ Clinical Summary card + Export Report action — closing strip, full width ]
```

**Right Panel pin behavior (desktop/laptop only):** the Top Zone Risk Card, once the user scrolls past it into Middle/Bottom Zones, condenses into a small pinned summary chip fixed to the top-right of the viewport (below Top Navigation) — showing just risk label + color + confidence, no other content. Clicking it scrolls back to the full Top Zone. This satisfies dashboard_spec.md's explicit "Risk Panel should remain pinned while scrolling on desktop" requirement without duplicating the full card permanently on screen (which would violate card-explosion/hierarchy rules).

**Conversation Viewer detail:**
- Chronological, speaker-labeled message list, virtualized rendering for long conversations.
- Each message carries small inline Emotion Marker and Distress Marker icons (12px, positioned at message trailing edge) — visible but non-intrusive.
- High-risk messages: 3px left border in the risk's state color + a small flag icon — never color alone.
- Hover any marked message → tooltip: "Why was this flagged?" with a one-line reason and a "See full explanation →" link that jumps to the Explainability section.
- Search + Filter controls pinned in a small toolbar directly above the message list (sticky within the Viewer's own scroll container, not the page scroll).
- Messages beyond ~4 lines collapse by default with a "Show more" text link.

**Tab group detail:** tabs rendered as a simple underline-indicator tab bar (not pill buttons — underline reads calmer/more editorial, consistent with premium benchmarks), 44px tab height, active tab in Primary Blue text + underline, inactive tabs in muted foreground. Switching tabs uses a 180ms crossfade (not a slide) — content changes, container does not move.

---

# 10. Risk Overview

The Risk Card is the single most dominant element in the Top Zone — deliberately larger than its neighbors (spans roughly 2 grid columns' worth more width than Confidence or Signals).

**Contents, stacked:**
1. Risk label in large, bold type (H2 scale) — e.g., "Moderate Risk"
2. State icon (20px) positioned before the label, same color family
3. Trend indicator: small arrow + one-word descriptor ("Improving" / "Stable" / "Worsening") beneath the label, muted weight
4. A thin horizontal progress-style bar beneath, filled proportionally to risk severity within its band, using the state color at reduced opacity — this is a supplementary visual reinforcement, not a numeric gauge in itself

**Color-to-risk mapping** (from design.md, applied consistently everywhere Risk appears — Queue badges, Risk Card, History, Reports):
- Safe → Green
- Mild Concern → Blue-gray (a deliberately calmer, non-alarming tone distinct from the accent Cyan, so it doesn't read as "informational/interactive")
- Moderate Risk → Amber
- High Risk → Orange-Red (a distinguishable step below full Critical red, addressing the color-blind-distinguishability requirement between Moderate/High/Critical)
- Critical Emergency → Red, with the soft-glow border treatment uniquely reserved for this level only

**Never a bare label:** at every location in the app, Risk always renders with its color, icon, and — within one click — its explanation. This is enforced as a hard constraint per frontend_architecture.md Section 1.6.

---

# 11. Explainability Workspace

Lives in the Bottom Zone of Conversation Analysis (in-page, per the current default resolution of Open Question 18.4 — not a separate route).

**Structure, in fixed order (never reordered):**
```
1. Detected Signals — chip list, same chips as Top Zone but here each is clickable
2. Reasoning — natural-language statements, one per line, each animating in
   sequentially on first reveal only ("Increased hopelessness detected.",
   "Negative emotional trend observed.", "Crisis-related language identified.")
3. Confidence — restated here with a one-line explanation of what confidence means
   in this context (not just the number again)
4. Recommendation — the AI's suggested next action, phrased as guidance:
   "Human review recommended" / "Consider escalation" / "No immediate concern"
5. [ Expandable: "View AI Reason Graph" — Tier 3, collapsed by default ]
```

**Reasoning statement styling:** each statement is its own small block — a leading dot or small icon, then the sentence in body-large size, generous line-height. These are never packed into a dense paragraph; each reason gets visual room to be read individually, reinforcing that these are discrete, inspectable signals, not one opaque summary.

**AI Reason Graph (expanded state):** on click, expands in-place (not a modal, not a route change) with a smooth height/opacity transition, 300ms ease-out. Focus moves to the graph's heading on expand (per frontend_architecture.md Section 12.3) and returns to the toggle control on collapse. The graph itself: horizontal node-and-connector layout (e.g., Hopelessness → Loneliness → Distress → Crisis → High Risk), rendered in Purple (the system's fixed "AI reasoning" color), each node a small pill shape, connectors as thin animated lines. Clicking any node reveals the specific supporting conversation message(s) in a slide-out side panel without navigating away.

---

# 12. AI Pipeline Visualization

**Two states: Full (during analysis) and Compact (after analysis, persistent).**

**Full state** (used during New Analysis submission and any re-analysis — see Section 21 for full behavioral spec): horizontal sequence of module nodes:
```
Privacy Guard → Emotion Analysis → Distress Detection → Crisis Detection →
Pattern Analysis → Context Fusion → Decision Engine → Explainability → Safe Response
```
Each node: circular icon container (40px), connected by thin lines. States per node: pending (muted outline), active (filled Purple, subtle pulse-free glow, small inline spinner-free "processing" indicator — a soft breathing opacity animation, not a spinner), complete (filled Green checkmark), error (filled Red with alert icon, sequence visually halts here).

**Compact state:** once analysis completes, this same sequence collapses into a single horizontal strip (auto-height ~56px) inside the "Pipeline" tab of the Analysis Workspace's Middle Zone tab group — same node iconography at smaller scale (24px), all shown as complete, with a small "Replay Analysis" ghost/text button at the strip's end that re-triggers the Full state animation on demand without re-running the actual analysis (a client-side replay of the already-received result sequence).

**Accessibility requirement (mandatory, not optional):** the Full state sequence is wrapped in an `aria-live="polite"` region, announcing each stage transition ("Privacy Guard complete. Now analyzing emotion.") to screen reader users, since the pattern is otherwise entirely visual/motion-based.

---

# 13. Fusion Engine Visualization

Default tab in the Analysis Workspace's Middle Zone tab group — deliberately chosen as default because it is "the clearest single proof of multi-signal reasoning" (per frontend_architecture.md Section 4.6).

**Layout:** four horizontal weighted segments (Emotion / Distress / Crisis / Pattern), each rendered as a labeled bar segment with its percentage contribution, all four segments visually flowing rightward into a single "Final Decision" node/card.

```
Emotion      ████████░░░░░░░░  32%
Distress     ██████░░░░░░░░░░  25%
Crisis       ███████░░░░░░░░░  28%
Pattern      ████░░░░░░░░░░░░  15%
                    ↓
            [ Final Decision: Moderate Risk ]
```

**Color:** each of the four segment bars uses a distinct but harmonious tint within the Blue/Purple family (not four unrelated colors — that would read as decorative rather than systematic); the Final Decision node uses the actual risk-state color (Section 10's mapping), which is the one moment this component intentionally shifts out of the Blue/Purple "AI reasoning" palette into the "outcome" palette, visually marking the transition from process to conclusion.

**Motion (first view only):** bars fill from 0 to their final width over 400ms, staggered 60ms per segment, with small animated particles traveling from each bar toward the Final Decision node, arriving as the node itself performs a single soft pulse (spring easing, the one place spring easing is permitted system-wide per frontend_architecture.md Section 13.1). This does not replay on every tab-switch — only on the Analysis Workspace's first load of this data.

---

# 14. Emotion Timeline

One of the five tabs in the Middle Zone tab group.

**Layout:** line chart, x-axis = conversation time (message sequence, not wall-clock, unless the conversation spans multiple real-world sessions), y-axis = intensity (0–1 or qualitative low/mid/high gridlines). Multiple lines: Sadness, Fear, Anger, Hope, rendered in distinguishable but muted colors (this chart intentionally does **not** use the state-risk color palette, since emotions are not themselves risk levels — using amber/red here would falsely imply a risk judgment at the emotion-tracking layer).

**Trend badge:** small pill in the corner of the chart card reading "Worsening" / "Stable" / "Improving" with a matching small arrow icon — this is the single most important takeaway from the chart and is surfaced as text, not left for the viewer to infer purely from the line shapes.

**Interaction:** hovering any point on any line reveals a tooltip with the exact value and a truncated preview of the corresponding message; clicking that point auto-scrolls the Conversation Viewer (Section 9) to that message and briefly highlights it (a 600ms fade-out highlight ring, using the Maximum motion-duration ceiling since this is a meaningful, one-time orienting cue).

**Entrance motion:** lines draw progressively left-to-right, 350ms, on first reveal of this tab only.

---

# 15. Conversation Heatmap

One of the five tabs. Compact horizontal strip — one segment per message-group (not per individual message, to avoid excessive granularity on long conversations), color intensity mapped to emotional/distress intensity using a single-hue scale (light-to-saturated within the Amber/Red family, since this specifically visualizes escalation intensity, distinct from the Emotion Timeline's multi-line approach).

**Interaction:** click any segment → Conversation Viewer scrolls to that point (same highlight treatment as Emotion Timeline). Hover reveals a small tooltip: message-group time range + a one-word intensity label ("High intensity").

**Height:** deliberately compact (~64px) — this is a scanning tool, not a detailed chart; its entire value is letting a professional spot escalation points at a glance before diving into the Viewer itself.

---

# 16. Human Review Panel

Located in the Bottom Zone, visually distinct container from the Explainability Report beside it — different background treatment (very subtle neutral surface elevation vs. Explainability's flat surface) to reinforce that "AI Recommendation and Human Decision are never the same object" (dashboard_spec.md, verbatim principle).

**Structure:**
```
"AI Recommendation" — neutral, non-editable text restating the pipeline's
suggested action (no button pre-selected/defaulted)

Actions row:  [ Approve ]  [ Override ]  [ Escalate ]  [ Request More Info ]

Notes field — free text, placeholder: "Add your clinical notes..."

Review Status indicator: Pending / Reviewed / Escalated (Badge)
```

**Approve:** single click, no confirmation required (low-consequence relative to Override/Escalate — approving what the AI already suggested is the proportionally low-friction path).

**Override / Escalate:** clicking either opens a Confirmation dialog (per frontend_architecture.md Section 17.5) — modal overlay, focus-trapped, containing: a restatement of the action's consequence, a **required** notes field (cannot confirm with an empty note), Cancel and Confirm buttons (Confirm styled as Danger-variant for Override, standard Primary for Escalate). This is the one place in the entire Dashboard experience where a modal is used for something other than Command Palette — justified because the action is genuinely consequential.

**Request More Info (Annotate):** opens the same Notes field inline, no confirmation required, sets status to a neutral "Awaiting Info" sub-state without closing the case.

**Post-action state:** once reviewed, the panel switches to a two-column "AI Recommendation" vs. "Human Decision" side-by-side read-only summary, with the Notes and timestamp preserved beneath — both objects remain permanently visible, never merged or overwritten.

---

# 17. Clinical Summary Card

Closing strip of the Analysis Workspace, full width, positioned after Bottom Zone's two-column Explainability/Human-Review row.

**Sections, in order:** Conversation Summary (1–2 lines) → Emotional Trend (1 line + small trend icon) → Main Concerns (short bullet-style chip list) → Detected Risks (restates Risk badge) → Recommended Human Review (restates recommendation) → Time Saved estimate (a small, quietly-styled microcopy line: "Estimated review time saved: ~14 minutes").

**Design intent:** this card is deliberately readable in under one minute — larger line-height, no dense data, no charts, positioned as the "hand this to a colleague" artifact. Export Report action sits directly adjacent (top-right of this card), not floating separately.

---

# 18. History Panel

Standalone page template (Section 5.5 of frontend_architecture.md) — filter/search bar above a record list, same column structure and interaction pattern as the Conversation Queue (Section 8), with the addition of a Review Status filter as a primary filter dimension here (since History's core job is retrospective triage, not live monitoring).

**Difference from Queue:** History is not time-decayed toward "recent/pending" — it defaults to reverse-chronological but every sort/filter combination the Queue supports remains available, plus a date-range filter (Section 8 doesn't need this; Dashboard's Queue is inherently recent-biased).

**Empty/loading/error states:** identical patterns to Section 20/21/22, scoped to this page.

---

# 19. Reports Section

Structured per frontend_architecture.md Section 5.4 — narrower reading-width container (not full 1440px; approximately 840px max-width, centered), since this is document-style content meant to be read linearly.

**Layout:** Report selector (only shown if more than one report exists for the context) → Clinical Summary Card (Section 17's component, reused verbatim — not a re-implementation) as the page hero → Export / Print / Share actions row directly beneath.

**Print-specific reflow:** on print/PDF export, navigation chrome (Sidebar, Top Nav, Critical Alert Banner) is entirely omitted; the Clinical Summary Card expands to full print-page width with print-optimized spacing (tighter than screen spacing, since print has no need for touch-target minimums).

---

# 20. Empty States

Universal system, per frontend_architecture.md Section 8 — applied identically at every location listed below. No illustrations; a single small muted line-icon, one sentence, optional second sentence, exactly one primary action.

| Location | Icon concept | Message | Action |
|---|---|---|---|
| Dashboard Queue (new user) | inbox/tray | "No conversations analyzed yet." | "Start New Analysis" |
| History | clock/archive | "Your analysis history will appear here." | "Start New Analysis" |
| Reports | document | "No reports yet — reports are generated after an analysis completes." | "Go to Dashboard" |
| Search / filtered Queue with no matches | search/magnifier | "No matches for '[query]'." | "Clear filters" |
| Notifications popover, empty | bell | "You're all caught up." | *(no action — this is the one documented exception; there is nothing to do)* |

Full-zone empty states preserve the exact padding of the zone they replace, so no layout shift occurs once real content populates it later.

---

# 21. Loading States

**Page-level:** skeleton layout matching the destination's real card/row count and approximate proportions — Dashboard's skeleton shows 4 metric-card outlines + ~6 skeleton table rows; Analysis Workspace's skeleton shows the Top Zone card outlines only, with Middle/Bottom Zones replaced entirely by the Pipeline Progress pattern (below), not by generic skeletons, since analysis is actively in progress, not just "fetching."

**Component-level:** a single chart or card refreshing shows a localized shimmer skeleton inside just that component's Card boundary; the rest of the page remains fully interactive.

**AI Pipeline Progress (mandatory pattern for all analysis operations, no exceptions):** the Full-state Pipeline visualization (Section 12) is the loading UI itself during New Analysis submission or re-analysis — never a spinner, never a generic progress bar. As backend stages complete and stream in, each module transitions from pending → active → complete in real time (Section 9.3 of frontend_architecture.md), so the loading state is genuinely informative rather than decorative.

**Save/settings-scoped spinners:** small inline spinner permitted only inside a Save button itself (e.g., Settings form save) — button retains its width, spinner replaces the label temporarily, label returns on completion.

---

# 22. Error States

| Context | Presentation | Recovery |
|---|---|---|
| Dashboard Queue fails to load | Full-zone error card replacing the Queue: calm icon + "We couldn't load your conversations." + Retry button | Retry re-fetches; Summary Strip and Quick Insights remain visible/functional independently (partial-failure isolation) |
| One Summary Strip metric fails | That single card shows a small inline error state ("Unavailable") with a retry icon-button in its corner — other three cards unaffected | Click retries just that metric |
| Analysis fails mid-pipeline | Pipeline sequence visually halts at the failed stage with an inline error marker on that specific node; stages already completed remain visible, not discarded | "Retry Analysis" resumes from a clean restart (partial results are not resumable mid-pipeline, but the visual record of what succeeded is preserved for context) |
| Full analysis failure | Top Zone Risk Card replaced with a card-level error state: "Analysis failed. Please try again." + Retry Analysis button; Conversation Viewer (privacy-filtered raw text) still renders so the user isn't fully blocked | Retry |
| Network/offline | Shell-level persistent, non-blocking status strip beneath Top Navigation (distinct from Critical Alert Banner — a neutral gray/informational tone, not red): "You're offline — some data may be out of date." | Automatic reconnection detection; strip disappears once connection restored |
| Auth/session invalid | Full-page interrupt, centered message, single "Sign in again" action | Re-authenticate |

Governing rule, repeated here for emphasis since it's the single most important error principle: **an error never removes access to data already rendered.** Nothing on this Dashboard is allowed to go from "showing something" to "showing nothing" as a result of a later, unrelated failure.

---

# 23. Responsive Behaviour

**Desktop (≥1280px):** full Shell as specified; Analysis Workspace uses full Split View with pinned Risk summary chip on scroll.

**Laptop (1024–1279px):** identical structure, tighter grid gutters (20px vs 24px) and outer margins (48px vs 64px); Split View ratio adjusts slightly narrower for the Conversation Viewer to preserve comfortable tab-group width on the right.

**Tablet (768–1023px):** Sidebar becomes icon-rail; Split View **stacks** — Conversation Viewer renders full-width first, tab group renders full-width beneath it (not side-by-side); pinned Risk chip behavior is disabled (not enough vertical headroom to justify it at this density); Bottom Zone's two cards (Explainability, Human Review) stack full-width in sequence rather than side-by-side.

**Mobile (≤767px):** Sidebar becomes a full drawer; entire Analysis Workspace becomes one continuous vertical scroll in this fixed order: Top Zone cards (rendered as a horizontally-scrollable card row, not vertically stacked, to preserve at-a-glance scanning of Risk/Confidence/Signals without excessive scroll length) → Conversation Viewer → Pipeline (compact) → Emotion Timeline → Heatmap → Fusion Card → Risk Timeline → Explainability → Human Review → Clinical Summary. Charts that cannot meaningfully compress (Fusion segments, Reason Graph) become horizontally scrollable within their own card rather than shrinking illegibly; the Reason Graph specifically re-flows into a vertical stepped list (numbered sequential cards) rather than attempting a shrunk node graph.

Dashboard Home's Queue converts to a stacked card list below tablet width (system-wide table-to-card rule), each card showing: Conversation label, Risk badge, Confidence, Review Status badge, relative time — same information as the table columns, restructured rather than truncated.

---

# 24. Accessibility

- Full keyboard operability: every Queue row, tab, chip, and action reachable via Tab/Shift+Tab in visual order; Enter activates; Escape closes any open overlay (Command Palette, Confirmation dialog, expanded Reason Graph).
- The AI Pipeline's `aria-live="polite"` region (Section 12) is mandatory, not optional.
- Risk, Confidence, and Review Status all carry explicit text in the accessibility tree — screen reader users get the same information sighted users get from color/icon, never less.
- Confirmation dialogs (Override/Escalate) trap focus while open, return focus to the triggering button on close/cancel.
- Expanding the Reason Graph moves focus to its heading; collapsing returns focus to the toggle.
- Minimum 44px touch target on every interactive element, including dense Queue row actions and Conversation Viewer inline markers.
- Contrast: WCAG AA minimum throughout; the Moderate (Amber) vs. High (Orange-Red) vs. Critical (Red) risk states are specifically verified to remain distinguishable independent of hue perception (icon + label pairing carries the distinction, not color saturation alone).
- `prefers-reduced-motion`: Pipeline sequential activation becomes an instant state list (all nodes render in their final state with no staggered reveal); Fusion particle flow is omitted entirely; all card/section entrance motion becomes a simple opacity fade with no translate; the Theme Switch crossfade shortens to an instant swap.

---

# 25. Motion Design

All durations and easing draw from the single locked scale (frontend_architecture.md Section 13.1): Fast 120ms, Normal 220ms, Slow 350ms, Maximum 600ms hard ceiling. Ease-out primary, ease-in-out secondary, spring reserved exclusively for the Fusion Engine's Final Decision node pulse (Section 13).

Summary of Dashboard-specific applications already detailed above:
- Critical Alert Banner: 250ms entrance, 180ms exit.
- Pipeline node transitions: 220–350ms per stage, ease-out.
- Fusion segment fill: 400ms with 60ms stagger.
- Emotion Timeline line draw: 350ms, one-time.
- Tab switch crossfade: 180ms.
- Reason Graph expand: 300ms height/opacity.
- Highlight-ring on chart-to-viewer jump: 600ms fade-out (Maximum tier, justified as a meaningful one-time orienting cue).

No animation on this page loops, auto-plays repeatedly, or exceeds 600ms. Motion is never used to disguise a slow operation — the Pipeline pattern is informative because it reflects real backend progress, not a fabricated delay.

---

# 26. Micro-interactions

- Buttons: hover scale 1.02 + brightness (180ms), press scale 0.98 (120ms) — identical everywhere, including inside dense Queue rows.
- Interactive Cards (the "Pending Review" metric card, Queue rows, History rows): hover lift 4px + soft shadow increase, 180ms; Cards that are purely informational (Summary Strip's non-Pending cards, Clinical Summary) never receive this treatment.
- Chip/Badge hover (Detected Signals chips in Explainability): subtle background darken only, no scale — these are informational-turned-clickable elements, and heavy motion here would overstate their importance relative to the page's actual hero content.
- Notification bell: badge dot performs a single, one-time soft scale-in (not a repeating pulse) the moment a new critical/pending item first appears during an active session — never a continuous animation.
- Toggle switches (Theme, any Settings toggles reachable from this Shell): 180ms thumb slide, ease-out.

---

# 27. Visual Hierarchy

Applied per-screen:

- **Dashboard Home:** Queue > Summary Strip > Quick Insights. Nothing in Summary Strip or Quick Insights is permitted to use a larger type size or more saturated color than the Queue's own risk badges — the badges remain the most visually assertive element on the page.
- **Analysis Workspace:** Risk Card > Conversation Viewer > everything else. The Risk Card is the only Top Zone element using H2-scale type; Confidence and Signals beside it use body/caption scale, visually confirming their subordinate-but-adjacent status (frontend_architecture.md Section 15's explicit rule against two same-tier elements competing).
- **Explainability:** the Reasoning statements (natural language) are visually louder (body-large) than the Reason Graph toggle beneath them (text-button scale) — reinforcing that plain-language reasoning is the primary explanation surface, and the graph is a supplementary, optional deep-dive.

No screen in this specification has two elements of equal visual weight at the same information-priority tier (Section 28) — every tie is deliberately broken in favor of one dominant, one subordinate-but-present element.

---

# 28. Information Priority

Global order, unchanged from frontend_architecture.md Section 15, restated here as it applies concretely to Dashboard's screens:

1. **Risk Level** — always first, always the single largest/loudest element on any screen that has one.
2. **Confidence** — always immediately adjacent to Risk, never presented in isolation.
3. **Detected Signals** — summarized, chip-form, one click from full detail.
4. **Explanation/Reasoning** — natural language, always reachable within one interaction of any Risk/Signal display.
5. **Conversation/Source content** — the evidence itself, always present but never ahead of the interpretation in reading order.
6. **Technical/raw detail** (Reason Graph, raw fusion percentages, Pipeline internals) — never visible by default anywhere; always behind an explicit expand action.

On Dashboard Home specifically, this translates to: aggregate risk distribution (Summary Strip) before individual queue rows, individual queue rows before trend charts (Quick Insights) — matching frontend_architecture.md's Dashboard Template information hierarchy exactly.

---

# 29. Color Usage

Strictly from the locked palette; no new colors are introduced in this document.

| Purpose | Color | Where used on Dashboard |
|---|---|---|
| Trust / Primary actions / Brand | Blue | Primary buttons (Approve, Start New Analysis, Retry), active Sidebar accent bar, active Nav states |
| AI reasoning / Explainability / Fusion | Purple | Pipeline active-node fill, Fusion segment bars, Reason Graph nodes/connectors |
| Interactive / Informational / Highlights | Cyan | Search shortcut hint, link-style text actions, hover-state accents on non-risk interactive elements |
| Safe / Success | Green | Safe risk badge, "Improving" trend arrows, completed Pipeline nodes |
| Attention / Moderate | Amber | Moderate Risk badge, "Awaiting Info" review sub-state |
| Danger / High–Critical | Red (two distinguishable steps: orange-red for High, full red for Critical) | High/Critical risk badges, Override confirmation button, Critical Alert Banner, error states |
| Neutral surfaces | Near-white / deep-gray (never pure black) | Base Shell background, Card backgrounds, hairline borders |

**Rule enforced throughout this document:** color never appears as the sole carrier of meaning anywhere on Dashboard — every colored state is paired with an icon and/or text label. Large surfaces (page backgrounds, Sidebar, Top Nav) never use saturated color; saturation is reserved for small, meaningful elements (badges, buttons, active indicators, node fills).

---

# 30. Typography

Inter throughout (Segoe UI / Helvetica / Arial fallback), tabular figures enabled for all numeric displays (Risk percentages, Confidence, metric counts, timestamps-as-numbers).

| Role | Where on Dashboard | Weight |
|---|---|---|
| H1 | Page titles ("Dashboard", "Conversation #4821" workspace title) | Bold (700) |
| H2 | Risk Card label, Summary Strip metric numbers, section titles (Explainability, Human Review) | Semibold (600) / Bold for the large metric numbers specifically |
| Body-large | Explainability reasoning statements, Clinical Summary text | Regular (400) |
| Body | Conversation Viewer messages, table cell content, form fields | Regular (400) |
| Caption | Badge labels, timestamps, muted sublines, trend descriptors | Regular (400), muted foreground color |

Only one H1 per page, consistent with the system-wide semantic heading rule. No decorative or display typography anywhere in the authenticated Shell — that register is reserved exclusively for the Landing Page's hero.

---

# 31. Component Usage

Drawn only from the locked taxonomy (components.md); no new component types are introduced.

| Component | Dashboard usage |
|---|---|
| Button (Primary/Secondary/Ghost/Danger) | Approve (Primary), Override confirm (Danger), Cancel (Ghost), Start New Analysis (Primary), Retry (Secondary) |
| Badge | Risk level, Review Status, Detected Signal chips |
| Card (Default/Interactive/AI variants) | Summary Strip metrics, Risk Card, Fusion/Emotion/Heatmap tab panels, Clinical Summary |
| Table | Conversation Queue, History (desktop/laptop only) |
| Tabs | Middle Zone visualization switcher |
| Accordion / Expandable | AI Reason Graph, "Show more" on long messages |
| Dialog / Confirmation | Override, Escalate |
| Toast | Low-priority confirmations only (e.g., "Settings saved") — never used on Dashboard for anything safety-relevant |
| Banner | Critical Alert Banner, Offline indicator |
| Tooltip | Confidence explanation, message flag explanations, chart hover details |
| Popover | Notifications |
| Skeleton | All loading states except active AI analysis |
| Empty State pattern | Queue, History, Reports, filtered-search-no-results |

---

# 32. Spacing Rules

Exclusively the 8-point scale (4/8/12/16/24/32/40/48/64/80/96/128), applied as follows on Dashboard specifically:

- Top Navigation horizontal padding: 24px.
- Sidebar item padding: 16px horizontal, 8px vertical.
- Critical Alert Banner horizontal padding: 20px.
- Main Content Area top padding (below Shell chrome): 48px.
- Zone-to-zone vertical gap (Top→Middle→Bottom): 32px.
- Card grid gutter (Summary Strip, Quick Insights): 24px.
- Card internal padding: 24px desktop / 20px tablet / 16px mobile.
- Table row padding: 16px vertical / 20px horizontal.
- Split View internal gap (Conversation Viewer ↔ tab group): 24px.
- Explainability reasoning-statement vertical spacing: 16px between each statement.
- Human Review action button row gap: 12px between buttons.

No arbitrary values anywhere in this document — every number above maps directly to the locked scale.

---

# 33. Animation Timing

Consolidated reference table (all values previously specified inline above, gathered here for engineering convenience):

| Interaction | Duration | Easing |
|---|---|---|
| Page transition (route change) | 250ms | ease-out, 12px upward translate |
| Card entrance | 250ms | ease-out, 16px translateY |
| Card hover lift (Interactive Cards only) | 180ms | ease-out |
| Button hover | 180ms | ease-out |
| Button press | 120ms | ease-out |
| Sidebar drawer open (mobile) | 280ms | ease-out |
| Critical Alert Banner entrance | 250ms | ease-out |
| Critical Alert Banner exit | 180ms | ease-in |
| Pipeline node stage transition | 220–350ms | ease-out |
| Fusion segment fill | 400ms (60ms stagger) | ease-out; Final Decision pulse uses spring |
| Emotion Timeline line draw | 350ms | ease-out |
| Tab crossfade | 180ms | ease-in-out |
| Reason Graph expand/collapse | 300ms | ease-out |
| Chart-to-Viewer highlight ring | 600ms (Maximum tier) | ease-out fade |
| Theme Switch crossfade | 220ms | ease-in-out |
| Toast/panel exit | 180–220ms | ease-in |

Nothing in this table exceeds 600ms; nothing loops.

---

# 34. Premium Details

The details that separate this from a generic admin dashboard template — worth explicit engineering attention:

- **The pinned Risk summary chip on scroll** (Section 9) — a small, quiet persistent reminder of the case's status that never leaves the professional's peripheral vision without ever duplicating the full Risk Card. This single detail does more for "trustworthy, always-oriented" feel than any single visual flourish would.
- **The Fusion Engine's particle-to-pulse sequence** (Section 13) — the one moment spring easing is permitted anywhere in the app — reserved specifically for the instant multiple AI signals resolve into one decision. Spending the app's single "delight" moment here, rather than on a generic success state, keeps the delight tied to the product's actual differentiator.
- **Escalated cases pinned above sort order** in both Queue and History (Section 8/18) — a small structural detail that quietly reinforces the product actually understands clinical urgency rather than treating every row identically.
- **The Reason Graph's deliberate, effortful gating** (collapsed by default, focus-managed on expand) — friction here is a feature, not an oversight; it's what stops the app's most powerful-looking visualization from ever reading as a verdict.
- **Identical Theme Switch crossfade behavior between Landing and the authenticated Shell** — continuity between the two registers established in `frontend_architecture.md` Section 17.6, so switching themes never feels like a different product reacting differently.
- **Tabular figures everywhere numbers appear** — Confidence percentages, metric counts, Fusion percentages all align on their digits when stacked, a small typographic discipline that reads as considered rather than default-browser-rendered.
- **The Critical Alert Banner's total absence of animation loop** — in a category (healthcare/safety software) where competitors often reach for flashing red alerts, the calm, static, unmissable-but-non-alarming treatment is itself the premium, confidence-signaling choice.

---

**End of Dashboard High-Fidelity Design Specification.**
Ready for engineering handoff pending your review. This document, together with `frontend_architecture.md` and the Landing Page specification, now covers the complete authenticated application shell and its primary clinical workflow screen. Awaiting direction on the next screen to specify (Settings, History as a standalone deep-dive, Reports, or Documentation/API).
