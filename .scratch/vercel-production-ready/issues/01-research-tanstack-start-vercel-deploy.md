# Research TanStack Start deployment on Vercel

Type: research
Status: resolved

## Question

What is the correct TanStack Start + Nitro configuration to deploy this app on Vercel, and how does it differ from the current Netlify setup (`@netlify/vite-plugin-tanstack-start`, `netlify.toml`, `public/_headers`)?

Specifically: vite plugin setup, package dependencies, build output structure, `vercel.json` requirements, security/cache headers migration, and build-time env var handling for `VITE_SITE_URL`.

## Answer

Findings captured in [research-tanstack-start-vercel.md](../research-tanstack-start-vercel.md).

Key points: swap Netlify plugin for `nitro/vite`; Vercel auto-detects build/output; minimal `vercel.json` for framework preset + headers migrated from `_headers`; delete Netlify artifacts; `VITE_SITE_URL` at build time in Production env; no Netlify runtime APIs in this project.

## Comments

Research subagent launched during map charting. Findings completed in follow-up session.
