# TanStack Start → Vercel migration research

Research for wayfinder ticket: migrate `marketing-auto` from Netlify (`@netlify/vite-plugin-tanstack-start`) to Vercel-only deployment using Nitro.

**Primary sources consulted:**

- [TanStack Start — Hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting)
- [Vercel — TanStack Start on Vercel](https://vercel.com/docs/frameworks/full-stack/tanstack-start)
- [Vercel KB — Deploy a TanStack Start app to Vercel](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel)
- [Vercel KB — Migrate TanStack Start from Netlify to Vercel](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel)
- [Vercel KB — Nitro Vite plugin](https://vercel.com/kb/guide/nitro-vite-plugin)
- [Nitro — Deploy (zero-config providers)](https://nitro.build/deploy)
- [Nitro — Vercel provider](https://v3.nitro.build/deploy/providers/vercel)
- [Nitro — Routing / route rules](https://nitro.build/docs/routing)
- [Vercel — Project configuration (`vercel.json`)](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel — Environment variables](https://vercel.com/docs/environment-variables)
- [Vercel — Deployments / environments](https://vercel.com/docs/deployments/environments)

---

## Current state (this repo)

| Item | Current value |
|------|---------------|
| Vite plugin | `@netlify/vite-plugin-tanstack-start` (`netlify()`) |
| `vite.config.ts` plugins | `[netlify(), tailwindcss(), tanstackStart(), viteReact()]` |
| Build command | `pnpm build` → `vite build` |
| Netlify publish dir | `dist/client` (`netlify.toml`) |
| Security/cache headers | `public/_headers` (copied into build output on Netlify) |
| Build-time URL | `VITE_SITE_URL` via `prebuild` → `scripts/generate-seo-files.mjs` and Vite client bundle |
| Node | `.nvmrc` → 22 |

---

## 1. Required `vite.config.ts` changes

### Remove Netlify plugin, add Nitro plugin

Per [TanStack Start hosting — Nitro](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro) and [Vercel TanStack Start docs](https://vercel.com/docs/frameworks/full-stack/tanstack-start):

```ts
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

const config = defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    tanstackStart(),
    nitro(),
    viteReact(),
  ],
})

export default config
```

### Plugin order

Official examples consistently use:

1. `tanstackStart()`
2. `nitro()`
3. Framework plugin (`viteReact()`)

Sources: [TanStack hosting](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro), [Vercel deploy guide](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel), [Netlify→Vercel migration guide](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel).

**Recommendation for this repo:** Keep `tailwindcss()` first (CSS pipeline), then `tanstackStart()`, `nitro()`, `viteReact()`. Tailwind is not mentioned in official TanStack/Vercel docs but is a standard Vite CSS plugin and should remain before the app framework plugins.

The old Netlify plugin docs say placement is flexible ([TanStack — Netlify](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#netlify)); Nitro docs do not document tailwind ordering. Do **not** place `nitro()` before `tanstackStart()`.

### Remove legacy Netlify target (if present)

Migration guide notes older TanStack Start versions used `tanstackStart({ target: 'netlify' })` or `preset: 'netlify'` in `app.config.ts`. This project has neither — no action needed. ([Netlify→Vercel migration](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel))

### No explicit Vercel preset in `vite.config.ts`

Nitro auto-detects Vercel during a Vercel build and applies the `vercel` preset with zero config. ([Nitro deploy — zero-config providers](https://nitro.build/deploy), [Netlify→Vercel migration](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel))

Only set `nitro({ preset: 'vercel' })` if auto-detection fails (e.g. local builds targeting Vercel output, or CI outside Vercel). For Bun deployments, TanStack docs use `nitro({ preset: 'bun' })` — not applicable here.

---

## 2. `package.json` dependency changes

### Add

```bash
pnpm add nitro
```

TanStack and Vercel docs install `nitro` as a regular dependency (`pnpm i nitro`). It is a build-time plugin consumed by Vite; either `dependencies` or `devDependencies` works, but follow upstream convention: **`dependencies`**.

Source: [TanStack hosting — Nitro install](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nitro), [Vercel TanStack Start](https://vercel.com/docs/frameworks/full-stack/tanstack-start).

### Remove

```bash
pnpm remove @netlify/vite-plugin-tanstack-start
```

Also remove any other `@netlify/*` packages if present after code audit (`@netlify/functions`, `@netlify/blobs`, etc.). This project only has the TanStack Start Netlify plugin.

Source: [Netlify→Vercel migration — step 2](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel).

### Scripts — minimal changes

Keep existing scripts; Vercel runs `pnpm build` automatically:

```json
{
  "scripts": {
    "dev": "vite dev",
    "prebuild": "node scripts/generate-seo-files.mjs",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

Optional (local Node testing only, not required for Vercel):

```json
"start": "node .output/server/index.mjs"
```

Source: [TanStack hosting — Node.js / Docker](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nodejs--docker), [Netlify→Vercel migration — step 3](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel).

Do **not** add `netlify deploy` or Netlify-specific scripts.

---

## 3. Is `vercel.json` needed?

### Default: **no** — zero-config deployment

Vercel detects TanStack Start + Nitro and sets build command and output directory automatically. Explicit build/output settings are **not required**.

Sources:
- [Deploy TanStack Start to Vercel](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel) — *"you don't need to set a build command or output directory"*
- [Nitro Vite plugin KB](https://vercel.com/kb/guide/nitro-vite-plugin) — *"deploys with zero configuration"*
- [Nitro Vercel provider](https://v3.nitro.build/deploy/providers/vercel) — *"zero configuration"*

### When to add `vercel.json`

| Use case | Property | Source |
|----------|----------|--------|
| Framework not auto-detected (monorepo, prior framework) | `"framework": "tanstack-start"` | [Deploy guide — troubleshooting](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel) |
| Security/cache headers (migrate from `public/_headers`) | `"headers": [...]` | [vercel.json — headers](https://vercel.com/docs/project-configuration/vercel-json#headers), [Netlify→Vercel migration — best practices](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel) |
| Redirects/rewrites from `netlify.toml` | `"redirects"`, `"rewrites"` | [Project configuration](https://vercel.com/docs/project-configuration) |
| Per-route function tuning | Prefer `nitro.config.ts` → `vercel.functionRules` | [Nitro Vercel provider](https://v3.nitro.build/deploy/providers/vercel) |

**Do not** set `buildCommand` or `outputDirectory` unless auto-detection fails. Override via CLI if needed:

```bash
vercel project update --framework tanstack-start
```

Source: [Deploy guide — framework preset](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel).

### Recommended `vercel.json` for this project

This repo has no redirects in `netlify.toml`, but **does** have security/cache headers in `public/_headers`. Add `vercel.json` for headers (see section 4). Framework preset is optional if detection works.

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
        {
          "key": "Cache-Control",
          "value": "public, max-age=604800, immutable"
        }
      ]
    }
  ]
}
```

Install command and build command can be omitted; Vercel detects pnpm via `packageManager` field in `package.json`.

---

## 4. Migrating Netlify `public/_headers` to Vercel

### Current Netlify headers (`public/_headers`)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/images/*
  Cache-Control: public, max-age=604800, immutable
```

Netlify reads `_headers` at deploy time. On Vercel with Nitro, **`public/_headers` is not automatically honored** — it would only ship as a static file unless migrated.

### Option A (recommended for this project): `vercel.json` headers

Vercel applies `headers` from `vercel.json` to static files, Vercel Functions, and matched routes.

Source: [vercel.json — headers](https://vercel.com/docs/project-configuration/vercel-json#headers), [Vercel system headers](https://vercel.com/docs/headers).

Path syntax uses `source` patterns (path-to-regexp), not Netlify globs. Map:

| Netlify | Vercel `source` |
|---------|-----------------|
| `/*` | `/(.*)` |
| `/images/*` | `/images/(.*)` |

### Option B: Nitro `routeRules` in `nitro.config.ts`

For route-level headers applied by Nitro at runtime:

```ts
// nitro.config.ts
import { defineConfig } from 'nitro'

export default defineConfig({
  routeRules: {
    '/images/**': {
      headers: { 'cache-control': 'public, max-age=604800, immutable' },
    },
    '/**': {
      headers: {
        'x-frame-options': 'DENY',
        'x-content-type-options': 'nosniff',
        'referrer-policy': 'strict-origin-when-cross-origin',
      },
    },
  },
})
```

Source: [Nitro routing — route rules / headers](https://nitro.build/docs/routing).

**Note from Nitro docs:** Platform-native static config (Vercel `config.json`) does not split by HTTP method; prefer method-agnostic rules for headers you expect the platform to emit statically.

### Recommendation

Use **`vercel.json` headers** for this marketing site — matches the Netlify `_headers` model, applies at the CDN edge, and keeps security policy visible in repo config. Remove `public/_headers` after migration to avoid confusion (it would not affect Vercel behavior).

Migration guide explicitly says: recreate Netlify headers in Nitro route rules or `vercel.json`. ([Netlify→Vercel migration — best practices](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel))

---

## 5. Build output structure

### Netlify (current)

| Path | Role |
|------|------|
| `dist/client/` | Static client assets + copied `public/` (including `_headers`, sitemap, robots) |
| Server | Handled by `@netlify/vite-plugin-tanstack-start` → Netlify Functions |

Configured via `netlify.toml`: `publish = "dist/client"`.

### Nitro + Vercel (target)

| Path | Role |
|------|------|
| `.output/` | Nitro production output root |
| `.output/public/` | Static assets (JS/CSS bundles, public files) |
| `.output/server/index.mjs` | Server entry (Node/local; Vercel uses Build Output API instead) |

Nitro Vite plugin: *"Nitro emits an optimized, portable server to the `.output/` directory."* ([Nitro Vite plugin KB](https://vercel.com/kb/guide/nitro-vite-plugin))

On Vercel, Nitro's **`vercel` preset** transforms `.output` into [Vercel Build Output API](https://vercel.com/docs/build-output-api/v3) format (functions + static assets). Vercel consumes this automatically — **do not** point the dashboard at `dist/client` or `.output/public` manually under normal operation.

TanStack Start with Nitro still produces intermediate Vite output under `dist/` during the build, but **deployment artifact is `.output/`**, not `dist/client`.

### `.gitignore`

`.output` is already gitignored in this repo. Keep it.

### Local verification after migration

```bash
pnpm build
ls -la .output/
ls -la .output/public/
```

Optional local server test:

```bash
node .output/server/index.mjs
```

Source: [TanStack hosting — Node.js](https://tanstack.com/start/latest/docs/framework/react/guide/hosting#nodejs--docker).

---

## 6. Environment variable handling — `VITE_SITE_URL`

### How this project uses `VITE_SITE_URL`

| Consumer | Mechanism | When read |
|----------|-----------|-----------|
| `scripts/generate-seo-files.mjs` | `process.env.VITE_SITE_URL` | Build time (`prebuild`) |
| `src/lib/site-url.ts` | `import.meta.env.VITE_SITE_URL` | Build time (inlined into client bundle) |
| Fallback | `site.defaults.json` → `https://avtoserviz-lovech.bg` | When unset |

### Vite prefix rules on Vercel

From [Deploy TanStack Start to Vercel — env vars](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel):

- **`VITE_*`** → bundled into client code via `import.meta.env`. Safe for public values only.
- **Unprefixed** → server-only via `process.env`. Use for secrets.

`VITE_SITE_URL` is appropriate — it is a public canonical URL.

### Vercel vs Netlify differences

| Aspect | Netlify | Vercel |
|--------|---------|--------|
| Config location | Dashboard + optional `netlify.toml` `[context.*.environment]` | Dashboard per environment (Production, Preview, Development) |
| Build-time availability | Yes, when set in site env | Yes, when set for the deploying environment |
| Redeploy required after change | Yes | Yes — *"Existing deployments keep the values they were built with"* ([Env vars docs](https://vercel.com/docs/environment-variables)) |
| Local dev sync | Netlify CLI / `.env` | `vercel link` + `vercel env pull` → `.env` / `.env.local` |

### Production setup (required)

In Vercel project settings → Environment Variables:

| Variable | Environments | Value |
|----------|--------------|-------|
| `VITE_SITE_URL` | Production | `https://avtoserviz-lovech.bg` |

This ensures:
- `prebuild` writes correct `public/sitemap.xml` and `public/robots.txt`
- Client meta tags (`canonical`, `og:url`) match production domain

### Preview deployment strategy

Preview deployments get auto-generated URLs (e.g. `project-abc123.vercel.app`). Vercel exposes system vars like `VERCEL_URL` at build time, but **`VERCEL_URL` does not populate `VITE_SITE_URL` automatically**.

Options:

1. **Accept fallback domain on Preview** — unset `VITE_SITE_URL` for Preview; `site.defaults.json` provides production URL. SEO files and meta tags show production domain on preview URLs. Acceptable for internal QA; not ideal for shareable preview links.

2. **Set Preview-specific `VITE_SITE_URL`** — use Vercel [branch-specific preview variables](https://vercel.com/docs/environment-variables#preview-environment-variables) (CLI 22.0.0+). Impractical for every preview URL unless using a stable staging domain.

3. **Enhance build script (future spec item)** — in `generate-seo-files.mjs`, fall back to `https://${process.env.VERCEL_URL}` when `VITE_SITE_URL` is unset and `VERCEL_URL` is present. Would make preview sitemap/canonical match preview origin. Not in current codebase; document as optional improvement.

4. **Custom environment / staging domain** — attach a domain to a Vercel custom environment with its own `VITE_SITE_URL`.

**Migration spec minimum:** set `VITE_SITE_URL` for **Production**; document Preview behavior and choose option 1 or 3.

### CI parity

Current `.github/workflows/ci.yml` sets `VITE_SITE_URL: https://avtoserviz-lovech.bg` — keep this for CI builds regardless of host.

### Local development

```bash
vercel link
vercel env pull   # writes .env with Development env vars
```

Or keep `.env.local` with `VITE_SITE_URL=...` as documented in `.env.example`.

---

## 7. Vercel-specific Nitro preset configuration

### Auto-detection (default — use this)

Nitro preset: **`vercel`**. Detected automatically when building on Vercel CI. No `nitro.config.ts` required for basic SSR deploy.

Sources:
- [Nitro deploy — zero-config providers](https://nitro.build/deploy) (lists `vercel`)
- [Nitro Vercel provider](https://v3.nitro.build/deploy/providers/vercel) — preset `vercel`
- [Netlify→Vercel migration](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel) — *"Nitro detects Vercel during a Vercel build and applies the `vercel` preset without any extra configuration"*

### Optional `nitro.config.ts` (advanced — not needed for initial migration)

Create only if you need Vercel platform features:

| Feature | Config | Source |
|---------|--------|--------|
| Per-route function memory/duration/regions | `vercel.functionRules` | [Nitro Vercel provider](https://v3.nitro.build/deploy/providers/vercel) |
| Cron jobs | `scheduledTasks` + `experimental.tasks` | [Nitro Vercel provider — scheduled tasks](https://v3.nitro.build/deploy/providers/vercel) |
| Queues | `vercel.queues.triggers` | [Nitro Vercel provider — queues](https://v3.nitro.build/deploy/providers/vercel) |
| ISR / on-demand revalidation | `routeRules` with `isr` | [Nitro Vercel provider — ISR](https://v3.nitro.build/deploy/providers/vercel) |
| CDN proxy rewrites | `routeRules` with `proxy` to external URLs | [Nitro Vercel provider — proxy route rules](https://v3.nitro.build/deploy/providers/vercel) |
| Bun runtime | `vercel.functions.runtime: "bun1.x"` or `vercel.json` `bunVersion` | [Nitro Vercel provider — Bun](https://v3.nitro.build/deploy/providers/vercel) |
| Custom Build Output API merge | `vercel.config` | [Nitro Vercel provider — custom build output](https://v3.nitro.build/deploy/providers/vercel) |

This project uses no server functions, blobs, cron, or queues — **skip `nitro.config.ts` for v1**.

### Runtime behavior on Vercel

- SSR and server functions run as **Vercel Functions** on **Fluid Compute** by default.
- Source: [TanStack Start on Vercel](https://vercel.com/docs/frameworks/full-stack/tanstack-start), [Deploy guide](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel)

### API route convention

Nitro's `/api` directory is **not compatible with Vercel**. Use `routes/api/` for standalone API handlers. This project has no standalone API routes — no action needed.

Source: [Nitro Vercel provider — API routes](https://v3.nitro.build/deploy/providers/vercel)

---

## 8. What to remove

### Files

| File | Action |
|------|--------|
| `netlify.toml` | **Delete** — Vercel auto-detects Nitro output ([Netlify→Vercel migration](https://vercel.com/kb/guide/migrate-a-tanstack-start-app-from-netlify-to-vercel)) |
| `public/_headers` | **Delete** after migrating headers to `vercel.json` or `nitro.config.ts` |

### Dependencies

| Package | Action |
|---------|--------|
| `@netlify/vite-plugin-tanstack-start` | **Remove** from `devDependencies` |
| Any `@netlify/*` runtime packages | **Remove** if referenced in code (none found) |

### Code

| Location | Action |
|----------|--------|
| `vite.config.ts` | Remove `import netlify from '@netlify/vite-plugin-tanstack-start'` and `netlify()` from plugins |
| `vite.config.ts` | Add `import { nitro } from 'nitro/vite'` and `nitro()` after `tanstackStart()` |

### Config / docs to update (follow-up tasks, not deploy blockers)

| Item | Notes |
|------|-------|
| `README.md` | Replace Netlify deploy section with Vercel |
| `.cta.json` | Remove `"netlify"` scaffold entry if present |
| `.gitignore` | `.netlify` entry can stay (harmless) or be removed |

### Keep unchanged

| Item | Why |
|------|-----|
| `pnpm build` / `prebuild` | Same build entrypoint works on Vercel |
| `public/sitemap.xml`, `public/robots.txt` | Still generated at build time |
| `.nvmrc` (Node 22) | Set matching Node version in Vercel project settings |
| `packageManager: "pnpm@10.33.0"` | Vercel respects Corepack/pnpm |

---

## Migration checklist (actionable spec)

### Phase 1 — Code & deps

- [ ] `pnpm add nitro`
- [ ] `pnpm remove @netlify/vite-plugin-tanstack-start`
- [ ] Update `vite.config.ts`: remove `netlify()`, add `nitro()` after `tanstackStart()`
- [ ] Delete `netlify.toml`

### Phase 2 — Headers

- [ ] Add `vercel.json` with security + cache headers (section 4)
- [ ] Delete `public/_headers`

### Phase 3 — Vercel project

- [ ] Import repo at [vercel.com/new](https://vercel.com/new)
- [ ] Confirm Framework Preset = **TanStack Start** (or set `"framework": "tanstack-start"` in `vercel.json`)
- [ ] Set Node.js version → **22** (match `.nvmrc`)
- [ ] Set `VITE_SITE_URL=https://avtoserviz-lovech.bg` for **Production**
- [ ] Decide Preview `VITE_SITE_URL` strategy (section 6)

### Phase 4 — Verify

- [ ] `pnpm build` succeeds locally; `.output/` exists
- [ ] Deploy preview; confirm SSR pages render
- [ ] Confirm client navigation works (404 on routes = missing `nitro()` plugin)
- [ ] Check response headers (security + `/images/*` cache)
- [ ] Verify `/sitemap.xml`, `/robots.txt`, page `canonical` / `og:url` use expected domain
- [ ] Run existing test suite (`pnpm test`, `pnpm test:e2e`)

### Phase 5 — Cutover

- [ ] Point production domain to Vercel
- [ ] Decommission Netlify site

---

## Troubleshooting reference

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| Routes 404 on Vercel | Missing `nitro()` in Vite plugins | Add plugin, redeploy ([Deploy guide](https://vercel.com/kb/guide/deploy-a-tanstack-start-app-to-vercel)) |
| Framework not detected | Monorepo / legacy config | `"framework": "tanstack-start"` in `vercel.json` or `vercel project update --framework tanstack-start` |
| Build OK locally, fails on Vercel | Node version mismatch | Align Vercel Node 22 with `.nvmrc` |
| SEO files show wrong domain | `VITE_SITE_URL` unset at build | Set in Vercel env for target environment, redeploy |
| Headers missing | Still relying on `public/_headers` | Migrate to `vercel.json` headers |
| API 404 | Handlers in `/api` dir | Move to `routes/api/` ([Nitro Vercel provider](https://v3.nitro.build/deploy/providers/vercel)) |

---

## Summary for migration spec

**Core change:** swap `@netlify/vite-plugin-tanstack-start` → `nitro/vite` plugin. Vercel + Nitro handle the rest with zero-config detection.

**Minimal diff:**
1. Add `nitro` dependency
2. `vite.config.ts`: `[tailwindcss(), tanstackStart(), nitro(), viteReact()]`
3. Remove Netlify plugin dep + `netlify.toml`
4. Add `vercel.json` for headers (only required repo config beyond vite/package changes for this project)
5. Configure `VITE_SITE_URL` in Vercel Production env vars

**Output path change:** deploy artifact moves from `dist/client` (Netlify) to Nitro `.output/` consumed by Vercel Build Output API — no manual `outputDirectory` setting needed.

**No `nitro.config.ts` needed** for this static marketing SSR site unless adding Vercel platform features later.
