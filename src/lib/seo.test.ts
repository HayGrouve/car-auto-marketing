import { describe, expect, it } from 'vitest'
import { siteContent } from '#/data/site-content'
import { getDefaultContactLine } from '#/lib/contact-surface'
import { buildLocalBusinessJsonLd, buildSeoHead } from '#/lib/seo'

describe('buildSeoHead', () => {
  it('builds a Bulgarian page title, canonical url, and Open Graph locale', () => {
    const seo = buildSeoHead({
      title: 'ГТП',
      description: 'Годишен технически преглед в Ловеч.',
      path: '/gtp',
    })

    expect(seo.title).toBe('ГТП | Stefi Auto Gas')
    expect(seo.canonical).toBe('https://stefi-gas.com/gtp')
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
          item.content.includes('/images/hero.jpg'),
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
    const defaultLine = getDefaultContactLine()

    expect(jsonLd).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'AutoRepair',
      name: 'Stefi Auto Gas',
      telephone: defaultLine.phoneE164,
      openingHours: ['Mo-Fr 09:00-18:00'],
    })
    expect(jsonLd.contactPoint).toHaveLength(3)
    expect(jsonLd.contactPoint[0]).toMatchObject({
      '@type': 'ContactPoint',
      telephone: '+359876689736',
      contactType: 'customer service',
      description: 'Сервиз',
    })
    expect(jsonLd.image).toContain('/images/hero.jpg')
    expect(jsonLd.address).toMatchObject({
      '@type': 'PostalAddress',
      streetAddress: siteContent.contact.address,
      addressLocality: siteContent.city,
      addressCountry: 'BG',
    })
    expect(jsonLd.url).toBe(siteContent.siteUrl)
  })
})

describe('siteContent seo entries', () => {
  it('includes gaz page seo and gas mention on home', () => {
    expect(siteContent.seo.gaz.title).toBe('Газови системи')
    expect(siteContent.seo.home.description).toContain('газови системи')
  })
})
