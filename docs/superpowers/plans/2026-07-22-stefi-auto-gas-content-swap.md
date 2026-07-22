# Stefi Auto Gas Content Swap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace placeholder contact data and brand copy with owner-approved Stefi Auto Gas content, using three phone/Viber lines with context-aware routing on service pages.

**Architecture:** Extend `siteContent.contact` with a typed `lines[]` array and `defaultLineId`. Add `src/lib/contact-context.ts` with `resolveContactLine(context)` consumed by CTAs and contact UI. Derive JSON-LD `contactPoint[]` from the same lines array so schema stays in sync with UI data.

**Tech Stack:** TanStack Start, React 19, TanStack Router, Vitest, Playwright, Vite, pnpm

**Spec:** [`docs/superpowers/specs/2026-07-22-stefi-auto-gas-content-swap-design.md`](../specs/2026-07-22-stefi-auto-gas-content-swap-design.md)

## Global Constraints

- `brandName`: **`Stefi Auto Gas`**
- Contact lines (E.164 / display / label):
  - `service`: `+359876689736` / `0876 689 736` / **Сервиз**
  - `inspections`: `+359876105674` / `0876 105 674` / **Прегледи (ГТП)**
  - `gas`: `+359887816055` / `0887 816 055` / **Газови системи**
- Viber labels on Контакти: **`Viber — Сервиз`**, **`Viber — Прегледи (ГТП)`**, **`Viber — Газови системи`**
- Compact CTA Viber visible label (header/footer/CTA bands): **`Пишете ни във Viber`**
- Context mapping: `default` → `service`, `gtp` → `inspections`, `remonti` → `service`
- Address: **`гр. Ловеч, бул. Освобождение 7`**
- Hours: **`['Понеделник - Петък: 9:00 - 18:00']`** only (no Saturday)
- `schemaOpeningHours`: **`['Mo-Fr 09:00-18:00']`**
- Maps link: **`https://maps.app.goo.gl/PYfpkTAFxMp2xjw79?g_st=ic`**
- Map embed URL: **`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4816.500206376381!2d24.7225143!3d43.159890999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40abe75aa66b506f%3A0xc7f3c72f2bc99639!2sStefi%20Auto%20Gas!5e1!3m2!1sen!2sbg!4v1784727303042!5m2!1sen!2sbg`**
- Root `defaultTitle`: **`Stefi Auto Gas | ГТП и сервиз в Ловеч`** (literal string in `__root.tsx`)
- Manifest: `short_name` **`Stefi Auto Gas`**, `name` **`Stefi Auto Gas — ГТП и сервиз`**
- No new routes, no favicon/domain changes, no full copy rewrite
- Types live in `site-content.ts`; `contact-context.ts` imports from there only (no circular imports)
- Quality gate: **`pnpm test`** and **`pnpm build`** pass

---

## File map

| File | Responsibility |
|------|----------------|
| `src/data/site-content.ts` | `ContactLine` types, `lines[]`, real content, light copy tweaks |
| `src/lib/contact-context.ts` | `resolveContactLine`, `getDefaultContactLine`, `getAllContactLines` |
| `src/lib/contact-context.test.ts` | Context mapping, order contract, missing default |
| `src/components/site/contact-channel-link.tsx` | Context-aware phone/Viber CTAs |
| `src/components/site/contact-details.tsx` | Three-line Контакти layout |
| `src/components/site/footer-contact-channels.tsx` | Default line in footer links |
| `src/components/site/hero-section.tsx` | Optional `contactContext` for hero tel CTA |
| `src/components/site/cta-band.tsx` | Optional `contactContext` for band CTAs |
| `src/pages/gtp-page.tsx` | Pass `contactContext="gtp"` |
| `src/pages/remonti-page.tsx` | Pass `contactContext="remonti"` |
| `src/lib/seo.ts` | Derive JSON-LD `contactPoint[]` from `lines[]` |
| `src/routes/__root.tsx` | Literal `defaultTitle` string |
| `public/manifest.json` | Stefi Auto Gas names |
| `e2e/site-smoke.spec.ts` | Real phone smoke assertions |

---

### Task 1: Contact data model + real content in site-content

**Files:**
- Modify: `src/data/site-content.ts`
- Modify: `src/data/site-content.test.ts`
- Test: `src/data/site-content.test.ts`

**Interfaces:**
- Produces: `ContactLineId`, `ContactContext`, `ContactLine`, updated `ContactChannels` with `lines[]` and `defaultLineId`
- Produces: `siteContent.contact.lines` (3 entries), `siteContent.brandName === 'Stefi Auto Gas'`

- [ ] **Step 1: Write the failing tests**

Replace the test named `exposes phone and viber contact channels from the same number` in `src/data/site-content.test.ts` with:

```ts
import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'

it('defines three contact lines with real Stefi Auto Gas numbers', () => {
  expect(siteContent.contact.lines).toHaveLength(3)
  expect(siteContent.contact.defaultLineId).toBe('service')

  const service = siteContent.contact.lines.find((line) => line.id === 'service')
  expect(service).toMatchObject({
    phoneE164: '+359876689736',
    phoneDisplay: '0876 689 736',
    label: 'Сервиз',
    viberLabel: 'Viber — Сервиз',
  })
  expect(service?.phoneHref).toBe(buildPhoneHref('+359876689736'))
  expect(service?.viberHref).toBe(buildViberHref('+359876689736'))
})

it('uses Mon-Fri hours only and Stefi Auto Gas brand', () => {
  expect(siteContent.brandName).toBe('Stefi Auto Gas')
  expect(siteContent.contact.hours).toEqual(['Понеделник - Петък: 9:00 - 18:00'])
  expect(siteContent.contact.schemaOpeningHours).toEqual(['Mo-Fr 09:00-18:00'])
  expect(siteContent.contact.address).toBe('гр. Ловеч, бул. Освобождение 7')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/site-content.test.ts`

Expected: FAIL — `contact.lines` undefined or `brandName` still `Автосервиз Ловеч`

- [ ] **Step 3: Update types and contact block in site-content.ts**

Replace `ContactChannels` flat phone fields with:

```ts
export type ContactLineId = 'service' | 'inspections' | 'gas'

export type ContactContext = 'default' | 'gtp' | 'remonti'

export type ContactLine = {
  id: ContactLineId
  label: string
  phoneE164: string
  phoneDisplay: string
  phoneHref: string
  viberHref: string
  viberLabel: string
}

export type ContactChannels = {
  lines: ContactLine[]
  defaultLineId: ContactLineId
  address: string
  hours: string[]
  schemaOpeningHours: string[]
  mapEmbedUrl: string
  mapsLink: string
}
```

Add helper and lines (replace old `phoneE164` / `contact` flat fields):

```ts
function buildContactLine(
  id: ContactLineId,
  label: string,
  phoneE164: string,
  phoneDisplay: string,
  viberLabel: string,
): ContactLine {
  return {
    id,
    label,
    phoneE164,
    phoneDisplay,
    phoneHref: buildPhoneHref(phoneE164),
    viberHref: buildViberHref(phoneE164),
    viberLabel,
  }
}

const contactLines = [
  buildContactLine(
    'service',
    'Сервиз',
    '+359876689736',
    '0876 689 736',
    'Viber — Сервиз',
  ),
  buildContactLine(
    'inspections',
    'Прегледи (ГТП)',
    '+359876105674',
    '0876 105 674',
    'Viber — Прегледи (ГТП)',
  ),
  buildContactLine(
    'gas',
    'Газови системи',
    '+359887816055',
    '0887 816 055',
    'Viber — Газови системи',
  ),
] satisfies ContactLine[]

const contact = {
  lines: contactLines,
  defaultLineId: 'service' as const,
  address: 'гр. Ловеч, бул. Освобождение 7',
  hours: ['Понеделник - Петък: 9:00 - 18:00'],
  schemaOpeningHours: ['Mo-Fr 09:00-18:00'],
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4816.500206376381!2d24.7225143!3d43.159890999999995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40abe75aa66b506f%3A0xc7f3c72f2bc99639!2sStefi%20Auto%20Gas!5e1!3m2!1sen!2sbg!4v1784727303042!5m2!1sen!2sbg',
  mapsLink: 'https://maps.app.goo.gl/PYfpkTAFxMp2xjw79?g_st=ic',
} satisfies ContactChannels
```

Apply light copy tweaks in the same file:

```ts
brandName: 'Stefi Auto Gas',

// homeHero — add eyebrow
const homeHero = {
  eyebrow: 'Stefi Auto Gas',
  title: 'ГТП и автосервиз в Ловеч',
  // ...rest unchanged
} satisfies HeroContent

// pages.home.stats[1]
{ value: 'Пн–Пт', label: '9:00–18:00', icon: 'calendar-days' },

// footer.tagline
tagline: 'ГТП, сервиз и газови системи в Ловеч',

// seo descriptions
seo: {
  home: {
    title: 'Начало',
    description: 'ГТП и автосервиз в Ловеч — Stefi Auto Gas. Запишете час по телефона.',
  },
  gtp: {
    title: 'ГТП',
    description: 'Годишен технически преглед в Ловеч — Stefi Auto Gas. Обадете се за час.',
  },
  repairs: {
    title: 'Ремонти',
    description: 'Ремонти и поддръжка на автомобили в Ловеч — Stefi Auto Gas.',
  },
  contacts: {
    title: 'Контакти',
    description: 'Контакти, адрес и работно време на Stefi Auto Gas в Ловеч.',
  },
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/site-content.test.ts`

Expected: PASS (other suites may fail until later tasks — that is OK)

- [ ] **Step 5: Commit**

```bash
git add src/data/site-content.ts src/data/site-content.test.ts
git commit -m "feat: add Stefi Auto Gas contact lines and real content data"
```

---

### Task 2: Contact context resolver

**Files:**
- Create: `src/lib/contact-context.ts`
- Create: `src/lib/contact-context.test.ts`
- Test: `src/lib/contact-context.test.ts`

**Interfaces:**
- Consumes: `ContactContext`, `ContactLine`, `ContactLineId`, `siteContent.contact` from `#/data/site-content`
- Produces:
  - `resolveContactLine(context?: ContactContext): ContactLine`
  - `getDefaultContactLine(): ContactLine`
  - `getAllContactLines(): readonly ContactLine[]`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/contact-context.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import {
  getAllContactLines,
  getDefaultContactLine,
  resolveContactLine,
} from '#/lib/contact-context'

describe('resolveContactLine', () => {
  it('maps default and remonti to service, gtp to inspections', () => {
    expect(resolveContactLine('default').id).toBe('service')
    expect(resolveContactLine('remonti').id).toBe('service')
    expect(resolveContactLine('gtp').id).toBe('inspections')
  })

  it('returns inspections line with correct phone for gtp', () => {
    const line = resolveContactLine('gtp')
    expect(line.phoneDisplay).toBe('0876 105 674')
    expect(line.phoneHref).toBe('tel:+359876105674')
  })
})

describe('getDefaultContactLine', () => {
  it('returns the service line', () => {
    expect(getDefaultContactLine().id).toBe('service')
    expect(getDefaultContactLine().phoneDisplay).toBe('0876 689 736')
  })
})

describe('getAllContactLines', () => {
  it('returns lines in contractual order service, inspections, gas', () => {
    expect(getAllContactLines().map((line) => line.id)).toEqual([
      'service',
      'inspections',
      'gas',
    ])
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/contact-context.test.ts`

Expected: FAIL — module not found

- [ ] **Step 3: Implement contact-context.ts**

Create `src/lib/contact-context.ts`:

```ts
import type { ContactContext, ContactLine, ContactLineId } from '#/data/site-content'
import { siteContent } from '#/data/site-content'

const LINE_ORDER: ContactLineId[] = ['service', 'inspections', 'gas']

function findLineById(id: ContactLineId): ContactLine {
  const line = siteContent.contact.lines.find((entry) => entry.id === id)
  if (!line) {
    throw new Error(`Missing contact line: ${id}`)
  }
  return line
}

export function getDefaultContactLine(): ContactLine {
  return findLineById(siteContent.contact.defaultLineId)
}

export function resolveContactLine(context: ContactContext = 'default'): ContactLine {
  switch (context) {
    case 'gtp':
      return findLineById('inspections')
    case 'remonti':
      return findLineById('service')
    case 'default':
      return getDefaultContactLine()
    default: {
      const exhaustiveCheck: never = context
      return exhaustiveCheck
    }
  }
}

export function getAllContactLines(): readonly ContactLine[] {
  return LINE_ORDER.map((id) => findLineById(id))
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/lib/contact-context.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact-context.ts src/lib/contact-context.test.ts
git commit -m "feat: add contact line resolver for page context routing"
```

---

### Task 3: Context-aware ContactChannelLink

**Files:**
- Modify: `src/components/site/contact-channel-link.tsx`
- Modify: `src/components/site/contact-channel-link.test.tsx`
- Test: `src/components/site/contact-channel-link.test.tsx`

**Interfaces:**
- Consumes: `resolveContactLine(context)` from `#/lib/contact-context`
- Produces: `ContactChannelLink` with optional `context?: ContactContext` prop

- [ ] **Step 1: Write the failing tests**

Replace contents of `src/components/site/contact-channel-link.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { ContactChannelLink } from '#/components/site/contact-channel-link'
import { resolveContactLine } from '#/lib/contact-context'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

describe('ContactChannelLink', () => {
  it('renders default service phone link with tel href', () => {
    render(<ContactChannelLink channel="phone" variant="solid" />)
    const line = resolveContactLine('default')
    const link = screen.getByRole('link', { name: line.phoneDisplay })
    expect(link).toHaveAttribute('href', line.phoneHref)
  })

  it('renders gtp inspections phone when context is gtp', () => {
    render(<ContactChannelLink channel="phone" context="gtp" variant="solid" />)
    const line = resolveContactLine('gtp')
    const link = screen.getByRole('link', { name: line.phoneDisplay })
    expect(link).toHaveAttribute('href', 'tel:+359876105674')
  })

  it('renders compact viber label with context-aware href', () => {
    render(<ContactChannelLink channel="viber" context="gtp" variant="outline" />)
    const line = resolveContactLine('gtp')
    const link = screen.getByRole('link', { name: COMPACT_VIBER_LABEL })
    expect(link).toHaveAttribute('href', line.viberHref)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/site/contact-channel-link.test.tsx`

Expected: FAIL — `context` prop ignored or `siteContent.contact.phoneDisplay` reference error

- [ ] **Step 3: Update ContactChannelLink**

Update `src/components/site/contact-channel-link.tsx`:

```tsx
import { Phone } from 'lucide-react'
import type { ContactContext } from '#/data/site-content'
import { resolveContactLine } from '#/lib/contact-context'
import { cn } from '#/lib/utils'
import { ViberIcon } from '#/components/site/viber-icon'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

type Props = {
  channel: 'phone' | 'viber'
  context?: ContactContext
  variant: 'solid' | 'outline' | 'inverse-solid' | 'inverse-outline'
  className?: string
  onClick?: () => void
}

// ...variantClasses unchanged...

export function ContactChannelLink({
  channel,
  context = 'default',
  variant,
  className,
  onClick,
}: Props) {
  const line = resolveContactLine(context)
  const isPhone = channel === 'phone'
  const href = isPhone ? line.phoneHref : line.viberHref
  const label = isPhone ? line.phoneDisplay : COMPACT_VIBER_LABEL
  const ariaLabel = isPhone ? undefined : `${line.label} — Viber`

  return (
    <a
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-2 px-5 py-3 text-sm font-bold motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 rounded-none',
        variantClasses[variant],
        className,
      )}
      href={href}
      onClick={onClick}
    >
      {isPhone ? <Phone aria-hidden className="size-4" /> : <ViberIcon className="size-4" />}
      {label}
    </a>
  )
}
```

Remove `siteContent` import from this file.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/site/contact-channel-link.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/site/contact-channel-link.tsx src/components/site/contact-channel-link.test.tsx
git commit -m "feat: add context-aware phone and viber channel links"
```

---

### Task 4: Three-line ContactDetails + footer channels

**Files:**
- Modify: `src/components/site/contact-details.tsx`
- Modify: `src/components/site/footer-contact-channels.tsx`
- Modify: `src/routes/kontakti.test.tsx`
- Modify: `src/components/site/site-footer.test.tsx`
- Test: `src/routes/kontakti.test.tsx`, `src/components/site/site-footer.test.tsx`

**Interfaces:**
- Consumes: `getAllContactLines()`, `getDefaultContactLine()` from `#/lib/contact-context`

- [ ] **Step 1: Write the failing Kontakti test**

Replace phone/viber assertions in `src/routes/kontakti.test.tsx`:

```tsx
import { getAllContactLines } from '#/lib/contact-context'

it('renders hero, all three contact lines, and the map iframe', () => {
  render(<KontaktiPage />)

  expect(
    screen.getByRole('heading', { name: siteContent.pages.kontakti.hero.title }),
  ).toBeInTheDocument()
  expect(screen.getByText(siteContent.contact.address)).toBeInTheDocument()
  expect(screen.getByText(siteContent.contact.hours[0])).toBeInTheDocument()

  const lines = getAllContactLines()
  expect(lines).toHaveLength(3)

  for (const line of lines) {
    expect(
      screen.getByRole('link', { name: `${line.label}: ${line.phoneDisplay}` }),
    ).toHaveAttribute('href', line.phoneHref)
    expect(screen.getByRole('link', { name: line.viberLabel })).toHaveAttribute(
      'href',
      line.viberHref,
    )
  }

  expect(screen.getByTitle('Карта до сервиза')).toBeInTheDocument()
  // maps link assertions unchanged...
})
```

Update `src/components/site/site-footer.test.tsx` — remove `hours[1]` assertion; use resolver for phone:

```tsx
import { getDefaultContactLine } from '#/lib/contact-context'

// inside test:
const defaultLine = getDefaultContactLine()
expect(screen.getByText(siteContent.contact.hours[0])).toBeInTheDocument()
expect(screen.queryByText(/Събота/)).not.toBeInTheDocument()

const phoneLink = screen.getByRole('link', { name: defaultLine.phoneDisplay })
expect(phoneLink).toHaveAttribute('href', defaultLine.phoneHref)

const viberLink = screen.getByRole('link', { name: 'Пишете ни във Viber' })
expect(viberLink).toHaveAttribute('href', defaultLine.viberHref)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/routes/kontakti.test.tsx src/components/site/site-footer.test.tsx`

Expected: FAIL

- [ ] **Step 3: Rewrite ContactDetails**

Replace `src/components/site/contact-details.tsx` phone/viber section with:

```tsx
import { getAllContactLines } from '#/lib/contact-context'

export function ContactDetails() {
  const { address, hours, mapsLink } = siteContent.contact
  const lines = getAllContactLines()

  return (
    <div className="space-y-8 text-[#0a0a0a]">
      {lines.map((line) => (
        <div className="space-y-3" key={line.id}>
          <p className="text-xs font-bold uppercase tracking-widest text-[#525252]">
            {line.label}
          </p>
          <a
            aria-label={`${line.label}: ${line.phoneDisplay}`}
            className="inline-flex items-center gap-2 text-lg font-bold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
            href={line.phoneHref}
          >
            <Phone aria-hidden className="size-5 shrink-0" />
            {line.phoneDisplay}
          </a>
          <div className="space-y-1">
            <a
              className="inline-flex items-center gap-2 text-lg font-bold text-[#7360f2] underline-offset-4 hover:text-[#5a4fd1] hover:underline"
              href={line.viberHref}
            >
              <ViberIcon className="size-5 shrink-0" />
              {line.viberLabel}
            </a>
            <p className="text-sm text-[#525252]">Бързо съобщение</p>
          </div>
        </div>
      ))}
      {/* address, hours, maps link blocks unchanged */}
    </div>
  )
}
```

Update `src/components/site/footer-contact-channels.tsx`:

```tsx
import { getDefaultContactLine } from '#/lib/contact-context'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

export function FooterContactChannels() {
  const line = getDefaultContactLine()
  const { mapsLink } = siteContent.contact

  return (
    <div className="flex flex-col gap-3">
      <a className={channelLinkClassName} href={line.phoneHref}>
        <Phone aria-hidden className="size-4 shrink-0" />
        {line.phoneDisplay}
      </a>
      <a
        aria-label={`${line.label} — Viber`}
        className={channelLinkClassName}
        href={line.viberHref}
      >
        <ViberIcon className="size-4 shrink-0 text-[#7360f2]" />
        {COMPACT_VIBER_LABEL}
      </a>
      {/* maps link unchanged */}
    </div>
  )
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/routes/kontakti.test.tsx src/components/site/site-footer.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/site/contact-details.tsx src/components/site/footer-contact-channels.tsx src/routes/kontakti.test.tsx src/components/site/site-footer.test.tsx
git commit -m "feat: show three contact lines on kontakti and default line in footer"
```

---

### Task 5: Hero + CtaBand context wiring on service pages

**Files:**
- Modify: `src/components/site/hero-section.tsx`
- Modify: `src/components/site/hero-section.test.tsx`
- Modify: `src/components/site/cta-band.tsx`
- Modify: `src/pages/gtp-page.tsx`
- Modify: `src/pages/remonti-page.tsx`
- Modify: `src/routes/service-routes.test.tsx`
- Test: `src/components/site/hero-section.test.tsx`, `src/routes/service-routes.test.tsx`

**Interfaces:**
- Consumes: `resolveContactLine(context)` from `#/lib/contact-context`
- Produces: `HeroSection` and `CtaBand` accept optional `contactContext?: ContactContext`

- [ ] **Step 1: Write the failing tests**

Update `src/components/site/hero-section.test.tsx`:

```tsx
import { resolveContactLine } from '#/lib/contact-context'

it('renders hero title and default primary CTA', () => {
  const hero = siteContent.pages.home.hero
  render(<HeroSection content={hero} />)
  const line = resolveContactLine('default')
  expect(screen.getByRole('link', { name: hero.primaryCtaLabel })).toHaveAttribute(
    'href',
    line.phoneHref,
  )
})

it('uses gtp inspections phone when contactContext is gtp', () => {
  const hero = siteContent.pages.gtp.hero
  render(<HeroSection contactContext="gtp" content={hero} />)
  const line = resolveContactLine('gtp')
  expect(screen.getByRole('link', { name: hero.primaryCtaLabel })).toHaveAttribute(
    'href',
    line.phoneHref,
  )
})
```

Update `src/routes/service-routes.test.tsx` phone assertions:

```tsx
import { resolveContactLine } from '#/lib/contact-context'

// GTP test:
const gtpLine = resolveContactLine('gtp')
expect(
  screen.getAllByRole('link', { name: gtpLine.phoneDisplay })[0],
).toHaveAttribute('href', gtpLine.phoneHref)

// Remonti test:
const serviceLine = resolveContactLine('remonti')
expect(
  screen.getAllByRole('link', { name: serviceLine.phoneDisplay })[0],
).toHaveAttribute('href', serviceLine.phoneHref)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/components/site/hero-section.test.tsx src/routes/service-routes.test.tsx`

Expected: FAIL — gtp hero still uses default phone

- [ ] **Step 3: Implement hero and cta-band context**

`src/components/site/hero-section.tsx`:

```tsx
import type { ContactContext, HeroContent } from '#/data/site-content'
import { resolveContactLine } from '#/lib/contact-context'

type HeroSectionProps = {
  content: HeroContent
  contactContext?: ContactContext
  secondaryCta?: Cta
}

export function HeroSection({ content, contactContext = 'default', secondaryCta }: HeroSectionProps) {
  const primaryCta: Cta | null = content.primaryCtaLabel
    ? {
        label: content.primaryCtaLabel,
        href: resolveContactLine(contactContext).phoneHref,
      }
    : null
  // ...rest unchanged
}
```

`src/components/site/cta-band.tsx`:

```tsx
import type { ContactContext } from '#/data/site-content'

type CtaBandProps = {
  title: string
  subtitle?: string
  tone?: 'dark' | 'accent'
  contactContext?: ContactContext
}

export function CtaBand({ title, subtitle, tone = 'accent', contactContext = 'default' }: CtaBandProps) {
  // ...
  <ContactChannelLink channel="phone" contactContext={contactContext} variant="inverse-solid" />
  <ContactChannelLink channel="viber" contactContext={contactContext} variant="inverse-outline" />
}
```

`src/pages/gtp-page.tsx`:

```tsx
<HeroSection contactContext="gtp" content={hero} />
// ...
<CtaBand contactContext="gtp" subtitle={ctaBand.description} title={ctaBand.title} />
```

`src/pages/remonti-page.tsx`:

```tsx
<HeroSection contactContext="remonti" content={hero} />
// ...
<CtaBand contactContext="remonti" subtitle={ctaBand.description} title={ctaBand.title} />
```

Ensure GTP/Remonti heroes have `primaryCtaLabel: 'Обадете се'` in `site-content.ts` if missing (add to `pages.gtp.hero` and `pages.remonti.hero`).

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/components/site/hero-section.test.tsx src/routes/service-routes.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/site/hero-section.tsx src/components/site/hero-section.test.tsx src/components/site/cta-band.tsx src/pages/gtp-page.tsx src/pages/remonti-page.tsx src/routes/service-routes.test.tsx
git commit -m "feat: route service page CTAs to context-specific phone lines"
```

---

### Task 6: JSON-LD derivation + remaining unit tests

**Files:**
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/seo.test.ts`
- Modify: `src/routes/index.test.tsx`
- Modify: `src/components/site/site-header.test.tsx`
- Test: `src/lib/seo.test.ts`, `src/routes/index.test.tsx`, `src/components/site/site-header.test.tsx`

**Interfaces:**
- Consumes: `getDefaultContactLine()`, `siteContent.contact.lines` from resolver/content

- [ ] **Step 1: Write the failing SEO test updates**

Update `src/lib/seo.test.ts`:

```ts
import { getDefaultContactLine } from '#/lib/contact-context'

// buildSeoHead test:
expect(seo.title).toBe('ГТП | Stefi Auto Gas')

// buildLocalBusinessJsonLd test:
const defaultLine = getDefaultContactLine()
expect(jsonLd).toMatchObject({
  name: 'Stefi Auto Gas',
  telephone: defaultLine.phoneE164,
  openingHours: ['Mo-Fr 09:00-18:00'],
})
expect(jsonLd.contactPoint).toHaveLength(3)
expect(jsonLd.contactPoint[0]).toMatchObject({
  '@type': 'ContactPoint',
  telephone: '+359876689736',
  contactType: 'customer service',
  description: 'Сервиз',
})
```

Update `src/routes/index.test.tsx` and `src/components/site/site-header.test.tsx` to use `getDefaultContactLine()` instead of `siteContent.contact.phoneDisplay` / `phoneHref`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test src/lib/seo.test.ts src/routes/index.test.tsx src/components/site/site-header.test.tsx`

Expected: FAIL

- [ ] **Step 3: Update buildLocalBusinessJsonLd**

```ts
import { getDefaultContactLine } from '#/lib/contact-context'

export function buildLocalBusinessJsonLd() {
  const defaultLine = getDefaultContactLine()

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoRepair',
    name: siteContent.brandName,
    telephone: defaultLine.phoneE164,
    contactPoint: siteContent.contact.lines.map((line) => ({
      '@type': 'ContactPoint',
      telephone: line.phoneE164,
      contactType: 'customer service',
      description: line.label,
    })),
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteContent.contact.address,
      addressLocality: siteContent.city,
      addressCountry: 'BG',
    },
    url: siteContent.siteUrl,
    image: defaultOgImage,
    openingHours: siteContent.contact.schemaOpeningHours,
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test src/lib/seo.test.ts src/routes/index.test.tsx src/components/site/site-header.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo.ts src/lib/seo.test.ts src/routes/index.test.tsx src/components/site/site-header.test.tsx
git commit -m "feat: derive JSON-LD contact points from contact lines"
```

---

### Task 7: Brand shell updates + e2e smoke + quality gate

**Files:**
- Modify: `src/routes/__root.tsx`
- Modify: `public/manifest.json`
- Modify: `e2e/site-smoke.spec.ts`
- Test: `e2e/site-smoke.spec.ts`, full suite

- [ ] **Step 1: Write the failing e2e expectations**

Update `e2e/site-smoke.spec.ts`:

```ts
test('homepage exposes the main call CTA and the site navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('site-nav')).toBeVisible()
  await expect(
    page.getByRole('link', { name: /Обадете се|0876 689 736/ }).first(),
  ).toHaveAttribute('href', /tel:\+359876689736/)
})

test('gtp page uses inspections phone number', async ({ page }) => {
  await page.goto('/gtp')
  await expect(page.locator('a[href^="tel:"]').first()).toHaveAttribute(
    'href',
    /876105674/,
  )
})

test('contact page shows three phone links', async ({ page }) => {
  await page.goto('/kontakti')
  await expect(page.locator('a[href^="tel:"]')).toHaveCount(3)
  await expect(page.getByText(/Понеделник - Петък/).first()).toBeVisible()
  await expect(page.getByTestId('contact-map')).toBeVisible()
})
```

- [ ] **Step 2: Update brand shell files**

`src/routes/__root.tsx`:

```ts
const defaultTitle = 'Stefi Auto Gas | ГТП и сервиз в Ловеч'
```

`public/manifest.json`:

```json
{
  "short_name": "Stefi Auto Gas",
  "name": "Stefi Auto Gas — ГТП и сервиз",
  ...
}
```

- [ ] **Step 3: Run full quality gate**

Run: `pnpm test`

Expected: all unit/integration tests PASS

Run: `pnpm build`

Expected: build succeeds

Run: `pnpm test:e2e`

Expected: e2e PASS (requires dev server or playwright config — use existing project setup)

- [ ] **Step 4: Grep for stale flat contact fields**

Run: `rg 'contact\.(phoneDisplay|phoneHref|phoneE164|viberHref|viberLabel)' src`

Expected: no matches (except comments if any)

- [ ] **Step 5: Commit**

```bash
git add src/routes/__root.tsx public/manifest.json e2e/site-smoke.spec.ts
git commit -m "chore: update Stefi Auto Gas brand shell and e2e contact smoke tests"
```

---

## Definition of done (verify manually)

- [ ] Three lines in `siteContent.contact.lines[]` with real numbers
- [ ] Header/footer/home/404 → service line `0876 689 736`
- [ ] `/gtp` → inspections `0876 105 674`
- [ ] `/remonti` → service `0876 689 736`
- [ ] `/kontakti` → all three lines with distinct accessible names
- [ ] Address, maps link, map embed URL set to Stefi Auto Gas pin
- [ ] Mon–Fri 9:00–18:00 only (UI + JSON-LD)
- [ ] Brand Stefi Auto Gas in header, footer, manifest, JSON-LD, SEO
- [ ] `defaultTitle` uses **сервиз** suffix
- [ ] `pnpm test` and `pnpm build` green

---

## Plan self-review

| Spec requirement | Task |
|------------------|------|
| `lines[]` + resolver | Task 1–2 |
| Context-aware ContactChannelLink | Task 3 |
| Three-line ContactDetails | Task 4 |
| Footer default line | Task 4 |
| Hero/CtaBand/page wiring | Task 5 |
| JSON-LD contactPoint derivation | Task 6 |
| Brand/copy/manifest/defaultTitle | Task 1, 7 |
| All listed test files | Tasks 1–7 |
| E2E smoke | Task 7 |
| Explicitly unchanged copy | Not touched beyond spec table |

No TBD placeholders. Type names consistent across tasks (`ContactContext`, `resolveContactLine`, `getAllContactLines`).
