# Settings Page — High-Fidelity Design Specification
## Mental Health Safety Analyzer · Phase 3, Screen 5

**Document type:** Production design specification
**Target path:** `docs/design/settings_spec.md`
**Audience:** Senior Frontend Engineer / Design Engineer implementation team
**Status:** Ready for build, pending final review
**Primary sources:** ProjectVision.md, design.md, frontend_requirements.md, components.md, frontend_architecture.md, landing_spec.md, dashboard_spec.md, history_spec.md, reports_spec.md

This document introduces **no new tokens, spacing values, typography scale, motion durations, radii, colors, or component types.** Every element below is drawn from the system already locked across the prior specifications, reusing only Button, Toggle, Select, Input, Card, Badge, Chip, Dialog, Toast, and Skeleton as instructed. Where a pattern already exists elsewhere in the product (Confirmation before a destructive action, the universal Empty/Loading/Error systems, the 8pt spacing scale), this document cites it rather than redefining it.

No code, HTML, CSS, or React is included. All measurements and behaviors are specified precisely enough for direct implementation.

---

# 1. Overall Layout

Settings is architected per `frontend_architecture.md` Section 5.6 as the one template in the entire product with **no hero component by design** — its purpose is utility and configuration, not comprehension of a decision, and it is the deliberate calm counterpart to the Analysis Workspace's information density. This is a management page, and its layout must never borrow the visual density or urgency vocabulary (risk badges, colored state, dense tables) used elsewhere in the Shell.

```
┌─────────────────────────────────────────────────────────────┐
│ [ Page heading: "Settings" — H1 ]                                │
├───────────────────┬─────────────────────────────────────────┤
│ SETTINGS SUB-NAV    │ CONTENT AREA                              │
│ (left rail, 240px)  │ (forms and controls for active section,   │
│                      │  max-width constrained for readability)    │
│ Profile              │                                            │
│ Appearance            │                                            │
│ Notifications          │                                            │
│ Privacy                 │                                            │
│ Accessibility             │                                            │
│ Security                   │                                            │
│ Sessions                     │                                            │
│ Account                        │                                            │
└───────────────────┴─────────────────────────────────────────┘
```

**Container width:** standard Shell 1440px outer bound, but the Content Area itself is reading/form-width constrained to approximately **720px**, left-aligned within the remaining space (not centered independently) — this mirrors Reports' reading-width decision (reports_spec.md Section 1) but applied here for form scannability rather than document reading; a 1440px-wide form would force excessive eye travel between label and control, which is exactly the kind of avoidable friction a management page should never introduce.

**Two-column desktop/laptop structure, single-column mobile** — per `frontend_architecture.md` Section 5.6, collapsing to a stacked accordion below tablet width (Section 18).

---

# 2. Information Architecture

Eight sections, in this fixed order (matches the priority a professional is most likely to need, most-used to least-used, with destructive/administrative actions deliberately last):

1. **Profile** — identity, name, title, avatar
2. **Appearance** — theme, density (if applicable), reduced motion override
3. **Notifications** — what triggers a Toast/Banner/Critical Alert, and through which channel
4. **Privacy** — data handling preferences, aligned to privacy_and_safety.md's minimization principles
5. **Accessibility** — motion, contrast, and font-size preferences beyond system defaults
6. **Security** — password, two-factor (future), active credential management
7. **Sessions** — active session list, device/location, revoke capability
8. **Account** — danger-zone actions (sign out everywhere, delete account) — always last, always visually the quietest section header despite containing the highest-consequence actions, consistent with the product's established rule that consequence is communicated through confirmation friction, not through alarming visual treatment

**No section is ever hidden or conditionally absent** — unlike the Sidebar's Explainability exception (`frontend_architecture.md` Section 17.3), Settings' sub-nav is always the same eight items regardless of application state, since a management page must be maximally predictable.

---

# 3. Navigation Structure

**Desktop/Laptop:** persistent left rail, 240px wide (identical width to the Shell's own Sidebar, for visual rhyme — this is a deliberate echo, signaling "you are still inside one consistent product," not a coincidence of matching numbers).

**Rail item structure:** text-only, no icons (a deliberate deviation from the Shell Sidebar, which does use icons) — Settings' sub-nav items are already unambiguous single words, and adding icons here would be decoration without informational gain, consistent with design.md's anti-decoration stance. 44px row height, 16px horizontal padding.

**Active state:** identical redundant-signal pattern used everywhere else in the product — bold label weight (600) + 3px leading accent bar in Primary Blue. No filled-icon signal here since there are no icons to begin with; the two remaining signals are sufficient given the rail's small, low-ambiguity item count.

**Selecting a section:** updates the Content Area via the same 180ms crossfade already used for the Analysis Workspace's tab group switch (dashboard_spec.md Section 9) — content changes in place, the rail itself never moves or re-scrolls.

**URL behavior:** each section is independently addressable (e.g., a "Notifications" deep link), consistent with the product's general preference for meaningful, bookmarkable routes over pure client-side state — this matters here specifically because a professional may be directed to a specific settings section (e.g., "check your notification preferences") by a colleague or a future onboarding flow.

---

# 4. User Profile Section

**Purpose:** identity information — the professional's own name, title, and avatar as they appear elsewhere in the product (e.g., Human Review Panel attribution, Reports' "Reviewer name" field).

**Layout, top to bottom, within the 720px Content Area:**
```
[ Section title: "Profile" — H2 ]
[ muted subline: "This information appears on reports and review records." ]

[ Avatar, 72px circular ] [ "Change photo" text-button beside it ]

[ Input: Full Name ]
[ Input: Professional Title ] (e.g., "Licensed Clinical Psychologist")
[ Input: Email ] (read-only display if managed by an identity provider — see Open Questions)

[ Save button — Primary, right-aligned beneath the form ]
```

**Field spacing:** 24px vertical gap between each Input, matching the standard Card-internal-content spacing already used system-wide — Settings forms use the same rhythm as every other content block in the product, not a denser "settings-specific" spacing.

**Save behavior:** Save button uses the established inline-spinner loading sub-state (identical pattern to Reports' Export button, reports_spec.md Section 5) — label replaced by spinner, button retains width, then a Toast confirms ("Profile updated.") per the Notification Hierarchy's Toast tier (`frontend_architecture.md` Section 11.1) since this is a low-priority, non-safety-relevant confirmation.

**Validation:** inline, at the field, before submission — Email format and required-field checks appear beneath the relevant Input in Danger-color caption text, Save button remains enabled but returns the same inline error on click if submitted while invalid (never a blocking modal for form validation, per the system-wide rule already stated in `frontend_architecture.md` Section 10).

---

# 5. Appearance Settings

**Purpose:** control the visual register of the application without introducing any new visual register itself.

**Layout:**
```
[ Section title: "Appearance" — H2 ]
[ muted subline: "Choose how the interface looks on this device." ]

[ Theme — see Section 6 ]

[ Divider ]

[ Toggle: "Reduce motion" ]
  muted helper text: "Turns off animated transitions, including the AI
  reasoning pipeline animation. Recommended if motion is distracting."
```

Only two controls exist in this section (Theme, Reduce Motion) — Settings does not introduce a density/compact-mode toggle, font-size stepper, or any other appearance control not already implied by the locked design system, since the product's visual identity is intentionally singular and non-configurable beyond light/dark and motion sensitivity. Offering more would contradict the "one consistent product" principle running through every prior specification.

---

# 6. Theme (Light / Dark / System)

**Control type:** a three-option Segmented Control (a Button-group variant, not a Select dropdown) — Light / Dark / System — since exactly three mutually exclusive, always-visible options is the ideal case for a segmented control rather than a dropdown requiring an extra click to see the choices.

**Layout:**
```
"Theme"
[ Light ] [ Dark ] [ System ]   ← segmented control, single row
```

**Behavior:** selecting an option applies immediately (no Save button required for this specific control — matching the Landing Page's Theme Switch behavior, and the Top Navigation Theme Switch already specified in `dashboard_spec.md` Section 5) using the identical 220ms token crossfade already specified system-wide — every color token transitions together, never a hard snap.

**"System" option:** follows the OS-level light/dark preference and updates live if the OS preference changes while the app is open, without requiring a reload — this is the default for new users, consistent with respecting platform-level user intent rather than assuming a preference.

**Relationship to the Top Navigation Theme Switch:** these two controls are the same underlying state — toggling from the Top Nav icon updates this Settings control's selection and vice versa, never two independent theme states. The Top Nav toggle is a fast two-state (Light/Dark) shortcut for convenience; System mode can only be re-enabled from this Settings control, since a simple icon toggle has no natural third state to represent it.

---

# 7. Language & Localization

**Layout:**
```
[ Minor subsection within Appearance: "Language" ]

[ Select: Language ] — e.g., "English (United States)"
```

Single Select control, standard component, no flags or decorative iconography beside language names (consistent with the anti-decoration rule — flags are also a known source of political/regional sensitivity best avoided entirely in a clinical product). Selecting a new language applies after an explicit Save action (unlike Theme) since a locale change affects date formats, number formats, and potentially requires a content reload — treating it as consequential enough to warrant deliberate confirmation via the standard Save button, not instant application.

**Scope note:** only the language selector itself is specified here; actual translated content is outside this document's scope and should be treated as a separate localization workstream, not assumed to exist yet.

---

# 8. Accessibility Settings

**Purpose:** explicit, discoverable controls for accessibility preferences beyond what "Reduce Motion" (Section 5) already covers — consolidating the system's accessibility commitments into one visible, professional-facing settings section rather than leaving them entirely implicit in OS-level settings.

**Layout:**
```
[ Section title: "Accessibility" — H2 ]
[ muted subline: "These settings help tailor the interface to your needs." ]

[ Toggle: "Increase contrast" ]
  helper text: "Strengthens borders and text contrast beyond the
  standard theme."

[ Toggle: "Underline links" ]
  helper text: "Adds a permanent underline to text links, useful if
  color alone is hard to distinguish."

[ Select: "Text size" ] — Default / Large / Extra Large
  helper text: "Adjusts body text size across the application.
  Headings and data figures scale proportionally."
```

**Relationship to Reduce Motion:** Reduce Motion lives in Appearance (Section 5) rather than here, since it is as much a visual-register decision as an accessibility one and is the single most consequential motion-related control in the product (it disables the AI Pipeline animation entirely) — its placement is deliberate, not an oversight; a professional should encounter it while thinking about "how does this app look and move," not have to know to look under a separate "Accessibility" heading for it. This section instead covers contrast, link affordance, and text scale, which are less central but equally real needs.

**Application:** Contrast and Underline Links toggles apply immediately, like Theme; Text Size requires the standard Save action, since it's a broader layout-affecting change deserving the same deliberate-confirmation treatment as Language.

---

# 9. Notification Preferences

**Purpose:** control which events produce which notification tier for this professional — directly referencing the Notification Hierarchy already locked in `frontend_architecture.md` Section 11.5 (Critical Alert > Page Banner > Inline Alert > Toast).

**Layout:**
```
[ Section title: "Notifications" — H2 ]
[ muted subline: "Control what you're notified about and how." ]

[ Toggle: "Pending review reminders" ]
[ Toggle: "New analysis completed" ]
[ Toggle: "Escalation updates on cases you've reviewed" ]

[ Divider ]

[ Toggle: "Critical Emergency alerts" ]  — disabled, always ON, with
  helper text: "Critical Emergency notifications cannot be turned off,
  to ensure urgent cases are never missed."
```

**Critical Alert toggle is the one deliberately non-configurable row on this entire page** — rendered visually identical to the other toggles but in a fixed "on" position with a disabled interactive state (per components.md's Disabled state rules: reduced opacity, no hover, cursor not-allowed) — this is an intentional, visible constraint, not a bug: a professional should be able to see that this protection exists and cannot be accidentally disabled, which is itself a trust-building detail for a clinical safety product.

**Save behavior:** identical Save button + Toast pattern as Profile (Section 4) — toggles do not apply individually on click; they batch into a single Save to avoid firing a confirmation Toast for every checkbox click, which would be noisy and inconsistent with the "never distracting" interaction philosophy.

---

# 10. Privacy Settings

**Purpose:** directly surfaces the data-minimization principles already committed to in `privacy_and_safety.md`, giving the professional visible, actionable control rather than leaving privacy as a backend-only implementation detail.

**Layout:**
```
[ Section title: "Privacy" — H2 ]
[ muted subline: "Control how conversation data is handled and retained." ]

[ Toggle: "Avoid storing raw conversation text after analysis" ]
  helper text: "When enabled, only the structured analysis result is
  retained. The original conversation cannot be re-viewed later."

[ Toggle: "Anonymous processing" ]
  helper text: "Detected personal information is removed before any
  AI analysis begins. This setting is enabled by default and
  recommended for all cases."

[ Select: "Data retention period" ] — 30 days / 90 days / 1 year / Indefinite
```

**Consequential toggle handling:** "Avoid storing raw conversation text" is the one Privacy toggle that materially changes what a professional can do later (they lose the ability to re-open the original Conversation Viewer for past cases) — toggling it **on** triggers the standard Confirmation Dialog pattern already established for Override/Escalate (dashboard_spec.md Section 16), since this is a real, consequential trade-off a professional should confirm deliberately, not a simple preference. Toggling it back **off** does not require confirmation (disabling a restriction is the low-friction direction, consistent with the proportional-friction principle in `frontend_architecture.md` Section 1.2).

**"Anonymous processing" toggle:** defaults to on for every professional and every clinic-level account; turning it off is possible (some research/testing contexts may require raw signal for evaluation purposes) but also passes through the same Confirmation pattern, with copy explicitly naming the trade-off: "Turning this off means personal information will not be removed before analysis. Are you sure?"

---

# 11. Security Settings

**Purpose:** password and authentication-adjacent controls. Per `frontend_architecture.md` Open Question 18.2, no full multi-user authentication system currently exists — this section is specified as **UI-complete but state-non-persistent**, using the same documented caveat already applied to the Human Review Panel elsewhere in the product, rather than being omitted or silently faked as fully functional.

**Layout:**
```
[ Section title: "Security" — H2 ]
[ muted subline: "Manage how you sign in to your account." ]

[ Input: Current password ]
[ Input: New password ]
[ Input: Confirm new password ]
[ Save button — Primary ]

[ Divider ]

[ Toggle: "Two-factor authentication" ] — disabled, with helper text:
  "Coming soon. Two-factor authentication will be available once
  multi-user account support is added."
```

**Two-factor row is intentionally shown but disabled**, not hidden — communicating the roadmap honestly to the professional rather than pretending the feature doesn't exist, consistent with the product's broader ethic of transparency about its own limitations (the same ethic that governs the Human Review Panel's non-persistence disclosure).

**Password change validation:** standard inline field validation (matching requirements, confirm-match check) before Save is enabled; Save triggers the standard spinner-in-button + Toast pattern.

---

# 12. Session Management

**Purpose:** visibility and control over where this professional is currently signed in — directly relevant to a clinical tool handling sensitive data, even ahead of full multi-user auth.

**Layout:**
```
[ Section title: "Sessions" — H2 ]
[ muted subline: "Devices and locations currently signed in to your account." ]

[ List of session rows: ]
  [ Device/browser icon ] [ "Chrome on macOS" ] [ "This device" Badge if current ]
  [ Location (city-level) · Last active timestamp ]                [ "Sign out" text-button ]

[ Divider ]

[ Button — Secondary: "Sign out of all other sessions" ]
```

**Row structure:** matches the general list-row visual language used in History/Reports (Card-based rows, 16px vertical padding) but without risk badges or clinical iconography — this is an account-management list, and must not borrow the "case list" visual vocabulary, keeping the two mental models (clinical records vs. account administration) visually distinct.

**"Sign out" (single session):** immediate action, no confirmation required — this only affects the current professional's own access, is easily reversible (sign back in), and is a low-consequence action per the proportional-friction principle.

**"Sign out of all other sessions":** requires Confirmation (Dialog, standard pattern) since it's a broader action affecting potentially-active work on another device — copy: "This will sign you out everywhere except this device. Continue?"

---

# 13. Account Management

**Purpose:** the danger-zone section — always last in the sub-nav (Section 2), always the quietest header treatment despite containing the highest-consequence actions on the entire page, consistent with the product's established principle that visual restraint and confirmation friction — not alarming color or emphasis — communicate consequence.

**Layout:**
```
[ Section title: "Account" — H2, same weight/size as every other
  section title on this page — never styled as a "warning" header ]

[ Button — Secondary: "Export my data" ]
  helper text: "Download a copy of your profile and account settings."

[ Divider ]

[ Button — Danger: "Delete account" ]
  helper text: "Permanently deletes your account and profile.
  Conversation and case data ownership is governed by your
  organization's data retention policy and may not be deleted."
```

**"Delete account" is the single highest-friction action in this entire specification:**
1. Click opens a Confirmation Dialog (Danger-variant Confirm button, standard focus-trap behavior).
2. The dialog requires the professional to type their own account email (or a literal confirmation phrase) into a text field before the Confirm button becomes enabled — a stricter variant of the standard "required notes field" pattern used for Override (dashboard_spec.md Section 16), justified because this action is irreversible in a way Override is not (Override can be re-reviewed; account deletion cannot).
3. On confirm, a final Toast is not sufficient acknowledgment — the professional is redirected to a full-page confirmation state (a simple centered message: "Your account has been deleted.") rather than remaining in the now-invalid Settings page, matching the Auth/session-invalid full-page-interrupt pattern already defined in `frontend_architecture.md` Section 10.

---

# 14. Loading States

**Initial Settings page load:** skeleton form matching each section's real field count and shape — the sub-nav rail itself never skeletonizes (it's static, known content, not data-dependent) and renders immediately; only the Content Area shows skeleton Input/Toggle-shaped blocks while the professional's current preferences load.

**Section switch (rail click):** identical 180ms crossfade transition already defined (Section 3) — if the newly-selected section's data hasn't been pre-fetched, a brief localized skeleton (matching that section's field shapes) appears within the Content Area only, never a full-page reload feel.

**Save operations (any section):** the button-embedded spinner pattern (Sections 4, 9, 11) is the only loading treatment used for any Save action across all eight sections — no section introduces a different saving pattern.

---

# 15. Empty States

Settings has minimal applicability for the universal Empty State system, since most sections are forms with sensible defaults rather than data collections. The one true empty-state-relevant case:

| Context | Icon concept | Message | Action |
|---|---|---|---|
| Sessions list, hypothetically zero other sessions (only this device ever signed in) | *(not a true empty state — the current-device row always renders)* | N/A | N/A |

**Conclusion:** no full Empty State pattern instance is required anywhere on this page — Settings is the one template in the product where this section can be this short, and that brevity is itself correct, not a gap.

---

# 16. Error States

| Context | Presentation | Recovery |
|---|---|---|
| Settings fails to load initially | Full Content Area error state: calm icon + "We couldn't load your settings." + Retry button. Sub-nav rail remains visible/clickable, though switching sections while the initial load has failed simply re-triggers the same error for the newly selected section. | Retry re-fetches |
| Save fails (any section) | Save button returns to default state; inline error notice appears directly beneath the button: "Couldn't save changes — please try again." Field values already entered are preserved, never cleared on failure. | Re-click Save |
| Password change fails (wrong current password) | Inline error beneath the "Current password" field specifically: "Current password is incorrect." — never a generic top-of-form error for a field-specific failure | Correct and resubmit |
| Session "Sign out" action fails | Inline error notice beneath that specific session row: "Couldn't sign out this session." Row remains in the list (not optimistically removed until confirmed) | Retry the row's Sign out action |
| Account deletion fails | Confirmation Dialog remains open, shows an inline error within the dialog itself rather than closing and losing the professional's confirmation input: "Something went wrong — your account has not been deleted." | Retry within the still-open dialog |

Same governing rule as every prior specification: **an error never removes access to data already rendered or already entered** — a failed Save never clears the form fields the professional just filled in.

---

# 17. Accessibility Requirements

- Full keyboard operability across the sub-nav rail, every form control, every Toggle, and every action button, in visual reading order.
- Sub-nav rail behaves as a standard tab-like listbox: Arrow Up/Down move between section items when the rail has focus, Enter activates the focused section — consistent with the composite-widget navigation pattern already established for tab groups elsewhere (`frontend_architecture.md` Section 12.1).
- Every Toggle carries an explicit, programmatically associated label (not just adjacent visual text) and announces its current state ("on"/"off") to assistive technology — critical here specifically because several toggles (Critical Alerts, Two-Factor) are disabled/locked, and that locked state must also be announced, not just visually implied via reduced opacity.
- The "Delete account" Confirmation Dialog's required-text-match field is announced clearly via `aria-describedby`, explaining exactly what must be typed before the Confirm button activates — this is the single most consequence-heavy interaction in the product and must not rely on sighted-only comprehension of the confirmation mechanism.
- Contrast: WCAG AA minimum throughout, including the "Increase Contrast" toggle's own before/after states (both must independently pass AA — the toggle raises contrast further, it is not compensating for a baseline that fails AA on its own).
- Minimum 44px touch target on every interactive control, including individual session "Sign out" text-buttons and the sub-nav rail's text-only items (which have no icon to help meet the target visually, but the tap/click target itself is still enforced at 44px regardless of the visible text's smaller footprint).
- Disabled controls (Critical Alerts toggle, Two-Factor toggle) remain focusable and are announced as "disabled" to screen readers, rather than being removed from the tab order entirely — a professional using assistive technology should be able to discover that these controls exist and why they're locked, matching the same transparency principle applied to their sighted presentation.

---

# 18. Responsive Behaviour

**Desktop/Laptop (≥1024px):** full two-column layout as specified — 240px sub-nav rail + 720px-constrained Content Area, per Section 1.

**Tablet (768–1023px):** sub-nav rail collapses into a horizontal top strip of the same eight section labels, rendered as a scrollable single-row tab bar (underline-indicator style, matching the Analysis Workspace's tab group visual treatment for consistency) directly beneath the "Settings" page heading; Content Area becomes full-width beneath it, still constrained to a comfortable reading/form width (reduces to ~600px given the narrower viewport, never stretching form fields edge-to-edge).

**Mobile (≤767px):** sub-nav collapses into a **stacked accordion** — each of the eight section titles renders as a full-width, tappable header; tapping expands that section's form content inline (accordion expand/collapse motion, 240ms height/opacity, matching the general Accordion component behavior already defined in components.md), with only one section expanded at a time by default to avoid an extremely long single-scroll page. This matches `frontend_architecture.md` Section 5.6's explicit mobile behavior ("sub-nav collapses to a stacked accordion above the form content").

**Danger-zone accordion behavior on mobile:** "Account" remains the last accordion item, exactly as on desktop — its position in the list is never reordered or specially demoted/promoted at any breakpoint.

---

# 19. Component Usage

Drawn only from the locked taxonomy, using exclusively the components named in the brief.

| Component | Settings usage |
|---|---|
| Button (Primary) | Save actions (Profile, Notifications, Security, Language, Text Size) |
| Button (Secondary) | "Sign out of all other sessions," "Export my data," Retry-style actions |
| Button (Danger) | "Delete account," Confirm button inside the deletion Confirmation Dialog |
| Button (Ghost/Text) | "Change photo," individual session "Sign out" actions, "Retry" links |
| Toggle | Reduce Motion, Increase Contrast, Underline Links, all Notification toggles, both Privacy toggles, Two-Factor (disabled) |
| Select | Text Size, Language, Data Retention Period |
| Input | Full Name, Professional Title, Email, Current/New/Confirm Password |
| Card | Session rows (list-item Card, no elevation change) |
| Badge | "This device" indicator on the current session row |
| Dialog / Confirmation | Enabling "Avoid storing raw conversation text," disabling "Anonymous processing," "Sign out of all other sessions," "Delete account" |
| Toast | "Profile updated," "Preferences saved," and equivalent low-priority Save confirmations |
| Skeleton | Initial page load, section-switch load if data isn't pre-fetched |

No Table, Chart, Timeline, Heatmap, or any AI-visualization component appears anywhere on this page — Settings is exclusively a Foundations/Inputs/Feedback-category page per components.md's taxonomy, with zero AI Components category usage, which is itself a meaningful, correct constraint given this is a management page, not an analysis page.

---

# 20. Motion

All durations and easing draw from the single locked scale (Fast 120ms / Normal 220ms / Slow 350ms / Maximum 600ms hard ceiling; ease-out primary, ease-in-out secondary) — no new motion vocabulary introduced for this page.

| Interaction | Duration | Easing |
|---|---|---|
| Page entrance | 250ms, 12px upward translate | ease-out |
| Sub-nav section switch (Content Area crossfade) | 180ms | ease-in-out |
| Theme token crossfade (on Theme change) | 220ms | ease-in-out |
| Toggle thumb slide | 180ms | ease-out |
| Save button loading-state transition (label ↔ spinner) | 180ms crossfade | ease-in-out |
| Toast entrance/exit | 220ms entrance / 180ms exit | ease-out / ease-in |
| Confirmation Dialog open/close | 220ms fade + scale (0.96→1) | ease-out |
| Mobile accordion section expand/collapse | 240ms height/opacity | ease-out |
| Tablet tab-strip underline indicator movement | 180ms | ease-in-out |

Nothing on this page introduces a new duration or easing curve; nothing loops; nothing exceeds the 600ms Maximum tier — in fact, Settings is among the calmest pages motion-wise in the entire product, appropriately, since its purpose is administrative clarity, not reasoning or discovery.

---

# 21. Keyboard Navigation

Explicit tab order, top to bottom, matching visual layout:

**Desktop/Laptop:**
1. Each sub-nav rail item, in displayed order (Arrow Up/Down enhancement available while the rail has focus, per Section 17)
2. Within the active section's Content Area: each form field / toggle / select, top to bottom, in the exact order shown in that section's layout diagram above
3. The section's Save button (where applicable), last in that section's tab sequence

**Tablet:** identical Content Area order; the horizontal tab strip supports Left/Right Arrow key navigation between section tabs, mirroring the Analysis Workspace tab group's own keyboard behavior for consistency.

**Mobile:** each accordion header is a Tab stop; Enter/Space toggles expand/collapse; when expanded, that section's fields follow immediately in tab order before reaching the next accordion header — collapsed sections' fields are correctly removed from the tab order entirely (not just visually hidden), preventing a keyboard user from tabbing into invisible content.

**Shortcuts specific to this page:** none beyond the global `⌘K`/`Ctrl+K` Command Palette, which remains available identically here as everywhere else. `Escape` closes any open Confirmation Dialog or Popover without applying pending changes, matching the system-wide Escape behavior.

---

# 22. Interaction Rules

- **Two distinct apply-behaviors exist on this page, and every control's behavior must match one of them exactly, never a third invented pattern:** (a) **Instant-apply** controls (Theme, Contrast, Underline Links) change immediately on interaction with a token crossfade, no Save button involved; (b) **Save-gated** controls (Profile fields, Notification toggles, Language, Text Size, Password, most Privacy/Security fields) require an explicit Save action and batch their changes into one confirmation. The dividing line: instant-apply is reserved for purely cosmetic, freely-reversible, single-user-impact settings; Save-gated is used for anything involving multiple related fields, anything sent to a backend record, or anything where batching prevents redundant confirmations.
- **Confirmation Dialogs are reserved exclusively for genuinely consequential actions** (enabling raw-conversation-deletion, disabling anonymization, signing out all sessions, deleting the account) — this page must never introduce a Confirmation Dialog for a low-consequence action (e.g., there is no confirmation for simply signing out of the current single session, or for toggling a Notification preference), maintaining the proportional-friction principle exactly as applied on Dashboard.
- **No setting on this page ever silently changes a different setting.** Toggling "Avoid storing raw conversation text" does not, for example, silently also change the Data Retention Period selector — each control governs exactly the behavior its label describes, and any genuinely interdependent settings (none currently exist in this spec) would need to be explicitly surfaced to the professional, not resolved invisibly.
- **The Account section's danger-zone actions never appear anywhere else in the product** — there is no shortcut, quick-action, or Command Palette entry for "Delete account," ensuring this action is only ever reached via its full, deliberate path through Settings.

---

# 23. Premium UX Details

- **The sub-nav rail's 240px width deliberately echoes the Shell Sidebar's own width** — a small, easily-missed structural rhyme that reinforces "you are still inside one consistent product," even on the one page that otherwise looks quite different (form-heavy, hero-less) from the rest of the app.
- **The visually calm, non-alarming treatment of the Account/danger-zone section** — same H2 weight as every other section header, no red banner, no warning iconography — is itself the premium, confident choice; a project that reaches for scary red warning boxes on account deletion is signaling anxiety about its own destructive actions, whereas quiet, deliberate friction (the type-to-confirm field) signals actual engineering discipline.
- **Two-Factor Authentication is shown, disabled, with an honest "coming soon" note** rather than hidden — a small detail that tells a reviewing professional (or a competition judge) that the product is candid about its current maturity rather than pretending completeness it doesn't yet have.
- **Theme state is shared, not duplicated, between the Top Navigation quick-toggle and this page's full Segmented Control** — a professional who flips theme from the Nav and later opens Settings sees the correct selection already reflected, never a stale or contradictory state between the two entry points.
- **Instant-apply vs. Save-gated is a considered, documented distinction (Section 22)**, not an inconsistency — every control's behavior is predictable once a professional learns the pattern once, which is the hallmark of a settings page that feels engineered rather than assembled ad hoc screen-by-screen.
- **Session rows deliberately avoid the clinical visual language** (no risk badges, no case-list styling) used everywhere else in the product — a small but important detail that keeps "administering your account" and "reviewing a patient conversation" from ever bleeding into the same visual register, which matters in a tool where the two contexts carry very different emotional weight.

---

**End of Settings Page High-Fidelity Specification.**
Ready for engineering handoff pending your review. This document, together with `frontend_architecture.md`, `landing_spec.md`, `dashboard_spec.md`, `history_spec.md`, and `reports_spec.md`, now covers the authenticated Shell and five of the product's core screens. Awaiting direction on the next screen to specify (Documentation/API, New Analysis submission, or About).
