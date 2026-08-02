# Mental Health Safety Analyzer — High-Fidelity UI Specification
## Phase 2 · Screen 1: Landing Page

**Document type:** Production design handoff
**Audience:** Senior Frontend Engineer
**Status:** Ready for build
**Tokens referenced below are drawn directly from the locked design system** (design.md): 8pt spacing scale, Inter typography, Blue/Purple/Cyan/Green/Amber/Red state colors, 16–24px radii family, soft-shadow elevation, and the 120/220/350/600ms motion scale. No new tokens are introduced in this document.

---

## 1. Overall Layout

The Landing Page is a single vertical scroll, five zones, no horizontal scroll at any breakpoint. It is intentionally short — this is not a marketing site with a dozen sections; it's a calm, confident front door to a clinical tool.

```
┌───────────────────────────────────────────┐
│ 01 — Top Navigation (sticky, transparent → solid on scroll)
├───────────────────────────────────────────┤
│ 02 — Hero Zone
├───────────────────────────────────────────┤
│ 03 — Trust / Principles Zone
├───────────────────────────────────────────┤
│ 04 — Workflow Zone (Conversation → AI → Report → Professional)
├───────────────────────────────────────────┤
│ 05 — Footer
└───────────────────────────────────────────┘
```

Content is centered within a **1440px max-width container**, with outer margins matching the design system's 64px desktop / 40px tablet / 20px mobile rule. No zone touches the viewport edge on desktop — whitespace is treated as an active trust signal, per design.md's "Empty Space" principle, not wasted space.

Vertical rhythm between zones uses the **largest steps of the 8pt scale** (96px and 128px), reinforcing that this page breathes. Nothing on this page uses tight, dashboard-density spacing — that vocabulary is reserved for the application itself, which creates a subtle but deliberate *tonal shift* between "arriving at the product" and "working in the product."

---

## 2. Visual Hierarchy

Strict single-focus-per-viewport rule, matching the "One Hero Per Screen" law from the locked documentation:

1. **First fold:** one sentence of positioning + one primary action. Nothing competes with it.
2. **Second fold:** the four core principles (Explainability, Privacy, Human Oversight, Responsible AI), presented as equal-weight, quiet, non-competing blocks — deliberately calmer than the hero, so the eye rests after the first, more confident statement.
3. **Third fold:** the workflow diagram — the only illustrative/diagrammatic element on the page, given full visual permission to be the most detailed thing here because it *is* the product's real differentiator.
4. **Fourth fold:** footer — quietest zone, smallest type, purely utility.

No zone after the hero uses a large display headline again — headline size is spent once, deliberately, to avoid the page feeling like a stack of equally loud banners (a known weakness of generic SaaS landing pages the source docs explicitly warn against).

---

## 3. Hero Section

### Structure
```
[ small eyebrow label: "AI-Assisted Clinical Decision Support" ]

        Understand conversations.
        Support the professional decision.

   AI-powered analysis that helps mental health
   professionals detect distress and risk signals —
   explainably, privately, and always under human review.

   [ Primary Button: Open Dashboard ]   [ Ghost link: Read the documentation ]

   [ subtle trust microcopy: "Not a diagnostic tool. Every decision remains
     with a licensed professional." ]
```

### Composition details
- Headline is two lines, center-aligned, generous line-height (not tight display type) — this is the one place in the entire product allowed a moment of quiet confidence rather than dense information density.
- Eyebrow label sits above the headline in the accent Cyan, small caps disabled per design.md ("No uppercase" rule applies system-wide including here) — instead rendered in medium weight, letter-spacing very slightly open, small size, muted rather than shouting.
- Subheadline (the descriptive sentence) is body-large, muted foreground color, max-width constrained to ~640px so line length stays readable — never spans the full 1440px container.
- Trust microcopy sits below the CTA row, smallest type in the hero, quiet — present but not defensive-looking. This is a legal/ethical necessity handled with restraint, not a disclaimer banner.

### Background treatment
No gradient wash, no hero illustration, no stock photography (explicitly prohibited by the "Avoid Decoration" and "Avoid Aggressive Colors" anti-patterns). Instead: a single, extremely subtle **static structural motif** — a faint, large-scale rendering of the AI pipeline's node-and-connection pattern, positioned behind and to the right of the text block, at very low opacity against the background. It is felt, not read. This gives the hero an "AI-native" identity (per the Visual Identity keywords) without resorting to decoration for decoration's sake — it is literally a preview of the product's own signature visualization, reused as an ambient texture.

---

## 4. Navigation

Marketing-context Top Navigation — a variant of the application's Top Nav, not the full app chrome (no Sidebar exists on this page).

```
[ Logo + Wordmark ]         [ Docs   API   About ]         [ Theme ]  [ Open Dashboard ]
```

- Height: 72px, matching the app-wide standard so the transition into the product later feels continuous, not jarring.
- **Transparent over hero**, transitioning to a solid surface color with a 1px bottom border and soft shadow once the user scrolls past the hero fold — a single, quick 220ms opacity/background crossfade, not a hard cut.
- Right-aligned primary action ("Open Dashboard") is the only button-styled element in the nav; the three text links (Docs/API/About) are low-emphasis text buttons — this preserves the "one primary action" rule even inside the navigation bar itself.
- Sticky throughout the full scroll.

---

## 5. CTA Strategy

- **Exactly one Primary Button exists on this entire page**: "Open Dashboard" — it appears in two locations (Top Nav and Hero) but is styled identically and treated as *the same action*, not two competing CTAs. This is a deliberate reinforcement pattern common in premium SaaS (Linear/Vercel do this) rather than a duplication error.
- **One secondary, low-emphasis action** exists beside it in the hero: "Read the documentation" — rendered as a Ghost or Text button, never competing in visual weight with Primary.
- No pricing CTA, no "Sign up free," no urgency language, no countdown, no growth-hacking pattern of any kind — inconsistent with the calm/clinical/trustworthy identity mandated throughout the documentation.
- Footer contains only utility links (License, GitHub, Documentation), no repeated CTA — the page trusts the hero to have done its job once.

---

## 6. AI Visual Elements

Only two AI-related visual elements appear on this page — deliberately restrained, since Landing is a threshold, not the product itself:

1. **The ambient pipeline motif** described in Section 3 — static, no motion, extremely low opacity, purely atmospheric.
2. **The Workflow Zone diagram** (Section 8/Fourth fold): a horizontal, static rendering of `Patient → Text Conversation → AI Analysis → Structured Report → Mental Health Professional → Final Clinical Decision`, using the same visual language (connector lines, node shapes, Blue/Purple accenting) that the real in-app AI Pipeline component will use later. This is intentional — it's a preview/promise of the interaction pattern the user will actually experience once inside the product, giving the landing page narrative continuity rather than being generic marketing decoration.

No Risk Gauges, Emotion Timelines, or Fusion Cards appear here — those are earned/contextual components that only make sense next to real data, and showing them empty or fabricated on a marketing page would undermine the "no hardcoded content" principle in spirit, even though this is public marketing surface, not the authenticated app.

---

## 7. Motion Design

Motion on this page is minimal and exists only to ease arrival — never to entertain.

| Element | Motion | Duration | Easing |
|---|---|---|---|
| Nav background | transparent → solid crossfade on scroll threshold | 220ms | ease-in-out |
| Hero content | fade + 12px upward translate on initial page load only | 250ms | ease-out |
| Trust Zone blocks | staggered fade + translateY(20px) as they enter viewport | 300ms, 80ms stagger | ease-out |
| Workflow diagram | connector lines draw in sequentially as the zone enters viewport (a restrained, one-time echo of the in-app Pipeline animation) | 350ms per segment | ease-out |
| Buttons | hover: scale 1.02 + brightness; press: scale 0.98 | 180ms / 120ms | ease-out |

No looping animation, no parallax, no auto-playing background video. The Workflow diagram's sequential draw-in is the single moment of "signature" motion on this page — everything else is functional easing, not spectacle. This matches the explicit rule that motion must "communicate progress, transition, hierarchy, or state change" and nothing else.

---

## 8. Responsive Behaviour

**Desktop (≥1280px)**
- Full layout as specified, 1440px max container, 64px outer margins.
- Workflow diagram renders horizontally.

**Tablet (768–1279px)**
- Outer margins reduce to 40px.
- Hero headline remains two lines but font-size steps down one level in the type scale.
- Trust Zone blocks reflow from a 4-column row to a 2×2 grid.
- Workflow diagram remains horizontal but compresses node spacing; if it no longer fits comfortably, it becomes horizontally scrollable within its own zone (contained scroll, not page scroll) rather than shrinking illegibly.

**Mobile (≤767px)**
- Outer margins reduce to 20px.
- Nav collapses: Docs/API/About move into a simple overflow menu (icon button), Logo and "Open Dashboard" remain visible — the single CTA is never hidden on mobile.
- Hero: headline drops to single-scale-step-smaller size, still two lines if possible; CTA row stacks vertically, Primary Button full-width, Ghost link centered beneath it.
- Trust Zone: single column, one block per row.
- Workflow diagram: **re-flows to vertical**, matching the down-arrow structure already used natively in the source documentation's own workflow diagrams — this is not a compromise, it's actually the diagram's original documented orientation.

---

## 9. Empty States

Not applicable — the Landing Page is entirely static, unauthenticated marketing content with no data-dependent regions. No loading, empty, or error states exist on this screen. (First data-dependent empty state appears on Dashboard, per the Phase 1 spec.)

---

## 10. Accessibility Considerations

- Headline and all body text meet WCAG AA contrast against their respective light/dark backgrounds; the ambient pipeline background motif is rendered at low enough opacity that it never interferes with text contrast — verified independently of decorative intent.
- All interactive elements (Nav links, both CTAs, footer links) have a minimum 44px touch target regardless of visual size, per the system-wide accessibility rule.
- Focus states use the standard 2px visible focus ring on every interactive element — never suppressed, including on the transparent-nav state.
- The Workflow diagram's sequential draw-in animation and the ambient background motif are both **fully disabled** under `prefers-reduced-motion`; content appears instantly in its final state with no functional loss — nothing on this page communicates information exclusively through motion.
- Heading structure is semantic and linear: one H1 (hero headline), H2s for each subsequent zone title — no skipped levels, supporting screen-reader navigation via landmarks.
- The workflow diagram includes an accessible text-equivalent (a visually-hidden ordered list mirroring the diagram's steps) so its meaning survives for assistive technology and doesn't rely on visual node/connector interpretation.

---

## 11. Component Usage

Drawing only from the locked component taxonomy (components.md):

| Component | Usage |
|---|---|
| Button — Primary | "Open Dashboard" (Nav + Hero) |
| Button — Ghost / Text | "Read the documentation," footer links, nav utility links |
| Card — Default | Trust Zone principle blocks (4×, minimal padding, no border emphasis, no shadow — flattest possible Card variant, since this zone is intentionally the calmest on the page) |
| Divider | Subtle separation between Workflow Zone and Footer only — no dividers elsewhere on the page, whitespace does that job everywhere else |
| Icon | Small, single-color icons only inside the Trust Zone cards (one per principle) — no icon anywhere else on the page |

No Table, Modal, Toast, Tabs, Accordion, or Badge components appear on Landing — those belong entirely to the authenticated application and their absence here is intentional, reinforcing that Landing is a distinct, quieter register from the product itself.

---

## 12. Exact Spacing Strategy

Using only the locked 8-point scale (4/8/12/16/24/32/40/48/64/80/96/128):

- **Nav height:** 72px (fixed system value, not part of the spacing scale itself)
- **Nav horizontal padding:** 64px desktop / 40px tablet / 20px mobile (matches outer margin)
- **Hero top padding (below nav):** 128px desktop / 96px tablet / 64px mobile
- **Hero internal stack gap** (eyebrow → headline → subheadline → CTA row → trust microcopy): 24px between each element
- **Hero bottom padding / gap to next zone:** 128px desktop / 96px tablet / 64px mobile
- **Trust Zone card grid gap:** 24px (matches the system's documented card-grid gutter)
- **Trust Zone card internal padding:** 24px desktop / 20px tablet / 16px mobile (matches the system's card padding rule exactly)
- **Workflow Zone top/bottom padding:** 128px desktop / 96px tablet / 64px mobile
- **Workflow diagram node spacing:** 64px horizontal gap desktop, compressing to 40px at tablet before switching to scroll/vertical
- **Footer padding:** 64px top / 48px bottom desktop, 40px/32px mobile
- **Footer internal link spacing:** 32px between groups, 16px between individual links within a group

No arbitrary pixel values appear anywhere in this section — every measurement maps directly to a scale step, per the explicit "never use random values" rule.

---

## 13. Grid Usage

- **Desktop:** 12-column grid, 24px gutter, 1440px max content width, 64px outer margin (as locked).
  - Hero text block occupies columns 1–7 (left-weighted, not centered as a block — though the container itself is horizontally centered on the page). This asymmetry is what gives the hero a more editorial, premium feel versus a purely centered "generic SaaS" hero, while the ambient pipeline motif occupies the visual space of columns 8–12.
  - Trust Zone: 4 cards, each spanning 3 columns, in a single row.
  - Workflow Zone: full 12-column width, diagram nodes distributed evenly across it.
- **Tablet:** 8-column grid. Hero text becomes full-width, center-aligned (asymmetry is a desktop-only luxury — at tablet width it would just look unbalanced). Trust Zone cards become 2 per row (4 columns each).
- **Mobile:** 4-column grid, effectively single-column for all content blocks.

---

## 14. Typography Hierarchy

All type is Inter (system fallback: Segoe UI, Helvetica, Arial), per the locked typography system. Tabular figures are not relevant on this page (no numeric data displayed).

| Role | Usage | Weight | Approx. Scale Step |
|---|---|---|---|
| Eyebrow label | "AI-Assisted Clinical Decision Support" | Medium (500) | Caption-size, slightly increased letter-spacing |
| H1 — Hero Headline | "Understand conversations. Support the professional decision." | Bold (700) | Largest step on the page — reserved exclusively for this one instance |
| Body-Large | Hero subheadline | Regular (400) | One step below H1, muted foreground color |
| Trust microcopy | "Not a diagnostic tool..." | Regular (400) | Caption-size, muted |
| H2 — Zone titles | "Built on responsible AI principles," "How it works" | Semibold (600) | Section-title scale, consistent across Trust and Workflow zones |
| Body | Trust Zone card copy, Workflow node labels | Regular (400) | Standard body scale |
| Footer | All footer text | Regular (400) | Caption scale, muted foreground |

Only **one H1 exists on the entire page** — this is a deliberate hierarchy anchor, and no other element, including the Workflow Zone title, is permitted to visually compete with it in size or weight.

---

## 15. Color Usage

Strictly from the locked palette (Blue primary / Purple secondary / Cyan accent / Green–Amber–Red state colors / neutral surfaces):

- **Background:** Pure white (light mode) / deep gray, never pure black (dark mode) — as locked.
- **Primary Button:** Blue — the single largest saturated color moment on the page, appearing in exactly two places (Nav, Hero), reinforcing brand/trust association per the documented color purpose ("Trust, Artificial Intelligence, Technology, Professionalism").
- **Eyebrow label + ambient pipeline motif accents:** Cyan, at very low opacity for the motif, full opacity for the eyebrow text — Cyan's documented purpose is "Interactive Elements, Highlights, Information," which fits both usages.
- **Workflow diagram connectors:** Purple, referencing its documented purpose ("Explainability, AI Processing, Fusion Engine") — this is a deliberate, meaningful color choice, not decorative: it visually foreshadows that Purple = "the AI is reasoning" once the user reaches the real product.
- **Trust Zone icons:** neutral/foreground color, not state colors — Safe/Warning/Danger greens/ambers/reds are reserved entirely for actual risk communication inside the app and never appear on marketing surfaces, avoiding any risk of a visitor misreading marketing content as a clinical signal.
- **Text:** near-black/near-white foreground for headlines, muted gray-scale token for body and captions — no colored body text anywhere on the page.

No gradients are used at any point on this page, consistent with the "Avoid Decorative gradients" anti-pattern — including within the ambient motif, which is single-hue at varying opacity, not a gradient wash.

---

## 16. Interaction Details

- **Primary Button (Nav + Hero):** default state Blue fill; hover raises brightness slightly and scales to 1.02 with elevation increase; press scales to 0.98 with reduced shadow; focus shows the standard 2px accessible focus ring; no loading state needed here (this button only navigates, it doesn't submit).
- **Ghost/Text links:** hover shifts to full-opacity foreground color from muted, no background fill introduced, underline optional micro-detail on hover only (not persistent) — keeps these visually quiet at rest.
- **Nav scroll transition:** triggered once the hero's bottom edge crosses the nav's bottom edge — a single threshold, not a continuous scroll-linked opacity (which would feel busy/jittery on fast scrolls, contrary to the "never distracting" instruction).
- **Trust Zone cards:** static, non-interactive — no hover elevation, since design.md reserves hover/lift motion specifically for *Interactive* Cards, and these are informational-only, not clickable.
- **Workflow diagram:** static after its one-time entrance animation — no hover-to-explore interaction on Landing (that richer, hoverable version is reserved for the real in-app Pipeline component, giving users a reason to actually go use the product rather than fully exploring it here).

---

## 17. Micro-interactions

- Button press feedback (120ms scale-down) on both CTA buttons — immediate, tactile, per the global click-motion rule.
- Nav logo: no hover animation beyond the standard link/pointer cursor change — logos should feel stable, not playful, in a clinical product.
- Footer links: standard text-color hover shift only, 180ms, no underline sweep or other decorative flourish.
- Theme switch toggle: smooth icon crossfade (sun/moon or equivalent) over 220ms when toggled, with the whole page's color tokens transitioning together rather than snapping instantly — this single detail does a lot of work in making the product feel "premium" rather than generic, and is worth explicit engineering attention.

No micro-interaction on this page exceeds the 350ms "slow" tier — the page should always feel immediately responsive, never sluggish, in keeping with the "trust through transparency, not decoration" principle.

---

## 18. Scroll Behaviour

- Native smooth scroll only (CSS-level), no custom scroll-jacking, no snap-scrolling between zones — the source documentation is explicit that navigation should never surprise the user, and hijacked scroll is a classic violator of that rule.
- Section Reveal pattern (fade + translateY(20px), 300ms, 80ms stagger) applies to the Trust Zone cards and Workflow diagram nodes as they individually cross into viewport — using the exact parameters already defined in the locked motion system's "Section Reveal" spec, not a new pattern invented for this page.
- Nav's transparent-to-solid transition (Section 4/17) is the only scroll-position-dependent visual change on the page; everything else is a one-time entrance, not a continuous scroll-driven effect — deliberately limiting scroll-linked motion to a single, purposeful instance.
- No "back to top" affordance is needed — the page is short enough (five zones) that this would be over-engineering for its own length.

---

## 19. Premium Visual Details

These are the details that separate this from a generic template landing page and are worth explicit engineer attention:

- **Asymmetric hero composition** (text left-weighted, ambient motif right) rather than centered-everything — the single highest-leverage detail for making this feel like Linear/Vercel rather than a generic SaaS template.
- **The ambient pipeline motif reappearing, literally, as the real in-app component later** — a continuity detail a user may not consciously notice but which makes the whole experience feel authored as one system rather than "marketing site" + "separate app."
- **Exactly one saturated color moment (Blue CTA) per viewport at any scroll position** — nothing else on screen ever competes with it chromatically, which is what makes restrained interfaces feel expensive rather than sparse.
- **Tabular alignment discipline**: even though there's no numeric data on this page, all card grids, diagram nodes, and footer columns snap to the same 12-column grid as the rest of the product — meaning a user who later opens the Dashboard will feel zero structural discontinuity.
- **Theme-switch color transition** (Section 17) — a small but telling detail; abrupt light/dark snaps read as unfinished, while a smooth token crossfade reads as intentional craftsmanship.
- **Trust microcopy placement and tone** — positioned quietly beneath the CTA rather than as a disclaimer bar at the top or bottom of the page, treating the ethical stance as part of the product's confidence rather than a legal afterthought bolted on.

---

**End of Landing Page High-Fidelity Specification.**
Ready for engineering handoff. Awaiting your review before proceeding to the **Dashboard** screen.
