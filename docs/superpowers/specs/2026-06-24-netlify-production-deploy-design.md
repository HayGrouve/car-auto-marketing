# Netlify production deploy design (Option A)

## Goal

Make the project deploy-ready on Netlify with reliable builds, documented environment setup, and automated CI — while keeping placeholder client content in `site-content.ts`.

## User decisions

| Decision | Choice |
|----------|--------|
| Production scope | **A** — deploy-ready tech only |
| Approach | **2** — Netlify config + GitHub Actions CI |
| Content | Placeholder phone, address, domain remain until client handoff |
| E2e in CI | No — unit tests + build only |

## Current state

Already in place from launch polish:

| Area | Status |
|------|--------|
| `netlify.toml` | `pnpm build`, publish `dist/client` |
| TanStack Start on Netlify | `@netlify/vite-plugin-tanstack-start` in `vite.config.ts` |
| SEO at build | `prebuild` → `scripts/generate-seo-files.mjs` |
| Env-driven URL | `VITE_SITE_URL` via `src/lib/site-url.ts` + `site.defaults.json` |
| Security headers | `public/_headers` |
| Tests | 24 unit tests, 6 e2e smoke tests (local) |
| `.env.example` | `VITE_SITE_URL=https://avtoserviz-lovech.bg` |

Gaps for Option A:

- No pinned Node version (`.nvmrc`)
- No `packageManager` field in `package.json` (CI pnpm pin)
- No GitHub Actions workflow
- README deploy section outdated (`npm`, bare `vite build`)

## In scope

1. **`.nvmrc`** — Node 22 (matches `@types/node` ^22)
2. **`package.json`** — add `packageManager: "pnpm@10.33.0"` (or current lockfile pnpm)
3. **`.github/workflows/ci.yml`** — lint, unit test, build on push/PR to `main`
4. **`README.md`** — accurate Netlify deploy checklist and env var table
5. **`.env.example`** — brief comment that Netlify uses the same variable name

## Out of scope

- Real client content (phone, address, hours, map pin)
- Custom domain / DNS configuration
- Analytics, cookie banner
- E2e tests in CI
- Netlify deploy previews (Approach 3)
- Favicon / logo replacement
- Post-deploy monitoring or uptime checks

---

## Netlify build configuration

### `netlify.toml` (no change required)

```toml
[build]
  command = "pnpm build"
  publish = "dist/client"
```

`pnpm build` runs `prebuild` first, which regenerates `public/sitemap.xml` and `public/robots.txt` using `VITE_SITE_URL` from the Netlify environment.

### Node and pnpm

| File | Value | Purpose |
|------|-------|---------|
| `.nvmrc` | `22` | Netlify and CI use same Node major |
| `package.json` `packageManager` | `pnpm@10.33.0` | Corepack / `pnpm/action-setup` pin |

Netlify detects pnpm from `pnpm-lock.yaml`. CI uses explicit pnpm setup.

### Netlify environment variables

Set in **Site settings → Environment variables** (Production context):

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `VITE_SITE_URL` | Yes | `https://avtoserviz-lovech.bg` | Canonical URL, sitemap, robots, OG/Twitter meta |

Until a custom domain is live, use the Netlify subdomain (e.g. `https://your-site.netlify.app`) so sitemap and canonical URLs match the deployed origin.

**Important:** If `VITE_SITE_URL` is unset at build time, the build still succeeds but SEO files and client bundle fall back to `site.defaults.json` (`https://avtoserviz-lovech.bg`).

---

## GitHub Actions CI

### File

`.github/workflows/ci.yml`

### Triggers

- `push` to `main`
- `pull_request` targeting `main`

### Job: `ci`

Single job, Ubuntu latest:

```yaml
steps:
  - checkout
  - setup Node (node-version-file: .nvmrc)
  - setup pnpm (version from packageManager)
  - pnpm install --frozen-lockfile
  - pnpm lint
  - pnpm test
  - pnpm build
    env:
      VITE_SITE_URL: https://avtoserviz-lovech.bg
```

### CI environment

`VITE_SITE_URL` is set in the workflow to the fallback production domain so `prebuild` and Vite inject consistent URLs during CI builds. This matches `site.defaults.json` and does not require GitHub secrets for Option A.

### Not in CI

| Command | Reason |
|---------|--------|
| `pnpm test:e2e` | Playwright browser deps; run locally |
| `pnpm compress-images` | One-off dev script |

### Failure policy

Any step failure fails the workflow. PRs should not merge with a red CI check.

---

## Documentation updates

### README.md — Deploy to Netlify section

Replace outdated steps with:

1. **Prerequisites** — Node 22, pnpm 10
2. **Local verify before deploy:**
   ```bash
   pnpm lint && pnpm test && pnpm build
   ```
3. **Netlify import** — connect GitHub repo; confirm build command `pnpm build`, publish `dist/client` (auto from `netlify.toml`)
4. **Environment variables** — set `VITE_SITE_URL` in Production
5. **First deploy checklist:**
   - [ ] Build succeeds on Netlify
   - [ ] Homepage loads
   - [ ] `/sitemap.xml` and `/robots.txt` return correct domain
   - [ ] View source: canonical and `og:url` match `VITE_SITE_URL`
6. **CI** — GitHub Actions runs on every push/PR to `main`

### `.env.example`

Add comment:

```
# Set the same variable in Netlify → Site settings → Environment variables
VITE_SITE_URL=https://avtoserviz-lovech.bg
```

---

## File map

| File | Action |
|------|--------|
| `.nvmrc` | Create |
| `package.json` | Add `packageManager` |
| `.github/workflows/ci.yml` | Create |
| `README.md` | Update deploy section |
| `.env.example` | Add Netlify comment |

No changes to `netlify.toml`, `vite.config.ts`, or application code.

---

## Verification

### Local (before merge)

```bash
pnpm lint && pnpm test && pnpm build
```

### After CI merge

- GitHub Actions workflow green on `main`
- Optional: connect repo to Netlify and confirm first deploy succeeds with `VITE_SITE_URL` set

### Post-deploy smoke (manual)

| Check | Expected |
|-------|----------|
| `/` | 200, site renders |
| `/sitemap.xml` | Contains `VITE_SITE_URL` host |
| `/robots.txt` | `Sitemap:` points to production URL |
| Page source | `og:url` and canonical match production domain |

---

## Success criteria

- Node and pnpm versions pinned for reproducible builds
- CI runs lint, unit tests, and build on every PR to `main`
- README documents Netlify setup and required env vars
- Netlify build uses `pnpm build` with `VITE_SITE_URL` documented
- Placeholder content unchanged — site is technically deploy-ready, not content-complete

## Risks

| Risk | Mitigation |
|------|------------|
| `VITE_SITE_URL` not set on Netlify | README checklist; fallback domain in `site.defaults.json` |
| CI pnpm version mismatch | `packageManager` field + frozen lockfile |
| SSR routing on Netlify | Already handled by `@netlify/vite-plugin-tanstack-start` — no SPA fallback needed |
