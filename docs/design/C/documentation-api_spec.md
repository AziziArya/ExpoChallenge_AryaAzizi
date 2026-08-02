# Documentation / API Page — High-Fidelity Design Specification
## Mental Health Safety Analyzer · Phase 3, Screen 7

**Document type:** Production design specification
**Target path:** `docs/design/documentation-api_spec.md`
**Audience:** Senior Frontend Engineer / Design Engineer implementation team
**Status:** Ready for build, pending final review
**Primary sources:** ProjectVision.md, design.md, frontend_requirements.md, components.md, frontend_architecture.md, api_documentation.md, landing_spec.md, dashboard_spec.md, history_spec.md, reports_spec.md, settings_spec.md, new-analysis_spec.md

This document introduces **no new design tokens, colors, typography, spacing values, radii, shadows, motion durations, easing curves, or component types.** Every visual and behavioral element below is drawn from the system already locked across the prior specifications.

> **On genuine gaps:** this page has more undefined territory than any screen specified so far — the source documentation defines the Documentation Template's *structure* (`frontend_architecture.md` Sections 5.7–5.8) but never defines a Code Block component, a monospace type role, HTTP-method badge colors, or a copy-to-clipboard pattern anywhere in components.md or design.md. Per instruction, every such gap is marked `[ASSUMPTION]` with a short explanation of the most conservative, system-consistent resolution — never presented as if it were already locked. These should be confirmed as real additions to the design system (not just to this page) before implementation, since a Code Block and monospace type role will very likely be needed elsewhere in the product later.

No code, HTML, CSS, or React is included. All measurements and behaviors are specified precisely enough for direct implementation.

---

# 1. Overall Layout

Documentation/API is a **specialized pairing of two templates already defined in `frontend_architecture.md`**: the Documentation Template (Section 5.7) and the API Template (Section 5.8), which is explicitly architected as "a specialized child of the Documentation template — same shell treatment, adds a live endpoint reference." This document treats them as one continuous experience with a shared shell and sub-nav, consistent with that original architectural decision, rather than as two disconnected pages.

```
┌─────────────────────────────────────────────────────────────┐
│ [ Page heading: "Documentation" — H1 ]                            │
├───────────────────┬─────────────────────────────────────────┤
│ SUB-NAV RAIL         │ CONTENT AREA                              │
│ (left, 240px,        │ (rendered doc content, reading-width       │
│  grouped by          │  constrained for prose; full-width for      │
│  audience — Sec. 2)  │  API Reference tables/code blocks)           │
│                      │                                            │
└───────────────────┴─────────────────────────────────────────┘
│ Footer (License, GitHub, Documentation, About)                     │
└─────────────────────────────────────────────────────────────┘
```

**Shell reuse:** Top Navigation, Sidebar, and conditional Critical Alert Banner are unchanged from every other authenticated page (`frontend_architecture.md` Section 2). Documentation is the one authenticated template that **retains a Footer** (Section 2.6's documented exception, alongside Landing), since it is long-form, static-leaning content that benefits from a closing zone — this is a direct, explicit reuse of an already-established exception, not a new one introduced here.

**Container width:** the Sub-Nav Rail uses the same 240px width already established for Settings' sub-nav (`settings_spec.md` Section 3) — the same structural echo of the Shell Sidebar's width, extended to a second page for the same reason. The Content Area is **not** uniformly reading-width constrained like Reports or Settings: prose sections (guides, philosophy, privacy explanations) use an ~720px reading-width column (reused from Settings/New Analysis), while API Reference sections (endpoint tables, request/response examples) expand to the full remaining Main Content Area width, since tabular and code content benefits from more horizontal room than prose does. This dual-width behavior is stated explicitly here because it is the one page in the product where content width is context-dependent rather than fixed per template.

---

# 2. Information Architecture

Per the explicit instruction that Documentation must clearly separate **User Documentation**, **Developer Documentation**, and **API Reference**, the Sub-Nav Rail is grouped into three labeled sections rather than one flat list — an extension of the grouping pattern already used in the Shell Sidebar itself (`dashboard_spec.md` Section 4's divider-separated groups), applied here with visible group labels since Documentation's item count is larger and benefits from explicit labeling, unlike the Sidebar's smaller, self-evident set.

```
USER DOCUMENTATION
  Overview
  How It Works
  Privacy & Safety
  Frequently Asked Questions

DEVELOPER DOCUMENTATION
  Architecture
  AI Pipeline
  Models & AI Components
  Testing & Evaluation
  Release Notes

API REFERENCE
  Getting Started
  Authentication
  Endpoints
  SDKs & Integration
```

**Rationale for grouping order:** User Documentation first, since it serves the primary personas (mental health professionals) who make up the majority of traffic to this page per ProjectVision.md's persona weighting; Developer Documentation second, serving the secondary Developer/AI Researcher personas; API Reference last, as the most technical and narrowest-audience content — this mirrors the same "broad audience first, narrow/technical audience last" ordering principle already applied in Settings (`settings_spec.md` Section 2's "destructive/administrative actions deliberately last" logic, generalized here to "most-technical-content last").

**Content sourcing:** User Documentation content maps directly to ProjectVision.md and privacy_and_safety.md; Developer Documentation maps to architecture.md, pipeline.md, models_and_ai.md, testing_and_evaluation.md, and release_notes.md; API Reference maps to api_documentation.md. No content category invents information not already present in the source documentation set.

---

# 3. Navigation Structure

**Desktop/Laptop (≥1024px):** persistent left rail exactly as structured in Section 2, group labels in caption-scale muted text (non-interactive, not a button), items beneath each label following the identical row treatment already defined for Settings' sub-nav (`settings_spec.md` Section 3): 44px row height, 16px horizontal padding, text-only (no icons — same anti-decoration reasoning already applied to Settings, since Documentation's item labels are similarly self-explanatory).

**Active state:** identical three-part-minus-icon signal already used for Settings — bold label weight (600) + 3px leading accent bar in Primary Blue. Group labels themselves are never "active," only the items beneath them.

**Selecting an item:** updates the Content Area via the same 180ms crossfade used for Settings' section switching (`settings_spec.md` Section 3) and Dashboard's tab-group switching (`dashboard_spec.md` Section 9) — reused, not reinvented.

**URL behavior:** every documentation item and every API endpoint detail view is independently addressable, consistent with the bookmarkable-route preference already established for Reports and Settings (`frontend_architecture.md` Section 6.4-adjacent reasoning, `new-analysis_spec.md` Section 11) — this matters especially here, since developers and researchers frequently need to link directly to a specific endpoint or architecture section from outside the app (e.g., in a support ticket or a README).

---

# 4. Documentation Landing View

The default view when Documentation is opened without a specific item selected (i.e., clicking "Documentation" in the Shell Sidebar with no prior sub-nav state) — **not** a separate template, simply the Content Area's state before any Sub-Nav Rail item is selected.

**Layout:**
```
[ H1: "Documentation" ]
[ muted subline: "Everything you need to understand and build with
  Mental Health Safety Analyzer." ]

[ Three-column card row (desktop), one Card per audience group: ]
  [ "For Professionals" Card ] [ "For Developers" Card ] [ "API Reference" Card ]
  Each Card: short 1-2 line description + "Explore →" text link,
  clicking anywhere on the Card opens that group's first sub-nav item.
```

This landing view uses the **Default Card** component (components.md) exactly as used for Landing's Trust Zone blocks (`landing_spec.md` Section 3) — flat, no elevation emphasis, informational rather than interactive-styled beyond the single "Explore →" affordance, consistent with the calm, non-decorative register this product maintains even in its documentation surface.

`[ASSUMPTION: the three-card landing summary is not explicitly specified anywhere in the source documentation — frontend_architecture.md Section 5.7 only specifies "the active document's content itself" as the hero, without describing a landing/default state before a document is selected. This is the most conservative resolution consistent with the Documentation Template's own stated hero rule, reusing the exact Card component already established for Landing's Trust Zone rather than inventing a new pattern.]`

---

# 5. API Reference Layout

Per `frontend_architecture.md` Section 5.8, the API Reference **is architected to link to or embed FastAPI's own generated `/docs` and `/redoc` interfaces "rather than reimplementing an API explorer from scratch."** This specification honors that decision exactly — the product does **not** build a custom interactive endpoint tester, request builder, or Swagger-style "Try it out" console. This directly satisfies the instruction to avoid introducing Swagger-specific UI beyond what the architecture already calls for.

What this page *does* build, as first-class product documentation content (not a replacement for the FastAPI-generated interface, but a narrative layer around it):

```
[ H2: "Getting Started" ]
  Prose overview of the API's purpose and request/response structure
  (sourced directly from api_documentation.md's own "API Architecture" section)

[ H2: "Authentication" — Section 7 ]

[ H2: "Endpoints" ]
  A narrative reference list — Section 6 — one entry per documented
  endpoint (/health, /analyze), each summarized with method, purpose,
  and a link to Request/Response Examples (Section 8)

[ Closing card: "Interactive API Explorer" ]
  Short description + Primary Button: "Open API Docs" → opens FastAPI's
  live /docs interface (per api_documentation.md's own documented
  /docs and /redoc availability), in a new browser tab
```

**Why a new tab, not an embed:** FastAPI's generated `/docs`/`/redoc` interfaces have their own visual language entirely outside this product's design system (Swagger UI's own styling) — embedding them inline would either look jarringly inconsistent or require overriding their styles, which risks silently reintroducing the "reimplemented API explorer" the architecture explicitly avoided. Opening in a new tab keeps the product's own surface fully consistent while still providing direct, one-click access to the real interactive tool. `[ASSUMPTION: new-tab vs. inline-iframe embed is not specified in api_documentation.md or frontend_architecture.md; new-tab is the more conservative choice for preserving visual consistency and is stated as such rather than presented as an already-settled decision.]`

---

# 6. Endpoint Detail Layout

Each documented endpoint (currently `/health` and `/analyze`, per api_documentation.md) gets its own addressable content view within the API Reference group, reached by clicking its entry in the Endpoints list (Section 5).

**Layout:**
```
[ Breadcrumb: API Reference / Endpoints / Analyze Conversation ]

[ Method badge ] [ Endpoint path, monospace — Section 12 ]
  e.g., [ POST ]  /analyze

[ H2: Purpose ] — one paragraph, plain language, sourced from
  api_documentation.md's own "Purpose" description for that endpoint

[ H2: Request ]
  [ Code Block — Section 12 — showing the documented request JSON shape ]

[ H2: Response ]
  [ Code Block showing the documented response JSON shape ]

[ H2: Response Fields ]
  A simple two-column definition list (field name in monospace,
  description in body text) — not a Table component, since this is
  a short, fixed-length list better suited to a lighter-weight layout
  than the Table component's row-dense, sortable-column treatment
  reserved for Queue/History-style collections

[ H2: Errors ]
  Prose list of documented error conditions (sourced from
  api_documentation.md's "Common errors" section), each with its
  example error-response Code Block
```

**HTTP method badge:** `[ASSUMPTION: components.md defines a Badge component but does not define HTTP-method-specific color coding anywhere. Assigning the product's existing risk-state colors (Green/Amber/Red) to HTTP methods would create a direct semantic collision with those colors' established, safety-critical meaning elsewhere in the product (Green=Safe, Amber=Moderate Risk, Red=Critical) — a real risk in a clinical tool where color consistency matters. The conservative resolution: method badges use the neutral/outline Badge variant with the method name as bold monospace text, color-neutral, relying on text rather than a new color assignment — consistent with the system-wide "never color alone" principle applied in the opposite direction here (text alone, deliberately, to avoid a color collision).]`

---

# 7. Authentication Documentation

Per api_documentation.md, the current API has **no authentication system** — this is explicitly listed as a "Future API Improvement," not a present capability, and `frontend_architecture.md` Open Question 18.2 confirms no auth/multi-user system currently exists anywhere in the product.

**Content, honestly reflecting this state rather than documenting a system that doesn't exist:**
```
[ H2: "Authentication" ]

[ Inline Alert — informational tone, not warning tone ]
  "This API does not currently require authentication. Authentication
  is planned as a future capability — see Roadmap."

[ Prose: brief explanation that current deployment is intended for
  research/prototype use, referencing the same "research prototype"
  framing already used in README.md and release_notes.md ]
```

This directly extends the same transparency principle already established for Settings' Two-Factor Authentication row (`settings_spec.md` Section 11: "shown, disabled, with an honest 'coming soon' note ... rather than hidden") — applied here to documentation content instead of a UI control, but the same underlying value: the product is candid about what it does not yet do, rather than presenting aspirational documentation as current fact.

---

# 8. Request / Response Examples

Every Request/Response example on this page is **display-only**, per instruction — there is no "Run" or "Send request" affordance anywhere in this product's own documentation surface (that capability exists solely in the externally-linked FastAPI `/docs` interface, per Section 5). This is stated explicitly here to prevent an implementation from adding an executable console to the Code Block component defined in Section 12, which would silently reintroduce a custom API-explorer capability the architecture already decided against.

**Content sourcing:** every example shown reproduces the exact request/response JSON shapes already documented in api_documentation.md (e.g., the `/analyze` request example with a `conversation` array, and its `risk_level`/`confidence`/`detected_signals` response shape) — no new example data, fields, or values are invented for this page. `[ASSUMPTION: frontend_architecture.md Open Question 18.3 notes a conflict between api_documentation.md's flat response field names and design.md's nested Backend Integration Rules field names — this page reproduces api_documentation.md's examples verbatim rather than attempting to reconcile the two, since resolving that conflict is explicitly out of scope for a documentation-display page and remains an open architecture question.]`

---

# 9. SDK & Integration Section

`[ASSUMPTION: no SDK, client library, or integration tooling is described anywhere in the uploaded source documentation — requirements.txt lists only server-side/backend Python dependencies, and api_documentation.md's "Future API Improvements" section does not mention SDKs. This section is therefore specified structurally, per the brief's explicit requirement to include it, but its content is marked as not-yet-available rather than invented.]`

**Layout:**
```
[ H2: "SDKs & Integration" ]

[ Inline Alert — informational tone ]
  "No official client SDKs are currently available. The API can be
  called directly using any standard HTTP client — see the Request/
  Response Examples above for the expected request and response shapes."

[ Optional prose: a minimal example of calling /analyze with a generic
  HTTP request, shown in a single Code Block, reusing only the
  request shape already documented in api_documentation.md — not a
  new SDK example, simply the same JSON shape presented as a request
  body ]
```

This section exists to satisfy the requested IA completeness without fabricating tooling that doesn't exist — consistent with the same "coming soon, honestly stated" treatment already used for Authentication (Section 7) and Settings' Two-Factor row.

---

# 10. Search Behavior

**Fully reused, not reinvented.** The Top Navigation Search field and its Command Palette destination (`frontend_architecture.md` Section 6.6, 6.8) is the single search implementation for the entire authenticated product, and Documentation/API does not introduce a second, page-scoped search field or a different search interaction model.

**Documentation-specific Command Palette behavior:** when the Command Palette is opened from within Documentation/API, its result list includes documentation items and endpoint entries alongside its existing result types (conversations, navigation destinations) — this is an extension of the Command Palette's existing result set, not a new search surface. Selecting a documentation result navigates directly to that item's Content Area view, closing the Palette exactly as it does for any other result type (`frontend_architecture.md` Section 6.6's focus-trap/return-focus behavior applies identically).

`[ASSUMPTION: frontend_architecture.md Section 6.6 lists Command Palette actions as "jump to any Sidebar destination, jump to a specific conversation by search, start New Analysis, jump to Settings" without explicitly mentioning documentation content as a searchable result type. Extending it to include documentation/API entries is a reasonable, minimal extension of the existing single-search-implementation principle rather than a new search pattern, and is flagged here since it was not explicitly stated in the original Command Palette scope.]`

---

# 11. Copy-to-Clipboard Interactions

`[ASSUMPTION: no copy-to-clipboard interaction pattern exists anywhere in components.md, design.md, or any prior specification. The pattern below is the most conservative, token-consistent resolution — reusing only existing Icon Button and Toast components — rather than an invented new interactive pattern.]`

**Placement:** a small Icon Button (copy icon, 16px), top-right corner of every Code Block (Section 12), 8px inset from the block's top-right corner.

**Behavior:** click copies the block's full text content to the clipboard; the icon itself performs a brief, one-time crossfade from the copy icon to a checkmark icon for 1.5 seconds `[ASSUMPTION: exact duration not defined elsewhere; chosen as a short, non-looping, self-resolving confirmation consistent with the system's "no continuous animation" rule]`, then reverts — no Toast is used for this specific confirmation, since a Toast would be disproportionate feedback weight for a low-consequence, extremely frequent micro-action (reusing the same proportional-feedback reasoning already applied in `frontend_architecture.md` Section 1.2, extended here from "friction" to "feedback weight").

**Hover/focus state:** identical Icon Button hover/press treatment already defined system-wide (`dashboard_spec.md` Section 26) — no new button variant.

---

# 12. Code Block Design

`[ASSUMPTION: this is the largest genuine gap in the existing design system — no Code Block component, monospace typography role, or syntax-highlighting palette is defined anywhere in components.md or design.md, which specify only Inter for all text roles. The specification below is the most conservative possible resolution: it introduces a monospace font **only as a fallback-stack addition for code content specifically**, not as a new type role competing with Inter's system-wide use, and uses existing neutral surface/border tokens rather than a new syntax-highlighting color palette. This should be formally ratified as a real design-system addition before implementation, since Code Blocks will likely be needed again outside this page.]`

**Container:** Default Card treatment (existing radius, existing 1px neutral border) but using the Shell's next-darker neutral surface tone (the same subtle elevation step already used to distinguish the Human Review Panel from Explainability in the Analysis Workspace, `dashboard_spec.md` Section 16) — this distinguishes code content from prose without introducing a new background color.

**Typography:** a monospace font stack `[ASSUMPTION: e.g., "SF Mono, Consolas, Monaco, monospace" — a standard system-monospace fallback stack, not a new licensed typeface, consistent with the existing system's own approach of using system-fallback stacks for Inter]`, at Body scale size, with the same line-height generosity already used for Explainability's reasoning statements (`dashboard_spec.md` Section 11) rather than a cramped, terminal-style line-height.

**Syntax highlighting:** **not implemented in v1** — code blocks render in a single neutral foreground color, no per-token color differentiation. `[ASSUMPTION: introducing a syntax-highlighting palette would require several new colors with no clear mapping to the existing five-color state system (Blue/Purple/Cyan/Green/Amber/Red are all already semantically reserved), so the conservative choice is plain, single-color monospace text rather than inventing new colors under a different pretext.]` This keeps the page fully compliant with "no new colors" while still being entirely legible and copy-pasteable.

**Line numbers:** not shown — the examples on this page are short (request/response JSON bodies), and line numbers would add visual density without proportional value at this length.

---

# 13. Loading States

**Documentation content:** since Documentation/API content is largely static (not backend-data-dependent in the way Dashboard or History are), most navigation between Sub-Nav Rail items has **no loading state at all** — content is either bundled with the application or fetched once and cached, rendering instantly on selection, consistent with the 180ms crossfade being the only visible transition (Section 3).

**If content must be fetched remotely** (e.g., release notes pulled from a live source): a localized skeleton matching the destination content's approximate paragraph/heading shape appears within the Content Area only, reusing the exact skeleton philosophy already established system-wide (`dashboard_spec.md` Section 21) — never a full-page spinner.

**"Open API Docs" external link (Section 5):** no loading state is owned by this product at all — navigating to the externally-hosted FastAPI `/docs` interface is outside this application's loading-state responsibility once the new tab opens.

---

# 14. Empty States

Documentation/API has almost no applicable Empty State surface, since its content is authored/static rather than user-generated — similar in spirit to Settings' minimal Empty State footprint (`settings_spec.md` Section 15).

| Context | Icon concept | Message | Action |
|---|---|---|---|
| Search/Command Palette query with no matching documentation or endpoint results | search/magnifier | "No matches for '[query]'." *(reused verbatim from History's Empty State, history_spec.md Section 10)* | "Clear search" |

No other Empty State instance applies on this page — the Documentation Landing View (Section 4) is never itself an "empty" state, it is the page's intended default content.

---

# 15. Error States

| Context | Presentation | Recovery |
|---|---|---|
| Documentation content fails to load (remote-fetched content only, per Section 13) | Localized error card within the Content Area: calm icon + "We couldn't load this page." + Retry button. Sub-Nav Rail remains visible/functional. | Retry re-fetches just that item |
| Copy-to-clipboard fails (rare, platform/permission-level) | The copy icon briefly shows an inline error state (icon shifts to an alert glyph for the same 1.5s duration as the success state, no color change beyond the existing neutral system, per Section 12's no-new-colors constraint) `[ASSUMPTION: exact failure-state visual not defined elsewhere; kept deliberately minimal and non-alarming, consistent with the product's general error tone]` | User can manually select and copy the text as a fallback — no blocking behavior |
| External API Docs link fails to open (e.g., popup blocked) | Inline Alert directly beneath the "Open API Docs" button: "Couldn't open the API docs in a new tab. Check your browser's popup settings, or copy this link:" + a plain copyable URL | Manual navigation via the provided link |

Same governing rule as every prior specification: **an error never removes access to content already rendered.** A failed remote-fetch for one documentation item never affects the Sub-Nav Rail or any previously-loaded content.

---

# 16. Accessibility

- Full keyboard operability across the Sub-Nav Rail, every documentation link, every Code Block's copy button, and the "Open API Docs" action.
- Sub-Nav Rail behaves as the same tab-like listbox pattern already defined for Settings (`settings_spec.md` Section 17): Arrow Up/Down move between items when the rail has focus, Enter activates — group labels are skipped in this arrow-key traversal (they are not focusable, being non-interactive headings).
- Heading structure remains semantic and linear within each documentation item's Content Area (one H1 for the page, H2 for each item's major sections, e.g., Purpose/Request/Response for an endpoint) — no skipped levels, consistent with the system-wide rule.
- Code Blocks use a semantic `<pre>/<code>`-equivalent structure `[ASSUMPTION: stated at the semantic-intent level only, since this document does not specify HTML/markup, per the no-code constraint]` so screen readers announce them as distinct, monospaced content regions rather than plain paragraphs.
- The copy-to-clipboard action's state change (icon → checkmark) is announced via a brief `aria-live="polite"` message ("Copied to clipboard") — reusing the same live-region pattern already mandated for the AI Pipeline and Export button elsewhere in the product, rather than a screen-reader-invisible icon-only confirmation.
- HTTP method "badges" (Section 6) carry their method name as explicit text in the accessibility tree (already true by design, since Section 6 deliberately avoids color-only encoding) — no additional work needed beyond what the visual design already requires.
- Minimum 44px touch target on every interactive element, including the small Code Block copy icon buttons (the icon itself may render at 16px, but its tap/click target is enforced at 44px regardless, matching the same pattern already used for History's filter-chip remove controls).
- Contrast: WCAG AA minimum throughout, including the monospace Code Block text against its slightly-elevated neutral surface background (Section 12).

---

# 17. Responsive Behaviour

**Desktop/Laptop (≥1024px):** full two-column layout as specified — 240px Sub-Nav Rail + variable-width Content Area (Section 1).

**Tablet (768–1023px):** Sub-Nav Rail collapses into the identical horizontal scrollable tab-strip pattern already defined for Settings at this breakpoint (`settings_spec.md` Section 18), but with the three audience-group labels (User/Developer/API Reference) rendered as non-interactive small dividers within the scrollable strip rather than disappearing — preserving the grouping information even in the compressed tablet form. Content Area becomes full-width beneath it.

**Mobile (≤767px):** Sub-Nav Rail collapses into the same stacked-accordion pattern already defined for Settings (`settings_spec.md` Section 18), with the three audience groups rendered as non-collapsible group headers and their items as the accordion's collapsible entries beneath each — a two-level structure (static group label → collapsible item list) rather than Settings' flat one-level accordion, since Documentation's larger item count needs the extra grouping to remain scannable at mobile width.

**Code Blocks on mobile:** become horizontally scrollable within their own container rather than wrapping or shrinking text illegibly — reusing the exact "charts that cannot meaningfully compress become horizontally scrollable within their own card" principle already established for the Analysis Workspace's Fusion segments (`dashboard_spec.md` Section 23).

**API Reference tabular content (endpoint lists, response field definition lists):** reflows to a stacked, single-column card-per-entry presentation below tablet width, consistent with the system-wide "tables become cards" rule (`frontend_architecture.md` Section 3.5), even though this content uses a lighter-weight definition-list treatment rather than the full Table component on desktop (Section 6).

---

# 18. Component Usage

Drawn only from the locked taxonomy (components.md), plus the two explicitly-flagged additions from Section 12 (monospace font-stack addition, Code Block container) — no other new component types introduced.

| Component | Documentation/API usage |
|---|---|
| Card (Default) | Documentation Landing View's three audience cards; Report-List-style endpoint entries on mobile/tablet |
| Badge (neutral/outline variant) | HTTP method indicators (Section 6) |
| Button (Primary) | "Open API Docs" |
| Button (Ghost/Text) | "Explore →" links, "Clear search" |
| Icon Button | Code Block copy-to-clipboard control |
| Inline Alert | Authentication "not yet available" notice, SDK "not yet available" notice, popup-blocked fallback |
| Empty State pattern | Search/Command Palette no-results only |
| Skeleton | Remote-fetched documentation content only |
| Breadcrumb | Endpoint Detail view navigation context |
| Command Palette (extended) | Search, per Section 10 |
| Code Block *(flagged new element, Section 12)* | Request/Response Examples, SDK example |

No Table, Chart, Timeline, Heatmap, Risk Gauge, Fusion Engine, or any AI-visualization/clinical component appears anywhere on this page — Documentation/API is content and reference material, structurally unrelated to the clinical analysis surface, and must never borrow that visual vocabulary (mirroring the same discipline already applied to keep Settings' session rows free of "case list" styling, `settings_spec.md` Section 23).

---

# 19. Motion

All durations and easing draw from the single locked scale (Fast 120ms / Normal 220ms / Slow 350ms / Maximum 600ms hard ceiling; ease-out primary, ease-in-out secondary) — no new motion vocabulary introduced for this page.

| Interaction | Duration | Easing |
|---|---|---|
| Page entrance | 250ms, 12px upward translate | ease-out |
| Sub-Nav Rail item switch (Content Area crossfade) | 180ms | ease-in-out |
| Documentation Landing Card hover lift | 180ms, 4px lift + soft shadow | ease-out |
| Copy-to-clipboard icon → checkmark crossfade | 180ms in, holds 1.5s, 180ms out | ease-in-out |
| Tablet tab-strip underline movement | 180ms | ease-in-out |
| Mobile accordion group/item expand-collapse | 240ms height/opacity | ease-out |
| Inline Alert entrance (Authentication/SDK notices) | 250ms, 16px translateY | ease-out |

Nothing on this page introduces a new duration or easing curve; nothing loops except the copy-confirmation's brief, self-terminating hold state, which is not a loop but a timed, one-shot display consistent with the same non-looping principle applied everywhere else.

---

# 20. Keyboard Navigation

Explicit tab order, top to bottom, matching visual layout:

**Documentation Landing View:**
1. Each of the three audience Cards, in displayed order

**Any documentation item / Endpoint Detail view:**
1. Sub-Nav Rail items (Arrow Up/Down enhancement while the rail has focus, per Section 16; group labels are skipped)
2. Breadcrumb / Back link (Endpoint Detail view only)
3. In-content interactive elements top to bottom: Code Block copy buttons, "Open API Docs" button, any Inline Alert's implicit content (non-interactive text, skipped)

**Shortcuts specific to this page:** none beyond the global `⌘K`/`Ctrl+K` Command Palette (Section 10), which remains available identically here as on every other authenticated page. No page-specific single-key shortcuts are introduced, consistent with Reports' precedent of being "the simplest keyboard surface" where a page's content doesn't warrant additional shortcuts (`reports_spec.md` Section 18).

---

# 21. Interaction Rules

- **This page is entirely read-only** — no destructive actions, no data-modifying actions, no Confirmation dialogs exist anywhere on Documentation/API, matching the same read-only interaction model already established for History and Reports.
- **No executable code exists anywhere on this page** (Section 8) — every Code Block is display-and-copy only; this is a hard constraint restated here as an interaction rule, not just a content note, to prevent a future iteration from adding a "Run" button to the Code Block component without it being treated as a genuine architecture-level decision.
- **The externally-linked FastAPI `/docs`/`/redoc` interface is the sole location for live, executable API interaction** — this page documents and describes the API; it does not provide a parallel or competing way to call it.
- **Copy-to-clipboard never requires a confirmation step** — it is a fully reversible, zero-consequence action (the clipboard's previous contents are simply overwritten, a universally understood and easily-undone side effect), consistent with the proportional-friction principle applied everywhere else.
- **Search results from Documentation/API never navigate the user away from their current authenticated context unexpectedly** — selecting a documentation result from the Command Palette always lands on that specific item's Content Area view with full Shell context intact, never a bare/unstyled content dump.

---

# 22. Premium UX Details

- **Every "not yet available" surface (Authentication, SDKs) is stated candidly rather than hidden or faked** — extending the same honesty principle already established for Settings' Two-Factor row into the documentation layer itself; a competition reviewer or a real developer evaluating this product will read this candor as a sign of engineering maturity, not incompleteness.
- **The decision to link out to FastAPI's native `/docs`/`/redoc` rather than reimplementing a Swagger-style explorer** is itself a premium, restraint-driven choice — it avoids the extremely common failure mode of a custom-built API explorer that's subtly worse than the interactive tooling FastAPI already generates for free, and it keeps this product's own design system uncontaminated by a third-party UI library's visual language.
- **Code Blocks reuse the exact "next-darker neutral surface" elevation step already established for the Human Review Panel** — a small, easily-missed detail that means code content never needs a bespoke background treatment invented just for this page; it borrows meaning from an existing, already-legible distinction elsewhere in the product.
- **The three-way User/Developer/API Reference grouping mirrors the product's own persona structure** (ProjectVision.md's Primary/Secondary Users) almost exactly — the documentation's information architecture is a direct, legible reflection of who the product is actually built for, rather than an arbitrary content taxonomy.
- **Copy-to-clipboard feedback deliberately avoids a Toast** — using the lightest possible feedback mechanism proportional to an extremely frequent, low-stakes action, so a developer copying a dozen code snippets while integrating never experiences "Toast fatigue," a small but real perceived-quality detail for the Developer/Researcher personas specifically.
- **This entire specification's own transparency about its `[ASSUMPTION]`-marked gaps** is itself consistent with the product's ethic — just as the UI is honest with its users about unbuilt features, this handoff document is honest with its engineering team about undefined design-system territory, rather than quietly inventing decisions that should really be ratified at the system level first.

---

**End of Documentation / API Page High-Fidelity Specification.**
Ready for engineering handoff pending your review. This document, together with `frontend_architecture.md`, `landing_spec.md`, `dashboard_spec.md`, `history_spec.md`, `reports_spec.md`, `settings_spec.md`, and `new-analysis_spec.md`, now covers the authenticated Shell and seven of the product's core screens.

**Flagged for design-system ratification before implementation:** this document introduces a Code Block component and a monospace font-stack addition (Section 12) that do not exist in the current locked system. These should be reviewed and formally added to `components.md` / `design.md` rather than treated as settled by this page specification alone, since they will very likely be needed again outside Documentation/API.

Awaiting direction on the next screen to specify (About, or a return pass to resolve any of the flagged `[ASSUMPTION]` items across prior specifications).
