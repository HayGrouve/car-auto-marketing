# Launch polish design (Approach 2)

## Goal

Make the site launch-ready at the technical layer while client content (phone, address, domain) remains placeholder. Use existing images in `public/images/`.

## Existing assets

- `public/images/lovech-service-shop.png` — hero / contacts
- `public/images/gtp-section.png` — GTP sections
- `public/images/repairs-section.png` — repairs sections
- `public/images/trust-section.png` — trust sections

Paths in `site-content.ts` already match these files.

## In scope

1. **Image accessibility** — `imageAlt` on hero and split content, wired through components
2. **Navigation UX** — active page indicator, mobile sheet closes on contact taps, scroll-to-top on route change
3. **404 page** — link to home + phone CTA
4. **Home cross-links** — sections 01/02 link to `/gtp` and `/remonti`
5. **SEO** — `og:image`, JSON-LD LocalBusiness, align root fallback meta with `siteContent.seo.home`
6. **PWA meta** — update `manifest.json` with brand name and navy `theme_color`

## Out of scope

- Real client phone, address, hours, map pin
- Custom logo / favicon redesign
- Domain/DNS changes
- Analytics, cookie banner

## Architecture

All content-driven values stay in `site-content.ts`. SEO helpers extend `lib/seo.ts`. Layout behavior (scroll-to-top, JSON-LD script) lives in `__root.tsx`. Nav UX in `site-header.tsx`.
