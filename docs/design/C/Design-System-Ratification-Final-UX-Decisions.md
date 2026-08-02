# Design System Ratification & Final UX Decisions
## Mental Health Safety Analyzer — Pre-Implementation Freeze Document

**Document type:** Final consolidation and ratification handoff
**Status:** Governs all frontend implementation going forward
**Reviewed against:** ProjectVision.md, design.md, components.md, frontend_architecture.md, frontend_requirements.md, UX-Wireframe-Specification.md, landing_spec.md, dashboard_spec.md, history_spec.md, reports_spec.md, settings_spec.md, new-analysis_spec.md, documentation-api_spec.md, about_spec.md

This document does not redesign, add, or remove any screen. It reads every prior specification line by line, resolves what can be safely resolved, and leaves explicitly open what cannot. Once approved, this document — together with the eight screen specifications and frontend_architecture.md — is the complete, frozen basis for implementation.

---

# Executive Summary

Eight screen specifications were produced across Phase 1–3, all built on a single locked design system (8pt spacing scale, Inter typography, Blue/Purple/Cyan/Green/Amber/Red color system, 120/220/350/600ms motion scale). The system held together with a high degree of internal consistency — most reuse across documents was explicit and correctly cited.

This review found:

- **29 explicit `[ASSUMPTION]` markers** across the specifications, concentrated heavily in Documentation/API and New Analysis, where the source documentation genuinely runs out.
- **1 real cross-document breakpoint contradiction** (table-to-card conversion threshold) that must be resolved before implementation, not left ambiguous.
- **1 minor token-drift issue** (Card radius stated as a range in two documents vs. a fixed value in design.md).
- **2 components used repeatedly that were never formally added to the component taxonomy** (Segmented Control, Bottom Sheet) — both should be ratified now rather than remain implicit.
- **1 fully undefined component family** (Code Block, monospace type role, syntax highlighting) required only by Documentation/API but likely to recur.
- **7 backend-dependent open questions**, all already correctly identified in `frontend_architecture.md` Section 18, none newly introduced here.
- **1 stray duplicate file** found in the working output set (`new_analysis_spec.md`, an earlier draft superseded by `new-analysis_spec.md`) — removed during this review; not a specification-level issue, noted for file hygiene only.

No specification contradicts the product's core philosophy (explainability-first, human-supervised, privacy-first, calm/minimal/trustworthy). The system is ready to freeze once the items in **Decisions Still Required** are resolved.

---

# Final Design Decisions

The following were ambiguous, inconsistently stated, or left as reasonable defaults across the specifications. They are hereby **finalized** as system-wide rules, superseding any inconsistent phrasing in individual documents.

| # | Decision | Resolves | Final Rule |
|---|---|---|---|
| FD-1 | Card radius | Range phrasing in history_spec.md, new-analysis_spec.md ("16–20px") vs. fixed value in design.md ("20px") | **Card radius is fixed at 20px**, matching design.md's original token exactly. The "16–20px" phrasing in History's Conversation Preview Cards and New Analysis's dropzone is a documentation drift, not an intentional variant, and should be corrected to 20px in both places. |
| FD-2 | Table-to-card breakpoint | frontend_architecture.md Section 3.5 says tables convert "below tablet width"; dashboard_spec.md and history_spec.md both implement the switch at **<1024px** (i.e., at the Tablet tier itself, not only below it) | **<1024px is the final, correct threshold** — Tables render on Desktop and Laptop (≥1024px); Card lists render on Tablet and Mobile (<1024px). This matches what was actually built into Dashboard and History. frontend_architecture.md Section 3.5's phrasing should be tightened to say "below 1024px (Tablet and Mobile tiers)" to remove the ambiguity. |
| FD-3 | Toast auto-dismiss duration | Referenced in frontend_architecture.md, dashboard_spec.md, settings_spec.md as "transient, auto-dismissing" with no numeric value anywhere | **4000ms (4 seconds)** is adopted as the standard Toast auto-dismiss duration, with a manual dismiss ("×") always available for a professional who wants to close it early. This is a new, small, uncontroversial value — not a redesign — needed because "transient" alone is not implementable. |
| FD-4 | Escalated-case pinning — single source of truth | Identical rule independently restated in dashboard_spec.md Section 8 and history_spec.md Section 3 | The rule ("Escalated conversations pin to the top of any risk/status-sortable list, regardless of active sort, with a flagged indicator icon") is **promoted to a formal frontend_architecture.md rule** (new Section 14 entry or equivalent), and both page specs should cite it rather than restate it, preventing future drift if the rule ever changes. |
| FD-5 | Sidebar icon-rail flyout delay vs. Tooltip timing | dashboard_spec.md Section 4 specifies a 150ms hover delay for the Sidebar's collapsed-rail flyout labels; design.md separately states Tooltips "should appear instantly without delay" | These are **two distinct patterns, not a contradiction** — the Sidebar flyout is navigation-affordance behavior, not a Tooltip instance. Final rule: standard Tooltips (chart hovers, field explanations, badge details) remain instant per design.md; the Sidebar icon-rail flyout keeps its 150ms delay as a documented, narrow exception specific to that one navigation pattern. This distinction should be stated explicitly in frontend_architecture.md to prevent a future engineer from "fixing" the Sidebar delay to match Tooltip behavior. |
| FD-6 | "Inline Alert" as standard terminology | components.md defines only "Alert" generically; five of eight specs use "Inline Alert" for the same contextual, embedded pattern; three specs don't use the term at all despite similar content | **"Inline Alert" is adopted as the formal name** for the contextual, component-scoped variant of Alert (as distinct from the page-scoped Banner and the Shell-scoped Critical Alert Banner). components.md's Feedback category should be updated to list Toast / Banner / Inline Alert / Critical Alert as the four notification tiers explicitly, matching frontend_architecture.md Section 11's hierarchy. |

---

# Accepted Assumptions

These `[ASSUMPTION]`-marked items are **reasonable, internally consistent with the rest of the system, and are hereby converted into Final Product Decisions.** No further product input is required before implementing them.

| Source | Assumption | Final Decision |
|---|---|---|
| new-analysis_spec.md §7 | Accepted file types: `.txt`, `.csv`, `.json` | **Accepted.** Consistent with pipeline.md's text-based input model; no rich-document or image support implied anywhere in the source documentation. |
| new-analysis_spec.md §4 | Textarea max-height 640px desktop, auto-grow with internal scroll beyond that | **Accepted.** Reasonable UX default; does not conflict with any documented value. |
| new-analysis_spec.md §16 | Textarea min-height 200px on mobile | **Accepted.** Consistent with the general "don't let one input surface consume the entire mobile viewport" reasoning already applied elsewhere. |
| new-analysis_spec.md §8 | Short-conversation caution threshold (~20 characters), non-blocking | **Accepted.** Explicitly designed as guidance, not a hard validation rule, consistent with the product's "never presume to know the professional's use case" principle. |
| new-analysis_spec.md §11 | Container widens from 720px to full 1440px width at the exact moment submission begins, 250ms ease-out | **Accepted.** A direct, reasonable extrapolation of the already-locked "layouts reflow, not shrink" principle — not a new interaction pattern. |
| new-analysis_spec.md §20 | No draft/auto-save persistence across sessions | **Accepted, with a note.** Reasonable given no documented persistence layer exists yet, but this should be revisited once the backend has real session/draft storage — see Future Roadmap. |
| documentation-api_spec.md §4 | Documentation Landing View: three audience cards (Professionals / Developers / API Reference) as the default state before any sub-nav item is selected | **Accepted.** Directly reuses the Landing Page's Trust Zone Card pattern; no new visual language introduced. |
| documentation-api_spec.md §5 | "Open API Docs" opens FastAPI's `/docs` in a **new tab**, not an inline iframe embed | **Accepted.** Correctly avoids contaminating the product's design system with Swagger UI's own styling, per the architecture's explicit instruction to link rather than reimplement. |
| documentation-api_spec.md §10 | Command Palette search results extended to include documentation/API entries | **Accepted.** A minimal, low-risk extension of the existing single-search-implementation principle; does not introduce a second search surface. |
| documentation-api_spec.md §11 | Copy-to-clipboard: icon-only confirmation (1.5s crossfade to checkmark), no Toast | **Accepted.** Correctly proportional feedback weight for a high-frequency, low-consequence action; consistent with the system's proportional-friction principle applied to feedback rather than confirmation. |
| about_spec.md §4–9 | Six-section fixed content order (Mission → Philosophy → Principles → Disclaimer → Author → Version/License) | **Accepted.** Follows ProjectVision.md's own internal document ordering rather than inventing a new narrative structure. |
| about_spec.md §8 | Initials-based Avatar for author attribution (no photo specified anywhere) | **Accepted.** Conservative default, reuses the existing Avatar component as already used in the User Menu. |

---

# Decisions Still Required

These items **cannot be safely finalized** by extrapolation alone — they require an explicit product or backend decision before the affected feature can ship. Each is left exactly as "Decision Required," per instruction, not resolved here.

| # | Item | Source | Why it can't be auto-resolved |
|---|---|---|---|
| DR-1 | Maximum file size for conversation upload | new-analysis_spec.md §7 (flagged 10 MB) | This is a backend/infrastructure constraint, not a design decision — the design can accommodate any reasonable limit, but the actual number must come from the API contract, not be assumed by the frontend spec. |
| DR-2 | Maximum character/message count for pasted conversation text | new-analysis_spec.md §4 | Same reasoning as DR-1 — whether a hard limit exists at all is unknown; if one exists, the frontend needs the real number to implement validation correctly. |
| DR-3 | Authoritative API response contract | frontend_architecture.md Open Question 18.3; referenced in documentation-api_spec.md §8 | Two incompatible field-naming conventions exist in the source documentation (`risk_level`/`confidence`/`detected_signals` flat shape vs. `decision.final_level`/`xai.reasons`/`fusion.summary` nested shape). This blocks finalizing the service-layer type contracts for Dashboard, History, and the Analysis Workspace — it is a backend decision, not a frontend one. |
| DR-4 | Whether a conversations *list* endpoint exists | frontend_architecture.md Open Question 18.6 | Dashboard's Queue and History's Conversation List are both designed against an assumed list-endpoint shape. If no such endpoint exists yet, both pages need a confirmed contract before their data layer can be built, though their visual design is unaffected. |
| DR-5 | Whether Human Review actions (Approve/Override/Escalate/Notes) persist anywhere | frontend_architecture.md Open Question 18.2 | Currently specified as UI-complete but state-non-persistent (resets on reload) across dashboard_spec.md, settings_spec.md, and reports_spec.md's Share action. This is explicitly flagged everywhere it appears, but the underlying question — is any persistence layer coming, and when — remains open. |
| DR-6 | Re-analysis / conversation versioning model | frontend_architecture.md Open Question 18.7; referenced in reports_spec.md §4 | Whether resubmitting a conversation creates a new record or versions an existing one affects the Report Selector's very existence and History's data model. No default can be safely assumed here since it changes what "a conversation" even means as a data entity. |
| DR-7 | Explainability deep-dive: in-page expansion vs. dedicated sub-route | frontend_architecture.md Open Question 18.4; dashboard_spec.md §11 currently assumes in-page | Affects whether Explainability needs its own bookmarkable URL. Current default (in-page) is functional and shippable as-is, but should be confirmed as intentional rather than merely the default nobody objected to. |
| DR-8 | "Context Memory" vs. "Context Fusion Engine" — one pipeline stage or two | frontend_architecture.md Open Question 18.5 | architecture.md and models_and_ai.md diverge on this in the original source documentation. Currently treated as one combined stage/tab (Fusion Engine) throughout dashboard_spec.md. This is a backend/AI-architecture question the frontend cannot resolve on its own. |
| DR-9 | Exact HTTP-method badge treatment ratification | documentation-api_spec.md §6 | The neutral/text-only resolution (avoiding risk-color collision) is a sound recommendation, but since it touches the shared Badge component, it should be explicitly ratified as a components.md change, not left standing on one page spec's authority alone. |

---

# Design System Additions

The following are **not new UI concepts** — they are patterns already used consistently across multiple specifications that were never formally added to `design.md` or `components.md`. They should be ratified into the core design system now, since implementation will need them defined once, centrally, not re-derived per screen.

## DSA-1 — Segmented Control
**Used in:** settings_spec.md (Theme: Light/Dark/System), new-analysis_spec.md (Paste Text/Upload File toggle)
**Definition needed:** A horizontal, mutually-exclusive control for 2–3 always-visible options, visually a Button-group variant (not a Select dropdown). Behaves as a radio-group for keyboard purposes (Arrow Left/Right to move, selection immediate). Uses standard Button sizing/radius tokens, no new colors.
**Recommendation:** Add to components.md's Inputs category formally, citing both existing usages as reference implementations — do not let a third page invent a slightly different version.

## DSA-2 — Bottom Sheet
**Used in:** history_spec.md (mobile Filters panel)
**Definition needed:** A mobile-only overlay pattern, slides up from the bottom of the viewport (280ms ease-out entrance / ease-in exit), used specifically when a control set is too large for a dropdown at mobile width but doesn't warrant a full page navigation. Requires an explicit "Apply" action rather than instant-apply, since it typically batches multiple field changes.
**Recommendation:** Add to components.md's Feedback or Navigation category (Overlay family) — currently it exists only as a one-off description inside History's responsive behavior section.

## DSA-3 — Toast Auto-Dismiss Duration
**Used implicitly everywhere Toast appears** (Settings saves, Reports export confirmation, Documentation copy actions reference it by contrast)
**Definition needed:** 4000ms, per Final Design Decision FD-3 above.
**Recommendation:** Add as a named duration constant in the motion/timing token set, since "4 seconds" is a content-timing value, not strictly a motion-easing value, and deserves its own documented home.

## DSA-4 — "Inline Alert" Formal Naming
Per Final Design Decision FD-6 — formalize the four-tier notification naming (Toast / Banner / Inline Alert / Critical Alert) in components.md's Feedback category, replacing the single generic "Alert" entry.

---

# Component Library Additions

These are the components genuinely **missing** from the current library that implementation will need. Unlike Design System Additions above (patterns already in use, just undocumented), these are gaps that were filled with explicitly-flagged best-effort resolutions and require real design attention before being trusted as final.

## CLA-1 — Code Block *(highest priority gap)*
**Required by:** documentation-api_spec.md (Request/Response Examples, SDK example, Endpoint Detail views)
**Current state:** No Code Block component, monospace type role, or syntax-highlighting palette exists anywhere in components.md or design.md. documentation-api_spec.md §12 provides the most conservative possible placeholder resolution (system-monospace fallback stack, single neutral foreground color, no syntax highlighting, Card-based container using the "next-darker surface" elevation step already used for the Human Review Panel).
**Why it can't just stay a one-page assumption:** any future technical/developer-facing content (webhooks documentation, SDK examples, error code references) will need this same component. Defining it once, centrally, prevents three slightly-different "temporary" Code Block implementations from accumulating.
**Recommendation:** Formal design pass to ratify: (a) the monospace font-stack addition, (b) whether syntax highlighting is truly out of scope for v1 or should get a minimal, carefully-chosen token set later, (c) the copy-to-clipboard interaction as a permanent Code Block sub-component, not a documentation-page-specific addition.

## CLA-2 — Definition List / Key-Value Pair Display
**Required by:** documentation-api_spec.md §6 (Response Fields listing)
**Current state:** Not in the components.md taxonomy at all; the spec explicitly chose *not* to use the Table component for this ("a short, fixed-length list better suited to a lighter-weight layout"), implying a real gap rather than a misuse of an existing component.
**Recommendation:** Low-priority relative to Code Block, but worth a one-line addition to components.md's Data Display category, since Settings' Session rows and other key-value-style content elsewhere in the product could also benefit from a named, reusable pattern instead of ad hoc Card layouts.

## CLA-3 — HTTP Method Badge Variant
Per Decision Required DR-9 — the neutral/text-based resolution should be formally added as a documented Badge usage pattern once ratified, not left as page-level reasoning.

---

# Backend Dependencies

Every item below is a **frontend-blocking dependency on backend/API work**, not a design gap. All were already correctly identified across the specifications (mostly inherited from frontend_architecture.md Section 18) — this section exists to consolidate them into one list for engineering planning, not to introduce new ones.

| Dependency | Blocks | Source |
|---|---|---|
| Authoritative API response contract (flat vs. nested field names) | Dashboard, Analysis Workspace, History service-layer typing | DR-3 |
| Conversations list endpoint | Dashboard Queue, History Conversation List | DR-4 |
| Human Review / Notes persistence layer | Human Review Panel, Reports' Human Notes Section, Settings' auth-adjacent sections | DR-5 |
| Authentication / multi-user system | Settings (Security, Sessions, Account), Reports' Share action, Sidebar's clinic-settings future path | frontend_architecture.md Open Question 18.2 |
| Re-analysis / versioning data model | Reports' Report Selector, History's record identity | DR-6 |
| Max file size / max input length for `/analyze` | New Analysis validation rules | DR-1, DR-2 |
| Longitudinal/multi-session data API | Future Session Evolution tab (not yet built, structurally reserved) | frontend_architecture.md Open Question 18.1 |
| Context Memory vs. Fusion Engine architecture clarification | Analysis Workspace's Fusion tab framing | DR-8 |

---

# Cross-Document Consistency Review

Full pass results, organized by category as instructed.

**Spacing:** Consistent. All eight specs draw exclusively from the 8pt scale (4/8/12/16/24/32/40/48/64/80/96/128); no arbitrary values found anywhere in a targeted search.

**Typography:** Consistent. Inter used throughout with identical fallback stack; heading roles (H1/H2/Body-large/Body/Caption) applied identically across all documents. One addition required: the monospace fallback stack for Code Blocks (CLA-1) is new territory, not an inconsistency.

**Layout behavior:** Consistent, with one resolved exception — the table-to-card breakpoint ambiguity (FD-2), now finalized at <1024px.

**Responsive behavior:** Consistent. All specs correctly follow the four-tier system (Desktop ≥1280 / Laptop 1024–1279 / Tablet 768–1023 / Mobile ≤767) with no deviations found.

**Navigation:** Consistent. Sidebar's fixed seven-item set, Breadcrumb usage, and Command Palette behavior are uniformly applied; the one extension (documentation search results in the Palette) is explicitly flagged as an assumption (Accepted, per above) rather than silently added.

**Interaction patterns:** Consistent. Confirmation-dialog usage correctly follows the proportional-friction principle everywhere it appears (Override/Escalate, two Privacy toggles, Sign-out-all-sessions, Delete Account) — no page introduces an unnecessary confirmation or skips a necessary one.

**Loading states:** Consistent. Skeleton-first philosophy applied uniformly; the AI Pipeline Progress pattern is correctly never substituted with a generic spinner anywhere it's referenced.

**Empty states:** Consistent. The muted-line-icon, one-sentence, single-action pattern is applied identically in Dashboard, History, Reports, and Documentation. About and Landing correctly opt out entirely (no data dependency), and this is explicitly justified in both rather than silently omitted.

**Error states:** Consistent. The governing rule ("an error never removes access to data already rendered") is restated and correctly applied in every single specification without exception.

**Accessibility rules:** Consistent, with correct extensions. WCAG AA, 44px touch targets, and focus-trap/return-focus behavior are applied uniformly. Each new interactive pattern (Segmented Control, Bottom Sheet, Code Block copy button) correctly extends existing accessibility patterns rather than inventing new ones.

**Confirmation dialogs:** Consistent. See Interaction patterns above.

**Save/apply behaviors:** Consistent within Settings' own explicit two-mode system (instant-apply vs. Save-gated, settings_spec.md §22) and correctly not introduced elsewhere as a competing pattern.

**Motion:** Consistent, with the single exception of Card hover-lift value now confirmed identical everywhere it's used (4px lift, 180ms, ease-out) — see Final Design Decisions table for the radius-phrasing note, which is spacing/radius, not motion.

**Terminology:** One resolved issue (FD-6, "Inline Alert"). Otherwise consistent — "Risk Level," "Confidence," "Detected Signals," "Human Review," and "Clinical Summary" are used identically, word-for-word, across every document that references them.

---

# Future Roadmap

Carried forward from frontend_architecture.md Section 16 and the individual specs' own "coming soon" markers — not new items introduced by this review, consolidated here for visibility.

- **Session Evolution / longitudinal multi-conversation tracking** — structurally reserved as an eighth tab slot in the Analysis Workspace, unbuilt pending backend support (Open Question 18.1).
- **Multi-user / clinic-level accounts** — affects Settings' clinic-settings section, Human Review persistence, and Audit Trail usefulness (Open Question 18.2).
- **Two-Factor Authentication** — shown disabled with an honest "coming soon" note in Settings; ships once multi-user auth exists.
- **SDKs / client libraries** — documented as not-yet-available in Documentation/API; no timeline implied.
- **Re-analysis / conversation versioning** — affects Reports' Report Selector and History's data model (DR-6).
- **Report sharing with real access control** — currently a UI placeholder in Reports pending the authentication system.
- **Draft/auto-save persistence for New Analysis** — not currently planned but flagged as worth revisiting once session storage exists.
- **Code Block syntax highlighting** — deliberately deferred past v1 (CLA-1); current state is plain monospace text only.
- **Data-retention configurability granularity** — Settings' Privacy section currently offers four fixed retention presets (30/90/365 days/Indefinite); finer control was not requested anywhere and is not assumed.

---

# Final Implementation Checklist

Before frontend implementation begins, the following must be true:

- [ ] Final Design Decisions (FD-1 through FD-6) applied as corrections to the affected source specifications (history_spec.md, new-analysis_spec.md radius phrasing; frontend_architecture.md breakpoint phrasing and escalated-pinning rule promotion).
- [ ] Design System Additions (DSA-1 through DSA-4) formally added to components.md / design.md, not left standing on individual page specs.
- [ ] Component Library Additions (CLA-1 through CLA-3) given a dedicated design pass — Code Block (CLA-1) in particular should not be implemented from documentation-api_spec.md's placeholder resolution alone without sign-off.
- [ ] Decisions Still Required (DR-1 through DR-9) resolved or explicitly re-flagged as still-open per feature before that specific feature ships — none block continued design work, all block production release of the features they touch (per frontend_architecture.md Section 19's own governing rule, reapplied here).
- [ ] Backend Dependencies table reviewed with backend/API engineering and each item assigned an owner and rough timeline.
- [ ] Stray duplicate file (`new_analysis_spec.md`, superseded draft) confirmed removed from the working file set — done during this review.
- [ ] This document, once approved, is treated as authoritative over any individual page spec where a conflict exists — page specs are not to be silently re-edited afterward without a corresponding update here.

---

**End of Design System Ratification & Final UX Decisions.**
This document, together with `frontend_architecture.md` and the eight approved screen specifications, constitutes the complete, frozen design foundation for the Mental Health Safety Analyzer frontend. No further design consolidation is required before implementation begins, pending resolution of the items listed under Decisions Still Required and Backend Dependencies.
