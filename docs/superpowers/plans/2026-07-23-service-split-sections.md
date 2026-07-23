# Service Split Sections Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat/grouped `ServiceCatalog` bodies on `/gaz` and `/remonti` with GTP-style two-column split rows driven by the centralized catalog, preserving expandable service copy and existing contact routing.

**Architecture:** Add `CatalogSplitSection` (service/group variants) duplicating `SplitSection` grid markup; resolve images via catalog-derived maps validated at module load. Extend `ServiceExpandableItem` with `titleAs` for heading hierarchy. Prune `ServiceCatalog` to flat-only for `/gtp`. Pages map catalog rows to split sections with per-row `<Reveal>`.

**Tech Stack:** TanStack Start, React 19, TanStack Router, Vitest, Playwright, Vite, pnpm, Tailwind CSS 4

**Spec:** [`docs/superpowers/specs/2026-07-23-service-split-sections-design.md`](../specs/2026-07-23-service-split-sections-design.md)

## Global Constraints

- **`/gaz`:** 3 split rows — one per gas service; service titles render as **`<h2>`**; **no** page-level „Газови услуги” `<h2>`
- **`/remonti`:** 3 split rows — one per group; group title **`<h2>`**, service titles **`<h3>`**; all **11** remonti services visible
- **`/gtp`:** **unchanged** — process `SplitSection`s + flat `ServiceCatalog` with heading **„Годишен технически преглед — подробности”**
- **Section numbers:** `01`–`03` on `/gaz` and `/remonti`
- **Alternating layout:** `reverse={index % 2 === 1}` + `mutedBackground={index % 2 === 1}` (same as GTP process sections)
- **Reveal:** one `<Reveal>` per split row; existing `<Reveal><CtaBand … /></Reveal>` unchanged
- **Expand UI:** `ServiceExpandableItem` + native `<details>`; label **„Повече информация”**
- **Images:** reuse existing `/images/*` assets; resolved **`imageAlt` strings** from `imageAlts` (not key names)
- **Image maps:** keys derived from catalog at build time; **`assertCompleteSplitImageMaps()`** at module load
- **Catalog schema:** no changes to `servicesCatalog`, `remontiGroups`, or helpers
- **Contact routing:** `gas` on `/gaz`, `remonti` on `/remonti`; header/footer stay `default`
- **`SplitSectionLayout` extract:** out of scope — duplicate markup in `CatalogSplitSection` for v1
- **Same PR cleanup:** delete `ServiceGroupSection`, remove grouped `ServiceCatalog` variant, prune grouped test
- **Quality gate:** **`pnpm test`** and **`pnpm build`** pass

---

## File map

| File | Responsibility |
|------|----------------|
| `src/data/site-content.ts` | Export `imageAlts` for map resolution |
| `src/lib/catalog-split-images.ts` | `assertCompleteSplitImageMaps()` |
| `src/data/catalog-split-images.ts` | `gazSplitImages`, `remontiSplitImages`; call assert at load |
| `src/lib/catalog-split-images.test.ts` | Map completeness + throw cases |
| `src/components/site/service-expandable-item.tsx` | Add optional `titleAs: 'h2' \| 'h3'` |
| `src/components/site/service-expandable-item.test.tsx` | `titleAs="h2"` class assertion |
| `src/components/site/catalog-split-section.tsx` | New split-row component (service/group) |
| `src/components/site/catalog-split-section.test.tsx` | Variant markup, a11y, numbers, image alt |
| `src/components/site/service-catalog.tsx` | Flat variant only |
| `src/components/site/service-catalog.test.tsx` | Flat test only |
| `src/components/site/service-group-section.tsx` | **Delete** |
| `src/pages/gaz-page.tsx` | Hero → 3× split rows → CtaBand |
| `src/pages/remonti-page.tsx` | Hero → 3× split rows → CtaBand |
| `src/routes/service-routes.test.tsx` | Updated layout assertions |
| `src/data/site-content.test.ts` | Optional smoke: split maps import does not throw |

---

### Task 1: Export `imageAlts` + split image maps + validation

**Files:**
- Modify: `src/data/site-content.ts:105`
- Create: `src/lib/catalog-split-images.ts`
- Create: `src/data/catalog-split-images.ts`
- Create: `src/lib/catalog-split-images.test.ts`
- Test: `src/lib/catalog-split-images.test.ts`

**Interfaces:**
- Produces: `export const imageAlts` (resolved alt strings)
- Produces: `gazSplitImages: Record<GazServiceId, { image: string; imageAlt: string }>`
- Produces: `remontiSplitImages: Record<RemontiGroupId, { image: string; imageAlt: string }>`
- Produces: `assertCompleteSplitImageMaps(gazMap, remontiMap, services, groups): void`

- [ ] **Step 1: Write failing tests**

Create `src/lib/catalog-split-images.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Service, ServiceGroupDef } from '#/data/site-content'
import { assertCompleteSplitImageMaps } from '#/lib/catalog-split-images'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { gazSplitImages, remontiSplitImages } from '#/data/catalog-split-images'

const sampleServices = [
  { id: 'g1', title: 'G1', summary: 'S', page: 'gaz' },
  { id: 'g2', title: 'G2', summary: 'S', page: 'gaz' },
] satisfies Service[]

const sampleGroups = [
  { id: 'grp-a', title: 'A', intro: 'I', serviceIds: [] },
  { id: 'grp-b', title: 'B', intro: 'I', serviceIds: [] },
] satisfies ServiceGroupDef[]

describe('assertCompleteSplitImageMaps', () => {
  it('passes for complete maps matching catalog ids', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        { g1: { image: '/a.png', imageAlt: 'Alt A' }, g2: { image: '/b.png', imageAlt: 'Alt B' } },
        {
          'grp-a': { image: '/a.png', imageAlt: 'Alt A' },
          'grp-b': { image: '/b.png', imageAlt: 'Alt B' },
        },
        sampleServices,
        sampleGroups,
      ),
    ).not.toThrow()
  })

  it('throws when a gaz service id is missing from the map', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        { g1: { image: '/a.png', imageAlt: 'Alt A' } },
        { 'grp-a': { image: '/a.png', imageAlt: 'Alt A' }, 'grp-b': { image: '/b.png', imageAlt: 'Alt B' } },
        sampleServices,
        sampleGroups,
      ),
    ).toThrow(/Missing gaz image map entry: g2/)
  })

  it('throws when a remonti group id is missing from the map', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        { g1: { image: '/a.png', imageAlt: 'Alt A' }, g2: { image: '/b.png', imageAlt: 'Alt B' } },
        { 'grp-a': { image: '/a.png', imageAlt: 'Alt A' } },
        sampleServices,
        sampleGroups,
      ),
    ).toThrow(/Missing remonti image map entry: grp-b/)
  })

  it('throws on orphan gaz map keys', () => {
    expect(() =>
      assertCompleteSplitImageMaps(
        {
          g1: { image: '/a.png', imageAlt: 'Alt A' },
          g2: { image: '/b.png', imageAlt: 'Alt B' },
          orphan: { image: '/x.png', imageAlt: 'X' },
        },
        {
          'grp-a': { image: '/a.png', imageAlt: 'Alt A' },
          'grp-b': { image: '/b.png', imageAlt: 'Alt B' },
        },
        sampleServices,
        sampleGroups,
      ),
    ).toThrow(/Orphan gaz image map key: orphan/)
  })

  it('validates real maps at module load', () => {
    const gazIds = servicesCatalog.filter((s) => s.page === 'gaz').map((s) => s.id)
    for (const id of gazIds) {
      expect(gazSplitImages[id]?.image).toMatch(/^\/images\//)
      expect(gazSplitImages[id]?.imageAlt.length).toBeGreaterThan(0)
    }
    for (const group of remontiGroups) {
      expect(remontiSplitImages[group.id]?.image).toMatch(/^\/images\//)
      expect(remontiSplitImages[group.id]?.imageAlt.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/lib/catalog-split-images.test.ts`

Expected: FAIL — cannot resolve `#/lib/catalog-split-images` or `#/data/catalog-split-images`

- [ ] **Step 3: Export `imageAlts` from site-content**

In `src/data/site-content.ts`, change:

```ts
const imageAlts = {
```

to:

```ts
export const imageAlts = {
```

- [ ] **Step 4: Implement assert helper**

Create `src/lib/catalog-split-images.ts`:

```ts
import type { Service, ServiceGroupDef } from '#/data/site-content'

type SplitImage = { image: string; imageAlt: string }

export function assertCompleteSplitImageMaps(
  gazSplitImages: Record<string, SplitImage>,
  remontiSplitImages: Record<string, SplitImage>,
  services: readonly Service[],
  groups: readonly ServiceGroupDef[],
): void {
  const gazIds = services.filter((service) => service.page === 'gaz').map((service) => service.id)

  for (const id of gazIds) {
    if (!(id in gazSplitImages)) {
      throw new Error(`Missing gaz image map entry: ${id}`)
    }
  }

  for (const key of Object.keys(gazSplitImages)) {
    if (!gazIds.includes(key)) {
      throw new Error(`Orphan gaz image map key: ${key}`)
    }
  }

  const groupIds = groups.map((group) => group.id)

  for (const id of groupIds) {
    if (!(id in remontiSplitImages)) {
      throw new Error(`Missing remonti image map entry: ${id}`)
    }
  }

  for (const key of Object.keys(remontiSplitImages)) {
    if (!groupIds.includes(key)) {
      throw new Error(`Orphan remonti image map key: ${key}`)
    }
  }
}
```

- [ ] **Step 5: Create catalog-derived maps module**

Create `src/data/catalog-split-images.ts`:

```ts
import { imageAlts } from '#/data/site-content'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { assertCompleteSplitImageMaps } from '#/lib/catalog-split-images'

const REMONTI_GROUP_IMAGE = {
  'diagnostics-maintenance': {
    image: '/images/repairs-section.png',
    imageAlt: imageAlts.repairs,
  },
  'engine-drivetrain': {
    image: '/images/gtp-section.png',
    imageAlt: imageAlts.gtp,
  },
  'brakes-comfort': {
    image: '/images/trust-section.png',
    imageAlt: imageAlts.shop,
  },
} as const satisfies Record<
  (typeof remontiGroups)[number]['id'],
  { image: string; imageAlt: string }
>

const gazServices = servicesCatalog.filter((service) => service.page === 'gaz')

export const gazSplitImages = Object.fromEntries(
  gazServices.map((service) => [
    service.id,
    { image: '/images/repairs-section.png', imageAlt: imageAlts.gas },
  ]),
) as Record<(typeof gazServices)[number]['id'], { image: string; imageAlt: string }>

export const remontiSplitImages = Object.fromEntries(
  remontiGroups.map((group) => [group.id, REMONTI_GROUP_IMAGE[group.id]]),
) as Record<(typeof remontiGroups)[number]['id'], { image: string; imageAlt: string }>

assertCompleteSplitImageMaps(gazSplitImages, remontiSplitImages, servicesCatalog, remontiGroups)
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test src/lib/catalog-split-images.test.ts`

Expected: PASS (5 tests)

- [ ] **Step 7: Commit**

```bash
git add src/data/site-content.ts src/lib/catalog-split-images.ts src/data/catalog-split-images.ts src/lib/catalog-split-images.test.ts
git commit -m "feat: add catalog split image maps with module-load validation"
```

---

### Task 2: `ServiceExpandableItem` `titleAs` prop

**Files:**
- Modify: `src/components/site/service-expandable-item.tsx`
- Modify: `src/components/site/service-expandable-item.test.tsx`
- Test: `src/components/site/service-expandable-item.test.tsx`

**Interfaces:**
- Produces: `ServiceExpandableItem({ service, titleAs?: 'h2' | 'h3' })` — default `'h3'`
- Produces: stable `id={`service-${service.id}`}` on title element (unchanged)

- [ ] **Step 1: Write failing test**

Add to `src/components/site/service-expandable-item.test.tsx`:

```ts
  it('renders h2 with split-section title classes when titleAs is h2', () => {
    render(
      <ServiceExpandableItem
        service={{ id: 'z', title: 'Title Z', summary: 'Summary Z', page: 'gaz' }}
        titleAs="h2"
      />,
    )
    const heading = screen.getByRole('heading', { name: 'Title Z', level: 2 })
    expect(heading).toHaveAttribute('id', 'service-z')
    expect(heading.className).toContain('text-3xl')
    expect(heading.className).toContain('font-extrabold')
    expect(heading.className).toContain('md:text-4xl')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/site/service-expandable-item.test.tsx`

Expected: FAIL — renders `<h3>` instead of `<h2>`, or `titleAs` prop unrecognized

- [ ] **Step 3: Implement `titleAs`**

Replace `src/components/site/service-expandable-item.tsx` with:

```tsx
import type { Service } from '#/data/site-content'

type ServiceExpandableItemProps = {
  service: Service
  titleAs?: 'h2' | 'h3'
}

const titleClasses = {
  h2: 'text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl',
  h3: 'text-xl font-bold text-[#0a0a0a]',
} as const

function splitDetails(details: string): string[] {
  return details.split('\n\n').filter((part) => part.trim().length > 0)
}

export function ServiceExpandableItem({ service, titleAs = 'h3' }: ServiceExpandableItemProps) {
  const titleId = `service-${service.id}`
  const TitleTag = titleAs

  return (
    <li className="space-y-3">
      <TitleTag id={titleId} className={titleClasses[titleAs]}>
        {service.title}
      </TitleTag>
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

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/site/service-expandable-item.test.tsx`

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/site/service-expandable-item.tsx src/components/site/service-expandable-item.test.tsx
git commit -m "feat: add titleAs prop to ServiceExpandableItem"
```

---

### Task 3: `CatalogSplitSection` component

**Files:**
- Create: `src/components/site/catalog-split-section.tsx`
- Create: `src/components/site/catalog-split-section.test.tsx`
- Test: `src/components/site/catalog-split-section.test.tsx`

**Interfaces:**
- Consumes: `ServiceExpandableItem`, `Service`, `ServiceGroupDef & { services: Service[] }`
- Produces: `CatalogSplitSection(props)` — discriminated union on `variant: 'service' | 'group'`

- [ ] **Step 1: Write failing tests**

Create `src/components/site/catalog-split-section.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { CatalogSplitSection } from '#/components/site/catalog-split-section'

const service = {
  id: 'agu-montazh-remont',
  title: 'Gas Service Title',
  summary: 'Gas summary text',
  details: 'Detail paragraph one.',
  page: 'gaz' as const,
}

const group = {
  id: 'diagnostics-maintenance',
  title: 'Group Title',
  intro: 'Group intro paragraph',
  serviceIds: ['svc-a', 'svc-b'],
  services: [
    { id: 'svc-a', title: 'Service A', summary: 'Sum A', page: 'remonti' as const, groupId: 'diagnostics-maintenance' },
    { id: 'svc-b', title: 'Service B', summary: 'Sum B', page: 'remonti' as const, groupId: 'diagnostics-maintenance' },
  ],
}

describe('CatalogSplitSection', () => {
  it('renders service variant with ul wrapper, h2 title, summary, expand, number, and image alt', () => {
    const { container } = render(
      <CatalogSplitSection
        image="/images/repairs-section.png"
        imageAlt="Gas alt text"
        number="01"
        service={service}
        variant="service"
      />,
    )

    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-labelledby', 'service-agu-montazh-remont')
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gas Service Title', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Gas summary text')).toBeInTheDocument()
    expect(screen.getByText('Повече информация')).toBeInTheDocument()
    expect(container.querySelector('ul.space-y-8')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Gas alt text' })).toHaveAttribute(
      'src',
      '/images/repairs-section.png',
    )
  })

  it('renders group variant with h2, max-w-prose intro, all services as h3, and aria-labelledby', () => {
    const { container } = render(
      <CatalogSplitSection
        group={group}
        image="/images/repairs-section.png"
        imageAlt="Repairs alt text"
        number="02"
        variant="group"
      />,
    )

    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-labelledby', 'group-diagnostics-maintenance')
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Group Title', level: 2 })).toHaveAttribute(
      'id',
      'group-diagnostics-maintenance',
    )
    const intro = screen.getByText('Group intro paragraph')
    expect(intro.className).toContain('max-w-prose')
    expect(screen.getByRole('heading', { name: 'Service A', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Service B', level: 3 })).toBeInTheDocument()
    expect(container.querySelector('ul.mt-8.space-y-8')).toBeInTheDocument()
  })

  it('applies muted background and reverse grid order classes', () => {
    const { container } = render(
      <CatalogSplitSection
        image="/images/repairs-section.png"
        imageAlt="Alt"
        mutedBackground
        reverse
        service={service}
        variant="service"
      />,
    )

    expect(container.querySelector('section')?.className).toContain('bg-[#fafafa]')
    expect(container.querySelector('.grid')?.className).toContain('[&>*:first-child]:md:order-2')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/site/catalog-split-section.test.tsx`

Expected: FAIL — module `#/components/site/catalog-split-section` not found

- [ ] **Step 3: Implement component**

Create `src/components/site/catalog-split-section.tsx`:

```tsx
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'
import type { Service, ServiceGroupDef } from '#/data/site-content'
import { cn } from '#/lib/utils'

type CatalogSplitSectionProps =
  | {
      variant: 'service'
      service: Service
      image: string
      imageAlt: string
      reverse?: boolean
      mutedBackground?: boolean
      number?: string
    }
  | {
      variant: 'group'
      group: ServiceGroupDef & { services: Service[] }
      image: string
      imageAlt: string
      reverse?: boolean
      mutedBackground?: boolean
      number?: string
    }

export function CatalogSplitSection(props: CatalogSplitSectionProps) {
  const { image, imageAlt, reverse = false, mutedBackground = false, number } = props
  const headingId =
    props.variant === 'service' ? `service-${props.service.id}` : `group-${props.group.id}`

  return (
    <section
      aria-labelledby={headingId}
      className={cn(mutedBackground && 'bg-[#fafafa]')}
    >
      <div
        className={cn(
          'grid md:grid-cols-2',
          reverse && '[&>*:first-child]:md:order-2 [&>*:last-child]:md:order-1',
        )}
      >
        <div className="flex flex-col justify-center px-6 py-12 lg:px-10 lg:py-16">
          {number ? (
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#1e3a8a]">
              {number}
            </p>
          ) : null}
          {props.variant === 'service' ? (
            <ul className="space-y-8">
              <ServiceExpandableItem service={props.service} titleAs="h2" />
            </ul>
          ) : (
            <>
              <h2
                id={headingId}
                className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl"
              >
                {props.group.title}
              </h2>
              <p className="mt-4 max-w-prose text-base leading-7 text-[#525252]">
                {props.group.intro}
              </p>
              <ul className="mt-8 space-y-8">
                {props.group.services.map((service) => (
                  <ServiceExpandableItem key={service.id} service={service} />
                ))}
              </ul>
            </>
          )}
        </div>
        <div className="aspect-[4/3] min-h-[280px] overflow-hidden md:aspect-auto md:min-h-[280px]">
          <img
            alt={imageAlt}
            className="h-full min-h-[280px] w-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:hover:scale-[1.03]"
            decoding="async"
            loading="lazy"
            src={image}
          />
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/site/catalog-split-section.test.tsx`

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/components/site/catalog-split-section.tsx src/components/site/catalog-split-section.test.tsx
git commit -m "feat: add CatalogSplitSection for service and group variants"
```

---

### Task 4: Prune `ServiceCatalog` + delete `ServiceGroupSection`

**Files:**
- Modify: `src/components/site/service-catalog.tsx`
- Modify: `src/components/site/service-catalog.test.tsx`
- Delete: `src/components/site/service-group-section.tsx`
- Test: `src/components/site/service-catalog.test.tsx`

**Interfaces:**
- Produces: `ServiceCatalog({ variant: 'flat', heading, services })` only

- [ ] **Step 1: Remove grouped test first (red phase for catalog prune)**

In `src/components/site/service-catalog.test.tsx`, delete the grouped test case:

```ts
  it('renders grouped sections with h2 per group', () => {
    render(<ServiceCatalog groups={grouped} variant="grouped" />)
    ...
  })
```

Also remove unused `grouped` fixture at top of file.

- [ ] **Step 2: Run test — flat test still passes, grouped test gone**

Run: `pnpm test src/components/site/service-catalog.test.tsx`

Expected: PASS (1 test) — grouped variant still in source but untested

- [ ] **Step 3: Prune `ServiceCatalog` to flat-only**

Replace `src/components/site/service-catalog.tsx`:

```tsx
import type { Service } from '#/data/site-content'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'

export type ServiceCatalogProps = {
  variant: 'flat'
  heading: string
  services: Service[]
}

export function ServiceCatalog({ heading, services }: ServiceCatalogProps) {
  return (
    <section className="px-6 py-12 lg:px-10 lg:py-16">
      <h2 className="text-3xl font-extrabold tracking-tight text-[#0a0a0a] md:text-4xl">
        {heading}
      </h2>
      <ul className="mt-8 space-y-8">
        {services.map((service) => (
          <ServiceExpandableItem key={service.id} service={service} />
        ))}
      </ul>
    </section>
  )
}
```

- [ ] **Step 4: Delete dead component**

```bash
rm src/components/site/service-group-section.tsx
```

- [ ] **Step 5: Run tests**

Run: `pnpm test src/components/site/service-catalog.test.tsx`

Expected: PASS

Run: `pnpm test`

Expected: may FAIL on `service-routes.test.tsx` (pages still use grouped catalog) — OK until Task 5

- [ ] **Step 6: Commit**

```bash
git add src/components/site/service-catalog.tsx src/components/site/service-catalog.test.tsx
git rm src/components/site/service-group-section.tsx
git commit -m "refactor: keep flat ServiceCatalog only, remove ServiceGroupSection"
```

---

### Task 5: Wire `/gaz` and `/remonti` pages to split rows

**Files:**
- Modify: `src/pages/gaz-page.tsx`
- Modify: `src/pages/remonti-page.tsx`
- Test: `src/routes/service-routes.test.tsx` (updated in Task 6)

**Interfaces:**
- Consumes: `gazSplitImages`, `remontiSplitImages`, `CatalogSplitSection`, `getServicesForPage`, `getRemontiGroupsWithServices`

- [ ] **Step 1: Update gaz page**

Replace `src/pages/gaz-page.tsx`:

```tsx
import { CtaBand } from '#/components/site/cta-band'
import { CatalogSplitSection } from '#/components/site/catalog-split-section'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { gazSplitImages } from '#/data/catalog-split-images'
import { servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getServicesForPage } from '#/lib/services'

export function GazPage() {
  const { hero, ctaBand } = siteContent.pages.gaz
  const services = getServicesForPage('gaz', servicesCatalog)

  return (
    <>
      <HeroSection contactContext="gas" content={hero} />
      {services.map((service, index) => (
        <Reveal key={service.id}>
          <CatalogSplitSection
            image={gazSplitImages[service.id].image}
            imageAlt={gazSplitImages[service.id].imageAlt}
            mutedBackground={index % 2 === 1}
            number={`0${index + 1}`}
            reverse={index % 2 === 1}
            service={service}
            variant="service"
          />
        </Reveal>
      ))}
      <Reveal>
        <CtaBand contactContext="gas" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
```

- [ ] **Step 2: Update remonti page**

Replace `src/pages/remonti-page.tsx`:

```tsx
import { CtaBand } from '#/components/site/cta-band'
import { CatalogSplitSection } from '#/components/site/catalog-split-section'
import { HeroSection } from '#/components/site/hero-section'
import { Reveal } from '#/components/site/reveal'
import { remontiSplitImages } from '#/data/catalog-split-images'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { getRemontiGroupsWithServices } from '#/lib/services'

export function RemontiPage() {
  const { hero, ctaBand } = siteContent.pages.remonti
  const groups = getRemontiGroupsWithServices(servicesCatalog, remontiGroups)

  return (
    <>
      <HeroSection contactContext="remonti" content={hero} />
      {groups.map((group, index) => (
        <Reveal key={group.id}>
          <CatalogSplitSection
            group={group}
            image={remontiSplitImages[group.id].image}
            imageAlt={remontiSplitImages[group.id].imageAlt}
            mutedBackground={index % 2 === 1}
            number={`0${index + 1}`}
            reverse={index % 2 === 1}
            variant="group"
          />
        </Reveal>
      ))}
      <Reveal>
        <CtaBand contactContext="remonti" subtitle={ctaBand.description} title={ctaBand.title} />
      </Reveal>
    </>
  )
}
```

- [ ] **Step 3: Smoke-render pages**

Run: `pnpm test src/routes/service-routes.test.tsx`

Expected: FAIL on outdated assertions — proceed to Task 6

- [ ] **Step 4: Commit**

```bash
git add src/pages/gaz-page.tsx src/pages/remonti-page.tsx
git commit -m "feat: replace gaz and remonti catalog blocks with split sections"
```

---

### Task 6: Update route tests + optional site-content smoke

**Files:**
- Modify: `src/routes/service-routes.test.tsx`
- Modify: `src/data/site-content.test.ts` (optional smoke)
- Test: `src/routes/service-routes.test.tsx`, `src/data/site-content.test.ts`

- [ ] **Step 1: Write updated route assertions**

Replace gaz and remonti tests in `src/routes/service-routes.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { servicesCatalog } from '#/data/services-catalog'
import { siteContent } from '#/data/site-content'
import { resolveContactLine } from '#/lib/contact-context'
import { GazPage } from '#/pages/gaz-page'
import { GtpPage } from '#/pages/gtp-page'
import { RemontiPage } from '#/pages/remonti-page'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

describe('service routes', () => {
  it('renders the GTP hero, sections, and contact links', () => {
    render(<GtpPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.gtp.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('Как протича прегледът')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Годишен технически преглед — подробности',
        level: 2,
      }),
    ).toBeInTheDocument()

    const gtpLine = resolveContactLine('gtp')
    expect(
      screen.getAllByRole('link', { name: gtpLine.phoneDisplay })[0],
    ).toHaveAttribute('href', gtpLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', gtpLine.viberHref)
  })

  it('renders the gaz page with split rows, section numbers, and gas contact line', () => {
    render(<GazPage />)
    const gasLine = resolveContactLine('gas')
    const gazServices = servicesCatalog.filter((service) => service.page === 'gaz')

    expect(
      screen.getByRole('heading', { name: siteContent.pages.gaz.hero.title }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Газови услуги' })).not.toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()

    for (const service of gazServices) {
      expect(
        screen.getByRole('heading', { name: service.title, level: 2 }),
      ).toBeInTheDocument()
    }

    expect(screen.getAllByRole('link', { name: gasLine.phoneDisplay })[0]).toHaveAttribute(
      'href',
      gasLine.phoneHref,
    )
  })

  it('renders the repairs hero, group split rows, all services, and contact links', () => {
    render(<RemontiPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.remonti.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Диагностика и поддръжка', level: 2 })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Двигател, ходова част и управление', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Спирачки и комфорт', level: 2 })).toBeInTheDocument()
    expect(screen.queryByText('Диагностика и обслужване')).not.toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()

    const remontiServices = servicesCatalog.filter((service) => service.page === 'remonti')
    expect(remontiServices).toHaveLength(11)
    for (const service of remontiServices) {
      expect(
        screen.getByRole('heading', { name: service.title, level: 3 }),
      ).toBeInTheDocument()
    }

    const serviceLine = resolveContactLine('remonti')
    expect(
      screen.getAllByRole('link', { name: serviceLine.phoneDisplay })[0],
    ).toHaveAttribute('href', serviceLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', serviceLine.viberHref)
  })
})
```

- [ ] **Step 2: Optional site-content smoke import**

Add to `src/data/site-content.test.ts`:

```ts
  it('loads catalog split image maps without throwing', async () => {
    await expect(import('#/data/catalog-split-images')).resolves.toBeDefined()
  })
```

- [ ] **Step 3: Run tests**

Run: `pnpm test src/routes/service-routes.test.tsx src/data/site-content.test.ts`

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/routes/service-routes.test.tsx src/data/site-content.test.ts
git commit -m "test: update route assertions for split section layouts"
```

---

### Task 7: Final verification

**Files:** (none — verification only)

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`

Expected: all tests PASS

- [ ] **Step 2: Run production build**

Run: `pnpm build`

Expected: build completes without errors

- [ ] **Step 3: Confirm no dead imports**

Run: `pnpm lint`

Expected: no errors; no references to `ServiceGroupSection` or grouped `ServiceCatalog`

- [ ] **Step 4: Manual spot-check (optional)**

Run: `pnpm dev`

Visit `/gaz`, `/remonti`, `/gtp`:
- `/gaz`: 3 alternating split rows, service `h2`s, no „Газови услуги” heading
- `/remonti`: 3 group rows, 11 expandable services, tall `engine-drivetrain` column OK
- `/gtp`: unchanged process sections + flat catalog heading

---

## Spec coverage self-review

| Requirement | Task |
|-------------|------|
| Gaz: 3 service split rows | Task 5 |
| Remonti: 3 group rows, all 11 services | Task 3, 5, 6 |
| Valid `<ul>`/`<li>` markup | Task 3 |
| `/gaz` service `h2` titles | Task 2, 3 |
| Summary + „Повече информация” | Task 2 (unchanged behavior) |
| Reuse images + module-load assert | Task 1 |
| GTP unchanged; flat catalog heading on `/gtp` only | Task 4, 6 |
| Dead-code cleanup same PR | Task 4 |
| Per-row Reveal + unchanged CtaBand Reveal | Task 5 |
| Section numbers + alternating layout | Task 3, 5, 6 |
| `aria-labelledby` on split sections | Task 3 |
| Contact routing unchanged | Task 6 |

**Placeholder scan:** none — all steps include concrete code, paths, and commands.

**Type consistency:** `CatalogSplitSection` props, map record keys, and page imports align across Tasks 1, 3, and 5.
