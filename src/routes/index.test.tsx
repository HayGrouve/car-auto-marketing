import { render, screen } from '@testing-library/react'
import { siteContent } from '#/data/site-content'
import { getDefaultContactLine } from '#/lib/contact-context'
import { HomePage } from '#/pages/home-page'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

describe('HomePage', () => {
  it('shows the hero, service sections, stats, and contact links', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.home.hero.title }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Годишен технически преглед' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ремонти и поддръжка' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Защо да изберете нас' })).toBeInTheDocument()
    expect(screen.getByText('ГТП')).toBeInTheDocument()

    const defaultLine = getDefaultContactLine()
    expect(
      screen.getAllByRole('link', { name: defaultLine.phoneDisplay })[0],
    ).toHaveAttribute('href', defaultLine.phoneHref)
    expect(
      screen.getAllByRole('link', { name: COMPACT_VIBER_LABEL })[0],
    ).toHaveAttribute('href', defaultLine.viberHref)
  })
})
