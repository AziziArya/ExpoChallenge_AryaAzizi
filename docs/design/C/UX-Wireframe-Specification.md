# Mental Health Safety Analyzer — UX Wireframe Specification

**Document type:** UX Architecture Specification (pre-visual)
**Status:** Draft for approval — no visual UI, no code
**Source of truth:** ProjectVision.md, README.md, architecture.md, pipeline.md, models_and_ai.md, api_documentation.md, privacy_and_safety.md, design.md, frontend_requirements.md, components.md, dashboard_spec.md
**Prepared as:** Senior Product Design wireframe spec — structural and behavioral definition only. All layout blocks below are structural (ASCII) representations of hierarchy and placement, not visual design.

---

## 0. How to Read This Document

Every page section below follows the same structure:

- **Purpose** — the one question this screen/section must answer (per design.md's "Focus Points" rule)
- **Layout Zones** — structural placement, top→bottom, left→right
- **Components Placed** — mapped to components.md's taxonomy
- **Primary Interactions** — what the user can do
- **States** — loading / empty / error / offline, specific to that screen
- **Responsive Behavior** — desktop → tablet → mobile transformation
- **Data Source** — which API/service field drives it (per design.md's "Backend Integration Rules")

This document does not resolve the two open contract-naming discrepancies flagged in the prior analysis (`risk_level` vs `decision.final_level`, etc.). Data Source lines use the field names as documented; the field name should be confirmed against the real backend before implementation.

---

## 1. Global Navigation System

### 1.1 Structure

```
┌─────────────────────────────────────────────────────────────┐
│ TOP NAVIGATION (sticky, 72px)                                │
│  Logo | Product Name        Search        Notif  Theme  User │
├───────────┬─────────────────────────────────────────────────┤
│           │                                                   │
│  SIDEBAR  │              MAIN WORKSPACE                       │
│           │              (max-width 1440px, centered)         │
│  Dashboard│                                                   │
│  New      │                                                   │
│  Analysis │                                                   │
│  History  │                                                   │
│  Reports  │                                                   │
│  Docs     │                                                   │
│  API      │                                                   │
│  Settings │                                                   │
│           │                                                   │
└───────────┴─────────────────────────────────────────────────┘
```

### 1.2 Top Navigation — Contents & Behavior

| Element | Behavior |
|---|---|
| Logo + Product Name | Click → Dashboard |
| Search | Global search across conversations/reports; opens Command Palette on click or keyboard shortcut |
| Notifications | Icon Button; badge shown only for Human-Review-required or Critical items; click opens a Popover list, not a full page |
| Theme Switch | Toggles Light/Dark; persists as a user preference (Context-level state) |
| User Menu | Profile, Settings shortcut, Sign out |

Sticky at all breakpoints. Never hidden on scroll — professionals must always be able to navigate away from a high-risk screen.

### 1.3 Sidebar — Contents & Behavior

Sections, in priority order (matches Information Priority rule):

1. Dashboard
2. New Analysis
3. History
4. Reports
5. Explainability *(only shown as a standalone entry if a conversation is currently open — otherwise nested under conversation view)*
6. Documentation
7. API
8. Settings

- **Desktop:** persistent, always expanded, current page has a filled/active state indicator (not color alone — also a leading bar + bold label)
- **Tablet:** collapsible to icon-only rail; expands on hover or tap
- **Mobile:** becomes a Drawer, triggered by a hamburger control in Top Navigation; closes on route change or outside tap

### 1.4 Command Palette

- Triggered from Search or keyboard shortcut
- Actions: jump to conversation, start new analysis, jump to settings, search past reports
- Modal overlay, keyboard-navigable, Escape to close
- Primarily serves the Developer and AI Researcher personas but available to all

---

## 2. Global System States

These patterns apply across every page unless a page-specific override is noted.

### 2.1 Loading State Philosophy

Per frontend_requirements.md: never a blank white screen; never a generic infinite spinner where a more meaningful pattern is possible.

- **Page-level load:** Skeleton layout matching the final page's card structure (no layout shift when real content arrives)
- **AI analysis in progress:** Pipeline Progress pattern — see Section 8 (AI Reasoning Workflow) — not a generic spinner
- **Component-level load (e.g., a single chart refreshing):** localized skeleton inside that component's card only; rest of page stays interactive

### 2.2 Empty State Philosophy

Every empty state answers: *why is this empty* + *what can I do next*.

| Context | Message Pattern | Primary Action |
|---|---|---|
| No conversations analyzed yet | "No conversations analyzed yet." | "Start New Analysis" button |
| No reports generated | "No reports yet — reports are generated after an analysis completes." | "Go to Dashboard" |
| No search results | "No matches for '[query]'." | "Clear search" |
| History empty | "Your analysis history will appear here." | "Start New Analysis" |

### 2.3 Error State Philosophy

Every error includes: clear plain-language message + recovery action + retry when applicable. Never a raw stack trace or raw API error.

| Error Type | Pattern |
|---|---|
| Network/timeout | Inline banner: "Connection issue — analysis could not be reached." + Retry button |
| Analysis failed | Card-level error state replacing the would-be result card: "Analysis failed. Please try again." + "Retry Analysis" |
| Invalid input (e.g., empty conversation submitted) | Inline form validation, before submission attempt |
| Auth/session error | Full-page interrupt only if session truly invalid; otherwise toast |
| Partial failure (one module failed, others succeeded) | Explicit partial-state messaging: which signal is unavailable, rest of report still shown — never silently drop a section |

### 2.4 Offline State

- Top Navigation shows a persistent, non-blocking status strip: "You're offline — some data may be out of date."
- In-flight submissions are queued/blocked with explicit messaging, not silently lost.

### 2.5 Reduced Motion Global Override

- If `prefers-reduced-motion` is set: Pipeline animation, Fusion particle flow, and section reveal stagger are all replaced with simple opacity fades. This is a system-wide toggle point, not a per-component decision.

---

## 3. Page: Landing

**Purpose:** Establish trust and orient a first-time professional user before they reach the product.

### Layout Zones

```
┌───────────────────────────────────────────┐
│ Top Nav (marketing variant — no sidebar)   │
├───────────────────────────────────────────┤
│ HERO ZONE                                   │
│  - Product name + one-line positioning      │
│  - "AI assists. Humans decide." framing     │
│  - Primary CTA → Dashboard / Sign in         │
├───────────────────────────────────────────┤
│ TRUST ZONE                                  │
│  - Explainability-first framing              │
│  - Privacy-first framing                     │
│  - "Not a diagnostic tool" disclaimer        │
├───────────────────────────────────────────┤
│ WORKFLOW PREVIEW ZONE                       │
│  - Static visualization of the clinical      │
│    workflow (Conversation → AI → Report →    │
│    Professional → Decision)                  │
├───────────────────────────────────────────┤
│ Footer (docs, API, license, about)          │
└───────────────────────────────────────────┘
```

### Primary Interactions
- Single primary CTA (never more than one primary button per screen group, per components.md)
- Secondary link to API Documentation for the Developer persona

### States
- No loading/empty/error states apply (static content)

### Responsive Behavior
- Desktop: multi-column trust zone
- Mobile: all zones stack single-column; workflow preview becomes a vertical flow diagram instead of horizontal

---

## 4. Page: Dashboard (Hub)

**Purpose:** The "AI control center" — within seconds, tell the professional what's happening across their conversations right now.

This is distinct from the **Conversation Analysis workspace** (Section 6). The Dashboard is the *hub/overview*; Conversation Analysis is the *deep single-conversation workspace*. This distinction resolves the ambiguity in design.md by treating "Dashboard" as a summary/triage view and giving the detailed three-zone layout (from dashboard_spec.md) to the Conversation Analysis page instead, since that spec's content (Conversation Viewer, Pipeline, Reason Graph) only makes sense in the context of one open conversation.

### Layout Zones

```
┌──────────────────────────────────────────────────────┐
│ TOP ZONE                                                │
│  [Recent Activity Summary Card] [Pending Review Count]  │
│  [Overall Risk Distribution]                             │
├──────────────────────────────────────────────────────┤
│ MIDDLE ZONE — Conversation Queue                        │
│  Table/List: Conversation | Risk | Confidence | Time     │
│  Sortable, filterable by risk level                      │
│  Each row → click → Conversation Analysis page            │
├──────────────────────────────────────────────────────┤
│ BOTTOM ZONE — Quick Insights                              │
│  [Emotion Trend mini-chart] [Crisis Alerts this week]    │
└──────────────────────────────────────────────────────┘
```

### Components Placed
- Metric Card ×3–4 (Top Zone)
- Table (Data Display) — Conversation Queue
- Badge (risk level per row — text + icon + color, never color alone)
- Empty State component (if no conversations yet)
- Chart Container (mini trend charts, Bottom Zone)

### Primary Interactions
- Click a queue row → opens Conversation Analysis page for that conversation
- Filter/sort queue by risk level, date, review status
- Click "New Analysis" (persistent action, likely in Top Nav Quick Actions or a pinned button)

### States
- **Loading:** skeleton cards for Top Zone metrics, skeleton table rows for queue
- **Empty (new user, zero conversations):** replaces Middle Zone with Empty State — "No conversations analyzed yet" + Start New Analysis CTA
- **Error:** Top Zone metrics show individual error cards if that specific data failed to load, without blocking the rest of the dashboard

### Responsive Behavior
- Desktop: Top Zone as 3–4 column card row
- Tablet: Top Zone becomes 2-column
- Mobile: Top Zone stacks to single column; Queue table converts to a stacked card list (one card per conversation, per frontend_requirements.md's "Tables become cards" rule)

### Data Source
- Queue → aggregate of `/analyze` results (list endpoint not yet documented — flagged as a gap)

---

## 5. Page: New Analysis (Submit Conversation)

**Purpose:** Get a conversation into the system with minimal friction, and clearly show the professional privacy is respected before analysis begins.

### Layout Zones

```
┌──────────────────────────────────────────┐
│ SUBMISSION ZONE                            │
│  [Text input / paste area]                  │
│  or [File Upload]                            │
│  Privacy Status preview (static explainer)   │
│  [Primary Button: Analyze Conversation]       │
└──────────────────────────────────────────┘
```

### Primary Interactions
- Paste/type conversation text, or upload a file
- On submit → transitions into the AI Reasoning Workflow (Section 8) full-screen or inline progress state
- Cannot submit empty input (inline validation, disabled Primary Button until valid)

### States
- **Empty (default):** placeholder text guiding format expectations
- **Validating:** inline, before submission
- **Submitting → Loading:** transitions directly into Pipeline Progress pattern (Section 8), not a generic spinner
- **Error:** "Invalid input format" mapped from API error response, inline, non-blocking of resubmission

### Responsive Behavior
- Desktop: centered single-column form, generous whitespace either side
- Mobile: full-width input, sticky primary button pinned to bottom of viewport for reachability

---

## 6. Page: Conversation Analysis (Primary Clinical Workspace)

**Purpose:** This is the product's core screen — the one dashboard_spec.md describes in full detail. Answers all three questions (what/why/what next) for **one specific conversation**.

### 6.1 Layout Zones (Desktop — Three Zone Structure)

```
┌────────────────────────────────────────────────────────────┐
│ TOP ZONE (always visible, no scroll required)                  │
│  ┌───────────────┐ ┌───────────┐ ┌────────────┐ ┌──────────┐ │
│  │ Conversation  │ │ Overall   │ │ Confidence │ │ Detected │ │
│  │ Summary Card  │ │ Risk Card │ │ Meter      │ │ Signals  │ │
│  └───────────────┘ └───────────┘ └────────────┘ └──────────┘ │
│  [Recommendation Preview strip]                                │
├────────────────────────────────────────────────────────────┤
│ MIDDLE ZONE (reasoning process — scrollable)                   │
│  ┌───────────────────────────┐ ┌──────────────────────────┐  │
│  │ Conversation Viewer         │ │ AI Pipeline (collapsed/   │  │
│  │ (left, wider column)        │ │ expandable)                │  │
│  │                              │ ├──────────────────────────┤  │
│  │                              │ │ Emotion Timeline           │  │
│  │                              │ ├──────────────────────────┤  │
│  │                              │ │ Conversation Heatmap       │  │
│  │                              │ ├──────────────────────────┤  │
│  │                              │ │ Fusion Engine Card         │  │
│  │                              │ ├──────────────────────────┤  │
│  │                              │ │ Risk Timeline               │  │
│  └───────────────────────────┘ └──────────────────────────┘  │
├────────────────────────────────────────────────────────────┤
│ BOTTOM ZONE (decision support)                                 │
│  ┌───────────────────────────┐ ┌──────────────────────────┐  │
│  │ Explainability Report        │ │ Human Review Panel        │  │
│  │ (Reason Graph inside)        │ │ (Approve/Override/Notes)  │  │
│  └───────────────────────────┘ └──────────────────────────┘  │
│  [Clinical Summary] [Export Report]                             │
└────────────────────────────────────────────────────────────┘
```

This is the **hero layout of the whole product**. Per design.md's "hero component" rule, the Conversation Viewer is the hero of this specific page — everything else annotates it.

### 6.2 Top Zone — Detail

| Component | Content | Interaction |
|---|---|---|
| Conversation Summary Card | Participant count, message count, time span | Read-only |
| Overall Risk Card | Risk label + color + icon + trend arrow | Click → scrolls to Risk Timeline in Middle Zone |
| Confidence Meter | Numeric % + qualitative label ("High Confidence") | Hover → tooltip explaining what confidence means |
| Detected Signals | Compact tag/chip list of top signals | Click a signal chip → scrolls to Explainability, highlights that reason |
| Recommendation Preview | One-line strip: e.g. "Human Review Recommended" | Click → scrolls to Human Review Panel |

**Rule enforced here:** Risk is never shown as a bare word. Every instance of a risk label is paired with color + icon + confidence, per frontend_requirements.md's Risk Level Visualization rule.

### 6.3 Middle Zone — Detail

**Conversation Viewer** (left column, hero of this zone)
- Chronological message list, speaker-labeled, timestamped
- Inline markers: Emotion Marker + Distress Marker per message (small, non-intrusive icons)
- High-risk messages visually emphasized (not just colored — also an icon + optional left border treatment)
- Hover on a marked message → tooltip explanation ("Why was this flagged?")
- Search + Filter controls pinned above the list
- Long messages collapse by default with "Show more"
- Virtualized rendering for long conversations (performance rule)

**AI Pipeline** (right column, top card)
- Collapsed by default showing a compact horizontal progress trail of completed stages
- Expandable to the full sequential module view (Privacy Guard → Emotion → Distress → Crisis → Pattern → Context → Fusion → Decision → Explainability → Safe Response)
- Once analysis is complete, this becomes a static "reasoning trail," replayable on demand (a "Replay Analysis" ghost/text button)

**Emotion Timeline**
- X-axis: conversation time; Y-axis or layered lines: Sadness / Fear / Anger / Hope / etc.
- Hover a point → reveals the corresponding message inline (links back to Conversation Viewer, auto-scrolls and highlights it)
- Emphasizes **trend direction** (improving/stable/worsening) via a small trend badge, not just raw line

**Conversation Heatmap**
- Compact horizontal strip, one segment per message-group, color intensity = emotional intensity
- Click a segment → scrolls Conversation Viewer to that point

**Fusion Engine Card**
- Shows weighted contribution of each signal (Emotion / Distress / Crisis / Pattern) feeding into the Final Decision
- Static bar/segment visualization + percentage labels
- This card is the direct visual proof of the "multi-model, not single black box" claim — should never be omitted, even in compact view

**Risk Timeline**
- Horizontal timeline showing risk level changes across the conversation, not just the final number
- Distinct from Emotion Timeline — this one is about the *decision engine's* output over time, not raw emotion scores

### 6.4 Bottom Zone — Detail

**Explainability Report**
- Required sections, always in this order: Detected Signals → Reasoning (natural language) → Confidence → Recommendation
- Reasoning presented as short natural-language statements (per models_and_ai.md's example: "Increased hopelessness detected," "Negative emotional trend observed")
- Contains the **AI Reason Graph** as an expandable sub-section, not shown by default (progressive disclosure — this is the most "diagnosis-chain-looking" element and should require a deliberate expand action, reinforcing that it's supplementary reasoning, not a verdict)
- Reasons animate in one at a time (per design.md's Explainability Animation spec) on first reveal only, not on every re-render

**Human Review Panel**
- Explicit separation, visually distinct container from the AI's own output (per dashboard_spec.md: "AI Recommendation and Human Decision are never the same object")
- Actions: Approve / Reject / Override / Annotate / Escalate
- Notes field (free text, professional's own clinical notes)
- Review Status indicator (Pending / Reviewed / Escalated)
- **This panel's actions require the auth/user-management system to be functionally real** — until then, this is a UI-complete but non-persistent interaction (state resets on reload), and that limitation should be visible to the user, not hidden

**Clinical Summary**
- One-minute-readable card: Conversation Summary, Emotional Trend, Main Concerns, Detected Risks, Recommended Human Review, Time Saved estimate
- Export Report action (PDF/print-oriented) sits adjacent

### 6.5 States

| State | Behavior |
|---|---|
| Loading (analysis in progress) | Entire Middle/Bottom Zone replaced by the Pipeline Progress full pattern (Section 8); Top Zone shows skeleton cards |
| Partial failure | If e.g. Crisis Detection module fails but others succeed, that module's card shows an inline error state ("Crisis signal unavailable") while the rest of the report renders normally; overall confidence should visibly reflect the gap |
| Complete | Full three-zone layout as above |
| Error (full analysis failure) | Card-level error state in place of Top Zone risk card: "Analysis failed. Please try again." + Retry Analysis button; Conversation Viewer still renders the raw (privacy-filtered) conversation so the user isn't fully blocked |

### 6.6 Responsive Behavior

- **Desktop:** Three-zone layout as specified, Middle Zone as two side-by-side columns, Right Risk Panel optionally pinned/sticky while scrolling (per dashboard_spec.md's explicit instruction that the Risk Panel should remain pinned on desktop)
- **Tablet:** Two-zone effective layout — Middle Zone columns stack (Conversation Viewer full-width on top, analysis cards below it); Risk Panel no longer pinned
- **Mobile:** Full single-column stack in this order: Top Zone cards (as a horizontally scrollable card row, not stacked, to preserve at-a-glance scanning) → Conversation Viewer → AI Pipeline (collapsed) → Emotion Timeline → Heatmap → Fusion Card → Risk Timeline → Explainability → Human Review → Clinical Summary. Charts become horizontally scrollable rather than shrunk.

### 6.7 Data Source
- `risk_level` / `decision.final_level`, `confidence`, `detected_signals` → Top Zone (contract to be confirmed, see prior analysis §16.8)
- `emotion_history` → Emotion Timeline
- `xai.reasons` / explanation array → Explainability Report
- `fusion.summary` → Fusion Engine Card
- `messages` → Conversation Viewer

---

## 7. Page: Explainability (Standalone Deep-Dive)

**Purpose:** For cases where a professional wants a dedicated, distraction-free space to inspect *only* the reasoning — used after the Conversation Analysis page, not instead of it.

### Layout Zones

```
┌───────────────────────────────────────┐
│ Conversation context strip (collapsed,    │
│ link back to full conversation)            │
├───────────────────────────────────────┤
│ AI Reason Graph (hero, full width)         │
├───────────────────────────────────────┤
│ Reasoning list (expanded, all signals)     │
├───────────────────────────────────────┤
│ Confidence breakdown per signal             │
└───────────────────────────────────────┘
```

### Primary Interactions
- Reason Graph nodes are clickable → reveal the specific supporting message(s) in a side panel/drawer (without leaving the page)
- "Back to Conversation" persistent link

### States
- Same Loading/Empty/Error patterns as Section 2, scoped to this page's content only

### Responsive Behavior
- Desktop: Reason Graph rendered as a horizontal/branching node graph
- Mobile: Reason Graph re-flows into a **vertical stepped list** (graph relationships become numbered sequential cards) rather than attempting a shrunk graph — graphs do not compress well and should be redesigned for mobile, not scaled down

---

## 8. AI Reasoning Workflow (Cross-Cutting Pattern)

**Purpose:** This is the signature interaction of the product (per design.md's "Signature Motion" section) and is used identically in New Analysis submission and Conversation Analysis loading. Documented once here, referenced elsewhere.

### 8.1 Sequence

```
Conversation submitted
        ↓
[Privacy Guard]      — module lights up, brief pause, checkmark
        ↓
[Emotion Analysis]   — module lights up
        ↓
[Distress Detection] — module lights up
        ↓
[Crisis Detection]   — module lights up
        ↓
[Conversation Pattern Analysis] — module lights up
        ↓
[Context Fusion]     — module lights up, particles flow in from prior modules
        ↓
[Decision Engine]    — pulses once, settles
        ↓
[Explainability]     — module lights up
        ↓
[Safe Response / Report Ready] — final state, transitions to full report
```

### 8.2 Interaction Rules
- Each module activates sequentially, not simultaneously — communicates that reasoning is genuinely staged, not decorative
- User cannot skip ahead, but can see a compact label of "currently processing: [stage name]" for transparency
- If a stage fails, the sequence visually halts at that stage with an inline error marker on that specific module, rather than a generic full-page failure
- On completion, this pattern **does not disappear** — it collapses into the compact AI Pipeline card in the Conversation Analysis Middle Zone (Section 6.3), preserving the "how did we get here" trail permanently, not just during loading

### 8.3 Motion Rules Applied Here
- Module transition: 220–350ms, ease-out
- Fusion particle flow: only shown at Normal/Slow motion tier; skipped entirely under reduced-motion
- Never exceeds 600ms per transition (hard ceiling per design.md)

### 8.4 Responsive Behavior
- Desktop/Tablet: horizontal left-to-right pipeline trail
- Mobile: vertical top-to-bottom trail (matches the down-arrow diagram in the source docs directly)

---

## 9. Human Review Workflow (Cross-Cutting Pattern)

**Purpose:** Encode the non-negotiable rule that AI recommends, humans decide.

### 9.1 Flow

```
AI Decision generated
        ↓
Displayed as "AI Recommendation" (visually distinct container,
non-editable, clearly AI-attributed)
        ↓
Professional reviews Explainability + Conversation
        ↓
Professional selects one of:
   Approve  |  Override  |  Escalate  |  Request More Info (annotate)
        ↓
Professional may add Notes (free text, their own clinical language)
        ↓
Review Status updates: Pending → Reviewed (or → Escalated)
        ↓
Final Decision recorded as a SEPARATE object from AI Recommendation
(both remain visible; nothing is overwritten)
```

### 9.2 Interaction Rules
- The Human Review Panel is never pre-filled with a suggested action beyond the neutral "AI Recommendation" text — no button is pre-selected/defaulted, avoiding automation bias
- Override requires the professional to add a note explaining the override (lightweight friction, intentional — this is a clinical accountability point, not a UX inconvenience to remove)
- Escalate triggers a distinct visual state (e.g., a flagged/pinned indicator in the History and Dashboard queue) so escalated cases are trivially findable later

### 9.3 States
- **Pending:** default state after analysis completes, before any human action
- **Reviewed:** professional has taken an action; both AI Recommendation and Human Decision remain displayed side-by-side, not merged
- **Escalated:** additional visual weight (e.g., pinned position in queue), but never a flashing or alarming animation — per design.md's explicit prohibition on alarming effects even for critical items

---

## 10. Page: History

**Purpose:** Let a professional locate a previously analyzed conversation quickly.

### Layout Zones

```
┌─────────────────────────────────────┐
│ Filter/Search bar (risk, date, status) │
├─────────────────────────────────────┤
│ List/Table of past analyses            │
│  Conversation | Date | Risk | Review    │
│  Status | Confidence                     │
└─────────────────────────────────────┘
```

### Primary Interactions
- Click a row → Conversation Analysis page
- Filter by Review Status (Pending/Reviewed/Escalated) — directly supports triage workflows
- Sort by date or risk

### States
- Empty: "Your analysis history will appear here." + Start New Analysis
- Loading: skeleton table rows
- Error: inline banner + retry, table area shows cached/last-known state if available rather than going fully blank

### Responsive Behavior
- Desktop: table
- Mobile: card list (per the global "tables become cards" rule), each card showing Conversation label, Risk badge, Review Status badge, Date

---

## 11. Page: Reports

**Purpose:** Present and export the Clinical Summary as a standalone, shareable artifact.

### Layout Zones

```
┌─────────────────────────────────┐
│ Report selector / list (if multiple) │
├─────────────────────────────────┤
│ Clinical Summary Card (hero)          │
│  - Conversation Summary                │
│  - Emotional Trend                     │
│  - Main Concerns                       │
│  - Detected Risks                      │
│  - Recommended Human Review            │
│  - Time Saved                          │
├─────────────────────────────────┤
│ [Export] [Print] [Share] actions        │
└─────────────────────────────────┘
```

### Primary Interactions
- Export to PDF (or print-formatted view)
- Navigate back to the underlying full Conversation Analysis page from the report

### States
- Empty: "No reports yet — reports are generated after an analysis completes."
- Loading: skeleton summary card
- Error: retry pattern, standard

### Responsive Behavior
- Desktop: report content max-width constrained for readability (not full 1440px — reports read better narrower, similar to a document width)
- Mobile: full-width, single column, export actions become a sticky bottom bar

---

## 12. Page: Documentation / API

**Purpose:** Serve the Developer and AI Researcher personas without polluting the clinical workflow pages with technical language (per frontend_requirements.md's "Avoid Technical Language unless developer mode is explicitly opened" rule).

### Layout Zones

```
┌─────────────────────────────────┐
│ Sidebar sub-nav: Architecture | Pipeline |  │
│ Models | Privacy | API Reference | Release   │
│ Notes                                          │
├─────────────────────────────────┤
│ Content area (rendered docs)                   │
├─────────────────────────────────┤
│ (API Reference only) Live endpoint tester       │
│  - matches /docs and /redoc from api_docs.md    │
└─────────────────────────────────┘
```

### Primary Interactions
- Standard docs navigation
- API Reference section may embed or link to the FastAPI-generated `/docs` and `/redoc` interfaces directly rather than reimplementing them

### States
- Standard loading/error; this is largely static content so empty states don't apply

### Responsive Behavior
- Desktop: sub-nav as a left rail
- Mobile: sub-nav becomes a top dropdown/select

---

## 13. Page: Settings

**Purpose:** User preferences and (future) account/workspace configuration.

### Layout Zones

```
┌─────────────────────────────────┐
│ Settings sub-nav: Profile | Appearance | │
│ Notifications | Privacy | API Keys        │
│ (future)                                   │
├─────────────────────────────────┤
│ Content area — forms per section            │
└─────────────────────────────────┘
```

### Primary Interactions
- Theme switch (also mirrored in Top Nav)
- Notification preferences
- Privacy/data-handling preferences (aligns with privacy_and_safety.md's data minimization principles — e.g., a toggle for "avoid storing raw conversations")

### States
- Standard form states: default, validating, saving (inline spinner on the specific Save button, not full page), success toast, error inline

### Responsive Behavior
- Desktop: two-column (sub-nav + form)
- Mobile: sub-nav collapses to a stacked accordion above the form content

---

## 14. Page: 404 / Not Found

### Layout
- Centered message, calm tone (consistent with the product's non-alarming personality), single Primary Button: "Back to Dashboard"

---

## 15. Navigation Flow Diagram (End-to-End)

```
Landing
   │
   ▼
Dashboard ──────────────┬──────────────┬───────────────┐
   │                     │              │               │
   ▼                     ▼              ▼               ▼
New Analysis          History        Reports       Documentation/API
   │                     │              │
   ▼                     ▼              │
[AI Reasoning         Conversation      │
 Workflow]  ─────────► Analysis ◄───────┘
                        │
          ┌─────────────┼─────────────────┐
          ▼             ▼                 ▼
   Explainability   Human Review      Export → Reports
   (deep dive)       Workflow
```

Every path back to Dashboard is always available via the persistent Sidebar — no page is ever a dead end.

---

## 16. Component Placement Matrix

| Component | Landing | Dashboard | New Analysis | Conversation Analysis | Explainability | History | Reports | Settings |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Risk Gauge / Card | | ✓ (mini) | | ✓ (hero) | | ✓ (badge) | ✓ | |
| Confidence Meter | | | | ✓ | ✓ | | | |
| Conversation Viewer | | | | ✓ (hero) | (context strip) | | | |
| AI Pipeline | | | ✓ (full, during load) | ✓ (compact) | | | | |
| Emotion Timeline | | ✓ (mini trend) | | ✓ | | | ✓ (summary) | |
| Conversation Heatmap | | | | ✓ | | | | |
| Fusion Engine Card | | | | ✓ | | | | |
| Risk Timeline | | | | ✓ | | | | |
| Explainability Panel | | | | ✓ | ✓ (hero) | | ✓ (summary) | |
| AI Reason Graph | | | | (collapsed) | ✓ (hero) | | | |
| Human Review Panel | | | | ✓ | | | | |
| Clinical Summary Card | | | | ✓ | | | ✓ (hero) | |
| Table / Queue | | ✓ (hero) | | | | ✓ (hero) | | |
| Empty State | | ✓ | | | | ✓ | ✓ | |
| Command Palette | (global overlay, all pages) | | | | | | | |

---

## 17. Interaction Philosophy Recap (Applied)

- **No unexplained result anywhere in this spec.** Every risk/signal/score component listed above has an adjacent or linked explanation path — there is no screen in this document where a number appears without a route to "why."
- **AI Recommendation and Human Decision are structurally separate components on every screen they co-occur**, never merged into one object, per dashboard_spec.md.
- **Progressive disclosure is enforced structurally**, not just visually: AI Reason Graph is collapsed-by-default everywhere it appears; Technical/API content is fully separated into its own IA branch rather than interleaved into clinical pages.
- **Motion is only ever used where this document explicitly places it** (Pipeline sequence, Fusion particles, Explainability reveal, section/card entrance) — no other component in this spec has assigned motion, intentionally, to prevent motion creep during implementation.

---

## 18. Open Items Carried Forward From Prior Analysis

These remain unresolved and should be confirmed before Phase 2 (visual UI):

1. Authoritative API field-naming contract (`risk_level` vs `decision.final_level` style).
2. Whether a conversations *list* endpoint exists to power Dashboard Queue and History — not present in current api_documentation.md.
3. Whether Human Review actions persist anywhere without an auth system, or should be explicitly labeled as session-only for now.
4. Whether "Context Memory" is a distinct visual component or folded into "Context Fusion Engine" — this spec has treated them as one combined pipeline stage/card, pending clarification.

---

**End of Phase 1 UX Wireframe Specification. No visual UI, styling, or code has been generated. Awaiting approval before Phase 2.**
