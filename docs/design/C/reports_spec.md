# Reports Page — High-Fidelity Design Specification
## Mental Health Safety Analyzer · Phase 3, Screen 4

**Document type:** Production design specification
**Target path:** `docs/design/reports_spec.md`
**Audience:** Senior Frontend Engineer / Design Engineer implementation team
**Status:** Ready for build, pending final review
**Primary sources:** ProjectVision.md, design.md, frontend_requirements.md, components.md, frontend_architecture.md, UX-Wireframe-Specification.md, landing_spec.md, dashboard_spec.md, history_spec.md

This document introduces **no new tokens, components, colors, spacing values, radii, shadows, or motion patterns.** Every element below is drawn from the system already locked across the prior specifications. Where Reports reuses a Dashboard component verbatim — most notably the **Clinical Summary Card**, which is architecturally defined in `frontend_architecture.md` Section 5.4 as belonging to both the Analysis Template's closing strip and the Reports Template's hero — this document states that reuse explicitly rather than re-describing the component from scratch.

No code, HTML, CSS, or React is included. All measurements and behaviors are specified precisely enough for direct implementation.

---

# 1. Overall Layout

Reports is architected per `frontend_architecture.md` Section 5.4 as the one documented exception to the Shell's standard 1440px Main Content Area — it uses a **narrower reading-width container**, since its content is document-style and meant to be read linearly, not scanned as a dashboard. This is the single largest structural difference between Reports and every other authenticated page specified so far.

```
┌─────────────────────────────────────────────────────────────┐
│ [ Breadcrumb: Reports  /  Conversation #4821 ]  (Detail view only) │
├─────────────────────────────────────────────────────────────┤
│                                                                  │
│         REPORT SELECTOR (conditional — only if >1 report exists  │
│         for the current context)                                  │
│                                                                  │
│         CLINICAL SUMMARY CARD  (hero, reused verbatim from        │
│         the Dashboard/Analysis Workspace component)                │
│                                                                  │
│         EXPLAINABILITY SECTION  (condensed, reading-oriented)      │
│                                                                  │
│         HUMAN NOTES SECTION                                        │
│                                                                  │
│         [ Export ]  [ Print ]  [ Share ]  — actions row            │
│                                                                  │
└─────────────────────────────────────────────────────────────┘
```

**Container width:** ~840px max-width, centered within the standard Shell (Sidebar + Top Navigation unchanged) — narrower than the 1440px used everywhere else, per the documented exception. Outer margins otherwise follow the standard system: on viewports where 840px plus standard margins doesn't fill the available Main Content Area, the extra space is simply left as whitespace on either side, not redistributed into wider content — reading-width is a hard constraint, not a minimum.

**Two states of this page:** a **List state** (Section 3), reached from the Sidebar's "Reports" item directly, and a **Detail state** (Section 4), reached either from the List or via the "Export Report" action inside the Analysis Workspace's closing strip. Both states share the Shell and the narrow container; the List state does not use the Clinical Summary Card at all (that only appears once a specific report is open).

---

# 2. Visual Hierarchy

Reports inverts the density priorities used everywhere else in the product. Dashboard and History are **scanning tools** — dense, tabular, optimized for comparing many rows quickly. Reports is a **reading tool** — the one place in the application where the product deliberately slows down and gives content room to breathe, because its explicit design intent (per dashboard_spec.md's original Clinical Summary Card definition) is to be "readable within one minute" and "the hand this to a colleague artifact."

Hierarchy, in order:
1. **Clinical Summary Card** — the hero, per `frontend_architecture.md` Section 5.4. Nothing on this page is permitted to be visually louder.
2. **Explainability Section** — subordinate to the Summary but still prominent; this is where a colleague who wants more than the one-minute version goes next.
3. **Human Notes Section** — present, clearly attributed, but visually quieter than either of the above — it is supporting context, not the primary artifact.
4. **Export/Print/Share actions** — smallest visual footprint on the page relative to their importance, deliberately: this is a reading page first, an action page second. The actions row never floats or sticks; it sits in the page's natural reading flow directly beneath Human Notes.

No chart, timeline, heatmap, or Fusion Engine visualization appears anywhere on Reports. This is a deliberate omission, not an oversight — those are Tier 2/3 investigative tools that belong to the Analysis Workspace; Reports is the Tier 1 output *of* that investigation, meant to be read in under a minute exactly as specified. Reintroducing dense visualizations here would violate the page's entire reason for existing.

---

# 3. Report List

Reached directly from the Sidebar's "Reports" item. Structurally similar to History's Conversation List (Section 3 of history_spec.md) but simplified, since Reports' list only shows conversations that have a completed, exportable report — not every conversation in the system.

**Layout:** single-column list, not a table — this list is comparatively short (reports are generated only after analysis completes and a professional has engaged with the case) and the reading-width container makes a multi-column table layout impractical here regardless.

**List item structure, per row (72px height, 20px horizontal padding, 16px vertical padding):**
```
[ Conversation label ]                              [ Risk Badge ]
[ Generated date · muted caption ]                   [ chevron ]
```

Each item is a Default Card, stacked with 12px gap between items (matching History's mobile card-list spacing — Reports uses this density on all breakpoints, since it's never rendered as a dense table, unlike History). Risk Badge follows the identical color/icon/label rule used everywhere in the product (Section 7 of history_spec.md, unchanged). Click anywhere on the item → Detail state for that report.

**Sorting:** reverse-chronological by default (most recently generated first), no additional sort or filter controls — Reports' list is intentionally simpler than History's, since filtering by risk/status is History's job; a professional arriving here already knows they want "the reports," not "a filtered subset of reports." If this list grows long enough to need filtering in a future iteration, that is a Section 18 (Open Questions)-class decision to raise later, not one to solve preemptively here.

**Pagination:** identical mechanism to History and the Dashboard Queue (20 items per page, Previous/Next, bottom-right/bottom-left placement) — reused verbatim for consistency, not reinvented.

---

# 4. Report Detail View

The Detail view is what most of this document specifies. Reached by clicking a Report List item, or directly via the "Export Report" action in the Analysis Workspace's closing strip (in which case the Breadcrumb reads `Reports / Conversation #4821` and a "Back to Conversation" link — distinct from "Back to Reports" — is also available, since the professional may have arrived from either direction).

**Structure, top to bottom, within the 840px container:**
```
[ Breadcrumb + Back link ]
[ Report Selector — conditional, see below ]
[ Clinical Summary Card — hero ]
[ Explainability Section — condensed ]
[ Human Notes Section ]
[ Export / Print / Share action row ]
```

**Report Selector:** only rendered if more than one report exists for the current conversation (e.g., an initial analysis report and a later re-analysis report, once re-analysis/versioning exists per Open Question 18.7 of `frontend_architecture.md`). When present, it is a simple Select control directly beneath the breadcrumb, labeled "Report version," defaulting to the most recent. This control is deliberately unobtrusive — a single dropdown, not a tab bar — since multi-version reports are the exception, not the common case, in the current product scope.

---

# 5. Export Actions

Three actions, presented as a single row of buttons directly beneath Human Notes: **Export (PDF)**, **Print**, **Share**.

- **Export (PDF):** Primary Button. Triggers PDF generation (Section 6). Because generation may take a moment, the button enters a loading sub-state on click — label replaced by an inline spinner, button retains its width (identical pattern to the Settings Save button loading state already defined in `dashboard_spec.md` Section 21) — then either downloads the file automatically or reveals a small inline confirmation ("Report exported.") with a Toast, whichever the underlying platform capability supports; the button never appears to "hang" with no feedback.
- **Print:** Secondary Button. Triggers the browser's native print dialog against the Print Layout (Section 7) — not a custom in-app print preview modal, since the Print Layout itself *is* the preview once correctly styled.
- **Share:** Ghost Button. Opens a small Popover (not a modal — consistent with the system's rule that Popovers are for lightweight, non-blocking content) containing a copyable read-only link and a one-line note: "Anyone with this link and appropriate access can view this report." (Full access-control behavior is contingent on the authentication system existing — see Section 18.2 of `frontend_architecture.md`'s Open Questions; until then, this action is present in the UI but should be treated as a placeholder consistent with the Human Review Panel's own documented non-persistence caveat.)

Button order (left to right): Export, Print, Share — matching the frequency-of-use priority a professional is expected to have (exporting a durable copy is the primary job of this page; sharing a link is the least common of the three given the current lack of a real multi-user system).

---

# 6. PDF Layout

The exported PDF is a **print-optimized rendering of the Clinical Summary Card plus Explainability Section plus Human Notes** — not a screenshot of the on-screen page, and not a separate document designed independently. Same content, same hierarchy, same typographic voice, restyled for a fixed-page medium.

**Page structure:**
- **Header (every page):** small wordmark + "Mental Health Safety Analyzer" left-aligned, generation date + Conversation ID right-aligned, thin 1px hairline rule beneath — quiet, consistent, never a full-color banner.
- **Body:** Clinical Summary content first, in the same section order defined in Section 9 (AI Summary Card) below; Explainability statements follow, formatted as the same short, individually-spaced natural-language lines used on-screen — reading room is preserved in print exactly as it is on-screen, since cramming reduces exactly the "readable in one minute" quality the whole page exists to deliver.
- **Footer (every page):** page number ("Page 1 of 2"), and a single fixed disclaimer line in caption size: "AI-generated decision support. Not a diagnostic tool. Reviewed by [Professional Name / Pending Review]." — this line is non-optional and appears on every exported PDF regardless of content length, directly enforcing the non-diagnostic language principle from `frontend_requirements.md` at the one point this product's output leaves the application entirely.

**Color in PDF:** Risk badges retain their color + icon + text treatment (PDF export does not degrade to grayscale), since color-coded risk communication is exactly as important in a printed/shared document as on-screen; however, saturation is capped slightly lower than the on-screen token to account for typical print rendering, without introducing a new color — this is a rendering-profile adjustment, not a new design token.

**Typography in PDF:** Inter (or the nearest print-safe fallback already defined in the system's font stack — Segoe UI/Helvetica/Arial), tabular figures preserved for Confidence and any numeric values. No new type scale is introduced; the PDF uses the same Body/Body-large/Caption roles already defined, adjusted only in absolute point size for print legibility.

---

# 7. Print Layout

The browser print output and the PDF export (Section 6) are **the same layout**, styled once and reused for both — this is a deliberate implementation efficiency and consistency guarantee: a professional who prints directly from the browser and one who downloads a PDF should receive visually identical documents.

**Print-specific reflow rules** (per `frontend_architecture.md` Section 2.4's documented exception and `dashboard_spec.md` Section 19's print note, both restated and finalized here):
- Sidebar, Top Navigation, and Critical Alert Banner are entirely omitted from print output — never printed, regardless of whether they were visible on-screen at the time of printing.
- The Clinical Summary Card expands to full print-page width (accounting for standard page margins), rather than retaining its on-screen 840px-within-1440px-Shell proportions.
- Interactive-only elements (hover tooltips, the Report Selector dropdown, Export/Print/Share buttons themselves) are omitted from print output — a printed page has no use for a button.
- Page-break rules: the Clinical Summary Card's sections (Section 9) never break mid-section across a page boundary — if a section doesn't fit in remaining page space, it starts fresh on the next page rather than splitting awkwardly.

---

# 8. Explainability Section

A **condensed, reading-oriented restatement** of the Analysis Workspace's full Explainability Workspace (dashboard_spec.md Section 11) — not a re-implementation of that component, but a deliberately simplified subset appropriate for a linear-reading document.

**Included here:** Detected Signals (as a simple text-preceded list, not clickable chips — chips imply interactivity this page's export/print context can't support), Reasoning statements (identical natural-language style and one-per-line spacing as the Analysis Workspace), Confidence (restated with its one-line contextual explanation).

**Explicitly excluded here:** the AI Reason Graph. The Reason Graph is a Tier 3, deliberately-gated, interactive investigative tool (per `frontend_architecture.md` Section 1.5) — it has no printable, static equivalent that wouldn't misrepresent it as more conclusive than intended once removed from its interactive, collapsed-by-default context. Reports never includes it, on-screen or exported, in any form. This is a firm rule, not a simplification of convenience.

**On-screen styling:** same generous line-height, one-statement-per-block treatment already established for the Analysis Workspace's Explainability Panel — this page never compresses reasoning statements into a denser paragraph just because it's positioned as a "summary" page; readability is preserved exactly, only the interactive/technical layer (Reason Graph, clickable chip-to-Viewer jumps) is removed since there's no Conversation Viewer on this page to jump to.

---

# 9. AI Summary Card

This section describes the **Clinical Summary Card** as it appears on Reports — the identical component already fully specified in `dashboard_spec.md` Section 17, reused here as this page's hero with zero visual or structural modification, per the explicit reuse instruction in `frontend_architecture.md` Section 5.4 ("reused verbatim — not a re-implementation").

**Sections, in fixed order (unchanged from the original definition):**
1. Conversation Summary (1–2 lines)
2. Emotional Trend (1 line + small trend icon)
3. Main Concerns (short bullet-style chip list)
4. Detected Risks (restates the Risk badge)
5. Recommended Human Review (restates the AI's recommendation)
6. Time Saved estimate (quiet microcopy: "Estimated review time saved: ~14 minutes")

**The one contextual difference on Reports versus its appearance in the Analysis Workspace:** here, the card is not followed immediately by Export/Print actions sitting directly adjacent to it (as it is in the Analysis Workspace's closing strip) — on Reports, it's followed by the Explainability and Human Notes sections first, with Export/Print/Share relocated to the page's true closing action row (Section 5). This reflects Reports' identity as a full document with the Summary as its lead section, rather than the Analysis Workspace's identity as a workspace with the Summary as a closing recap.

---

# 10. Human Notes Section

Displays the professional's own clinical notes, entered via the Human Review Panel during the Analysis Workspace session (dashboard_spec.md Section 16), read-only on this page.

**Structure:**
```
"Clinical Notes"  — H2-scale section title
[ Reviewer name/attribution ]  ·  [ Timestamp ]  — caption, muted
[ Note body text — body scale, preserved exactly as entered, no truncation ]

Review Status: [ Badge — Reviewed / Escalated / Pending ]
```

**If no notes exist yet** (report generated before any human review action was taken): this section shows a quiet, non-alarming inline state — not the full Empty State pattern (that's reserved for zone/page-level absence, and this is a sub-section, matching the same distinction already drawn for component-level vs. full-zone empty states in `dashboard_spec.md` Section 20) — simply the muted line: "No clinical notes have been added to this case yet." with no call-to-action, since adding a note is an action that belongs to the Analysis Workspace, not to this read-only reading page.

**Visual weight:** deliberately quieter than the Clinical Summary Card and Explainability Section — smaller section title scale relative to the others, no card-elevation treatment (renders as plain content within the page's reading flow rather than as its own bordered Card), reinforcing that this is supporting/attributed context appended to the AI's own output, never merged with it — the same "AI Recommendation and Human Decision are never the same object" principle from the Human Review Panel, carried through into this read-only document form.

---

# 11. Loading States

**Report List load:** skeleton list matching the real item count/shape (Section 3's card structure) — identical skeleton philosophy already used for History and Dashboard.

**Report Detail load:** skeleton for the Clinical Summary Card's section shapes (six skeleton blocks matching the six defined sections), followed by two skeleton text blocks for Explainability and Human Notes — never a generic full-page spinner, consistent with the system-wide rule.

**Export (PDF) generation:** handled entirely within the Export button's own loading sub-state (Section 5) — a small, componentized spinner-in-button, not a page-level or modal loading state, since PDF generation is expected to be a short, bounded operation and doesn't warrant interrupting the rest of the page.

**Print trigger:** no custom loading state — this defers entirely to the browser's native print dialog, which has its own standard loading/rendering behavior outside this application's control.

---

# 12. Empty States

Follows the universal Empty State system exactly (`frontend_architecture.md` Section 8) — no illustration, muted line-icon, one sentence, optional elaboration, exactly one action.

| Context | Icon concept | Message | Action |
|---|---|---|---|
| No reports exist yet (Report List, new professional) | document | "No reports yet — reports are generated after an analysis completes." | "Go to Dashboard" |
| Report List, all reports filtered/searched away *(only relevant if List filtering is added in a future iteration per Section 3's note)* | — | Not applicable in current scope | — |

Reports has the simplest Empty State footprint of any page specified so far, a direct consequence of Section 3's decision to keep the Report List unfiltered — there is only one true empty condition to design for.

---

# 13. Error States

| Context | Presentation | Recovery |
|---|---|---|
| Report List fails to load | Full-region error card replacing the list: calm icon + "We couldn't load your reports." + Retry button | Retry re-fetches |
| Report Detail fails to load | Clinical Summary Card area shows a card-level error state: "This report couldn't be loaded. Please try again." + Retry button; Breadcrumb and Report Selector (if applicable) remain visible/functional | Retry |
| PDF export fails | Export button returns to its default state; a small inline error notice appears directly beneath the action row: "Export failed — please try again." + the button itself remains the retry mechanism (no separate retry control needed for a single-button action) | Re-click Export |
| Print trigger fails (rare, platform-level) | Same inline notice pattern as PDF export failure, scoped to the Print button | Re-click Print |
| Share link generation fails | Popover remains open, shows an inline error in place of the link field: "Couldn't generate a link right now." + Retry text-link within the Popover | Retry within the Popover, no need to reopen it |

Same governing rule as every other page in this system: **an error never removes access to data already rendered.** A failed export attempt must never affect the Clinical Summary Card, Explainability, or Human Notes content already displayed on-screen.

---

# 14. Accessibility

- Full keyboard operability across the Report List, Report Selector, and all three export actions.
- Heading structure remains semantic and linear: one H1 (page title, "Reports" on the List state or the Conversation label on Detail state), H2 for each major section (Clinical Summary's implicit title, "Explainability," "Clinical Notes") — no skipped levels, matching the system-wide rule already enforced on Landing and Dashboard.
- The Export button's loading sub-state is announced via `aria-live="polite"` ("Generating PDF…" then "Report exported.") — consistent with the Pipeline's own live-region requirement elsewhere in the system; any button-embedded async operation in this product announces its state changes, not just the Pipeline specifically.
- The Share Popover traps focus while open and returns focus to the Share button on close, matching the Command Palette / Confirmation dialog / Date Picker focus-management pattern already established system-wide.
- Risk Badge, Review Status Badge, and Confidence all carry explicit text in the accessibility tree on both the List and Detail views — never color alone.
- Print/PDF output itself: the PDF is generated with proper document structure (tagged headings, reading order matching visual order) so it remains navigable by assistive technology once downloaded, not merely a flattened image of the page.
- Minimum 44px touch target on every interactive element at every breakpoint, including Report List items and the three export action buttons.
- Contrast: WCAG AA minimum throughout, including within the PDF's slightly print-adjusted color profile (Section 6) — the adjustment is verified to remain AA-compliant, not simply visually similar.

---

# 15. Responsive Behaviour

**Desktop / Laptop (≥1024px):** full layout as specified — 840px reading-width container centered within the Shell, Export/Print/Share as a horizontal button row.

**Tablet (768–1023px):** reading-width container relaxes to fill available width minus standard tablet outer margins (40px) rather than staying rigidly at 840px if that would leave excessive whitespace at this breakpoint — this is the one page where the container width itself is fluid within a range, rather than fixed, since forcing a rigid 840px on a narrower tablet viewport would fight the available space rather than use it sensibly. Export/Print/Share row remains horizontal.

**Mobile (≤767px):** container becomes full-width minus the standard 20px outer margin. Export/Print/Share buttons stack: Export (Primary) remains full-width at top of the action row, Print and Secondary/Ghost actions arrange side-by-side beneath it — matching the general system-wide pattern of Primary actions taking visual priority and full width on mobile (consistent with the New Analysis submission page's sticky-bottom Primary button treatment referenced in the Phase 1 wireframe spec, though Reports' actions are not sticky, since this page's action row is a natural closing element, not a persistent submission control).

Report List items (Section 3) require no responsive transformation — they are already single-column cards at every breakpoint, unlike the Dashboard Queue and History's table-to-card conversion, since Reports never uses a table layout in the first place.

---

# 16. Component Usage

Drawn only from the locked taxonomy (components.md) — no new component types introduced for this page.

| Component | Reports usage |
|---|---|
| Card (Default) | Report List items |
| Card (reused, Clinical Summary variant) | AI Summary / Clinical Summary Card — identical instance to its Analysis Workspace usage |
| Badge | Risk level (List and Detail), Review Status (Human Notes section) |
| Button (Primary) | Export (PDF) |
| Button (Secondary) | Print |
| Button (Ghost) | Share, "Go to Dashboard" empty-state action |
| Select | Report Selector (multi-version case) |
| Popover | Share link |
| Toast | "Report exported" confirmation (where platform supports it) |
| Empty State pattern | No reports yet |
| Skeleton | List and Detail load states |
| Tooltip | Not used on this page beyond any inherited from the reused Clinical Summary Card component itself |
| Breadcrumb | Detail view navigation context |

---

# 17. Motion

All durations and easing draw from the single locked scale (Fast 120ms / Normal 220ms / Slow 350ms / Maximum 600ms hard ceiling; ease-out primary, ease-in-out secondary) — no new motion vocabulary introduced.

| Interaction | Duration | Easing |
|---|---|---|
| Page entrance (List or Detail) | 250ms, 12px upward translate | ease-out |
| Report List item hover lift | 180ms, 4px lift + soft shadow | ease-out |
| Report List item press | 120ms scale to 0.98 | ease-out |
| List-to-Detail navigation transition | 250ms crossfade (matches standard page transition — Reports does not introduce a special "document opening" animation, keeping the product's motion vocabulary singular) | ease-out |
| Export button loading-state transition (label ↔ spinner) | 180ms crossfade | ease-in-out |
| Share Popover open/close | 220ms fade + scale (0.96→1) | ease-out |
| Toast entrance/exit | 220ms entrance / 180ms exit (exit faster, per the global rule) | ease-out / ease-in |
| Report Selector dropdown open/close | 220ms height/opacity | ease-out |

No animation on this page exceeds the 600ms Maximum tier; nothing loops. The Explainability statements on this page do **not** replay their sequential first-reveal animation (used in the live Analysis Workspace) — on Reports, all Explainability content renders in its final, static state immediately on load, since this page's purpose is fast, calm reading, not a re-creation of the "AI is reasoning" moment that animation is reserved for elsewhere.

---

# 18. Keyboard Navigation

Explicit tab order, top to bottom, matching visual layout:

**List state:**
1. Each Report List item, in displayed order
2. Pagination Previous → page indicator (non-interactive) → Next

**Detail state:**
1. Breadcrumb / Back link
2. Report Selector (if present)
3. Clinical Summary Card — no interactive sub-elements (this card is read-only display, per its original definition)
4. Explainability Section — no interactive sub-elements on this page (chips are non-clickable here, per Section 8)
5. Human Notes Section — no interactive sub-elements (read-only)
6. Export → Print → Share, in that order

**Shortcuts specific to this page:**
- `Escape`, when the Share Popover is open, closes it and returns focus to the Share button.
- No page-specific single-key shortcuts beyond the global `⌘K`/`Ctrl+K` Command Palette, which remains available identically here as on every other authenticated page. Reports is intentionally the simplest keyboard surface in the product — a reading page has no need for the row-navigation arrow-key enhancement used on History's list, since there's no dense table here to traverse.

---

# 19. Interaction Rules

- **This page is read-only with respect to case data**, exactly like History (Section 18 of history_spec.md) — no Confirmation dialogs exist anywhere on Reports, for the same reason: nothing here can alter a clinical decision. The only "actions" are Export, Print, and Share, none of which are destructive or reversible-decision-affecting.
- Clicking a Report List item always navigates to the Detail state — there is no inline preview/expand-in-place interaction, keeping this page's interaction model as simple as History's row-click pattern.
- The Report Selector (multi-version case) changes which report's content is displayed but never triggers a full page navigation or URL change beyond a query parameter — switching versions should feel instantaneous (180ms crossfade, matching the Analysis Workspace's tab-switch treatment) rather than a reload.
- Export, Print, and Share are independent, non-exclusive actions — a professional can Export and then Print the same report without either action disabling or resetting the other; none of the three actions modify the underlying report data.
- The "Back to Conversation" link (when Detail is reached from the Analysis Workspace) and the "Back to Reports" link (when reached from the List) are never both shown simultaneously — the Breadcrumb's own trailing segment already implies "Back to Reports" via the "Reports /" root, so only the conversation-specific back link is added as a supplementary affordance when relevant, avoiding redundant navigation controls competing for the same intent.

---

# 20. Premium UX Details

- **The PDF and Print layouts are the same styled output, generated once** — rather than maintaining two separately-designed print paths, this guarantees a professional never receives visually inconsistent documents depending on which export method they used, a subtle but real trust signal for a clinical tool whose outputs may be filed, shared, or referenced later.
- **The mandatory non-diagnostic disclaimer footer on every exported page** (Section 6) — small, quiet, consistent — is the single most important "premium-through-responsibility" detail on this entire page: it demonstrates the product's ethical stance travels with its output, not just its interface, which is exactly the kind of detail an international competition jury evaluating a clinical AI tool would notice and value.
- **The Clinical Summary Card's zero-modification reuse** between the Analysis Workspace and Reports — a small architectural discipline, invisible to the end user, but the reason the product never feels like it has "two versions of the same information that don't quite match."
- **Explainability's animation is deliberately turned off on this page** (Section 17) — recognizing that the "AI is reasoning" motion belongs to the live investigative moment, and repeating it on a page whose entire purpose is calm, fast reading would be motion for its own sake, which the product's own motion philosophy explicitly forbids.
- **The Report Selector's crossfade-only version switching** (no reload feel) — a small detail that makes multi-version comparison (once that future capability exists) feel like flipping between pages of one document rather than navigating between separate records, reinforcing Reports' identity as a document, not a database view.
- **Reading-width container as a genuine content decision, not a cosmetic one** — by constraining line length to ~840px, every paragraph of AI reasoning and every clinical note is easier to read than it would be at full dashboard width; this is the one place in the entire product where a layout choice directly serves comprehension speed, which is the product's own stated top-line success metric ("understand a conversation within a few minutes").

---

**End of Reports Page High-Fidelity Specification.**
Ready for engineering handoff pending your review. This document, together with `frontend_architecture.md`, `landing_spec.md`, `dashboard_spec.md`, and `history_spec.md`, now covers the authenticated Shell and four of the product's core screens. Awaiting direction on the next screen to specify (Settings, Documentation/API, or New Analysis submission).
