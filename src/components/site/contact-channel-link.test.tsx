import { render, screen } from '@testing-library/react'
import { ContactChannelLink } from '#/components/site/contact-channel-link'
import { siteContent } from '#/data/site-content'

describe('ContactChannelLink', () => {
  it('renders phone link with tel href', () => {
    render(<ContactChannelLink channel="phone" variant="solid" />)
    const link = screen.getByRole('link', { name: siteContent.contact.phoneDisplay })
    expect(link).toHaveAttribute('href', siteContent.contact.phoneHref)
  })

  it('renders viber link with viber href', () => {
    render(<ContactChannelLink channel="viber" variant="outline" />)
    const link = screen.getByRole('link', { name: siteContent.contact.viberLabel })
    expect(link).toHaveAttribute('href', siteContent.contact.viberHref)
  })
})
