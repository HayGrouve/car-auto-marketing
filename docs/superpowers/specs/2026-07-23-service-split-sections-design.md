# Service split sections on `/gaz` and `/remonti` — design spec

## Goal

Replace the flat/grouped `ServiceCatalog` list layout on **`/gaz`** and **`/remonti`** with the **two-column image + text rhythm** used on **`/gtp`** process sections. Each row shows catalog **summary** copy in the text column, with optional **„Повече информация”** expand below — preserving all service content from the centralized catalog without duplicating copy in `site-content`.

Builds on [2026-07-22-services-catalog-gas-page-design.md](./2026-07-22-services-catalog-gas-page-design.md) (implemented).

## Approved decisions

| Topic | Decision |
|-------|----------|
| `/gaz` row unit | **One split row per service** (3 rows) |
| `/remonti` row unit | **One split row per group** (3 rows); text column lists all services in that group |
| Images | **Reuse existing assets** — resolved `image` + `imageAlt` strings from `imageAlts`; fixed mapping by service id (gaz) or group id (remonti); no new catalog fields |
| `/gtp` | **Unchanged** — process `SplitSection`s + flat `ServiceCatalog` at bottom |
| Expand UI | Keep **`ServiceExpandableItem`** behavior (`<details>` / „Повече информация”) |
| Section numbers | **Yes** — `01`–`03` on each page |
| Alternating layout | **Yes** — `reverse` + `mutedBackground` on odd indices (same as GTP process sections) |
| Reveal granularity | **Per-row** `<Reveal>` on each split section (replaces single catalog `<Reveal>` on `/gaz`) |
| Contact routing | **Unchanged** — `gas` on `/gaz` hero + CtaBand; `remonti` on `/remonti`; header/footer stay `default` |
| Catalog schema | **No changes** — `servicesCatalog`, `remontiGroups`, helpers unchanged |
| GTP visual parity scope | **Layout + section numbers + alternating background only** — not identical body structure (GTP process rows use marketing copy; catalog rows use service copy) |
| SplitSectionLayout extract | **v1: duplicate markup** in `CatalogSplitSection`; shared extract is a follow-up |
| SEO / on-page structure | **Accepted:** `/gaz` loses visible „Газови услуги” page `<h2>`; hero `<h1>` + per-row service `<h2>`s replace it |

### Decisions to lock

| Topic | Decision |
|-------|----------|
| Service variant list markup | Wrap `ServiceExpandableItem` in `<ul className="space-y-8">` (valid HTML; matches flat catalog) |
| `/gaz` heading level | Service title renders as **`<h2>`** with SplitSection title classes (`text-3xl font-extrabold tracking-tight … md:text-4xl`) via `ServiceExpandableItem` prop `titleAs="h2"` |
| `/remonti` heading hierarchy | Group title = **`<h2>`** (section heading); service titles stay **`<h3>`** inside the list |
| GTP parity scope | Grid, numbers, reverse/muted only — not marketing-vs-catalog copy parity |
| SplitSectionLayout | **Duplicate for v1** — do not block on extract |
| Post-refactor cleanup | **Same PR:** remove grouped `ServiceCatalog` variant, delete `ServiceGroupSection`, prune grouped test |
| Image map validation | **`assertCompleteSplitImageMaps()` at module load** (alongside catalog validation) + unit test |
| Image map values | Store **resolved alt strings** (e.g. `imageAlts.gas`), not key names |
| Image map keys | **Derived from catalog** at build time — no hand-maintained id unions |
| Outer element | Each `CatalogSplitSection` renders **`<section>`** with `aria-labelledby` pointing at the row heading id |
| Long group columns | **`engine-drivetrain` (5 services)** — tall text column is acceptable; image stays fixed min-height; no scroll/clamp |
| CtaBand wrapper | **Keep existing** `<Reveal><CtaBand … /></Reveal>` on both pages unchanged |

### Supersedes (prior catalog spec — layout only)

[2026-07-22-services-catalog-gas-page-design.md](./2026-07-22-services-catalog-gas-page-design.md) defines `/gaz` and `/remonti` as `ServiceCatalog`-only bodies. **This spec supersedes those page layout rows:**

| Page | Old layout | New layout |
|------|------------|------------|
| `/gaz` | Hero → flat `ServiceCatalog` („Газови услуги” `<h2>`) → CtaBand | Hero → 3× service split rows → `<Reveal>` CtaBand |
| `/remonti` | Hero → grouped `ServiceCatalog` → CtaBand | Hero → 3× group split rows → `<Reveal>` CtaBand |
| `/gtp` | Unchanged | Unchanged |

**Flat catalog heading rule** from the prior spec („Газови услуги” on `/gaz`, „Годишен технически преглед — подробности” on `/gtp`) **applies to `/gtp` only** after this change. `/gaz` no longer renders a page-level catalog `<h2>`.

All other prior-catalog decisions (15 services, validation, contact context, SEO meta, home page) remain in force.

## Resolved clarifications

| # | Question | Decision |
|---|----------|----------|
| 1 | `/remonti` row granularity | **One row per group** — intro + all services in text column |
| 2 | `/gaz` row granularity | **One row per service** — 3 alternating split sections |
| 3 | Image source | **Fixed map** to existing `/images/*` assets; resolved alt strings from `imageAlts` |
| 4 | Component strategy | **New `CatalogSplitSection`** with `service` / `group` variants |
| 5 | `ServiceCatalog` fate | **Flat variant only** on `/gtp`; grouped variant **removed** |
| 6 | Reveal animation | **One `<Reveal>` per split row** (intentional change from single catalog block) |
| 7 | Invalid bare `<li>` | Service variant wraps item in **`<ul>`** |

---

## Information architecture

### Page structures (after)

| Page | Structure |
|------|-----------|
| `/gaz` | `HeroSection` (`contactContext="gas"`) → 3× `<Reveal><CatalogSplitSection variant="service" /></Reveal>` → `<Reveal><CtaBand contactContext="gas" /></Reveal>` |
| `/remonti` | `HeroSection` (`contactContext="remonti"`) → 3× `<Reveal><CatalogSplitSection variant="group" /></Reveal>` → `<Reveal><CtaBand contactContext="remonti" /></Reveal>` |
| `/gtp` | `HeroSection` → 2× process `SplitSection` → `<Reveal><ServiceCatalog flat /></Reveal>` → `<Reveal><CtaBand /></Reveal>` — **no change** |

### Row counts

| Page | Rows | Content per text column |
|------|------|-------------------------|
| `/gaz` | 3 | Section number + `<ul>` with one `ServiceExpandableItem` (`titleAs="h2"`) |
| `/remonti` | 3 | Section number + group `<h2>` + intro `<p className="max-w-prose …">` + `<ul>` of `ServiceExpandableItem` (`titleAs="h3"`, default) |

Service order follows **`servicesCatalog` declaration order** on `/gaz` (filter `page === 'gaz'`) and **`group.serviceIds` order** on `/remonti` (via `getRemontiGroupsWithServices`).

### Heading outline (after)

| Page | Outline |
|------|---------|
| `/gaz` | `h1` hero → `h2` per service row → (no page-level „Газови услуги” `h2`) |
| `/remonti` | `h1` hero → `h2` per group → `h3` per service |
| `/gtp` | Unchanged |

---

## Image mapping

Images are **not** stored on `Service` or `ServiceGroupDef`. Maps in `src/data/catalog-split-images.ts` (or colocated with `site-content.ts`) resolve paths and **alt text strings** at module init:

### `/gaz` — all services

| Service id | Image path | Alt string (from `imageAlts`) |
|------------|------------|----------------------------------|
| `agu-montazh-remont` | `/images/repairs-section.png` | `imageAlts.gas` |
| `fabrichni-lpg-cng` | `/images/repairs-section.png` | `imageAlts.gas` |
| `parvonachalen-pregled-gaz` | `/images/repairs-section.png` | `imageAlts.gas` |

Same asset on all three rows is intentional until dedicated gas photography exists.

### `/remonti` — by group id

| Group id | Image path | Alt string (from `imageAlts`) |
|----------|------------|--------------------------------|
| `diagnostics-maintenance` | `/images/repairs-section.png` | `imageAlts.repairs` |
| `engine-drivetrain` | `/images/gtp-section.png` | `imageAlts.gtp` |
| `brakes-comfort` | `/images/trust-section.png` | `imageAlts.shop` |

### Map construction (no drift)

Build maps from catalog data — do **not** hand-maintain id literal unions:

```ts
import { imageAlts } from '#/data/site-content'
import { remontiGroups, servicesCatalog } from '#/data/services-catalog'

const gazServices = servicesCatalog.filter((s) => s.page === 'gaz')

export const gazSplitImages = Object.fromEntries(
  gazServices.map((s) => [
    s.id,
    { image: '/images/repairs-section.png', imageAlt: imageAlts.gas },
  ]),
) as Record<(typeof gazServices)[number]['id'], { image: string; imageAlt: string }>

export const remontiSplitImages = Object.fromEntries(
  remontiGroups.map((g) => [g.id, REMONTI_GROUP_IMAGE[g.id]]),
) as Record<(typeof remontiGroups)[number]['id'], { image: string; imageAlt: string }>
```

`REMONTI_GROUP_IMAGE` is a small const keyed by the three known group ids with resolved paths/alts.

### Module-load validation

Add **`assertCompleteSplitImageMaps()`** in `src/lib/catalog-split-images.ts` (or `src/lib/services.ts`):

| Rule | Error if violated |
|------|-------------------|
| Every `page === 'gaz'` service id has a map entry | Missing gaz image map entry |
| Every `remontiGroups[].id` has a map entry | Missing remonti image map entry |
| No extra keys in either map | Orphan map key |

Call at bottom of the maps module (same pattern as `assertValidServiceCatalog` in `services-catalog.ts`). Covered by **`catalog-split-images.test.ts`** and optionally **`site-content.test.ts`** smoke assertion that import does not throw.

---

## UI components

### `SplitSectionLayout` (follow-up — not v1)

**v1:** Duplicate grid/image markup inside `CatalogSplitSection` by copying from `SplitSection` today. Extract to `split-section-layout.tsx` only in a follow-up PR if duplication becomes painful.

### `CatalogSplitSection`

**File:** `src/components/site/catalog-split-section.tsx`

```ts
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
```

**Outer wrapper:** `<section className={cn(mutedBackground && 'bg-[#fafafa]')} aria-labelledby={headingId}>` — same muted wrapper as `SplitSection`.

**Grid shell** (match `SplitSection` exactly):

- `grid md:grid-cols-2` with optional reverse order swap
- Text column: `flex flex-col justify-center px-6 py-12 lg:px-10 lg:py-16`
- Image column: `aspect-[4/3] min-h-[280px] overflow-hidden md:aspect-auto md:min-h-[280px]`; inner `img` with `h-full min-h-[280px] w-full object-cover` + hover scale

**Section number:** optional `01`–`03` — `text-xs font-bold uppercase tracking-widest text-[#1e3a8a]` (same as `SplitSection`).

**`variant: 'service'` text column:**

```tsx
<ul className="space-y-8">
  <ServiceExpandableItem service={service} titleAs="h2" />
</ul>
```

**`variant: 'group'` text column:**

```tsx
<h2 id={headingId} className="text-3xl font-extrabold tracking-tight … md:text-4xl">
  {group.title}
</h2>
<p className="mt-4 max-w-prose text-base leading-7 text-[#525252]">{group.intro}</p>
<ul className="mt-8 space-y-8">
  {group.services.map((service) => (
    <ServiceExpandableItem key={service.id} service={service} />
  ))}
</ul>
```

**Image column:** props `image` + `imageAlt`; lazy `loading="lazy"`, `decoding="async"`.

### `ServiceExpandableItem` (small extension)

Add optional prop:

```ts
titleAs?: 'h2' | 'h3'  // default 'h3'
```

When `titleAs="h2"`, render title with SplitSection `<h2>` classes instead of default `<h3>` classes. Stable `id={`service-${service.id}`}` unchanged for `aria-labelledby` on expand region.

**Behavior otherwise unchanged** — summary always visible; `<details>` only when `details` set; bullet lines stay plain `<p>`.

### `ServiceCatalog` (pruned)

**Keep flat variant only** for `/gtp`:

```ts
type ServiceCatalogProps = {
  variant: 'flat'
  heading: string
  services: Service[]
}
```

Remove grouped variant and `ServiceGroupSection` import.

### Dead-code cleanup (same PR)

| Item | Action |
|------|--------|
| `service-group-section.tsx` | **Delete** |
| `ServiceCatalog` grouped variant | **Remove** |
| `service-catalog.test.tsx` grouped test case | **Remove** |
| `service-routes.test.tsx` | Update assertions (see Testing) |

### Unchanged components

| Component | Change |
|-----------|--------|
| `SplitSection` | **No v1 change** (duplicate markup in `CatalogSplitSection`) |
| `HeroSection`, `CtaBand`, `Reveal` | Unchanged |

---

## Page implementation

### `src/pages/gaz-page.tsx`

```tsx
const services = getServicesForPage('gaz', servicesCatalog)

return (
  <>
    <HeroSection contactContext="gas" content={hero} />
    {services.map((service, index) => (
      <Reveal key={service.id}>
        <CatalogSplitSection
          variant="service"
          service={service}
          image={gazSplitImages[service.id].image}
          imageAlt={gazSplitImages[service.id].imageAlt}
          number={`0${index + 1}`}
          reverse={index % 2 === 1}
          mutedBackground={index % 2 === 1}
        />
      </Reveal>
    ))}
    <Reveal>
      <CtaBand contactContext="gas" subtitle={ctaBand.description} title={ctaBand.title} />
    </Reveal>
  </>
)
```

Remove `ServiceCatalog` import and flat catalog block.

### `src/pages/remonti-page.tsx`

```tsx
const groups = getRemontiGroupsWithServices(servicesCatalog, remontiGroups)

return (
  <>
    <HeroSection contactContext="remonti" content={hero} />
    {groups.map((group, index) => (
      <Reveal key={group.id}>
        <CatalogSplitSection
          variant="group"
          group={group}
          image={remontiSplitImages[group.id].image}
          imageAlt={remontiSplitImages[group.id].imageAlt}
          number={`0${index + 1}`}
          reverse={index % 2 === 1}
          mutedBackground={index % 2 === 1}
        />
      </Reveal>
    ))}
    <Reveal>
      <CtaBand contactContext="remonti" subtitle={ctaBand.description} title={ctaBand.title} />
    </Reveal>
  </>
)
```

Remove `ServiceCatalog` grouped block.

### `src/pages/gtp-page.tsx`

**No changes.**

---

## Data / content

- **No new types** on `Service` or `ServiceGroupDef`
- **No duplicate copy** in `pages.gaz.sections` or `pages.remonti.sections` (both remain `[]`)
- Image maps + `assertCompleteSplitImageMaps()` live in `src/data/catalog-split-images.ts` (imported by pages; validated at module load)

---

## Error handling

| Case | Behavior |
|------|----------|
| Incomplete image maps | `assertCompleteSplitImageMaps()` throws at **module load** |
| Service without `details` | No expand UI (existing rule) |
| Expand without JS | Native `<details>` still works |
| Unknown map key at runtime | Should be impossible after module-load assert; TypeScript narrows via derived map types |

---

## Testing

| Test file | Coverage |
|-----------|----------|
| `catalog-split-section.test.tsx` | **New** — service variant: `<ul>` wrapper, `h2` title, summary, expand; group variant: `h2`, `max-w-prose` intro, all services in list; section number text; `aria-labelledby` on `<section>`; image `alt` |
| `service-expandable-item.test.tsx` | **`titleAs="h2"`** renders `h2` with expected classes |
| `catalog-split-images.test.ts` | **New** — `assertCompleteSplitImageMaps` passes; throws when entry missing (fixture) |
| `service-catalog.test.tsx` | **Flat variant only** — remove grouped case |
| `service-routes.test.tsx` | `/gaz`: 3 section numbers (`01`–`03`); service **`h2`** titles visible; **no** „Газови услуги” catalog `h2`. `/remonti`: 3 group `h2`s; **all 11 service titles** present; section numbers; contact links unchanged |
| `site-content.test.ts` | Optional: importing split image maps does not throw |
| `e2e/site-smoke.spec.ts` | Existing pass-through OK; route tests carry layout assertions |

**Quality gate:** `pnpm test` and `pnpm build` pass.

---

## Out of scope

- Changing `/gtp` layout or moving GTP service out of bottom flat `ServiceCatalog`
- New photography or `image` fields on catalog entries
- Header/footer contact context changes
- Home page split sections
- `SplitSectionLayout` extract (v1 duplicates markup; follow-up only)
- Scroll/clamp on tall remonti group text columns

---

## Implementation plan

After spec approval, create **`docs/superpowers/plans/2026-07-23-service-split-sections.md`** via the writing-plans skill (TDD task order, file checklist, cleanup verification).

---

## Spec coverage checklist

| Requirement | Section |
|-------------|---------|
| Gaz: 3 service split rows | Information architecture, Page implementation |
| Remonti: 3 group split rows with all 11 services | Information architecture, UI components, Testing |
| Valid `<ul>`/`<li>` markup | Decisions to lock, UI components |
| `/gaz` `h2` service titles | Decisions to lock, Heading outline |
| Summary + „Повече информация” | `ServiceExpandableItem` |
| Reuse existing images + module-load assert | Image mapping |
| GTP unchanged; flat catalog heading rule → `/gtp` only | Supersedes |
| Dead-code cleanup in same PR | Dead-code cleanup |
| Per-row Reveal + unchanged CtaBand Reveal | Approved decisions, Page implementation |
| Tests: numbers, alternating layout, map completeness | Testing |
