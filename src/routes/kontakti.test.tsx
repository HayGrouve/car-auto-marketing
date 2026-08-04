import { render, screen } from '@testing-library/react'
import { siteContent } from '#/data/site-content'
import { getAllContactLines } from '#/lib/contact-surface'
import { KontaktiPage } from '#/pages/kontakti-page'

describe('KontaktiPage', () => {
  it('renders hero, all three contact lines, and the map iframe', () => {
    render(<KontaktiPage />)

    expect(
      screen.getByRole('heading', { name: siteContent.pages.kontakti.hero.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.address)).toBeInTheDocument()
    expect(screen.getByText(siteContent.contact.hours[0])).toBeInTheDocument()

    const lines = getAllContactLines()
    expect(lines).toHaveLength(3)

    for (const line of lines) {
      expect(
        screen.getByRole('link', { name: `${line.label}: ${line.phoneDisplay}` }),
      ).toHaveAttribute('href', line.phoneHref)
      expect(screen.getByRole('link', { name: line.viberLabel })).toHaveAttribute(
        'href',
        line.viberHref,
      )
    }

    expect(screen.getByTitle('Карта до сервиза')).toBeInTheDocument()

    const mapsLink = screen.getByRole('link', { name: 'Отвори в Google Maps' })
    expect(mapsLink).toHaveAttribute('href', siteContent.contact.mapsLink)
    expect(mapsLink).toHaveAttribute('target', '_blank')
    expect(mapsLink).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
