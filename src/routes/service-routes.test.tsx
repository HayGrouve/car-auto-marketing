import { render, screen } from '@testing-library/react'
import { siteContent } from '#/data/site-content'
import { resolveContactLine } from '#/lib/contact-context'
import { GtpPage } from '#/pages/gtp-page'
import { RemontiPage } from '#/pages/remonti-page'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

describe('service routes', () => {
  it('renders the GTP hero, sections, and contact links', () => {
    render(<GtpPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.gtp.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('Как протича прегледът')).toBeInTheDocument()

    const gtpLine = resolveContactLine('gtp')
    expect(
      screen.getAllByRole('link', { name: gtpLine.phoneDisplay })[0],
    ).toHaveAttribute('href', gtpLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', gtpLine.viberHref)
  })

  it('renders the repairs hero, sections, and contact links', () => {
    render(<RemontiPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.remonti.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText('Диагностика и обслужване')).toBeInTheDocument()
    expect(screen.getByText('Спирачна система и ходова част')).toBeInTheDocument()

    const serviceLine = resolveContactLine('remonti')
    expect(
      screen.getAllByRole('link', { name: serviceLine.phoneDisplay })[0],
    ).toHaveAttribute('href', serviceLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', serviceLine.viberHref)
  })
})
