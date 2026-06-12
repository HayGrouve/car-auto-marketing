# Production launch polish + UI icons

## Goal

Final pre-launch technical polish while client content (phone, address, domain, photos) remains placeholder and is swapped last. Add Lucide UI icons across key touchpoints for a more polished, scannable feel.

Builds on [2026-06-12-launch-polish-design.md](./2026-06-12-launch-polish-design.md) (already implemented).

## Constraints

- No real client content required for this phase
- Use **Lucide React** (already installed) for UI icons
- Keep custom `ViberIcon` for brand-accurate Viber purple links
- Stay subtle — icons support text, never replace it
- No favicon/logo redesign in this spec (UI icons only)

---

## Part A — Balanced pre-launch polish

### A1. Performance

- Compress PNGs in `public/images/` (target ~200–400 KB each, visually acceptable)
- Hero image: `fetchpriority="high"`, `decoding="async"`
- Below-fold split images: `loading="lazy"`
- Add stable aspect ratio on image containers to reduce CLS (`aspect-[4/3]` or explicit dimensions on wrappers)

### A2. Technical SEO & deploy config

- `VITE_SITE_URL` env var; `siteContent.siteUrl` reads it with fallback to `https://avtoserviz-lovech.bg`
- Build script generates `public/sitemap.xml` and `public/robots.txt` from `siteUrl`
- Extend `buildSeoHead` with Twitter card meta (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- Add `<meta name="theme-color" content="#1e3a8a">` in root head

### A3. UX & accessibility

- Skip link: "Към съдържанието" → `#main-content` on `<main id="main-content">`
- Contacts page: "Отвори в Google Maps" external link (new `mapsLink` field in `siteContent.contact`, placeholder uses generic Lovech query until client pin arrives)
- Footer: show condensed working hours from `siteContent.contact.hours`

### A4. Deploy & quality gate

- `public/_headers` on Netlify: cache `/images/*` 1 week; basic security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`)
- E2e additions: 404 shows "Към началото"; active nav state on `/gtp`
- Verify with `pnpm build` and `pnpm test`

### A5. Still last (content swap)

- Real phone, address, hours, map pin, production domain, branded favicon, `openingHours` in JSON-LD

---

## Part B — UI icons (Lucide)

### Icon mapping

| Location | Icon (Lucide) | Notes |
|----------|---------------|-------|
| Stats strip — ГТП | `ClipboardCheck` | Navy `#1e3a8a`, above stat value |
| Stats strip — Пн–Сб | `CalendarDays` | Same style |
| Stats strip — Ловеч | `MapPin` | Same style |
| Contact details — Телефон | `Phone` | Replace inline SVG `PhoneIcon` |
| Contact details — Адрес | `MapPin` | In label row |
| Contact details — Работно време | `Clock` | In label row |
| Contact details — Viber | `ViberIcon` | Keep existing custom SVG |
| Contact channel link — phone | `Phone` | Add icon (Viber link already has icon) |
| Footer — address | `MapPin` | Small, muted, inline |
| Footer — hours (new) | `Clock` | Small, muted, inline |
| Google Maps link | `ExternalLink` | On contacts page CTA |

### Data model

Extend `StatItem` in `site-content.ts`:

```ts
export type StatIcon = 'clipboard-check' | 'calendar-days' | 'map-pin'

export type StatItem = {
  value: string
  label: string
  icon: StatIcon
}
```

Assign icons to the three home stats in `siteContent.pages.home.stats`.

### Components

- New `src/components/site/stat-icon.tsx` — maps `StatIcon` string → Lucide component (keeps `stats-strip.tsx` clean)
- Update `stats-strip.tsx` — render icon above value
- Update `contact-details.tsx` — Lucide in `ContactRow` label; remove inline `PhoneIcon` SVG
- Update `contact-channel-link.tsx` — `Phone` icon on phone variant
- Update `site-footer.tsx` — icons beside address and hours
- Update `kontakti-page.tsx` or `contact-details.tsx` — Maps link with `ExternalLink`

### Styling rules

- Icon size: `size-4` in labels/footer, `size-5` in contact links, `size-6` in stats strip
- Color: `#1e3a8a` for emphasis contexts; `#525252` for muted footer/labels
- All decorative icons: `aria-hidden="true"`
- Links with icon + text: icon is decorative; link `aria-label` not needed when text is visible

### Out of scope for icons

- Icons in hero, split section headings, or navigation (keep nav text-only)
- Animated icons
- Custom icon set / SVG sprite sheet
- Favicon / PWA icon redesign

---

## Architecture

```
site-content.ts (stat icons, mapsLink)
       ↓
stat-icon.tsx / stats-strip / contact-details / contact-channel-link / site-footer
       ↓
kontakti-page (maps link)
```

SEO/deploy changes stay in `lib/seo.ts`, build script, `__root.tsx`, `public/_headers`.

---

## Testing

- Unit: `buildSeoHead` includes Twitter meta; `siteContent` stats have icons
- E2e: icons visible on home stats and contact page; 404 and active nav checks
- Manual: icons align with text, no layout shift after image compression

---

## Implementation order

1. UI icons (visible polish, low risk)
2. Performance (image compression + loading attrs)
3. SEO/env/sitemap generation
4. UX (skip link, maps link, footer hours)
5. Deploy headers + e2e expansion
6. Build verification
