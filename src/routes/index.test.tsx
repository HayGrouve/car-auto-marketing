import { render, screen } from '@testing-library/react'
import { siteContent } from '#/data/site-content'
import { HomePage } from '#/pages/home-page'

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
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.phoneDisplay })[0],
    ).toHaveAttribute('href', siteContent.contact.phoneHref)
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.viberLabel })[0],
    ).toHaveAttribute('href', siteContent.contact.viberHref)
  })
})
