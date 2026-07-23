import { render, screen } from '@testing-library/react'
import { servicesCatalog } from '#/data/services-catalog'
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
    expect(
      screen.getByRole('heading', {
        name: 'Годишен технически преглед — подробности',
        level: 2,
      }),
    ).toBeInTheDocument()

    const gtpLine = resolveContactLine('gtp')
    expect(
      screen.getAllByRole('link', { name: gtpLine.phoneDisplay })[0],
    ).toHaveAttribute('href', gtpLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', gtpLine.viberHref)
  })

  it('renders the gaz page with split rows, section numbers, and gas contact line', () => {
    render(<GazPage />)
    const gasLine = resolveContactLine('gas')
    const gazServices = servicesCatalog.filter((service) => service.page === 'gaz')

    expect(
      screen.getByRole('heading', { name: siteContent.pages.gaz.hero.title }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Газови услуги' })).not.toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()

    for (const service of gazServices) {
      expect(
        screen.getByRole('heading', { name: service.title, level: 2 }),
      ).toBeInTheDocument()
    }

    expect(screen.getAllByRole('link', { name: gasLine.phoneDisplay })[0]).toHaveAttribute(
      'href',
      gasLine.phoneHref,
    )
  })

  it('renders the repairs hero, group split rows, all services, and contact links', () => {
    render(<RemontiPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.remonti.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Диагностика и поддръжка', level: 2 })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Двигател, ходова част и управление', level: 2 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Спирачки и комфорт', level: 2 })).toBeInTheDocument()
    expect(screen.queryByText('Диагностика и обслужване')).not.toBeInTheDocument()
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()

    const remontiServices = servicesCatalog.filter((service) => service.page === 'remonti')
    expect(remontiServices).toHaveLength(11)
    for (const service of remontiServices) {
      expect(
        screen.getByRole('heading', { name: service.title, level: 3 }),
      ).toBeInTheDocument()
    }

    const serviceLine = resolveContactLine('remonti')
    expect(
      screen.getAllByRole('link', { name: serviceLine.phoneDisplay })[0],
    ).toHaveAttribute('href', serviceLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', serviceLine.viberHref)
  })
})
