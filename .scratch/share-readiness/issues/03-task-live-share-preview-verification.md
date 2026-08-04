# Verify live share previews after deploy

**Labels:** `wayfinder:task`  
**Blocked by:** 01

## Question

No decision to make — manual verification once production (or staging with production domain) is reachable.

## Checklist

Pre-scrape **all five public URLs** in Sharing Debugger after first production deploy (per [research](../research-social-preview-platforms.md) — avoids blank first-share image on Meta):

- `https://stefi-gas.com/`
- `https://stefi-gas.com/gtp`
- `https://stefi-gas.com/gaz`
- `https://stefi-gas.com/remonti`
- `https://stefi-gas.com/kontakti`

Then record pass/fail + screenshots for home and `/gtp` (representative inner page) across platforms.

**Tools:**

1. [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) — also covers Messenger link previews; click "Scrape Again" per URL
2. [Twitter/X Card Validator](https://cards-dev.twitter.com/validator) (or post preview if validator deprecated)
3. Manual paste test in **WhatsApp** and **Viber** (mobile) — Viber has no published OG spec; paste test is the only validation

**Record:**

- Title, description, image URL shown
- Image fetch errors or wrong aspect ratio cropping
- Cache-bust steps if OG image changes later (`?v=` or debugger "Scrape Again")

**Resolution:** Comment with results table; note any fixes filed as follow-up (not this map unless they reopen scope).
