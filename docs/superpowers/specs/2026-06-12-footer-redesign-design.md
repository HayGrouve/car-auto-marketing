# Footer redesign design

## Goal

Replace the flat single-row footer with a structured, light two-column layout that feels more polished and useful — without competing with the navy CTA band directly above it.

## User decisions

| Decision | Choice |
|----------|--------|
| Primary goal | Polish + utility (proper site footer) |
| Visual tone | Light — white/off-white with structure, not a dark bookend |
| Layout | 2 columns: brand + nav (left) \| contact (right) |
| Implementation | Structured subcomponents + minimal `site-content` footer block |

## Current state

`site-footer.tsx` renders a single horizontal strip on `sm+`:

- Copyright, phone/Viber links, address + hours (hours joined with `·` on one line)
- `py-6`, minimal visual hierarchy
- Viber link renders with no label text (bug)
- `.site-footer` CSS exists in `styles.css` but the component does not use it (dead rule)

The footer sits below the navy `CtaBand` on every page. Header and CTA sections carry the brand weight; the footer should feel clean and informative, not repetitive.

## In scope

1. **Two-column layout** — brand + stacked nav (left), contact block (right)
2. **Copyright bar** — separate bottom row with top border
3. **Footer subcomponents** — `FooterBrand`, `FooterNav`, `FooterContact` composed by `SiteFooter`
4. **Content in `site-content.ts`** — `footer.tagline`, `footer.contactHeading`
5. **Contact block parity** — address, stacked hours, phone, Viber, Google Maps link (patterns from `contact-details.tsx`)
6. **Bug fix** — restore Viber link label
7. **Cleanup** — remove unused `.site-footer` rule from `styles.css`
8. **Tests** — `site-footer.test.tsx` with render assertions for key content and links

## Out of scope

- Logo image in footer (no branded asset yet)
- Social media links
- Newsletter signup
- Legal pages (privacy, terms)
- Dark or split-tone footer variants
- Duplicate phone/Viber CTA buttons (CTA band already provides those)

## Layout

### Desktop (`md+`)

```
┌─────────────────────────────────────────────────────────────┐
│  FOOTER  bg-white  py-10 lg:py-12  px-6 lg:px-10           │
│  ┌──────────────────────┐  ┌──────────────────────────────┐ │
│  │ Brand + tagline      │  │ КОНТАКТИ (heading)            │ │
│  │ Nav links (stacked)  │  │ Address (MapPin)             │ │
│  │                      │  │ Hours (ul, stacked)          │ │
│  │                      │  │ Phone + Viber (with icons)   │ │
│  │                      │  │ Google Maps (ExternalLink)     │ │
│  └──────────────────────┘  └──────────────────────────────┘ │
│  ───────────────── border-t mt-8 pt-6 ─────────────────  │
│  © {year} {brandName}                                       │
└─────────────────────────────────────────────────────────────┘
```

Grid: `md:grid-cols-2 gap-12`. Column max-width aligns with existing site padding.

### Mobile

Single column, top to bottom:

1. Brand + tagline
2. Nav links
3. Contact block
4. Copyright bar

## Visual styling

### Shell

- Background: `bg-white`
- Top border: `border-t border-[#e5e5e5]`
- Padding: `px-6 py-10 lg:px-10 lg:py-12`

### Left column — Brand + Nav

| Element | Classes / notes |
|---------|-----------------|
| Brand name | `text-lg font-extrabold text-[#1e3a8a]` — from `siteContent.brandName` |
| Tagline | `text-sm text-[#525252] max-w-xs` — from `siteContent.footer.tagline` |
| Nav links | `space-y-2`, `text-sm text-[#525252] hover:text-[#1e3a8a]` — from `siteContent.navigation` |
| Nav container | `aria-label="Футър навигация"` (distinct from header) |

Footer nav uses simple text links (no header underline animation).

### Right column — Contact

| Element | Classes / notes |
|---------|-----------------|
| Heading | `text-xs font-bold uppercase tracking-widest text-[#525252]` — from `siteContent.footer.contactHeading` |
| Address | MapPin icon (`aria-hidden`) + `text-sm leading-6` |
| Hours | `<ul className="space-y-1">` — one `<li>` per `siteContent.contact.hours` entry |
| Phone | Lucide Phone icon + link, navy (`text-[#1e3a8a]`) |
| Viber | ViberIcon + link, purple (`text-[#7360f2]`) — label from `siteContent.contact.viberLabel` |
| Maps | ExternalLink icon + "Отвори в Google Maps", `target="_blank"`, `rel="noopener noreferrer"` |

Reuse icon and link patterns from `contact-details.tsx` for consistency.

### Copyright bar

- Separator: `border-t border-[#e5e5e5] mt-8 pt-6`
- Text: `text-xs text-[#525252]`
- Content: `© {year} {brandName}` only

## Architecture

### File map

| File | Change |
|------|--------|
| `src/components/site/site-footer.tsx` | Refactor into composed layout |
| `src/components/site/footer-brand.tsx` | New — brand + tagline |
| `src/components/site/footer-nav.tsx` | New — vertical nav links |
| `src/components/site/footer-contact.tsx` | New — contact block |
| `src/components/site/site-footer.test.tsx` | New — render tests |
| `src/data/site-content.ts` | Add `footer` block |
| `src/styles.css` | Remove unused `.site-footer` rule |

### Data model

Add to `site-content.ts`:

```ts
export type FooterContent = {
  tagline: string
  contactHeading: string
}

// In siteContent export:
footer: {
  tagline: 'ГТП и автосервиз в Ловеч',
  contactHeading: 'Контакти',
} satisfies FooterContent,
```

All other footer data (navigation, contact fields, brand name) is read from existing `siteContent` fields.

### Component boundaries

- **FooterBrand** — reads `brandName`, `footer.tagline`; no routing
- **FooterNav** — reads `navigation`; uses TanStack `Link` with same routes as header
- **FooterContact** — reads `contact`; no dependency on other footer subcomponents
- **SiteFooter** — layout shell + copyright year; composes the three blocks

## Accessibility

- Outer `<footer>` landmark (unchanged)
- Footer nav: `aria-label="Футър навигация"`
- Decorative icons: `aria-hidden="true"`
- Maps external link: `rel="noopener noreferrer"` + `target="_blank"`
- Sufficient color contrast on light background (navy/purple links on white)

## Testing

### Unit — `site-footer.test.tsx`

Assert on render:

- Brand name and tagline visible
- All four navigation links present with correct `href`
- Contact heading visible
- Address and both hours lines visible
- Phone link has correct `tel:` href
- Viber link has correct `viber://` href and label text
- Maps link has correct href, `target="_blank"`, `rel="noopener noreferrer"`
- Copyright contains current year and brand name

### E2e (optional)

Extend `e2e/site-smoke.spec.ts` to confirm footer nav link to `/kontakti` is visible on homepage. Low priority — unit tests cover structure.

## Migration / risks

| Risk | Mitigation |
|------|------------|
| Footer feels heavy below CTA band | Light background, text links only (no duplicate CTA buttons) |
| Hours cramped on mobile | Stacked `<ul>` instead of `join(' · ')` |
| Dead CSS drift | Delete `.site-footer` from `styles.css` |
| Empty Viber link | Explicitly render `viberLabel` in `FooterContact` |

## Success criteria

- Footer displays two clear columns on `md+` and stacks cleanly on mobile
- All nav routes and contact channels are reachable from the footer
- Viber link shows its label
- Unit tests pass
- No visual regression to header, CTA band, or page content above footer
