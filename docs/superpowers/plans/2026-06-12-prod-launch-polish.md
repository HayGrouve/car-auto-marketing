# Production Launch Polish + UI Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship final pre-launch technical polish (performance, SEO/deploy, UX/a11y) and Lucide UI icons across the site, keeping placeholder content swappable in `site-content.ts` last.

**Architecture:** Extend `site-content.ts` with `StatIcon`, `mapsLink`, and env-driven `siteUrl`. Add small focused components (`stat-icon.tsx`) and scripts (`generate-seo-files.mjs`, `compress-images.mjs`). Wire icons into existing site components without changing page structure.

**Tech Stack:** TanStack Start, React 19, Lucide React, Vitest, Playwright, Vite, Netlify, Sharp (dev, image compression)

**Spec:** [`docs/superpowers/specs/2026-06-12-prod-launch-polish-design.md`](../specs/2026-06-12-prod-launch-polish-design.md)

---

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/site-url.ts` | Single source for `VITE_SITE_URL` with fallback |
| `src/components/site/stat-icon.tsx` | Maps `StatIcon` → Lucide component |
| `src/data/site-content.ts` | `StatIcon`, `mapsLink`, stat icons, `siteUrl` |
| `src/components/site/stats-strip.tsx` | Render stat icons |
| `src/components/site/contact-details.tsx` | Lucide label icons, maps link |
| `src/components/site/contact-channel-link.tsx` | Phone Lucide icon |
| `src/components/site/site-footer.tsx` | Hours + MapPin/Clock icons |
| `src/components/site/hero-section.tsx` | `fetchpriority`, `decoding` |
| `src/components/site/split-section.tsx` | `loading="lazy"`, aspect ratio |
| `src/lib/seo.ts` | Twitter card meta |
| `src/routes/__root.tsx` | Skip link, `main` id, theme-color meta |
| `src/styles.css` | Skip-link focus styles |
| `scripts/generate-seo-files.mjs` | Writes `sitemap.xml` + `robots.txt` |
| `scripts/compress-images.mjs` | Compresses `public/images/*.png` |
| `public/_headers` | Netlify cache + security headers |
| `e2e/site-smoke.spec.ts` | 404, active nav, icons smoke tests |

---

### Task 1: Stat icons data model + StatIcon component

**Files:**
- Create: `src/components/site/stat-icon.tsx`
- Modify: `src/data/site-content.ts`
- Modify: `src/data/site-content.test.ts`
- Test: `src/components/site/stat-icon.test.tsx`

- [ ] **Step 1: Write the failing test for stat icons in site content**

Add to `src/data/site-content.test.ts`:

```ts
it('assigns a lucide icon key to every home stat', () => {
  const icons = siteContent.pages.home.stats?.map((stat) => stat.icon) ?? []
  expect(icons).toEqual(['clipboard-check', 'calendar-days', 'map-pin'])
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/site-content.test.ts`
Expected: FAIL — `stat.icon` is undefined

- [ ] **Step 3: Extend types and stats in site-content.ts**

Add before `StatItem`:

```ts
export type StatIcon = 'clipboard-check' | 'calendar-days' | 'map-pin'
```

Update `StatItem`:

```ts
export type StatItem = {
  value: string
  label: string
  icon: StatIcon
}
```

Update `pages.home.stats`:

```ts
stats: [
  { value: 'ГТП', label: 'Годишен технически преглед', icon: 'clipboard-check' },
  { value: 'Пн–Сб', label: 'Работим, когато ви трябваме', icon: 'calendar-days' },
  { value: 'Ловеч', label: 'Автосервиз с бързо обслужване', icon: 'map-pin' },
] satisfies StatItem[],
```

- [ ] **Step 4: Create stat-icon.tsx**

Create `src/components/site/stat-icon.tsx`:

```tsx
import { CalendarDays, ClipboardCheck, MapPin } from 'lucide-react'
import type { StatIcon } from '#/data/site-content'
import { cn } from '#/lib/utils'

const iconMap = {
  'clipboard-check': ClipboardCheck,
  'calendar-days': CalendarDays,
  'map-pin': MapPin,
} as const

type StatIconProps = {
  icon: StatIcon
  className?: string
}

export function StatIconGlyph({ icon, className }: StatIconProps) {
  const Icon = iconMap[icon]
  return <Icon aria-hidden className={cn('size-6 text-[#1e3a8a]', className)} />
}
```

- [ ] **Step 5: Write component test**

Create `src/components/site/stat-icon.test.tsx`:

```tsx
import { render } from '@testing-library/react'
import { StatIconGlyph } from '#/components/site/stat-icon'

describe('StatIconGlyph', () => {
  it('renders the clipboard icon for gtp stats', () => {
    const { container } = render(<StatIconGlyph icon="clipboard-check" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
```

- [ ] **Step 6: Run tests**

Run: `pnpm test src/data/site-content.test.ts src/components/site/stat-icon.test.tsx`
Expected: PASS

---

### Task 2: Stats strip icons

**Files:**
- Modify: `src/components/site/stats-strip.tsx`

- [ ] **Step 1: Import and render icon above stat value**

```tsx
import { StatIconGlyph } from '#/components/site/stat-icon'
```

Inside the map, before the value `<p>`:

```tsx
<StatIconGlyph icon={stat.icon} />
<p className="text-3xl font-extrabold tracking-tight text-[#1e3a8a] md:text-4xl">
```

Add `gap-2` to the flex column class on the `Reveal` wrapper.

- [ ] **Step 2: Run tests**

Run: `pnpm test`
Expected: PASS

---

### Task 3: Contact details + phone CTA icons

**Files:**
- Modify: `src/components/site/contact-details.tsx`
- Modify: `src/components/site/contact-channel-link.tsx`

- [ ] **Step 1: Update ContactRow to accept optional icon**

In `contact-details.tsx`, replace inline `PhoneIcon` with Lucide imports:

```tsx
import { Clock, MapPin, Phone } from 'lucide-react'
```

Update `ContactRow`:

```tsx
function ContactRow({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#525252]">
        {Icon ? <Icon aria-hidden className="size-4 shrink-0" /> : null}
        {label}
      </p>
      {children}
    </div>
  )
}
```

Update rows:

```tsx
<ContactRow icon={Phone} label="Телефон">
  <a className="inline-flex items-center gap-2 ..." href={phoneHref}>
    <Phone aria-hidden className="size-5 shrink-0" />
    {phoneDisplay}
  </a>
</ContactRow>

<ContactRow icon={ViberIcon} label="Viber">...</ContactRow>
<ContactRow icon={MapPin} label="Адрес">...</ContactRow>
<ContactRow icon={Clock} label="Работно време">...</ContactRow>
```

Delete the old inline `PhoneIcon` SVG function.

- [ ] **Step 2: Add Phone icon to ContactChannelLink**

In `contact-channel-link.tsx`:

```tsx
import { Phone } from 'lucide-react'
```

Replace phone branch:

```tsx
{isPhone ? <Phone aria-hidden className="size-4" /> : <ViberIcon className="size-4" />}
```

- [ ] **Step 3: Run tests**

Run: `pnpm test src/components/site/contact-channel-link.test.tsx src/routes/kontakti.test.tsx`
Expected: PASS

---

### Task 4: Footer icons + working hours

**Files:**
- Modify: `src/components/site/site-footer.tsx`

- [ ] **Step 1: Add hours and icons**

```tsx
import { Clock, MapPin } from 'lucide-react'
import { siteContent } from '#/data/site-content'

const hoursSummary = siteContent.contact.hours.join(' · ')
```

Replace address `<p>` with:

```tsx
<p className="flex items-start gap-2">
  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-[#525252]" />
  <span>{siteContent.contact.address}</span>
</p>
<p className="flex items-start gap-2">
  <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-[#525252]" />
  <span>{hoursSummary}</span>
</p>
```

Adjust footer flex layout so copyright, contact links, and address/hours group read cleanly on mobile (wrap address + hours in a `div` with `space-y-1`).

- [ ] **Step 2: Run tests**

Run: `pnpm test`
Expected: PASS

---

### Task 5: Google Maps external link

**Files:**
- Modify: `src/data/site-content.ts` (`ContactChannels` type + `contact` object)
- Modify: `src/components/site/contact-details.tsx`

- [ ] **Step 1: Add mapsLink to contact**

Extend `ContactChannels`:

```ts
mapsLink: string
```

Add to `contact`:

```ts
mapsLink: 'https://www.google.com/maps/search/?api=1&query=Ловеч',
```

- [ ] **Step 2: Add maps link below ContactDetails list**

At bottom of `ContactDetails` return, after hours block:

```tsx
import { ExternalLink } from 'lucide-react'

<a
  className="inline-flex items-center gap-2 text-sm font-bold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
  href={siteContent.contact.mapsLink}
  rel="noopener noreferrer"
  target="_blank"
>
  <ExternalLink aria-hidden className="size-4" />
  Отвори в Google Maps
</a>
```

- [ ] **Step 3: Run kontakti test**

Run: `pnpm test src/routes/kontakti.test.tsx`
Expected: PASS

---

### Task 6: Image performance

**Files:**
- Create: `scripts/compress-images.mjs`
- Modify: `package.json` (add `sharp` devDep + script)
- Modify: `src/components/site/hero-section.tsx`
- Modify: `src/components/site/split-section.tsx`

- [ ] **Step 1: Add compression script**

Run: `pnpm add -D sharp`

Create `scripts/compress-images.mjs`:

```js
import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const imagesDir = path.resolve('public/images')
const files = await readdir(imagesDir)
const pngs = files.filter((f) => f.endsWith('.png'))

for (const file of pngs) {
  const input = path.join(imagesDir, file)
  const buffer = await readFile(input)
  const output = await sharp(buffer)
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ quality: 80, compressionLevel: 9 })
    .toBuffer()
  await writeFile(input, output)
  console.log(`compressed ${file}: ${buffer.length} → ${output.length} bytes`)
}
```

Add to `package.json` scripts:

```json
"compress-images": "node scripts/compress-images.mjs"
```

- [ ] **Step 2: Run compression**

Run: `pnpm compress-images`
Expected: Each file logs reduced byte size (target under ~400 KB)

- [ ] **Step 3: Hero image loading attrs**

In `hero-section.tsx`, on hero `<img>`:

```tsx
<img
  alt={content.imageAlt ?? ''}
  className="hero-image-scale-in absolute inset-0 h-full w-full object-cover"
  decoding="async"
  fetchPriority="high"
  src={content.image}
/>
```

- [ ] **Step 4: Split section lazy load + aspect ratio**

In `split-section.tsx`, wrap image column:

```tsx
<div className="aspect-[4/3] min-h-[280px] overflow-hidden md:aspect-auto md:min-h-[280px]">
  <img
    alt={content.imageAlt}
    className="h-full min-h-[280px] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:hover:scale-[1.03]"
    loading="lazy"
    decoding="async"
    src={content.image}
  />
</div>
```

- [ ] **Step 5: Run tests**

Run: `pnpm test`
Expected: PASS

---

### Task 7: Env-driven siteUrl

**Files:**
- Create: `src/lib/site-url.ts`
- Modify: `src/data/site-content.ts`
- Create: `.env.example`

- [ ] **Step 1: Create site-url helper**

Create `src/lib/site-url.ts`:

```ts
const fallbackSiteUrl = 'https://avtoserviz-lovech.bg'

export function getSiteUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL
  if (typeof envUrl === 'string' && envUrl.length > 0) {
    return envUrl.replace(/\/$/, '')
  }
  return fallbackSiteUrl
}
```

- [ ] **Step 2: Use in site-content export**

At bottom of `site-content.ts`, replace hardcoded `siteUrl`:

```ts
import { getSiteUrl } from '#/lib/site-url'

export const siteContent = {
  ...
  siteUrl: getSiteUrl(),
  ...
} as const
```

Move `getSiteUrl` import to top of file (ESM order).

- [ ] **Step 3: Add .env.example**

```
VITE_SITE_URL=https://avtoserviz-lovech.bg
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/data/site-content.test.ts src/lib/seo.test.ts`
Expected: PASS (canonical URLs unchanged with no env set)

---

### Task 8: SEO — Twitter cards + theme-color

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/seo.test.ts`
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Write failing Twitter card test**

Add to `src/lib/seo.test.ts`:

```ts
expect(
  seo.meta.some(
    (item) =>
      'name' in item &&
      item.name === 'twitter:card' &&
      item.content === 'summary_large_image',
  ),
).toBe(true)
expect(
  seo.meta.some(
    (item) => 'name' in item && item.name === 'twitter:image',
  ),
).toBe(true)
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/seo.test.ts`
Expected: FAIL

- [ ] **Step 3: Extend buildSeoHead**

Add to `meta` array in `src/lib/seo.ts`:

```ts
{ name: 'twitter:card', content: 'summary_large_image' },
{ name: 'twitter:title', content: fullTitle },
{ name: 'twitter:description', content: description },
{ name: 'twitter:image', content: defaultOgImage },
```

- [ ] **Step 4: Add theme-color to root head**

In `src/routes/__root.tsx` `head` meta array:

```ts
{
  name: 'theme-color',
  content: '#1e3a8a',
},
```

- [ ] **Step 5: Run tests**

Run: `pnpm test src/lib/seo.test.ts`
Expected: PASS

---

### Task 9: Generate sitemap + robots at build

**Files:**
- Create: `scripts/generate-seo-files.mjs`
- Modify: `package.json`

- [ ] **Step 1: Create generate script**

Create `scripts/generate-seo-files.mjs`:

```js
import { writeFile } from 'node:fs/promises'

const siteUrl = (process.env.VITE_SITE_URL ?? 'https://avtoserviz-lovech.bg').replace(/\/$/, '')
const paths = ['/', '/gtp', '/remonti', '/kontakti']

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url>\n    <loc>${siteUrl}${p === '/' ? '' : p}</loc>\n  </url>`).join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

await writeFile('public/sitemap.xml', sitemap)
await writeFile('public/robots.txt', robots)
console.log(`SEO files generated for ${siteUrl}`)
```

- [ ] **Step 2: Wire into build**

Update `package.json`:

```json
"prebuild": "node scripts/generate-seo-files.mjs",
"generate-seo": "node scripts/generate-seo-files.mjs",
```

- [ ] **Step 3: Run generator**

Run: `pnpm generate-seo`
Expected: Logs `SEO files generated for https://avtoserviz-lovech.bg`

---

### Task 10: Skip link + main landmark

**Files:**
- Modify: `src/routes/__root.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Add skip link and main id**

In `RootLayout`:

```tsx
<a className="skip-link" href="#main-content">
  Към съдържанието
</a>
<SiteHeader />
<main className="min-h-screen bg-white" id="main-content">
```

Also add skip link + `id="main-content"` to `RootNotFound` main element.

- [ ] **Step 2: Add skip-link CSS**

In `src/styles.css`:

```css
.skip-link {
  position: absolute;
  left: -9999px;
  top: auto;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: #1e3a8a;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
}

.skip-link:focus {
  left: 1rem;
  top: 1rem;
}
```

- [ ] **Step 3: Run tests**

Run: `pnpm test src/routes/__root.test.tsx`
Expected: PASS

---

### Task 11: Netlify headers

**Files:**
- Create: `public/_headers`

- [ ] **Step 1: Create _headers file**

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/images/*
  Cache-Control: public, max-age=604800, immutable
```

- [ ] **Step 2: Verify file is in public output**

Run: `pnpm build && ls dist/client/_headers`
Expected: File present (Netlify copies `public/` to output)

---

### Task 12: E2e expansion

**Files:**
- Modify: `e2e/site-smoke.spec.ts`

- [ ] **Step 1: Add 404 and active nav tests**

Append to `e2e/site-smoke.spec.ts`:

```ts
test('404 page links back to home', async ({ page }) => {
  await page.goto('/does-not-exist')

  await expect(page.getByRole('heading', { name: 'Страницата не е намерена' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Към началото' })).toHaveAttribute('href', '/')
})

test('gtp nav link is active on gtp page', async ({ page }) => {
  await page.goto('/gtp')

  const gtpLink = page.getByTestId('site-nav').getByRole('link', { name: 'ГТП' })
  await expect(gtpLink).toHaveAttribute('data-status', 'active')
})

test('home stats render lucide icons', async ({ page }) => {
  await page.goto('/')

  const statsNav = page.locator('.border-y').first()
  await expect(statsNav.locator('svg')).toHaveCount(3)
})
```

- [ ] **Step 2: Run e2e**

Run: `pnpm test:e2e`
Expected: All tests PASS (dev server must be available or use playwright webServer config)

---

### Task 13: Final verification

- [ ] **Step 1: Run full test suite**

Run: `pnpm test && pnpm build && pnpm lint`
Expected: All PASS, build succeeds with no errors

- [ ] **Step 2: Manual smoke checklist**

- Home stats show 3 navy icons above values
- Contact page shows Maps link opening in new tab
- Footer shows address + hours with icons
- Phone buttons show phone icon
- Skip link appears on Tab from page load
- Images load without broken src

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Lucide stat icons | Task 1–2 |
| Contact/footer/CTA icons | Task 3–4 |
| Google Maps link | Task 5 |
| Image compression + loading attrs | Task 6 |
| VITE_SITE_URL | Task 7 |
| Twitter cards + theme-color | Task 8 |
| Sitemap/robots generation | Task 9 |
| Skip link | Task 10 |
| Netlify _headers | Task 11 |
| E2e 404 + active nav | Task 12 |
| Build verification | Task 13 |

## Out of scope (confirmed)

- Real client content, favicon redesign, analytics, cookie banner
