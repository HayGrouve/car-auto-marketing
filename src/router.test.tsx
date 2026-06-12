import { act } from 'react'
import { render, screen } from '@testing-library/react'
import { createMemoryHistory } from '@tanstack/history'
import { RouterProvider } from '@tanstack/react-router'
import { siteContent } from '#/data/site-content'
import { getRouter } from '#/router'

describe('app startup router', () => {
  it('renders the requested route through the root shell', async () => {
    const router = getRouter({
      history: createMemoryHistory({ initialEntries: ['/kontakti'] }),
    })

    await act(async () => {
      render(<RouterProvider router={router} />)
    })

    expect(
      await screen.findByRole('heading', {
        name: siteContent.pages.kontakti.hero.title,
      }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Основна навигация' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Към съдържанието' }),
    ).toHaveAttribute('href', '#main-content')
    expect(document.getElementById('main-content')).toBeInTheDocument()
  })
})
