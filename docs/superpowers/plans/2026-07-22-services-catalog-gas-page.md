# Services Catalog + `/gaz` Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a centralized 15-service catalog, a new `/gaz` nav page with gas contact routing, grouped `/remonti` service UI with expandable details, and home page updates surfacing gas alongside ГТП and ремонти.

**Architecture:** Store all services in `src/data/services-catalog.ts`; validate at module load via `assertValidServiceCatalog()` in `src/lib/services.ts`. Reusable UI: `ServiceExpandableItem` → `ServiceGroupSection` → `ServiceCatalog`. Pages filter catalog by `page` field. Extend `ContactContext` with `'gas'` for hero/CTA on `/gaz` only; header/footer stay on default service line.

**Tech Stack:** TanStack Start, React 19, TanStack Router, Vitest, Playwright, Vite, pnpm, Lucide React

**Spec:** [`docs/superpowers/specs/2026-07-22-services-catalog-gas-page-design.md`](../specs/2026-07-22-services-catalog-gas-page-design.md)

## Global Constraints

- **15 services** total: 3 `gaz`, 1 `gtp`, 11 `remonti` (3 groups)
- Nav order: Начало · ГТП · **Газови системи** · Ремонти · Контакти
- **`ContactContext`:** `default`→service, `gtp`→inspections, **`gas`→gas**, `remonti`→service
- Gas line: **`+359887816055`** / **`0887 816 055`**
- Home hero title: **`ГТП, сервиз и газови системи в Ловеч`**
- Home stat[2]: **`{ value: 'LPG/CNG', label: 'Монтаж и сервиз на газ', icon: 'fuel' }`**
- Home sections: ГТП · Ремонти · **Газ** (drop „Защо да изберете нас”; delete `homeTrustPoints`)
- `/gaz` CtaBand: **`Обадете се за газови системи`** (page-specific; shared band unchanged elsewhere)
- Flat catalog headings: `/gaz` → **„Газови услуги”**; `/gtp` → **„Годишен технически преглед — подробности”**
- `details` expand label: **„Повече информация”**; bullet lines stay plain `<p>`, not `<ul>`
- Header/footer on `/gaz`: still **service** line (0876 689 736)
- Sitemap: **5 paths** including `/gaz`
- `seo.gaz.title`: **„Газови системи”**
- `seo.home.description`: mentions **газови системи**
- Quality gate: **`pnpm test`** and **`pnpm build`** pass

---

## File map

| File | Responsibility |
|------|----------------|
| `src/data/services-catalog.ts` | All 15 `Service` entries + 3 `ServiceGroupDef` groups |
| `src/lib/services.ts` | `getServicesForPage`, `getRemontiGroupsWithServices`, `assertValidServiceCatalog` |
| `src/data/site-content.ts` | Types, nav, home, pages, SEO; imports catalog; calls validation at load |
| `src/lib/contact-context.ts` | Add `gas` case |
| `src/components/site/service-expandable-item.tsx` | Title, summary, optional `<details>` |
| `src/components/site/service-group-section.tsx` | Group h2 + intro + service list |
| `src/components/site/service-catalog.tsx` | Flat or grouped wrapper + section heading |
| `src/components/site/stat-icon.tsx` | Add Lucide `Fuel` for `fuel` icon |
| `src/pages/gaz-page.tsx` | Hero → Reveal → Catalog → CtaBand |
| `src/routes/gaz.tsx` | Route + SEO head |
| `src/pages/gtp-page.tsx` | Add catalog after split sections |
| `src/pages/remonti-page.tsx` | Replace split sections with grouped catalog |
| `src/pages/home-page.tsx` | Third section link; 3 service cards |
| `site.defaults.json` | Add `publicPaths` for sitemap script |
| `scripts/generate-seo-files.mjs` | Read `publicPaths` from defaults JSON |

---

### Task 1: Service catalog helpers + validation

**Files:**
- Create: `src/lib/services.ts`
- Create: `src/lib/services.test.ts`
- Create: `src/data/services-catalog.ts` (minimal stub for tests)
- Test: `src/lib/services.test.ts`

**Interfaces:**
- Produces: `getServicesForPage(page: ServicePage): Service[]`
- Produces: `getRemontiGroupsWithServices(): Array<ServiceGroupDef & { services: Service[] }>`
- Produces: `assertValidServiceCatalog(services: readonly Service[], groups: readonly ServiceGroupDef[]): void`

- [ ] **Step 1: Create minimal catalog stub**

Create `src/data/services-catalog.ts`:

```ts
import type { Service, ServiceGroupDef } from '#/data/site-content'

export const servicesCatalog = [] as const satisfies readonly Service[]
export const remontiGroups = [] as const satisfies readonly ServiceGroupDef[]
```

*(Types will be added in Task 2; temporarily duplicate minimal types in stub or add types first — prefer adding types to `site-content.ts` in Step 2 before importing.)*

- [ ] **Step 2: Write failing tests**

Create `src/lib/services.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Service, ServiceGroupDef } from '#/data/site-content'
import {
  assertValidServiceCatalog,
  getRemontiGroupsWithServices,
  getServicesForPage,
} from '#/lib/services'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'

const sampleServices = [
  {
    id: 'a',
    title: 'A',
    summary: 'Summary A',
    page: 'gaz',
  },
  {
    id: 'b',
    title: 'B',
    summary: 'Summary B',
    page: 'remonti',
    groupId: 'g1',
  },
] satisfies Service[]

const sampleGroups = [
  { id: 'g1', title: 'G1', intro: 'Intro', serviceIds: ['b'] },
] satisfies ServiceGroupDef[]

describe('services helpers', () => {
  it('filters services by page preserving catalog order', () => {
    expect(getServicesForPage('gaz', sampleServices)).toEqual([sampleServices[0]])
  })

  it('resolves remonti groups with services in serviceIds order', () => {
    const groups = getRemontiGroupsWithServices(sampleServices, sampleGroups)
    expect(groups).toHaveLength(1)
    expect(groups[0]?.services.map((s) => s.id)).toEqual(['b'])
  })

  it('throws when a group references an unknown service id', () => {
    expect(() =>
      assertValidServiceCatalog(sampleServices, [
        { id: 'g1', title: 'G1', intro: 'Intro', serviceIds: ['missing'] },
      ]),
    ).toThrow(/unknown service id/i)
  })

  it('validates the real catalog once populated', () => {
    expect(() => assertValidServiceCatalog(servicesCatalog, remontiGroups)).not.toThrow()
    expect(servicesCatalog).toHaveLength(15)
  })
})
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test src/lib/services.test.ts`

Expected: FAIL — module `#/lib/services` not found

- [ ] **Step 4: Implement helpers**

Create `src/lib/services.ts`:

```ts
import type { Service, ServiceGroupDef, ServicePage } from '#/data/site-content'

export function getServicesForPage(
  page: ServicePage,
  services: readonly Service[],
): Service[] {
  return services.filter((service) => service.page === page)
}

export function getRemontiGroupsWithServices(
  services: readonly Service[],
  groups: readonly ServiceGroupDef[],
): Array<ServiceGroupDef & { services: Service[] }> {
  const byId = new Map(services.map((service) => [service.id, service]))

  return groups.map((group) => ({
    ...group,
    services: group.serviceIds.map((id) => {
      const service = byId.get(id)
      if (!service) {
        throw new Error(`Missing service for group ${group.id}: ${id}`)
      }
      return service
    }),
  }))
}

export function assertValidServiceCatalog(
  services: readonly Service[],
  groups: readonly ServiceGroupDef[],
): void {
  const ids = services.map((s) => s.id)
  const uniqueIds = new Set(ids)
  if (uniqueIds.size !== ids.length) {
    throw new Error('Duplicate service id in catalog')
  }

  const byId = new Map(services.map((s) => [s.id, s]))
  const remontiServices = services.filter((s) => s.page === 'remonti')
  const assigned = new Set<string>()

  for (const group of groups) {
    for (const serviceId of group.serviceIds) {
      if (!byId.has(serviceId)) {
        throw new Error(`Group ${group.id} references unknown service id: ${serviceId}`)
      }
      if (assigned.has(serviceId)) {
        throw new Error(`Service ${serviceId} assigned to multiple groups`)
      }
      assigned.add(serviceId)
    }
  }

  for (const service of remontiServices) {
    if (!service.groupId) {
      throw new Error(`Remonti service ${service.id} missing groupId`)
    }
    if (!groups.some((g) => g.id === service.groupId)) {
      throw new Error(`Remonti service ${service.id} has unknown groupId ${service.groupId}`)
    }
    if (!assigned.has(service.id)) {
      throw new Error(`Remonti service ${service.id} not listed in any group`)
    }
  }

  if (assigned.size !== remontiServices.length) {
    throw new Error('Remonti group service count mismatch')
  }
}
```

- [ ] **Step 5: Run test — catalog length test fails until Task 2**

Run: `pnpm test src/lib/services.test.ts`

Expected: first 3 tests PASS; catalog length test FAIL (0 !== 15) — OK until Task 2

- [ ] **Step 6: Commit**

```bash
git add src/lib/services.ts src/lib/services.test.ts src/data/services-catalog.ts
git commit -m "feat: add service catalog helpers and validation"
```

---

### Task 2: Full services catalog + site-content types

**Files:**
- Modify: `src/data/site-content.ts`
- Modify: `src/data/services-catalog.ts`
- Modify: `src/data/site-content.test.ts`
- Test: `src/data/site-content.test.ts`, `src/lib/services.test.ts`

**Interfaces:**
- Produces: `Service`, `ServiceGroupDef`, `ServicePage`, updated `SitePath`, `ContactContext`, `StatIcon`
- Produces: `servicesCatalog` (15 entries), `remontiGroups` (3 entries)
- Produces: `siteContent.navigation` with `/gaz`; `assertValidServiceCatalog` called at bottom of site-content or catalog module

- [ ] **Step 1: Add types to site-content.ts**

Add/update exports at top of `src/data/site-content.ts`:

```ts
export type SitePath = '/' | '/gtp' | '/gaz' | '/remonti' | '/kontakti'

export type ServicePage = 'gtp' | 'gaz' | 'remonti'

export type Service = {
  id: string
  title: string
  summary: string
  details?: string
  page: ServicePage
  groupId?: string
}

export type ServiceGroupDef = {
  id: string
  title: string
  intro: string
  serviceIds: readonly string[]
}

export type ContactContext = 'default' | 'gtp' | 'gaz' | 'remonti'

export type StatIcon = 'clipboard-check' | 'calendar-days' | 'fuel'
```

Remove old `ServiceGroup` type with `items: string[]`.

- [ ] **Step 2: Write failing site-content tests**

Add to `src/data/site-content.test.ts`:

```ts
import { servicesCatalog, remontiGroups } from '#/data/services-catalog'

it('exposes five public routes including gaz', () => {
  expect(siteContent.navigation.map((item) => item.to)).toEqual([
    '/',
    '/gtp',
    '/gaz',
    '/remonti',
    '/kontakti',
  ])
})

it('defines fifteen services with correct page counts', () => {
  expect(servicesCatalog).toHaveLength(15)
  expect(servicesCatalog.filter((s) => s.page === 'gaz')).toHaveLength(3)
  expect(servicesCatalog.filter((s) => s.page === 'gtp')).toHaveLength(1)
  expect(servicesCatalog.filter((s) => s.page === 'remonti')).toHaveLength(11)
  expect(remontiGroups).toHaveLength(3)
})

it('uses fuel stat instead of map-pin on home', () => {
  expect(siteContent.pages.home.stats[2]).toMatchObject({
    value: 'LPG/CNG',
    label: 'Монтаж и сервиз на газ',
    icon: 'fuel',
  })
})

it('does not export homeTrustPoints', () => {
  expect('homeTrustPoints' in siteContent.home).toBe(false)
})
```

Update existing nav test expectation from 4 to 5 routes.

- [ ] **Step 3: Populate services-catalog.ts**

Create `src/data/services-catalog.ts` with **all 15 services** and **3 groups**.

**Service IDs (must all exist):**

| ID | page | groupId |
|----|------|---------|
| `agu-montazh-remont` | gaz | — |
| `fabrichni-lpg-cng` | gaz | — |
| `parvonachalen-pregled-gaz` | gaz | — |
| `godishen-tehnicheski-pregled` | gtp | — |
| `kompyutarna-diagnostika` | remonti | diagnostics-maintenance |
| `smqna-masla-filtri` | remonti | diagnostics-maintenance |
| `proverka-svetlini` | remonti | diagnostics-maintenance |
| `remont-dizel-benzin` | remonti | engine-drivetrain |
| `shlaif-cilindrovi-glavi` | remonti | engine-drivetrain |
| `remont-hodova-chast` | remonti | engine-drivetrain |
| `smqna-angrenaj` | remonti | engine-drivetrain |
| `reglaz-mostove` | remonti | engine-drivetrain |
| `smqna-nakladki` | remonti | brakes-comfort |
| `remont-spirachna-sistema` | remonti | brakes-comfort |
| `klimatichna-otopliteltna` | remonti | brakes-comfort |

Copy **`title`**, **`summary`**, and **`details`** (when present) **verbatim** from spec section **Content catalog**. Group intros from spec **Group intros (`/remonti`)** table.

`remontiGroups` serviceIds arrays (order matters):

```ts
export const remontiGroups = [
  {
    id: 'diagnostics-maintenance',
    title: 'Диагностика и поддръжка',
    intro: 'Редовна поддръжка и точна диагностика — основата на надеждната кола.',
    serviceIds: ['kompyutarna-diagnostika', 'smqna-masla-filtri', 'proverka-svetlini'],
  },
  {
    id: 'engine-drivetrain',
    title: 'Двигател, ходова част и управление',
    intro:
      'От двигателя до окачването и реглажа — грижим се за механиката, с която сте на пътя всеки ден.',
    serviceIds: [
      'remont-dizel-benzin',
      'shlaif-cilindrovi-glavi',
      'remont-hodova-chast',
      'smqna-angrenaj',
      'reglaz-mostove',
    ],
  },
  {
    id: 'brakes-comfort',
    title: 'Спирачки и комфорт',
    intro: 'Безопасност и комфорт — спирачки, накладки и климатична система.',
    serviceIds: ['smqna-nakladki', 'remont-spirachna-sistema', 'klimatichna-otopliteltna'],
  },
] as const satisfies readonly ServiceGroupDef[]
```

At end of file:

```ts
import { assertValidServiceCatalog } from '#/lib/services'

assertValidServiceCatalog(servicesCatalog, remontiGroups)
```

- [ ] **Step 4: Update site-content.ts home + nav + pages + seo**

Key changes:

```ts
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'

const imageAlts = {
  shop: 'Автосервиз в Ловеч — работилница',
  gtp: 'Годишен технически преглед в автосервиз',
  repairs: 'Ремонт и поддръжка на автомобил в сервиз',
  gas: 'Монтаж и сервиз на газова уредба в автосервиз',
} as const

const homeHero = {
  eyebrow: 'Stefi Auto Gas',
  title: 'ГТП, сервиз и газови системи в Ловеч',
  description:
    'Годишен преглед, ремонти и газови системи — на едно място в Ловеч. Обадете се и ще ви кажем кога да дойдете.',
  // ...
} satisfies HeroContent

const homeServiceCards = [
  { title: 'Годишен технически преглед', description: '...' }, // keep existing
  { title: 'Ремонти и поддръжка', description: '...' }, // keep existing
  {
    title: 'Газови системи',
    description:
      'Монтаж, ремонт и преглед на LPG/CNG газови уредби — намалете разходите за гориво и минете необходимите прегледи при нас.',
  },
] satisfies ServiceCard[]

// DELETE homeTrustPoints entirely

// pages.home.sections — build from all 3 homeServiceCards only (remove trust section)
sections: [
  { title: homeServiceCards[0].title, description: homeServiceCards[0].description, image: '/images/gtp-section.png', imageAlt: imageAlts.gtp },
  { title: homeServiceCards[1].title, description: homeServiceCards[1].description, image: '/images/repairs-section.png', imageAlt: imageAlts.repairs },
  { title: homeServiceCards[2].title, description: homeServiceCards[2].description, image: '/images/repairs-section.png', imageAlt: imageAlts.gas },
] satisfies SplitSectionContent[],

stats: [
  { value: 'ГТП', label: 'Годишен технически преглед', icon: 'clipboard-check' },
  { value: 'Пн–Пт', label: '9:00–18:00', icon: 'calendar-days' },
  { value: 'LPG/CNG', label: 'Монтаж и сервиз на газ', icon: 'fuel' },
] satisfies StatItem[],

navigation: [
  { to: '/', label: 'Начало' },
  { to: '/gtp', label: 'ГТП' },
  { to: '/gaz', label: 'Газови системи' },
  { to: '/remonti', label: 'Ремонти' },
  { to: '/kontakti', label: 'Контакти' },
] satisfies NavigationItem[],

// pages.gaz
gaz: {
  hero: {
    title: 'Газови системи',
    description:
      'Монтаж, ремонт и преглед на LPG/CNG газови уредби в Ловеч. Обадете се на линията за газови системи и ще ви насочим.',
    image: '/images/repairs-section.png',
    imageAlt: imageAlts.gas,
    primaryCtaLabel: 'Обадете се',
  },
  sections: [] satisfies SplitSectionContent[],
  ctaBand: {
    title: 'Обадете се за газови системи',
    description:
      'Монтаж, ремонт или преглед на LPG/CNG — направете едно обаждане на линията за газови системи.',
  },
},

// repairs.groups → import remontiGroups; remove old placeholder groups
repairs: {
  title: 'Ремонти и поддръжка',
  description: '...', // keep existing hero description
  groups: remontiGroups,
},

// pages record type includes gaz; remonti.sections removed (hero + ctaBand only)
pages: {
  home: { /* ... */ },
  gtp: { /* keep process sections */ },
  gaz: { /* as above */ },
  remonti: {
    hero: { /* existing */ },
    sections: [] satisfies SplitSectionContent[],
    ctaBand: sharedCtaBand,
  },
  kontakti: { /* unchanged */ },
} satisfies Record<'home' | 'gtp' | 'gaz' | 'remonti' | 'kontakti', PageContent>,

seo: {
  home: {
    title: 'Начало',
    description:
      'ГТП, автосервиз и газови системи в Ловеч — Stefi Auto Gas. Запишете час по телефона.',
  },
  gaz: {
    title: 'Газови системи',
    description:
      'Монтаж, ремонт и първоначален преглед на LPG/CNG газови уредби в Ловеч — Stefi Auto Gas.',
  },
  // gtp, repairs, contacts unchanged except home above
} satisfies Record<'home' | 'gtp' | 'gaz' | 'repairs' | 'contacts', SeoEntry>,

// siteContent export: remove home.trustPoints
home: {
  hero: homeHero,
  serviceCards: homeServiceCards,
},
```

Export `servicesCatalog` re-export from `siteContent` if convenient for pages:

```ts
export { servicesCatalog, remontiGroups } from '#/data/services-catalog'
```

- [ ] **Step 5: Run tests**

Run: `pnpm test src/data/site-content.test.ts src/lib/services.test.ts`

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/site-content.ts src/data/services-catalog.ts src/data/site-content.test.ts
git commit -m "feat: add 15-service catalog and update site content for gaz"
```

---

### Task 3: Gas contact context

**Files:**
- Modify: `src/lib/contact-context.ts`
- Modify: `src/lib/contact-context.test.ts`

- [ ] **Step 1: Write failing test**

Add to `src/lib/contact-context.test.ts`:

```ts
it('maps gas context to the gas contact line', () => {
  const line = resolveContactLine('gas')
  expect(line.id).toBe('gas')
  expect(line.phoneE164).toBe('+359887816055')
  expect(line.phoneDisplay).toBe('0887 816 055')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/contact-context.test.ts`

Expected: FAIL — `gas` not handled in switch

- [ ] **Step 3: Add gas case**

```ts
case 'gas':
  return findLineById('gas')
```

- [ ] **Step 4: Run test**

Run: `pnpm test src/lib/contact-context.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/contact-context.ts src/lib/contact-context.test.ts
git commit -m "feat: add gas contact context for gaz page CTAs"
```

---

### Task 4: ServiceExpandableItem component

**Files:**
- Create: `src/components/site/service-expandable-item.tsx`
- Create: `src/components/site/service-expandable-item.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
import { render, screen } from '@testing-library/react'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'

describe('ServiceExpandableItem', () => {
  it('renders title and summary without expand when details omitted', () => {
    render(
      <ServiceExpandableItem
        service={{ id: 'x', title: 'Title X', summary: 'Summary X', page: 'gaz' }}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Title X' })).toBeInTheDocument()
    expect(screen.getByText('Summary X')).toBeInTheDocument()
    expect(screen.queryByText('Повече информация')).not.toBeInTheDocument()
  })

  it('renders details expand with paragraphs split on blank lines', () => {
    render(
      <ServiceExpandableItem
        service={{
          id: 'y',
          title: 'Title Y',
          summary: 'Summary Y',
          page: 'gaz',
          details: 'Para one.\n\n· Bullet line',
        }}
      />,
    )
    expect(screen.getByText('Повече информация')).toBeInTheDocument()
    expect(screen.getByText('Para one.')).toBeInTheDocument()
    expect(screen.getByText('· Bullet line')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify FAIL**

Run: `pnpm test src/components/site/service-expandable-item.test.tsx`

- [ ] **Step 3: Implement component**

```tsx
import type { Service } from '#/data/site-content'

type ServiceExpandableItemProps = {
  service: Service
}

function splitDetails(details: string): string[] {
  return details.split('\n\n').filter((part) => part.trim().length > 0)
}

export function ServiceExpandableItem({ service }: ServiceExpandableItemProps) {
  const titleId = `service-${service.id}`

  return (
    <li className="space-y-3">
      <h3 id={titleId} className="text-xl font-bold text-[#0a0a0a]">
        {service.title}
      </h3>
      <p className="text-base leading-7 text-[#525252]">{service.summary}</p>
      {service.details ? (
        <details className="group">
          <summary className="cursor-pointer text-sm font-bold text-[#1e3a8a] hover:text-[#1e40af]">
            Повече информация
          </summary>
          <div aria-labelledby={titleId} className="mt-3 space-y-3">
            {splitDetails(service.details).map((paragraph) => (
              <p key={paragraph} className="text-base leading-7 text-[#525252]">
                {paragraph}
              </p>
            ))}
          </div>
        </details>
      ) : null}
    </li>
  )
}
```

- [ ] **Step 4: Run test — verify PASS**

- [ ] **Step 5: Commit**

```bash
git add src/components/site/service-expandable-item.tsx src/components/site/service-expandable-item.test.tsx
git commit -m "feat: add ServiceExpandableItem with native details expand"
```

---

### Task 5: ServiceCatalog + ServiceGroupSection

**Files:**
- Create: `src/components/site/service-group-section.tsx`
- Create: `src/components/site/service-catalog.tsx`
- Create: `src/components/site/service-catalog.test.tsx`

- [ ] **Step 1: Write failing tests**

```tsx
import { render, screen } from '@testing-library/react'
import { ServiceCatalog } from '#/components/site/service-catalog'

const flatServices = [
  { id: 'a', title: 'Service A', summary: 'Sum A', page: 'gaz' as const },
]

const grouped = [
  {
    id: 'g1',
    title: 'Group One',
    intro: 'Group intro',
    serviceIds: ['b'],
    services: [{ id: 'b', title: 'Service B', summary: 'Sum B', page: 'remonti' as const, groupId: 'g1' }],
  },
]

describe('ServiceCatalog', () => {
  it('renders flat heading and services', () => {
    render(<ServiceCatalog heading="Газови услуги" services={flatServices} variant="flat" />)
    expect(screen.getByRole('heading', { name: 'Газови услуги', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Service A', level: 3 })).toBeInTheDocument()
  })

  it('renders grouped sections with h2 per group', () => {
    render(<ServiceCatalog groups={grouped} variant="grouped" />)
    expect(screen.getByRole('heading', { name: 'Group One', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Group intro')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test — verify FAIL**

- [ ] **Step 3: Implement ServiceGroupSection**

```tsx
import type { Service, ServiceGroupDef } from '#/data/site-content'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'

type ServiceGroupSectionProps = ServiceGroupDef & { services: Service[] }

export function ServiceGroupSection({ title, intro, services }: ServiceGroupSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">{title}</h2>
      <p className="max-w-prose text-base leading-7 text-[#525252]">{intro}</p>
      <ul className="space-y-8">
        {services.map((service) => (
          <ServiceExpandableItem key={service.id} service={service} />
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Implement ServiceCatalog**

```tsx
import type { Service, ServiceGroupDef } from '#/data/site-content'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'
import { ServiceGroupSection } from '#/components/site/service-group-section'

type FlatProps = {
  variant: 'flat'
  heading: string
  services: Service[]
}

type GroupedProps = {
  variant: 'grouped'
  groups: Array<ServiceGroupDef & { services: Service[] }>
}

export type ServiceCatalogProps = FlatProps | GroupedProps

export function ServiceCatalog(props: ServiceCatalogProps) {
  return (
    <section className="px-6 py-12 lg:px-10 lg:py-16">
      {props.variant === 'flat' ? (
        <>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
            {props.heading}
          </h2>
          <ul className="mt-8 space-y-8">
            {props.services.map((service) => (
              <ServiceExpandableItem key={service.id} service={service} />
            ))}
          </ul>
        </>
      ) : (
        <div className="space-y-16">
          {props.groups.map((group) => (
            <ServiceGroupSection key={group.id} {...group} />
          ))}
        </div>
      )}
    </section>
  )
}
```

- [ ] **Step 5: Run tests — verify PASS**

- [ ] **Step 6: Commit**

```bash
git add src/components/site/service-group-section.tsx src/components/site/service-catalog.tsx src/components/site/service-catalog.test.tsx
git commit -m "feat: add ServiceCatalog and ServiceGroupSection"
```

---

### Task 6: StatIcon fuel + home page links

**Files:**
- Modify: `src/components/site/stat-icon.tsx`
- Modify: `src/pages/home-page.tsx`
- Modify: `src/routes/index.test.tsx`

- [ ] **Step 1: Update stat-icon.tsx**

```tsx
import { CalendarDays, ClipboardCheck, Fuel } from 'lucide-react'

const iconMap = {
  'clipboard-check': ClipboardCheck,
  'calendar-days': CalendarDays,
  fuel: Fuel,
} as const
```

Remove `map-pin` import and entry.

- [ ] **Step 2: Update home-page.tsx links**

```tsx
const homeSectionLinks = [
  { label: 'Повече за ГТП', href: '/gtp' },
  { label: 'Повече за ремонти', href: '/remonti' },
  { label: 'Повече за газ', href: '/gaz' },
] as const
```

Ensure `pages.home.sections` has exactly 3 entries (from Task 2).

- [ ] **Step 3: Update index.test.tsx**

Replace trust section assertion:

```tsx
expect(screen.getByRole('heading', { name: 'Газови системи' })).toBeInTheDocument()
expect(screen.queryByRole('heading', { name: 'Защо да изберете нас' })).not.toBeInTheDocument()
expect(screen.getByRole('link', { name: 'Повече за газ' })).toHaveAttribute('href', '/gaz')
```

- [ ] **Step 4: Run tests**

Run: `pnpm test src/routes/index.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/site/stat-icon.tsx src/pages/home-page.tsx src/routes/index.test.tsx
git commit -m "feat: update home page for gas section and fuel stat icon"
```

---

### Task 7: `/gaz` route and service pages

**Files:**
- Create: `src/routes/gaz.tsx`
- Create: `src/pages/gaz-page.tsx`
- Modify: `src/pages/gtp-page.tsx`
- Modify: `src/pages/remonti-page.tsx`
- Modify: `src/routes/service-routes.test.tsx`
- Generated: `src/routeTree.gen.ts`

- [ ] **Step 1: Create gaz-page.tsx**

```tsx
import { CtaBand } from '#/components/site/cta-band'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { ServiceCatalog } from '#/components/site/service-catalog'
import { servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getServicesForPage } from '#/lib/services'

export function GazPage() {
  const { hero, ctaBand } = siteContent.pages.gaz
  const services = getServicesForPage('gaz', servicesCatalog)

  return (
    <>
      <HeroSection contactContext="gas" content={hero} />
      <Reveal>
        <ServiceCatalog heading="Газови услуги" services={services} variant="flat" />
      </Reveal>
      <Reveal>
        <CtaBand contactContext="gas" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
```

- [ ] **Step 2: Create gaz.tsx route**

Mirror `src/routes/gtp.tsx`:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'
import { buildSeoHead } from '#/lib/seo'
import { GazPage } from '#/pages/gaz-page'

const seo = buildSeoHead({
  title: siteContent.seo.gaz.title,
  description: siteContent.seo.gaz.description,
  path: '/gaz',
})

export const Route = createFileRoute('/gaz')({
  head: () => ({ meta: seo.meta, links: seo.links }),
  component: GazPage,
})
```

- [ ] **Step 3: Update gtp-page.tsx**

After split sections, add:

```tsx
import { ServiceCatalog } from '#/components/site/service-catalog'
import { servicesCatalog } from '#/data/services-catalog'
import { getServicesForPage } from '#/lib/services'

// inside component:
const gtpServices = getServicesForPage('gtp', servicesCatalog)

// after sections.map(...):
<Reveal>
  <ServiceCatalog
    heading="Годишен технически преглед — подробности"
    services={gtpServices}
    variant="flat"
  />
</Reveal>
```

- [ ] **Step 4: Update remonti-page.tsx**

Replace `sections.map` with grouped catalog:

```tsx
import { ServiceCatalog } from '#/components/site/service-catalog'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { getRemontiGroupsWithServices } from '#/lib/services'

const groups = getRemontiGroupsWithServices(servicesCatalog, remontiGroups)

// replace sections.map block:
<Reveal>
  <ServiceCatalog groups={groups} variant="grouped" />
</Reveal>
```

- [ ] **Step 5: Regenerate routes**

Run: `pnpm generate-routes`

- [ ] **Step 6: Update service-routes.test.tsx**

Add gaz test; update remonti expectations:

```tsx
import { GazPage } from '#/pages/gaz-page'

it('renders the gaz page with gas contact line', () => {
  render(<GazPage />)
  const gasLine = resolveContactLine('gas')
  expect(screen.getByRole('heading', { name: siteContent.pages.gaz.hero.title })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Газови услуги' })).toBeInTheDocument()
  expect(screen.getAllByRole('link', { name: gasLine.phoneDisplay })[0]).toHaveAttribute(
    'href',
    gasLine.phoneHref,
  )
})

// remonti test — replace old group titles:
expect(screen.getByRole('heading', { name: 'Диагностика и поддръжка' })).toBeInTheDocument()
expect(screen.getByRole('heading', { name: 'Спирачки и комфорт' })).toBeInTheDocument()
expect(screen.queryByText('Диагностика и обслужване')).not.toBeInTheDocument()
```

- [ ] **Step 7: Run tests**

Run: `pnpm test src/routes/service-routes.test.tsx`

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/routes/gaz.tsx src/pages/gaz-page.tsx src/pages/gtp-page.tsx src/pages/remonti-page.tsx src/routes/service-routes.test.tsx src/routeTree.gen.ts
git commit -m "feat: add gaz route and service catalogs on service pages"
```

---

### Task 8: SEO, sitemap, header tests

**Files:**
- Modify: `site.defaults.json`
- Modify: `scripts/generate-seo-files.mjs`
- Modify: `public/sitemap.xml` (via generate)
- Modify: `src/lib/seo.test.ts`
- Modify: `src/components/site/site-header.test.tsx`
- Optional: `public/manifest.json`

- [ ] **Step 1: Extend site.defaults.json**

```json
{
  "siteUrl": "https://avtoserviz-lovech.bg",
  "publicPaths": ["/", "/gtp", "/gaz", "/remonti", "/kontakti"]
}
```

- [ ] **Step 2: Update generate-seo-files.mjs**

```js
const paths = siteDefaults.publicPaths ?? ['/', '/gtp', '/remonti', '/kontakti']
```

- [ ] **Step 3: Add seo.test.ts assertions**

```ts
expect(siteContent.seo.gaz.title).toBe('Газови системи')
expect(siteContent.seo.home.description).toContain('газови системи')
```

- [ ] **Step 4: Update site-header.test.tsx**

```tsx
expectNavLink('Газови системи', '/gaz')
```

- [ ] **Step 5: Regenerate sitemap and run tests**

Run:

```bash
pnpm generate-seo
pnpm test src/lib/seo.test.ts src/components/site/site-header.test.tsx
grep -F '/gaz' public/sitemap.xml
```

Expected: `/gaz` present in sitemap; tests PASS

- [ ] **Step 6: Optional manifest**

Update `public/manifest.json`:

```json
"name": "Stefi Auto Gas — ГТП, сервиз и газови системи"
```

- [ ] **Step 7: Commit**

```bash
git add site.defaults.json scripts/generate-seo-files.mjs public/sitemap.xml src/lib/seo.test.ts src/components/site/site-header.test.tsx public/manifest.json
git commit -m "feat: add gaz to sitemap and SEO tests"
```

---

### Task 9: E2E smoke + final quality gate

**Files:**
- Modify: `e2e/site-smoke.spec.ts`

- [ ] **Step 1: Update sitePaths and add gaz tests**

```ts
const sitePaths = ['/', '/gtp', '/gaz', '/remonti', '/kontakti'] as const

test('gaz page uses gas phone number in hero', async ({ page }) => {
  await page.goto('/gaz')
  await expect(page.getByRole('link', { name: 'Обадете се' })).toHaveAttribute(
    'href',
    'tel:+359887816055',
  )
})

test('gaz nav link is active on gaz page', async ({ page }) => {
  await page.goto('/gaz')
  const gazLink = page.getByTestId('site-nav').getByRole('link', { name: 'Газови системи' })
  await expect(gazLink).toHaveAttribute('data-status', 'active')
})
```

- [ ] **Step 2: Run full quality gate**

Run:

```bash
pnpm test
pnpm build
pnpm test:e2e
```

Expected: all PASS; build regenerates sitemap with 5 URLs

- [ ] **Step 3: Commit**

```bash
git add e2e/site-smoke.spec.ts
git commit -m "test: extend e2e smoke for gaz route and contact routing"
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| 15-service catalog + validation | 1, 2 |
| `/gaz` route + page + SEO | 2, 7, 8 |
| Grouped `/remonti` catalog | 5, 7 |
| GTP catalog + process sections kept | 7 |
| Home Option A (gas replaces trust) | 2, 6 |
| `fuel` stat + hero title | 2, 6 |
| `contactContext="gas"` | 3, 7 |
| Header stays service line | 3 (no header change) |
| Expand UI + bullet paragraphs | 4 |
| Sitemap 5 paths | 8 |
| All tests from spec table | 1–9 |
| Remove dead data | 2 |

## Optional (out of plan scope unless time permits)

- Контакти cross-link to `/gaz` near gas phone block
- `manifest.json` name alignment (included as optional step in Task 8)

---

**Plan complete and saved to `docs/superpowers/plans/2026-07-22-services-catalog-gas-page.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
