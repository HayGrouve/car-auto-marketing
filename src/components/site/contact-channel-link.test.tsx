import { render, screen } from '@testing-library/react'
import { ContactChannelLink } from '#/components/site/contact-channel-link'
import { resolveContactLine } from '#/lib/contact-surface'

const COMPACT_VIBER_LABEL = 'Пишете ни във Viber'

describe('ContactChannelLink', () => {
  it('renders default service phone link with tel href', () => {
    render(<ContactChannelLink channel="phone" variant="solid" />)
    const line = resolveContactLine('default')
    const link = screen.getByRole('link', { name: line.phoneDisplay })
    expect(link).toHaveAttribute('href', line.phoneHref)
  })

  it('renders gtp inspections phone when context is gtp', () => {
    render(<ContactChannelLink channel="phone" context="gtp" variant="solid" />)
    const line = resolveContactLine('gtp')
    const link = screen.getByRole('link', { name: line.phoneDisplay })
    expect(link).toHaveAttribute('href', 'tel:+359876105674')
  })

  it('renders compact viber label with context-aware href', () => {
    render(<ContactChannelLink channel="viber" context="gtp" variant="outline" />)
    const line = resolveContactLine('gtp')
    const link = screen.getByRole('link', { name: COMPACT_VIBER_LABEL })
    expect(link).toHaveAttribute('href', line.viberHref)
  })
})
