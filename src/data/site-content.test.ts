import { describe, expect, it } from 'vitest'
import { servicesCatalog, remontiGroups } from '#/data/services-catalog'
import { buildPhoneHref, buildViberHref } from '#/lib/contact-hrefs'
import { siteContent } from '#/data/site-content'

describe('siteContent', () => {
  it('locks the site to Bulgarian Lovech marketing content and five public routes', () => {
    expect(siteContent.locale).toBe('bg-BG')
    expect(siteContent.city).toBe('Ловеч')
    expect(siteContent.navigation.map((item) => item.to)).toEqual([
      '/',
      '/gtp',
      '/gaz',
      '/remonti',
      '/kontakti',
    ])
    expect(siteContent.home.hero.title).toContain('Ловеч')
  })

  it('exposes five public routes including gaz', () => {
    expect(siteContent.navigation.map((item) => item.to)).toEqual([
      '/',
      '/gtp',
      '/gaz',
      '/remonti',
      '/kontakti',
    ])
  })

  it('defines fifteen services with correct page counts', () => {
    expect(servicesCatalog).toHaveLength(15)
    expect(servicesCatalog.filter((s) => s.page === 'gaz')).toHaveLength(3)
    expect(servicesCatalog.filter((s) => s.page === 'gtp')).toHaveLength(1)
    expect(servicesCatalog.filter((s) => s.page === 'remonti')).toHaveLength(11)
    expect(remontiGroups).toHaveLength(3)
  })

  it('uses fuel stat instead of map-pin on home', () => {
    expect(siteContent.pages.home.stats[2]).toMatchObject({
      value: 'LPG/CNG',
      label: 'Монтаж и сервиз на газ',
      icon: 'fuel',
    })
  })

  it('does not export homeTrustPoints', () => {
    expect('homeTrustPoints' in siteContent.home).toBe(false)
    expect('trustPoints' in siteContent.home).toBe(false)
  })

  it('defines three contact lines with real Stefi Auto Gas numbers', () => {
    expect(siteContent.contact.lines).toHaveLength(3)
    expect(siteContent.contact.defaultLineId).toBe('service')

    const service = siteContent.contact.lines.find((line) => line.id === 'service')
    expect(service).toMatchObject({
      phoneE164: '+359876689736',
      phoneDisplay: '0876 689 736',
      label: 'Сервиз',
      viberLabel: 'Viber — Сервиз',
    })
    expect(service?.phoneHref).toBe(buildPhoneHref('+359876689736'))
    expect(service?.viberHref).toBe(buildViberHref('+359876689736'))
  })

  it('uses Mon-Fri hours only and Stefi Auto Gas brand', () => {
    expect(siteContent.brandName).toBe('Stefi Auto Gas')
    expect(siteContent.contact.hours).toEqual(['Понеделник - Петък: 9:00 - 18:00'])
    expect(siteContent.contact.schemaOpeningHours).toEqual(['Mo-Fr 09:00-18:00'])
    expect(siteContent.contact.address).toBe('гр. Ловеч, бул. Освобождение 7')
  })

  it('provides hero and split sections for every public page', () => {
    expect(siteContent.pages.home.hero.title.length).toBeGreaterThan(0)
    expect(siteContent.pages.home.sections.length).toBeGreaterThanOrEqual(2)
    expect(siteContent.pages.home.stats.length).toBe(3)
    expect(siteContent.pages.gtp.sections.length).toBeGreaterThanOrEqual(2)
    expect(siteContent.pages.remonti.sections.length).toBe(0)
    expect(siteContent.pages.kontakti.sections.length).toBeGreaterThanOrEqual(1)
  })

  it('assigns a lucide icon key to every home stat', () => {
    const icons = siteContent.pages.home.stats.map((stat) => stat.icon)
    expect(icons).toEqual(['clipboard-check', 'calendar-days', 'fuel'])
  })

  it('exposes footer tagline and contact heading', () => {
    expect(siteContent.footer.tagline).toContain('Ловеч')
    expect(siteContent.footer.contactHeading).toBe('Адрес')
  })

  it('loads catalog split image maps without throwing', async () => {
    await expect(import('#/data/catalog-split-images')).resolves.toBeDefined()
  })
})
