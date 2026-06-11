# Lovech Car Service Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Bulgarian-only, 4-page marketing site for a Lovech car service shop on top of the existing TanStack Start app, with clear pages for `Начало`, `ГТП`, `Ремонти`, and `Контакти`, and with phone-first conversion.

**Architecture:** Keep the existing TanStack Start file-based router and add the marketing site as typed content plus reusable site components. Use `src/routes` for the four public pages, `src/components/site` for shared marketing UI, `src/data/site-content.ts` as the single source of business copy, and a small SEO helper for route metadata. Reuse the existing Tailwind v4 + shadcn setup and `src/styles.css` rather than re-scaffolding the app.

**Tech Stack:** TanStack Start, TanStack Router file routes, React 19, TypeScript, pnpm, Tailwind CSS v4, shadcn/ui setup, Vitest, React Testing Library, Playwright, ESLint

---

## Implementation Guardrails

- Keep the current TanStack Start project. Do **not** replace it with Next.js or another router.
- Reuse `src/styles.css` and `src/lib/utils.ts`; do not create a second global CSS pipeline.
- Use the `#/` alias for new imports so new files match the existing shadcn alias config.
- `src/routeTree.gen.ts` is generated. Never edit it by hand; always refresh it with `pnpm generate-routes`.
- Do **not** create git commits unless the user explicitly asks for them.

## Required Inputs Before Execution

Collect and confirm these production values before Task 1 Step 3 so `src/data/site-content.ts` can be filled once and reused everywhere:

- final business name as it should appear in navigation and metadata
- primary phone number in both display format and `tel:` format
- full Lovech address
- working hours
- Google Maps embed URL or Maps share URL
- owner-approved photo for `public/images/lovech-service-shop.jpg`
- final production domain if it differs from the sample domain used in this plan

## File Structure

- `package.json` - existing project scripts; later updated for lint and Playwright
- `vitest.config.ts` - Vitest config with alias resolution and jsdom
- `vitest.setup.ts` - shared test setup and TanStack `Link` mock
- `public/images/lovech-service-shop.jpg` - owner-approved hero/trust image
- `public/robots.txt` - static crawl rules
- `public/sitemap.xml` - static four-page sitemap
- `src/styles.css` - existing Tailwind v4 stylesheet; extend it with the cleaner automotive palette and layout utility classes
- `src/data/site-content.ts` - typed Bulgarian content, business details, and SEO copy
- `src/data/site-content.test.ts` - content integrity test
- `src/lib/seo.ts` - route head builder for title, description, Open Graph, and canonical links
- `src/lib/seo.test.ts` - SEO helper test
- `src/components/ui/button.tsx` - first reusable shadcn-style button primitive if it does not already exist
- `src/components/site/section.tsx` - width and spacing wrapper
- `src/components/site/site-header.tsx` - top nav + primary phone CTA
- `src/components/site/site-footer.tsx` - footer with repeated business info
- `src/components/site/page-hero.tsx` - reusable page hero block
- `src/components/site/call-cta.tsx` - repeated phone-first CTA block
- `src/components/site/business-details.tsx` - address, hours, and phone renderer
- `src/components/site/trust-points.tsx` - homepage trust section
- `src/components/site/service-summary-grid.tsx` - homepage service summary cards
- `src/components/site/service-groups.tsx` - grouped services renderer for repairs
- `src/components/site/map-embed.tsx` - contact map iframe container
- `src/components/site/site-header.test.tsx` - header render test
- `src/routes/__root.tsx` - root shell with `html lang="bg"`, global meta, header, footer, and outlet
- `src/routes/index.tsx` - homepage route
- `src/routes/index.test.tsx` - homepage test
- `src/routes/gtp.tsx` - `ГТП` route
- `src/routes/remonti.tsx` - `Ремонти` route
- `src/routes/kontakti.tsx` - `Контакти` route
- `src/routes/service-routes.test.tsx` - `ГТП` and `Ремонти` tests
- `src/routes/kontakti.test.tsx` - contact route test
- `src/routeTree.gen.ts` - generated route tree refreshed after adding routes
- `playwright.config.ts` - Playwright config for smoke tests
- `e2e/site-smoke.spec.ts` - route, nav, phone CTA, and map smoke test

## Task 1: Add A Real Test Harness And Typed Marketing Content

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `src/data/site-content.ts`
- Create: `src/data/site-content.test.ts`

- [ ] **Step 1: Write the failing content test and the minimum Vitest setup needed to run it**

```ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: {
      '#': path.resolve(rootDir, './src'),
      '@': path.resolve(rootDir, './src'),
    },
  },
})
```

```ts
import {
  createElement,
  type AnchorHTMLAttributes,
  type ReactNode,
} from 'react'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-router')>()

  return {
    ...actual,
    Link: ({
      children,
      to,
      ...props
    }: AnchorHTMLAttributes<HTMLAnchorElement> & {
      children?: ReactNode
      to?: string
    }) => createElement('a', { href: to ?? '#', ...props }, children),
  }
})
```

```ts
import { describe, expect, it } from 'vitest'
import { siteContent } from '#/data/site-content'

describe('siteContent', () => {
  it('locks the site to Bulgarian Lovech marketing content and four public routes', () => {
    expect(siteContent.locale).toBe('bg-BG')
    expect(siteContent.city).toBe('Ловеч')
    expect(siteContent.navigation.map((item) => item.to)).toEqual([
      '/',
      '/gtp',
      '/remonti',
      '/kontakti',
    ])
    expect(siteContent.home.hero.title).toContain('Ловеч')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/data/site-content.test.ts`

Expected: FAIL with `Cannot find module '#/data/site-content'`

- [ ] **Step 3: Implement the typed content source**

```ts
export type SitePath = '/' | '/gtp' | '/remonti' | '/kontakti'

export type NavigationItem = {
  to: SitePath
  label: string
}

export type TrustPoint = {
  title: string
  description: string
}

export type ServiceCard = {
  title: string
  description: string
}

export type ServiceGroup = {
  title: string
  items: string[]
}

export type SeoEntry = {
  title: string
  description: string
}

export const siteContent = {
  locale: 'bg-BG',
  city: 'Ловеч',
  siteUrl: 'https://avtoserviz-lovech.bg',
  brandName: 'Автосервиз Ловеч',
  navigation: [
    { to: '/', label: 'Начало' },
    { to: '/gtp', label: 'ГТП' },
    { to: '/remonti', label: 'Ремонти' },
    { to: '/kontakti', label: 'Контакти' },
  ] satisfies NavigationItem[],
  contact: {
    phoneDisplay: '0888 000 000',
    phoneHref: 'tel:+359888000000',
    address: 'гр. Ловеч, ул. Примерна 12',
    hours: [
      'Понеделник - Петък: 08:30 - 18:00',
      'Събота: 09:00 - 13:00',
    ],
    mapEmbedUrl: 'https://www.google.com/maps?q=Ловеч&output=embed',
  },
  home: {
    hero: {
      eyebrow: 'гр. Ловеч',
      title: 'ГТП и автосервиз в Ловеч',
      description:
        'Надежно обслужване, технически прегледи и ремонти за вашия автомобил.',
      primaryCtaLabel: 'Обадете се',
    },
    serviceCards: [
      {
        title: 'Годишен технически преглед',
        description:
          'Кратък и ясен процес за записване, преглед и последваща информация по телефона.',
      },
      {
        title: 'Ремонти и поддръжка',
        description:
          'Диагностика, спирачки, ходова част, масла и основни сервизни дейности за ежедневни автомобили.',
      },
    ] satisfies ServiceCard[],
    trustPoints: [
      {
        title: 'Професионално отношение',
        description:
          'Работа с фокус върху изправността и безопасността на автомобила.',
      },
      {
        title: 'Локален сервиз в Ловеч',
        description:
          'Лесно откриваема локация и директен телефонен контакт без излишни стъпки.',
      },
      {
        title: 'Ясна комуникация',
        description:
          'Кратко и разбираемо обяснение какво предстои при прегледа или ремонта.',
      },
    ] satisfies TrustPoint[],
  },
  gtp: {
    title: 'Годишен технически преглед',
    description:
      'Страница за хора, които търсят бърз ориентир за годишен технически преглед в Ловеч.',
    steps: [
      'Обадете се за потвърждение на удобен час.',
      'Посетете сервиза в Ловеч.',
      'Получавате ясен процес и следващи стъпки.',
    ],
    ctaTitle: 'Запишете час за технически преглед',
    ctaDescription:
      'Телефонният контакт е основният начин за записване и бързо уточняване на прегледа.',
  },
  repairs: {
    title: 'Ремонти и поддръжка',
    description:
      'Най-честите сервизни услуги са групирани ясно, без претоварване с твърде дълъг каталог.',
    groups: [
      {
        title: 'Диагностика и обслужване',
        items: ['Компютърна диагностика', 'Смяна на масла', 'Смяна на филтри'],
      },
      {
        title: 'Спирачна система и ходова част',
        items: ['Накладки и дискове', 'Окачване', 'Проверка на ходова част'],
      },
      {
        title: 'Общи ремонти',
        items: ['Дребни ремонти', 'Поддръжка', 'Подготовка за път'],
      },
    ] satisfies ServiceGroup[],
    ctaTitle: 'Обадете се за ремонт и консултация',
    ctaDescription:
      'Страницата показва най-честите групи услуги, а уточняването на проблема остава по телефона.',
  },
  contacts: {
    title: 'Контакти',
    description: 'Телефон, адрес, работно време и карта до сервиза в Ловеч.',
    ctaTitle: 'Свържете се директно по телефона',
    ctaDescription:
      'Адресът, работното време и телефонът остават видими дори ако картата не се зареди.',
  },
  seo: {
    home: {
      title: 'Начало',
      description: 'ГТП и ремонти в Ловеч с директен телефонен контакт.',
    },
    gtp: {
      title: 'ГТП',
      description: 'Годишен технически преглед в Ловеч с бързо записване по телефона.',
    },
    repairs: {
      title: 'Ремонти',
      description: 'Автосервизни ремонти и поддръжка в Ловеч.',
    },
    contacts: {
      title: 'Контакти',
      description: 'Контакти, адрес и работно време на автосервиза в Ловеч.',
    },
  } satisfies Record<'home' | 'gtp' | 'repairs' | 'contacts', SeoEntry>,
} as const
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/data/site-content.test.ts`

Expected: PASS with `1 passed`

## Task 2: Build The Shared Site Shell On Top Of The Existing Root Route

**Files:**
- Create: `src/components/ui/button.tsx`
- Create: `src/components/site/section.tsx`
- Create: `src/components/site/site-header.tsx`
- Create: `src/components/site/site-footer.tsx`
- Create: `src/components/site/page-hero.tsx`
- Create: `src/components/site/call-cta.tsx`
- Create: `src/components/site/business-details.tsx`
- Create: `src/components/site/trust-points.tsx`
- Create: `src/components/site/site-header.test.tsx`
- Modify: `src/styles.css`
- Modify: `src/routes/__root.tsx`

- [ ] **Step 1: Write the failing header test**

```tsx
import { render, screen } from '@testing-library/react'
import { SiteHeader } from '#/components/site/site-header'
import { siteContent } from '#/data/site-content'

describe('SiteHeader', () => {
  it('renders the Bulgarian navigation and the main phone CTA', () => {
    render(<SiteHeader />)

    expect(screen.getByRole('link', { name: 'Начало' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'ГТП' })).toHaveAttribute('href', '/gtp')
    expect(screen.getByRole('link', { name: 'Ремонти' })).toHaveAttribute('href', '/remonti')
    expect(screen.getByRole('link', { name: 'Контакти' })).toHaveAttribute('href', '/kontakti')
    expect(
      screen.getAllByRole('link', {
        name: siteContent.home.hero.primaryCtaLabel,
      })[0],
    ).toHaveAttribute('href', siteContent.contact.phoneHref)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/components/site/site-header.test.tsx`

Expected: FAIL with `Cannot find module '#/components/site/site-header'`

- [ ] **Step 3: Implement the shared site primitives, shell styling, and root layout**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '#/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-slate-900 text-white hover:bg-slate-800',
        secondary: 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        lg: 'h-11 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({
  className,
  size,
  variant,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ size, variant }), className)}
      {...props}
    />
  )
}

export { buttonVariants }
```

```tsx
import type { ReactNode } from 'react'
import { cn } from '#/lib/utils'

type SectionProps = {
  children: ReactNode
  className?: string
}

export function Section({ children, className }: SectionProps) {
  return <section className={cn('page-shell py-12 md:py-16', className)}>{children}</section>
}
```

```tsx
import { Link } from '@tanstack/react-router'
import { buttonVariants } from '#/components/ui/button'
import { siteContent } from '#/data/site-content'
import { cn } from '#/lib/utils'

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="page-shell flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link className="text-lg font-semibold tracking-tight text-slate-900" to="/">
            {siteContent.brandName}
          </Link>

          <a
            className={cn(buttonVariants({ size: 'lg' }), 'md:hidden')}
            href={siteContent.contact.phoneHref}
          >
            {siteContent.home.hero.primaryCtaLabel}
          </a>
        </div>

        <nav
          aria-label="Основна навигация"
          className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600"
        >
          {siteContent.navigation.map((item) => (
            <Link className="hover:text-slate-900" key={item.to} to={item.to}>
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          className={cn(buttonVariants({ size: 'lg' }), 'hidden md:inline-flex')}
          href={siteContent.contact.phoneHref}
        >
          {siteContent.home.hero.primaryCtaLabel}
        </a>
      </div>
    </header>
  )
}
```

```tsx
import { siteContent } from '#/data/site-content'

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/85">
      <div className="page-shell grid gap-4 py-8 md:grid-cols-2 md:items-start">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-900">{siteContent.brandName}</p>
          <p className="text-sm text-slate-600">{siteContent.contact.address}</p>
        </div>

        <div className="space-y-1 text-sm text-slate-600 md:text-right">
          {siteContent.contact.hours.map((row) => (
            <p key={row}>{row}</p>
          ))}
          <a className="font-semibold text-slate-900" href={siteContent.contact.phoneHref}>
            {siteContent.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </footer>
  )
}
```

```tsx
type PageHeroProps = {
  eyebrow?: string
  title: string
  description: string
}

export function PageHero({ eyebrow, title, description }: PageHeroProps) {
  return (
    <div className="max-w-3xl space-y-4">
      {eyebrow ? (
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-5xl">
        {title}
      </h1>
      <p className="text-lg leading-8 text-slate-600">{description}</p>
    </div>
  )
}
```

```tsx
import { buttonVariants } from '#/components/ui/button'
import { siteContent } from '#/data/site-content'
import { cn } from '#/lib/utils'

type CallCtaProps = {
  title: string
  description: string
}

export function CallCta({ title, description }: CallCtaProps) {
  return (
    <div className="site-panel rounded-3xl p-8">
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      <a
        className={cn(buttonVariants({ size: 'lg' }), 'mt-5')}
        href={siteContent.contact.phoneHref}
      >
        {siteContent.home.hero.primaryCtaLabel}
      </a>
    </div>
  )
}
```

```tsx
import { siteContent } from '#/data/site-content'

export function BusinessDetails() {
  return (
    <div className="space-y-2 text-sm text-slate-700">
      <p>{siteContent.contact.address}</p>
      {siteContent.contact.hours.map((row) => (
        <p key={row}>{row}</p>
      ))}
      <a className="font-semibold text-slate-900" href={siteContent.contact.phoneHref}>
        {siteContent.contact.phoneDisplay}
      </a>
    </div>
  )
}
```

```tsx
import { siteContent } from '#/data/site-content'

export function TrustPoints() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {siteContent.home.trustPoints.map((point) => (
        <article className="site-panel rounded-3xl p-6" key={point.title}>
          <h2 className="text-lg font-semibold text-slate-950">{point.title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{point.description}</p>
        </article>
      ))}
    </div>
  )
}
```

Append this block near the end of `src/styles.css` so it overrides the starter palette:

```css
@layer base {
  body {
    margin: 0;
    color: #172033;
    background: linear-gradient(180deg, #f9fbfd 0%, #eef3f8 55%, #e7edf5 100%);
  }

  a {
    text-decoration: none;
  }
}

.page-shell {
  width: min(1120px, calc(100% - 2rem));
  margin-inline: auto;
}

.site-panel {
  border: 1px solid rgba(203, 213, 225, 0.82);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
}
```

```tsx
import type { ReactNode } from 'react'
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import { SiteFooter } from '#/components/site/site-footer'
import { SiteHeader } from '#/components/site/site-header'
import { siteContent } from '#/data/site-content'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: `${siteContent.brandName} | ГТП и ремонти в Ловеч`,
      },
      {
        name: 'description',
        content:
          'Годишен технически преглед и автосервизни ремонти в Ловеч с бърз телефонен контакт.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <SiteHeader />
      <main className="pb-16 pt-8">
        <Outlet />
      </main>
      <SiteFooter />
    </>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="bg">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'TanStack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/components/site/site-header.test.tsx`

Expected: PASS with `1 passed`

## Task 3: Replace The Starter Homepage With The Actual Marketing Homepage

**Files:**
- Create: `public/images/lovech-service-shop.jpg`
- Create: `src/components/site/service-summary-grid.tsx`
- Create: `src/routes/index.test.tsx`
- Modify: `src/routes/index.tsx`

- [ ] **Step 1: Write the failing homepage test**

```tsx
import { render, screen } from '@testing-library/react'
import { HomePage } from '#/routes/index'
import { siteContent } from '#/data/site-content'

describe('HomePage', () => {
  it('shows the Lovech hero, the two service cards, trust points, and a phone CTA', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { name: siteContent.home.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('Годишен технически преглед')).toBeInTheDocument()
    expect(screen.getByText('Ремонти и поддръжка')).toBeInTheDocument()
    expect(screen.getByText('Професионално отношение')).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: siteContent.home.hero.primaryCtaLabel })[0],
    ).toHaveAttribute('href', siteContent.contact.phoneHref)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/routes/index.test.tsx`

Expected: FAIL because `HomePage` and the marketing content do not exist in `src/routes/index.tsx`

- [ ] **Step 3: Implement the homepage and add the approved shop image**

```bash
mkdir -p public/images
cp "/absolute/path/to/owner-approved-photo.jpg" public/images/lovech-service-shop.jpg
```

```tsx
import { siteContent } from '#/data/site-content'

export function ServiceSummaryGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {siteContent.home.serviceCards.map((service) => (
        <article className="site-panel rounded-3xl p-6" key={service.title}>
          <h2 className="text-xl font-semibold text-slate-950">{service.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
        </article>
      ))}
    </div>
  )
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { BusinessDetails } from '#/components/site/business-details'
import { CallCta } from '#/components/site/call-cta'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { ServiceSummaryGrid } from '#/components/site/service-summary-grid'
import { TrustPoints } from '#/components/site/trust-points'
import { siteContent } from '#/data/site-content'

export const Route = createFileRoute('/')({
  component: HomePage,
})

export function HomePage() {
  return (
    <div className="space-y-2">
      <Section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="space-y-6">
          <PageHero
            eyebrow={siteContent.home.hero.eyebrow}
            title={siteContent.home.hero.title}
            description={siteContent.home.hero.description}
          />
          <BusinessDetails />
        </div>

        <div className="site-panel overflow-hidden rounded-3xl p-2">
          <img
            alt="Сервизна база в Ловеч"
            className="h-full min-h-[320px] w-full rounded-[1.25rem] object-cover"
            src="/images/lovech-service-shop.jpg"
          />
        </div>
      </Section>

      <Section>
        <ServiceSummaryGrid />
      </Section>

      <Section>
        <TrustPoints />
      </Section>

      <Section>
        <CallCta
          title="Свържете се с нас за преглед или ремонт"
          description="Телефонният контакт е основният начин за записване и бързо уточняване на услугата."
        />
      </Section>
    </div>
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm vitest run src/routes/index.test.tsx`

Expected: PASS with `1 passed`

## Task 4: Add The `ГТП`, `Ремонти`, And `Контакти` Routes

**Files:**
- Create: `src/components/site/service-groups.tsx`
- Create: `src/components/site/map-embed.tsx`
- Create: `src/routes/service-routes.test.tsx`
- Create: `src/routes/kontakti.test.tsx`
- Create: `src/routes/gtp.tsx`
- Create: `src/routes/remonti.tsx`
- Create: `src/routes/kontakti.tsx`
- Modify: `src/routeTree.gen.ts` (generated by `pnpm generate-routes`; do not edit manually)

- [ ] **Step 1: Write the failing service and contact route tests**

```tsx
import { render, screen } from '@testing-library/react'
import { GtpPage } from '#/routes/gtp'
import { RepairsPage } from '#/routes/remonti'

describe('service routes', () => {
  it('renders the GTP explanation and process', () => {
    render(<GtpPage />)

    expect(
      screen.getByRole('heading', { name: 'Годишен технически преглед' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Обадете се за потвърждение на удобен час.'),
    ).toBeInTheDocument()
  })

  it('renders grouped repair categories', () => {
    render(<RepairsPage />)

    expect(
      screen.getByRole('heading', { name: 'Ремонти и поддръжка' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Диагностика и обслужване')).toBeInTheDocument()
    expect(screen.getByText('Спирачна система и ходова част')).toBeInTheDocument()
  })
})
```

```tsx
import { render, screen } from '@testing-library/react'
import { ContactPage } from '#/routes/kontakti'
import { siteContent } from '#/data/site-content'

describe('ContactPage', () => {
  it('renders address, hours, phone details, and the map iframe', () => {
    render(<ContactPage />)

    expect(screen.getByText(siteContent.contact.address)).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.hours[0])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: siteContent.contact.phoneDisplay })).toHaveAttribute(
      'href',
      siteContent.contact.phoneHref,
    )
    expect(screen.getByTitle('Карта до сервиза')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm vitest run src/routes/service-routes.test.tsx src/routes/kontakti.test.tsx`

Expected: FAIL with missing route modules for `#/routes/gtp`, `#/routes/remonti`, and `#/routes/kontakti`

- [ ] **Step 3: Implement the remaining routes and shared route components**

```tsx
type ServiceGroupsProps = {
  groups: readonly {
    title: string
    items: readonly string[]
  }[]
}

export function ServiceGroups({ groups }: ServiceGroupsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {groups.map((group) => (
        <article className="site-panel rounded-3xl p-6" key={group.title}>
          <h2 className="text-lg font-semibold text-slate-950">{group.title}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            {group.items.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  )
}
```

```tsx
import { siteContent } from '#/data/site-content'

export function MapEmbed() {
  return (
    <div className="site-panel overflow-hidden rounded-3xl p-2">
      <iframe
        className="h-[320px] w-full rounded-[1.25rem] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={siteContent.contact.mapEmbedUrl}
        title="Карта до сервиза"
      />
    </div>
  )
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { CallCta } from '#/components/site/call-cta'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { siteContent } from '#/data/site-content'

export const Route = createFileRoute('/gtp')({
  component: GtpPage,
})

export function GtpPage() {
  return (
    <div className="space-y-2">
      <Section>
        <PageHero
          title={siteContent.gtp.title}
          description={siteContent.gtp.description}
        />
      </Section>

      <Section>
        <ol className="site-panel space-y-4 rounded-3xl p-6 text-sm text-slate-700">
          {siteContent.gtp.steps.map((step, index) => (
            <li key={step}>
              <span className="mr-2 font-semibold text-blue-700">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <CallCta
          title={siteContent.gtp.ctaTitle}
          description={siteContent.gtp.ctaDescription}
        />
      </Section>
    </div>
  )
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { CallCta } from '#/components/site/call-cta'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { ServiceGroups } from '#/components/site/service-groups'
import { siteContent } from '#/data/site-content'

export const Route = createFileRoute('/remonti')({
  component: RepairsPage,
})

export function RepairsPage() {
  return (
    <div className="space-y-2">
      <Section>
        <PageHero
          title={siteContent.repairs.title}
          description={siteContent.repairs.description}
        />
      </Section>

      <Section>
        <ServiceGroups groups={siteContent.repairs.groups} />
      </Section>

      <Section>
        <CallCta
          title={siteContent.repairs.ctaTitle}
          description={siteContent.repairs.ctaDescription}
        />
      </Section>
    </div>
  )
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { BusinessDetails } from '#/components/site/business-details'
import { CallCta } from '#/components/site/call-cta'
import { MapEmbed } from '#/components/site/map-embed'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { siteContent } from '#/data/site-content'

export const Route = createFileRoute('/kontakti')({
  component: ContactPage,
})

export function ContactPage() {
  return (
    <div className="space-y-2">
      <Section className="space-y-6">
        <PageHero
          title={siteContent.contacts.title}
          description={siteContent.contacts.description}
        />
        <BusinessDetails />
      </Section>

      <Section>
        <MapEmbed />
      </Section>

      <Section>
        <CallCta
          title={siteContent.contacts.ctaTitle}
          description={siteContent.contacts.ctaDescription}
        />
      </Section>
    </div>
  )
}
```

- [ ] **Step 4: Run the tests and refresh the generated route tree**

Run: `pnpm generate-routes && pnpm vitest run src/routes/service-routes.test.tsx src/routes/kontakti.test.tsx`

Expected:
- `src/routeTree.gen.ts` updates automatically
- Vitest reports `3 passed`

## Task 5: Add Route-Level SEO, Canonicals, `robots.txt`, And `sitemap.xml`

**Files:**
- Create: `src/lib/seo.ts`
- Create: `src/lib/seo.test.ts`
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Modify: `src/routes/index.tsx`
- Modify: `src/routes/gtp.tsx`
- Modify: `src/routes/remonti.tsx`
- Modify: `src/routes/kontakti.tsx`

- [ ] **Step 1: Write the failing SEO helper test**

```ts
import { describe, expect, it } from 'vitest'
import { buildSeoHead } from '#/lib/seo'

describe('buildSeoHead', () => {
  it('builds a Bulgarian page title, canonical url, and Open Graph locale', () => {
    const seo = buildSeoHead({
      title: 'ГТП',
      description: 'Годишен технически преглед в Ловеч.',
      path: '/gtp',
    })

    expect(seo.title).toBe('ГТП | Автосервиз Ловеч')
    expect(seo.canonical).toBe('https://avtoserviz-lovech.bg/gtp')
    expect(
      seo.meta.some(
        (item) =>
          'property' in item &&
          item.property === 'og:locale' &&
          item.content === 'bg_BG',
      ),
    ).toBe(true)
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm vitest run src/lib/seo.test.ts`

Expected: FAIL with `Cannot find module '#/lib/seo'`

- [ ] **Step 3: Implement the SEO helper, route `head` functions, and static search files**

```ts
import { siteContent, type SitePath } from '#/data/site-content'

type BuildSeoHeadArgs = {
  title: string
  description: string
  path: SitePath
}

export function buildSeoHead({
  title,
  description,
  path,
}: BuildSeoHeadArgs) {
  const canonical = `${siteContent.siteUrl}${path === '/' ? '' : path}`
  const fullTitle = `${title} | ${siteContent.brandName}`

  return {
    title: fullTitle,
    canonical,
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:locale', content: 'bg_BG' },
      { property: 'og:url', content: canonical },
    ],
    links: [{ rel: 'canonical', href: canonical }],
  }
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { BusinessDetails } from '#/components/site/business-details'
import { CallCta } from '#/components/site/call-cta'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { ServiceSummaryGrid } from '#/components/site/service-summary-grid'
import { TrustPoints } from '#/components/site/trust-points'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'

const seo = buildSeoHead({
  title: siteContent.seo.home.title,
  description: siteContent.seo.home.description,
  path: '/',
})

export const Route = createFileRoute('/')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: HomePage,
})

export function HomePage() {
  return (
    <div className="space-y-2">
      <Section className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="space-y-6">
          <PageHero
            eyebrow={siteContent.home.hero.eyebrow}
            title={siteContent.home.hero.title}
            description={siteContent.home.hero.description}
          />
          <BusinessDetails />
        </div>

        <div className="site-panel overflow-hidden rounded-3xl p-2">
          <img
            alt="Сервизна база в Ловеч"
            className="h-full min-h-[320px] w-full rounded-[1.25rem] object-cover"
            src="/images/lovech-service-shop.jpg"
          />
        </div>
      </Section>

      <Section>
        <ServiceSummaryGrid />
      </Section>

      <Section>
        <TrustPoints />
      </Section>

      <Section>
        <CallCta
          title="Свържете се с нас за преглед или ремонт"
          description="Телефонният контакт е основният начин за записване и бързо уточняване на услугата."
        />
      </Section>
    </div>
  )
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { CallCta } from '#/components/site/call-cta'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'

const seo = buildSeoHead({
  title: siteContent.seo.gtp.title,
  description: siteContent.seo.gtp.description,
  path: '/gtp',
})

export const Route = createFileRoute('/gtp')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: GtpPage,
})

export function GtpPage() {
  return (
    <div className="space-y-2">
      <Section>
        <PageHero
          title={siteContent.gtp.title}
          description={siteContent.gtp.description}
        />
      </Section>

      <Section>
        <ol className="site-panel space-y-4 rounded-3xl p-6 text-sm text-slate-700">
          {siteContent.gtp.steps.map((step, index) => (
            <li key={step}>
              <span className="mr-2 font-semibold text-blue-700">{index + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <CallCta
          title={siteContent.gtp.ctaTitle}
          description={siteContent.gtp.ctaDescription}
        />
      </Section>
    </div>
  )
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { CallCta } from '#/components/site/call-cta'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { ServiceGroups } from '#/components/site/service-groups'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'

const seo = buildSeoHead({
  title: siteContent.seo.repairs.title,
  description: siteContent.seo.repairs.description,
  path: '/remonti',
})

export const Route = createFileRoute('/remonti')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: RepairsPage,
})

export function RepairsPage() {
  return (
    <div className="space-y-2">
      <Section>
        <PageHero
          title={siteContent.repairs.title}
          description={siteContent.repairs.description}
        />
      </Section>

      <Section>
        <ServiceGroups groups={siteContent.repairs.groups} />
      </Section>

      <Section>
        <CallCta
          title={siteContent.repairs.ctaTitle}
          description={siteContent.repairs.ctaDescription}
        />
      </Section>
    </div>
  )
}
```

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { BusinessDetails } from '#/components/site/business-details'
import { CallCta } from '#/components/site/call-cta'
import { MapEmbed } from '#/components/site/map-embed'
import { PageHero } from '#/components/site/page-hero'
import { Section } from '#/components/site/section'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'

const seo = buildSeoHead({
  title: siteContent.seo.contacts.title,
  description: siteContent.seo.contacts.description,
  path: '/kontakti',
})

export const Route = createFileRoute('/kontakti')({
  head: () => ({
    meta: seo.meta,
    links: seo.links,
  }),
  component: ContactPage,
})

export function ContactPage() {
  return (
    <div className="space-y-2">
      <Section className="space-y-6">
        <PageHero
          title={siteContent.contacts.title}
          description={siteContent.contacts.description}
        />
        <BusinessDetails />
      </Section>

      <Section>
        <MapEmbed />
      </Section>

      <Section>
        <CallCta
          title={siteContent.contacts.ctaTitle}
          description={siteContent.contacts.ctaDescription}
        />
      </Section>
    </div>
  )
}
```

```text
User-agent: *
Allow: /

Sitemap: https://avtoserviz-lovech.bg/sitemap.xml
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://avtoserviz-lovech.bg/</loc>
  </url>
  <url>
    <loc>https://avtoserviz-lovech.bg/gtp</loc>
  </url>
  <url>
    <loc>https://avtoserviz-lovech.bg/remonti</loc>
  </url>
  <url>
    <loc>https://avtoserviz-lovech.bg/kontakti</loc>
  </url>
</urlset>
```

- [ ] **Step 4: Run the SEO test and a production build**

Run: `pnpm vitest run src/lib/seo.test.ts && pnpm build`

Expected:
- `1 passed` from the SEO helper test
- TanStack Start build succeeds with the four public routes

## Task 6: Add Browser Smoke Tests And Final Verification Hooks

**Files:**
- Modify: `package.json`
- Modify: `src/components/site/site-header.tsx`
- Modify: `src/components/site/map-embed.tsx`
- Create: `playwright.config.ts`
- Create: `e2e/site-smoke.spec.ts`

- [ ] **Step 1: Write the failing smoke test and install Playwright**

```bash
pnpm add -D @playwright/test
```

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
```

```ts
import { expect, test } from '@playwright/test'

test('homepage exposes the main call CTA and the site navigation', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByTestId('site-nav')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Обадете се' }).first()).toHaveAttribute(
    'href',
    /tel:/,
  )
})

test('contact page exposes the map container and working hours', async ({ page }) => {
  await page.goto('/kontakti')

  await expect(page.getByText(/Понеделник - Петък/)).toBeVisible()
  await expect(page.getByTestId('contact-map')).toBeVisible()
})
```

- [ ] **Step 2: Run the smoke test to verify it fails**

Run: `pnpm exec playwright install chromium && pnpm exec playwright test e2e/site-smoke.spec.ts`

Expected: FAIL because `data-testid="site-nav"` and `data-testid="contact-map"` do not exist yet

- [ ] **Step 3: Add the test hooks and update the package scripts**

Update the `scripts` block in `package.json` to:

```json
{
  "scripts": {
    "dev": "vite dev --port 3000",
    "generate-routes": "tsr generate",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "lint": "eslint . --max-warnings=0",
    "format": "prettier --write . && eslint --fix",
    "check": "prettier --check ."
  }
}
```

Add the test id to the navigation element in `src/components/site/site-header.tsx`:

```tsx
<nav
  aria-label="Основна навигация"
  className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600"
  data-testid="site-nav"
>
  {siteContent.navigation.map((item) => (
    <Link className="hover:text-slate-900" key={item.to} to={item.to}>
      {item.label}
    </Link>
  ))}
</nav>
```

Add the test id to the map wrapper in `src/components/site/map-embed.tsx`:

```tsx
import { siteContent } from '#/data/site-content'

export function MapEmbed() {
  return (
    <div
      className="site-panel overflow-hidden rounded-3xl p-2"
      data-testid="contact-map"
    >
      <iframe
        className="h-[320px] w-full rounded-[1.25rem] border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={siteContent.contact.mapEmbedUrl}
        title="Карта до сервиза"
      />
    </div>
  )
}
```

- [ ] **Step 4: Run the smoke test and the final project verification**

Run: `pnpm generate-routes && pnpm test:e2e && pnpm lint && pnpm test && pnpm build`

Expected:
- `src/routeTree.gen.ts` is refreshed
- Playwright reports `2 passed`
- lint completes with no errors
- all Vitest tests pass
- TanStack Start build succeeds

## Manual Verification Checklist

- Replace the sample phone, address, working hours, and domain in `src/data/site-content.ts` with the owner-approved values before release
- If the real domain differs from `https://avtoserviz-lovech.bg`, update `src/data/site-content.ts`, `public/robots.txt`, and `public/sitemap.xml` together
- Replace `public/images/lovech-service-shop.jpg` with the real shop image before release
- Load `/`, `/gtp`, `/remonti`, and `/kontakti` on desktop and mobile widths
- Confirm the phone CTA is visible in the header on both mobile and desktop
- Confirm the homepage presents both `ГТП` and repairs clearly above the fold
- Confirm the `ГТП` page reads like a dedicated local-search page for Lovech
- Confirm the `Ремонти` page stays concise and grouped instead of turning into a huge service list
- Confirm the contact page remains useful if the map iframe is blocked or slow, because the text address and hours still show
- Confirm the browser title and description change correctly on each route

## Self-Review

- **Spec coverage:** Task 1 sets up the content model and Bulgarian copy source. Task 2 builds the shared shell, phone-first header, and global visual direction. Task 3 replaces the starter homepage with the actual Lovech marketing homepage. Task 4 adds the dedicated `ГТП`, `Ремонти`, and `Контакти` routes plus the graceful map pattern. Task 5 covers metadata, canonical URLs, `robots.txt`, and sitemap output. Task 6 adds browser-level smoke verification and final project checks.
- **Placeholder scan:** The plan is executable against the current TanStack Start codebase. The only values that still require owner confirmation are the sample phone/address/hours/domain entries in `src/data/site-content.ts` and the matching values in the static SEO files.
- **Type consistency:** The route paths use the same `SitePath` union everywhere, the navigation items point to the same four paths used by the route files, and the SEO helper reads from the same `siteContent` object the pages use.
