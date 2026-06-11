import { render, screen } from '@testing-library/react'
import { siteContent } from '#/data/site-content'
import { KontaktiPage } from '#/pages/kontakti-page'

describe('KontaktiPage', () => {
  it('renders hero, contact details, phone and viber links, and the map iframe', () => {
    render(<KontaktiPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.kontakti.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.address)).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.hours[0])).toBeInTheDocument()
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.phoneDisplay })[0],
    ).toHaveAttribute('href', siteContent.contact.phoneHref)
    expect(
      screen.getAllByRole('link', { name: siteContent.contact.viberLabel })[0],
    ).toHaveAttribute('href', siteContent.contact.viberHref)
    expect(screen.getByTitle('Карта до сервиза')).toBeInTheDocument()
  })
})
