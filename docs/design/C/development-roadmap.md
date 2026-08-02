# Development Roadmap
## Mental Health Safety Analyzer — Complete Implementation Blueprint

**Document type:** Production implementation plan
**Status:** Ready for engineering planning
**Source of truth:** ProjectVision.md, design.md, components.md, frontend_architecture.md, frontend_requirements.md, pipeline.md, architecture.md, models_and_ai.md, privacy_and_safety.md, api_documentation.md, dashboard_spec.md, history_spec.md, reports_spec.md, settings_spec.md, new-analysis_spec.md, documentation-api_spec.md, about_spec.md, Design-System-Ratification-Final-UX-Decisions.md, testing_and_evaluation.md, release_notes.md, future_improvements.md

> **Note on source gaps:** No `backend_architecture.md` file exists in the provided project set. Backend structural details in this roadmap are derived from `architecture.md`, `pipeline.md`, `models_and_ai.md`, and `api_documentation.md` instead — these are treated as the backend source of truth. Every place this roadmap must infer an implementation order not explicitly stated in source documents is marked `[ASSUMPTION]`, consistent with the practice already established across the design specification set. No feature, endpoint, or component is introduced that isn't already present in the source documentation.

This document does not redesign, add, or remove any screen, component, endpoint, or architectural decision. It sequences existing, already-ratified work into an implementable plan.

---

# 1. Executive Summary

## Implementation Philosophy

The product's own core philosophy — *AI assists, humans decide; explainability before complexity; privacy by design; human supervision before automation* — governs not just the product but the build order itself. Nothing is built that produces an unexplained result, an unreviewable decision, or an unprotected conversation, even in early increments. This means privacy filtering and explainability scaffolding are treated as **foundational infrastructure**, not late-stage polish, and the AI Pipeline is built as a real multi-stage system from the start rather than a single opaque call that gets "explainability bolted on" later.

## Implementation Strategy

Build **vertically through the pipeline first, horizontally through the UI second.** The single highest-risk, highest-value piece of this system is the multi-stage AI Pipeline (Privacy Guard → Emotion → Distress → Crisis → Pattern → Fusion → Decision → Explainability), because every other part of the product — Dashboard, Analysis Workspace, Reports, History — exists to display or act on its output. Standing up a thin, real, end-to-end pipeline early (even with simple per-stage models) de-risks the rest of the project far more than perfecting any single screen early would.

## Development Approach

Backend-led, contract-first, screen-by-screen frontend delivery against a stable API. The Design System Ratification document already flags two backend-blocking contract ambiguities (flat vs. nested response shape; whether a conversations-list endpoint exists) — these are resolved as the **first engineering decisions of the project**, before any frontend service-layer code is written against them, to avoid the exact rework the ratification document warns about.

## Why This Implementation Order Was Selected

1. The product cannot be demonstrated, tested, or reviewed meaningfully until a real conversation can flow through a real (if simple) pipeline and produce a real (if incomplete) risk decision — so Foundation → Backend Core → Minimal Pipeline comes before any polished UI.
2. Every frontend page specification explicitly depends on API response shapes (`risk_level`, `confidence`, `detected_signals`, `emotion_history`, `xai.reasons`, `fusion.summary`, `messages`) — building frontend before these are locked guarantees rework.
3. The UI specifications themselves declare a dependency order: Shell → Dashboard → New Analysis → Analysis Workspace → History → Reports → Settings → Documentation → About. This is not arbitrary — Analysis Workspace is the hero screen every other collection page (Dashboard Queue, History) links into, so it must exist before those pages are meaningfully testable end-to-end.
4. Human Review, Reports, and Explainability all sit *downstream* of a working Decision Engine output — they cannot be correctly built against mocked data without risking exactly the kind of contract drift the Ratification document already found once (FD-1 through FD-6).

---

# 2. Project Phases

1. **Phase 0 — Foundation** (repo, environments, CI/CD, design tokens, coding standards)
2. **Phase 1 — Core Infrastructure** (database, auth scaffold, service layer skeleton, base API shell)
3. **Phase 2 — Backend: Privacy & Preprocessing** (Privacy Guard, Text Preprocessing)
4. **Phase 3 — Backend: AI Pipeline Core** (Emotion, Distress, Crisis, Pattern Analysis modules)
5. **Phase 4 — Backend: Fusion, Decision & Explainability** (Context Fusion Engine, Risk Decision Engine, XAI Report Generator)
6. **Phase 5 — Backend: API Surface** (`/health`, `/analyze`, error handling, docs interfaces)
7. **Phase 6 — Frontend: Shell & Design System** (App Shell, navigation, component library wiring)
8. **Phase 7 — Frontend: Core Clinical Workflow** (New Analysis → AI Pipeline Progress → Analysis Workspace)
9. **Phase 8 — Frontend: Collection Views** (Dashboard Home, History)
10. **Phase 9 — Human Review System** (Human Review Panel, Approve/Override/Escalate, Notes)
11. **Phase 10 — Reports** (Clinical Summary Card, Reports List/Detail, Export/Print/PDF)
12. **Phase 11 — Settings** (all eight sections)
13. **Phase 12 — Documentation/API & About** (static/reference content surfaces)
14. **Phase 13 — QA & Hardening** (full testing matrix, accessibility, performance, security)
15. **Phase 14 — Production Release** (staged rollout, monitoring, rollback readiness)

---

# 3. Milestones

## Phase 0 — Foundation
- **Objectives:** Establish repo structure, environments, CI/CD, and the locked design-token set (8pt spacing, Inter typography, color system, motion scale) as enforceable, shared constants.
- **Deliverables:** Working CI pipeline (per README's documented GitHub Actions: automated testing, code quality via Ruff/Black/isort); frontend design-token package; backend project skeleton (FastAPI, per api_documentation.md).
- **Dependencies:** None.
- **Exit Criteria:** A commit can be pushed, tested, linted, and deployed to a dev environment automatically.

## Phase 1 — Core Infrastructure
- **Objectives:** Stand up the database, base service-layer architecture (services/ per frontend_requirements.md), and confirm the two backend-blocking contract decisions (DR-3, DR-4 from the Ratification document).
- **Deliverables:** Initial schema (Section 8), API service-layer skeleton, a single ratified response-shape contract used everywhere downstream.
- **Dependencies:** Phase 0 complete.
- **Exit Criteria:** DR-3 (flat vs. nested response contract) and DR-4 (conversations-list endpoint) are formally resolved and documented — this is a **hard gate**, since every subsequent phase's typed contracts depend on it.

## Phase 2 — Backend: Privacy & Preprocessing
- **Objectives:** Implement the Privacy Guard Layer and Text Preprocessing Layer exactly as specified in architecture.md and privacy_and_safety.md.
- **Deliverables:** PII detection/anonymization (names, phone numbers, emails, addresses, IDs), text normalization/tokenization stage.
- **Dependencies:** Phase 1 (database for anonymized-storage decisions).
- **Exit Criteria:** A raw conversation input can be anonymized and normalized reliably, verified against privacy_and_safety.md's documented before/after example.

## Phase 3 — Backend: AI Pipeline Core
- **Objectives:** Implement Emotion Analysis, Distress Detection, Crisis Detection, and Conversation Pattern Analysis modules per models_and_ai.md and pipeline.md.
- **Deliverables:** Four independently testable analysis modules, each producing its documented output shape (e.g., emotion score set, distress level, crisis indicators, pattern trend).
- **Dependencies:** Phase 2 (modules consume preprocessed, privacy-filtered text only).
- **Exit Criteria:** Each of the four modules independently returns a structured, documented output for a sample conversation; unit tests pass per module.

## Phase 4 — Backend: Fusion, Decision & Explainability
- **Objectives:** Implement the Context Fusion Engine, Risk Decision Engine, and Explainable AI Report Generator.
- **Deliverables:** Weighted fusion of the four Phase 3 signals into a final risk level (Safe/Mild/Moderate/High/Critical per api_documentation.md); natural-language explanation generation; confidence score output.
- **Dependencies:** Phase 3 (fusion requires all four upstream signals).
- **Exit Criteria:** A full pipeline run, given raw conversation input, produces a final risk level + confidence + natural-language reasons, matching models_and_ai.md's documented output examples.

## Phase 5 — Backend: API Surface
- **Objectives:** Expose `/health` and `/analyze` per api_documentation.md; implement structured error handling; expose `/docs` and `/redoc`.
- **Deliverables:** Working REST API matching the ratified response contract (Phase 1 gate); documented error responses for missing/invalid input.
- **Dependencies:** Phase 4 (API wraps a working pipeline, not a stub).
- **Exit Criteria:** `/analyze` returns a complete, correctly-shaped response for a real conversation end-to-end; `/health` returns healthy status; automated API tests pass (12/12 baseline per README, extended per Section 10 below).

## Phase 6 — Frontend: Shell & Design System
- **Objectives:** Build the App Shell (Top Navigation, Sidebar, Critical Alert Banner, Main Content Area) exactly per frontend_architecture.md Section 2, wired to the locked component library (components.md).
- **Deliverables:** Persistent Shell across all breakpoints; Command Palette; theme switching (Light/Dark/System); reduced-motion global handling.
- **Dependencies:** Phase 0 (design tokens); does not require backend completion, but benefits from Phase 5's real endpoints for Notifications/Critical Alert Banner wiring.
- **Exit Criteria:** Shell renders correctly at all four breakpoints (Desktop/Laptop/Tablet/Mobile) with working navigation, matching dashboard_spec.md Sections 3–6.

## Phase 7 — Frontend: Core Clinical Workflow
- **Objectives:** Build New Analysis (submission), the AI Pipeline Progress pattern (Full state), and the Conversation Analysis Workspace (Top/Middle/Bottom zoning per frontend_architecture.md Section 4.6).
- **Deliverables:** Working submission → real-time pipeline visualization → full Analysis Workspace (Risk Card, Conversation Viewer, Fusion/Risk/Emotion/Heatmap/Pipeline tab group, Explainability, Human Review Panel stub, Clinical Summary stub).
- **Dependencies:** Phase 5 (real `/analyze` endpoint), Phase 6 (Shell).
- **Exit Criteria:** A professional can paste or upload a real conversation and see a complete, explainable, correctly-zoned Analysis Workspace result — this is the product's core value loop and the single most important milestone in the entire roadmap.

## Phase 8 — Frontend: Collection Views
- **Objectives:** Build Dashboard Home (Summary Strip, Conversation Queue, Quick Insights) and History (Filter/Search, Conversation List).
- **Deliverables:** Working Queue and History list views, both routing correctly into the Analysis Workspace built in Phase 7.
- **Dependencies:** Phase 7 (both pages link into Analysis Workspace); Phase 1's DR-4 resolution (conversations-list endpoint) is a hard dependency here.
- **Exit Criteria:** Dashboard and History both render real data, support documented filter/sort behavior, and correctly reflect Escalated-case pinning (FD-4) once Phase 9 exists.

## Phase 9 — Human Review System
- **Objectives:** Implement the Human Review Panel's full Approve/Override/Escalate/Request More Info flow, including Confirmation dialogs and Notes persistence.
- **Deliverables:** Working review actions with proportional-friction confirmation (Override/Escalate gated, Approve not), Review Status propagation to Dashboard Queue and History (Escalated pinning).
- **Dependencies:** Phase 7 (Analysis Workspace must exist to host the panel); DR-5 (persistence layer) — until resolved, this ships as documented UI-complete-but-session-only, per the explicit caveat already established across dashboard_spec.md, settings_spec.md, and reports_spec.md.
- **Exit Criteria:** All four review actions function correctly within a session; Escalated status correctly pins in Queue/History; the non-persistence limitation is visibly and honestly surfaced in the UI per the product's own transparency principle.

## Phase 10 — Reports
- **Objectives:** Build Reports List/Detail, Clinical Summary Card (reused verbatim from Analysis Workspace), Explainability condensed section, Human Notes read-only section, Export/Print/Share.
- **Deliverables:** Working PDF export and Print layout (shared styling per reports_spec.md Section 7); Share Popover (placeholder pending auth, per DR-5-adjacent caveat).
- **Dependencies:** Phase 7 (Clinical Summary Card is reused, not rebuilt), Phase 9 (Human Notes content).
- **Exit Criteria:** A completed analysis can be exported to a correctly-formatted PDF containing the mandatory non-diagnostic disclaimer footer, matching reports_spec.md Section 6 exactly.

## Phase 11 — Settings
- **Objectives:** Build all eight Settings sections (Profile, Appearance, Notifications, Privacy, Accessibility, Security, Sessions, Account).
- **Deliverables:** Instant-apply controls (Theme, Contrast, Underline Links) and Save-gated controls (Profile, Notifications, Language, Text Size, Password, most Privacy/Security), per settings_spec.md Section 22's two-mode rule.
- **Dependencies:** Phase 6 (Shell theme state is shared with Top Nav toggle); Security/Sessions/Account sections are UI-complete-but-non-persistent pending auth (Open Question 18.2), same caveat pattern as Phase 9.
- **Exit Criteria:** All eight sections render and apply correctly per their documented instant-apply/Save-gated behavior; Delete Account's type-to-confirm flow works exactly as specified.

## Phase 12 — Documentation/API & About
- **Objectives:** Build the Documentation/API template (User/Developer/API Reference grouping, Code Block component, endpoint detail views) and the About page.
- **Deliverables:** Full documentation content sourced from architecture.md, pipeline.md, models_and_ai.md, testing_and_evaluation.md, release_notes.md, privacy_and_safety.md, and api_documentation.md; About page sourced from ProjectVision.md and README.md.
- **Dependencies:** Phase 5 (API Reference content must reflect the real, shipped API); CLA-1 (Code Block component) should be formally ratified before this phase per the Ratification document's own recommendation, not implemented from the placeholder alone.
- **Exit Criteria:** Documentation content matches shipped backend behavior exactly (no aspirational claims); About page renders all six sections per about_spec.md.

## Phase 13 — QA & Hardening
- **Objectives:** Execute the full testing matrix (Section 10), fix defects, verify accessibility and performance targets.
- **Deliverables:** Test reports across all categories; defect burn-down to zero blocking issues.
- **Dependencies:** All feature phases (7–12) functionally complete.
- **Exit Criteria:** All Section 14 completion criteria met.

## Phase 14 — Production Release
- **Objectives:** Staged rollout with monitoring and rollback readiness.
- **Deliverables:** Production deployment, monitoring dashboards, incident runbook.
- **Dependencies:** Phase 13 sign-off.
- **Exit Criteria:** Application live, stable, monitored, with a verified rollback path.

---

# 4. Feature Dependency Graph

```
Design Tokens (Phase 0)
   └─→ App Shell (Phase 6)
         └─→ Every authenticated page (Phases 7–12)

Database + Contract Ratification (Phase 1)
   └─→ Privacy Guard + Preprocessing (Phase 2)
         └─→ Emotion / Distress / Crisis / Pattern modules (Phase 3)
               └─→ Fusion Engine (Phase 4)
                     └─→ Decision Engine (Phase 4)
                           └─→ Explainability Report Generator (Phase 4)
                                 └─→ /analyze API (Phase 5)
                                       └─→ New Analysis submission UI (Phase 7)
                                             └─→ AI Pipeline Progress UI (Phase 7)
                                                   └─→ Analysis Workspace (Phase 7)
                                                         ├─→ Dashboard Queue (Phase 8)
                                                         ├─→ History List (Phase 8)
                                                         ├─→ Human Review Panel (Phase 9)
                                                         │      └─→ Escalated-pinning in Queue/History (Phase 8/9)
                                                         │      └─→ Human Notes → Reports (Phase 10)
                                                         └─→ Clinical Summary Card
                                                                └─→ Reports (Phase 10)

Conversations-list endpoint (DR-4, gate in Phase 1)
   └─→ Dashboard Queue (Phase 8)
   └─→ History List (Phase 8)

Auth/multi-user system (Open Question 18.2, external dependency)
   └─→ Human Review persistence (Phase 9, currently session-only)
   └─→ Settings: Security/Sessions/Account real functionality (Phase 11, currently session-only)
   └─→ Reports: Share with real access control (Phase 10, currently placeholder)

Code Block component ratification (CLA-1)
   └─→ Documentation/API (Phase 12)
```

**Key structural insight:** the Analysis Workspace (Phase 7) is the single point through which nearly every later feature flows — Dashboard, History, Human Review, and Reports all either link into it or reuse a component first built for it (Clinical Summary Card, Risk Badge, Explainability Panel). This is why Phase 7 is sequenced immediately after the backend API is real, ahead of the collection views that depend on it.

---

# 5. Backend Implementation Order

1. **Database schema** (Section 8) — must exist before any service can persist or query anything.
2. **Service-layer skeleton** (`analyzer.service`, `conversation.service`, `privacy.service`, `report.service` per frontend_requirements.md's documented service layer) — established early so the API layer never bypasses it, per frontend_requirements.md's explicit "never call APIs directly inside UI components" rule extended to backend service boundaries.
3. **Privacy Guard** — implemented before any analysis module, because architecture.md's pipeline flow places it first: no AI model ever receives unfiltered text, by design, not by convention.
4. **Text Preprocessing** — depends on Privacy Guard's output (anonymized text), prepares tokenized/normalized input for all downstream models.
5. **Emotion Analysis Model** — first of the four parallel-conceptual analysis modules to implement, since its output (emotion score set) is the simplest structurally and the fastest to validate against models_and_ai.md's documented output example.
6. **Distress Detection Model** — implemented next; depends on the same preprocessed input as Emotion, and its output (Distress Score + Level) is used directly by Fusion.
7. **Crisis Detection Model** — implemented after Distress, since Crisis Detection's "safety considerations" framing (models_and_ai.md) makes it the highest-scrutiny module; building it after two simpler modules exist gives the team a validated pattern to extend rather than inventing crisis-detection scaffolding from zero.
8. **Conversation Pattern Analyzer** — implemented last of the four, since it operates over the *sequence* of messages (trend, escalation speed) rather than single-message signals, and benefits from the other three modules' output already being available to correlate against during testing.
9. **Context Fusion Engine** — depends on all four modules (Emotion 35% / Distress 40% / Crisis 25%, or as documented in models_and_ai.md's weighting example) — cannot be built or meaningfully tested before its inputs exist.
10. **Risk Decision Engine** — consumes Fusion output, maps to the five documented risk categories (Safe/Mild/Moderate/High/Critical), applies confidence-based human-review recommendation logic.
11. **Explainable AI Report Generator** — depends on the Decision Engine's output plus the underlying signal detail from steps 5–8, since natural-language reasons must reference the actual detected signals, not just the final score.
12. **Authentication** — per Open Question 18.2, no auth system is currently specified in the source documentation as a build-now item; `[ASSUMPTION]` this roadmap treats Authentication as a **parallel-track, externally-scoped dependency** rather than a sequenced backend step, since building it without a specified design would mean inventing functionality outside the source documents (explicitly disallowed). Human Review and Settings ship session-only until this is resolved, per the pattern already established in the specifications themselves.
13. **Review system persistence** — depends on Authentication (step 12) for real multi-user persistence; the review *logic* (Approve/Override/Escalate state machine) can and should be built against the database in parallel, with persistence wiring deferred.
14. **Reporting** — depends on steps 9–11 (a report summarizes a completed decision) and on Review system output (Human Notes section) — built after the review logic exists structurally, even if not yet fully persistent.
15. **Background jobs** — `[ASSUMPTION]` no background/async job system is explicitly specified in the source documentation beyond the pipeline itself running per-request; if the pipeline's per-stage streaming (Section 9.3 of frontend_architecture.md, "backend can return partial results progressively") requires an async task queue, this is the last backend infrastructure piece added, since it's an optimization of an already-working synchronous pipeline, not a prerequisite for correctness.

**Why this order:** each step's output is a required input to the next (Privacy → Preprocessing → four analysis modules → Fusion → Decision → Explainability → API), mirroring pipeline.md's own documented flow exactly. Deviating from this order (e.g., building Fusion before Crisis Detection exists) would force mocking a safety-critical signal, which risks exactly the kind of silent contract drift the Ratification document already had to catch once.

---

# 6. Frontend Implementation Order

1. **App Shell** (Top Nav, Sidebar, Critical Alert Banner, Main Content Area) — every other page mounts inside this; must exist first, per frontend_architecture.md Section 2's explicit "single persistent frame for every authenticated screen" framing.
2. **Landing** — outside the Shell, but has no data dependency and can be built in parallel with Shell work at zero risk of blocking anything downstream.
3. **New Analysis** — the entry point into the product's core value loop; built immediately after the Shell because dashboard_spec.md and new-analysis_spec.md both treat it as the natural first destination for a new professional.
4. **AI Pipeline Progress (Full state)** — built alongside New Analysis, since new-analysis_spec.md Section 11 explicitly states this pattern *is* the submission page's loading state, not a separate later addition.
5. **Conversation Analysis Workspace** — built immediately after, since it's where the Pipeline Progress pattern navigates to on completion; this is the hero screen and the single largest frontend investment (Top/Middle/Bottom zoning, Split View, five-tab Middle Zone group, Explainability, Human Review Panel, Clinical Summary).
6. **Dashboard Home** — built after Analysis Workspace exists, since every Queue row's click target is the Workspace; building Dashboard first would mean linking to a page that doesn't exist yet.
7. **History** — built immediately after Dashboard, reusing its risk-badge and row-click patterns "pixel-for-pixel identical" per history_spec.md's own stated design intent — sequencing it right after Dashboard minimizes the chance of the two lists drifting apart.
8. **Human Review Panel refinement** — the panel is scaffolded inside Analysis Workspace (step 5) but its full Confirmation-dialog/Notes/Status-propagation behavior is completed once Dashboard/History exist to verify Escalated-pinning end-to-end (step 6–7 must exist to test this).
9. **Reports** — built after Analysis Workspace (reuses its Clinical Summary Card verbatim, per reports_spec.md's explicit "zero-modification reuse" instruction) and after Human Review (needs real Notes content to render the Human Notes section meaningfully).
10. **Settings** — built after the Shell's Theme Switch exists (Settings' Theme control shares state with it, per settings_spec.md Section 6) and after enough of the product exists that Notification preferences (which reference Pending Review, Escalation, etc.) have real events to configure against.
11. **Documentation/API** — built after the backend API is fully shipped (Phase 5 complete), since its entire content is a narrative description of the real, live API — building it earlier risks documenting an API surface that later changes.
12. **About** — built last among content pages; it has zero functional dependency on anything else, so it is correctly the lowest-priority page to finish, consistent with its own specification's framing as the calmest, most static page in the product.

**Why this order overall:** it mirrors exactly the sequence implied across the specifications' own repeated "reused from X, built after X" citations — Settings cites Dashboard's Theme Switch, Reports cites Analysis Workspace's Clinical Summary Card, History cites Dashboard's Queue patterns, About cites Documentation's Footer and Badge treatment. Building in citation order guarantees nothing is built against a not-yet-real reference implementation.

---

# 7. AI Pipeline Implementation

1. **Preprocessing** (Privacy Guard + Text Preparation) — first, because pipeline.md's documented flow places privacy protection before any model sees the text, and every later stage's correctness depends on receiving properly anonymized, normalized input.
2. **Analysis** (Emotion → Distress → Crisis → Pattern, in that order per Section 5 reasoning above) — second, because these are the raw signal producers; nothing downstream can be built or tested without them.
3. **Fusion** — third; combines the four analysis outputs into one risk estimation, per models_and_ai.md's documented weighting.
4. **Decision** — fourth; maps fused signal to the five documented risk categories and generates the recommended action, factoring in confidence per models_and_ai.md's "if confidence is low, avoid strong conclusions" principle.
5. **Explainability** — fifth; generates natural-language reasons referencing the specific detected signals from steps 2–3, not just the Decision output alone — this ordering is required because explanations must cite real upstream signal detail.
6. **Recommendations** — generated as part of the Decision stage's output (the "Recommended Human Review" / "Consider escalation" / "No immediate concern" language per dashboard_spec.md Section 11) — not a separate pipeline stage, but a documented field produced alongside the Decision.
7. **Human Review** — consumes the completed pipeline output (Decision + Explainability + Recommendation) as read-only input to the review workflow; correctly sequenced last among "AI-side" stages since it's the human-side counterpart, not a pipeline stage itself.
8. **Reporting** — consumes the completed, human-reviewed (or pending-review) state to generate the Clinical Summary — the final consumer of the entire pipeline's output, correctly built last.

**Streaming consideration:** per frontend_architecture.md Section 9.3, "where the backend can return partial results progressively... the UI renders each result as it arrives." This roadmap treats streaming per-stage output as an **enhancement built after the synchronous end-to-end pipeline is correct**, not a Day 1 requirement — a correct-but-synchronous pipeline is a viable, demoable milestone; a streaming-but-incorrect one is not.

---

# 8. Database Evolution

**Migration order** (each depends on the previous existing):

1. **Core conversation table(s)** — stores the (privacy-filtered) conversation content or reference, message metadata (timestamp, speaker), and conversation-level identifiers. Must exist first — every other table references a conversation.
2. **Analysis result tables** — one logical grouping per pipeline stage output (emotion scores, distress score/level, crisis indicators, pattern trend), foreign-keyed to the conversation table. Created after conversations, since results cannot exist without a parent conversation record.
3. **Fusion/Decision result table** — stores final risk level, confidence, and the weighted contribution breakdown (per Fusion Engine Card's documented percentages), foreign-keyed to the conversation and logically dependent on step 2's tables existing first (fusion reads from them).
4. **Explainability table** — stores generated natural-language reasons, foreign-keyed to the Decision result, created after step 3 since explanations reference a specific decision.
5. **Review/Human Decision table** — stores Approve/Override/Escalate status, Notes, Reviewer attribution, Review Status, and timestamp — separate from the Decision table by design, per dashboard_spec.md's explicit "AI Recommendation and Human Decision are never the same object" principle; foreign-keyed to the conversation, created after step 3–4 exist since review acts on a completed decision.
6. **Report table** (if reports are persisted as generated artifacts rather than computed on-demand) — foreign-keyed to conversation + decision + review; `[ASSUMPTION]` the source documentation does not explicitly state whether Reports are stored artifacts or computed fresh from underlying tables on each view — this roadmap assumes **computed-on-demand** from existing tables (steps 1–5) as the more conservative, lower-schema-risk choice, consistent with reports_spec.md's description of Reports as reusing the Clinical Summary Card's live data rather than describing a separate persisted-document model.
7. **User/profile table** — created once Authentication (Section 5, step 12) is scoped; not sequenced earlier since no auth system is currently specified to build against.
8. **Session table** — depends on step 7; supports Settings' Sessions section (settings_spec.md Section 12).

**Indexes:** applied on (a) conversation timestamp/date, for History and Dashboard Queue's sort-by-date behavior; (b) risk level, for Risk-filter behavior on Dashboard/History; (c) review status, for the Escalated-pinning query (FD-4) which must run efficiently regardless of active sort — this index is specifically important since Escalated pinning is documented as overriding normal sort order on every list view.

**Foreign keys:** every table from step 2 onward foreign-keys to the conversation table's primary key; the Review table (step 5) additionally foreign-keys to a user/reviewer identity once step 7 exists — until then, reviewer attribution is stored as free text or a session-scoped placeholder, consistent with the documented "UI-complete but non-persistent" caveat.

**Future migrations** (explicitly not built now, per Backend Dependencies in the Ratification document): longitudinal/multi-session tracking (Session Evolution, Open Question 18.1), conversation versioning for re-analysis (DR-6), and clinic/multi-user account structures (Open Question 18.2) are all deferred migrations with no current schema commitment, since building them now would mean inventing a data model not specified anywhere in the source documentation.

---

# 9. API Evolution

Endpoint implementation strictly follows api_documentation.md's own two documented endpoints, in this order:

1. **`GET /health`** — implemented first; trivial, has zero dependencies, and is required by every environment's deployment/monitoring tooling from Day 1 (Section 11).
2. **`POST /analyze`** — implemented second; depends on the full backend pipeline (Section 5, steps 3–11) being real, since a stub `/analyze` endpoint would violate the "no fabricated result" principle running through the entire product. This is the single most important endpoint in the system and the one every frontend page ultimately depends on.
3. **Documentation interfaces (`/docs`, `/redoc`)** — auto-generated by FastAPI once the above two endpoints and their typed request/response models exist; no separate implementation work beyond correct route/schema definition.

**Endpoints required but not yet documented in api_documentation.md** (flagged, not invented):
- A **conversations-list endpoint**, required by Dashboard Queue and History (DR-4) — its exact shape must be defined as part of the Phase 1 contract-ratification gate before Phase 8 frontend work begins. This roadmap does not invent its schema, per instruction; it only confirms *that* it must exist and *when* it must be resolved (before Phase 8).
- **Review-action endpoints** (Approve/Override/Escalate/Notes submission), required by Phase 9 — currently undocumented in api_documentation.md; must be specified before Phase 9 backend work, following the same "no invented schema" constraint.

**Why this order:** `/health` before `/analyze` because monitoring/deployment tooling (Section 11) needs a target from the first deployment onward, long before the pipeline is complete; `/analyze` before anything else functional because literally every frontend page specification's Data Source section (dashboard_spec.md Section 7's data source, history_spec.md, reports_spec.md) traces back to it, directly or via the conversations-list endpoint that summarizes many `/analyze` results.

---

# 10. Testing Strategy

**Unit Tests:** applied to each Phase 2–4 pipeline module independently (Privacy Guard, Preprocessing, Emotion, Distress, Crisis, Pattern, Fusion, Decision, Explainability) per testing_and_evaluation.md's documented Unit Testing scope ("emotion analysis module, privacy protection module, crisis detection logic, risk scoring functions, safety response generation").

**Integration Tests:** verify the full pipeline chain end-to-end (conversation in → risk decision out), and verify privacy filtering is applied *before* any analysis stage runs — this ordering check is explicitly called out in testing_and_evaluation.md's Integration Testing scope.

**Backend Tests:** cover API request handling, response generation, and error management (missing conversation data, invalid format, internal errors) per api_documentation.md's documented error cases.

**Frontend Tests:** component-level tests for every reused component (Risk Badge, Clinical Summary Card, AI Pipeline visualization, Explainability Panel) verifying they render identically wherever they're reused (Dashboard vs. History vs. Reports), directly testing the "never color alone," "identical treatment everywhere" rules stated repeatedly across the design specifications.

**API Tests:** automated tests against `/health` and `/analyze`, extending the existing documented baseline (12/12 tests, ~80% coverage per README.md) as new endpoints (conversations-list, review-actions) are added — coverage should not regress below the current documented baseline as scope grows.

**End-to-End Tests:** full user journeys — submit conversation → view pipeline progress → view Analysis Workspace → review and Approve/Override/Escalate → view in History → export Report — covering the exact Navigation Flow Diagram already documented in UX-Wireframe-Specification.md Section 15.

**Accessibility Tests:** WCAG AA contrast verification (including the specifically-flagged Moderate/High/Critical risk-color distinguishability requirement), full keyboard-navigation pass per each page spec's documented Section 15–17 (varies by page), `aria-live` region verification for the AI Pipeline and Export button state announcements, focus-trap/return-focus verification for every modal/dialog/overlay in the product.

**Performance Tests:** verify Dashboard First Paint < 1 second and Interactive < 2 seconds (frontend_requirements.md's documented targets); verify Pipeline node transitions and chart rendering hold 60 FPS; verify large conversation histories render correctly under virtualization without performance degradation.

**Security Tests:** verify Privacy Guard correctly detects and anonymizes all documented PII categories (names, phone numbers, emails, addresses, ID numbers) across varied input formats; verify no raw conversation content is ever logged or exposed in error messages/stack traces (frontend_requirements.md's explicit logging restriction); verify API access controls once Authentication exists.

---

# 11. Deployment Strategy

**Development:** local/dev environment per developer, running against a seeded/sample database; CI runs the full automated test suite (per README's existing GitHub Actions setup) on every push.

**Staging:** a full-fidelity environment mirroring production configuration, used for end-to-end and accessibility/performance verification before any release; staging is the environment where the QA phase (Phase 13) is primarily executed.

**Production:** staged rollout — `[ASSUMPTION]` the source documentation does not specify a canary/blue-green/rolling strategy explicitly; this roadmap recommends a conservative staged rollout (a small percentage of traffic first) as the standard conservative default for a clinical-safety-adjacent product, without asserting this was already decided anywhere in the source documents.

**Rollback:** every production deployment must have a verified, tested rollback path to the immediately-prior stable version before that deployment is promoted — this is treated as a hard release gate given the product's safety-critical nature, even though not explicitly detailed in the source documentation.

**Monitoring:** `/health` endpoint (Section 9) is the baseline liveness signal; pipeline-stage-level monitoring should track per-stage latency and failure rate, directly supporting the product's own documented "partial failure" UI states (a monitored, known-failed stage is what powers the "Crisis signal unavailable" inline error state already specified in dashboard_spec.md Section 22).

**Logging:** strictly follows frontend_requirements.md's explicit restriction — never log API keys, conversation content, or private information; logs support debugging while protecting privacy, consistent with the product's Privacy First principle extending into operational tooling, not just user-facing features.

---

# 12. Risks

| Risk | Category | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| API response contract (flat vs. nested) not resolved before frontend work begins | Technical | High (already identified as unresolved) | High — forces rework across Dashboard, Analysis Workspace, History | Hard-gate Phase 1 exit criteria on DR-3 resolution before any Phase 6+ frontend service-layer code is written |
| Conversations-list endpoint doesn't exist or has an unconfirmed shape | Architecture | High (explicitly flagged, DR-4) | High — blocks Dashboard Queue and History entirely | Resolve as part of Phase 1 contract gate; do not begin Phase 8 until confirmed |
| Crisis Detection false negatives (missed genuine crisis signals) | AI | Medium | Critical — direct safety consequence | Extensive Crisis Detection unit/integration testing (Section 10); human review remains mandatory for Moderate+ risk per the product's own non-negotiable design principle; never allow the AI to be the sole gate on a Critical classification |
| Crisis Detection false positives (alert fatigue) | AI | Medium | Medium — erodes professional trust over time, per privacy_and_safety.md's own "avoid false alarms" principle | Fusion weighting and confidence thresholds tuned against a real evaluation dataset before production release (testing_and_evaluation.md's evaluation framework) |
| PII leakage if Privacy Guard has gaps in detection coverage | Security | Medium | Critical — direct privacy violation in a clinical-data product | Security-test-driven coverage of all documented PII categories (Section 10) before any raw text reaches an analysis model; fail-closed behavior (block analysis) if Privacy Guard itself errors, rather than fail-open |
| Human Review non-persistence (Open Question 18.2) shipped to real clinical use without users realizing state resets on reload | Architecture / Safety | Medium | High — a professional could believe a review decision was saved when it wasn't | The UI-complete-but-non-persistent limitation must remain visibly surfaced (already specified) in every phase it ships in; do not silently "soft-launch" this as if it were persistent |
| Pipeline latency causing professionals to abandon the AI Pipeline Progress screen mid-analysis | Performance | Medium | Medium | Streaming partial results (Section 7's streaming enhancement) prioritized early in Phase 13 hardening if latency exceeds UX targets |
| Explainability output referencing incorrect or stale signal detail if pipeline stage ordering is violated during future refactors | Technical | Low | High — undermines the product's core explainability guarantee | Integration tests (Section 10) explicitly assert stage-ordering correctness, not just final-output correctness |
| Reports/Analysis Workspace visual drift between reused components (Clinical Summary Card, Risk Badge) over time | Architecture | Medium | Medium — erodes the "one consistent product" principle repeatedly emphasized across specs | Component-level frontend tests (Section 10) specifically assert identical rendering across all reuse sites, not just per-page correctness |
| Fairness/bias gaps across writing styles, cultures, age groups (explicitly flagged as a limitation in privacy_and_safety.md and future_improvements.md) | AI | Medium | High | Fairness evaluation explicitly scheduled as part of Phase 13 QA, using testing_and_evaluation.md's documented evaluation framework, not deferred indefinitely to "future improvements" |
| Authentication absence blocking Settings Security/Sessions/Account and Reports Share from ever becoming real | Architecture | High (currently unresolved, Open Question 18.2) | Medium (currently correctly scoped as a known limitation, not a defect) | Tracked explicitly in Backend Dependencies (Ratification document); not silently worked around by inventing an ad hoc auth scheme outside the source documentation |

---

# 13. Sprint Plan

`[ASSUMPTION: sprint length assumed at 2 weeks, a common default; not specified anywhere in the source documentation. Sprint count and grouping are derived directly from the Phases in Section 2 and Milestones in Section 3.]`

**Sprint 1 — Foundation**
- Goal: Repo, CI/CD, design tokens, backend project skeleton live.
- Deliverables: Working CI pipeline; token package; FastAPI skeleton.
- Outcome: A commit can be built, tested, and deployed to dev automatically.

**Sprint 2 — Core Infrastructure & Contract Ratification**
- Goal: Database schema (initial tables) live; DR-3 and DR-4 formally resolved.
- Deliverables: Migrations for conversation/analysis-result tables; ratified API response contract document.
- Outcome: Hard gate cleared — frontend work can safely begin building against a stable contract later.

**Sprint 3 — Privacy Guard & Preprocessing**
- Goal: Raw conversation → anonymized, normalized text.
- Deliverables: Privacy Guard module, Text Preprocessing module, unit tests.
- Outcome: Verified against privacy_and_safety.md's documented before/after anonymization example.

**Sprint 4 — Emotion & Distress Modules**
- Goal: First two analysis modules producing structured, documented output.
- Deliverables: Emotion Analysis Model, Distress Detection Model, unit tests.
- Outcome: Sample conversation produces a correct emotion score set and distress level.

**Sprint 5 — Crisis & Pattern Modules**
- Goal: Remaining two analysis modules complete.
- Deliverables: Crisis Detection Model, Conversation Pattern Analyzer, unit tests, elevated scrutiny testing on Crisis specifically.
- Outcome: All four analysis modules independently verified.

**Sprint 6 — Fusion, Decision, Explainability**
- Goal: Full pipeline produces a final, explainable risk decision.
- Deliverables: Context Fusion Engine, Risk Decision Engine, XAI Report Generator, integration tests.
- Outcome: End-to-end pipeline run matches models_and_ai.md's documented output shape exactly.

**Sprint 7 — API Surface**
- Goal: `/health` and `/analyze` live and correctly typed.
- Deliverables: Working REST endpoints, error handling, `/docs`/`/redoc`.
- Outcome: A real HTTP request against `/analyze` returns a complete, correct result — first fully working backend milestone.

**Sprint 8 — Frontend Shell**
- Goal: App Shell live at all breakpoints.
- Deliverables: Top Nav, Sidebar, Critical Alert Banner, Command Palette, theme switching.
- Outcome: Every subsequent page has a stable frame to mount into.

**Sprint 9 — New Analysis & Pipeline Progress**
- Goal: A professional can submit a real conversation and watch it process.
- Deliverables: New Analysis page, AI Pipeline Progress (Full state), wired to the real `/analyze` endpoint.
- Outcome: Submission-to-processing loop works end-to-end.

**Sprint 10 — Analysis Workspace (Part 1: Top & Middle Zone)**
- Goal: Risk Card, Confidence, Signals, Conversation Viewer, and tab group (Fusion/Risk/Emotion/Heatmap/Pipeline) live.
- Deliverables: Top Zone + Middle Zone Split View.
- Outcome: A completed analysis is viewable in full reasoning detail.

**Sprint 11 — Analysis Workspace (Part 2: Bottom Zone)**
- Goal: Explainability, Human Review Panel (scaffold), Clinical Summary closing strip live.
- Deliverables: Bottom Zone complete; Analysis Workspace fully matches dashboard_spec.md Section 9.
- Outcome: The product's core value loop (submit → understand → decide) is fully demoable.

**Sprint 12 — Dashboard & History**
- Goal: Collection views live, both routing into the completed Analysis Workspace.
- Deliverables: Dashboard Home (Summary Strip, Queue, Quick Insights), History (Filter/Search, List).
- Outcome: A professional can find and open any past or pending conversation.

**Sprint 13 — Human Review System**
- Goal: Full Approve/Override/Escalate/Notes flow functional.
- Deliverables: Confirmation dialogs, Review Status propagation, Escalated pinning verified across Dashboard/History.
- Outcome: The "AI recommends, human decides" loop is fully closed, session-scoped.

**Sprint 14 — Reports**
- Goal: Exportable, printable Clinical Summary live.
- Deliverables: Reports List/Detail, PDF/Print layout with mandatory disclaimer footer, Human Notes section.
- Outcome: A professional can produce a shareable, compliant document from a completed case.

**Sprint 15 — Settings**
- Goal: All eight Settings sections functional per their documented apply-behavior.
- Deliverables: Profile, Appearance, Notifications, Privacy, Accessibility, Security, Sessions, Account.
- Outcome: Full account/preference management live (Security/Sessions/Account session-only pending auth).

**Sprint 16 — Documentation/API & About**
- Goal: Reference and static content surfaces complete.
- Deliverables: Documentation/API (User/Developer/API Reference groups, Code Block component), About page.
- Outcome: All eight core screens from the original IA are now built.

**Sprint 17–18 — QA & Hardening**
- Goal: Full testing matrix executed; defects resolved.
- Deliverables: Test reports across all categories in Section 10; accessibility and performance verification.
- Outcome: Zero blocking defects; all Section 14 criteria met.

**Sprint 19 — Production Release**
- Goal: Live, monitored, rollback-ready production deployment.
- Deliverables: Staged rollout executed, monitoring dashboards live, incident runbook published.
- Outcome: Version 1.0 shipped.

---

# 14. Completion Criteria

**Version 1.0 is complete when all of the following are true:**

1. All eight core screens (Landing, Dashboard, New Analysis, Conversation Analysis Workspace, History, Reports, Settings, Documentation/API, About) are implemented exactly per their respective High-Fidelity Specifications, with zero unresolved visual or interaction deviation.
2. The full AI Pipeline (Privacy Guard → Emotion → Distress → Crisis → Pattern → Fusion → Decision → Explainability) runs end-to-end against real input and produces a correctly-shaped, explainable result matching architecture.md and models_and_ai.md.
3. `/health` and `/analyze` are live, tested, and documented; the automated test suite passes with coverage at or above the existing documented baseline (README.md's 12/12, ~80%), extended to cover all new functionality built since.
4. The Human Review workflow (Approve/Override/Escalate/Request More Info) functions correctly within a session, with its current non-persistence limitation honestly and visibly surfaced, per the product's own transparency principle — not silently hidden.
5. Reports export correctly to PDF/Print, including the mandatory non-diagnostic disclaimer footer on every exported document, with zero exceptions.
6. All Final Design Decisions (FD-1 through FD-6) and all Accepted Assumptions from the Design-System-Ratification-Final-UX-Decisions.md have been applied as corrections to their affected specifications and implementations.
7. The two backend-blocking Decisions Still Required that gate frontend contract stability (DR-3, DR-4) are formally resolved — no page ships against an assumed, unconfirmed data contract.
8. Full testing matrix (Section 10) executed with zero blocking defects: unit, integration, backend, frontend, API, end-to-end, accessibility (WCAG AA), performance (targets in Section 10), and security (PII-handling verification) all pass.
9. Privacy protection is verified functioning correctly and fail-closed (analysis blocked, not silently skipped, if Privacy Guard errors) across all documented PII categories, before any text reaches an analysis model, in every environment including production.
10. Every remaining unresolved item — Decisions Still Required (DR-1, DR-2, DR-5 through DR-9), Design System Additions (DSA-1 through DSA-4) formally ratified into components.md/design.md, and Component Library Additions (CLA-1 through CLA-3) — is either resolved or **explicitly and visibly re-flagged as still-open**, consistent with frontend_architecture.md Section 19's own governing rule that no open item is silently dropped at release time.
11. Production deployment is live, monitored (Section 11), and has a verified, tested rollback path.
12. No feature, screen, endpoint, or component exists in the shipped product that is not traceable to an explicit requirement in the source documentation set — Version 1.0 is exactly what was specified, nothing invented, nothing silently omitted.

---

**End of Development Roadmap.**
This document, together with the complete design and architecture package it was derived from, constitutes the full pre-implementation planning basis for the Mental Health Safety Analyzer. All unresolved assumptions and open decisions from the source documentation have been preserved and carried forward here, not silently resolved. Engineering planning may proceed on this basis, subject to the Phase 1 contract-ratification gate (Section 3) being cleared first.
