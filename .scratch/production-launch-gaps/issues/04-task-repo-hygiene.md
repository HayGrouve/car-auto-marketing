# Fix repo hygiene before client handoff

**Labels:** `wayfinder:task`  
**Blocked by:** 01

## Question

What repo cleanup must land before the client receives the codebase?

Confirmed fixes (implementation, not decisions):

1. **Delete `package-lock.json`** — project uses pnpm; lockfile still references Netlify deps
2. **ESLint ignores** — add `.nitro/**` and `.output/**` to `eslint.config.js` (lint fails after local build)
3. **Remove dead asset** — `public/images/lovech-service-shop.png` (564 KB, unused)
4. **Promote handoff runbook** — move from `.scratch/` to `docs/deploy-vercel.md` and link from README
5. **Trim README** — remove TanStack template boilerplate (demo routes, generic getting-started)

Optional (depends on launch bar):
6. Pin `@tanstack/*` from `latest` to specific versions
7. Replace scaffold favicon/logos with Stefi branding
8. Run `scripts/compress-images.mjs` / convert PNGs to WebP

Resolve when launch bar (ticket 01) sets which optional items are in scope.
