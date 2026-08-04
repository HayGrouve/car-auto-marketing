# Client Vercel handoff runbook

Step-by-step for deploying this repo to the **client's Vercel account** on `stefi-gas.com`.

## Prerequisites

- Node 22, pnpm 10 (see `.nvmrc` and `packageManager` in `package.json`)
- Repo pushed to GitHub (or GitLab/Bitbucket)
- Client has a Vercel account with access to add projects
- Domain `stefi-gas.com` registered — client controls DNS

## 1. Local verify (developer, before handoff)

```bash
pnpm install
pnpm lint && pnpm test && pnpm build
```

All must pass. Build uses Nitro + TanStack Start.

## 2. Import project to Vercel (client)

1. Log in to [vercel.com](https://vercel.com) (client account)
2. **Add New → Project** → import the Git repository
3. Confirm **Framework Preset: TanStack Start** (auto-detected)
4. Confirm build settings (auto-detected — do not override unless detection fails):
   - **Build command:** `pnpm build` (or default from framework)
   - **Install command:** `pnpm install` (Vercel detects pnpm from lockfile)
5. **Do not deploy yet** — add env vars first (step 3)

If framework is wrong: Project Settings → Build → Framework Preset → **TanStack Start**, or CLI: `vercel project update --framework tanstack-start`

## 3. Environment variables (client)

In **Project Settings → Environment Variables**:

| Variable | Environments | Value |
|----------|--------------|-------|
| `VITE_SITE_URL` | **Production only** | `https://stefi-gas.com` |

Do not set for Preview unless you want preview builds to use a specific URL. Unset previews fall back to `site.defaults.json`.

## 4. First deploy (client)

1. Click **Deploy** (or push to `main` if Git integration is connected)
2. Wait for build to succeed
3. Note the `*.vercel.app` preview URL for smoke testing

## 5. Custom domain (client)

1. **Project Settings → Domains**
2. Add `stefi-gas.com`
3. Add `www.stefi-gas.com` → configure redirect to `stefi-gas.com` (apex canonical)
4. Apply DNS records Vercel shows at the domain registrar
5. Wait for SSL provisioning

**Developer responsibility:** none — document only. Client owns registrar access.

## 6. Post-deploy smoke checklist

| Check | Expected |
|-------|----------|
| `https://stefi-gas.com/` | 200, site renders |
| `/sitemap.xml` | Contains `stefi-gas.com` |
| `/robots.txt` | `Sitemap:` points to `https://stefi-gas.com/sitemap.xml` |
| Page source | `canonical` and `og:url` use `https://stefi-gas.com` |
| Security headers | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff` |
| `/images/*` | `Cache-Control: public, max-age=604800, immutable` |

## 7. Ongoing

- **Production deploys:** auto on push to `main` (if Git connected)
- **Preview deploys:** auto on pull requests
- **CI:** GitHub Actions runs lint, test, build on push/PR to `main` (independent of Vercel)

## Responsibility split

| Task | Who |
|------|-----|
| Code migration (Nitro, domain defaults, vercel.json) | Developer |
| Local verify + merge to main | Developer |
| Vercel account, import repo, env vars, deploy | Client |
| DNS at registrar, www redirect | Client |
| Post-deploy smoke checks | Client (developer optional) |
