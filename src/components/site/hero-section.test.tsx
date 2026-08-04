import { render, screen } from '@testing-library/react'
import { HeroSection } from '#/components/site/hero-section'
import { siteContent } from '#/data/site-content'
import { resolveContactLine } from '#/lib/contact-surface'

describe('HeroSection', () => {
  it('renders hero title and default primary CTA', () => {
    const hero = siteContent.pages.home.hero

    render(<HeroSection content={hero} />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(hero.title)
    const line = resolveContactLine('default')
    expect(screen.getByRole('link', { name: hero.primaryCtaLabel })).toHaveAttribute(
      'href',
      line.phoneHref,
    )
  })

  it('uses gtp inspections phone when contactContext is gtp', () => {
    const hero = siteContent.pages.gtp.hero

    render(<HeroSection contactContext="gtp" content={hero} />)

    const line = resolveContactLine('gtp')
    expect(screen.getByRole('link', { name: hero.primaryCtaLabel })).toHaveAttribute(
      'href',
      line.phoneHref,
    )
  })
})
