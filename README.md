# Stefi Auto Gas — marketing site

Bulgarian marketing website for [Stefi Auto Gas](https://stefi-gas.com): car service, GTP inspections, LPG/CNG gas systems, and repairs. Built with TanStack Start, deployed to Vercel.

**Routes:** `/` (home), `/gtp`, `/gaz`, `/remonti`, `/kontakti`

## Prerequisites

- Node 22 (see `.nvmrc`)
- pnpm 10 (`corepack enable` if needed)

This project uses **pnpm only** — do not use npm or the removed `package-lock.json`.

## Development

```bash
pnpm install
pnpm dev
```

## Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Local dev server |
| `pnpm build` | Production build (runs SEO file generation first) |
| `pnpm preview` | Preview production build |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | E2e smoke tests (Playwright; run `pnpm exec playwright install` once) |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier + ESLint fix |
| `pnpm generate-seo` | Regenerate `public/sitemap.xml` and `public/robots.txt` |
| `pnpm compress-images` | Compress PNG/JPG assets in `public/images/` |
| `pnpm generate-icons` | Regenerate favicon and PWA icons from `public/logo.png` |

## Environment

Copy `.env.example` to `.env.local` for local development:

```bash
VITE_SITE_URL=https://stefi-gas.com
```

Canonical URL drives sitemap, robots, Open Graph, and Twitter meta tags.

## Deploy to Vercel

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` |
| Framework | TanStack Start (auto-detected) |
| Node version | 22 |

### Local verify before deploy

```bash
pnpm install
pnpm lint && pnpm test && pnpm build
```

### Quick setup

1. Import the repo in the [Vercel dashboard](https://vercel.com/new)
2. Set `VITE_SITE_URL=https://stefi-gas.com` in Production environment variables
3. Deploy, then add `stefi-gas.com` and configure `www` → apex redirect
4. Run the post-deploy smoke checklist

Full step-by-step handoff runbook: **[docs/deploy-vercel.md](docs/deploy-vercel.md)**

### First deploy checklist

- [ ] Vercel build succeeds
- [ ] Homepage loads
- [ ] `/sitemap.xml` and `/robots.txt` use `stefi-gas.com`
- [ ] Page source: `canonical` and `og:url` match `VITE_SITE_URL`
- [ ] Security headers present (`X-Frame-Options`, `X-Content-Type-Options`)

## CI

GitHub Actions runs `pnpm lint`, `pnpm test`, `pnpm build`, and Playwright e2e smoke tests on every push and pull request to `main`.

For local e2e: `pnpm exec playwright install` once, then `pnpm test:e2e`.

## Project structure

- `src/routes/` — file-based routes (TanStack Router)
- `src/data/site-content.ts` — page copy and contact info
- `src/data/services-catalog.ts` — service listings
- `src/lib/seo.ts` — meta tags and JSON-LD helpers
- `scripts/generate-seo-files.mjs` — sitemap/robots generation at build
- `public/images/` — static images
