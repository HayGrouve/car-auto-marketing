import { render } from '@testing-library/react'
import { StatIconGlyph } from '#/components/site/stat-icon'

describe('StatIconGlyph', () => {
  it('renders the clipboard icon for gtp stats', () => {
    const { container } = render(<StatIconGlyph icon="clipboard-check" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })
})
