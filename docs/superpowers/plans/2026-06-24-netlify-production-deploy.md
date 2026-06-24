# Netlify Production Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pin Node/pnpm versions, add GitHub Actions CI (lint, test, build), and document Netlify deploy steps — without changing placeholder site content.

**Architecture:** Add `.nvmrc` and `packageManager` for reproducible builds on Netlify and CI. Single GitHub Actions workflow mirrors the local pre-deploy gate. README and `.env.example` document `VITE_SITE_URL` for Netlify dashboard setup. No application code changes.

**Tech Stack:** Node 22, pnpm 10, GitHub Actions, Netlify (existing `netlify.toml` + TanStack Start plugin)

**Spec:** [`docs/superpowers/specs/2026-06-24-netlify-production-deploy-design.md`](../specs/2026-06-24-netlify-production-deploy-design.md)

---

## File map

| File | Responsibility |
|------|----------------|
| `.nvmrc` | Pin Node 22 for Netlify + CI |
| `package.json` | Add `packageManager` for pnpm pin |
| `.github/workflows/ci.yml` | Lint, unit test, build on push/PR |
| `.env.example` | Netlify env var comment |
| `README.md` | Accurate deploy checklist and env table |

---

### Task 1: Pin Node and pnpm versions

**Files:**
- Create: `.nvmrc`
- Modify: `package.json`

- [ ] **Step 1: Create `.nvmrc`**

Create `.nvmrc` with a single line:

```
22
```

- [ ] **Step 2: Add `packageManager` to `package.json`**

Add after `"private": true,`:

```json
"packageManager": "pnpm@10.33.0",
```

- [ ] **Step 3: Verify local toolchain**

Run: `node -v && pnpm -v`
Expected: Node 22.x and pnpm 10.x (warn if mismatch — CI will use pinned versions)

- [ ] **Step 4: Commit**

```bash
git add .nvmrc package.json
git commit -m "Pin Node 22 and pnpm 10 for reproducible builds."
```

---

### Task 2: GitHub Actions CI workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflow file**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest

    env:
      VITE_SITE_URL: https://avtoserviz-lovech.bg

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm lint

      - name: Test
        run: pnpm test

      - name: Build
        run: pnpm build
```

Note: `pnpm/action-setup@v4` reads the version from `packageManager` in `package.json` when no explicit `version` input is set.

- [ ] **Step 2: Validate YAML locally (optional)**

Run: `pnpm lint && pnpm test && pnpm build`
Expected: PASS — confirms CI steps will succeed

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "Add GitHub Actions CI for lint, test, and build."
```

---

### Task 3: Update `.env.example`

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add Netlify comment**

Replace entire `.env.example` with:

```
# Canonical site URL for SEO (sitemap, robots, OG tags).
# Set the same variable in Netlify → Site settings → Environment variables.
VITE_SITE_URL=https://avtoserviz-lovech.bg
```

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "Document VITE_SITE_URL for local and Netlify environments."
```

---

### Task 4: Update README deploy section

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace the "Deploy to Netlify" section**

Find the `## Deploy to Netlify` heading (line ~53) and replace through the Edge Functions paragraph with:

```markdown
## Deploy to Netlify

This project ships with `netlify.toml` configured for Netlify:

| Setting | Value |
|---------|-------|
| Build command | `pnpm build` |
| Publish directory | `dist/client` |
| Node version | 22 (from `.nvmrc`) |

### Prerequisites

- Node 22
- pnpm 10 (`corepack enable` if needed)

### Local verify before deploy

```bash
pnpm install
pnpm lint && pnpm test && pnpm build
```

### Netlify setup

1. Push this repo to GitHub
2. Visit https://app.netlify.com/start and import the repo
3. Confirm Netlify reads build settings from `netlify.toml` (`pnpm build` → `dist/client`)
4. Open **Site settings → Environment variables** and add:

| Variable | Required | Example | Purpose |
|----------|----------|---------|---------|
| `VITE_SITE_URL` | Yes (Production) | `https://avtoserviz-lovech.bg` | Canonical URL, sitemap, robots, OG/Twitter meta |

Until a custom domain is live, use your Netlify subdomain (e.g. `https://your-site.netlify.app`).

5. Trigger the first deploy

### First deploy checklist

- [ ] Netlify build succeeds
- [ ] Homepage loads
- [ ] `/sitemap.xml` and `/robots.txt` use your `VITE_SITE_URL` domain
- [ ] Page source: `canonical` and `og:url` match `VITE_SITE_URL`

### CI

GitHub Actions runs `pnpm lint`, `pnpm test`, and `pnpm build` on every push and pull request to `main`.

E2e tests (`pnpm test:e2e`) run locally only — they require Playwright browsers.

Server-side rendering runs on Netlify Functions via `@netlify/vite-plugin-tanstack-start`.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "Update README with Netlify deploy checklist and CI notes."
```

---

### Task 5: Final verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run full local gate**

Run:

```bash
pnpm lint && pnpm test && pnpm build
```

Expected: All pass (24 unit tests)

- [ ] **Step 2: Confirm netlify.toml unchanged**

Run: `grep command netlify.toml`
Expected: `command = "pnpm build"`

- [ ] **Step 3: Push and confirm CI (after merge to GitHub)**

Run: `git push origin main`
Expected: GitHub Actions workflow "CI" runs green on the repository

- [ ] **Step 4: Commit plan doc (if not already committed)**

```bash
git add docs/superpowers/plans/2026-06-24-netlify-production-deploy.md
git commit -m "Add Netlify production deploy implementation plan."
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| `.nvmrc` Node 22 | Task 1 |
| `packageManager` in package.json | Task 1 |
| GitHub Actions CI (lint, test, build) | Task 2 |
| `VITE_SITE_URL` in CI env | Task 2 |
| `.env.example` Netlify comment | Task 3 |
| README deploy checklist | Task 4 |
| No app code changes | — |
| E2e not in CI | Documented in Task 4 README |
| `netlify.toml` unchanged | Task 5 verify |

## Out of scope (per spec)

- Client content swap
- Custom domain / DNS
- Analytics, cookie banner
- E2e in CI
- Netlify deploy previews
- Favicon / logo
