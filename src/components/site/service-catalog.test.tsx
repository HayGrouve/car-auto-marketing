import { render, screen } from '@testing-library/react'
import { ServiceCatalog } from '#/components/site/service-catalog'

const flatServices = [
  { id: 'a', title: 'Service A', summary: 'Sum A', page: 'gaz' as const },
]

const grouped = [
  {
    id: 'g1',
    title: 'Group One',
    intro: 'Group intro',
    serviceIds: ['b'],
    services: [{ id: 'b', title: 'Service B', summary: 'Sum B', page: 'remonti' as const, groupId: 'g1' }],
  },
]

describe('ServiceCatalog', () => {
  it('renders flat heading and services', () => {
    render(<ServiceCatalog heading="Газови услуги" services={flatServices} variant="flat" />)
    expect(screen.getByRole('heading', { name: 'Газови услуги', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Service A', level: 3 })).toBeInTheDocument()
  })

  it('renders grouped sections with h2 per group', () => {
    render(<ServiceCatalog groups={grouped} variant="grouped" />)
    expect(screen.getByRole('heading', { name: 'Group One', level: 2 })).toBeInTheDocument()
    expect(screen.getByText('Group intro')).toBeInTheDocument()
  })
})
