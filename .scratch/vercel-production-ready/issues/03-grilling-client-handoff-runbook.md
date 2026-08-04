# Decide client Vercel handoff runbook

Type: grilling
Status: resolved
Blocked by: 02

## Question

What should the client-facing deploy handoff contain so connecting this repo to their Vercel account and going live on `stefi-gas.com` is seamless?

Covers: README structure, step-by-step checklist (import repo, env vars, domain + www redirect, post-deploy smoke checks), and what the client vs developer is responsible for.

## Answer

Runbook captured in [handoff-runbook.md](../handoff-runbook.md).

Seven-step flow: local verify → Vercel import → Production `VITE_SITE_URL` → first deploy → custom domain + www redirect → smoke checklist → ongoing CI/deploy notes. Clear developer vs client responsibility split. README gets condensed version replacing Netlify section.
