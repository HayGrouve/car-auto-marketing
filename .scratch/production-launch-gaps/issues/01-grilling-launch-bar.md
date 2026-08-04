# Decide launch bar: soft launch vs polished launch

**Labels:** `wayfinder:grilling`  
**Blocks:** 02, 03, 04

## Question

What is the minimum bar for going live on `stefi-gas.com`?

The codebase audit found these categories of remaining work:

| Category | Examples | Blocks soft launch? |
|----------|----------|---------------------|
| **Deploy ops** (client) | `VITE_SITE_URL` in Vercel Production, apex domain, www→apex redirect | Yes — SEO duplicate-origin risk |
| **Repo hygiene** (dev) | Delete stale `package-lock.json`, ESLint ignore `.nitro`/`.output`, remove dead image assets | No — CI already passes on clean tree |
| **Branding** | Generic scaffold favicon/logos | No — functional but unprofessional |
| **Performance** | 400–600 KB PNG section images, ~420 kB main JS bundle | No — acceptable for local business site |
| **Security hardening** | CSP, Permissions-Policy, preview noindex | Debatable |
| **Monitoring** | Analytics, uptime, error tracking | No — deferred in prior map |

**Recommended answer:** Soft launch is acceptable once client deploy ops (env + domain) are done and repo hygiene fixes land. Branding, image optimization, and monitoring are post-launch unless client insists otherwise.

Which items are **blocking** vs **post-launch** for this effort?
