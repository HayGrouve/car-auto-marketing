import { render, screen } from '@testing-library/react'
import { ServiceCatalog } from '#/components/site/service-catalog'

const flatServices = [
  { id: 'a', title: 'Service A', summary: 'Sum A', page: 'gaz' as const },
]

describe('ServiceCatalog', () => {
  it('renders flat heading and services', () => {
    render(<ServiceCatalog heading="Газови услуги" services={flatServices} variant="flat" />)
    expect(screen.getByRole('heading', { name: 'Газови услуги', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Service A', level: 3 })).toBeInTheDocument()
  })
})
