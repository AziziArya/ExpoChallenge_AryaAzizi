# History Page — High-Fidelity Design Specification
## Mental Health Safety Analyzer · Phase 3, Screen 3

**Document type:** Production design specification
**Target path:** `docs/design/history_spec.md`
**Audience:** Senior Frontend Engineer / Design Engineer implementation team
**Status:** Ready for build, pending final review
**Primary sources:** ProjectVision.md, design.md, frontend_requirements.md, components.md, frontend_architecture.md, UX-Wireframe-Specification.md, Dashboard High-Fidelity Specification

This document introduces **no new design language**. Every token, color, spacing value, motion duration, and component referenced below is drawn directly from the locked system already established in `frontend_architecture.md` and applied in the Dashboard specification. Where History reuses a Dashboard pattern verbatim (e.g., risk badges, table-to-card responsive rule), this document states that explicitly rather than re-describing it, to keep the two documents from drifting apart over time.

No code, HTML, CSS, or React is included. All measurements and behaviors are specified precisely enough for direct implementation.

---

# 1. Overall Layout

History is a **Collection Template** (frontend_architecture.md Section 4.7) — like Dashboard Home, it has no Top/Middle/Bottom zoning, because there is no single record being reasoned about on this page. It sits inside the standard authenticated Shell (Top Navigation, Sidebar, conditional Critical Alert Banner) exactly as Dashboard does.

```
┌─────────────────────────────────────────────────────────────┐
│ [ Page heading: "History" — H1 ]                                │
│ [ muted subline: "Every conversation you've reviewed, in one     │
│   place." ]                                                       │
├─────────────────────────────────────────────────────────────┤
│ FILTER / SEARCH BAR (sticky within Main Content Area)             │
│ [ Search input ] [ Risk filter ] [ Review Status filter ]          │
│ [ Date range filter ] [ Clear filters (conditional) ]               │
├─────────────────────────────────────────────────────────────┤
│ RESULT COUNT STRIP                                                 │
│ "128 conversations" · sort control right-aligned                    │
├─────────────────────────────────────────────────────────────┤
│ CONVERSATION LIST (hero component of this page)                    │
│  Table (desktop/laptop) — same column language as Dashboard Queue   │
│  Card list (tablet/mobile)                                          │
├─────────────────────────────────────────────────────────────┤
│ PAGINATION CONTROL                                                  │
└─────────────────────────────────────────────────────────────┘
```

**Hero designation:** the Conversation List is the hero of this page, exactly as the Queue is the hero of Dashboard Home (design.md's "one hero per screen" rule, applied consistently). Filter/Search and the result count strip exist only to shape what the hero shows — they are deliberately restrained in visual weight (no card treatment, no background fill, no shadow) so they never compete with the list itself.

**Container width:** standard 1440px max-width, centered, 64px outer margin desktop — this is a working/scanning page, not a document-reading page, so it uses the Shell's full standard width rather than Reports' narrower reading-width exception.

---

# 2. Visual Hierarchy

History's hierarchy differs from Dashboard Home in one meaningful way: **there is no Summary Strip.** Dashboard Home leads with aggregate metrics because its job is "what's happening right now." History's job is retrospective lookup — a professional already knows roughly what they're looking for (a name, a date, a risk level) and wants to get to it fast. Leading with metric cards here would repeat information already seen on Dashboard and add a scroll-past step with no retrieval value.

Hierarchy, strictly in this order:
1. **Conversation List** — the single largest, most visually assertive element on the page (same risk badges, same type scale as Dashboard Queue rows — deliberately identical, never a "quieter" variant).
2. **Filter/Search bar** — present and immediately usable, but rendered in muted, low-chroma controls; never uses Primary Blue except on an active/applied filter chip.
3. **Result count + sort control** — smallest, quietest text on the page (caption scale), purely informational.

No element on this page is permitted to be visually louder than a risk badge inside the list — this mirrors the exact rule already established for Dashboard ("nothing in Summary Strip may use a larger type size or more saturated color than the Queue's own risk badges").

---

# 3. Conversation List

**Component type:** Table (desktop/laptop, ≥1024px), Card list (tablet/mobile, <1024px) — this is the same "tables become cards" system-wide rule already applied to the Dashboard Queue, reused verbatim, not reinvented.

**Columns (desktop table), identical structure to Dashboard Queue with one addition:**
```
[ Conversation ] [ Risk ] [ Confidence ] [ Review Status ] [ Date ] [ → ]
```

The only structural difference from the Queue: the time column is **"Date"** here (absolute, e.g., "Jul 18, 2026"), not "Time" (relative, "2h ago") — History is a retrospective archive, so absolute dates are the primary scan target; Dashboard's Queue prioritizes relative recency instead. Hovering a Date cell still reveals the exact timestamp via tooltip, matching the Queue's own hover-for-precision pattern.

**Row structure:** identical to Dashboard Queue (Section 8 of the Dashboard spec) — 56px row height, 16px vertical / 20px horizontal cell padding, entire row is the click target, cursor changes to pointer, trailing chevron icon reinforces the affordance. Row click → Conversation Analysis Workspace for that record (same destination Dashboard's Queue rows lead to; History and Dashboard are two different entry points into the same single-record experience, never two different conversation views).

**Escalated-case pinning:** identical rule to the Queue — escalated conversations pin to the top of the list regardless of active sort or filter, with the same small flagged-indicator icon. This is a deliberate, system-wide consistency choice: a professional should never have to remember "pinning works differently in History" — the two lists behave as one shared mental model even though they're different pages.

---

# 4. Search

**Placement:** leftmost control in the Filter/Search bar, fixed width 320px desktop (matching the Top Navigation search field's width, for visual rhyme between the global search and this page-scoped search — though these are two distinct search scopes, not the same control).

**Behavior:** live, page-scoped, debounced at 300ms after last keystroke (not per-keystroke filtering, to avoid visual jitter while typing — matches the "never surprising" interaction philosophy). Searches against conversation label/ID and, where available, any professional-entered notes attached to the case.

**Visual treatment:** standard Input component, 44px height, leading search icon (16px, muted), placeholder "Search conversations..." Clear ("×") icon appears inside the field, right-aligned, only once text is entered — never shown empty.

**Result behavior:** filtering happens in place within the same list/table structure — no separate "search results" page or layout shift. If zero matches, the list area is replaced by the Empty State defined in Section 10, scoped specifically to "no search results," not the generic "no history yet" state.

---

# 5. Filters

Three filter controls, each a Select-style dropdown (components.md's Select component), positioned in a row beside Search:

1. **Risk Level filter** — multi-select checklist inside the dropdown (Safe / Mild Concern / Moderate / High / Critical), allowing more than one risk level to be selected simultaneously.
2. **Review Status filter** — multi-select (Pending / Reviewed / Escalated / Awaiting Info) — this is the filter dimension History leans on most heavily, since its core job (per the wireframe spec) is retrospective triage by review state, distinguishing it from the Queue's more time-biased default.
3. **Date Range filter** — a Date Picker component (per components.md's Inputs taxonomy) opening a compact calendar overlay with common presets at the top ("Last 7 days," "Last 30 days," "Last 90 days," "All time") above the custom range option — presets are the expected path for most professionals, custom range is available but never the default focus.

**Combining filters:** all three filters combine with logical AND (e.g., Risk = High AND Status = Pending AND Date = Last 30 days). Filters combine with Search using AND as well — Search narrows within whatever the active filters already show.

**Applied-filter feedback:** once any filter is active, small removable Chip components appear directly beneath the Filter/Search bar (8px gap), one chip per active filter value, each with its own "×" to remove just that one value. A single "Clear filters" text-button appears at the end of this chip row only when at least one filter is active — this is the one place on this page Primary Blue is used outside the header CTA, since an applied filter is meaningfully different from the neutral, at-rest state of the controls themselves.

---

# 6. Sorting

**Placement:** right-aligned within the Result Count Strip, directly beneath the Filter/Search bar — a compact Select-style control, not column-header sorting, since History (unlike the Queue) needs a single global sort control that also works identically on the mobile card-list view where column headers don't exist.

**Options:** "Newest first" (default), "Oldest first," "Risk: High to Low," "Risk: Low to High," "Confidence: High to Low." Desktop/laptop table view *additionally* supports click-to-sort on the Risk and Date column headers (small arrow indicator, toggling ascending/descending) as a secondary, power-user path — but this always stays in sync with the same Select control, never presenting a second, independent sort state. There is one source of truth for sort order, exposed through two entry points.

**Escalated-pin interaction with sort:** regardless of the active sort, Escalated conversations remain pinned above the rest of the list (Section 3) — the applied sort order governs everything below that pinned group, never the pinned group itself. This is stated explicitly here because it's the one place sort and a structural override interact, and needs to be unambiguous for implementation.

---

# 7. Risk Badges

Identical component, identical color mapping, identical rule set to the Dashboard specification (Section 10 of the Dashboard spec) — restated here only to confirm zero deviation:

- Safe → Green · Mild Concern → Blue-gray · Moderate → Amber · High → Orange-Red · Critical → Red with soft-glow border.
- Always color + icon + text label together — never color alone, on the table view or the mobile card view.
- Critical badges never receive the glow treatment anywhere else on this page (only Risk itself, not Review Status or any other badge type), preserving Critical's visual meaning as singular and non-diluted.

No new risk-badge variant is introduced for History. A user should not be able to tell, from the badge alone, whether they're looking at the Dashboard Queue or the History list — the badge's job is to communicate risk, identically, everywhere it appears.

---

# 8. Conversation Preview Cards

This is the **tablet/mobile equivalent of the table row**, used below 1024px per the system-wide "tables become cards" rule. Not a new component — a responsive transformation of the same row data.

**Card structure, stacked, 16px internal padding (mobile) / 20px (tablet):**
```
[ Conversation label ]                          [ chevron ]
[ participant/message-count microcopy, muted ]
[ Risk Badge ]  [ Review Status Badge ]
[ Confidence: 82% · High confidence ]            [ Date, muted caption ]
```

**Card behavior:** entire card is the tap target (44px+ effective height well exceeded), tap → Conversation Analysis Workspace, same destination as the desktop row click. Cards use the Default Card variant — 16–20px radius, 1px neutral border, soft shadow at rest, no hover-lift treatment on touch devices (hover states are meaningless on touch; the card instead gets a brief press-state scale of 0.98 on tap, matching the system's button press feedback, so touch interaction still feels responsive).

**Vertical list spacing:** 12px gap between cards (tighter than the 24px card-grid gutter used for Dashboard's metric cards, since these are list items in sequence, not a grid of independent widgets — matches typical dense-list spacing conventions already implied by the Queue's own 56px row density).

**Escalated indicator on cards:** same small flagged icon as the desktop table, positioned top-right of the card, before the chevron.

---

# 9. Pagination / Infinite Scroll

**Decision: Pagination, not infinite scroll — explicitly, for the same reason already established for the Dashboard Queue.** Infinite scroll conflicts with the product's "predictable, never surprising" interaction philosophy: a professional conducting a retrospective review needs to know definitively that they've seen everything relevant, and an infinitely-loading list makes "have I reached the end" ambiguous. This is a deliberate consistency decision carried over from the Dashboard spec, not a new choice made independently for this page.

**Page size:** 20 rows per page (identical to the Queue), configurable per professional in Settings in a future iteration (not built now — flagged as a possible future preference, not a current requirement).

**Control placement:** bottom of the Conversation List, Previous/Next buttons bottom-right, page indicator ("Page 3 of 7") bottom-left — identical layout to the Dashboard Queue's pagination control.

**Behavior on filter/sort/search change:** page resets to 1 automatically whenever any filter, sort, or search value changes — the professional should never land on an empty "Page 5" after narrowing a filter that only has 2 pages of results.

**Loading between pages:** page transitions use the Table/Card list's own skeleton pattern (Section 11) for a brief moment rather than a full-page reload feel — pagination should feel like a within-page update, not a navigation event.

---

# 10. Empty State

Follows the universal Empty State system exactly as locked in `frontend_architecture.md` Section 8 — no illustration, single muted line-icon, one sentence, optional second sentence, exactly one primary action.

| Context | Icon concept | Message | Action |
|---|---|---|---|
| No history at all (new professional, zero completed analyses) | clock/archive | "Your analysis history will appear here." | "Start New Analysis" |
| Filters applied, zero matches | filter/funnel | "No conversations match your filters." | "Clear filters" |
| Search applied, zero matches | search/magnifier | "No matches for '[query]'." | "Clear search" |

**Placement rule:** the empty state replaces the entire Conversation List region only — the Filter/Search bar and Result Count Strip remain visible and interactive above it (showing "0 conversations"), so a professional can immediately adjust their filter or search without losing context or having the whole page reset. This differs slightly from Dashboard's empty-Queue state (which has no filters to begin with) and is called out explicitly here because it's a meaningful behavioral distinction.

---

# 11. Loading State

**Initial page load:** skeleton table (desktop/laptop) or skeleton card stack (tablet/mobile) matching the real content's row/card count and proportions — approximately 8 skeleton rows/cards shown regardless of actual eventual count, per the standard skeleton philosophy (match shape, not exact final quantity). Filter/Search bar and Result Count Strip render in their normal, disabled-but-visible state during this load (search/filter controls are visually present but inert until data resolves) rather than also skeletonizing, since they don't depend on the fetch that's loading.

**Filter/sort/search-triggered reload:** a lighter, localized version — the existing rows/cards dim slightly (reduced opacity, no layout shift) while a thin progress indicator appears at the very top edge of the list region (a 2px accent-colored line, indeterminate animation) — this avoids the jarring full-skeleton replace for what is typically a sub-second operation, while still clearly signaling "something is happening."

**Pagination loading:** identical lightweight treatment to filter/sort reload (Section 9) — never a full-page skeleton for a page-to-page navigation within the same list.

---

# 12. Error State

| Context | Presentation | Recovery |
|---|---|---|
| List fails to load entirely | Full-region error card replacing the Conversation List area: calm icon + "We couldn't load your history." + Retry button. Filter/Search bar remains visible above it, inert. | Retry re-fetches with the currently-applied filters intact — a retry never silently resets filters back to default |
| Filter/search/sort request fails | Existing list remains visible and interactive (previous successful state is not discarded), a small inline error notice appears just above the list: "Couldn't apply filters — showing previous results." + inline Retry link | Retry re-applies the attempted filter change |
| One row's data is incomplete (e.g., confidence missing) | That single cell/field shows "—" with a small inline tooltip on hover: "Data unavailable" — never blocks the rest of the row from rendering | No action needed; not a blocking error |

Governs by the same system-wide rule established in the Dashboard spec: **an error never removes access to data already rendered.** A failed filter reapplication must never blank a list that was previously showing results.

---

# 13. Accessibility

- Full keyboard operability: Search input, each filter dropdown, sort control, every list row/card, and pagination controls are all reachable via Tab/Shift+Tab in visual reading order.
- Filter dropdowns behave as standard listbox/combobox patterns: Enter/Space opens, Arrow keys navigate options, Enter selects, Escape closes without changing selection.
- Each Conversation row/card is a single Tab stop (not multiple stops per row) with Enter activating navigation to that conversation — consistent with the Dashboard Queue's own row-as-single-target accessibility pattern.
- Risk, Confidence, and Review Status all carry explicit, human-readable text in the accessibility tree on both table and card layouts — never conveyed by badge color alone, matching the system-wide rule.
- The lightweight top-of-list loading indicator (Section 11) is announced via an `aria-live="polite"` region ("Updating results…" / "Showing 12 results") so screen reader users aren't left wondering whether their filter change registered.
- Applied-filter Chips (Section 5) each have an accessible label announcing both the filter dimension and value (e.g., "Risk filter: High. Remove.") on their individual remove control.
- Date Picker overlay traps focus while open and returns focus to the Date Range control on close, matching the Command Palette / Confirmation dialog focus-management pattern already established system-wide.
- Minimum 44px touch target on every interactive element at every breakpoint, including filter chip remove buttons and pagination controls.
- Contrast: WCAG AA minimum throughout, including muted caption text (dates, microcopy) against both light and dark surface backgrounds.

---

# 14. Responsive Behaviour

**Desktop (≥1280px):** full layout as specified — Filter/Search bar as a single row, table view, Previous/Next pagination bottom-right.

**Laptop (1024–1279px):** identical structure, tighter grid gutters/margins per the system-wide Laptop tier (20px gutter, 48px outer margin) — table view is retained down to 1024px (this is the threshold already established for the Queue; History follows the identical breakpoint for the table-to-card switch, not a page-specific variant).

**Tablet (768–1023px):** Filter/Search bar wraps to two rows if needed (Search full-width top row; Risk/Status/Date filters wrap to a second row, horizontally scrollable if they don't all fit) rather than compressing controls illegibly. List switches to the Card layout (Section 8).

**Mobile (≤767px):** Filter/Search bar collapses further — Search remains a persistent full-width field; the three filter controls collapse into a single "Filters" button that opens a bottom-sheet-style panel (not a dropdown, given limited vertical dropdown space on mobile) containing all three filter controls stacked vertically with a single "Apply" action. This avoids three separate cramped dropdown triggers competing for a 375–414px-wide screen. Sort control moves into the same "Filters" sheet as its own section, rather than sitting as a separate always-visible control, to reclaim vertical space for the list itself. Cards render full-width, single column, 12px vertical gap as specified in Section 8.

---

# 15. Component Usage

Drawn only from the locked taxonomy (components.md) — no new component types introduced for this page.

| Component | History usage |
|---|---|
| Input (Search) | Search field |
| Select | Risk filter, Review Status filter, Sort control |
| Date Picker | Date Range filter |
| Chip | Applied-filter indicators |
| Badge | Risk level, Review Status |
| Table | Conversation List, desktop/laptop |
| Card (Default) | Conversation List, tablet/mobile |
| Button (Ghost/Text) | "Clear filters," "Clear search," pagination Previous/Next |
| Button (Primary) | Empty-state "Start New Analysis" action |
| Empty State pattern | No history / no filter matches / no search matches |
| Skeleton | Initial load and lightweight reload states |
| Tooltip | Date column hover-for-precision, incomplete-data cells |
| Bottom Sheet (mobile-only variant of Filter panel) | Mobile "Filters" control |

---

# 16. Motion

All durations and easing draw from the single locked scale (Fast 120ms / Normal 220ms / Slow 350ms / Maximum 600ms hard ceiling; ease-out primary, ease-in-out secondary) — no new motion vocabulary for this page.

| Interaction | Duration | Easing |
|---|---|---|
| Page entrance (route change into History) | 250ms, 12px upward translate | ease-out |
| Filter Chip appear/remove | 180ms fade + 8px translate | ease-out |
| Filter dropdown open/close | 220ms height/opacity | ease-out |
| Date Picker overlay open/close | 220ms fade + scale (0.96→1) | ease-out |
| List row/card hover lift (Interactive treatment) | 180ms, 4px lift + soft shadow | ease-out |
| Row/card press feedback | 120ms scale to 0.98 | ease-out |
| List content update (filter/sort/search applied) | 180ms crossfade between old and new result set | ease-in-out |
| Top-of-list progress indicator (Section 11) | indeterminate, continuous while active — the one exception to "nothing loops," since this is an active-loading signal, not decorative motion, and disappears the moment the operation resolves | — |
| Pagination page change | 180ms crossfade, matches list content update above | ease-in-out |
| Mobile Filter bottom-sheet open/close | 280ms slide-up / slide-down | ease-out / ease-in |

No animation on this page exceeds the 600ms Maximum tier; nothing loops except the single documented loading-indicator exception, which stops the instant it's no longer needed.

---

# 17. Keyboard Navigation

Explicit tab order, top to bottom, left to right, matching visual layout exactly:

1. Search input
2. Risk filter → Review Status filter → Date Range filter (desktop/tablet); single "Filters" button (mobile)
3. Sort control
4. Each active Filter Chip's remove control, then "Clear filters" (if present)
5. Each Conversation row/card, in displayed order (top to bottom, respecting the Escalated-pin rule)
6. Pagination Previous → page indicator (non-interactive) → Next

**Shortcuts specific to this page:**
- `/` focuses the Search input from anywhere on the page (a common, discoverable pattern consistent with the Raycast/Linear-class benchmark referenced in the product's visual identity goals) — does not conflict with the global `⌘K`/`Ctrl+K` Command Palette shortcut, which remains available identically here as on every other authenticated page.
- `Escape`, when Search is focused and contains text, clears the search field (does not navigate away or close anything else).
- `Escape`, when a filter dropdown or the mobile Filters sheet is open, closes it without applying unsaved changes (mobile sheet requires explicit "Apply" — Escape is equivalent to Cancel there).
- Arrow Up/Down navigate between Conversation rows when list focus is active, Enter opens the focused row — this is an enhancement beyond plain Tab-per-row and should be treated as expected behavior for a table/list of this nature, matching conventions in the Linear/Notion-class benchmarks.

---

# 18. Interaction Rules

- **No destructive actions exist on this page.** History is read-only with respect to case data (viewing only) — the only "removal" actions available are removing a filter or clearing search, neither of which affects underlying data. Because of this, **no Confirmation dialogs are needed anywhere on History** — this is a deliberate, notable contrast with the Dashboard's Analysis Workspace (Override/Escalate), and is worth stating explicitly so an engineer doesn't over-apply the Confirmation pattern here by habit.
- Row/card click always navigates to the Conversation Analysis Workspace — there is no secondary "preview without navigating" interaction on this page (a hover tooltip on the row shows only supplementary microcopy, never a substitute for opening the full record) — keeping the interaction model simple and predictable.
- Filter and Search changes apply automatically (no separate "Apply" button on desktop/tablet) — the single exception is the mobile Filters bottom sheet, which uses an explicit "Apply" action specifically because multiple filter values are being set in sequence within a constrained space, and applying each one individually would cause repeated, jarring list re-renders on a small screen.
- Sort and pagination state are **not persisted** across sessions (professional returns to default "Newest first," page 1 on next visit) — deliberately, so History always opens in its most predictable, default-oriented state rather than surprising a returning user with wherever they left off weeks earlier. Applied filters similarly reset on a fresh session for the same reason.

---

# 19. Premium Details

- **The `/` search shortcut** — a small, easily-missed detail, but exactly the kind of thing that signals "built by people who use Raycast and Linear themselves" to the professional and AI Researcher personas without adding any visual complexity.
- **Filters and Search combine losslessly and reversibly** — every applied constraint is visible as a removable Chip, meaning a professional can always see, at a glance, exactly why the list looks the way it does, and undo any one part of that without starting over. This is a small mechanic but it's the single biggest contributor to History feeling "trustworthy" rather than "opaque."
- **The lightweight top-of-list progress line instead of a full skeleton reload on every filter change** — this is the detail that makes filtering feel instantaneous and considered rather than like a page is "reloading" every time a professional refines their search, which is exactly the kind of perceived-performance polish that separates Stripe Dashboard-caliber tools from generic admin panels.
- **Escalated-case pinning behaves identically between Dashboard and History** — a professional builds one mental model once and it never breaks as they move between the two places they'd naturally look for a flagged case.
- **Row/card hover and press states are pixel-for-pixel identical to the Dashboard Queue's** — nothing about opening History should feel like "a different part of the app"; the interaction vocabulary is completely shared, reinforcing the single, cohesive product identity established since Section 1.3 of `frontend_architecture.md`.

---

**End of History Page High-Fidelity Specification.**
Ready for engineering handoff pending your review. This document, together with `frontend_architecture.md`, the Landing Page specification, and the Dashboard specification, now covers the authenticated Shell, the primary clinical workflow screen, and the retrospective lookup workflow. Awaiting direction on the next screen to specify (Reports, Settings, or Documentation/API).
