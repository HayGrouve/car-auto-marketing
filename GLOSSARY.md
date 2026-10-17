# Domain glossary — Stefi Auto Gas marketing site

Ubiquitous language for architecture reviews and implementation. Route slugs use Bulgarian transliterations where the public URL does (`/gaz`, `/remonti`, `/kontakti`).

## Pages and routes

| Term | Meaning |
|------|---------|
| **SitePath** | Public URL: `'/'`, `'/gtp'`, `'/gaz'`, `'/remonti'`, `'/kontakti'` |
| **Page registry** | `pageRegistry` in `site-content.ts` — single lookup for hero, SEO, contact context, and service layout per path |
| **ГТП / GTP** | Годишен технически преглед — annual vehicle inspection; route `/gtp` |
| **Газови системи / gaz** | LPG/CNG gas systems; route `/gaz` |
| **Ремонти / remonti** | Repairs and maintenance; route `/remonti` |
| **Контакти / kontakti** | Contact page; route `/kontakti` |

## Service catalog

| Term | Meaning |
|------|---------|
| **Service** | Catalog entry: `id`, `title`, `summary`, optional `details`, `page`, optional `groupId` |
| **ServicePage** | `'gtp' \| 'gaz' \| 'remonti'` — partitions `servicesCatalog` |
| **Service page composition** | `ServicePageView` — deep module that builds hero, split rows, details catalog, and CTA for a service page |
| **ServiceGroupDef** | Group metadata + ordered `serviceIds` for remonti split sections |
| **Details catalog** | Expandable service list at the bottom of service pages (formerly `ServiceCatalog`) |

## Contact

| Term | Meaning |
|------|---------|
| **ContactLine** | Phone channel: `id`, labels, E.164, pre-built `phoneHref` / `viberHref` |
| **ContactLineId** | `'service' \| 'inspections' \| 'gas'` — which physical line |
| **ContactContext** | Page-aware routing: `'default' \| 'gtp' \| 'gaz' \| 'remonti'` |
| **Contact surface** | `contact-surface.ts` — resolves context → line, href helpers, shared labels |

## Layout

| Term | Meaning |
|------|---------|
| **SplitLayout** | Shared two-column grid shell (content + image or media slot) |
| **CatalogSplitSection** | Service- or group-specific split row on gaz/remonti |
| **SplitSection** | Generic title/description/image block for home and GTP |
| **CtaBand** | Bottom call-to-action strip with contextual phone/Viber |
| **Reveal** | Scroll-reveal animation wrapper |
