# Stefi Auto Gas — real content swap + context-aware contacts

## Goal

Replace placeholder contact data and generic brand copy with owner-approved **Stefi Auto Gas** content. Introduce three phone/Viber lines with **context-aware routing** on service pages, while keeping the existing four-page site structure (no new nav route).

Builds on [2026-06-11-lovech-car-service-visual-refresh-design.md](./2026-06-11-lovech-car-service-visual-refresh-design.md) and [2026-06-12-prod-launch-polish-design.md](./2026-06-12-prod-launch-polish-design.md) (both implemented). **Partially closes** prod-launch polish **A5** (real phones, address, hours, map pin, brand, JSON-LD `openingHours`). **Still deferred from A5:** production domain confirmation, branded favicon/assets.

## Approved decisions

| Topic | Decision |
|-------|----------|
| Architecture | `contact.lines[]` + `resolveContactLine()` helper (Approach 2) |
| Default phone (header, footer, home, 404) | **0876689736** — Сервиз |
| `/gtp` phone + Viber | **0876105674** — Прегледи (ГТП) |
| `/remonti` phone + Viber | **0876689736** — Сервиз (same E.164 as default; see note below) |
| Gas line visibility | **0887816055** — Газови системи, **Контакти page only** (in JSON-LD for SEO, not in nav CTAs) |
| Viber hrefs | Context-aware — matches the active phone on each page |
| Viber button labels (header/footer/CTA bands) | Keep short **`Пишете ни във Viber`**; href still resolves by context |
| Viber labels (Контакти `ContactDetails`) | Per-line **`Viber — {label}`** |
| Brand name | **Stefi Auto Gas** |
| Copy scope | Light touch — contact swap + minor brand/locality wording (not full rewrite) |

**Note — `remonti` context:** Maps to the same `service` line as `default`. The separate context exists so `/remonti` and global CTAs can diverge later without API changes. Today only `/gtp` changes the resolved line.

**Note — gas in JSON-LD vs UI:** All three lines appear in `contactPoint[]` for search engines. Only Контакти shows the gas number in the UI; nav/header CTAs intentionally omit it.

---

## Real content values

### Contact lines

| ID | E.164 | Display | Label (BG) | Viber label (Контакти only) |
|----|-------|---------|------------|-----------------------------|
| `service` | `+359876689736` | `0876 689 736` | Сервиз | Viber — Сервиз |
| `inspections` | `+359876105674` | `0876 105 674` | Прегледи (ГТП) | Viber — Прегледи (ГТП) |
| `gas` | `+359887816055` | `0887 816 055` | Газови системи | Viber — Газови системи |

All lines use existing `buildPhoneHref()` / `buildViberHref()` from `#/lib/contact-links`.

### Shared contact fields

- **Address:** `гр. Ловеч, бул. Освобождение 7`
- **Hours (display):** `['Понеделник - Петък: 9:00 - 18:00']` — single row; **no Saturday**
- **Schema opening hours:** `['Mo-Fr 09:00-18:00']`
- **Maps link:** `https://maps.app.goo.gl/PYfpkTAFxMp2xjw79?g_st=ic`
- **Map embed URL:**

```
https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4816.500206376381!2d24.7225143!3d43.159890999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40abe75aa66b506f%3A0xc7f3c72f2bc99639!2sStefi%20Auto%20Gas!5e1!3m2!1sen!2sbg!4v1784727303042!5m2!1sen!2sbg
```

### Brand & manifest

| Field | Value |
|-------|-------|
| `brandName` | `Stefi Auto Gas` |
| `manifest.json` → `short_name` | `Stefi Auto Gas` |
| `manifest.json` → `name` | `Stefi Auto Gas — ГТП и сервиз` |
| Root `defaultTitle` (`__root.tsx`) | `Stefi Auto Gas \| ГТП и сервиз в Ловеч` |

**Suffix change:** current code uses `ремонти`; spec uses **`сервиз`** — update the full template string, not only `brandName`.

---

## Constraints

- Bulgarian-only site; no new pages or nav items
- Keep Lucide + custom `ViberIcon` patterns
- No favicon/logo redesign in this spec
- No production domain change (`siteUrl` stays env-driven with current fallback)
- No new photography or full marketing copy rewrite

---

## Architecture

### Types — export home (`src/data/site-content.ts`)

All contact types live in **`site-content.ts`** and are imported elsewhere. **`contact-context.ts` imports from `site-content.ts` only** — no circular imports. Do not duplicate types in `contact-context.ts`.

```ts
export type ContactLineId = 'service' | 'inspections' | 'gas'

export type ContactContext = 'default' | 'gtp' | 'remonti'

export type ContactLine = {
  id: ContactLineId
  label: string
  phoneE164: string
  phoneDisplay: string
  phoneHref: string
  viberHref: string
  viberLabel: string   // used on Контакти only; see Viber label rules above
}

export type ContactChannels = {
  lines: ContactLine[]
  defaultLineId: ContactLineId
  address: string
  hours: string[]
  schemaOpeningHours: string[]
  mapEmbedUrl: string
  mapsLink: string
}
```

Remove flat `phoneE164`, `phoneDisplay`, `phoneHref`, `viberHref`, `viberLabel` from `ContactChannels`. Update **all** consumers — no back-compat shim.

### Resolver (`src/lib/contact-context.ts`)

```ts
import type { ContactContext, ContactLine, ContactLineId } from '#/data/site-content'
import { siteContent } from '#/data/site-content'

export function resolveContactLine(context: ContactContext = 'default'): ContactLine
export function getDefaultContactLine(): ContactLine
export function getAllContactLines(): readonly ContactLine[]
```

**Context → line mapping:**

| `ContactContext` | Resolved line |
|------------------|---------------|
| `default` | `service` |
| `gtp` | `inspections` |
| `remonti` | `service` |

**Robustness:**

- `resolveContactLine`: exhaustive `switch` on `ContactContext`; TypeScript `satisfies never` on default branch
- `getDefaultContactLine()`: finds line where `id === siteContent.contact.defaultLineId`; if missing, throw `Error('Missing default contact line')` in implementation (fail fast at module load / test time)
- `getAllContactLines()`: **contractual fixed order** — `[service, inspections, gas]` — filter/map from `lines[]` by id; order is tested and relied on by Контакти layout

### `ContactChannelLink` API

```tsx
type Props = {
  channel: 'phone' | 'viber'
  context?: ContactContext   // defaults to 'default'
  variant: 'solid' | 'outline' | 'inverse-solid' | 'inverse-outline'
  // ...
}
```

- Both `phone` and `viber` resolve href from **`resolveContactLine(context)`**
- **Phone** visible label: `line.phoneDisplay`
- **Viber** visible label (compact CTAs): **`Пишете ни във Viber`** — constant string, not `line.viberLabel`
- **Viber** `aria-label` (optional enhancement): `` `${line.label} — Viber` `` for screen readers when href differs from default

### Data flow

```
siteContent.contact.lines[]
        │
        ▼
resolveContactLine(context)  ──► ContactChannelLink, HeroSection CTA, CtaBand
        │
        ▼ (ContactDetails on /kontakti)
getAllContactLines()  ──► three line blocks (phone + Viber each)
        │
        ▼ (buildLocalBusinessJsonLd)
lines[]  ──► contactPoint[] (derived, not hand-maintained)
```

---

## Component changes

| File | Change |
|------|--------|
| `src/data/site-content.ts` | Real content, `lines[]`, brand, light copy tweaks |
| `src/lib/contact-context.ts` | **New** — resolver helpers |
| `src/lib/contact-context.test.ts` | **New** — context mapping, order contract, defaultLineId |
| `src/lib/seo.ts` | Derive `contactPoint[]` from `lines[]`; update `telephone`, `openingHours` |
| `src/components/site/contact-channel-link.tsx` | `context?: ContactContext`; compact Viber label |
| `src/components/site/contact-details.tsx` | Three-line layout (see wireframe); remove global „Телефон“ / „Viber“ headings |
| `src/components/site/footer-contact-channels.tsx` | Use `getDefaultContactLine()` instead of flat `contact.phoneHref` |
| `src/components/site/hero-section.tsx` | Optional `contactContext` for primary CTA href |
| `src/components/site/cta-band.tsx` | Optional `contactContext` |
| `src/pages/gtp-page.tsx` | Pass `contactContext="gtp"` to Hero + CtaBand |
| `src/pages/remonti-page.tsx` | Pass `contactContext="remonti"` to Hero + CtaBand |
| `src/routes/__root.tsx` | Full `defaultTitle` string (see Real content values) |
| `public/manifest.json` | Stefi Auto Gas name fields |

**Unchanged context (`default`):** `SiteHeader`, `FooterContactChannels`, home page, Контакти CTA band, 404 phone button.

### ContactDetails layout (Контакти)

Remove top-level **„Телефон“** and **„Viber“** section headings. Replace with one block per line:

```
┌─ СЕРВИЗ ─────────────────────────────┐  ← line.label (uppercase label row style)
│  📞  0876 689 736                     │  ← Phone icon + tel: link
│                                      │     accessible name: "Сервиз: 0876 689 736"
│  [Viber icon]  Viber — Сервиз         │  ← viber: link; visible text = line.viberLabel
│  Бързо съобщение                      │  ← subtext under each Viber row (keep current pattern)
└──────────────────────────────────────┘

(repeat for Прегледи (ГТП), Газови системи)

┌─ АДРЕС ──────────────────────────────┐  ← MapPin icon + address (unchanged)
┌─ РАБОТНО ВРЕМЕ ──────────────────────┐  ← Clock icon + single Mon–Fri row
  Отвори в Google Maps                    ← ExternalLink (unchanged)
```

- **Icons:** Phone icon per phone link; ViberIcon per Viber link (same as today, per row)
- **Accessibility:** each phone/Viber link has a **distinct accessible name** including the line label (not three identical „0876…“ links)
- **`pages.kontakti.sections[0].description`:** built from `contact.address` + `contact.hours.join('. ')` — auto-updates when hours drop to one row

### UX — header Viber label

Compact CTAs keep **`Пишете ни във Viber`** so header buttons do not grow to „Viber — Прегледи (ГТП)“ on `/gtp`. The **href** still switches by context; only Контакти shows line-specific Viber text. Monitor mobile wrap; no layout change required if label stays short.

---

## Light copy tweaks

### Changed (explicit target strings)

| Location | Before | After |
|----------|--------|-------|
| `brandName` | Автосервиз Ловеч | Stefi Auto Gas |
| `defaultTitle` | `${brandName} \| ГТП и ремонти в Ловеч` | **`Stefi Auto Gas \| ГТП и сервиз в Ловеч`** (full literal in `__root.tsx`) |
| Home hero `eyebrow` | (none) | **`Stefi Auto Gas`** |
| Home hero `title` | ГТП и автосервиз в Ловеч | **unchanged** |
| Home stats[1] `value` | Пн–Сб | **`Пн–Пт`** |
| Home stats[1] `label` | Работим, когато ви трябваме | **`9:00–18:00`** |
| Footer `tagline` | ГТП и автосервиз в Ловеч | **ГТП, сервиз и газови системи в Ловеч** |
| `seo.home.description` | …автосервиз в Ловеч… | **ГТП и автосервиз в Ловеч — Stefi Auto Gas. Запишете час по телефона.** |
| `seo.gtp.description` | …в Ловеч. Обадете се… | **Годишен технически преглед в Ловеч — Stefi Auto Gas. Обадете се за час.** |
| `seo.repairs.description` | …в Ловеч. | **Ремонти и поддръжка на автомобили в Ловеч — Stefi Auto Gas.** |
| `seo.contacts.description` | …автосервиза в Ловеч. | **Контакти, адрес и работно време на Stefi Auto Gas в Ловеч.** |
| `manifest.json` | Автосервиз Ловеч… | see Real content values |

`buildSeoHead` titles auto-update via `brandName` (e.g. **`ГТП | Stefi Auto Gas`**).

### Explicitly unchanged (prevent scope creep)

- `imageAlts` — keep location/service descriptions (e.g. „Автосервиз в Ловеч — работилница“)
- `sharedCtaBand` title and description
- `contacts` page hero title/description (`Контакти`, „Намерете ни в Ловеч…“)
- Home service cards, trust points body copy
- GTP / Remonti page section titles and body copy (except CTAs wired to context)
- Navigation labels
- Image assets, favicon, domain

---

## SEO / JSON-LD

Update `buildLocalBusinessJsonLd()` to **derive** `contactPoint[]` from `siteContent.contact.lines[]`:

```ts
contactPoint: siteContent.contact.lines.map((line) => ({
  '@type': 'ContactPoint',
  telephone: line.phoneE164,           // E.164, same format as top-level telephone
  contactType: 'customer service',
  description: line.label,            // Bulgarian: Сервиз | Прегледи (ГТП) | Газови системи
})),
```

Top-level fields:

```ts
{
  '@type': 'AutoRepair',
  name: 'Stefi Auto Gas',
  telephone: '+359876689736',          // default service line (E.164)
  openingHours: ['Mo-Fr 09:00-18:00'],
  // address.streetAddress = full address string; addressLocality = 'Ловеч'
}
```

Include **all three lines** in `contactPoint[]`, including gas, even though gas is UI-hidden outside Контакти.

---

## Error handling & edge cases

- **Map iframe blocked/slow:** address, hours, and phone links remain visible (existing pattern)
- **Viber deep links:** keep `viber://chat?number=…`; desktop may not open app — acceptable
- **Phone display:** space-grouped Bulgarian mobile format
- **Missing default line:** throw at resolver init — caught by unit tests on load
- **Header Viber:** short label + context-aware href (see UX section)

---

## Testing

| Test file | Assertions |
|-----------|------------|
| `src/lib/contact-context.test.ts` | mapping; `getAllContactLines()` order `[service, inspections, gas]`; missing default throws |
| `src/data/site-content.test.ts` | **Retire** „same number“ test; add three lines, single Mon–Fri hour row, `brandName` |
| `src/components/site/contact-channel-link.test.tsx` | default + `context="gtp"` href/label; Viber compact label |
| `src/components/site/hero-section.test.tsx` | default `phoneHref`; optional `contactContext="gtp"` case |
| `src/routes/index.test.tsx` | default service `phoneDisplay` via resolver |
| `src/routes/kontakti.test.tsx` | three distinct `tel:` links; three Viber links with line labels |
| `src/routes/service-routes.test.tsx` | GTP→inspections display; Remonti→service display |
| `src/lib/seo.test.ts` | title **`ГТП \| Stefi Auto Gas`**; JSON-LD `name`, `telephone`, `contactPoint` length 3, E.164 |
| `src/components/site/site-footer.test.tsx` | default service in footer; **single hour row only** (remove `hours[1]` assertion) |
| `src/components/site/site-header.test.tsx` | default service in header CTA |
| `e2e/site-smoke.spec.ts` | homepage CTA regex **`/Обадете се\|0876 689 736/`**; `/gtp` first `tel:` contains `876105674`; `/kontakti` has **3** `tel:` links; hours still visible |

**Quality gate:** `pnpm test` and `pnpm build` pass.

---

## Definition of done

- [ ] All placeholder phones replaced; three lines in `siteContent.contact.lines[]`
- [ ] Header, footer, home, 404 use **service** line (`0876 689 736`)
- [ ] `/gtp` CTAs use **inspections** line (`0876 105 674`)
- [ ] `/remonti` CTAs use **service** line
- [ ] `/kontakti` shows all three phone + Viber blocks with distinct accessible names
- [ ] Address, maps link, and **full map embed URL** set to Stefi Auto Gas pin
- [ ] Hours: **Mon–Fri 9:00–18:00** only (UI, footer, JSON-LD)
- [ ] Brand **Stefi Auto Gas** in header, footer, manifest, JSON-LD, SEO descriptions
- [ ] `defaultTitle` suffix is **сервиз**, not ремонти
- [ ] No stale references to `contact.phoneDisplay` / flat phone fields
- [ ] `pnpm test` and `pnpm build` green

---

## Files touched (summary)

**New:** `src/lib/contact-context.ts`, `src/lib/contact-context.test.ts`

**Modified:** `src/data/site-content.ts`, `src/data/site-content.test.ts`, `src/lib/seo.ts`, `src/lib/seo.test.ts`, `contact-channel-link.tsx`, `contact-details.tsx`, **`footer-contact-channels.tsx`**, `hero-section.tsx`, `hero-section.test.tsx`, `cta-band.tsx`, GTP/Remonti pages, `__root.tsx`, `public/manifest.json`, `index.test.tsx`, `kontakti.test.tsx`, `service-routes.test.tsx`, `site-footer.test.tsx`, `site-header.test.tsx`, **`e2e/site-smoke.spec.ts`**

**Not modified:** nav structure, image assets, `imageAlts`, domain config, favicon, shared marketing body copy (see Explicitly unchanged)
