# Decide CI scope: e2e and accessibility automation

**Labels:** `wayfinder:grilling`  
**Blocked by:** 01

## Question

Should Playwright e2e tests (9 smoke specs in `e2e/site-smoke.spec.ts`) run in GitHub Actions CI?

Current state:
- CI runs: lint → test (61 unit) → build
- E2e runs locally only; requires `pnpm exec playwright install`
- Prior Vercel map explicitly deferred e2e in CI

Trade-offs:
- **Add to CI:** Catches regressions on nav, CTAs, 404, meta tags; adds ~2–3 min + browser install to every PR
- **Keep local-only:** Faster CI; developer runs `pnpm test:e2e` before handoff (documented in README)

**Recommended answer:** Add e2e to CI if launch bar is "polished"; keep local-only for soft launch with handoff checklist item.

Also: add automated a11y (axe in Playwright) now or defer?
