import { describe, expect, it } from 'vitest'
import { siteContent } from '#/data/site-content'
import { buildLocalBusinessJsonLd, buildSeoHead } from '#/lib/seo'

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
    expect(
      seo.meta.some(
        (item) =>
          'property' in item &&
          item.property === 'og:image' &&
          item.content.includes('/images/lovech-service-shop.png'),
      ),
    ).toBe(true)
    expect(
      seo.meta.some(
        (item) =>
          'name' in item &&
          item.name === 'twitter:card' &&
          item.content === 'summary_large_image',
      ),
    ).toBe(true)
    expect(
      seo.meta.some((item) => 'name' in item && item.name === 'twitter:image'),
    ).toBe(true)
  })
})

describe('buildLocalBusinessJsonLd', () => {
  it('builds AutoRepair schema with contact and opening hours', () => {
    const jsonLd = buildLocalBusinessJsonLd()

    expect(jsonLd).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'AutoRepair',
      name: siteContent.brandName,
      telephone: siteContent.contact.phoneE164,
      url: siteContent.siteUrl,
      openingHours: siteContent.contact.schemaOpeningHours,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteContent.contact.address,
        addressLocality: siteContent.city,
        addressCountry: 'BG',
      },
    })
    expect(jsonLd.image).toContain('/images/lovech-service-shop.png')
  })
})
