# New Analysis Page — High-Fidelity Design Specification
## Mental Health Safety Analyzer · Phase 3, Screen 6

**Document type:** Production design specification
**Target path:** `docs/design/new-analysis_spec.md`
**Audience:** Senior Frontend Engineer / Design Engineer implementation team
**Status:** Ready for build, pending final review
**Primary sources:** ProjectVision.md, design.md, frontend_requirements.md, components.md, frontend_architecture.md, UX-Wireframe-Specification.md, landing_spec.md, dashboard_spec.md, history_spec.md, reports_spec.md, settings_spec.md

This document introduces **no new design tokens, colors, spacing values, typography scales, radii, shadows, motion timings, or component types.** Every element below reuses the system already locked across the prior specifications. Where this page needs a pattern that already exists elsewhere in the product — the AI Pipeline Progress pattern, the Privacy Guard framing, the Confirmation dialog, the Empty/Loading/Error systems — this document states explicitly that it is **reused**, not redefined, and cites the originating section.

No code, HTML, CSS, or React is included. All measurements and behaviors are specified precisely enough for direct implementation.

> **Implementation-assumption marking:** per instruction, anywhere this document must fill a gap the source documentation left open (e.g., exact accepted file formats, maximum file size, maximum character count), the value is explicitly flagged `[ASSUMPTION]` rather than presented as if it were already specified elsewhere. These flagged values should be confirmed against the real backend/API contract before implementation and are not to be treated as locked.

---

# 1. Overall Layout

New Analysis is reached from the Sidebar's "New Analysis" item (frontend_architecture.md Section 2.2) or from the Dashboard's Pending/empty-state "Start New Analysis" actions (dashboard_spec.md Sections 7, 20). It is a **single-purpose submission template** — not a collection template (Section 4.7) and not a Top/Middle/Bottom zoned Analysis Template (Section 4.6), since there is no record yet to reason about. It is architecturally its own, minimal template, sitting inside the standard Shell exactly like every other authenticated page (Top Navigation, Sidebar, conditional Critical Alert Banner — all **reused**, unchanged, per frontend_architecture.md Section 2).

```
┌─────────────────────────────────────────────────────────────┐
│ [ Page heading: "New Analysis" — H1 ]                            │
│ [ muted subline: "Submit a conversation for AI-assisted safety   │
│   analysis." ]                                                    │
├─────────────────────────────────────────────────────────────┤
│                                                                  │
│         SUBMISSION ZONE (centered, reading-width container)        │
│           [ Input method toggle: Paste Text | Upload File ]         │
│           [ Active input surface — Section 4 or 5 ]                  │
│           [ Privacy Notice strip — Section 9 ]                        │
│           [ Primary Button: Analyze Conversation ]                     │
│                                                                  │
└─────────────────────────────────────────────────────────────┘
```

**Container width:** ~720px max-width, centered — reusing the exact reading/form-width constraint already established for Settings (settings_spec.md Section 1), since this is a single-task form, not a scanning surface. This is a deliberate, explicit reuse of an existing width token (720px), not a new value introduced for this page.

**Vertical rhythm:** page top padding 48px below Shell chrome (identical to Dashboard's Main Content Area top padding, dashboard_spec.md Section 7); 32px gap between the input-method toggle, the active input surface, the Privacy Notice, and the Primary Button — matching the "zone-to-zone gap" spacing value (32px) already defined system-wide, applied here at the component-group level since this page has no zones of its own.

**One hero, per the system-wide rule:** the active input surface (Paste Text area or File Upload dropzone) is this page's single hero component — everything else (heading, toggle, privacy notice, button) is supporting.

---

# 2. Information Architecture

This page has exactly one job: get a conversation into the system with minimal friction while making the privacy guarantee visible *before* submission, per ProjectVision.md's Privacy First principle and the UX-Wireframe-Specification's original framing of this screen ("clearly show the professional privacy is respected before analysis begins").

No secondary content exists on this page — no recent-submissions list, no tips carousel, no promotional content. This is intentional: New Analysis is a **task page**, not a hub, and adding secondary content here would violate the "one hero per screen" and anti-clutter principles applied everywhere else in the product. A professional who wants to see past submissions uses History (history_spec.md) or Dashboard (dashboard_spec.md), not this page.

---

# 3. Conversation Input Methods

Two mutually exclusive input methods, selected via a two-option Segmented Control **(reused from Settings' Theme control, settings_spec.md Section 6 — same component, same visual treatment, not a new control type)**:

```
[ Paste Text ]  [ Upload File ]
```

- Default selection: **Paste Text** — the lower-friction, zero-dependency path, consistent with "Get a conversation into the system with minimal friction" being this page's stated purpose.
- Selecting an option swaps the active input surface beneath it via the standard 180ms crossfade already used for tab/section switching throughout the product (dashboard_spec.md Section 9's tab-crossfade, settings_spec.md Section 3's section-switch crossfade) — container height adjusts smoothly to the new surface's content, never a hard snap.
- Switching input methods after content has been entered in the other method **preserves that content in memory** (not discarded) until the professional submits or navigates away — switching back restores it exactly as left. This avoids the frustrating pattern of losing work by exploring the other input option.

---

# 4. Paste Text Workflow

**Component:** a large Textarea input **(reused from the Inputs category in components.md — "Textarea" is already part of the locked taxonomy; no new input variant is introduced)**.

**Layout:**
```
[ Textarea, min-height ~320px, full width of the 720px container ]
  placeholder: "Paste the conversation here — one message per line,
  or in the format it was exported."

[ character/message count, caption-scale, bottom-right of the textarea:
  "0 characters" ]
```

**Behavior:**
- Textarea auto-grows with content up to a maximum height **[ASSUMPTION: 640px]**, beyond which it becomes internally scrollable — this prevents the page itself from growing unboundedly long while still letting the professional see a reasonable amount of pasted content at once.
- No formatting is imposed on paste — the system accepts raw pasted text and lets the backend's text-processing stage (per pipeline.md's "Text Preparation Stage") handle normalization; the frontend does not attempt to parse speaker labels or timestamps client-side.
- Character count updates live as the professional types or pastes, using the same tabular-figure typographic treatment used for every other numeric display in the product (dashboard_spec.md Section 30).

---

# 5. File Upload Workflow

**Component:** File Upload **(reused from the Inputs category in components.md — already part of the locked taxonomy)**, presented as a dropzone-style surface when Upload File is the active input method.

**Layout, at rest (no file selected):**
```
┌───────────────────────────────────────────┐
│         [ small muted line-icon: upload/file ]  │
│         "Drag and drop a file here"               │
│         "or click to browse"  ← Ghost Button link    │
│         [ muted caption: accepted format note ]       │
└───────────────────────────────────────────┘
```

Dropzone uses the same Card radius and border treatment as a Default Card (16–20px radius, 1px neutral border) but with a **dashed** border variant to signal "drop target" — this is the one documented deviation from the standard solid-border Card treatment anywhere in the product, and it is justified specifically because a dashed border is a near-universal, low-decoration convention for drop targets, not a stylistic flourish.

**Layout, file selected:**
```
┌───────────────────────────────────────────┐
│  [ file-type icon ]  conversation-export.txt        │
│                       128 KB                          [ × remove ]│
└───────────────────────────────────────────┘
```
Solid border returns once a file is present (the dashed treatment is exclusively an empty-dropzone affordance). The remove ("×") control returns the dropzone to its at-rest state; a new file can then be dropped or browsed.

---

# 6. Drag & Drop Behaviour

- **Drag-over state:** dropzone border shifts to Primary Blue (from neutral), background tints very subtly with a low-opacity Blue fill — the standard "active/focus" color association already used for interactive states system-wide, not a new color pairing.
- **Drop:** file is accepted immediately, dropzone transitions to the "file selected" layout (Section 5) with the standard 250ms Card-entrance crossfade (dashboard_spec.md Section 33).
- **Invalid file dropped** (wrong type or over size limit): dropzone border shifts to the Danger/Red state color instead of Blue during drag-over once the browser's drag event exposes the file type, and on drop shows an inline error beneath the dropzone (Section 8) rather than silently rejecting the file.
- **Drag anywhere on the page while Paste Text is the active method:** dropping a file automatically switches the input-method toggle to Upload File and processes the drop — this is the one place this page infers intent rather than requiring an explicit toggle click first, justified because a professional dragging a file onto the page has already expressed clear, unambiguous intent.
- No drag-and-drop reordering, multi-file batching, or folder-drop support exists on this page — a single conversation, a single file, consistent with the one-conversation-per-analysis model already assumed throughout History and Reports.

---

# 7. Supported File Types

`[ASSUMPTION — not specified in source documentation; confirm against backend capability before implementation]`

Plain-text and common export formats only, consistent with the pipeline's text-based processing model (pipeline.md's Input Processing stage describes "Anonymous chat messages, Conversation history, Text-based interactions" as supported inputs, with no mention of binary or rich-document formats):

- `.txt` (plain text)
- `.csv` (structured export)
- `.json` (structured export)

Maximum file size: **[ASSUMPTION: 10 MB]**. No PDF, Word, or image file support is implied anywhere in the source documentation, so none is included here — introducing it would require OCR/document-parsing capability not described in architecture.md or pipeline.md.

The accepted-format caption beneath the dropzone (Section 5) states this plainly: "Accepts .txt, .csv, or .json — up to 10 MB."

---

# 8. Validation Rules

Validation is **inline, before submission**, per the system-wide rule already established (frontend_architecture.md Section 10: "never a blocking modal for form validation").

| Condition | Validation behavior |
|---|---|
| Empty Textarea, Paste Text active, submit attempted | Primary Button remains disabled until content exists — this is a disabled-state prevention, not an error message, consistent with components.md's Button disabled-state rules |
| Textarea contains only whitespace | Treated as empty — Button stays disabled |
| No file selected, Upload File active, submit attempted | Same disabled-Button treatment as the empty Textarea case |
| File exceeds size limit | Inline error beneath the dropzone: "File is too large. Maximum size is 10 MB." — file is rejected, dropzone returns to at-rest state |
| File is an unsupported type | Inline error beneath the dropzone: "Unsupported file type. Please upload a .txt, .csv, or .json file." |
| Conversation text is extremely short **[ASSUMPTION: fewer than ~20 characters]** | Non-blocking inline caution (not an error): "This looks like a very short conversation — analysis may be less reliable." Submission is still permitted; this is guidance, not a hard validation failure, since the system should never presume to know a professional's legitimate use case better than they do |

The Primary Button ("Analyze Conversation") is disabled by default and becomes enabled the moment valid, non-empty input exists in the active method — this "disabled until valid" pattern is the same one already used for Settings' account-deletion Confirm button (settings_spec.md Section 13), reused here rather than reinvented.

---

# 9. Privacy Notices

Directly beneath the active input surface, above the Primary Button — a static, always-visible strip (not a dismissible banner, not a tooltip) reinforcing ProjectVision.md's Privacy First principle at the exact moment it matters most: before submission.

**Content:**
```
[ small shield/lock icon, 16px, muted ]
"Before analysis, personal information such as names, phone numbers,
and addresses is automatically detected and removed. Learn more →"
```

"Learn more" is a Ghost/Text link opening the Documentation page's Privacy section (documentation template, frontend_architecture.md Section 5.7) in a new context — this is the one place this page cross-links to Documentation, and it is included specifically because the privacy claim being made here is exactly the kind of statement a professional should be able to verify rather than take on faith, consistent with the product's Explainability-First philosophy extending to its own privacy claims.

**Visual treatment:** caption-scale text, muted foreground, no colored background, no border — deliberately quiet, matching the Trust Zone treatment already established on the Landing Page (landing_spec.md Section 3) rather than styled as a warning or alert, since this is a reassurance, not a caution.

---

# 10. Submission Flow

```
Professional provides input (paste or upload)
        ↓
Validation passes → Primary Button enabled
        ↓
Professional clicks "Analyze Conversation"
        ↓
Button enters inline-spinner loading sub-state
   (reused from Settings' Save button pattern, settings_spec.md Section 4 —
    label replaced by spinner, button retains width)
        ↓
Submission zone (input surface, toggle, privacy notice, button) fades out
        ↓
AI Pipeline Progress pattern takes over the page (Section 11)
```

Once submitted, the input content is **not editable** — there is no "cancel and edit" affordance mid-submission, matching the "never surprising, always deliberate" interaction philosophy; a professional who submitted the wrong content waits for the (typically brief) submission acknowledgment and then starts a fresh New Analysis rather than the system attempting to support an in-flight edit, which would introduce ambiguity about what's actually being analyzed.

---

# 11. AI Processing Transition

This is a **full reuse, not a redefinition**, of the AI Pipeline Progress pattern already fully specified in `dashboard_spec.md` Section 12 (Full state) and mandated as the only acceptable long-running-AI-task pattern in `frontend_architecture.md` Section 9.4. No new visualization, timing, or node structure is introduced here.

**Sequence (verbatim from dashboard_spec.md Section 12):**
```
Privacy Guard → Emotion Analysis → Distress Detection → Crisis Detection →
Pattern Analysis → Context Fusion → Decision Engine → Explainability → Safe Response
```

**Placement on this page:** once submission begins (Section 10), the Pipeline Progress pattern renders full-width within the same 720px→expanding container area the Submission Zone occupied — it is permitted to use a wider container than the 720px input form, since the pipeline's horizontal node sequence benefits from more breathing room than a text form does; the container widens to the standard 1440px Main Content Area bound at this point, with a smooth width transition rather than a layout jump. **[ASSUMPTION: exact container-width transition treatment; the source documentation does not specify inter-container-width animation, so this is a reasonable extrapolation of the existing "layouts reflow, not shrink" principle (frontend_architecture.md Section 3.5) rather than an invented pattern.]**

**On completion:** the page **navigates** to the Conversation Analysis Workspace for the newly created record (dashboard_spec.md Section 9) — this is a real route change, not an in-place reveal, since the professional is moving from "submitting" to "reviewing a specific record," and that record now has its own addressable URL (consistent with History/Reports' preference for meaningful, bookmarkable routes, frontend_architecture.md Section 6.4-adjacent reasoning). The compact Pipeline strip (dashboard_spec.md Section 12's Compact state) is what the professional then sees inside the Analysis Workspace's Pipeline tab — the full-state animation that just played does not repeat; it is the same underlying data collapsing into its permanent compact form, exactly as already specified.

**This document does not redesign the Analysis Workspace.** Everything from Top Zone through Bottom Zone, once the professional lands there, is exactly as specified in `dashboard_spec.md` Sections 9–17.

---

# 12. Loading States

- **Button-level (Section 10):** inline spinner, reused pattern, covered above.
- **Full-page (Section 11):** the AI Pipeline Progress pattern **is** the loading state for this operation — per the mandatory rule in frontend_architecture.md Section 9.4, a generic spinner or progress bar is never substituted here, without exception.
- **No skeleton loading exists on this page prior to submission** — the page's initial render (heading, toggle, empty input surface) has no data dependency, so there is nothing to skeleton; the page is interactive the instant it renders.

---

# 13. Empty States

This page **is**, in its at-rest state, functionally an empty state already — an empty Textarea placeholder or an at-rest dropzone (Section 5) — so no separate "empty state pattern" (per frontend_architecture.md Section 8) is layered on top of it. Applying the universal muted-line-icon Empty State pattern here would be redundant with the input surfaces' own at-rest presentation and was deliberately not done, to avoid two competing "nothing here yet" visual languages stacked on one page.

The only genuine Empty State instance on this page's flow is a **failed submission returning the professional to this page** (Section 14) — in that case, the page returns to its normal input-ready state with the professional's original content still present (Section 10's "not editable once submitted" applies only to a successful, in-flight submission; a failed submission restores editability).

---

# 14. Error States

| Context | Presentation | Recovery |
|---|---|---|
| Invalid file (type/size) | Inline error beneath dropzone (Section 8) | Correct and re-upload — no Button-disable persists beyond the invalid attempt |
| Submission request fails outright (network/backend, before pipeline starts) | Submission Zone reappears (does not proceed to Pipeline Progress at all); inline banner above the Primary Button: "Couldn't start analysis. Please try again." + the Button itself is the retry mechanism | Re-click Analyze Conversation; original input content is fully preserved |
| Pipeline fails mid-sequence | **Reused verbatim** from dashboard_spec.md Section 22 ("Analysis fails mid-pipeline") — the sequence visually halts at the failed stage with an inline error marker on that specific node; completed stages remain visible | "Retry Analysis" button appears beneath the halted sequence, restarting the pipeline from a clean state (partial pipeline results are not resumable, consistent with the existing rule) |
| Full analysis failure (pipeline completes but no valid result is produced) | **Reused verbatim** from dashboard_spec.md Section 22 ("Full analysis failure") | Same Retry Analysis pattern |

Same governing rule restated once more for this page specifically, since it is the one page where a failure could otherwise tempt data loss: **an error never discards content the professional has already entered.** A failed submission of any kind returns the professional to an input surface still populated with exactly what they provided.

---

# 15. Accessibility

- Full keyboard operability across the input-method toggle, Textarea, dropzone's "click to browse" trigger, remove-file control, Privacy Notice link, and Primary Button.
- The input-method Segmented Control behaves as a standard radio-group pattern: Arrow Left/Right move between the two options, Enter/Space is not required since selection is immediate on arrow movement — consistent with the same Segmented Control's keyboard behavior already defined for Settings' Theme control (settings_spec.md Section 17-adjacent pattern).
- The dropzone is a genuine focusable, keyboard-operable control (not solely a mouse-drag target): Enter or Space while focused opens the native file browser, identical in outcome to clicking "click to browse."
- Drag-and-drop is **never the only way** to provide a file — the "click to browse" path is always present and fully keyboard/screen-reader operable, ensuring the file-upload workflow does not depend on pointer-based interaction.
- The AI Pipeline Progress pattern's `aria-live="polite"` region requirement (dashboard_spec.md Section 12, frontend_architecture.md Section 12.2) applies identically here — this is a reused requirement, not a new one, but is restated because this page is one of the two places (alongside re-analysis) where that pattern actually activates.
- Character count and file-size/type captions are associated with their respective inputs via standard label/description patterns, not conveyed by placement alone.
- Minimum 44px touch target on every interactive element, including the small "×" remove-file control.
- Contrast: WCAG AA minimum throughout, including the dashed drop-target border in both its neutral and drag-over states.

---

# 16. Responsive Behaviour

**Desktop/Laptop (≥1024px):** full layout as specified — 720px centered container, Segmented Control and input surface at full designed size.

**Tablet (768–1023px):** container width relaxes to fill available width minus standard tablet outer margins (40px), matching the same fluid-within-a-range treatment already established for Reports' reading-width container (reports_spec.md Section 15) rather than staying rigidly at 720px if that leaves excessive whitespace at this breakpoint.

**Mobile (≤767px):** container becomes full-width minus the standard 20px outer margin. Textarea min-height reduces to **[ASSUMPTION: 200px]** to avoid the input surface consuming the entire initial viewport before any other content is visible. The Primary Button becomes full-width and — consistent with the original Phase 1 wireframe's explicit instruction for this exact page ("sticky primary button pinned to bottom of viewport for reachability," UX-Wireframe-Specification.md Section 5) — is pinned to the bottom of the viewport once the professional has entered valid input, rather than requiring a scroll to reach it after typing a long paste.

The AI Pipeline Progress full-state sequence (Section 11), once triggered, follows its already-specified mobile responsive behavior verbatim — vertical top-to-bottom trail, per dashboard_spec.md Section 12 / frontend_architecture.md Section 13.4.

---

# 17. Component Usage

Drawn only from the locked taxonomy (components.md); every component below is a **reuse** of an existing definition, not a new variant.

| Component | New Analysis usage | Origin |
|---|---|---|
| Segmented Control | Paste Text / Upload File toggle | Reused from Settings' Theme control |
| Textarea | Paste Text input surface | Inputs category, components.md |
| File Upload | Upload File dropzone | Inputs category, components.md |
| Button (Primary) | "Analyze Conversation" | Foundations |
| Button (Ghost/Text) | "click to browse," "Learn more →," remove-file "×" | Foundations |
| Icon | Upload icon, shield/lock icon, file-type icon | Foundations |
| Inline Alert | File validation errors, submission-failure banner | Feedback category |
| AI Pipeline (Full state) | Submission → analysis transition | Reused verbatim from dashboard_spec.md Section 12 |

No Table, Card grid, Chart, Badge, or any collection/analysis component appears anywhere on this page — consistent with its identity as a single-task submission form, not a scanning or analysis surface.

---

# 18. Motion

All durations and easing draw from the single locked scale (Fast 120ms / Normal 220ms / Slow 350ms / Maximum 600ms hard ceiling; ease-out primary, ease-in-out secondary) — no new motion vocabulary introduced.

| Interaction | Duration | Easing |
|---|---|---|
| Page entrance | 250ms, 12px upward translate | ease-out |
| Input-method toggle switch (crossfade + height adjust) | 180ms | ease-in-out |
| Dropzone drag-over border/fill transition | 180ms | ease-out |
| File-selected Card entrance | 250ms, 16px translateY | ease-out |
| Button loading-state transition (label ↔ spinner) | 180ms crossfade | ease-in-out |
| Submission Zone exit (fade out before Pipeline takes over) | 220ms | ease-in |
| Container width transition (720px → full-width, Section 11) | 250ms | ease-out |
| AI Pipeline Progress sequence | 220–350ms per stage (reused verbatim) | ease-out |

Nothing on this page introduces a new duration or easing curve; nothing loops; nothing exceeds the 600ms Maximum tier.

---

# 19. Keyboard Navigation

Explicit tab order, top to bottom:

1. Input-method Segmented Control (Arrow Left/Right to switch, per Section 15)
2. Active input surface — Textarea (Paste Text) or dropzone/browse trigger + remove-file control if present (Upload File)
3. "Learn more →" Privacy Notice link
4. Primary Button ("Analyze Conversation")

Once the Pipeline Progress pattern is active (Section 11), keyboard focus moves to the pattern's live region heading, and the previous form controls are removed from the tab order entirely (they are no longer rendered, not merely hidden) — consistent with the standard rule that collapsed/replaced content is excluded from tab order, not just visually absent (settings_spec.md Section 21's mobile-accordion precedent, applied here to a full-page content replacement).

**Shortcuts specific to this page:** none beyond the global `⌘K`/`Ctrl+K` Command Palette, which remains available up until submission begins (it is appropriately unavailable once the Pipeline Progress pattern takes over, consistent with that pattern already being a focus-directing, attention-owning full-page state).

---

# 20. Interaction Rules

- **Only one input method is active at a time**, and switching between them never discards content already entered in the other (Section 3) — this is the one place on this page where "state that isn't currently visible" is deliberately preserved rather than reset, and it is called out explicitly because it is an exception to the more general rule that navigating away from unsaved content is typically not protected elsewhere in the product.
- **The Primary Button's enabled/disabled state is the sole gatekeeper for submission readiness** — there is no secondary "Review before submitting" step, no confirmation dialog before analysis begins. This is a deliberate contrast with Override/Escalate/Delete-Account's confirmation-gated patterns: submitting a conversation for analysis is not a destructive or irreversible action in the same sense (it does not alter any existing clinical record), so the proportional-friction principle (frontend_architecture.md Section 1.2) correctly places it at low friction.
- **Drag-and-drop intent inference** (Section 6's auto-switch to Upload File on page-wide drop) is the one place this page infers rather than requires explicit selection — documented as a deliberate, narrow exception, not a precedent for inferring intent elsewhere in the product.
- **No auto-save or draft-persistence exists across sessions** — if a professional navigates away from New Analysis with content entered and returns later (including via browser back/forward), the page resets to empty. `[ASSUMPTION: this follows from the absence of any documented draft/auto-save capability elsewhere in the source documentation; if draft persistence is desired, it should be raised as a new architecture decision, not assumed here.]`

---

# 21. Premium UX Details

- **The privacy notice's "Learn more →" link actually resolves to real, specific Documentation content**, not a placeholder — a small detail, but one that matters disproportionately for a clinical product: a privacy claim a professional can verify in two clicks is a stronger trust signal than the same claim asserted without a path to substantiate it.
- **Content survives every failure mode on this page** (Section 14) — file rejected, submission failed, pipeline failed — the professional's actual conversation text or file is never silently lost, which is a small mechanical detail that nonetheless matters enormously given what this page is used for (a professional may be submitting something they only have once, e.g. copied from an external, non-reopenable source).
- **The page-wide drag-and-drop intent inference** (Section 6) is the kind of small affordance that separates a considered, Raycast/Linear-caliber tool from a generic form page — a professional dragging a file doesn't have to first remember to click a toggle.
- **The mobile sticky Primary Button** (Section 16) — carried forward faithfully from the original Phase 1 wireframe's own explicit instruction for this exact screen — ensures that on the one page where a professional might type or paste a genuinely long passage on a phone, the path to submission never requires hunting for a button that scrolled out of view.
- **The container widening from 720px to full-width exactly at the submission moment** (Section 11) is a subtle but meaningful transition: the page visually signals "we've moved from a small personal task to a larger system process" through space alone, without any accompanying copy needing to say so.
- **Nothing on this page tries to parse or reformat the pasted conversation client-side** — trusting the backend's own Text Preparation stage (pipeline.md) rather than attempting speaker-label detection or timestamp parsing in the browser, which keeps this page simple, fast, and free of the false confidence a fragile client-side parser would introduce.

---

**End of New Analysis Page High-Fidelity Specification.**
Ready for engineering handoff pending your review. This document, together with `frontend_architecture.md`, `landing_spec.md`, `dashboard_spec.md`, `history_spec.md`, `reports_spec.md`, and `settings_spec.md`, now covers the authenticated Shell and six of the product's core screens. Several values in this document are marked `[ASSUMPTION]` and should be confirmed against the real backend/API contract before implementation. Awaiting direction on the next screen to specify (Documentation/API, or About).
