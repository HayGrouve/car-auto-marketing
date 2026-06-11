import { render, screen } from '@testing-library/react'
import { SiteHeader } from '#/components/site/site-header'
import { siteContent } from '#/data/site-content'

function expectNavLink(name: string, href: string) {
  const links = screen.getAllByRole('link', { name })
  expect(links.some((link) => link.getAttribute('href') === href)).toBe(true)
}

describe('SiteHeader', () => {
  it('renders the Bulgarian navigation and the main phone CTA', () => {
    render(<SiteHeader />)

    expectNavLink('Начало', '/')
    expectNavLink('ГТП', '/gtp')
    expectNavLink('Ремонти', '/remonti')
    expectNavLink('Контакти', '/kontakti')

    const phoneLinks = screen.getAllByRole('link', {
      name: siteContent.contact.phoneDisplay,
    })
    expect(
      phoneLinks.some(
        (link) => link.getAttribute('href') === siteContent.contact.phoneHref,
      ),
    ).toBe(true)
  })

  it('renders the viber link with the configured viber href', () => {
    render(<SiteHeader />)

    const viberLinks = screen.getAllByRole('link', {
      name: siteContent.contact.viberLabel,
    })
    expect(
      viberLinks.some(
        (link) => link.getAttribute('href') === siteContent.contact.viberHref,
      ),
    ).toBe(true)
  })
})
