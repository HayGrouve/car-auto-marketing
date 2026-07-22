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
})
