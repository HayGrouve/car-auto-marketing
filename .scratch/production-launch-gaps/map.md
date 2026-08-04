# Map: Production launch gaps (stefi-gas.com)

## Destination

Every gap between the current repo and a confident production launch on `https://stefi-gas.com` is either **fixed**, **assigned to client deploy ops**, or **consciously deferred with documented rationale**. No unknown blockers remain.

## Notes

- **Prior map:** [Vercel production-ready](../vercel-production-ready/map.md) — migration spec, handoff runbook, and Vercel/Nitro config are done
- **Stack:** TanStack Start + Nitro → Vercel; static marketing site, Bulgarian locale
- **Audit (Aug 4 2026):** 61 unit tests pass; build succeeds; CI lint/test/build pass on clean tree; local lint fails after build (`.nitro/` not ignored)
- **Skills:** `/grilling` for scope decisions; `/research` not needed — codebase audit complete

## Decisions so far

<!-- empty — charting session -->

## Not yet specified

- Performance budget: image compression, bundle size targets, WebP rollout
- Branded assets: favicon, logo192/512 replacement timeline
- CSP / Permissions-Policy header policy
- Preview-deploy noindex strategy
- Post-launch ops doc (content updates, image pipeline, monitoring runbook)
- Dependency pinning policy for `@tanstack/*` `latest` tags
- Nitro `h3` audit findings — upgrade path when patch available

## Out of scope

- Live Vercel account connection, DNS, SSL (client handoff — see [handoff runbook](../vercel-production-ready/handoff-runbook.md))
- Real client content verification (phone, hours, address) unless client requests changes
- Rewriting historical `docs/superpowers/` Netlify-era plans
