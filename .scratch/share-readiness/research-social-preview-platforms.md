# Research: Social preview platform requirements

Research for wayfinder ticket [Research social preview platform requirements](issues/04-research-social-preview-platform-requirements.md).

**Site:** `https://stefi-gas.com` — TanStack Start SSR, Bulgarian (`bg_BG`).

**Current tags (from `src/lib/seo.ts`):** `og:title`, `og:description`, `og:type` (`website`), `og:locale` (`bg_BG`), `og:url`, `og:image`; Twitter `summary_large_image` + title/description/image; canonical per page.

**Current image:** `https://stefi-gas.com/images/hero.jpg` — 1247×921 px JPEG, ~147 KB (150,584 bytes measured from `public/images/hero.jpg`).

---

## Executive summary

- **Soft launch acceptable on Meta platforms (Facebook, Messenger, WhatsApp):** All required Open Graph tags are present, SSR-rendered, and use absolute HTTPS URLs. Image dimensions and file size meet official Meta/WhatsApp minimums and maximums.
- **`hero.jpg` will be center-cropped on Facebook/Messenger:** At ~1.35:1 aspect ratio it diverges from Meta’s recommended **1.91:1** (1200×630). Expect ~268 px (~29% of height) removed from top/bottom in feed-style large previews — cosmetic, not blocking.
- **WhatsApp is the most forgiving on aspect ratio:** Official spec allows width:height up to **4:1**; `hero.jpg` at ~1.35:1 fits easily. Description may truncate at ~80 characters.
- **Viber has no published OG spec:** First-party docs confirm link previews exist (“preview thumbnail”, “valid preview (image or metadata)”) but do **not** document required tags, image dimensions, or cache behavior. Live paste testing (ticket 03) is the only reliable validation.
- **Cache invalidation is platform-managed:** Meta caches link metadata (~30-day auto refresh; force via Sharing Debugger or `POST /?id={url}&scrape=true`). Image updates require a **new image URL**. WhatsApp docs do not document cache TTL — re-crawl happens at compose time.

---

## Open Graph protocol (baseline)

**Source:** [The Open Graph protocol](https://ogp.me/)

| Property | Required? | What the spec says | Current site |
|----------|-----------|-------------------|--------------|
| `og:title` | **Required** | Title as it should appear in the graph | ✅ Per page |
| `og:type` | **Required** | Object type; default consumer behavior varies by type | ✅ `website` |
| `og:image` | **Required** | Image URL representing the object | ✅ `hero.jpg` (all pages) |
| `og:url` | **Required** | Canonical permanent ID for the object | ✅ Canonical per page |
| `og:description` | Recommended | One–two sentence description | ✅ Per page |
| `og:locale` | Recommended | Format `language_TERRITORY`; default `en_US` | ✅ `bg_BG` |
| `og:site_name` | Recommended | Site brand name in preview | ❌ Missing |
| `og:image:width` / `og:image:height` | Recommended structured properties | Helps crawlers render without downloading image first | ❌ Missing |
| `og:image:alt` | Should specify if `og:image` set | Accessibility description of image content | ❌ Missing |

---

## Facebook & Messenger

### Crawler and scope

**Sources:**

- [Meta Web Crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/) — *“FacebookExternalHit … crawl[s] the content of an app or website that was shared on one of Meta’s family of apps, such as Facebook, Instagram, or Messenger.”*
- [Link Sharing FAQ](https://developers.facebook.com/docs/sharing/webmasters/faq/) — Sharing Debugger covers previews on *“Facebook, Messenger and other places.”*

Both platforms share the same `facebookexternalhit` crawler pipeline.

### Server / markup requirements (Meta official)

**Source:** [Meta Web Crawlers — Crawler Requirements](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/)

| Requirement | Spec |
|-------------|------|
| Response encoding | Server must use **gzip and deflate** |
| OG tag placement | Open Graph properties must appear **before the first 1 MB** of HTML |
| Crawl latency | Content must be crawlable within **a few seconds** |
| Range requests | Must honor `Range` header or ignore it |
| Absolute URLs | All `og:url` and `og:image` values must be absolute ([FAQ](https://developers.facebook.com/docs/sharing/webmasters/faq/)) |

**Source:** [A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters/)

| Tag | Required? | Notes |
|-----|-----------|-------|
| `og:url` | Basic tag | Undecorated canonical URL |
| `og:title` | Basic tag | Without site-name branding per Meta guidance |
| `og:description` | Basic tag | 2–4 sentences; shown below title |
| `og:image` | Basic tag | Preview thumbnail |
| `og:type` | Additional | Defaults to `website` |
| `og:locale` | Additional | Defaults to `en_US`; see [Locale section](#locale-bg_bg) |
| `fb:app_id` | For Insights only | Not required for previews |

Current site: ✅ all basic tags present via SSR.

### Image dimensions and aspect ratio

**Source:** [Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images/)

| Rule | Official spec | `hero.jpg` (1247×921) |
|------|---------------|----------------------|
| Minimum dimensions | **200×200 px** | ✅ |
| Large preview threshold | **≥600×315 px** for larger feed image | ✅ |
| Recommended | **1200×630 px** for high-resolution devices | ⚠️ Width OK; height excess |
| Aspect ratio | **~1.91:1** — *“Try to keep your images as close to 1.91:1 aspect ratio as possible to display the full image in Feed without any cropping.”* | ⚠️ ~1.35:1 — cropping expected |
| Max file size | **8 MB** | ✅ ~147 KB |
| Encoding | Crawler accepts **gzip and deflate** only | Verify at deploy (Vercel default) |

**Source:** [Sharing Best Practices — Images](https://developers.facebook.com/docs/sharing/best-practices)

- Recommends **≥1080 px width** for high-resolution display.
- Recommends `og:image:width` and `og:image:height` so crawler can render immediately without async download.

**Cropping estimate for `hero.jpg`:**

- Current ratio: 1247 ÷ 921 ≈ **1.35:1**
- Target ratio: **1.91:1**
- At 1247 px width, ideal height = 1247 ÷ 1.91 ≈ **653 px**
- Excess height ≈ 921 − 653 = **268 px** (~29% of image height)
- Meta FAQ notes cropping may also prioritize detected faces ([FAQ — “My link image is cropped incorrectly”](https://developers.facebook.com/docs/sharing/webmasters/faq/))

**Verdict:** Preview will render at large size; important content should sit in the **center horizontal band** (~653 px tall) to survive crop.

### Gaps vs current site

| Gap | Severity | Source |
|-----|----------|--------|
| Aspect ratio ≠ 1.91:1 | Cosmetic | [Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images/) |
| Missing `og:image:width` / `og:image:height` | May delay first-share image render | [Images in Link Shares — Pre-caching](https://developers.facebook.com/docs/sharing/webmasters/images/), [FAQ](https://developers.facebook.com/docs/sharing/webmasters/faq/) |
| Missing `og:site_name` | Optional branding in preview | [ogp.me](https://ogp.me/) |
| Missing `og:image:alt` | Accessibility gap per OG spec | [ogp.me — Structured Properties](https://ogp.me/) |

---

## WhatsApp

**Source:** [WhatsApp Link Previews](https://developers.facebook.com/docs/whatsapp/link-previews/) — first-party Meta documentation for WhatsApp (separate crawler from `facebookexternalhit`).

### Required markup

| Tag | Requirement |
|-----|-------------|
| `og:title` | Required; non-empty; in `<head>`; title without branding |
| `og:description` | Required; non-empty; in `<head>`; ~80 characters suffices; 1–2 lines |
| `og:url` | Required; non-empty; undecorated canonical URL |
| `og:image` | Required; absolute HTTPS URL for thumbnail |
| `<head>` placement | Markup block must appear within the **first 300 KB** of HTML |

WhatsApp crawler: HTTP GET with `User-Agent: WhatsApp/2.x.x.x A|I|N` (Android/iOS/Web). Sends `Accept-Language` matching recipient’s language setting.

Current site: ✅ SSR delivers tags in `<head>` without JS dependency.

### Image requirements

| Rule | Official spec | `hero.jpg` |
|------|---------------|------------|
| Max file size | **Under 600 KB** | ✅ ~147 KB |
| Min width | **300 px or more** | ✅ 1247 px |
| Max aspect ratio | **4:1 width/height or less** | ✅ ~1.35:1 |
| Absolute HTTPS URL | Required | ✅ |

WhatsApp states it *“will make the best attempt to show link previews”* with relaxed fallbacks but *“this should not be relied on. It's not guaranteed to work (and continue to work).”*

### Gaps vs current site

| Gap | Severity | Notes |
|-----|----------|-------|
| Bulgarian descriptions may exceed ~80 chars | Low | Truncation only; not blocking |
| No `og:image:width`/`height` | Low | Not mentioned in WhatsApp doc (unlike Meta FAQ) |
| Cache invalidation undocumented | Operational | WhatsApp doc describes compose-time crawl only; no TTL or refresh API documented |

---

## Viber

### What first-party sources say

**No official Viber developer documentation** was found that specifies Open Graph tag requirements, image dimensions, aspect ratios, or cache behavior for **web URL link previews**.

Available first-party statements:

| Source | What it says | Relevance |
|--------|--------------|-----------|
| [AI on Viber — Viber Support](https://help.viber.com/hc/en-us/articles/31738053588509-AI-on-Viber) | *“The Summarize link button will only appear on links with a **valid preview (image or metadata)**.”* | Confirms Viber fetches and evaluates link previews; preview can be image-only or metadata-only |
| [Communities knowledge base for admins — Viber Support](https://help.viber.com/hc/en-us/articles/9340728226077-Communities-knowledge-base-for-admins) | When link sending is disabled, links appear as plain text: *“the link won't be tappable, and the **preview thumbnail won't be displayed**.”* | Confirms normal link messages include a preview thumbnail |
| [Keyboards — Viber Developers Hub](https://developers.viber.com/docs/tools/keyboards/) | `FavoritesMetadata` thumbnail params for **bot-sent** carousel content (`PNG`/`JPEG`, optional width/height) | Applies to Viber Bot API rich messages, **not** to organic web URL scraping |

### Assessment for current tags

| Factor | Status | Evidence |
|--------|--------|----------|
| `og:title`, `og:description`, `og:url`, `og:image` present | ✅ | Matches de-facto OG convention; no Viber spec to verify against |
| HTTPS absolute URLs | ✅ | Standard web practice; Viber bot thumbnails require valid URL strings ([Developers Hub](https://developers.viber.com/docs/tools/keyboards/)) |
| SSR-rendered `<head>` | ✅ | Required for crawlers that do not execute JS (inferred from Meta/WhatsApp docs; Viber unspecified) |
| Image size ~147 KB | **Unknown** | No Viber primary source states a size limit |
| Image dimensions 1247×921 | **Unknown** | No Viber primary source states dimension rules |

**Likely outcome (hypothesis only — requires live test):** Title and description previews should work if Viber reads standard OG tags (consistent with “image **or** metadata” language). Image thumbnail behavior cannot be assessed from primary sources alone.

---

## Cache invalidation when OG image changes

### Facebook / Messenger

**Sources:**

- [How to Change the Metadata for an Existing Link](https://developers.facebook.com/docs/sharing/webmasters/getting-started/change-link/) — Metadata auto-updates every **30 days**; force refresh via [Sharing Debugger](https://developers.facebook.com/tools/debug/) or `POST /?id={your_url}&scrape=true`
- [Images in Link Shares — Updating images](https://developers.facebook.com/docs/sharing/webmasters/images/) — Images cached **by URL**; *“Use a new URL for the new image or the image won't be updated”*; don’t delete old image URLs
- [Using Objects](https://developers.facebook.com/docs/sharing/opengraph/using-objects/) — Re-scrape triggers: Sharing Debugger input, 30-day cycle, Graph API scrape
- [Link Sharing FAQ](https://developers.facebook.com/docs/sharing/webmasters/faq/) — Changing `og:image` applies to **future shares only**; existing posts need manual “Refresh share attachment”

### WhatsApp

**Source:** [WhatsApp Link Previews](https://developers.facebook.com/docs/whatsapp/link-previews/)

- Crawl occurs when user composes a message with the link (before send).
- **No cache TTL, invalidation API, or image-URL caching rules documented.**
- Operational implication: after deploy, a fresh compose should re-fetch; persistent stale previews would need empirical testing.

### Viber

**No primary source** documents Viber link-preview cache behavior or invalidation steps.

### Recommended deploy workflow (Meta platforms)

1. Deploy updated `og:*` tags (and new image file if replacing).
2. Run each public URL through [Sharing Debugger](https://developers.facebook.com/tools/debug/) to pre-cache.
3. When replacing an image **in place**, change the filename or add a cache-busting query string (Meta requirement).
4. Verify WhatsApp and Viber by pasting live URLs in compose box (ticket 03).

---

## Locale (`bg_BG`)

**Sources:**

- [The Open Graph protocol](https://ogp.me/) — `og:locale` format is `language_TERRITORY` (e.g. `en_GB`); default `en_US`
- [A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters/) — `og:locale` defaults to `en_US`; `og:locale:alternate` for translations
- [Meta Internationalization](https://developers.facebook.com/docs/javascript/internationalization) — Facebook locale format is `ll_CC` aligned with ISO language and country codes
- [WhatsApp Link Previews](https://developers.facebook.com/docs/whatsapp/link-previews/) — Crawler sends `Accept-Language` header matching recipient language; site *“can customize the content language accordingly”*

### Assessment

| Topic | Finding |
|-------|---------|
| `bg_BG` format validity | ✅ Valid `language_TERRITORY` per [ogp.me](https://ogp.me/) (`bg` = Bulgarian, `BG` = Bulgaria) |
| Platform restrictions on Cyrillic | **None found** in primary sources |
| Single-locale site | ✅ Correct to set `og:locale` to `bg_BG`; `og:locale:alternate` not needed unless multi-language pages exist |
| WhatsApp language customization | Optional; crawler passes recipient `Accept-Language` — single Bulgarian site can ignore |

No primary source indicates Bulgarian locale affects preview generation, image cropping, or tag parsing.

---

## Recommended actions (prioritized)

| Priority | Action | Rationale | Blocks soft launch? |
|----------|--------|-----------|---------------------|
| **P0** | Deploy with current tags; run Sharing Debugger + WhatsApp/Viber paste tests (ticket 03) | Validate SSR delivery and Viber (no spec) | No |
| **P0** | Pre-scrape all public URLs in Sharing Debugger after first production deploy | Avoid blank first-share image on Meta ([Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images/)) | No |
| **P1** | Create **1200×630** branded `og-share.jpg` at new URL (ticket 02) | Eliminates Meta crop; meets recommended dimensions | No — post-launch polish |
| **P2** | Add `og:image:width`, `og:image:height`, `og:site_name`, `og:image:alt` to `buildSeoHead` | OG spec + Meta first-share optimization | No |
| **P3** | If Viber live test omits image: investigate with Viber support or add dedicated small thumbnail at new URL | Only if ticket 03 confirms failure; no primary spec to pre-empt | No |

---

## Soft-launch verdict (research)

| Platform | Verdict | Basis |
|----------|---------|-------|
| **Facebook** | ✅ Acceptable | All required OG tags; image exceeds minimums; crop is cosmetic |
| **Messenger** | ✅ Acceptable | Same crawler and rules as Facebook |
| **WhatsApp** | ✅ Acceptable | Meets all documented tag and image requirements |
| **Viber** | ⚠️ Acceptable with verification | Tags align with OG convention; **no primary spec** — live paste test required |

**Overall: Yes — soft launch acceptable.** Meta-family platforms are covered by official documentation. Viber text/metadata preview is likely; image preview is unverified and must be confirmed post-deploy.
