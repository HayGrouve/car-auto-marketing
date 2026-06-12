# Footer Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat single-row footer with a structured light two-column layout (brand + nav | contact) and a separate copyright bar.

**Architecture:** Add a minimal `footer` block to `site-content.ts`. Split presentation into three focused subcomponents (`FooterBrand`, `FooterNav`, `FooterContact`) composed by `SiteFooter`. Reuse contact link/icon patterns from `contact-details.tsx`. Remove dead `.site-footer` CSS.

**Tech Stack:** TanStack Start, React 19, TanStack Router `Link`, Lucide React, Vitest, Testing Library

**Spec:** [`docs/superpowers/specs/2026-06-12-footer-redesign-design.md`](../specs/2026-06-12-footer-redesign-design.md)

---

## File map

| File | Responsibility |
|------|----------------|
| `src/data/site-content.ts` | `FooterContent` type + `footer` block |
| `src/data/site-content.test.ts` | Assert footer content exists |
| `src/components/site/footer-brand.tsx` | Brand name + tagline |
| `src/components/site/footer-nav.tsx` | Vertical footer navigation |
| `src/components/site/footer-contact.tsx` | Address, hours, phone, Viber, Maps |
| `src/components/site/site-footer.tsx` | Grid shell + copyright bar |
| `src/components/site/site-footer.test.tsx` | Full footer render tests |
| `src/styles.css` | Remove unused `.site-footer` rule |

---

### Task 1: Footer content data model

**Files:**
- Modify: `src/data/site-content.ts`
- Modify: `src/data/site-content.test.ts`
- Test: `src/data/site-content.test.ts`

- [ ] **Step 1: Write the failing test**

Add to `src/data/site-content.test.ts`:

```ts
it('exposes footer tagline and contact heading', () => {
  expect(siteContent.footer.tagline).toContain('Ловеч')
  expect(siteContent.footer.contactHeading).toBe('Контакти')
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/data/site-content.test.ts`
Expected: FAIL — `siteContent.footer` is undefined

- [ ] **Step 3: Add FooterContent type and footer block**

In `src/data/site-content.ts`, add after `PageCta`:

```ts
export type FooterContent = {
  tagline: string
  contactHeading: string
}
```

In the `siteContent` export object, add before `navigation`:

```ts
footer: {
  tagline: 'ГТП и автосервиз в Ловеч',
  contactHeading: 'Контакти',
} satisfies FooterContent,
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/data/site-content.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/data/site-content.ts src/data/site-content.test.ts
git commit -m "Add footer content block to site data."
```

---

### Task 2: FooterBrand component

**Files:**
- Create: `src/components/site/footer-brand.tsx`
- Test: `src/components/site/site-footer.test.tsx` (created in Task 5 — skip isolated test here)

- [ ] **Step 1: Create footer-brand.tsx**

```tsx
import { siteContent } from '#/data/site-content'

export function FooterBrand() {
  return (
    <div className="space-y-2">
      <p className="text-lg font-extrabold text-[#1e3a8a]">
        {siteContent.brandName}
      </p>
      <p className="max-w-xs text-sm text-[#525252]">
        {siteContent.footer.tagline}
      </p>
    </div>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `pnpm exec tsc --noEmit 2>/dev/null || pnpm lint`
Expected: No errors referencing `footer-brand.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/site/footer-brand.tsx
git commit -m "Add FooterBrand component for footer tagline."
```

---

### Task 3: FooterNav component

**Files:**
- Create: `src/components/site/footer-nav.tsx`

- [ ] **Step 1: Create footer-nav.tsx**

```tsx
import { Link } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'

const footerNavLinkClassName =
  'text-sm text-[#525252] hover:text-[#1e3a8a]'

export function FooterNav() {
  return (
    <nav aria-label="Футър навигация" className="mt-6 space-y-2">
      {siteContent.navigation.map((item) => (
        <Link
          className={footerNavLinkClassName}
          key={item.to}
          to={item.to}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
```

Note: `vitest.setup.ts` mocks `Link` as `<a href={to}>`, so tests will see plain anchor `href` attributes.

- [ ] **Step 2: Verify lint passes**

Run: `pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/site/footer-nav.tsx
git commit -m "Add FooterNav with stacked footer navigation links."
```

---

### Task 4: FooterContact component

**Files:**
- Create: `src/components/site/footer-contact.tsx`

- [ ] **Step 1: Create footer-contact.tsx**

Mirror `contact-details.tsx` patterns at footer scale (`text-sm` instead of `text-lg`):

```tsx
import { Clock, ExternalLink, MapPin, Phone } from 'lucide-react'
import { siteContent } from '#/data/site-content'
import { ViberIcon } from '#/components/site/viber-icon'

export function FooterContact() {
  const {
    phoneHref,
    phoneDisplay,
    viberHref,
    viberLabel,
    address,
    hours,
    mapsLink,
  } = siteContent.contact

  return (
    <div className="space-y-4 text-[#0a0a0a]">
      <p className="text-xs font-bold uppercase tracking-widest text-[#525252]">
        {siteContent.footer.contactHeading}
      </p>

      <p className="inline-flex items-start gap-2 text-sm leading-6 text-[#525252]">
        <MapPin aria-hidden className="mt-0.5 size-4 shrink-0" />
        {address}
      </p>

      <ul className="space-y-1 text-sm leading-6 text-[#525252]">
        {hours.map((row) => (
          <li className="inline-flex items-start gap-2" key={row}>
            <Clock aria-hidden className="mt-0.5 size-4 shrink-0" />
            {row}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-2">
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
          href={phoneHref}
        >
          <Phone aria-hidden className="size-4 shrink-0" />
          {phoneDisplay}
        </a>
        <a
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#7360f2] underline-offset-4 hover:text-[#5a4fd1] hover:underline"
          href={viberHref}
        >
          <ViberIcon className="size-4 shrink-0" />
          {viberLabel}
        </a>
      </div>

      <a
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#1e3a8a] underline-offset-4 hover:text-[#1e40af] hover:underline"
        href={mapsLink}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ExternalLink aria-hidden className="size-4 shrink-0" />
        Отвори в Google Maps
      </a>
    </div>
  )
}
```

- [ ] **Step 2: Verify lint passes**

Run: `pnpm lint`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/components/site/footer-contact.tsx
git commit -m "Add FooterContact with address, hours, and channel links."
```

---

### Task 5: SiteFooter layout + tests

**Files:**
- Modify: `src/components/site/site-footer.tsx`
- Create: `src/components/site/site-footer.test.tsx`

- [ ] **Step 1: Write the failing footer test**

Create `src/components/site/site-footer.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react'
import { SiteFooter } from '#/components/site/site-footer'
import { siteContent } from '#/data/site-content'

function expectFooterNavLink(name: string, href: string) {
  const footerNav = screen.getByRole('navigation', { name: 'Футър навигация' })
  const link = screen.getByRole('link', { name })
  expect(footerNav.contains(link)).toBe(true)
  expect(link).toHaveAttribute('href', href)
}

describe('SiteFooter', () => {
  it('renders brand, navigation, contact details, and copyright', () => {
    render(<SiteFooter />)

    expect(screen.getByText(siteContent.brandName)).toBeInTheDocument()
    expect(screen.getByText(siteContent.footer.tagline)).toBeInTheDocument()

    expectFooterNavLink('Начало', '/')
    expectFooterNavLink('ГТП', '/gtp')
    expectFooterNavLink('Ремонти', '/remonti')
    expectFooterNavLink('Контакти', '/kontakti')

    expect(screen.getByText(siteContent.footer.contactHeading)).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.address)).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.hours[0])).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.hours[1])).toBeInTheDocument()

    const phoneLink = screen.getByRole('link', {
      name: siteContent.contact.phoneDisplay,
    })
    expect(phoneLink).toHaveAttribute('href', siteContent.contact.phoneHref)

    const viberLink = screen.getByRole('link', {
      name: siteContent.contact.viberLabel,
    })
    expect(viberLink).toHaveAttribute('href', siteContent.contact.viberHref)

    const mapsLink = screen.getByRole('link', { name: 'Отвори в Google Maps' })
    expect(mapsLink).toHaveAttribute('href', siteContent.contact.mapsLink)
    expect(mapsLink).toHaveAttribute('target', '_blank')
    expect(mapsLink).toHaveAttribute('rel', 'noopener noreferrer')

    const year = new Date().getFullYear().toString()
    expect(screen.getByText(`© ${year} ${siteContent.brandName}`)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test src/components/site/site-footer.test.tsx`
Expected: FAIL — missing footer nav, tagline, stacked hours, Viber label, etc.

- [ ] **Step 3: Refactor site-footer.tsx**

Replace entire `src/components/site/site-footer.tsx`:

```tsx
import { FooterBrand } from '#/components/site/footer-brand'
import { FooterContact } from '#/components/site/footer-contact'
import { FooterNav } from '#/components/site/footer-nav'
import { siteContent } from '#/data/site-content'

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#e5e5e5] bg-white px-6 py-10 lg:px-10 lg:py-12">
      <div className="grid gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <FooterBrand />
          <FooterNav />
        </div>
        <FooterContact />
      </div>
      <p className="mt-8 border-t border-[#e5e5e5] pt-6 text-xs text-[#525252]">
        © {year} {siteContent.brandName}
      </p>
    </footer>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test src/components/site/site-footer.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/site/site-footer.tsx src/components/site/site-footer.test.tsx
git commit -m "Refactor SiteFooter into two-column layout with tests."
```

---

### Task 6: Remove dead CSS

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Delete unused `.site-footer` rule**

Remove from `src/styles.css` (lines ~355–358):

```css
.site-footer {
  border-top: 1px solid var(--line);
  background: color-mix(in oklab, var(--header-bg) 84%, transparent 16%);
}
```

- [ ] **Step 2: Verify build and lint**

Run: `pnpm lint && pnpm build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/styles.css
git commit -m "Remove unused site-footer CSS rule."
```

---

### Task 7: Final verification

**Files:**
- None (verification only)

- [ ] **Step 1: Run full test suite**

Run: `pnpm test`
Expected: All tests PASS (count increases by 2: site-content footer test + site-footer test)

- [ ] **Step 2: Run lint**

Run: `pnpm lint`
Expected: PASS

- [ ] **Step 3: Manual visual check**

Run: `pnpm dev`
Visit `/` and `/kontakti`. Confirm:
- Two columns on desktop, stacked on mobile
- Viber link shows label text
- Copyright bar separated by border
- Footer does not duplicate CTA band buttons

- [ ] **Step 4: Commit plan doc (if not already committed)**

```bash
git add docs/superpowers/plans/2026-06-12-footer-redesign.md
git commit -m "Add footer redesign implementation plan."
```

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Two-column layout | Task 5 |
| Copyright bar | Task 5 |
| Footer subcomponents | Tasks 2–5 |
| `footer` in site-content | Task 1 |
| Contact block parity | Task 4 |
| Viber label bug fix | Task 4 |
| Remove `.site-footer` CSS | Task 6 |
| `site-footer.test.tsx` | Task 5 |
| Footer nav `aria-label` | Task 3 |
| Maps `rel` + `target` | Task 4 |
| E2e extension | Out of scope (optional follow-up) |

## Out of scope (per spec)

- Logo image, social links, newsletter, legal pages
- Dark footer variant
- Duplicate CTA buttons in footer
