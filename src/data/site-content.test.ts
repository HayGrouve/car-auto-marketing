import { describe, expect, it } from 'vitest'
import { buildViberHref } from '#/lib/contact-links'
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

  it('exposes phone and viber contact channels from the same number', () => {
    expect(siteContent.contact.phoneHref).toMatch(/^tel:/)
    expect(siteContent.contact.viberHref).toBe(
      buildViberHref(siteContent.contact.phoneE164),
    )
    expect(siteContent.contact.viberLabel).toContain('Viber')
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
