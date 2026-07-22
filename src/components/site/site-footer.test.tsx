import { render, screen } from '@testing-library/react'
import { SiteFooter } from '#/components/site/site-footer'
import { siteContent } from '#/data/site-content'
import { getDefaultContactLine } from '#/lib/contact-context'

function expectFooterNavLink(name: string, href: string) {
  const footerNav = screen.getByRole('navigation', { name: 'Футър навигация' })
  const link = screen.getByRole('link', { name })
  expect(footerNav.contains(link)).toBe(true)
  expect(link).toHaveAttribute('href', href)
}

describe('SiteFooter', () => {
  it('renders brand, navigation, contact details, and copyright', () => {
    render(<SiteFooter />)

    expect(screen.getByText(siteContent.brandName)).toBeInTheDocument()
    expect(screen.getByText(siteContent.footer.tagline)).toBeInTheDocument()

    expectFooterNavLink('Начало', '/')
    expectFooterNavLink('ГТП', '/gtp')
    expectFooterNavLink('Ремонти', '/remonti')
    expectFooterNavLink('Контакти', '/kontakti')

    expect(
      screen.getByText((content, element) => {
        return (
          content === siteContent.footer.contactHeading &&
          element?.classList.contains('uppercase') === true
        )
      }),
    ).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.address)).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.hours[0])).toBeInTheDocument()
    expect(screen.queryByText(/Събота/)).not.toBeInTheDocument()

    const defaultLine = getDefaultContactLine()
    const phoneLink = screen.getByRole('link', { name: defaultLine.phoneDisplay })
    expect(phoneLink).toHaveAttribute('href', defaultLine.phoneHref)

    const viberLink = screen.getByRole('link', { name: 'Пишете ни във Viber' })
    expect(viberLink).toHaveAttribute('href', defaultLine.viberHref)

    const mapsLink = screen.getByRole('link', { name: 'Отвори в Google Maps' })
    expect(mapsLink).toHaveAttribute('href', siteContent.contact.mapsLink)
    expect(mapsLink).toHaveAttribute('target', '_blank')
    expect(mapsLink).toHaveAttribute('rel', 'noopener noreferrer')

    const year = new Date().getFullYear().toString()
    expect(screen.getByText(`© ${year} ${siteContent.brandName}`)).toBeInTheDocument()
  })
})
