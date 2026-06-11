# Design Spec: Lovech Car Service Marketing Site

## Overview

This document defines the v1 design for a small marketing website for a car service business in `гр. Ловеч`.

The business has two main offerings:

- `Годишен технически преглед`
- General car repairs and maintenance

The site UI will be **Bulgarian only** and should feel **clean, simple, professional, and trustworthy**. The primary conversion goal is to get visitors to **call the shop directly**.

## Goals

- Present the shop as a reliable local business in `гр. Ловеч`
- Make the two core services immediately clear
- Drive phone calls from mobile and desktop visitors
- Support local SEO for `ГТП Ловеч` and `автосервиз Ловеч`
- Keep the site small, easy to maintain, and fast

## Non-Goals

- Online booking
- Customer accounts
- Live chat
- Blog or news section
- Pricing calculator
- Large service directory with every possible repair type

## Recommended Product Shape

The approved direction is a **small 4-page marketing site**:

1. `Начало`
2. `ГТП`
3. `Ремонти`
4. `Контакти`

This structure balances clarity and local SEO without making the site feel heavy.

## Information Architecture

### `Начало`

Purpose:

- Introduce the business
- Establish trust
- Surface the two core services
- Push users toward calling

Content sections:

1. Hero with location-specific headline
2. Short summary of `ГТП` and repair services
3. `Защо да изберете нас` trust section with 3 concise points
4. Contact strip with phone, address, and working hours
5. Final CTA to call

### `ГТП`

Purpose:

- Serve local search intent for annual technical inspections
- Explain the service simply
- Encourage phone contact

Content sections:

1. Page hero with clear service title
2. Short explanation of what the service is
3. Plain-language process or what customers can expect
4. Call CTA

### `Ремонти`

Purpose:

- Show that the shop handles the most common repair needs
- Build confidence without overwhelming users

Content sections:

1. Page intro
2. Grouped repair categories such as diagnostics, brakes, suspension, oil/service, engine-related work, and general maintenance
3. Short descriptions written in accessible Bulgarian
4. Call CTA

### `Контакти`

Purpose:

- Make it easy to reach or visit the business
- Act as a practical action page, especially on mobile

Content sections:

1. Phone number
2. Address in `гр. Ловеч`
3. Working hours
4. Embedded map
5. Final call prompt

## Messaging And Tone

The site tone should be:

- Professional
- Reliable
- Straightforward
- Local

The writing should avoid hype, exaggerated sales language, and unnecessary technical jargon. Short Bulgarian sentences are preferred so the site is easy to scan on mobile.

Example direction for homepage messaging:

- Headline: `ГТП и автосервиз в Ловеч`
- Supporting copy: `Надежно обслужване, технически прегледи и ремонти за вашия автомобил.`
- Primary CTA: `Обадете се`

## Visual And UX Direction

### Visual Style

The visual style should feel calm and practical rather than flashy. The design should avoid dark aggressive garage aesthetics, heavy gradients, counters, sliders, or decorative animations.

Recommended visual rules:

- Light background
- Dark readable text
- Single accent color, preferably deep blue
- Large headings
- Short text blocks
- Clear button styling for call actions

### UX Rules

- Phone number visible in the header on every page
- Mobile-friendly tap-to-call actions throughout the site
- Consistent layout rhythm across all pages
- Every page should conclude with an easy next step to call
- Navigation should remain simple and obvious

### Trust Signals

The site should rely on realistic trust elements:

- Real photo of the shop or workspace
- Short `Защо да изберете нас` section
- Visible address and working hours
- Map on the contact page
- Optional review snippets later if available

## Architecture

The site should be implemented as a **small static marketing website**. The structure should separate shared business content from page-specific content so updates remain simple.

Suggested architecture boundaries:

- Shared site chrome: header, footer, navigation, repeated CTA block
- Shared business data: name, phone, address, hours
- Page content modules: homepage, `ГТП`, `Ремонти`, `Контакти`
- Shared SEO metadata helpers for titles and descriptions

This keeps the project modular and easy to maintain without introducing unnecessary systems.

## Components

Expected UI components:

- Header with navigation and phone CTA
- Footer with essential business info
- Hero section
- Service summary cards or blocks
- Trust points section
- CTA banner or contact block
- Contact details list
- Map embed container

Each component should have one clear responsibility and be reusable where practical, especially the CTA and business-info blocks.

## Content Model

The minimum content model for v1 is:

- Business name
- Phone number
- Address
- Working hours
- Homepage hero content
- Homepage trust points
- `ГТП` page description and process copy
- `Ремонти` page grouped service descriptions
- Contact page content

This can be managed as simple structured content in code for v1. A CMS is not needed yet.

## Data Flow

The data flow is intentionally simple:

1. Shared business information is defined once
2. Shared data is reused in header, footer, CTA blocks, and contact page
3. Page-specific content is rendered per route
4. Every page funnels the user toward the same action: calling the business

There is no user-generated content, account state, or transactional workflow in v1.

## SEO Strategy

Each page should target a clear local intent:

- `Начало`: `автосервиз Ловеч`, `ГТП Ловеч`
- `ГТП`: `годишен технически преглед Ловеч`
- `Ремонти`: `автосервиз ремонти Ловеч`
- `Контакти`: business discovery and contact intent

Minimum SEO requirements:

- Unique page title for each route
- Useful meta description for each route
- Proper heading structure
- Clean internal linking between pages
- Fast mobile-first loading

## Error Handling And Resilience

Even though the site is simple, it should degrade gracefully:

- If the map embed fails, phone, address, and hours must remain visible as text
- If an image is unavailable, the page must still read cleanly and remain trustworthy
- If optional review content is missing, the layout should still feel complete

The site should never depend on nonessential integrations for core conversion.

## Testing And Verification

Verification for v1 should focus on behavior that matters for a marketing site:

- All 4 pages exist and are reachable
- Navigation works correctly on desktop and mobile
- Phone links trigger `tel:` actions correctly
- Bulgarian copy displays correctly and remains easy to scan
- Header and CTA blocks show the phone number consistently
- Contact page shows address, hours, and map
- Each page has clear metadata for local SEO
- Layout remains clean on mobile screens

## Out Of Scope For This Spec

The following ideas may be added later, but are excluded from v1:

- Reviews section populated from external platforms
- Service pricing tables
- Multi-language support
- Booking flows
- Promotions or seasonal campaign landing pages

## Final Recommendation

Build a **BG-only, 4-page, phone-first local marketing site** for the car service shop in `гр. Ловеч`, with the clearest emphasis on:

1. `Годишен технически преглед`
2. General repairs
3. Strong trust signals
4. Fast access to phone contact

The final product should feel simple, credible, and easy for local visitors to use.
