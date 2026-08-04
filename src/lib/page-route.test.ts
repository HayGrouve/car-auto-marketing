import { describe, expect, it } from 'vitest'
import siteDefaults from '../../site.defaults.json'
import { pageRegistry } from '#/data/site-content'
import { pageRouteHead, publicPaths } from '#/lib/page-route'

describe('pageRouteHead', () => {
  it('derives SEO from the page registry', () => {
    const seo = pageRouteHead('/gaz')
    expect(seo.title).toBe('Газови системи | Stefi Auto Gas')
    expect(seo.canonical).toBe('https://stefi-gas.com/gaz')
  })

  it('covers every registry path', () => {
    for (const path of publicPaths) {
      expect(pageRouteHead(path).canonical).toContain(
        path === '/' ? 'https://stefi-gas.com' : path,
      )
    }
  })
})

describe('publicPaths sync', () => {
  it('matches site.defaults.json publicPaths', () => {
    const registryPaths = Object.keys(pageRegistry).sort()
    const defaultsPaths = [...siteDefaults.publicPaths].sort()
    expect(registryPaths).toEqual(defaultsPaths)
  })
})
