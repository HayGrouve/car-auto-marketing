# Stefi Auto Gas — real content swap + context-aware contacts

## Goal

Replace placeholder contact data and generic brand copy with owner-approved **Stefi Auto Gas** content. Introduce three phone/Viber lines with **context-aware routing** on service pages, while keeping the existing four-page site structure (no new nav route).

Builds on [2026-06-11-lovech-car-service-visual-refresh-design.md](./2026-06-11-lovech-car-service-visual-refresh-design.md) and [2026-06-12-prod-launch-polish-design.md](./2026-06-12-prod-launch-polish-design.md) (both implemented). Implements the “A5. Still last (content swap)” item from the prod-launch polish spec.

## Approved decisions

| Topic | Decision |
|-------|----------|
| Architecture | `contact.lines[]` + `resolveContactLine()` helper (Approach 2) |
| Default phone (header, footer, home, 404) | **0876689736** — Сервиз |
| `/gtp` phone + Viber | **0876105674** — Прегледи (ГТП) |
| `/remonti` phone + Viber | **0876689736** — Сервиз |
| Gas line visibility | **0887816055** — Газови системи, **Контакти page only** |
| Viber | Context-aware — matches the active phone on each page; all three on Контакти |
| Brand name | **Stefi Auto Gas** |
| Copy scope | Light touch — contact swap + minor brand/locality wording (not full rewrite) |

## Real content values

### Contact lines

| ID | E.164 | Display | Label (BG) | Viber label |
|----|-------|---------|------------|-------------|
| `service` | `+359876689736` | `0876 689 736` | Сервиз | Viber — Сервиз |
| `inspections` | `+359876105674` | `0876 105 674` | Прегледи (ГТП) | Viber — Прегледи (ГТП) |
| `gas` | `+359887816055` | `0887 816 055` | Газови системи | Viber — Газови системи |

All lines use existing `buildPhoneHref()` / `buildViberHref()` from `#/lib/contact-links`.

### Shared contact fields

- **Address:** `гр. Ловеч, бул. Освобождение 7`
- **Hours (display):** `Понеделник - Петък: 9:00 - 18:00` (single row; **no Saturday**)
- **Schema opening hours:** `['Mo-Fr 09:00-18:00']`
- **Maps link:** `https://maps.app.goo.gl/PYfpkTAFxMp2xjw79?g_st=ic`
- **Map embed URL:** Google embed for **Stefi Auto Gas** pin (owner-provided iframe `src`)

### Brand

- **`brandName`:** `Stefi Auto Gas`
- **`manifest.json`:** update `name` and `short_name` to Stefi Auto Gas variants

## Constraints

- Bulgarian-only site; no new pages or nav items
- Keep Lucide + custom `ViberIcon` patterns
- No favicon/logo redesign in this spec
- No production domain change (`siteUrl` stays env-driven with current fallback)
- No new photography or full marketing copy rewrite

---

## Architecture

### Types (`src/data/site-content.ts`)

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
  viberLabel: string
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

Remove the old flat `phoneE164`, `phoneDisplay`, `phoneHref`, `viberHref`, `viberLabel` from `ContactChannels`. Update all consumers to use the resolver or explicit line access.

### Resolver (`src/lib/contact-context.ts`)

```ts
export function resolveContactLine(context: ContactContext): ContactLine
export function getDefaultContactLine(): ContactLine
export function getAllContactLines(): ContactLine[]
```

**Mapping:**

| `ContactContext` | Resolved line |
|------------------|---------------|
| `default` | `service` |
| `gtp` | `inspections` |
| `remonti` | `service` |

`getAllContactLines()` returns all three in order: service, inspections, gas (used on Контакти).

### Data flow

```
siteContent.contact.lines[]
        │
        ▼
resolveContactLine(context)  ──► ContactChannelLink, HeroSection CTA, CtaBand
        │
        ▼ (ContactDetails on /kontakti)
getAllContactLines()  ──► three phone + three Viber rows
```

---

## Component changes

| File | Change |
|------|--------|
| `src/data/site-content.ts` | Real content, `lines[]`, brand, light copy tweaks |
| `src/lib/contact-context.ts` | **New** — resolver helpers |
| `src/lib/contact-context.test.ts` | **New** — context mapping tests |
| `src/lib/seo.ts` | JSON-LD: `name`, default `telephone`, `contactPoint[]` for all lines |
| `src/components/site/contact-channel-link.tsx` | Optional `context?: ContactContext` |
| `src/components/site/contact-details.tsx` | Render all three lines (phone + Viber each), then address/hours/maps |
| `src/components/site/hero-section.tsx` | Optional `contactContext` for primary CTA href |
| `src/components/site/cta-band.tsx` | Optional `contactContext` |
| `src/pages/gtp-page.tsx` | Pass `contactContext="gtp"` to Hero + CtaBand |
| `src/pages/remonti-page.tsx` | Pass `contactContext="remonti"` to Hero + CtaBand |
| `src/routes/__root.tsx` | Update `defaultTitle` for Stefi Auto Gas |
| `public/manifest.json` | Stefi Auto Gas name fields |

**Unchanged context (use `default`):** `SiteHeader`, `FooterContactChannels`, home page, Контакти CTA band (service line is fine for generic “call us”), 404 phone button.

**Контакти CTA band:** keeps `default` (service) — acceptable for generic closing CTA; all three numbers are visible above in `ContactDetails`.

### ContactDetails layout (Контакти)

Replace single phone/Viber rows with a list:

1. For each line in `getAllContactLines()`:
   - Label row (e.g. **Сервиз**)
   - Phone link (`tel:`)
   - Viber link with line-specific label
2. Address (unchanged)
3. Hours (unchanged)
4. Google Maps external link (unchanged)

---

## Light copy tweaks

| Location | Before (placeholder) | After |
|----------|---------------------|-------|
| `brandName` | Автосервиз Ловеч | Stefi Auto Gas |
| Root `defaultTitle` | …Автосервиз… | `Stefi Auto Gas \| ГТП и сервиз в Ловеч` |
| Home hero | Generic Lovech autoservice | Add brand in eyebrow or title; keep locality |
| Home stats[1] | `Пн–Сб` / „Работим…“ | `Пн–Пт` / „9:00–18:00“ or equivalent |
| Footer tagline | ГТП и автосервиз в Ловеч | ГТП, сервиз и газови системи в Ловеч |
| SEO descriptions | „Автосервиз Ловеч“ | „Stefi Auto Gas“ where brand appears |
| `manifest.json` | Автосервиз Ловеч | Stefi Auto Gas |

**Out of scope:** new `/gaz` route, full service copy rewrite, new images, domain/favicon change.

---

## SEO / JSON-LD

Update `buildLocalBusinessJsonLd()`:

```ts
{
  '@type': 'AutoRepair',
  name: 'Stefi Auto Gas',
  telephone: '+359876689736',  // default service line
  contactPoint: [
    { '@type': 'ContactPoint', telephone: '...', contactType: 'customer service', description: 'Сервиз' },
    { '@type': 'ContactPoint', telephone: '...', contactType: 'customer service', description: 'Прегледи (ГТП)' },
    { '@type': 'ContactPoint', telephone: '...', contactType: 'customer service', description: 'Газови системи' },
  ],
  openingHours: ['Mo-Fr 09:00-18:00'],
  // address, url, image unchanged pattern
}
```

---

## Error handling & edge cases

- **Map iframe blocked/slow:** address, hours, and phone links remain visible (existing graceful pattern).
- **Viber deep links:** keep `viber://chat?number=…` behavior; desktop may not open app — acceptable.
- **Phone display:** space-grouped Bulgarian mobile format (`0876 689 736`).
- **Tests:** update any assertion that referenced `siteContent.contact.phoneDisplay` as a single global value.

---

## Testing

| Test file | Assertions |
|-----------|------------|
| `src/lib/contact-context.test.ts` | `default`→service, `gtp`→inspections, `remonti`→service |
| `src/data/site-content.test.ts` | three lines, Mon–Fri hours, brand name |
| `src/components/site/contact-channel-link.test.tsx` | `context="gtp"` resolves inspections href/label |
| `src/routes/kontakti.test.tsx` | all three phones + vibers visible |
| `src/routes/service-routes.test.tsx` | GTP→inspections, Remonti→service |
| `src/lib/seo.test.ts` | JSON-LD name + contactPoint count |
| `src/components/site/site-footer.test.tsx` | default service in footer channels |
| `src/components/site/site-header.test.tsx` | default service in header CTA |

**Quality gate:** `pnpm test` and `pnpm build` pass.

---

## Files touched (summary)

**New:** `src/lib/contact-context.ts`, `src/lib/contact-context.test.ts`

**Modified:** `src/data/site-content.ts`, `src/data/site-content.test.ts`, `src/lib/seo.ts`, `src/lib/seo.test.ts`, contact UI components, GTP/Remonti pages, `__root.tsx`, `public/manifest.json`, route tests

**Not modified:** nav structure, image assets, domain config, favicon
