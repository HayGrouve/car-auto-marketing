import { render, screen } from '@testing-library/react'
import { siteContent } from '#/data/site-content'
import { resolveContactLine } from '#/lib/contact-context'
import { GazPage } from '#/pages/gaz-page'
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

  it('renders the gaz page with gas contact line', () => {
    render(<GazPage />)
    const gasLine = resolveContactLine('gas')
    expect(
      screen.getByRole('heading', { name: siteContent.pages.gaz.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Газови услуги' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: gasLine.phoneDisplay })[0]).toHaveAttribute(
      'href',
      gasLine.phoneHref,
    )
  })

  it('renders the repairs hero, grouped catalog, and contact links', () => {
    render(<RemontiPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.remonti.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Диагностика и поддръжка' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Спирачки и комфорт' })).toBeInTheDocument()
    expect(screen.queryByText('Диагностика и обслужване')).not.toBeInTheDocument()

    const serviceLine = resolveContactLine('remonti')
    expect(
      screen.getAllByRole('link', { name: serviceLine.phoneDisplay })[0],
    ).toHaveAttribute('href', serviceLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', serviceLine.viberHref)
  })
})
