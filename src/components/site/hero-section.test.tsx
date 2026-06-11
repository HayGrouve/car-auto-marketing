import { render, screen } from '@testing-library/react'
import { HeroSection } from '#/components/site/hero-section'
import { siteContent } from '#/data/site-content'

describe('HeroSection', () => {
  it('renders hero title and primary CTA', () => {
    const hero = siteContent.pages.home.hero

    render(<HeroSection content={hero} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(hero.title)
    expect(
      screen.getByRole('link', { name: hero.primaryCtaLabel }),
    ).toHaveAttribute('href', siteContent.contact.phoneHref)
  })
})
