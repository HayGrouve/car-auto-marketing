# Execute client Vercel deploy checklist

**Labels:** `wayfinder:task`  
**Blocked by:** 01, 04

## Question

Has the client completed the deploy steps from the handoff runbook?

Checklist (from [handoff runbook](../vercel-production-ready/handoff-runbook.md)):

- [ ] Repo imported to client's Vercel account
- [ ] `VITE_SITE_URL=https://stefi-gas.com` set in Production env
- [ ] Build succeeds on Vercel
- [ ] Custom domain `stefi-gas.com` added
- [ ] `www.stefi-gas.com` redirects to apex
- [ ] DNS records applied at registrar
- [ ] Smoke test: homepage, `/sitemap.xml`, `/robots.txt`, canonical/og:url, security headers

This ticket resolves when deploy ops are confirmed done (or explicitly assigned to client with date).
