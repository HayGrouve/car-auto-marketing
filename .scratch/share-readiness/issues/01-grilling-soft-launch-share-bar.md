# Decide soft-launch share bar

**Labels:** `wayfinder:grilling`  
**Blocks:** 02, 03  
**Status:** resolved

## Question

Is the **current share implementation** sufficient for soft launch on `https://stefi-gas.com`?

**What exists today:**

| Item | State |
|------|-------|
| `og:title`, `og:description`, `og:url`, `og:locale`, `og:type` | ✅ Per page, Bulgarian |
| `og:image` | ⚠️ Same `hero.jpg` (1247×921) on every page |
| Twitter `summary_large_image` | ✅ Mirrors OG |
| Canonical URLs | ✅ Absolute, per page |
| JSON-LD `AutoRepair` | ✅ On all pages |
| Branded OG share card (1200×630) | ❌ Not created |

**Recommended answer:** Soft launch is **acceptable** — tags are correct and SSR-rendered; `hero.jpg` is a real workshop photo, not a broken placeholder. Branded OG asset is **post-launch polish**, not a launch blocker. Live debugger verification (ticket 03) runs after first production deploy.

What is **blocking** vs **post-launch** for share readiness?

## Answer

**Confirmed** (user accepted recommended option, Aug 4 2026).

| Category | Verdict |
|----------|---------|
| **Blocking launch** | Nothing on share readiness |
| **Post-launch polish** | Branded 1200×630 OG share card (ticket 02) |
| **After first deploy** | Live preview verification — FB Debugger + Viber paste test (ticket 03) |
| **Known quality gaps (non-blocking)** | FB/Messenger will crop `hero.jpg` (1.35:1 vs 1.91:1); Viber image preview unverified (no published spec) — see [research](../research-social-preview-platforms.md) |

Share readiness does **not** block soft launch on `stefi-gas.com`.
