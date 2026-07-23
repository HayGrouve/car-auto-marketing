import { render, screen } from '@testing-library/react'
import { CatalogSplitSection } from '#/components/site/catalog-split-section'

const service = {
  id: 'agu-montazh-remont',
  title: 'Gas Service Title',
  summary: 'Gas summary text',
  details: 'Detail paragraph one.',
  page: 'gaz' as const,
}

const group = {
  id: 'diagnostics-maintenance',
  title: 'Group Title',
  intro: 'Group intro paragraph',
  serviceIds: ['svc-a', 'svc-b'],
  services: [
    { id: 'svc-a', title: 'Service A', summary: 'Sum A', page: 'remonti' as const, groupId: 'diagnostics-maintenance' },
    { id: 'svc-b', title: 'Service B', summary: 'Sum B', page: 'remonti' as const, groupId: 'diagnostics-maintenance' },
  ],
}

describe('CatalogSplitSection', () => {
  it('renders service variant with ul wrapper, h2 title, summary, expand, number, and image alt', () => {
    const { container } = render(
      <CatalogSplitSection
        image="/images/repairs-section.png"
        imageAlt="Gas alt text"
        number="01"
        service={service}
        variant="service"
      />,
    )

    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-labelledby', 'service-agu-montazh-remont')
    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gas Service Title', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Gas summary text')).toBeInTheDocument()
    expect(screen.getByText('Повече информация')).toBeInTheDocument()
    expect(container.querySelector('ul.space-y-8')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Gas alt text' })).toHaveAttribute(
      'src',
      '/images/repairs-section.png',
    )
  })

  it('renders group variant with h2, max-w-prose intro, all services as h3, and aria-labelledby', () => {
    const { container } = render(
      <CatalogSplitSection
        group={group}
        image="/images/repairs-section.png"
        imageAlt="Repairs alt text"
        number="02"
        variant="group"
      />,
    )

    const section = container.querySelector('section')
    expect(section).toHaveAttribute('aria-labelledby', 'group-diagnostics-maintenance')
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Group Title', level: 2 })).toHaveAttribute(
      'id',
      'group-diagnostics-maintenance',
    )
    const intro = screen.getByText('Group intro paragraph')
    expect(intro.className).toContain('max-w-prose')
    expect(screen.getByRole('heading', { name: 'Service A', level: 3 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Service B', level: 3 })).toBeInTheDocument()
    expect(container.querySelector('ul.mt-8.space-y-8')).toBeInTheDocument()
  })

  it('applies muted background and reverse grid order classes', () => {
    const { container } = render(
      <CatalogSplitSection
        image="/images/repairs-section.png"
        imageAlt="Alt"
        mutedBackground
        reverse
        service={service}
        variant="service"
      />,
    )

    expect(container.querySelector('section')?.className).toContain('bg-[#fafafa]')
    expect(container.querySelector('.grid')?.className).toContain('[&>*:first-child]:md:order-2')
  })
})
