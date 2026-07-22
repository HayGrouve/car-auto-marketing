# Services catalog + `/gaz` page — design spec

## Goal

Replace generic repair placeholders with owner-approved **15 real services**, add a fifth nav page **`/gaz`** for LPG/CNG work, and present services with **short summaries** plus optional **„Повече информация”** expand for full text. Update the home page to surface gas alongside ГТП and ремонти.

Builds on [2026-07-22-stefi-auto-gas-content-swap-design.md](./2026-07-22-stefi-auto-gas-content-swap-design.md) (implemented). Extends the site from **4 to 5 public routes**.

### Supersedes (prior content-swap spec)

The content-swap spec states gas is **Контакти-only in UI** (nav/header CTAs omit gas). **This spec supersedes that decision:**

| Surface | Phone shown | Notes |
|---------|-------------|-------|
| `/gaz` Hero + CtaBand | **`0887 816 055`** (gas) | `contactContext="gas"` |
| Header + footer (all pages) | **`0876 689 736`** (service) | **Intentional** — global chrome stays on default service line; no route-aware header context in this scope |
| `/kontakti` gas block | **`0887 816 055`** | Unchanged; optional cross-link to `/gaz` (see Minor items) |

Gas is promoted from contacts-only to a **full nav page** with context-aware page CTAs. JSON-LD already lists all three lines — no schema change.

## Approved decisions

| Topic | Decision |
|-------|----------|
| Architecture | Centralized `services[]` catalog (Approach 2) |
| New route | **`/gaz`** — nav label **„Газови системи”** |
| Content depth | Hybrid — summary always visible; `<details>` expand when `details` field exists |
| Home page | **Option A** — 3 service sections (ГТП · Ремонти · Газ); **drop** „Защо да изберете нас” split section |
| Home stats | Replace **stat 3** (Ловеч) with **`LPG/CNG` / „Монтаж и сервиз на газ”**; new `StatIcon` key **`fuel`** (Lucide `Fuel`) |
| Home hero title | Update to **`ГТП, сервиз и газови системи в Ловеч`** (matches SEO + footer) |
| `/remonti` layout | Grouped categories with service lists + optional expand |
| `/gtp` layout | Keep process split sections; add expandable ГТП service block |
| `/gaz` layout | Hero → ServiceCatalog → CtaBand (**no** intro split section) |
| `/gaz` contact | **`contactContext="gas"`** on Hero + CtaBand only → `0887 816 055` |
| `/gaz` CTA copy | **Page-specific** CtaBand (not shared) — mentions gas |
| Flat catalog heading | Page-specific `<h2>` above flat lists (see UI) |
| Sitemap | Derive paths from `siteContent.navigation`; includes `/gaz` |
| Images | Reuse existing assets until dedicated gas photo; add **`imageAlts.gas`** constant |
| Reveal | New catalog blocks wrapped in `<Reveal>` like existing pages |
| Details bullets | `·` lines stay **plain `<p>`** after `\n\n` split — not converted to `<ul>` |

## Resolved clarifications

| # | Question | Decision |
|---|----------|----------|
| 1 | Home trust section vs gas | **Replace** section index 2 with gas; remove hardcoded trust split section |
| 2 | Header on `/gaz` | **Service line** in header/footer (unchanged global behavior) |
| 3 | Which home stat → LPG/CNG | **Stat index 2** (was „Ловеч” / map-pin) → **`fuel`** icon |
| 4 | `/gaz` intro split | **No** — removed from data model |
| 5 | `sharedCtaBand` | Keep for home/gtp/remonti/kontakti; **`pages.gaz.ctaBand`** is page-specific |
| 6 | `homeTrustPoints` | **Delete** — unused dead data after trust section removal |
| 7 | SEO `repairs` key | **Keep** `seo.repairs` key (matches existing route naming); add **`seo.gaz`** |
| 8 | `ServiceCard` href | Links stay in **`homeSectionLinks`** array in `home-page.tsx` (current pattern); type unchanged |

---

## Information architecture

### Navigation (5 pages)

| Route | Label | Phone context |
|-------|-------|---------------|
| `/` | Начало | `default` → Сервиз (`0876 689 736`) |
| `/gtp` | ГТП | `gtp` → Прегледи (`0876 105 674`) |
| `/gaz` | Газови системи | **`gas`** → Газови системи (`0887 816 055`) |
| `/remonti` | Ремонти | `remonti` → Сервиз (`0876 689 736`) |
| `/kontakti` | Контакти | `default` → Сервиз |

Update `SitePath` union to include `'/gaz'`.

### Service distribution

| Page | Count | Services |
|------|-------|----------|
| `/gaz` | 3 | АГУ монтаж/ремонт · фабрични LPG/CNG · първоначален преглед на газова уредба |
| `/gtp` | 1 | Годишни технически прегледи |
| `/remonti` | 11 | All general repair/maintenance services (3 groups) |

**Total: 15 services.**

### `/remonti` groups

| Group ID | Title | Services |
|----------|-------|----------|
| `diagnostics-maintenance` | Диагностика и поддръжка | Компютърна диагностика · Смяна масла и филтри · Проверка и регулиране на светлини |
| `engine-drivetrain` | Двигател, ходова част и управление | Диагностика/ремонт дизел и бензин · Шлайф цилиндрови глави · Ремонт ходова част · Смяна ангренаж · Реглаж преден/заден мост |
| `brakes-comfort` | Спирачки и комфорт | Смяна накладки · Ремонт спирачна система · Климатична и отоплителна система |

---

## Data model

### Types (`src/data/site-content.ts`)

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

export type StatIcon = 'clipboard-check' | 'calendar-days' | 'fuel'  // replaces 'map-pin' on home stats
```

Extend `ContactContext`:

```ts
export type ContactContext = 'default' | 'gtp' | 'gaz' | 'remonti'
```

### Catalog + helpers

- `services: readonly Service[]` — all 15 entries with Bulgarian copy (see Content catalog below)
- `repairs.groups: readonly ServiceGroupDef[]` — three remonti groups referencing service IDs
- `gas` top-level object — hero copy only (mirrors `gtp` / `repairs` pattern)
- `pages` record — extend to **`Record<'home' | 'gtp' | 'gaz' | 'remonti' | 'kontakti', PageContent>`**
- `pages.gaz` — hero, **`ctaBand`** (page-specific), no `sections` split blocks
- Helpers in `src/lib/services.ts`:
  - `getServicesForPage(page: ServicePage): Service[]`
  - `getRemontiGroupsWithServices(): Array<ServiceGroupDef & { services: Service[] }>`
  - **`assertValidServiceCatalog()`** — called at module load from `site-content.ts`

**Catalog rules:**

- `details` omitted → no expand UI
- `groupId` **required** when `page === 'remonti'`; must match a `repairs.groups[].id`
- Service order on each page follows `serviceIds` array order / catalog declaration order, not alphabetical

**Validation (`assertValidServiceCatalog`) — fail fast at module load:**

| Rule | Error if violated |
|------|-------------------|
| Unique service `id` values | Duplicate id |
| Every `serviceIds` entry exists in `services[]` | Unknown id in group |
| Every `page === 'remonti'` service has valid `groupId` | Missing or unknown `groupId` |
| Every remonti service appears in **exactly one** group | Orphan or double-assigned service |
| Group `serviceIds` length matches remonti service count | Count mismatch (expect 11) |

### Remove / refactor (no parallel content sources)

| Removed | Replacement |
|---------|-------------|
| `ServiceGroup` type with `items: string[]` | `ServiceGroupDef` + `services[]` |
| `pages.remonti.sections` placeholder split sections | `ServiceCatalog` grouped UI only |
| `homeTrustPoints` + trust split section (index 2) | Third **gas** service section from `homeServiceCards[2]` |
| Generic remonti group copy in split sections | Group intros in `repairs.groups[].intro` |

After implementation, **`repairs.groups` is the only remonti grouping source**; catalog is the only service copy source.

---

## UI components

### `ServiceExpandableItem`

**File:** `src/components/site/service-expandable-item.tsx`

- Renders service **title** (`<h3>`) and **summary** (`<p>`) — summary is **always visible** outside `<details>`
- When `details` is set: `<details>` below summary with `<summary>Повече информация</summary>`; expanded region holds detail paragraphs only
- Split `details` on `\n\n` into multiple `<p>` elements
- **Bullet lines (`· …`) render as plain paragraphs**, not `<ul>/<li>` — intentional; do not “fix” later
- Match existing typography: `#0a0a0a` titles, `#525252` body, no new accent colors

**Accessibility:**

- `<summary>` must not duplicate the visible summary paragraph (current design satisfies this)
- Give each service title a stable `id`; optional `aria-labelledby` on expanded content region
- Keyboard: native `<details>` toggle; logical tab order title → summary → next service

### `ServiceGroupSection`

**File:** `src/components/site/service-group-section.tsx`

- Group title (`<h2>` or `<h3>` depending on page depth)
- Group intro paragraph
- `<ul className="space-y-6">` of `ServiceExpandableItem`

### `ServiceCatalog`

**File:** `src/components/site/service-catalog.tsx`

Props:

```ts
type ServiceCatalogProps =
  | { variant: 'flat'; heading: string; services: Service[] }
  | { variant: 'grouped'; groups: Array<ServiceGroupDef & { services: Service[] }> }
```

- **Flat variant:** render page-specific `<h2>{heading}</h2>` above the service list (grouped variant uses per-group `<h2>` from group titles)
- Flat catalog headings: **`/gaz`** → „Газови услуги”; **`/gtp`** → „Годишен технически преглед — подробности”
- Padding/rhythm: `px-6 py-12 lg:px-10 lg:py-16`, consistent with `SplitSection` text column
- Wrap catalog blocks in **`<Reveal>`** (same as hero-adjacent sections on other pages)

### Page layouts

| Page | Structure |
|------|-----------|
| `/gaz` | `HeroSection` (`contactContext="gas"`) → `<Reveal><ServiceCatalog flat /></Reveal>` → `CtaBand` (`contactContext="gas"`, page-specific copy) |
| `/gtp` | `HeroSection` (`contactContext="gtp"`) → 2 split sections (process) → `<Reveal><ServiceCatalog flat /></Reveal>` → `CtaBand` (`contactContext="gtp"`, shared) |
| `/remonti` | `HeroSection` (`contactContext="remonti"`) → `<Reveal><ServiceCatalog grouped /></Reveal>` → `CtaBand` (`contactContext="remonti"`, shared) |

**New files:** `src/routes/gaz.tsx`, `src/pages/gaz-page.tsx` (mirror gtp/remonti pattern).

### Home page updates (Option A)

**Before (3 sections):** ГТП · Ремонти · „Защо да изберете нас”  
**After (3 sections):** ГТП · Ремонти · **Газови системи**

| Field | Target |
|-------|--------|
| `homeHero.title` | **`ГТП, сервиз и газови системи в Ловеч`** |
| `homeHero.description` | Mention all three offerings; keep call-to-action tone |
| `homeServiceCards` | Three cards — indices 0/1 unchanged; **index 2 = Газови системи** |
| `pages.home.sections` | Built from all three `homeServiceCards` (remove hardcoded trust section) |
| `homeSectionLinks` | `[0]` → `/gtp`, `[1]` → `/remonti`, `[2]` → `/gaz` (`Повече за газ`) |
| `pages.home.stats[2]` | **`{ value: 'LPG/CNG', label: 'Монтаж и сервиз на газ', icon: 'fuel' }`** |
| `homeTrustPoints` | **Delete** export and const |
| `navigation` | Insert `{ to: '/gaz', label: 'Газови системи' }` after ГТП, before Ремонти |

**Images:** Gas section uses `/images/repairs-section.png`; add **`imageAlts.gas`** = „Монтаж и сервиз на газова уредба в автосервиз” in `imageAlts` const (used by home section + `/gaz` hero).

### CTA band copy

**Shared** (`sharedCtaBand`) — unchanged for home, gtp, remonti, kontakti:

> „Свържете се с нас за преглед или ремонт”

**`/gaz` page-specific** (`pages.gaz.ctaBand`):

```ts
{
  title: 'Обадете се за газови системи',
  description: 'Монтаж, ремонт или преглед на LPG/CNG — направете едно обаждане на линията за газови системи.',
}
```

---

## Contact routing

Update `src/lib/contact-context.ts`:

```ts
case 'gas':
  return findLineById('gas')
```

| Context | Resolved line |
|---------|---------------|
| `default` | `service` |
| `gtp` | `inspections` |
| `gaz` | **`gas`** |
| `remonti` | `service` |

`/gaz` passes `contactContext="gas"` to `HeroSection` and `CtaBand` only.

**Header / footer on `/gaz`:** still resolve **`default`** → service line (`0876 689 736`). Visitors who need gas specifically use the hero/CTA or Контакти gas block.

---

## SEO

### New SEO entry

```ts
gaz: {
  title: 'Газови системи',
  description:
    'Монтаж, ремонт и първоначален преглед на LPG/CNG газови уредби в Ловеч — Stefi Auto Gas.',
}
```

### Updated SEO

```ts
home: {
  title: 'Начало',
  description:
    'ГТП, автосервиз и газови системи в Ловеч — Stefi Auto Gas. Запишете час по телефона.',
}
```

`buildSeoHead` for `/gaz` uses path `'/gaz'`. JSON-LD structure unchanged (gas line already in `contactPoint[]`).

### Sitemap / robots

**File:** `scripts/generate-seo-files.mjs`

Replace hardcoded 4-path array with paths derived from **`siteContent.navigation`** (or a shared exported `publicPaths` list in `site-content.ts` imported by the script). Must include **`/gaz`**.

`pnpm build` runs `prebuild` → sitemap generation; regenerated **`public/sitemap.xml`** must list 5 URLs.

**Optional alignment:** `public/manifest.json` `name` → **`Stefi Auto Gas — ГТП, сервиз и газови системи`** (footer tagline already mentions gas).

---

## Content catalog

All copy is **Bulgarian**. Summaries are site-scannable (2–4 sentences). `details` uses owner-provided text, lightly edited for consistency (punctuation, line breaks) without changing meaning.

### `/gaz` services

#### `agu-montazh-remont` — Монтаж, ремонт и обслужване на автомобилни газови уредби (LPG и CNG)

**Summary:** Монтираме и обслужваме ръчно монтирани АГУ — LPG и CNG (BRC, Prins, LandiRenzo). С газ можете да намалите разходите за гориво значително, а съвременните системи работят и на двигатели с директно впръскване. Обадете се за оценка на автомобила и консултация.

**Details:**

```
Газовите уредби са изключително популярни — атрактивни както финансово, така и от екологична гледна точка. Последното поколение газови уредби могат да се монтират и на модерни двигатели с директно впръскване.

С монтирането на газова система в автомобила можете да намалите разходите си за гориво наполовина. Използването на LPG води до значително намаляване на вредните вещества в изгорелите газове и способства за опазване на околната среда. При съвременните газови уредби почти не се забелязва загуба на мощност и въртящ момент.

В услугата се включва:
· Оценка на състоянието на двигателя
· Монтиране на газовата система и всички компоненти
· Издаване на необходимите документи

Независимо каква система изберете, добрата работа и поддръжка на колата на бензин са задължителни, за да работи безпроблемно и на газ. Особено важни са системата за подаване на бензин и поддръжката на системата за запалване — бобини, свещи и кабели за свещи.

След монтажа на газовата система е задължително да се мине първоначален технически преглед в специализиран пункт. След това газовата уредба трябва да се регистрира в КАТ.
```

#### `fabrichni-lpg-cng` — Ремонт на фабрични LPG и CNG системи

**Summary:** Ремонтираме и настройваме фабрично монтирани LPG и CNG системи — смяна на компоненти, инжектори и редуктори. Обадете се и опишете проблема.

**Details:**

```
Ремонтът може да включи смяна на всеки един от компонентите на системата.

· Настройка на газовата уредба (CNG/LPG)
· Смяна на инжектор на газовата уредба (CNG/LPG)
· Смяна на редуктор на газовата уредба (CNG/LPG)
```

#### `parvonachalen-pregled-gaz` — Първоначален технически преглед на газова уредба

**Summary:** Извършваме първоначален преглед на газова уредба след монтаж или промяна на елементи — необходим за регистрация в КАТ. Носете протокол от оторизирана фирма за монтаж.

**Details:**

```
Първоначален преглед е проверка за установяване на съответствието на газовата уредба с изискванията по чл. 20 от Наредба Н-3 за извършване на монтаж на газова уредба или след промяна на някои от елементите на газовата уредба.

Всички автомобили с газови уредби, регистрирани след 1-ви март 2014 г., подлежат на първоначален преглед.

За явяване на първоначален преглед е необходимо собственикът на автомобила да притежава протокол от оторизирана фирма за монтаж на газови уредби. С протокола за монтаж на бутилката трябва да посетите пункт за първоначално въвеждане в експлоатация на газовата уредба.

След като преминете първоначален технически преглед на газовата уредба ще получите удостоверение, с което можете да отидете в КАТ, където да подменят талоните на автомобила. Трябва да носите големия и малкия талон, както и гражданска отговорност.
```

### `/gtp` service

#### `godishen-tehnicheski-pregled` — Годишни технически прегледи

**Summary:** Годишен технически преглед за автомобили до 3,5 т. — около 20 минути. Запишете час по телефона и ще ви кажем какво да носите.

**Details:**

```
Периодичният технически преглед трае около 20 мин.

Автомобили до 3,5 т. преминават ГТП на ППС един път годишно. Таксиметрови автомобили преминават ГТП веднъж на всеки 6 месеца. Измерването на 4×4 автомобили се извършва в съответствие с препоръките на производителите със специализирани за целта стендове и е напълно безопасно за автомобила.

Първият ГТП на новозакупен автомобил се извършва на 3-тата година преди датата на първа регистрация. Вторият — на 5-тата година от датата на първа регистрация. ГТП на ремаркета се извършва веднъж на 2 години.

Системата автоматично разпознава платения пътен данък, независимо от начина на плащане. (Препоръчително е да носите някакъв документ, но ако не го носите не е проблем.)

При ГТП се оглежда цялостното състояние на автомобила, отбелязано в следните точки:

· Идентификация на ППС (табели с рег. номер, документация, VIN и др.)
· Оборудване на спирачната уредба (функциониране, състояние, ръчна спирачка, ABS и др.)
· Кормилно управление (механично състояние, хлабини, серво и др.)
· Видимост (поле на видимост, състояние на стъклата, огледала за обратно виждане, чистачки и др.)
· Светлини, светлоотразители и електрическо оборудване (фарове, габарити, стопове, мигачи, аварийни светлини, акумулатор и др.)
· Оси, колела, гуми и окачване
· Шаси и оборудване свързано с шасито (рама, каросерия и др.)
· Друго оборудване (колани, пожарогасител, аптечка, клаксон, скоростомер и др.)
· Вредно въздействие (шум, емисии от отработили газове, течове)
```

### `/remonti` services

#### Group: `diagnostics-maintenance`

##### `kompyutarna-diagnostika` — Компютърна диагностика

**Summary:** Компютърна диагностика и изчистване на грешки за леки и товарни автомобили на 12 V и 24 V. Следим параметрите в реално време и извършваме адаптации, когато е необходимо.

**Details:**

```
Компютърна диагностика и изчистване на грешки.

· Следене на стойностите на сигналите от датчиците в реален режим на работа
· Задействане на изпълнителни механизми за по-лесно диагностициране
· Нулиране и задаване на нови сервизни настройки
· Промяна на базисните настройки на наличните контролери
· Извършване на адаптации
```

##### `smqna-masla-filtri` — Смяна масла и филтри

**Summary:** Смяна на масло и филтри за леки автомобили, джипове и бусове. Използваме висококачествени масла и филтри.

*(No `details` — summary only.)*

##### `proverka-svetlini` — Проверка и регулиране на светлини

**Summary:** Проверяваме и регулираме предни и задни светлини — важно за безопасността и успешен преглед.

*(No `details` — summary only.)*

#### Group: `engine-drivetrain`

##### `remont-dizel-benzin` — Диагностика и ремонт на дизелови и бензинови двигатели

**Summary:** Диагностицираме и ремонтираме дизелови и бензинови двигатели — от компютърна диагностика до механични компоненти, турбокомпресори и изпускателна система.

**Details:**

```
Диагностициране с професионален тестер, показващ грешките в работата на двигателя, изчистване на грешки, наблюдаване в реално време на параметрите и сравняване с еталонните стойности за съответния автомобил.

· Диагностика и ремонт на компонентите за захранване и впръскване на горивото
· Диагностика и ремонт на запалителната система, поддържащата електроника и зарядната система
· Диагностика и ремонт на механичните части — вериги, ремъци, ролки, обтегачи и зъбни колела
· Преглед и подмяна на агрегати по периферията на двигателя — компресори, хидравлична помпа, стартер, алтернатор
· Диагностика и ремонт на турбокомпресори, настройка на параметрите им
· Ремонт на скоростни кутии
· Диагностика и ремонт на изпускателна система, смяна на колектори, гарнитури, катализатори, DPF филтри
```

##### `shlaif-cilindrovi-glavi` — Шлайф и ремонт на цилиндрови глави

**Summary:** Ремонт на цилиндрови глави за леки, лекотоварни автомобили, камиони и транспортна техника — шлайф, проверка за пукнатини, обработка на клапани и легла.

**Details:**

```
Ремонт на цилиндрови глави на леки, лекотоварни автомобили, камиони и всякакъв вид транспортна техника. Предлагаме измиване на цилиндровата глава, шлайф на лицето на главата, проверка за пукнатини, обработка на фаските на клапани и техните легла. Също така подмяна на водачи на клапани и райбероване, подмяна на клапанни легла, заваряване, изработване на ремонтни легла и водачи.
```

##### `remont-hodova-chast` — Ремонт ходова част

**Summary:** Диагностицираме и ремонтираме ходовата част — амортисьори, лагери, тампони, ресори и свързани елементи. Ранната диагностика предотвратява по-скъпи ремонти.

**Details:**

```
Всички механизми, които осигуряват взаимодействието между колелата и носещите детайли на автомобила, формират неговата ходова част — рама, оси, окачвания, ресори, амортисьори, напречни и надлъжни щанги, мостове, колела и гуми.

Ремонтът на ходовата част се състои в подмяна на износените части. Диагностиката включва проверка на:

· амортисьори, лостове, пружини, опорни шайби
· кормилни уплътнения, сачмени лагери
· лагерите на колелата
· херметичността на спирачната система и хидравличните системи
· износване на дискове, маркучи, спирачни накладки и барабани

Редовната диагностика може да открие проблеми на ранен етап, преди да се появят ясни признаци за дефектирали елементи.
```

##### `smqna-angrenaj` — Смяна ангренаж

**Summary:** Смяна на ангренажен ремък или верига — превантивна поддръжка, която пази двигателя от скъпи повреди.

*(No `details`.)*

##### `reglaz-mostove` — Регулиране на преден и заден мост (реглаж)

**Summary:** Реглаж на преден и заден мост — препоръчителен при смяна на гуми и джанти, задължителен след ремонт на кормилно управление и ходова част.

*(No `details`.)*

#### Group: `brakes-comfort`

##### `smqna-nakladki` — Смяна накладки

**Summary:** Смяна на спирачни накладки — бърза услуга, която поддържа спирачната система в безопасно състояние.

*(No `details`.)*

##### `remont-spirachna-sistema` — Ремонт спирачна система

**Summary:** Пълен сервиз на спирачната система — проверка на маркучи, дискове, бутала, течност и обезвъздушаване.

**Details:**

```
· Проверка на стоманени и гумени спирачни маркучи
· Измерване на дебелината на спирачните накладки; проверка за ръб на дисковете, дебелина на дисковете и диаметър на барабаните
· Проверка на състоянието на буталата в спирачните апарати и цилиндрите
· Доливане или смяна на спирачната течност
· Обезвъздушаване на спирачната система
```

##### `klimatichna-otopliteltna` — Ремонт и диагностика на климатична и отоплителна система

**Summary:** Диагностика, пълнене с фреон и масло, тест за утечки и смяна на филтъра за купе — за комфортна и безопасна климатична система.

**Details:**

```
Диагностика:
· Източване на системата и пълнене с фреон и масло за компресора
· Тест за утечки
· Проверка на налягането и функциите
· Смяна на филтъра за купе
```

### Home page card copy (not in catalog)

**Газови системи card summary:** `Монтаж, ремонт и преглед на LPG/CNG газови уредби — намалете разходите за гориво и минете необходимите прегледи при нас.`

**Group intros (`/remonti`):**

| Group | Intro |
|-------|-------|
| Диагностика и поддръжка | Редовна поддръжка и точна диагностика — основата на надеждната кола. |
| Двигател, ходова част и управление | От двигателя до окачването и реглажа — грижим се за механиката, с която сте на пътя всеки ден. |
| Спирачки и комфорт | Безопасност и комфорт — спирачки, накладки и климатична система. |

**`/gaz` hero description:** `Монтаж, ремонт и преглед на LPG/CNG газови уредби в Ловеч. Обадете се на линията за газови системи и ще ви насочим.`

---

## Error handling

- **Invalid catalog:** `assertValidServiceCatalog()` throws at module load (same pattern as missing contact line)
- **Expand without JS:** native `<details>` works without JavaScript
- **Long expanded text on mobile:** no max-height trap; page scrolls naturally
- **Missing image:** alt text + layout unchanged (existing pattern)

---

## Testing

| File | Assertions |
|------|------------|
| `src/data/site-content.test.ts` | 15 services; page counts; 5 nav routes; **`homeTrustPoints` removed**; stat[2] is `fuel` |
| `src/lib/services.test.ts` | Group resolution; order preserved; validation throws on bad fixture |
| `src/lib/contact-context.test.ts` | `gas` → gas line E.164 |
| `src/components/site/service-expandable-item.test.tsx` | Expand absent without `details`; present with `details`; bullets stay in `<p>` |
| `src/components/site/service-catalog.test.tsx` | Flat heading rendered; grouped h2 per group |
| `src/components/site/site-header.test.tsx` | **5 nav links** including „Газови системи” |
| `src/components/site/stat-icon.test.tsx` (or extend existing) | `fuel` icon renders |
| `src/routes/service-routes.test.tsx` | `/gaz` hero + 3 services + gas phone; **remonti** expects new group titles (not „Диагностика и обслужване”) |
| `src/routes/index.test.tsx` | Home section[2] is gas; link to `/gaz`; **no** „Защо да изберете нас” section |
| `src/lib/seo.test.ts` | `seo.gaz` entry; updated `seo.home.description` |
| `scripts/generate-seo-files.mjs` or sitemap test | **`/gaz`** present in generated sitemap |
| `e2e/site-smoke.spec.ts` | **`sitePaths`** includes `/gaz`; nav to `/gaz`; `/gaz` hero tel `887816055`; **active nav** on `/gaz`; 5 nav items; tel/viber loop covers `/gaz` |

**Quality gate:** `pnpm test` and `pnpm build` pass (build regenerates sitemap with 5 paths).

---

## Definition of done

- [ ] `services[]` catalog with all 15 services and Bulgarian copy; **`assertValidServiceCatalog()`** at load
- [ ] `/gaz` route, page, nav entry, **`seo.gaz`**, page-specific CtaBand, `contactContext="gas"` on hero/CTA
- [ ] `ServiceCatalog` + `ServiceExpandableItem` on `/gaz`, `/gtp`, `/remonti` (inside `<Reveal>`)
- [ ] `/remonti` grouped catalog only — **`pages.remonti.sections` removed**
- [ ] `/gtp` retains process split sections + expandable ГТП catalog block
- [ ] Home: **3 service sections** (ГТП · Ремонти · Газ); trust section + **`homeTrustPoints` removed**
- [ ] Home hero title + stat[2] (`fuel` / LPG/CNG) updated
- [ ] `ContactContext` includes `gas`; resolver tested; header/footer stay on service line
- [ ] **`scripts/generate-seo-files.mjs`** derives 5 paths; **`public/sitemap.xml`** regenerated
- [ ] All tests in table above updated or added
- [ ] `pnpm test` and `pnpm build` green

---

## Files touched (summary)

**New:**

- `src/routes/gaz.tsx`
- `src/pages/gaz-page.tsx`
- `src/lib/services.ts` (+ test)
- `src/components/site/service-expandable-item.tsx` (+ test)
- `src/components/site/service-group-section.tsx`
- `src/components/site/service-catalog.tsx` (+ test)

**Modified:**

- `src/data/site-content.ts` (+ test)
- `src/lib/contact-context.ts` (+ test)
- `src/lib/seo.test.ts`
- `src/components/site/stat-icon.tsx` (+ test if split)
- `src/components/site/site-header.test.tsx`
- `src/pages/home-page.tsx`
- `src/pages/gtp-page.tsx`
- `src/pages/remonti-page.tsx`
- `src/routes/index.test.tsx`
- `src/routes/service-routes.test.tsx`
- `scripts/generate-seo-files.mjs`
- `public/sitemap.xml` (regenerated)
- `e2e/site-smoke.spec.ts`
- `src/routeTree.gen.ts` (generated by router)

**Optional:**

- `public/manifest.json` — align `name` with gas mention
- `src/components/site/contact-details.tsx` — cross-link „Вижте страницата за газови системи” near gas phone block

**Not modified:** favicon, domain config, map embed, contact address/hours
