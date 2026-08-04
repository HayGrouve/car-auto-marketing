# Decide analytics, cookies, and legal pages

**Labels:** `wayfinder:grilling`  
**Blocked by:** 01

## Question

Should the production site include analytics tracking and the legal pages that typically accompany it?

Current state:
- No analytics (Vercel Analytics, Plausible, GA, etc.)
- No cookie banner
- No privacy policy or terms page (noted in footer redesign spec)
- No tracking cookies — site is informational only (phone, maps embed, static content)

**Recommended answer:** Stay analytics-free for v1. No cookie banner or privacy policy required under GDPR for a static informational site with no tracking. Revisit if client adds analytics or contact forms with data collection.

Does the client want analytics on day one? If yes, which provider, and do we need cookie consent + privacy policy in Bulgarian?
