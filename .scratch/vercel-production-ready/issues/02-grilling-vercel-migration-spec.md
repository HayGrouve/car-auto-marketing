# Decide Vercel migration spec

Type: grilling
Status: resolved
Blocked by: 01

## Question

Given the research findings, what is the concrete migration spec — which files change, what gets removed, and what is the target `vite.config.ts`, `vercel.json`, and headers configuration?

Covers: Nitro plugin swap, Netlify artifact removal list, domain default updates in active files, CI env var update, and whether any build script changes are needed.

## Answer

Spec locked in [spec-vercel-migration.md](../spec-vercel-migration.md).

Summary: Nitro replaces Netlify plugin; create `vercel.json` (framework + headers); delete `netlify.toml` and `public/_headers`; update domain to `https://stefi-gas.com` in active config/CI/tests; README Vercel section replaces Netlify. Preview env: no `VITE_SITE_URL`; Production only. www redirect documented at deploy time, not in repo.
