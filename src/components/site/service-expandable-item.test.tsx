import { render, screen } from '@testing-library/react'
import { ServiceExpandableItem } from '#/components/site/service-expandable-item'

describe('ServiceExpandableItem', () => {
  it('renders title and summary without expand when details omitted', () => {
    render(
      <ServiceExpandableItem
        service={{ id: 'x', title: 'Title X', summary: 'Summary X', page: 'gaz' }}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Title X' })).toBeInTheDocument()
    expect(screen.getByText('Summary X')).toBeInTheDocument()
    expect(screen.queryByText('Повече информация')).not.toBeInTheDocument()
  })

  it('renders details expand with paragraphs split on blank lines', () => {
    render(
      <ServiceExpandableItem
        service={{
          id: 'y',
          title: 'Title Y',
          summary: 'Summary Y',
          page: 'gaz',
          details: 'Para one.\n\n· Bullet line',
        }}
      />,
    )
    expect(screen.getByText('Повече информация')).toBeInTheDocument()
    expect(screen.getByText('Para one.')).toBeInTheDocument()
    expect(screen.getByText('· Bullet line')).toBeInTheDocument()
  })

  it('renders h2 with split-section title classes when titleAs is h2', () => {
    render(
      <ServiceExpandableItem
        service={{ id: 'z', title: 'Title Z', summary: 'Summary Z', page: 'gaz' }}
        titleAs="h2"
      />,
    )
    const heading = screen.getByRole('heading', { name: 'Title Z', level: 2 })
    expect(heading).toHaveAttribute('id', 'service-z')
    expect(heading.className).toContain('text-3xl')
    expect(heading.className).toContain('font-extrabold')
    expect(heading.className).toContain('md:text-4xl')
  })

  it('hides expand UI when showDetails is false', () => {
    render(
      <ServiceExpandableItem
        service={{
          id: 'w',
          title: 'Title W',
          summary: 'Summary W',
          page: 'gaz',
          details: 'Hidden detail.',
        }}
        showDetails={false}
      />,
    )
    expect(screen.queryByText('Повече информация')).not.toBeInTheDocument()
    expect(screen.queryByText('Hidden detail.')).not.toBeInTheDocument()
  })
})
