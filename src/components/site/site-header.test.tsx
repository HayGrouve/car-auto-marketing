import { render, screen } from '@testing-library/react'
import { SiteHeader } from '#/components/site/site-header'
import { siteContent } from '#/data/site-content'
import { getDefaultContactLine } from '#/lib/contact-context'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

function expectNavLink(name: string, href: string) {
  const links = screen.getAllByRole('link', { name })
  expect(links.some((link) => link.getAttribute('href') === href)).toBe(true)
}

describe('SiteHeader', () => {
  it('renders the Bulgarian navigation and the main phone CTA', () => {
    render(<SiteHeader />)

    expectNavLink('Начало', '/')
    expectNavLink('ГТП', '/gtp')
    expectNavLink('Газови системи', '/gaz')
    expectNavLink('Ремонти', '/remonti')
    expectNavLink('Контакти', '/kontakti')

    const defaultLine = getDefaultContactLine()
    const phoneLinks = screen.getAllByRole('link', {
      name: defaultLine.phoneDisplay,
    })
    expect(
      phoneLinks.some((link) => link.getAttribute('href') === defaultLine.phoneHref),
    ).toBe(true)
  })

  it('renders the viber link with the configured viber href', () => {
    render(<SiteHeader />)

    const defaultLine = getDefaultContactLine()
    const viberLinks = screen.getAllByRole('link', {
      name: COMPACT_VIBER_LABEL,
    })
    expect(
      viberLinks.some((link) => link.getAttribute('href') === defaultLine.viberHref),
    ).toBe(true)
  })
})
