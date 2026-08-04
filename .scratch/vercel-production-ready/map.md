# Map: Vercel production-ready (stefi-gas.com)

## Destination

The repo builds cleanly for Vercel via TanStack Start + Nitro, with `https://stefi-gas.com` as the canonical production domain in all active config, env examples, CI, and tests. Netlify-specific setup is removed. A client handoff checklist documents how to import the repo into the client's Vercel account, set env vars, and connect the domain — without performing the deploy in this effort.

## Notes

- **Domain:** Stefi Auto Gas — canonical URL `https://stefi-gas.com` (apex, no `www`)
- **Platform:** Vercel only (Netlify replaced, not dual-hosted)
- **Scope:** Deploy-ready tech; no live deploy, DNS wiring, or Vercel account connection in this map
- **Domain updates:** Active config/code only (`site.defaults.json`, `.env.example`, CI, tests, README) — not historical `docs/superpowers/` files
- **Skills:** Consult TanStack Start hosting docs and research findings before implementation

## Decisions so far

- [Research TanStack Start deployment on Vercel](issues/01-research-tanstack-start-vercel-deploy.md) — Nitro replaces Netlify plugin; Vercel zero-config build; headers via `vercel.json`; [research](../research-tanstack-start-vercel.md)
- [Decide Vercel migration spec](issues/02-grilling-vercel-migration-spec.md) — File-level migration spec with domain + header migration; [spec](../spec-vercel-migration.md)
- [Decide client Vercel handoff runbook](issues/03-grilling-client-handoff-runbook.md) — Seven-step client handoff with responsibility split; [runbook](../handoff-runbook.md)

## Not yet specified

<!-- Map complete — all decision tickets resolved. Implementation applied. -->

## Out of scope

- Connecting the repo to the client's Vercel account or triggering any live deploy
- DNS / domain registrar configuration (document as handoff steps only)
- Real client content changes (phone, address, hours) unless already final in `site-content.ts`
- Analytics, cookie banner, uptime monitoring
- E2e tests in CI
- Rewriting historical `docs/superpowers/` plans and specs to replace `avtoserviz-lovech.bg`
