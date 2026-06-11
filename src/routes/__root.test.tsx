import { render, screen } from '@testing-library/react'
import { Route } from '#/routes/__root'

describe('root route', () => {
  it('defines a branded not found component', () => {
    const NotFoundComponent = Route.options.notFoundComponent

    expect(NotFoundComponent).toBeTypeOf('function')

    if (!NotFoundComponent) {
      return
    }

    render(<NotFoundComponent />)

    expect(
      screen.getByRole('heading', { name: 'Страницата не е намерена' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Контакти' })).toHaveAttribute(
      'href',
      '/kontakti',
    )
  })
})
