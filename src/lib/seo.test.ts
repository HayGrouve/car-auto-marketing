import { describe, expect, it } from 'vitest'
import { buildSeoHead } from '#/lib/seo'

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
  })
})
