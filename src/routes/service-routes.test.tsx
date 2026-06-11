import { render, screen } from '@testing-library/react'
import { siteContent } from '#/data/site-content'
import { GtpPage } from '#/pages/gtp-page'
import { RemontiPage } from '#/pages/remonti-page'

describe('service routes', () => {
  it('renders the GTP hero, sections, and contact links', () => {
    render(<GtpPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.gtp.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('Как протича прегледът')).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.phoneDisplay })[0],
    ).toHaveAttribute('href', siteContent.contact.phoneHref)
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.viberLabel })[0],
    ).toHaveAttribute('href', siteContent.contact.viberHref)
  })

  it('renders the repairs hero, sections, and contact links', () => {
    render(<RemontiPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.remonti.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('Диагностика и обслужване')).toBeInTheDocument()
    expect(screen.getByText('Спирачна система и ходова част')).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.phoneDisplay })[0],
    ).toHaveAttribute('href', siteContent.contact.phoneHref)
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.viberLabel })[0],
    ).toHaveAttribute('href', siteContent.contact.viberHref)
  })
})
