# Vercel migration spec (Option A — deploy-ready tech)

## Goal

Replace Netlify hosting setup with Vercel/Nitro, update active production domain references to `https://stefi-gas.com`, and document client handoff — without performing a live deploy.

## User decisions (from map charting)

| Decision | Choice |
|----------|--------|
| Production scope | Deploy-ready tech only; client deploys later |
| Canonical URL | `https://stefi-gas.com` (apex) |
| Hosting | Vercel/Nitro only — Netlify removed |
| Domain updates | Active config/code only (not `docs/superpowers/`) |
| Preview env | `VITE_SITE_URL` set in Production only; preview/CI fall back to `site.defaults.json` |
| www redirect | Vercel domain settings at deploy time (handoff doc, not repo) |
| Headers | Migrate `public/_headers` → `vercel.json`, then delete `_headers` |

## File map

| File | Action |
|------|--------|
| `vite.config.ts` | Remove `netlify()`; add `nitro()` from `nitro/vite` |
| `package.json` | Add `nitro` devDep; remove `@netlify/vite-plugin-tanstack-start` |
| `pnpm-lock.yaml` | Regenerate via `pnpm install` |
| `vercel.json` | **Create** — `framework: tanstack-start` + security/cache headers |
| `netlify.toml` | **Delete** |
| `public/_headers` | **Delete** (after `vercel.json` headers) |
| `site.defaults.json` | Update `siteUrl` → `https://stefi-gas.com` |
| `.env.example` | Update URL + comment referencing Vercel env vars |
| `.github/workflows/ci.yml` | Update `VITE_SITE_URL` → `https://stefi-gas.com` |
| `src/lib/seo.test.ts` | Update hardcoded domain assertions |
| `README.md` | Replace Netlify deploy section with Vercel handoff summary |
| `.cta.json` | Remove `netlify` from tooling list if present |

**No changes:** application routes, `site-content.ts` business content, `docs/superpowers/` archives, e2e setup.

## Target vite.config.ts

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), nitro(), tailwindcss(), viteReact()],
})

export default config
```

## Target vercel.json

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "tanstack-start",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/images/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=604800, immutable" }
      ]
    }
  ]
}
```

## Vercel environment variables (handoff)

| Variable | Required | Production value | Purpose |
|----------|----------|------------------|---------|
| `VITE_SITE_URL` | Yes (Production) | `https://stefi-gas.com` | Canonical URL, sitemap, robots, OG meta |

Set in **Vercel → Project Settings → Environment Variables → Production** only.

## Verification (local, before handoff)

```bash
pnpm install
pnpm lint && pnpm test && pnpm build
```

Confirm build succeeds with Nitro plugin and no Netlify references remain.

## Out of scope (unchanged from map)

- Connecting repo to client's Vercel account
- DNS / domain registrar configuration
- Content changes (phone, address, hours)
- Analytics, monitoring, e2e in CI

## Research reference

[research-tanstack-start-vercel.md](./research-tanstack-start-vercel.md)
