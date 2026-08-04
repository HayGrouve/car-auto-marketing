# Decide branded OG asset spec and timing

**Labels:** `wayfinder:grilling`  
**Blocked by:** 01  
**Status:** resolved

## Question

When and **what** should replace (or supplement) the shared `hero.jpg` OG image?

Decisions to lock:

1. **Timing** — before launch, shortly after, or when client provides assets?
2. **Dimensions** — standard 1200×630 share card?
3. **Content** — logo + tagline + workshop photo, or photo-only?
4. **Ownership** — dev-built from existing assets, designer, or client photo?
5. **Implementation** — static file in `public/`, update `defaultOgImage` in `seo.ts`, anything else?

**Recommended answer:** Post-launch within first month; 1200×630 PNG/JPG; logo + "ГТП, сервиз и газови системи — Ловеч" tagline over a cropped workshop photo; dev composes from existing `logo.png` + section images unless client supplies a photo; single `public/images/og-share.jpg` referenced by `defaultOgImage`.

What spec and timeline do we commit to?

## Answer

**Confirmed** (user: proceed, Aug 4 2026).

| Decision | Commitment |
|----------|------------|
| **Timing** | Post-launch, within first month — not a launch blocker |
| **Dimensions** | 1200×630 px (1.91:1) JPEG or PNG |
| **Content** | Logo + tagline "ГТП, сервиз и газови системи — Ловеч" over cropped workshop photo |
| **Ownership** | Dev composes from existing `logo.png` + section images unless client supplies a photo |
| **Implementation** | Static `public/images/og-share.jpg`; update `defaultOgImage` in `src/lib/seo.ts`; add `og:image:width`/`height`/`alt` and `og:site_name` at same time (per [research](../research-social-preview-platforms.md) P2) |
| **Viber variant** | **One asset first.** Add a separate small thumbnail at a new URL only if [live verification](03-task-live-share-preview-verification.md) shows no image in Viber |

**Cache bust:** use new filename (`og-share.jpg`) so Meta crawler picks up the change without query-string hacks.
