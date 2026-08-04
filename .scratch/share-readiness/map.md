# Map: Share readiness (stefi-gas.com)

## Destination

Links pasted in Viber, Facebook, Messenger, and similar apps show the **correct Bulgarian title and description**, plus a **professional branded preview image**. A dedicated OG share card is the end state; the current hero photo is acceptable for soft launch once the share bar ticket confirms it.

## Notes

- **Prior map:** [Production launch gaps](../production-launch-gaps/map.md) — launch bar, deploy ops, branding timeline overlap but stay there unless this map surfaces a share-specific blocker
- **Stack:** TanStack Start SSR; meta via `buildSeoHead` in `src/lib/seo.ts`; all five public pages wired
- **Audit (Aug 4 2026):** OG + Twitter tags render in SSR HTML; single shared `hero.jpg` (1247×921) for all pages; JSON-LD + sitemap + robots present; unit tests on meta builder only
- **Skills:** `/grilling` for scope decisions; `/research` for platform preview requirements

## Decisions so far

- [Decide soft-launch share bar](issues/01-grilling-soft-launch-share-bar.md) — Nothing blocking launch; branded OG + live verification post-launch
- [Research social preview platform requirements](issues/04-research-social-preview-platform-requirements.md) — Meta/WhatsApp OK; Viber unverified (no published spec); [research](research-social-preview-platforms.md)
- [Decide branded OG asset spec and timing](issues/02-grilling-branded-og-asset-spec.md) — Post-launch 1200×630 `og-share.jpg`; dev-composed; Viber thumbnail only if live test fails

## Not yet specified

- Viber fallback thumbnail — only if ticket 03 live test shows no image
- E2e or integration tests asserting rendered HTML meta (beyond unit tests on `buildSeoHead`)
- 404 page share meta

## Out of scope

- **Per-page OG images** — destination is one branded share card for all pages; page-specific imagery ruled out
- **Preview-deploy noindex** — tracked on [Production launch gaps](../production-launch-gaps/map.md)
- **Favicon / manifest logo replacement** — tracked on [Production launch gaps](../production-launch-gaps/map.md)
- **SEO copy rewrites** in `site-content.ts` — content is already in place
