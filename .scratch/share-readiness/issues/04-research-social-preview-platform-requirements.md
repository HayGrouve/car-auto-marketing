# Research social preview platform requirements

**Labels:** `wayfinder:research`  
**Status:** resolved

## Question

What do **Viber, Facebook/Messenger, and WhatsApp** require or recommend for link previews — especially for a Bulgarian local-business site — and where do our current tags fall short?

Investigate against primary sources (official docs, platform debuggers, Open Graph spec):

1. Minimum/maximum OG image dimensions and aspect ratios per platform
2. Required vs optional tags (`og:image`, `og:title`, `og:description`, `og:url`, dimensions)
3. Whether `hero.jpg` at 1247×921 is likely cropped acceptably
4. Viber-specific behavior (does it use OG tags, or only title + first image?)
5. Cache invalidation when OG image changes post-deploy
6. Any `bg_BG` locale considerations

**Output:** Markdown file at `.scratch/share-readiness/research-social-preview-platforms.md` with cited sources. Link from resolution comment.

## Answer

Findings captured in [research-social-preview-platforms.md](../research-social-preview-platforms.md).

**Soft-launch verdict:** Acceptable for Facebook, Messenger, WhatsApp per official Meta docs. Viber has no published OG spec — live paste test required (title/metadata likely; image unverified).

**Top gaps:** aspect ratio vs Meta 1.91:1; missing `og:image:width`/`height`/`site_name`/`alt`; Viber image behavior unknown until ticket 03.
