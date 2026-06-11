import { createElement } from 'react'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true,
})

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual = await importOriginal()

  return {
    ...(actual as object),
    Link: ({
      children,
      to,
      ...props
    }: AnchorHTMLAttributes<HTMLAnchorElement> & {
      children?: ReactNode
      to?: string
    }) => createElement('a', { href: to ?? '#', ...props }, children),
  }
})
