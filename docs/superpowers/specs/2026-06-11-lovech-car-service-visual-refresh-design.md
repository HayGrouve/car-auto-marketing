# Design Spec: Lovech Car Service — Visual Refresh (v2)

## Status

- **Approved:** 2026-06-11
- **Supersedes:** Visual/UX sections of `2026-06-11-lovech-car-service-website-design.md` (v1)
- **Preserves:** Information architecture, messaging tone, SEO strategy, content model, and non-goals from v1

## Overview

Refresh the existing 4-page Bulgarian marketing site for a car service in `гр. Ловеч` with a **professional, modern, light-theme layout**. The current implementation feels too basic; v2 introduces a structured page template with a **large hero**, **alternating text/image sections**, and **sharp 90° corners** throughout.

Primary conversion goal remains **phone calls** (`Обадете се`). **Viber** is the secondary contact channel — common in Bulgaria for quick questions and booking without a phone call.

### Contact hierarchy

| Priority | Channel | Use case |
|----------|---------|----------|
| 1 | Phone (`tel:`) | Primary CTA everywhere; tap-to-call on mobile |
| 2 | Viber (deep link) | Text questions, send photos of a problem, ask for hours/availability |

Viber does **not** replace the phone as the main action; it complements it where visitors prefer messaging.

## Approved Visual Direction

User-approved mockup: `.superpowers/brainstorm/.../layout-sharp-light.html`

### Core rules

| Rule | Value |
|------|-------|
| Theme | Light only (white / off-white backgrounds) |
| Corners | **90° only** — no rounded buttons, cards, or badges (`border-radius: 0`) |
| Accent | **Deep navy blue** `#1e3a8a` |
| Text | Near-black `#0a0a0a` headings, `#525252` body |
| Borders | 1px `#e5e5e5` dividers between sections |
| Typography | System sans-serif stack (Inter or existing Manrope); large bold headings with tight tracking |
| Imagery | Real workshop / automotive photos; full-bleed in alternating sections |
| Tone | Professional, structured, editorial — not playful, not “template-y” |

### Explicitly avoid

- Rounded corners (`rounded-*`, shadcn default `--radius`)
- Gradients (except subtle white overlay on hero photos)
- Decorative icons as primary visual language
- Pastel / lagoon / sand color palette from starter theme
- Dark headers or aggressive garage aesthetics
- Flashy animations, counters, or carousels

## Page Template (all 4 routes)

Every page follows the same structural rhythm:

```
┌─────────────────────────────────────┐
│ Header (logo + nav + phone + Viber) │
├─────────────────────────────────────┤
│ BIG HERO (image + text overlay)     │
├─────────────────────────────────────┤
│ Optional stats strip (homepage only)│
├─────────────────────────────────────┤
│ Alternating section 01 (text | img) │
├─────────────────────────────────────┤
│ Alternating section 02 (img | text) │
├─────────────────────────────────────┤
│ Optional section 03 (if needed)     │
├─────────────────────────────────────┤
│ Dark CTA band (call + Viber + hours)│
├─────────────────────────────────────┤
│ Footer                              │
└─────────────────────────────────────┘
```

### Header

- White background, bottom border
- Left: business name in bold uppercase or semibold
- Center/right: nav links (`Начало`, `ГТП`, `Ремонти`, `Контакти`)
- Right: **contact actions** (sharp corners):
  - **Phone** — solid navy button (primary)
  - **Viber** — outline button with Viber icon + label `Viber` (or `Пишете ни` on wider screens)
- Mobile: phone + Viber visible in header or inside hamburger `Sheet` if space is tight; both must remain one tap away
- Mobile nav: hamburger → shadcn `Sheet` (also sharp corners)

### Hero (large)

- Full-width, ~340–480px tall on desktop (shorter on mobile)
- Background: real photo with left-to-right white gradient overlay
- Content: eyebrow label (bordered navy tag), H1 (large, bold), short description, two CTAs (primary navy fill + secondary outline)
- Every page gets its own hero copy tied to that page's purpose

### Alternating sections

Reusable `SplitSection` component:

- Two columns on desktop (50/50), stacked on mobile
- Odd sections: text left, image right
- Even sections: image left, text right; optional `#fafafa` background
- Each section includes:
  - Numbered eyebrow (`01 — ГОДИШЕН ТЕХНИЧЕСКИ ПРЕГЛЕД`)
  - H2 heading
  - 2–3 sentence body copy
  - Text link CTA with bottom border (`Научете повече →`)

### Stats strip (homepage only)

- Three columns separated by vertical borders
- Large navy number + small uppercase label
- Example stats from content model (adjustable in `site-content.ts`)

### CTA band

- Full-width `#0a0a0a` background
- Left: headline + hours
- Right: **two actions** side by side:
  - White button — phone number (`tel:`)
  - Outline button — `Пишете ни във Viber` (Viber deep link)
- Appears at bottom of every page (replaces scattered small CTA blocks)

### Footer

- Minimal: copyright, address, optional nav repeat
- Top border, no rounded elements

## Page-Specific Content Mapping

### `Начало` (`/`)

| Section | Content |
|---------|---------|
| Hero | Location headline, dual-service summary, call + services CTAs |
| Stats | Years experience, avg GTP time, days open |
| Split 01 | GTP overview → link to `/gtp` |
| Split 02 | Repairs overview → link to `/remonti` |
| Split 03 (optional) | Trust / why choose us |
| CTA band | Call prompt |

### `ГТП` (`/gtp`)

| Section | Content |
|---------|---------|
| Hero | GTP-focused headline |
| Split 01 | What the service is |
| Split 02 | What to expect / process |
| Split 03 (optional) | Vehicle types, timing |
| CTA band | Call to book GTP |

### `Ремонти` (`/remonti`)

| Section | Content |
|---------|---------|
| Hero | Repairs headline |
| Split 01 | Diagnostics |
| Split 02 | Brakes / suspension |
| Split 03 | Engine / maintenance (or grouped from content model) |
| CTA band | Call for quote |

### `Контакти` (`/kontakti`)

| Section | Content |
|---------|---------|
| Hero | Contact headline |
| Split 01 | Phone, **Viber**, address, hours (structured contact list) |
| Split 02 | Map embed (or map placeholder image + link) |
| CTA band | Phone + Viber |

## Component Plan

### New / refactored components

| Component | Responsibility |
|-----------|----------------|
| `SiteHeader` | Refactor: sharp nav, navy phone button, Viber outline button, mobile Sheet |
| `HeroSection` | Full-width image hero with gradient overlay |
| `StatsStrip` | Three-column stat row (homepage) |
| `SplitSection` | Alternating text/image block with `reverse` prop |
| `CtaBand` | Dark bottom strip with phone + Viber actions |
| `ContactChannelLink` | Reusable phone / Viber link with icon, label, and correct `href` |
| `SiteFooter` | Simplify to match new layout; optional Viber link in footer |

### shadcn components to add

- `Sheet` — mobile navigation
- `Separator` — section dividers (optional; may use CSS borders instead)
- Keep `Button` — override to `rounded-none`

### Components to retire or merge

- `PageHero` → replaced by `HeroSection`
- `TrustPoints` → content moves into a SplitSection or stats
- `ServiceSummaryGrid` → replaced by SplitSections
- `CallCta` → replaced by `CtaBand` (single pattern)
- `Section` wrapper → simplify or remove decorative panel styles

## Design Tokens (CSS)

Add/replace in `src/styles.css`:

```css
:root {
  --accent: #1e3a8a;
  --accent-foreground: #ffffff;
  --foreground: #0a0a0a;
  --muted-foreground: #525252;
  --border: #e5e5e5;
  --surface-muted: #fafafa;
  --radius: 0; /* override shadcn default */
}
```

Remove or stop using starter-theme tokens: `--sea-ink`, `--lagoon`, `--sand`, `--foam`, `.site-panel`, `.page-shell` decorative styles.

## Viber Integration

### Scope (v2)

**In scope:** Viber **deep links** — no API, no embedded chat widget, no Viber Business backend. The site opens the visitor’s Viber app (mobile or desktop) to start a chat with the shop’s number.

**Out of scope for v2:**

- Viber Business / Bot API
- Embedded Viber chat widget on the page
- Message templates or automated replies from the website

This keeps the stack static and maintainable while matching how many Bulgarian customers already contact local businesses.

### Link format

Store once in `site-content.ts` and derive the href from the same phone number:

```typescript
// Display: 0888 000 000
// tel:       tel:+359888000000
// Viber:     viber://chat?number=359888000000
```

Rules:

- Use **international format without `+`**: `359` + number without leading `0`
- Same number as `phoneHref`; avoid duplicating digits in two places — build `viberHref` from a single E.164 source if possible
- Link opens in same tab (`<a href="...">`); no JavaScript required

Optional fallback for desktop browsers without Viber: the contact page lists the phone number as plain text so users can still reach the shop.

### UI treatment

- Use the **Viber brand purple** `#7360f2` only on the Viber button/icon so it is recognizable; keep navy for phone and general UI
- Sharp corners on Viber buttons (same as phone)
- Accessible label: `Пишете ни във Viber` (not icon-only without `aria-label`)
- Icon: inline SVG or lucide-compatible simple chat mark; avoid unofficial/off-brand artwork if possible

### Placement summary

| Location | Phone | Viber |
|----------|-------|-------|
| Header | Primary solid button | Secondary outline button |
| CTA band | White filled button | White outline button |
| Contact page split 01 | Listed with icon | Listed with icon + short hint (“Бързо съобщение”) |
| Footer (optional) | Text link | Text link |

## Content Model Updates

Extend `src/data/site-content.ts`:

```typescript
type ContactChannels = {
  phoneDisplay: string
  phoneHref: string // tel:+359...
  viberHref: string // viber://chat?number=359...
  viberLabel: string // e.g. "Пишете ни във Viber"
}

type HeroContent = {
  eyebrow: string
  title: string
  description: string
  primaryCta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  imageSrc: string
  imageAlt: string
}

type SplitSectionContent = {
  number: string
  eyebrow: string
  title: string
  description: string
  link: { label: string; href: string }
  imageSrc: string
  imageAlt: string
}

type StatItem = {
  value: string
  label: string
}
```

Each page exports: `hero`, `sections[]`, optional `stats[]`.

Shared `contact` (or `business.contact`) holds `ContactChannels` and is reused in header, CTA band, footer, and contact page.

Images: use `public/images/` paths; placeholder Unsplash URLs acceptable until real photos supplied.

## Responsive Behavior

| Breakpoint | Behavior |
|------------|----------|
| Mobile (<768px) | Hero text full width over shorter image; splits stack (image above or below text consistently); stats stack vertically |
| Tablet | Same as mobile or 2-col where space allows |
| Desktop (≥1024px) | Full alternating 50/50 splits; hero text max-width ~560px |

## Accessibility

- All images require meaningful `alt` text in Bulgarian
- Phone CTAs use `tel:` links; Viber CTAs use `viber://` deep links with descriptive link text
- Viber buttons include visible text or `aria-label` in Bulgarian
- Color contrast: navy on white and white on navy meet WCAG AA; Viber purple on white checked for AA on button text
- Focus states on nav links and buttons (visible outline, sharp)

## Testing Updates

Existing Vitest + Playwright tests should be updated for:

- New component structure (header phone + Viber, hero, CTA band)
- Navigation still reaches all 4 pages
- `tel:` links present on every page
- Viber deep link (`viber://chat?number=...`) present in header, CTA band, and contact page
- No regression in SEO metadata

Visual regression is manual for v2 (no Percy/Chromatic).

## Non-Goals (unchanged from v1)

- Online booking, accounts, blog, pricing calculator, multi-language
- Viber Business API, bots, or on-site chat widget (deep links only in v2)

## Implementation Notes

- Refactor in place on branch `feature/lovech-car-service-website`
- Prefer updating existing route files rather than adding new routes
- Move page component exports out of route files (fixes TanStack Router code-split warnings)
- Install shadcn `sheet` via `pnpm dlx shadcn@latest add sheet`

## Success Criteria

1. Site looks **professional and modern**, not like a starter template
2. All corners are **square** (90°)
3. **Light theme** with **navy blue** accent throughout
4. Every page has a **large hero** + **≥2 alternating sections**
5. Phone number visible in header and CTA band on every page
6. Viber chat link visible in header, CTA band, and contact details (same number as phone)
7. All existing tests pass after updates
8. `pnpm build` and `pnpm lint` pass
