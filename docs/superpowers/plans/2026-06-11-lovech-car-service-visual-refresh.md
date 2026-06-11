# Lovech Car Service Visual Refresh (v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the existing 4-page Bulgarian marketing site to the approved v2 design — light theme, sharp 90° corners, navy accent, large photo heroes, alternating text/image sections, phone + Viber contact actions — without changing routes or SEO structure.

**Architecture:** Extend `src/data/site-content.ts` with page-level `hero`, `sections`, and `stats` content plus a shared `contact` block (phone + Viber derived from one E.164 number). Replace v1 site components (`PageHero`, `CallCta`, etc.) with v2 layout primitives (`HeroSection`, `SplitSection`, `StatsStrip`, `CtaBand`, `ContactChannelLink`). Move page bodies into `src/pages/` so route files only register TanStack routes (fixes code-split warnings). Refresh `src/styles.css` tokens; install shadcn `Sheet` for mobile nav.

**Tech Stack:** TanStack Start, TanStack Router, React 19, TypeScript, pnpm, Tailwind CSS v4, shadcn/ui (`button`, `sheet`), Vitest, React Testing Library, Playwright

**Spec:** `docs/superpowers/specs/2026-06-11-lovech-car-service-visual-refresh-design.md`

---

## Implementation Guardrails

- Work on branch `feature/lovech-car-service-website`; do **not** replace TanStack Start with another framework.
- Keep `#/` import alias; run `pnpm generate-routes` after route file changes; never hand-edit `src/routeTree.gen.ts`.
- All UI corners: **`rounded-none`** everywhere (override shadcn `--radius: 0`).
- Phone remains primary CTA; Viber is secondary via `viber://chat?number=...` deep links only.
- Do **not** create git commits unless the user explicitly asks.
- Reuse existing Bulgarian copy where possible; expand into new content shape rather than rewriting tone.

## File Structure (v2)

| Path | Responsibility |
|------|----------------|
| `src/lib/contact-links.ts` | Build `tel:` and `viber://` hrefs from E.164 |
| `src/lib/contact-links.test.ts` | Unit tests for href builders |
| `src/data/site-content.ts` | Extended types + page heroes/sections/stats + Viber fields |
| `src/data/site-content.test.ts` | Content integrity including Viber |
| `src/styles.css` | Navy/light tokens; remove starter lagoon/sand decorative classes |
| `src/components/ui/button.tsx` | `rounded-none` default |
| `src/components/ui/sheet.tsx` | shadcn Sheet (mobile nav) |
| `src/components/site/viber-icon.tsx` | Inline Viber SVG |
| `src/components/site/contact-channel-link.tsx` | Phone/Viber link variants |
| `src/components/site/hero-section.tsx` | Full-width image hero |
| `src/components/site/stats-strip.tsx` | Homepage stat row |
| `src/components/site/split-section.tsx` | Alternating text/image block |
| `src/components/site/cta-band.tsx` | Dark footer CTA strip |
| `src/components/site/site-header.tsx` | Sharp header + Sheet mobile nav |
| `src/components/site/site-footer.tsx` | Minimal footer + contact links |
| `src/components/site/contact-details.tsx` | Structured phone/Viber/address/hours |
| `src/pages/home-page.tsx` | Homepage layout (no route export) |
| `src/pages/gtp-page.tsx` | GTP page layout |
| `src/pages/remonti-page.tsx` | Remonti page layout |
| `src/pages/kontakti-page.tsx` | Kontakti page layout |
| `src/routes/index.tsx` | Route only → imports `HomePage` |
| `src/routes/gtp.tsx` | Route only → imports `GtpPage` |
| `src/routes/remonti.tsx` | Route only → imports `RemontiPage` |
| `src/routes/kontakti.tsx` | Route only → imports `KontaktiPage` |
| `src/routes/__root.tsx` | Remove extra main padding; full-bleed layout |
| `e2e/site-smoke.spec.ts` | Assert tel + viber links |

**Delete after migration (when nothing imports them):**

- `src/components/site/page-hero.tsx`
- `src/components/site/call-cta.tsx`
- `src/components/site/trust-points.tsx`
- `src/components/site/service-summary-grid.tsx`
- `src/components/site/service-groups.tsx`
- `src/components/site/section.tsx` (if unused)
- `src/components/site/business-details.tsx` (replaced by `contact-details.tsx`)

---

### Task 1: Contact link helpers

**Files:**
- Create: `src/lib/contact-links.ts`
- Create: `src/lib/contact-links.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/contact-links.test.ts
import { describe, expect, it } from 'vitest'
import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'

describe('contact-links', () => {
  it('builds tel href from E.164', () => {
    expect(buildPhoneHref('+359888000000')).toBe('tel:+359888000000')
  })

  it('builds viber href without plus sign', () => {
    expect(buildViberHref('+359888000000')).toBe('viber://chat?number=359888000000')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/lib/contact-links.test.ts`

Expected: FAIL — module not found

- [ ] **Step 3: Implement helpers**

```ts
// src/lib/contact-links.ts
export function buildPhoneHref(e164: string): string {
  return `tel:${e164}`
}

export function buildViberHref(e164: string): string {
  const digits = e164.replace(/\D/g, '')
  return `viber://chat?number=${digits}`
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest run src/lib/contact-links.test.ts`

Expected: PASS (2 tests)

---

### Task 2: Extend content model (heroes, sections, stats, Viber)

**Files:**
- Modify: `src/data/site-content.ts`
- Modify: `src/data/site-content.test.ts`

- [ ] **Step 1: Write failing content tests**

Add to `src/data/site-content.test.ts`:

```ts
import { buildViberHref } from '#/lib/contact-links'

// inside describe('siteContent'):
it('exposes phone and viber contact channels from the same number', () => {
  expect(siteContent.contact.phoneHref).toMatch(/^tel:/)
  expect(siteContent.contact.viberHref).toBe(
    buildViberHref(siteContent.contact.phoneE164),
  )
  expect(siteContent.contact.viberLabel).toContain('Viber')
})

it('provides hero and split sections for every public page', () => {
  expect(siteContent.pages.home.hero.title.length).toBeGreaterThan(0)
  expect(siteContent.pages.home.sections.length).toBeGreaterThanOrEqual(2)
  expect(siteContent.pages.home.stats?.length).toBe(3)
  expect(siteContent.pages.gtp.sections.length).toBeGreaterThanOrEqual(2)
  expect(siteContent.pages.remonti.sections.length).toBeGreaterThanOrEqual(2)
  expect(siteContent.pages.kontakti.sections.length).toBeGreaterThanOrEqual(1)
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run src/data/site-content.test.ts`

Expected: FAIL — missing `phoneE164`, `pages`, etc.

- [ ] **Step 3: Extend `site-content.ts`**

Add types at top of file:

```ts
export type ContactChannels = {
  phoneE164: string
  phoneDisplay: string
  phoneHref: string
  viberHref: string
  viberLabel: string
  address: string
  hours: readonly string[]
  mapEmbedUrl: string
}

export type PageCta = { label: string; href: string }

export type HeroContent = {
  eyebrow: string
  title: string
  description: string
  primaryCta: PageCta
  secondaryCta?: PageCta
  imageSrc: string
  imageAlt: string
}

export type SplitSectionContent = {
  number: string
  eyebrow: string
  title: string
  description: string
  link: PageCta
  imageSrc: string
  imageAlt: string
}

export type StatItem = { value: string; label: string }

export type PageContent = {
  hero: HeroContent
  sections: SplitSectionContent[]
  stats?: StatItem[]
  ctaBand: { title: string; subtitle?: string }
}
```

Import helpers and define contact once:

```ts
import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'

const phoneE164 = '+359888000000'

const contact: ContactChannels = {
  phoneE164,
  phoneDisplay: '0888 000 000',
  phoneHref: buildPhoneHref(phoneE164),
  viberHref: buildViberHref(phoneE164),
  viberLabel: 'Пишете ни във Viber',
  address: 'гр. Ловеч, ул. Примерна 12',
  hours: [
    'Понеделник - Петък: 08:30 - 18:00',
    'Събота: 09:00 - 13:00',
  ],
  mapEmbedUrl: 'https://www.google.com/maps?q=Ловеч&output=embed',
}
```

Add `pages` object with `home`, `gtp`, `remonti`, `kontakti` — each with `hero`, `sections[]`, optional `stats`, `ctaBand`. Migrate existing copy from `home.hero`, `gtp`, `repairs`, `contacts` into the new shape. Example homepage hero:

```ts
home: {
  hero: {
    eyebrow: 'ГР. ЛОВЕЧ · ГТП И АВТОРЕМОНТИ',
    title: 'Сервизът, на който Ловеч се доверява.',
    description:
      'Годишни технически прегледи и пълна гама ремонти — с ясни цени и без излишно чакане.',
    primaryCta: { label: 'Обадете се сега', href: contact.phoneHref },
    secondaryCta: { label: 'Вижте услугите', href: '/gtp' },
    imageSrc: '/images/lovech-service-shop.jpg',
    imageAlt: 'Автосервиз в гр. Ловеч',
  },
  stats: [
    { value: '15+', label: 'години опит' },
    { value: '30 мин', label: 'среден ГТП преглед' },
    { value: '6 дни', label: 'в седмицата отворено' },
  ],
  sections: [
    {
      number: '01',
      eyebrow: 'ГОДИШЕН ТЕХНИЧЕСКИ ПРЕГЛЕД',
      title: 'ГТП без опашки и без изненади',
      description:
        'Записвате час по телефона, идвате, и за около 30 минути сте готови. Работим с леки автомобили и лекотоварни до 3.5 т.',
      link: { label: 'Научете повече', href: '/gtp' },
      imageSrc: '/images/gtp-section.jpg',
      imageAlt: 'Годишен технически преглед в сервиз',
    },
    {
      number: '02',
      eyebrow: 'РЕМОНТИ И ДИАГНОСТИКА',
      title: 'Точна диагностика, честни цени',
      description:
        'Ходова част, спирачки, двигател, електроника. Казваме цената преди да започнем — не след това.',
      link: { label: 'Вижте всички ремонти', href: '/remonti' },
      imageSrc: '/images/repairs-section.jpg',
      imageAlt: 'Ремонт в автосервиз',
    },
    {
      number: '03',
      eyebrow: 'ЗАЩО ДА ИЗБЕРЕТЕ НАС',
      title: 'Локален сервиз с ясна комуникация',
      description:
        'Професионално отношение, лесно откриваема локация в Ловеч и директен контакт без излишни стъпки.',
      link: { label: 'Контакти', href: '/kontakti' },
      imageSrc: '/images/trust-section.jpg',
      imageAlt: 'Екип на автосервиз',
    },
  ],
  ctaBand: {
    title: 'Запазете си час още днес',
    subtitle: 'Понеделник – Събота, 08:30 – 18:00',
  },
},
```

Use placeholder image paths under `public/images/` (copy or symlink hero image for section placeholders until real photos arrive). Keep legacy `home`, `gtp`, `repairs`, `contacts` keys temporarily if tests still reference them, or remove once all imports updated.

Export structure:

```ts
export const siteContent = {
  locale: 'bg-BG',
  city: 'Ловеч',
  siteUrl: 'https://avtoserviz-lovech.bg',
  brandName: 'Автосервиз Ловеч',
  navigation: [/* unchanged */],
  contact,
  pages: { home, gtp, remonti, kontakti },
  seo: { /* unchanged */ },
} as const
```

- [ ] **Step 4: Run content tests**

Run: `pnpm vitest run src/data/site-content.test.ts`

Expected: PASS

---

### Task 3: Design tokens and global CSS cleanup

**Files:**
- Modify: `src/styles.css`
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Update CSS variables and remove decorative layout classes**

In `:root`, set:

```css
--accent: #1e3a8a;
--accent-foreground: #ffffff;
--foreground: #0a0a0a;
--muted-foreground: #525252;
--border: #e5e5e5;
--surface-muted: #fafafa;
--viber: #7360f2;
--radius: 0;
```

Remove or stop using in components: `.site-panel`, lagoon/sand hero gradients, `rounded-3xl` page wrappers. Keep Tailwind `@import` pipeline intact.

Add utility if helpful:

```css
.page-full-bleed {
  width: 100%;
}
```

- [ ] **Step 2: Adjust root layout for full-bleed sections**

In `src/routes/__root.tsx`, change main wrapper:

```tsx
<main className="min-h-screen bg-white">
  <Outlet />
</main>
```

Remove `page-shell` padding from main — sections manage their own horizontal padding (`px-6 lg:px-10`).

- [ ] **Step 3: Visual smoke check**

Run: `pnpm dev`

Open `/` — page should still render (old components until Task 7); no CSS build errors.

---

### Task 4: shadcn Sheet + sharp Button

**Files:**
- Modify: `src/components/ui/button.tsx`
- Create: `src/components/ui/sheet.tsx` (via CLI)

- [ ] **Step 1: Install Sheet**

Run: `pnpm dlx shadcn@latest add sheet`

When prompted, accept defaults from `components.json`.

- [ ] **Step 2: Force square corners on Button and Sheet**

In `button.tsx`, ensure default classes include `rounded-none`. In `sheet.tsx`, add `rounded-none` to `SheetContent`.

- [ ] **Step 3: Verify build**

Run: `pnpm build`

Expected: success

---

### Task 5: ContactChannelLink and ViberIcon

**Files:**
- Create: `src/components/site/viber-icon.tsx`
- Create: `src/components/site/contact-channel-link.tsx`
- Create: `src/components/site/contact-channel-link.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
// src/components/site/contact-channel-link.test.tsx
import { render, screen } from '@testing-library/react'
import { ContactChannelLink } from '#/components/site/contact-channel-link'
import { siteContent } from '#/data/site-content'

describe('ContactChannelLink', () => {
  it('renders phone link with tel href', () => {
    render(<ContactChannelLink channel="phone" variant="solid" />)
    const link = screen.getByRole('link', { name: siteContent.contact.phoneDisplay })
    expect(link).toHaveAttribute('href', siteContent.contact.phoneHref)
  })

  it('renders viber link with viber href', () => {
    render(<ContactChannelLink channel="viber" variant="outline" />)
    const link = screen.getByRole('link', { name: siteContent.contact.viberLabel })
    expect(link).toHaveAttribute('href', siteContent.contact.viberHref)
  })
})
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `pnpm vitest run src/components/site/contact-channel-link.test.tsx`

- [ ] **Step 3: Implement components**

```tsx
// src/components/site/viber-icon.tsx
export function ViberIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z" />
    </svg>
  )
}
```

```tsx
// src/components/site/contact-channel-link.tsx
import { siteContent } from '#/data/site-content'
import { cn } from '#/lib/utils'
import { ViberIcon } from '#/components/site/viber-icon'

type Props = {
  channel: 'phone' | 'viber'
  variant: 'solid' | 'outline' | 'inverse-solid' | 'inverse-outline'
  className?: string
}

const variantClasses: Record<Props['variant'], string> = {
  solid: 'bg-[#1e3a8a] text-white hover:bg-[#1e40af]',
  outline: 'border border-[#7360f2] text-[#7360f2] hover:bg-[#7360f2]/5',
  'inverse-solid': 'bg-white text-[#0a0a0a] hover:bg-neutral-100',
  'inverse-outline': 'border border-white text-white hover:bg-white/10',
}

export function ContactChannelLink({ channel, variant, className }: Props) {
  const isPhone = channel === 'phone'
  const href = isPhone ? siteContent.contact.phoneHref : siteContent.contact.viberHref
  const label = isPhone ? siteContent.contact.phoneDisplay : siteContent.contact.viberLabel

  return (
    <a
      className={cn(
        'inline-flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-none',
        variantClasses[variant],
        className,
      )}
      href={href}
    >
      {!isPhone ? <ViberIcon className="size-4" /> : null}
      {label}
    </a>
  )
}
```

- [ ] **Step 4: Run tests — expect PASS**

Run: `pnpm vitest run src/components/site/contact-channel-link.test.tsx`

---

### Task 6: Layout primitives (Hero, Stats, Split, CtaBand)

**Files:**
- Create: `src/components/site/hero-section.tsx`
- Create: `src/components/site/stats-strip.tsx`
- Create: `src/components/site/split-section.tsx`
- Create: `src/components/site/cta-band.tsx`
- Create: `src/components/site/hero-section.test.tsx`

- [ ] **Step 1: Write failing hero test**

```tsx
import { render, screen } from '@testing-library/react'
import { HeroSection } from '#/components/site/hero-section'
import { siteContent } from '#/data/site-content'

describe('HeroSection', () => {
  it('renders hero title and primary CTA', () => {
    render(<HeroSection content={siteContent.pages.home.hero} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      siteContent.pages.home.hero.title,
    )
    expect(
      screen.getByRole('link', { name: siteContent.pages.home.hero.primaryCta.label }),
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Implement HeroSection**

Full-width section ~`min-h-[340px] md:min-h-[420px]`, background image with `object-cover`, left white gradient overlay, eyebrow as bordered tag (`border border-[#1e3a8a] text-[#1e3a8a] uppercase text-xs font-bold tracking-widest px-3 py-1 rounded-none`), H1 `text-4xl md:text-5xl font-extrabold tracking-tight`, description muted, two CTAs using `ContactChannelLink` or styled `<a>` / `<Link>` for internal secondary CTA. **No rounded classes.**

- [ ] **Step 3: Implement StatsStrip**

Props: `stats: StatItem[]`. Flex row with vertical borders; on mobile stack with horizontal borders. Numbers in `#1e3a8a`, labels uppercase small.

- [ ] **Step 4: Implement SplitSection**

Props: `content: SplitSectionContent`, `reverse?: boolean`. Grid `md:grid-cols-2`; text column with numbered eyebrow, h2, p, underlined link; image column full-bleed `object-cover min-h-[280px]`. Even sections: `bg-[#fafafa]`. Apply `reverse` to flip column order on desktop.

- [ ] **Step 5: Implement CtaBand**

Props: `title`, `subtitle?`. Black background `#0a0a0a`, flex row, left text white, right `ContactChannelLink` phone (`inverse-solid`) + viber (`inverse-outline`).

- [ ] **Step 6: Run component tests**

Run: `pnpm vitest run src/components/site/hero-section.test.tsx`

Expected: PASS

---

### Task 7: SiteHeader and SiteFooter refactor

**Files:**
- Modify: `src/components/site/site-header.tsx`
- Modify: `src/components/site/site-header.test.tsx`
- Modify: `src/components/site/site-footer.tsx`

- [ ] **Step 1: Update header tests for Viber + mobile menu trigger**

```tsx
it('renders phone and viber contact links', () => {
  render(<SiteHeader />)
  expect(screen.getAllByRole('link', { name: siteContent.contact.phoneDisplay }).length).toBeGreaterThan(0)
  expect(screen.getAllByRole('link', { name: siteContent.contact.viberLabel }).length).toBeGreaterThan(0)
})
```

- [ ] **Step 2: Implement SiteHeader**

- White header, `border-b border-[#e5e5e5]`, `px-6 lg:px-10 py-4`
- Brand link left (uppercase semibold)
- Desktop: nav links center + `ContactChannelLink` phone (solid) + viber (outline)
- Mobile: phone + viber visible OR inside `Sheet` triggered by hamburger `Button` — both channels must remain one tap away
- Use shadcn `Sheet` with `rounded-none`

- [ ] **Step 3: Simplify SiteFooter**

Copyright, address, optional nav repeat, text links for phone + Viber (`text-sm underline-offset-4 hover:underline`).

- [ ] **Step 4: Run header tests**

Run: `pnpm vitest run src/components/site/site-header.test.tsx`

Expected: PASS

---

### Task 8: ContactDetails + Kontakti split content

**Files:**
- Create: `src/components/site/contact-details.tsx`
- Create: `src/components/site/map-embed.tsx` (keep existing, restyle wrapper to sharp corners)

- [ ] **Step 1: Implement ContactDetails**

Structured list: phone (tel link), Viber (deep link + hint „Бързо съобщение“), address, hours lines. Used inside Kontakti split section or as standalone column.

- [ ] **Step 2: Ensure MapEmbed uses sharp border**

Remove `rounded-*` from iframe wrapper; keep `data-testid="contact-map"`.

---

### Task 9: Page modules and route wiring

**Files:**
- Create: `src/pages/home-page.tsx`
- Create: `src/pages/gtp-page.tsx`
- Create: `src/pages/remonti-page.tsx`
- Create: `src/pages/kontakti-page.tsx`
- Modify: `src/routes/index.tsx`, `gtp.tsx`, `remonti.tsx`, `kontakti.tsx`
- Modify: route tests

- [ ] **Step 1: Create HomePage**

```tsx
// src/pages/home-page.tsx
import { HeroSection } from '#/components/site/hero-section'
import { StatsStrip } from '#/components/site/stats-strip'
import { SplitSection } from '#/components/site/split-section'
import { CtaBand } from '#/components/site/cta-band'
import { siteContent } from '#/data/site-content'

export function HomePage() {
  const { hero, stats, sections, ctaBand } = siteContent.pages.home
  return (
    <>
      <HeroSection content={hero} />
      {stats ? <StatsStrip stats={stats} /> : null}
      {sections.map((section, index) => (
        <SplitSection content={section} key={section.number} reverse={index % 2 === 1} />
      ))}
      <CtaBand title={ctaBand.title} subtitle={ctaBand.subtitle} />
    </>
  )
}
```

- [ ] **Step 2: Create GtpPage, RemontiPage, KontaktiPage**

Same pattern: `HeroSection` → `sections.map(SplitSection)` → `CtaBand`. Kontakti: first section text column uses `ContactDetails`; second section uses `MapEmbed` (can be a dedicated split with custom right slot or a `SplitSection` variant).

- [ ] **Step 3: Slim route files (no exported page components)**

```tsx
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/pages/home-page'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'

const seo = buildSeoHead({
  title: siteContent.seo.home.title,
  description: siteContent.seo.home.description,
  path: '/',
})

export const Route = createFileRoute('/')({
  head: () => ({ meta: seo.meta, links: seo.links }),
  component: HomePage,
})
```

Repeat for `/gtp`, `/remonti`, `/kontakti` — **do not** `export function HomePage` from route files.

- [ ] **Step 4: Regenerate routes**

Run: `pnpm generate-routes`

- [ ] **Step 5: Update route tests**

Update `src/routes/index.test.tsx`, `service-routes.test.tsx`, `kontakti.test.tsx` to assert:
- Hero heading visible
- `tel:` link present
- Viber link present on kontakti (and globally via header)

Example:

```tsx
expect(screen.getByRole('link', { name: siteContent.contact.viberLabel })).toHaveAttribute(
  'href',
  siteContent.contact.viberHref,
)
```

- [ ] **Step 6: Run all unit tests**

Run: `pnpm vitest run`

Expected: all PASS

---

### Task 10: Remove deprecated v1 components

**Files:**
- Delete: deprecated files listed in File Structure section
- Modify: any stray imports

- [ ] **Step 1: Grep for old component imports**

Run: `rg "page-hero|call-cta|trust-points|service-summary|service-groups|business-details" src`

- [ ] **Step 2: Delete unused files after zero references**

- [ ] **Step 3: Run tests and build**

Run: `pnpm vitest run && pnpm build && pnpm lint`

Expected: all PASS

---

### Task 11: Playwright smoke tests

**Files:**
- Modify: `e2e/site-smoke.spec.ts`

- [ ] **Step 1: Extend smoke tests**

```ts
test('every page exposes phone and viber links', async ({ page }) => {
  for (const path of ['/', '/gtp', '/remonti', '/kontakti']) {
    await page.goto(path)
    await expect(page.getByRole('link', { name: /0888/ }).first()).toHaveAttribute('href', /tel:/)
    await expect(page.getByRole('link', { name: /Viber/i }).first()).toHaveAttribute(
      'href',
      /viber:\/\/chat\?number=/,
    )
  }
})
```

- [ ] **Step 2: Run e2e locally**

Run: `pnpm test:e2e`

Expected: PASS (requires Playwright browsers installed)

---

### Task 12: Placeholder section images

**Files:**
- Create: `public/images/gtp-section.jpg`, `repairs-section.jpg`, `trust-section.jpg` (copy from hero or use workshop placeholders)

- [ ] **Step 1: Add placeholder images**

Copy `public/images/lovech-service-shop.jpg` to the three section filenames (or add distinct stock images) so split sections render without broken images.

- [ ] **Step 2: Manual QA checklist**

- [ ] All corners square (buttons, sheet, cards, map)
- [ ] Light background throughout
- [ ] Navy accent on primary actions
- [ ] Viber purple only on Viber controls
- [ ] Hero full-width on all 4 pages
- [ ] Alternating splits on all pages
- [ ] Mobile: nav usable, phone + Viber reachable
- [ ] `pnpm vitest run`, `pnpm build`, `pnpm lint` pass

---

## Spec Coverage Checklist

| Spec requirement | Task |
|------------------|------|
| Light theme, sharp corners | Task 3, 4, 6 |
| Navy accent `#1e3a8a` | Task 3, 6 |
| Big hero every page | Task 6, 9 |
| Alternating split sections | Task 6, 9 |
| Stats strip homepage | Task 6, 9 |
| CTA band phone + Viber | Task 5, 6, 9 |
| Viber deep links | Task 1, 2, 5 |
| Header phone + Viber | Task 7 |
| Contact page details + map | Task 8, 9 |
| Move page exports out of routes | Task 9 |
| shadcn Sheet mobile nav | Task 4, 7 |
| Tests updated | Tasks 1–11 |
| Retire v1 components | Task 10 |

## Success Criteria (from spec)

1. Professional modern appearance — manual QA Task 12
2. Square corners everywhere — Task 3–4
3. Light theme + navy accent — Task 3
4. Hero + ≥2 splits per page — Task 9
5. Phone in header + CTA band — Task 7, 9
6. Viber in header, CTA band, contact — Task 5, 7, 8, 9
7. All tests pass — Task 11
8. Build + lint pass — Task 10, 12
