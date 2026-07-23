# Service split sections on `/gaz` and `/remonti` — design spec

## Goal

Replace the flat/grouped `ServiceCatalog` list layout on **`/gaz`** and **`/remonti`** with the **two-column image + text rhythm** used on **`/gtp`** process sections. Each row shows catalog **summary** copy in the text column, with optional **„Повече информация”** expand below — preserving all service content from the centralized catalog without duplicating copy in `site-content`.

Builds on [2026-07-22-services-catalog-gas-page-design.md](./2026-07-22-services-catalog-gas-page-design.md) (implemented).

## Approved decisions

| Topic | Decision |
|-------|----------|
| `/gaz` row unit | **One split row per service** (3 rows) |
| `/remonti` row unit | **One split row per group** (3 rows); text column lists all services in that group |
| Images | **Reuse existing assets** from `site-content` `imageAlts` — fixed mapping by service id (gaz) or group id (remonti); no new catalog fields |
| `/gtp` | **Unchanged** — process `SplitSection`s + flat `ServiceCatalog` at bottom |
| Expand UI | Keep **`ServiceExpandableItem`** behavior (`<details>` / „Повече информация”) |
| Section numbers | **Yes** — `01`–`03` on each page (GTP visual parity) |
| Alternating layout | **Yes** — `reverse` + `mutedBackground` on odd indices (same as GTP process sections) |
| Contact routing | **Unchanged** — `gas` on `/gaz` hero + CtaBand; `remonti` on `/remonti`; header/footer stay `default` |
| Catalog schema | **No changes** — `servicesCatalog`, `remontiGroups`, helpers unchanged |

### Supersedes (prior catalog spec — layout only)

[2026-07-22-services-catalog-gas-page-design.md](./2026-07-22-services-catalog-gas-page-design.md) defines `/gaz` and `/remonti` as `ServiceCatalog`-only bodies. **This spec supersedes those page layout rows:**

| Page | Old layout | New layout |
|------|------------|------------|
| `/gaz` | Hero → flat `ServiceCatalog` („Газови услуги” heading) → CtaBand | Hero → 3× service split rows → CtaBand |
| `/remonti` | Hero → grouped `ServiceCatalog` → CtaBand | Hero → 3× group split rows → CtaBand |
| `/gtp` | Unchanged | Unchanged |

All other catalog-spec decisions (15 services, validation, contact context, SEO, home page) remain in force.

## Resolved clarifications

| # | Question | Decision |
|---|----------|----------|
| 1 | `/remonti` row granularity | **One row per group** — intro + all services in text column |
| 2 | `/gaz` row granularity | **One row per service** — 3 alternating split sections |
| 3 | Image source | **Fixed map** to existing `/images/*` assets in `site-content`; no per-service photos |
| 4 | Component strategy | **New `CatalogSplitSection`** with `service` / `group` variants (Approach 1) |
| 5 | `ServiceCatalog` fate | **Keep component** for `/gtp` flat catalog only; remove usage from `/gaz` and `/remonti` |

---

## Information architecture

### Page structures (after)

| Page | Structure |
|------|-----------|
| `/gaz` | `HeroSection` (`contactContext="gas"`) → 3× `<Reveal><CatalogSplitSection variant="service" /></Reveal>` → `CtaBand` (`contactContext="gas"`) |
| `/remonti` | `HeroSection` (`contactContext="remonti"`) → 3× `<Reveal><CatalogSplitSection variant="group" /></Reveal>` → `CtaBand` (`contactContext="remonti"`) |
| `/gtp` | `HeroSection` → 2× process `SplitSection` → `<Reveal><ServiceCatalog flat /></Reveal>` → `CtaBand` — **no change** |

### Row counts

| Page | Rows | Content per text column |
|------|------|-------------------------|
| `/gaz` | 3 | Single `ServiceExpandableItem` (title, summary, optional expand) |
| `/remonti` | 3 | Group `<h2>` + intro `<p>` + `<ul>` of `ServiceExpandableItem` per service in `serviceIds` order |

Service order follows **`servicesCatalog` declaration order** on `/gaz` (filter `page === 'gaz'`) and **`group.serviceIds` order** on `/remonti` (via `getRemontiGroupsWithServices`).

---

## Image mapping

Images are **not** stored on `Service` or `ServiceGroupDef`. A fixed lookup in `site-content.ts` (or a small colocated `catalog-split-images.ts` re-exported from site-content) maps row keys to existing assets:

### `/gaz` — all services

| Service id | Image | Alt key |
|------------|-------|---------|
| `agu-montazh-remont` | `/images/repairs-section.png` | `imageAlts.gas` |
| `fabrichni-lpg-cng` | `/images/repairs-section.png` | `imageAlts.gas` |
| `parvonachalen-pregled-gaz` | `/images/repairs-section.png` | `imageAlts.gas` |

Same asset on all three rows is intentional until dedicated gas photography exists.

### `/remonti` — by group id

| Group id | Image | Alt key |
|----------|-------|---------|
| `diagnostics-maintenance` | `/images/repairs-section.png` | `imageAlts.repairs` |
| `engine-drivetrain` | `/images/gtp-section.png` | `imageAlts.gtp` |
| `brakes-comfort` | `/images/trust-section.png` | `imageAlts.shop` |

**Lookup failure:** throw at module load or page render if an unknown service/group id is passed — same fail-fast posture as `assertValidServiceCatalog`.

---

## UI components

### `SplitSectionLayout` (optional extract)

**File:** `src/components/site/split-section-layout.tsx` (optional — only if extract reduces duplication cleanly)

Shared two-column shell extracted from `SplitSection`:

- Grid: `grid md:grid-cols-2` with optional `reverse` order swap
- Text column: `px-6 py-12 lg:px-10 lg:py-16`, optional section number, **`children`** for body
- Image column: `aspect-[4/3]`, lazy-loaded `img`, hover scale (match existing `SplitSection`)
- Section wrapper: optional `mutedBackground` → `bg-[#fafafa]`

**Refactor `SplitSection`** to compose `SplitSectionLayout` internally if extracted — behavior and tests for home/GTP process sections must not change.

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

**`variant: 'service'` text column:**

- Optional section number (`01`, `02`, `03`) — same typography as `SplitSection` number
- Render **`ServiceExpandableItem`** as the sole body content (no outer duplicate `<h2>`)
- `ServiceExpandableItem` keeps `<h3>` title, summary `<p>`, optional `<details>`

**`variant: 'group'` text column:**

- Optional section number
- `<h2>` = `group.title` (group heading — replaces flat catalog group `<h2>`)
- `<p>` = `group.intro`
- `<ul className="space-y-8">` of `ServiceExpandableItem` for each service

**Image column:** props `image` + `imageAlt`; same markup as `SplitSection`.

**Accessibility:**

- Preserve `ServiceExpandableItem` title `id` and `aria-labelledby` on expanded regions
- Group `<h2>` is the section heading; service titles remain `<h3>` (correct hierarchy)
- Native `<details>` keyboard behavior unchanged

### Unchanged components

| Component | Change |
|-----------|--------|
| `ServiceExpandableItem` | **No behavior change** |
| `ServiceCatalog` | **Keep** — used on `/gtp` only |
| `ServiceGroupSection` | **Remove usage** from pages; may delete file if nothing imports it after refactor |
| `HeroSection`, `CtaBand`, `Reveal` | Unchanged |

---

## Page implementation

### `src/pages/gaz-page.tsx`

```tsx
// Pseudocode
const services = getServicesForPage('gaz', servicesCatalog)
services.map((service, index) => (
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
))
```

Remove `ServiceCatalog` import and flat catalog block.

### `src/pages/remonti-page.tsx`

```tsx
// Pseudocode
const groups = getRemontiGroupsWithServices(servicesCatalog, remontiGroups)
groups.map((group, index) => (
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
))
```

Remove `ServiceCatalog` grouped block.

### `src/pages/gtp-page.tsx`

**No changes.**

---

## Data / content

- **No new types** on `Service` or `ServiceGroupDef`
- **No duplicate copy** in `pages.gaz.sections` or `pages.remonti.sections` (both remain `[]`)
- Image maps live beside `imageAlts` in `site-content.ts` or a dedicated file imported once by both pages:

```ts
export const gazSplitImages: Record<
  'agu-montazh-remont' | 'fabrichni-lpg-cng' | 'parvonachalen-pregled-gaz',
  { image: string; imageAlt: string }
> = { /* ... */ }

export const remontiSplitImages: Record<
  'diagnostics-maintenance' | 'engine-drivetrain' | 'brakes-comfort',
  { image: string; imageAlt: string }
> = { /* ... */ }
```

Use `satisfies` + keyof checks so catalog id changes fail TypeScript.

---

## Error handling

| Case | Behavior |
|------|----------|
| Unknown image map key | TypeScript prevents at compile time; runtime throw in dev if map incomplete |
| Service without `details` | No expand UI (existing `ServiceExpandableItem` rule) |
| Expand without JS | Native `<details>` still works |

---

## Testing

| Test file | Updates |
|-----------|---------|
| `catalog-split-section.test.tsx` | **New** — service variant renders title/summary/expand; group variant renders h2, intro, multiple services |
| `service-routes.test.tsx` | `/gaz`: expect service `<h3>` titles visible; **remove** „Газови услуги” flat catalog `<h2>` assertion. `/remonti`: expect 3 group `<h2>`s + service summaries; **remove** reliance on `ServiceCatalog` section wrapper |
| `split-section.test.tsx` | Add only if `SplitSection` is refactored to shared layout — assert no regression |
| `e2e/site-smoke.spec.ts` | Optional: assert `/gaz` and `/remonti` still load and show tel links; no strict layout assertion required |

**Quality gate:** `pnpm test` and `pnpm build` pass.

---

## Out of scope

- Changing `/gtp` layout or moving GTP service out of bottom `ServiceCatalog`
- New photography or `image` fields on catalog entries
- Header/footer contact context changes
- Home page split sections
- Deleting `ServiceCatalog` / `ServiceGroupSection` unless confirmed unused after page refactor

---

## Spec coverage checklist

| Requirement | Section |
|-------------|---------|
| Gaz: 3 service split rows | Information architecture, Page implementation |
| Remonti: 3 group split rows with service list | Information architecture, UI components |
| Summary + „Повече информация” | UI components (`ServiceExpandableItem`) |
| Reuse existing images | Image mapping |
| GTP unchanged | Approved decisions |
| No catalog duplication | Data / content |
| Tests updated | Testing |
