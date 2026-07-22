import { describe, expect, it } from 'vitest'
import { buildPhoneHref, buildViberHref } from '#/lib/contact-links'
import { siteContent } from '#/data/site-content'

describe('siteContent', () => {
  it('locks the site to Bulgarian Lovech marketing content and four public routes', () => {
    expect(siteContent.locale).toBe('bg-BG')
    expect(siteContent.city).toBe('Ловеч')
    expect(siteContent.navigation.map((item) => item.to)).toEqual([
      '/',
      '/gtp',
      '/remonti',
      '/kontakti',
    ])
    expect(siteContent.home.hero.title).toContain('Ловеч')
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
    expect(siteContent.pages.remonti.sections.length).toBeGreaterThanOrEqual(2)
    expect(siteContent.pages.kontakti.sections.length).toBeGreaterThanOrEqual(1)
  })

  it('assigns a lucide icon key to every home stat', () => {
    const icons = siteContent.pages.home.stats.map((stat) => stat.icon)
    expect(icons).toEqual(['clipboard-check', 'calendar-days', 'map-pin'])
  })

  it('exposes footer tagline and contact heading', () => {
    expect(siteContent.footer.tagline).toContain('Ловеч')
    expect(siteContent.footer.contactHeading).toBe('Адрес')
  })
})
